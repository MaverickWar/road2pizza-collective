import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { monitoringService } from "@/services/MonitoringService";

// Configure React Query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      gcTime: 1000 * 60 * 10,   // Keep unused data in cache for 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 404s or auth errors
        if (error?.status === 404 || error?.status === 401) return false;
        // Retry up to 3 times with exponential backoff
        return failureCount < 3;
      },
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
      refetchOnReconnect: true,    // Refetch on reconnection
      refetchOnMount: true,        // Ensure fresh data on mount
    },
    mutations: {
      retry: 2,
      meta: {
        onError: (error: Error) => {
          console.error('Mutation error:', error);
          monitoringService.addCheck({
            id: `mutation-error-${Date.now()}`,
            check: () => false,
            message: `Mutation failed: ${error.message}`
          });
        }
      }
    }
  }
});

// Add global error handler using the correct event subscription
queryClient.getQueryCache().subscribe((event) => {
  if (event.type === 'updated' && event.action.type === 'error') {
    const error = event.action.error;
    console.error('Query cache error:', error);
    monitoringService.addCheck({
      id: `query-cache-error-${Date.now()}`,
      check: () => false,
      message: `Query cache error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
});

export function QueryProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const logAnalytics = async () => {
      try {
        console.log('Logging page load analytics...');
        const { error } = await supabase
          .from('analytics_metrics')
          .insert({
            metric_name: 'page_load',
            metric_value: 1,
            metadata: {
              timestamp: new Date().toISOString(),
              user_agent: navigator.userAgent,
              url: window.location.href,
              performance_metrics: {
                loadTime: performance.now(),
                memory: (performance as any).memory?.usedJSHeapSize || 0
              }
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

    // Set up global error boundary
    const errorHandler = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      monitoringService.addCheck({
        id: `global-error-${Date.now()}`,
        check: () => false,
        message: `Unhandled error: ${event.error?.message}`
      });
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}