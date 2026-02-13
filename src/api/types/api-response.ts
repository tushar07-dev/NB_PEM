// src/api/types/api-response.ts

/**
 * Generic API response wrapper
 * All endpoints return this structure
 */
export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;
  errors?: Record<string, string[]>;
}

/**
 * Common error type for API failures
 */
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

/**
 * Extract data from API response or throw error
 */
export function extractApiData<T>(response: ApiResponse<T>): T {
  if (response.status !== 200 && response.status !== 0) {
    throw new Error(response.message || "API request failed");
  }
  return response.data;
}

/**
 * Check if response has errors
 */
export function hasApiErrors(response: ApiResponse<unknown>): boolean {
  return !!(response.errors && Object.keys(response.errors).length > 0);
}
