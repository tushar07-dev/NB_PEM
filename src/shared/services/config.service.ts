/**
 * Runtime Configuration Service
 * 
 * This service loads configuration from /public/config.json at runtime.
 * Changes to config.json do NOT require app rebuild (AC4).
 */

// Configuration types
export interface AppConfig {
  appName: string;
  apiBaseUrl: string;
  featureFlags: {
    enableDarkMode: boolean;
    enableNotifications: boolean;
    enableAnalytics: boolean;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  pagination: {
    defaultPageSize: number;
    pageSizeOptions: number[];
  };
  session: {
    timeout: number;
    refreshTokenBeforeExpiry: number;
  };
}

// Default configuration (fallback if config.json fails to load)
const defaultConfig: AppConfig = {
  appName: "PEM Knowledge Base and Check Lists",
  apiBaseUrl: "https://api.example.com",
  featureFlags: {
    enableDarkMode: true,
    enableNotifications: true,
    enableAnalytics: false,
  },
  theme: {
    primaryColor: "#081E32",
    secondaryColor: "#394B5B",
    accentColor: "#F6F6F6",
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },
  session: {
    timeout: 30,
    refreshTokenBeforeExpiry: 5,
  },
};

// Module-level cache (AC3: ConfigService to read runtime vars)
let cachedConfig: AppConfig | null = null;
let configLoadPromise: Promise<AppConfig> | null = null;

const CONFIG_URL = "/config.json";

/**
 * Load configuration from runtime config file (AC2)
 * Must be called before app initialization
 */
export async function loadConfig(): Promise<AppConfig> {
  // Return cached config if already loaded
  if (cachedConfig) {
    return cachedConfig;
  }

  // Prevent multiple simultaneous load attempts
  if (configLoadPromise) {
    return configLoadPromise;
  }

  const loadPromise = (async (): Promise<AppConfig> => {
    try {
      const response = await fetch(CONFIG_URL + "?t=" + Date.now());
      
      if (!response.ok) {
        console.warn(`Config load failed (${response.status}), using defaults`);
        cachedConfig = defaultConfig;
        return defaultConfig;
      }

      const config = await response.json();
      
      // Merge with defaults to ensure all properties exist
      const mergedConfig = { ...defaultConfig, ...config };
      cachedConfig = mergedConfig;
      
      console.log("Runtime config loaded successfully");
      return mergedConfig;
    } catch (error) {
      console.warn("Failed to load config from file, using defaults:", error);
      cachedConfig = defaultConfig;
      return defaultConfig;
    }
  })();

  configLoadPromise = loadPromise;
  return loadPromise;
}

/**
 * Get the loaded configuration
 * Throws error if config hasn't been loaded yet
 */
export function getConfig(): AppConfig {
  if (!cachedConfig) {
    throw new Error(
      "Config not loaded. Call loadConfig() before accessing config values."
    );
  }
  return cachedConfig;
}

/**
 * Safely get config with fallback (doesn't require loadConfig first)
 */
export function getConfigOrDefault(): AppConfig {
  return cachedConfig || defaultConfig;
}

/**
 * Update configuration at runtime (AC4: App works without rebuild)
 * This allows hot-reloading of config without page refresh
 */
export function updateConfig(updates: Partial<AppConfig>): void {
  if (cachedConfig) {
    cachedConfig = { ...cachedConfig, ...updates } as AppConfig;
    console.log("Runtime config updated");
  }
}

// Export default for convenience
export { defaultConfig };
