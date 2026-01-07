import { useEffect } from "react"
import { logError } from "@/shared/services/errorLogger"

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.onerror = (_, __, ___, ____, error) => {
      logError({
        type: "UNKNOWN_ERROR",
        message: error?.message || "Window error",
        stack: error?.stack,
      })
    }

    window.onunhandledrejection = (event) => {
      logError({
        type: "UNKNOWN_ERROR",
        message:
          event.reason instanceof Error
            ? event.reason.message
            : "Unhandled promise rejection",
      })
    }
  }, [])

  return <>{children}</>
}
