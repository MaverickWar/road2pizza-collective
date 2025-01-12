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
    mutations: {
      onError: async (error: Error, variables: unknown, context: unknown) => {
        console.error("Mutation error:", error);
        const { error: supabaseError } = await supabase
          .from('analytics_metrics')
          .insert({
            metric_name: 'mutation_error',
            metric_value: 1,
            metadata: {
              error: error.message,
              timestamp: new Date().toISOString(),
              variables: JSON.stringify(variables)
            }
          });

        if (supabaseError) {
          console.error("Error logging mutation error:", supabaseError);
        }
      },
    }
  }
});