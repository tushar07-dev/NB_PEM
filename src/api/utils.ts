/**
 * Validates the envelope-level status returned by the PEM Digital API.
 *
 * The API wraps every response in an envelope:
 *   { status?: number | null, message?: string | null, data: T }
 *
 * Rules:
 *  - status absent (0) or -1  → treat as success (some endpoints omit it)
 *  - status 200–299            → success
 *  - anything else             → throw with the envelope message
 */
export function validateApiResponse<
  T extends { status?: number | null; message?: string | null },
>(response: T, errorMessage: string): void {
  const status = response.status ?? 0;
  if (status !== 0 && status !== -1 && (status < 200 || status >= 300)) {
    throw new Error(response.message ?? errorMessage);
  }
}
