import Axios, { type AxiosRequestConfig } from "axios";
import { configService } from "@/shared/config/configService";

const AXIOS_INSTANCE = Axios.create();

// Module-level token — updated by AuthProvider on login/logout
let currentToken: string | null = null;

export function setApiToken(token: string | null) {
  currentToken = token;
}

// Request interceptor - set baseURL dynamically and add auth token
AXIOS_INSTANCE.interceptors.request.use((config) => {
  // Set baseURL at request time (after config is loaded)
  if (configService.isConfigLoaded()) {
    config.baseURL = configService.apiBaseUrl;
  }
  // Inject Bearer token on every request
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

// Response interceptor - handle errors
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/**
 * Orval-compatible custom instance
 * Supports two call signatures:
 * 1. Orval-generated: customInstance<T>(url, { method, data, signal, ...options })
 * 2. Manual calls: customInstance<T>({ url, method, data, headers })
 */
export const customInstance = <T>(
  urlOrConfig: string | AxiosRequestConfig,
  options?: RequestInit | AxiosRequestConfig
): Promise<T> => {
  const controller = new AbortController();

  let axiosConfig: AxiosRequestConfig;

  if (typeof urlOrConfig === "string") {
    // Orval-generated signature: customInstance(url, options)
    axiosConfig = {
      url: urlOrConfig,
      method: (options?.method as AxiosRequestConfig["method"]) ?? "GET",
      data: (options as AxiosRequestConfig)?.data,
      signal: options?.signal ?? controller.signal,
      headers: options?.headers as AxiosRequestConfig["headers"],
    };
  } else {
    // Manual signature: customInstance({ url, method, data, headers })
    axiosConfig = {
      ...urlOrConfig,
      signal: urlOrConfig.signal ?? controller.signal,
    };
  }

  const promise = AXIOS_INSTANCE(axiosConfig).then(({ data }) => data);

  // @ts-expect-error - Cancel property for React Query
  promise.cancel = () => {
    controller.abort();
  };

  return promise;
};

export default customInstance;
