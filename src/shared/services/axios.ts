import axios from "axios"
import { logApiError } from "./errorLogger"
import { useLoadingStore } from "@/shared/store/loadingStore"
import { configService } from "@/shared/config/configService"

// Token ref for interceptor access (updated by AuthProvider)
let currentToken: string | null = null

// Optional callback for auth errors (set by AuthProvider)
let authErrorCallback: ((status: number) => void) | null = null

export function setAuthToken(token: string | null) {
  currentToken = token
}

// Register callback for auth errors (401/403)
export function setAuthErrorHandler(callback: (status: number) => void) {
  authErrorCallback = callback
}

// Initialize axios instance after config is loaded
let api: ReturnType<typeof axios.create>

export function initializeApi() {
  const config = configService.getConfig()

  api = axios.create({
    baseURL: config.api.baseUrl,
    timeout: config.api.timeout,
    headers: {
      "Content-Type": "application/json",
    },
  })

  // Set up interceptors after api is created
  setupInterceptors()
  return api
}

export function getApi() {
  if (!api) {
    throw new Error('API not initialized. Call initializeApi() after config is loaded.')
  }
  return api
}

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second
const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504] // Transient errors

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function shouldRetry(error: any, attempt: number): boolean {
  if (attempt >= MAX_RETRIES) return false
  if (!error.response) return false // Network errors
  return RETRY_STATUS_CODES.includes(error.response.status)
}

function setupInterceptors() {
  if (!api) return

  /* ---------------- Request Interceptor ---------------- */
  // Add auth token to headers before each request
  api.interceptors.request.use(
    (config) => {
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`
      }
      useLoadingStore.getState().setLoading(true)
      return config
    },
    (error) => {
      useLoadingStore.getState().setLoading(false)
      return Promise.reject(error)
    }
  )

  /* ---------------- Response Interceptor ---------------- */
  // Handle API errors with retry logic
  api.interceptors.response.use(
    (res) => {
      useLoadingStore.getState().setLoading(false)
      return res
    },
    async (error) => {
      const config = error.config

      // Initialize retry count if not present
      if (!config._retryCount) {
        config._retryCount = 0
      }

      // Check if we should retry
      if (shouldRetry(error, config._retryCount)) {
        config._retryCount += 1

        // Log retry attempt via monitoring service in production

        // Wait before retrying
        await delay(RETRY_DELAY * config._retryCount) // Exponential backoff

        return api(config)
      }

      // No more retries, handle the error
      useLoadingStore.getState().setLoading(false)
      const status = error.response?.status

      const errorId = logApiError({
        type: "API_ERROR",
        message: error.message,
        statusCode: status,
      })

      // Use callback pattern for auth errors (no hard redirects)
      if ((status === 401 || status === 403) && authErrorCallback) {
        currentToken = null
        authErrorCallback(status)
        return Promise.reject(error)
      }

      // Attach error ID to the error for potential user display
      error.errorId = errorId

      return Promise.reject(error)
    }
  )
}
