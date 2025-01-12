import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import LogsTable from "@/components/admin/analytics/LogsTable";
import StatsCards from "@/components/admin/analytics/StatsCards";

interface AnalyticsMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metadata: any;
  timestamp: string;
}

const Analytics = () => {
  const { data: metrics } = useQuery({
    queryKey: ['analytics-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as AnalyticsMetric[];
    }
  });

  const stats = {
    totalErrors: metrics?.filter(m => m.metric_name === 'error').length || 0,
    resolvedIssues: metrics?.filter(m => m.metadata?.status === 'resolved').length || 0,
    activeAlerts: metrics?.filter(m => m.metadata?.status === 'active').length || 0,
    avgResponseTime: metrics?.reduce((acc, m) => m.metric_name === 'response_time' ? acc + m.metric_value : acc, 0) / 
      (metrics?.filter(m => m.metric_name === 'response_time').length || 1) || 0
  };

  return (
    <DashboardLayout>
      <div>
        <h1>Analytics Dashboard</h1>
        <StatsCards stats={stats} />
        <LogsTable 
          logs={metrics?.map(m => ({
            id: m.id,
            type: m.metric_name,
            message: m.metadata?.message || '',
            severity: m.metadata?.severity || 'low',
            status: m.metadata?.status || 'open',
            created_at: m.timestamp
          })) || []} 
          isLoading={false}
        />
      </div>
    </DashboardLayout>
  );
};

export default Analytics;