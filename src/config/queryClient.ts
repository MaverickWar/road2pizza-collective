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
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      gcTime: 1000 * 60 * 10,   // Keep unused data for 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnMount: "always",  // Always fetch fresh data on mount
      refetchOnWindowFocus: false, // Don't refetch on window focus to prevent duplicate requests
      refetchOnReconnect: true,
      queryFn: async ({ queryKey }) => {
        try {
          console.log('Query execution started:', { queryKey });
          const tableName = queryKey[0] as string;
          
          if (typeof tableName !== 'string') {
            throw new Error('Table name must be a string');
          }
          
          const { data, error } = await supabase
            .from(tableName)
            .select('*');

          if (error) {
            console.error('Query error:', error);
            throw error;
          }

          console.log('Query completed successfully:', { queryKey, rowCount: data?.length });
          return data;
        } catch (error: any) {
          if (error.status === 401) {
            console.log('Token expired, attempting refresh...');
            await refreshToken(supabase);
            return queryClient.defaultQueryFn({ queryKey });
          }
          throw error;
        }
      },
    },
    mutations: {
      onError: async (error: Error) => {
        console.error('Mutation error:', error);
        const { error: loggingError } = await supabase
          .from('analytics_metrics')
          .insert({
            metric_name: 'mutation_error',
            metric_value: 1,
            metadata: {
              error: error.message,
              timestamp: new Date().toISOString()
            }
          });

        if (loggingError) console.error("Error logging mutation error:", loggingError);
      },
    }
  }
});

// Clear cache on auth state changes
export const clearQueryCache = () => {
  console.log('Clearing query cache...');
  queryClient.clear();
};