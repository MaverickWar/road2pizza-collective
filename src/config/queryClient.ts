import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cached data will be considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 30 minutes
      gcTime: 30 * 60 * 1000,
      // Retry failed requests 3 times with exponential backoff
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403 errors as they indicate auth issues
        if (error?.status === 401 || error?.status === 403) {
          console.log("Auth error detected, redirecting to login");
          supabase.auth.signOut();
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus after data becomes stale
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