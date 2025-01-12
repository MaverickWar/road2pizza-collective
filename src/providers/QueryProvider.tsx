import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Configure React Query client with custom settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // Data stays fresh for 2 minutes
      gcTime: 1000 * 60 * 5,    // Keep unused data in cache for 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 404s or auth errors
        if (error?.status === 404 || error?.status === 401) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
});

// Custom query provider with cache clearing on refresh
export function QueryProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const logCacheClearing = async () => {
      // Check if the page is reloaded
      if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
        queryClient.clear();
        console.log('Cache cleared on page reload');
        
        try {
          const { error } = await supabase
            .from('analytics_metrics')
            .insert({
              metric_name: 'cache_clear',
              metric_value: 1,
              metadata: {
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
                url: window.location.href
              }
            });

          if (error) {
            console.error('Error logging cache clearing event:', error);
            // Only show error toast to admins
            const { data: profile } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', (await supabase.auth.getUser()).data.user?.id)
              .single();

            if (profile?.is_admin) {
              toast.error('Failed to log analytics event');
            }
          } else {
            console.log('Successfully logged cache clearing event');
          }
        } catch (error) {
          console.error('Unexpected error logging cache clearing:', error);
        }
      }
    };

    logCacheClearing();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}