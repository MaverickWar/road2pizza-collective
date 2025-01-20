import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Configure React Query client with improved settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // Data stays fresh for 2 minutes
      gcTime: 1000 * 60 * 5,    // Keep unused data in cache for 5 minutes
      retry: (failureCount, error: any) => {
        console.log('Query retry attempt:', failureCount, error);
        // Don't retry on 404s or auth errors
        if (error?.status === 404 || error?.status === 401) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: true, // Enable this to keep data fresh
      refetchOnReconnect: true,
      refetchOnMount: true,
      // Add default error handling
      onError: (error: any) => {
        console.error('Query error:', error);
        // Only show one error toast per error type
        toast.error(error?.message || 'An error occurred while fetching data', {
          id: `query-error-${error?.code || 'unknown'}`,
        });
      }
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Listen for auth state changes to invalidate queries
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        // Clear all queries on auth state change
        queryClient.clear();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}