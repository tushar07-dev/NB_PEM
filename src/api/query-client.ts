// src/api/query-client.ts
import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Global React Query Client Configuration
 *
 * Settings optimized for:
 * - Dropdown data (relatively stable, cache for 5 min)
 * - Minimal unnecessary refetches
 * - Automatic retry on failure (once)
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => toast.error(error.message),
  }),
  mutationCache: new MutationCache({
    onError: (error) => toast.error(error.message),
  }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - cache retention (formerly cacheTime)
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch when tab regains focus
      refetchOnReconnect: true, // Refetch when connection restored
    },
    mutations: {
      retry: 0, // Don't retry mutations (writes should fail fast)
    },
  },
});
