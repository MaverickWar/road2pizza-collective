import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LogsTable from "@/components/admin/analytics/LogsTable";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      const { data, error } = await supabase
        .from("analytics_metrics")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(500); // Increased limit to show more logs

      if (error) {
        console.error("Error fetching logs:", error);
        throw error;
      }

      console.log("Fetched logs:", data);
      return data.map(log => {
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
      });
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load logs: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  const getMetricsByType = (type: string) => {
    return logs?.filter(log => log.type.includes(type)) || [];
  };

  const calculateAverageResponseTime = () => {
    if (!logs || logs.length === 0) return 0;
    const validTimes = logs.filter(log => log.response_time != null);
    if (validTimes.length === 0) return 0;
    return validTimes.reduce((acc, log) => acc + (log.response_time || 0), 0) / validTimes.length;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
        <div className="text-sm text-gray-500">
          Auto-refreshes every 5 seconds
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getMetricsByType('error').length}
            </div>
            <p className="text-sm text-gray-500">Last 500 requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateAverageResponseTime().toFixed(0)}ms
            </div>
            <p className="text-sm text-gray-500">Across all requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs?.filter(log => log.status === 'open' && (log.severity === 'high' || log.severity === 'critical')).length || 0}
            </div>
            <p className="text-sm text-gray-500">High/Critical severity</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Logs</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <LogsTable logs={logs || []} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="errors">
          <LogsTable 
            logs={logs?.filter(log => 
              log.type.includes('error') || 
              log.severity === 'high' || 
              log.severity === 'critical'
            ) || []} 
            isLoading={isLoading} 
          />
        </TabsContent>

        <TabsContent value="performance">
          <LogsTable 
            logs={logs?.filter(log => 
              log.type.includes('performance') || 
              log.response_time > 1000
            ) || []} 
            isLoading={isLoading} 
          />
        </TabsContent>

        <TabsContent value="network">
          <LogsTable 
            logs={logs?.filter(log => 
              log.type.includes('network') || 
              log.type.includes('request') || 
              log.type.includes('response')
            ) || []} 
            isLoading={isLoading} 
          />
        </TabsContent>

        <TabsContent value="auth">
          <LogsTable 
            logs={logs?.filter(log => 
              log.type.includes('auth')
            ) || []} 
            isLoading={isLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogsPage;