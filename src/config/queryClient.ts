import { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from "@/integrations/supabase/types";

// Function to refresh token using Supabase
const refreshToken = async (supabaseClient: SupabaseClient) => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    const { error } = await supabaseClient.auth.refreshSession();
    if (error) {
      throw new Error('Failed to refresh token');
    }
  }
};

type TableNames = keyof Database['public']['Tables'];

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
      queryFn: async ({ queryKey }) => {
        try {
          // Ensure the queryKey[0] is a valid table name
          const tableName = queryKey[0] as TableNames;
          
          // Attempt to fetch data
          const { data, error } = await supabase
            .from(tableName)
            .select('*');

          if (error) {
            throw error;
          }

          return data;
        } catch (error: any) {
          // If error is due to token expiration, refresh token and retry
          if (error.status === 401) {
            await refreshToken(supabase);
            return queryClient.defaultQueryFn({ queryKey });
          }
          throw error;
        }
      },
    },
    mutations: {
      onError: async (error: Error, variables: unknown, context: unknown) => {
        const { error: supabaseError } = await supabase
          .from('analytics_metrics')
          .insert({
            metric_name: 'query_error',
            metric_value: 1,
            metadata: {
              error: error.message,
              query: "unknown"
            }
          });

        if (supabaseError) console.error("Error logging query error:", supabaseError);
      },
    }
  }
});