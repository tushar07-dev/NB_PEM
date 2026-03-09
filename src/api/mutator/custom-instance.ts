import { env } from "@/config/env";
import Axios, { type AxiosRequestConfig, type AxiosError } from "axios";
import { logApiError } from "@/shared/services/errorLogger";

// ── Axios instance ────────────────────────────────────────────────────────────
const AXIOS_INSTANCE = Axios.create({
  baseURL: env.VITE_API_BASE_URL, // fixed: was wrongly 'url:' before
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Token — updated by AuthProvider on login/logout ───────────────────────────
let currentToken: string | null = null;

export function setApiToken(token: string | null) {
  currentToken = token;
}

// ── Token refresh callback — set by AuthProvider after mount ──────────────────
let onTokenRefresh: (() => Promise<string | null>) | null = null;

export function setTokenRefreshCallback(fn: () => Promise<string | null>) {
  onTokenRefresh = fn;
}

// ── Retry config ──────────────────────────────────────────────────────────────
const MAX_RETRIES = 3;
const RETRYABLE_STATUSES = [408, 429, 500, 502, 503, 504];

// ── Request interceptor — inject Bearer token ─────────────────────────────────
AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    if (currentToken && config.headers) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — retry + 401 refresh + error logging ───────────────
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & {
      _retryCount?: number;
      _isRetryAfterRefresh?: boolean;
    };

    if (!config) return Promise.reject(error);

    const status = error.response?.status;

    // ── 401 — try silent token refresh once ────────────────────────────────
    if (status === 401 && !config._isRetryAfterRefresh && onTokenRefresh) {
      config._isRetryAfterRefresh = true;
      const newToken = await onTokenRefresh();
      if (newToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return AXIOS_INSTANCE(config);
      }
      // Refresh failed — redirect to login
      currentToken = null;
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // ── Retry on transient errors ──────────────────────────────────────────
    config._retryCount = config._retryCount ?? 0;
    const shouldRetry =
      config._retryCount < MAX_RETRIES &&
      (!error.response || RETRYABLE_STATUSES.includes(status!));

    if (shouldRetry) {
      config._retryCount++;
      await new Promise((r) => setTimeout(r, 1000 * config._retryCount!));
      return AXIOS_INSTANCE(config);
    }

    // ── Log and reject ─────────────────────────────────────────────────────
    logApiError(error);
    return Promise.reject(error);
  }
);

// ── Orval-compatible mutator ──────────────────────────────────────────────────
// Supports two call signatures:
// 1. Orval-generated: customInstance<T>(url, { method, data, signal, ...options })
// 2. Manual calls:    customInstance<T>({ url, method, data, headers })
export const customInstance = <T>(
  urlOrConfig: string | AxiosRequestConfig,
  options?: RequestInit | AxiosRequestConfig
): Promise<T> => {
  const controller = new AbortController();

  const axiosConfig: AxiosRequestConfig =
    typeof urlOrConfig === "string"
      ? {
          url: urlOrConfig, // baseURL from axios.create handles the host
          method: (options?.method as AxiosRequestConfig["method"]) ?? "GET",
          data: (options as AxiosRequestConfig)?.data,
          signal: options?.signal ?? controller.signal,
          headers: options?.headers as AxiosRequestConfig["headers"],
        }
      : {
          ...urlOrConfig,
          signal: urlOrConfig.signal ?? controller.signal,
        };

  const promise = AXIOS_INSTANCE(axiosConfig).then(({ data }) => data);

  // @ts-expect-error — cancel property for React Query
  promise.cancel = () => controller.abort();

  return promise;
};

export default customInstance;
