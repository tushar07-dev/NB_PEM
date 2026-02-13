// src/shared/components/GlobalLoader.tsx
import { useIsFetching } from "@tanstack/react-query";
import { Progress } from "./ui/progress";

/**
 * GlobalLoader - Shows loading bar when React Query is fetching
 *
 * Uses `useIsFetching()` to track all active queries
 * Displays a thin progress bar at the top of the screen
 */
export function GlobalLoader() {
  const isFetching = useIsFetching();

  if (!isFetching) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-50">
      <Progress value={undefined} className="h-1 rounded-none" />
    </div>
  );
}
