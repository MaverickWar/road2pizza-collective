import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import StatsCards from "@/components/admin/analytics/StatsCards";
import LogsTable from "@/components/admin/analytics/LogsTable";
import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Analytics = () => {
  const [activeIncidents, setActiveIncidents] = useState<any[]>([]);

  // Fetch logs with real-time updates
  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ["analytics-logs"],
    queryFn: async () => {
      console.log("Fetching analytics logs...");
      const { data, error } = await supabase
        .from("analytics_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching logs:", error);
        throw error;
      }
      return data;
    },
  });

  // Fetch metrics with real-time updates
  const { data: metrics } = useQuery({
    queryKey: ["analytics-metrics"],
    queryFn: async () => {
      console.log("Fetching analytics metrics...");
      const { data, error } = await supabase
        .from("analytics_metrics")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error fetching metrics:", error);
        throw error;
      }
      return data;
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('analytics-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'analytics_logs' },
        (payload) => {
          console.log('Real-time update received:', payload);
          toast.info("New analytics data received");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculate stats and active incidents
  useEffect(() => {
    if (logs) {
      const active = logs.filter(log => 
        log.status === 'open' && 
        (log.severity === 'critical' || log.severity === 'high')
      );
      setActiveIncidents(active);
    }
  }, [logs]);

  // Calculate stats
  const stats = {
    totalErrors: logs?.filter(log => log.type === 'error').length || 0,
    resolvedIssues: logs?.filter(log => log.status === 'resolved').length || 0,
    activeAlerts: logs?.filter(log => log.status === 'open').length || 0,
    avgResponseTime: metrics?.find(m => m.metric_name === 'avg_response_time')?.metric_value || 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Site Analytics</h1>
        </div>

        {activeIncidents.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Active Incidents</AlertTitle>
            <AlertDescription>
              There are {activeIncidents.length} active high-priority incidents that require attention.
            </AlertDescription>
          </Alert>
        )}

        <StatsCards stats={stats} />

        <Card>
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <LogsTable logs={logs || []} isLoading={logsLoading} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;