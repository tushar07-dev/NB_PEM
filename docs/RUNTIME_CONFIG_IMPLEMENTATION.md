# Runtime Configuration Implementation Guide

This document describes how to implement runtime configuration using a JSON config file that can be changed without rebuilding the application.

## Acceptance Criteria

| Criteria | Description |
|----------|-------------|
| AC1 | `/public/config.json` file must exist with placeholder values |
| AC2 | Config must load before app initialization |
| AC3 | ConfigService implemented to read runtime vars |
| AC4 | App must work even when config changes without rebuild |

---

## Implementation Overview

```
public/
├── config.json          # Runtime configuration file (AC1)
src/
├── services/
│   └── config.service.ts    # ConfigService implementation (AC3)
├── app/
│   └── providers/
│       └── ConfigProvider.tsx   # React context for config
├── main.tsx             # App initialization (AC2)
```

---

## AC1: Create /public/config.json

Create a `config.json` file in the `public` folder with placeholder values:

```json
{
  "appName": "PEM Knowledge Base",
  "apiBaseUrl": "https://api.example.com",
  "featureFlags": {
    "enableDarkMode": true,
    "enableNotifications": true
  },
  "theme": {
    "primaryColor": "#081E32",
    "secondaryColor": "#394B5B"
  }
}
```

**Key Points:**
- File must be in `public/` folder (accessible at root URL)
- Use placeholder/default values for initial setup
- Can be modified without rebuilding the application (AC4)

---

## AC2: Load Config Before App Initialization

In `src/main.tsx`, load the config before rendering the app:

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { loadConfig } from "./services/config.service";

async function bootstrap() {
  try {
    // Load runtime config before app starts (AC2)
    await loadConfig();
    
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Failed to load configuration:", error);
    // Optionally show error UI or use default config
  }
}

bootstrap();
```

---

## AC3: ConfigService Implementation

Create `src/services/config.service.ts`:

```typescript
// Runtime configuration service (AC3)

export interface AppConfig {
  appName: string;
  apiBaseUrl: string;
  featureFlags: {
    enableDarkMode: boolean;
    enableNotifications: boolean;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
}

let config: AppConfig | null = null;
const CONFIG_URL = "/config.json";

export async function loadConfig(): Promise<AppConfig> {
  if (config) {
    return config; // Return cached config
  }

  try {
    const response = await fetch(CONFIG_URL);
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.status}`);
    }
    config = await response.json();
    return config;
  } catch (error) {
    console.warn("Failed to load config, using defaults:", error);
    // Return default config if file doesn't exist
    config = getDefaultConfig();
    return config;
  }
}

export function getConfig(): AppConfig {
  if (!config) {
    throw new Error("Config not loaded. Call loadConfig() first.");
  }
  return config;
}

export function getDefaultConfig(): AppConfig {
  return {
    appName: "PEM Knowledge Base",
    apiBaseUrl: "https://api.example.com",
    featureFlags: {
      enableDarkMode: true,
      enableNotifications: true,
    },
    theme: {
      primaryColor: "#081E32",
      secondaryColor: "#394B5B",
    },
  };
}

// Helper to update config at runtime (AC4)
export function updateConfig(newConfig: Partial<AppConfig>): void {
  config = { ...config, ...newConfig } as AppConfig;
}
```

---

## AC4: App Works Without Rebuild

The implementation supports config changes without rebuild because:

1. **Config is fetched at runtime** - Uses `fetch()` to load `/config.json`
2. **No build-time injection** - Values are not embedded during build
3. **Dynamic updates** - Config can be changed by editing `public/config.json`
4. **Default fallback** - App gracefully handles missing config

### How AC4 Works:

```
Build Time          Runtime
    │                  │
    │                  │  User edits
    │                  │  /config.json
    │                  │
    ▼                  ▼
┌─────────┐       ┌─────────┐
│  Build  │       │  Fetch  │
│  App    │──────▶│  Config │
└─────────┘       └─────────┘
                          │
                          │ Config changed?
                          │ (no rebuild needed)
                          ▼
                     ┌─────────┐
                     │  Use    │
                     │  New    │
                     │  Values │
                     └─────────┘
```

### Verifying AC4:

1. Build the app: `npm run build`
2. Deploy to server
3. Edit `public/config.json` on the server
4. Refresh the page - changes are reflected without redeploy

---

## Usage Example

In any component:

```typescript
import { getConfig } from "@/services/config.service";

function MyComponent() {
  const config = getConfig();
  
  return (
    <div>
      <h1>{config.appName}</h1>
      <p>API: {config.apiBaseUrl}</p>
    </div>
  );
}
```

---

## Environment-Specific Config

For different environments, create separate config files:

```
public/
├── config.json              # Default/production config
├── config.development.json  # Development overrides
├── config.staging.json      # Staging overrides
```

Update `loadConfig()` to use the correct file:

```typescript
const CONFIG_URL = import.meta.env.DEV 
  ? "/config.development.json" 
  : "/config.json";
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Config not loading | Check browser network tab for 404 on `/config.json` |
| CORS errors | Ensure config is served from same origin |
| Old values cached | Add cache buster: `/config.json?t=${Date.now()}` |
| TypeScript errors | Update `src/vite-env.d.ts` with config types |

---

## Summary

| AC | Implementation |
|----|----------------|
| AC1 | ✅ `public/config.json` with placeholder values |
| AC2 | ✅ `loadConfig()` called before `ReactDOM.createRoot()` |
| AC3 | ✅ `ConfigService` with `loadConfig()`, `getConfig()` |
| AC4 | ✅ Runtime fetch allows config changes without rebuild |
