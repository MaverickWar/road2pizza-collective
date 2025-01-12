import { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Data is never considered fresh
      cacheTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
      retry: 3, // Retry failed requests 3 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      onError: async (error: any, query) => {
        const { error: supabaseError } = await supabase.from("analytics_logs").insert({
          type: "query_error",
          message: error.message,
          url: query?.queryKey?.[0] || "unknown",
          severity: "medium",
        });

        if (supabaseError) console.error("Error logging query error:", supabaseError);
      },
    },
  },
});
