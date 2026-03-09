import { z } from "zod";
import { env } from "@/config/env";

export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  auth: {
    clientId: string;
    tenantId: string;
    authority: string;
    redirectUri: string;
  };
  monitoring: {
    appInsightsConnectionString: string;
    enableMonitoring: boolean;
  };
  features: {
    enableDebugMode: boolean;
    enableAnalytics: boolean;
  };
  environment: {
    name: string;
    version: string;
  };
}

// ── Zod schema — mirrors AppConfig, all fields optional so partial
// config.json still falls back gracefully rather than crashing ────────────────
const appConfigSchema = z.object({
  api: z.object({
    baseUrl: z.string().url("api.baseUrl must be a valid URL"),
    timeout: z.number().optional().default(10000),
  }),
  auth: z.object({
    clientId: z.string().uuid("auth.clientId must be a valid UUID"),
    tenantId: z.string().uuid("auth.tenantId must be a valid UUID"),
    authority: z.string().optional(),
    redirectUri: z.string().optional(),
  }),
  monitoring: z
    .object({
      appInsightsConnectionString: z.string().optional().default(""),
      enableMonitoring: z.boolean().optional().default(false),
    })
    .optional(),
  features: z
    .object({
      enableDebugMode: z.boolean().optional().default(false),
      enableAnalytics: z.boolean().optional().default(false),
    })
    .optional(),
  environment: z
    .object({
      name: z.string().optional().default("development"),
      version: z.string().optional().default("1.0.0"),
    })
    .optional(),
});

class ConfigService {
  private config: AppConfig | null = null;
  private isLoaded = false;

  async loadConfig(): Promise<AppConfig> {
    if (this.isLoaded && this.config) {
      return this.config;
    }

    try {
      const response = await fetch("/config.json");
      if (!response.ok) {
        throw new Error(
          `Failed to load config: ${response.status} ${response.statusText}`
        );
      }

      const raw: unknown = await response.json();

      // validateConfig throws on failure — caught below and falls back to env
      this.config = this.validateConfig(raw);
      this.isLoaded = true;

      return this.config;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("[ConfigService] Failed to load runtime config:", error);
      }

      // Fallback to environment variables if config.json is missing or invalid
      this.config = this.getFallbackConfig();
      this.isLoaded = true;

      return this.config;
    }
  }

  getConfig(): AppConfig {
    if (!this.isLoaded || !this.config) {
      throw new Error("Config not loaded. Call loadConfig() first.");
    }
    return this.config;
  }

  isConfigLoaded(): boolean {
    return this.isLoaded;
  }

  // ── Zod-based validation — replaces unsafe `as Record<string, unknown>` casts
  private validateConfig(config: unknown): AppConfig {
    const result = appConfigSchema.safeParse(config);

    if (!result.success) {
      const issues = result.error.issues
        .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
        .join("\n");

      if (import.meta.env.DEV) {
        console.error(
          `[ConfigService] config.json validation failed:\n${issues}`
        );
      }

      // Throw so loadConfig's catch block falls back to getFallbackConfig()
      throw new Error(`Config validation failed:\n${issues}`);
    }

    const d = result.data;

    // Map validated Zod output back to the full AppConfig shape,
    // filling in any optional sections with safe defaults
    return {
      api: {
        baseUrl: d.api.baseUrl,
        timeout: d.api.timeout ?? 10000,
      },
      auth: {
        clientId: d.auth.clientId,
        tenantId: d.auth.tenantId,
        authority:
          d.auth.authority ??
          `https://login.microsoftonline.com/${d.auth.tenantId}`,
        redirectUri: d.auth.redirectUri ?? window.location.origin,
      },
      monitoring: {
        appInsightsConnectionString:
          d.monitoring?.appInsightsConnectionString ?? "",
        enableMonitoring: d.monitoring?.enableMonitoring ?? false,
      },
      features: {
        enableDebugMode: d.features?.enableDebugMode ?? import.meta.env.DEV,
        enableAnalytics: d.features?.enableAnalytics ?? false,
      },
      environment: {
        name: d.environment?.name ?? import.meta.env.MODE ?? "development",
        version: d.environment?.version ?? "1.0.0",
      },
    };
  }

  private getFallbackConfig(): AppConfig {
    return {
      api: {
        baseUrl: env.VITE_API_BASE_URL,
        timeout: 10000,
      },
      auth: {
        clientId: env.VITE_MSAL_CLIENT_ID,
        tenantId: env.VITE_MSAL_TENANT_ID,
        authority: `https://login.microsoftonline.com/${env.VITE_MSAL_TENANT_ID}`,
        redirectUri: window.location.origin,
      },
      monitoring: {
        appInsightsConnectionString:
          env.VITE_APP_INSIGHTS_CONNECTION_STRING ?? "",
        enableMonitoring: false,
      },
      features: {
        enableDebugMode: import.meta.env.DEV,
        enableAnalytics: false,
      },
      environment: {
        name: import.meta.env.MODE || "development",
        version: "1.0.0",
      },
    };
  }

  // ── Convenience accessors ─────────────────────────────────────────────────
  get apiBaseUrl(): string {
    return this.getConfig().api.baseUrl;
  }

  get authConfig() {
    return this.getConfig().auth;
  }

  get monitoringConfig() {
    return this.getConfig().monitoring;
  }

  get isDevelopment(): boolean {
    return this.getConfig().environment.name === "development";
  }

  get isProduction(): boolean {
    return this.getConfig().environment.name === "production";
  }
}

// Export singleton instance
export const configService = new ConfigService();
