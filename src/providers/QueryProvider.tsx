import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Configure React Query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      gcTime: 1000 * 60 * 10,   // Keep unused data in cache for 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 404s or auth errors
        if (error?.status === 404 || error?.status === 401) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: true, // Refetch on window focus to ensure data freshness
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const logAnalytics = async () => {
      try {
        const { error } = await supabase
          .from('analytics_metrics')
          .insert({
            metric_name: 'page_load',
            metric_value: 1,
            metadata: {
              timestamp: new Date().toISOString(),
              user_agent: navigator.userAgent,
              url: window.location.href
            }
          });

        if (error) {
          console.error('Error logging analytics event:', error);
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', (await supabase.auth.getUser()).data.user?.id)
            .single();

          if (profile?.is_admin) {
            toast.error('Failed to log analytics event');
          }
        } else {
          console.log('Successfully logged page load event');
        }
      } catch (error) {
        console.error('Unexpected error logging analytics:', error);
      }
    };

    logAnalytics();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}