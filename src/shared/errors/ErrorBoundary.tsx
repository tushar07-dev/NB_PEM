import React from "react"
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary"
import ErrorFallback from "./ErrorFallback"
import { logError } from "../services/errorLogger"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>
  onError?: (error: Error, errorInfo: { componentStack: string }) => void
  onReset?: () => void
  resetKeys?: Array<string | number>
  fallbackRender?: (props: { error: Error; resetErrorBoundary: () => void }) => React.ReactElement
}

export function ErrorBoundary({
  children,
  fallback: FallbackComponent = ErrorFallback,
  fallbackRender,
  onError,
  onReset,
  resetKeys
}: ErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error with our custom logging system
    logError({
      type: "UI_ERROR",
      message: error.message,
      stack: errorInfo.componentStack || undefined,
    })

    // Call custom onError handler if provided
    onError?.(error, { componentStack: errorInfo.componentStack || "" })
  }

  const handleReset = (details: { reason: "imperative-api"; args: any[] } | { reason: "keys"; prev: any[] | undefined; next: any[] | undefined }) => {
    // Log reset event via monitoring service in production

    // Call custom onReset handler if provided
    onReset?.()
  }

  return (
    <ReactErrorBoundary
      {...(fallbackRender
        ? { fallbackRender }
        : {
            FallbackComponent: ({ error, resetErrorBoundary }) => (
              <FallbackComponent
                error={error}
                resetErrorBoundary={resetErrorBoundary}
              />
            )
          }
      )}
      onError={handleError}
      onReset={handleReset}
      resetKeys={resetKeys}
    >
      {children}
    </ReactErrorBoundary>
  )
}

// Legacy class component export for backward compatibility
export class LegacyErrorBoundary extends React.Component<
  React.PropsWithChildren,
  { hasError: boolean; message?: string; errorId?: string }
> {
  state = { hasError: false, message: undefined as string | undefined, errorId: undefined as string | undefined }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const errorId = logError({
      type: "UI_ERROR",
      message: error.message,
      stack: info.componentStack || undefined,
    })

    this.setState({ errorId })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback message={this.state.message} errorId={this.state.errorId} />
    }
    return this.props.children
  }
}
