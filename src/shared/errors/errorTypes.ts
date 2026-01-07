export type AppErrorType =
  | "UI_ERROR"
  | "API_ERROR"
  | "AUTH_ERROR"
  | "ROUTE_ERROR"
  | "UNKNOWN_ERROR"
  | "ASYNC_ERROR"

export interface AppError {
  type: AppErrorType
  message: string
  statusCode?: number
  stack?: string
}
