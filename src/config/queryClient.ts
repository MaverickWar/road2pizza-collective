import { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
  mutationCache: {
    onError: async (error: any, variables: any, context: any, mutation: any) => {
      const { error: supabaseError } = await supabase
        .from('analytics_metrics')
        .insert({
          metric_name: 'query_error',
          metric_value: 1,
          metadata: {
            error: error.message,
            query: mutation.options.mutationKey?.[0] || "unknown"
          }
        });

      if (supabaseError) console.error("Error logging query error:", supabaseError);
    },
  }
});