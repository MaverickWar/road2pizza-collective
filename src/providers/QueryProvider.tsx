import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";

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
    // Check if the page is reloaded and clear cache if true
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      queryClient.clear();
      
      // Log cache clearing event to analytics backend
      fetch('/api/log-analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'cache_clear',
          timestamp: new Date().toISOString(),
        }),
      }).catch(error => {
        console.error('Error logging cache clearing event:', error);
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
