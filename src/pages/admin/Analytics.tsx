import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import LogsTable from "@/components/admin/analytics/LogsTable";
import StatsCards from "@/components/admin/analytics/StatsCards";

const Analytics = () => {
  const { data: logs } = useQuery(["analytics-logs"], async () => {
    const { data, error } = await supabase
      .from("analytics_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return data;
  });

  const stats = {
    totalErrors: logs?.filter((log) => log.type === "error").length || 0,
    resolvedIssues: logs?.filter((log) => log.status === "resolved").length || 0,
    activeAlerts: logs?.filter((log) => log.status === "open").length || 0,
  };

  return (
    <DashboardLayout>
      <div>
        <h1>Analytics Dashboard</h1>
        <StatsCards stats={stats} />
        <LogsTable logs={logs || []} />
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
