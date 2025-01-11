import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCards from "@/components/admin/analytics/StatsCards";
import LogsTable from "@/components/admin/analytics/LogsTable";
import DashboardLayout from "@/components/DashboardLayout";

const Analytics = () => {
  // Fetch logs
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

  // Fetch metrics
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
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        </div>

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