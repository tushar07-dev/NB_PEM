import { z } from "zod";

/**
 * Zod v4 schema for all required VITE_ environment variables.
 *
 * Runs at module load time — if any required variable is missing or
 * malformed the app throws immediately with a clear message instead of
 * silently failing later with cryptic errors.
 */
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url("VITE_API_BASE_URL must be a valid URL"),

  VITE_MSAL_CLIENT_ID: z
    .string()
    .uuid("VITE_MSAL_CLIENT_ID must be a valid UUID"),

  VITE_MSAL_TENANT_ID: z
    .string()
    .uuid("VITE_MSAL_TENANT_ID must be a valid UUID"),

  VITE_MSAL_SCOPE: z.string().min(1, "VITE_MSAL_SCOPE must not be empty"),

  // Optional — app works without App Insights but monitoring is disabled
  VITE_APP_INSIGHTS_CONNECTION_STRING: z.string().optional(),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((e) => `  • ${String(e.path[0])}: ${e.message}`)
    .join("\n");

  throw new Error(
    `\n🚨 Missing or invalid environment variables:\n${issues}\n\n` +
      `Copy .env.example to .env and fill in the required values.\n`
  );
}

/**
 * Type-safe, validated environment config.
 * Use this everywhere instead of accessing import.meta.env directly.
 *
 *   import { env } from "@/config/env";
 *   const url = env.VITE_API_BASE_URL;
 */
export const env = parsed.data;
