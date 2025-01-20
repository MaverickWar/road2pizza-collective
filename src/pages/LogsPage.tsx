import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LogsTable from "@/components/admin/analytics/LogsTable";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCards from "@/components/admin/analytics/StatsCards";
import { toast } from "sonner";

type MetadataType = {
  message?: string;
  severity?: string;
  status?: string;
  url?: string;
  user_id?: string;
  errorType?: string;
  stack?: string;
};

const LogsPage = () => {
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ["analytics-logs"],
    queryFn: async () => {
      console.log("Fetching analytics logs...");
      try {
        // First try to check if we can connect to Supabase
        const { data: healthCheck, error: healthError } = await supabase
          .from("analytics_metrics")
          .select("count(*)", { count: 'exact' });

        if (healthError) {
          console.error("Health check failed:", healthError);
          throw new Error(`Connection check failed: ${healthError.message}`);
        }

        console.log("Health check passed, proceeding with full query");

        // Now proceed with the actual data fetch
        const { data, error } = await supabase
          .from("analytics_metrics")
          .select("*")
          .order("timestamp", { ascending: false })
          .limit(500);

        if (error) {
          console.error("Error fetching logs:", error);
          throw error;
        }

        console.log("Successfully fetched logs:", { count: data?.length });

        return data?.map(log => {
          const metadata = log.metadata as MetadataType;
          return {
            id: log.id,
            type: log.metric_name,
            message: metadata?.message || "No message provided",
            severity: metadata?.severity || "low",
            status: metadata?.status || "open",
            created_at: log.timestamp,
            url: metadata?.url,
            user_id: metadata?.user_id,
            http_status: log.http_status,
            response_time: log.response_time,
            endpoint: log.endpoint_path,
            error_details: metadata?.stack,
          };
        }) || [];
      } catch (error: any) {
        console.error("Failed to fetch analytics data:", error);
        toast.error("Failed to load analytics data. Please try again.");
        throw error;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  if (error) {
    console.error("Error in LogsPage:", error);
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load logs. Please check your connection and try again.
            {error instanceof Error ? ` Error: ${error.message}` : ''}
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
          <div className="text-sm text-gray-500">
            Auto-refreshes every 5 seconds
          </div>
        </div>

        <StatsCards stats={{
          totalErrors: 0,
          resolvedIssues: 0,
          activeAlerts: 0,
          avgResponseTime: 0
        }} />
      </div>
    );
  }

  const getMetricsByType = (type: string | string[]) => {
    if (!logs) return [];
    if (Array.isArray(type)) {
      return logs.filter(log => type.some(t => log.type.includes(t)));
    }
    return logs.filter(log => log.type.includes(type));
  };

  const calculateStats = () => {
    if (!logs) return {
      totalErrors: 0,
      resolvedIssues: 0,
      activeAlerts: 0,
      avgResponseTime: 0
    };

    const errors = logs.filter(log => 
      log.type.includes('error') || 
      log.severity === 'high' || 
      log.severity === 'critical'
    );

    const resolvedIssues = logs.filter(log => log.status === 'success' || log.status === 'resolved');
    const activeAlerts = errors.filter(log => log.status === 'open' || log.status === 'investigating');
    
    const validResponseTimes = logs.filter(log => log.response_time != null);
    const avgResponseTime = validResponseTimes.length > 0
      ? validResponseTimes.reduce((acc, log) => acc + (log.response_time || 0), 0) / validResponseTimes.length
      : 0;

    return {
      totalErrors: errors.length,
      resolvedIssues: resolvedIssues.length,
      activeAlerts: activeAlerts.length,
      avgResponseTime: Math.round(avgResponseTime)
    };
  };

  console.log("Rendering StatsCards with stats:", calculateStats());

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
        <div className="text-sm text-gray-500">
          Auto-refreshes every 5 seconds
        </div>
      </div>

      <div className="mb-6">
        <StatsCards stats={calculateStats()} />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Logs</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="runtime">Runtime</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <LogsTable logs={logs || []} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="errors">
          <LogsTable 
            logs={getMetricsByType([
              'error',
              'error_runtime',
              'error_unhandled_rejection',
              'api_error',
              'network_error'
            ])} 
            isLoading={isLoading} 
          />
        </TabsContent>

        <TabsContent value="performance">
          <LogsTable 
            logs={getMetricsByType(['performance', 'api_request'])} 
            isLoading={isLoading} 
          />
        </TabsContent>

        <TabsContent value="network">
          <LogsTable 
            logs={getMetricsByType(['network', 'api_request', 'network_error'])} 
            isLoading={isLoading} 
          />
        </TabsContent>

        <TabsContent value="runtime">
          <LogsTable 
            logs={getMetricsByType(['error_runtime', 'error_unhandled_rejection'])} 
            isLoading={isLoading} 
          />
        </TabsContent>

        <TabsContent value="auth">
          <LogsTable 
            logs={getMetricsByType('auth')} 
            isLoading={isLoading} 
          />
        </TabsContent>

        <TabsContent value="api">
          <LogsTable 
            logs={getMetricsByType(['api_request', 'api_error'])} 
            isLoading={isLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogsPage;