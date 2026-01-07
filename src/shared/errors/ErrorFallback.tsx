interface ErrorFallbackProps {
  error?: Error
  resetErrorBoundary?: () => void
  message?: string
  errorId?: string
}

export default function ErrorFallback({
  error,
  resetErrorBoundary,
  message,
  errorId
}: ErrorFallbackProps) {
  // Use error.message if available, otherwise fallback to message prop
  const displayMessage = error?.message || message || "Please refresh or contact support"

  // Generate error ID if not provided and we have an error
  const displayErrorId = errorId || (error ? `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : undefined)

  const handleReset = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="rounded-lg border p-6 text-center max-w-md">
        <h2 className="text-lg font-semibold text-red-600">
          Application Error
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {displayMessage}
        </p>
        {displayErrorId && (
          <p className="mt-2 text-xs text-muted-foreground">
            Error ID: {displayErrorId}
          </p>
        )}
        <div className="mt-4 space-x-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  )
}
