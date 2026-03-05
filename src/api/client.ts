// src/api/client.ts
import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { useLoadingStore } from "@/shared/store/loadingStore";
import { logApiError } from "@/shared/services/errorLogger";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

// Token management (updated by MSAL AuthProvider)
let currentToken: string | null = null;
let authErrorCallback: ((status: number) => void) | null = null;

export function setAuthToken(token: string | null) {
  currentToken = token;
}

export function setAuthErrorHandler(callback: (status: number) => void) {
  authErrorCallback = callback;
}

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetry(error: any, attempt: number): boolean {
  if (attempt >= MAX_RETRIES) return false;
  if (!error.response) return true; // Network errors
  return RETRY_STATUS_CODES.includes(error.response.status);
}

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (currentToken && config.headers) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    // Only set loading for non-React-Query requests
    // React Query requests will be tracked by useIsFetching
    if (!config.headers?.["X-React-Query"]) {
      useLoadingStore.getState().setLoading(true);
    }
    return config;
  },
  (error) => {
    useLoadingStore.getState().setLoading(false);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors & retry
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    useLoadingStore.getState().setLoading(false);
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & {
      _retryCount?: number;
    };

    // Initialize retry count
    if (!config._retryCount) {
      config._retryCount = 0;
    }

    // Retry logic
    if (shouldRetry(error, config._retryCount)) {
      config._retryCount += 1;
      await delay(RETRY_DELAY * config._retryCount); // Exponential backoff
      return apiClient(config);
    }

    // No more retries
    useLoadingStore.getState().setLoading(false);
    const status = error.response?.status;

    // Log error
    const errorId = logApiError({
      type: "API_ERROR",
      message: error.message,
      statusCode: status,
    });

    // Handle auth errors (401/403)
    if ((status === 401 || status === 403) && authErrorCallback) {
      currentToken = null;
      authErrorCallback(status);
    }

    // Attach error ID
    (error as any).errorId = errorId;

    return Promise.reject(error);
  }
);

// Export initialization function for compatibility
export function initializeApi() {
  return apiClient;
}

export function getApi() {
  return apiClient;
}
