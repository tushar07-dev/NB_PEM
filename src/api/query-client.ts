import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

/**
 * Extracts HTTP status from a React Query error.
 * Works for both Axios errors and plain Error objects.
 */
function getErrorStatus(error: unknown): number | undefined {
  return (error as AxiosError)?.response?.status;
}

/**
 * Global React Query Client Configuration
 *
 * Settings optimized for:
 * - Dropdown data (relatively stable, cache for 5 min)
 * - Minimal unnecessary refetches
 * - Smart retry — skips 401/403/404 (non-recoverable by retrying)
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
      staleTime: 5 * 60 * 1000, // 5 minutes — data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes — cache retention
      refetchOnWindowFocus: false, // don't refetch when tab regains focus
      refetchOnReconnect: true, // refetch when connection is restored

      // FIX — was `retry: 1` which retried ALL errors including 401/403/404.
      // 401 is already handled by the axios interceptor (refresh → redirect).
      // 403 and 404 will never succeed on retry — skip them.
      // All other errors (5xx, network) retry up to 2 times.
      retry: (failureCount, error) => {
        const status = getErrorStatus(error);
        if (status !== undefined && [401, 403, 404].includes(status)) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: 0, // writes should fail fast — never retry mutations
    },
  },
});
