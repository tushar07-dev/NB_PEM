import type { AppError } from "./errorTypes"


export function normalizeError(error: unknown): AppError {
  if (error instanceof Error) {
    return {
      type: "UNKNOWN_ERROR",
      message: error.message,
      stack: error.stack,
    }
  }

  return {
    type: "UNKNOWN_ERROR",
    message: "Something went wrong",
  }
}
