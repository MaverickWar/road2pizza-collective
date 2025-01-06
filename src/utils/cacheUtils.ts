import { queryClient } from "@/config/queryClient";

export const clearCache = () => {
  console.log("Clearing query cache...");
  return queryClient.clear();
};

export const invalidateQueries = (queryKey: string | string[]) => {
  console.log("Invalidating queries for key:", queryKey);
  const key = Array.isArray(queryKey) ? queryKey : [queryKey];
  return queryClient.invalidateQueries({ queryKey: key });
};

export const prefetchQuery = async (queryKey: string | string[], queryFn: () => Promise<any>) => {
  console.log("Prefetching query for key:", queryKey);
  const key = Array.isArray(queryKey) ? queryKey : [queryKey];
  return queryClient.prefetchQuery({
    queryKey: key,
    queryFn,
  });
};