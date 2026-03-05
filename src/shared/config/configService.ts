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

      this.config = await response.json();
      this.isLoaded = true;

      // Validate required fields
      this.validateConfig(this.config);

      return this.config;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to load runtime config:", error);
      }

      // Fallback to environment variables if config.json fails to load
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

  private validateConfig(config: unknown): asserts config is AppConfig {
    const cfg = config as Record<string, unknown>;
    const api = cfg.api as Record<string, unknown> | undefined;
    const auth = cfg.auth as Record<string, unknown> | undefined;

    if (api?.baseUrl === undefined || api?.baseUrl === null) {
      throw new Error("Config validation failed: api.baseUrl is required");
    }
    if (!auth?.clientId) {
      throw new Error("Config validation failed: auth.clientId is required");
    }
    if (!auth?.tenantId) {
      throw new Error("Config validation failed: auth.tenantId is required");
    }
  }

  private getFallbackConfig(): AppConfig {
    return {
      api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
        timeout: 10000,
      },
      auth: {
        clientId: import.meta.env.VITE_MSAL_CLIENT_ID || "fallback-client-id",
        tenantId: import.meta.env.VITE_MSAL_TENANT_ID || "fallback-tenant-id",
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MSAL_TENANT_ID || "fallback-tenant-id"}`,
        redirectUri: window.location.origin,
      },
      monitoring: {
        appInsightsConnectionString:
          import.meta.env.VITE_APP_INSIGHTS_CONNECTION_STRING || "",
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

  // Utility methods for common config access
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
