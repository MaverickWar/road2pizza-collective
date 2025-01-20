import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LogsTable from "@/components/admin/analytics/LogsTable";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LogsPage = () => {
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ["analytics-logs"],
    queryFn: async () => {
      console.log("Fetching analytics logs...");
      const { data, error } = await supabase
        .from("analytics_metrics")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching logs:", error);
        throw error;
      }

      console.log("Fetched logs:", data);
      return data.map(log => ({
        id: log.id,
        type: log.metric_name,
        message: log.metadata?.message || "No message provided",
        severity: log.metadata?.severity || "low",
        status: log.metadata?.status || "open",
        created_at: log.timestamp
      }));
    },
    refetchInterval: 30000 // Refresh every 30 seconds
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
        <div className="text-sm text-gray-500">
          Auto-refreshes every 30 seconds
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <LogsTable logs={logs || []} isLoading={isLoading} />
      )}
    </div>
  );
};

export default LogsPage;