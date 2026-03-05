import { useState, useCallback } from "react";

interface AsyncErrorState {
  error: Error | null;
  isError: boolean;
}

interface AsyncErrorActions {
  setError: (error: Error | string) => void;
  clearError: () => void;
  handleAsyncError: <T extends any[], R>(
    asyncFn: (...args: T) => Promise<R>,
    ...args: T
  ) => Promise<R | undefined>;
}

/**
 * Hook for handling async errors in components
 * Since Error Boundaries don't catch async errors, this hook provides
 * a way to handle them gracefully
 */
export function useAsyncError(): AsyncErrorState & AsyncErrorActions {
  const [error, setErrorState] = useState<Error | null>(null);

  const setError = useCallback((error: Error | string) => {
    const errorObj = typeof error === "string" ? new Error(error) : error;
    if (import.meta.env.DEV) {
      console.error("Async Error:", errorObj.message);
    }
    setErrorState(errorObj);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleAsyncError = useCallback(
    async <T extends any[], R>(
      asyncFn: (...args: T) => Promise<R>,
      ...args: T
    ): Promise<R | undefined> => {
      try {
        clearError();
        return await asyncFn(...args);
      } catch (error) {
        setError(error as Error);
        return undefined;
      }
    },
    [clearError, setError]
  );

  return {
    error,
    isError: error !== null,
    setError,
    clearError,
    handleAsyncError,
  };
}
