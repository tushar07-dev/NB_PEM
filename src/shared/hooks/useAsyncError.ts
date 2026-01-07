import { useState, useCallback } from 'react'
import { logError } from '../services/errorLogger'

interface AsyncErrorState {
  error: Error | null
  isError: boolean
  errorId?: string
}

interface AsyncErrorActions {
  setError: (error: Error | string) => void
  clearError: () => void
  handleAsyncError: <T extends any[], R>(
    asyncFn: (...args: T) => Promise<R>,
    ...args: T
  ) => Promise<R | undefined>
}

/**
 * Hook for handling async errors in components
 * Since Error Boundaries don't catch async errors, this hook provides
 * a way to handle them gracefully with proper logging
 */
export function useAsyncError(): AsyncErrorState & AsyncErrorActions {
  const [error, setErrorState] = useState<Error | null>(null)
  const [errorId, setErrorId] = useState<string | undefined>()

  const setError = useCallback((error: Error | string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error
    const id = logError({
      type: "ASYNC_ERROR",
      message: errorObj.message,
      stack: errorObj.stack,
    })

    setErrorState(errorObj)
    setErrorId(id)
  }, [])

  const clearError = useCallback(() => {
    setErrorState(null)
    setErrorId(undefined)
  }, [])

  const handleAsyncError = useCallback(async <T extends any[], R>(
    asyncFn: (...args: T) => Promise<R>,
    ...args: T
  ): Promise<R | undefined> => {
    try {
      clearError()
      return await asyncFn(...args)
    } catch (error) {
      setError(error as Error)
      return undefined
    }
  }, [clearError, setError])

  return {
    error,
    isError: error !== null,
    errorId,
    setError,
    clearError,
    handleAsyncError,
  }
}