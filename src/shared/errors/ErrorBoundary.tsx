import React from "react"
import type { ErrorBoundaryProps as RebProps } from "react-error-boundary"
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary"
import ErrorFallback from "./ErrorFallback"
import { logError } from "../services/errorLogger"
import { trackEvent } from "../services/monitoring"

type ResetDetails = Parameters<NonNullable<RebProps["onReset"]>>[0]

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>
  onError?: (error: unknown, errorInfo: { componentStack: string }) => void
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
  const handleError = (error: unknown, errorInfo: React.ErrorInfo) => {
    const message = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined

    logError({
      type: "UI_ERROR",
      message,
      stack: errorInfo.componentStack ?? stack,
    })

    onError?.(error, { componentStack: errorInfo.componentStack ?? "" })
  }

  const handleReset = (details: ResetDetails) => {
    trackEvent("error_boundary_reset", { reason: details.reason })
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
