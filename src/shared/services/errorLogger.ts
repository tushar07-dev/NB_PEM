import axios from "axios"
import type { AppError } from "@/shared/errors/errorTypes"
import { trackException, trackEvent } from "./monitoring"

// Generate unique error tracking ID
function generateErrorId(): string {
  return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function logApiError(error: unknown) {
  const errorId = generateErrorId()

  if (axios.isAxiosError(error)) {
    const errorDetails = {
      errorId,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      timestamp: new Date().toISOString(),
    }

    console.error("[API ERROR]", errorDetails)

    trackException(new Error(`API Error: ${error.message}`), {
      type: 'API_ERROR',
      ...errorDetails
    })

    trackEvent('api_error', errorDetails)
  } else {
    const errorDetails = {
      errorId,
      message: error instanceof Error ? error.message : 'Unknown API error',
      timestamp: new Date().toISOString(),
    }

    console.error("[UNKNOWN API ERROR]", errorDetails)

    trackException(error instanceof Error ? error : new Error('Unknown API error'), {
      type: 'UNKNOWN_API_ERROR',
      ...errorDetails
    })
  }

  return errorId
}

export function logError(error: AppError) {
  const errorId = generateErrorId()
  const errorDetails = {
    errorId,
    type: error.type,
    message: error.message,
    statusCode: error.statusCode,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  }

  if (import.meta.env.DEV) {
    console.error(`[${error.type}]`, errorDetails)
  }

  trackException(new Error(`${error.type}: ${error.message}`), errorDetails)
  trackEvent('application_error', errorDetails)

  return errorId
}


