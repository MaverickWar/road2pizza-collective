import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function QueryProvider({ children }: { children: ReactNode }) {
  // Create QueryClient instance that persists across re-renders
  const queryClient = useRef(
    new QueryClient({
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
          refetchOnWindowFocus: false, // Prevent unnecessary refetches
          refetchOnReconnect: true,
          refetchOnMount: true,
          // Use suspense for better loading handling
          suspense: true,
          useErrorBoundary: true,
          meta: {
            errorHandler: (error: any) => {
              console.error('Query error:', error);
              // Only show one error toast per error type
              toast.error(error?.message || 'An error occurred while fetching data', {
                id: `query-error-${error?.code || 'unknown'}`,
              });
            }
          }
        },
      },
    })
  ).current;

  useEffect(() => {
    // Only clear cache on sign out to prevent unnecessary refetches
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_OUT') {
        console.log('Clearing query cache due to sign out');
        queryClient.clear();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}