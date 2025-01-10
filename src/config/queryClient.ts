import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests 3 times before failing
      retry: 3,
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Refetch when window regains focus
      refetchOnWindowFocus: true,
      // Refetch on reconnect after data becomes stale
      refetchOnReconnect: true,
      meta: {
        // Handle errors globally through meta options
        onError: (error: any) => {
          console.error("Query error:", error);
          if (error?.message) {
            toast.error(error.message);
          }
        }
      }
    },
  },
});
