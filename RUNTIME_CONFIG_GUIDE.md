# Runtime Configuration Implementation

## Overview

This document describes the runtime configuration system implemented for the NB PEM application. The system allows configuration to be loaded dynamically at runtime without requiring application rebuilds, enabling flexible deployment across different environments.

## User Story Acceptance Criteria

### ✅ AC1: `/public/config.json` file must exist with placeholder values
- **Location**: `/public/config.json`
- **Purpose**: Contains all runtime configuration values
- **Structure**: JSON format with nested configuration objects

### ✅ AC2: Config must load before app initialization
- **Implementation**: `main.tsx` loads config asynchronously before rendering the app
- **Error Handling**: Graceful fallback if config loading fails
- **Blocking**: App will not start until config is successfully loaded

### ✅ AC3: ConfigService implemented to read runtime vars
- **Location**: `src/shared/config/configService.ts`
- **Features**:
  - Singleton pattern for config management
  - Type-safe configuration interface
  - Validation of required fields
  - Fallback to environment variables if config.json fails

### ✅ AC4: App must work even when config changes without rebuild
- **Runtime Loading**: Config is fetched via HTTP request to `/config.json`
- **No Build Dependency**: Configuration changes don't require rebuilding the application
- **Hot Reload**: Changes to config.json are picked up on page refresh

## Configuration Structure

```json
{
  "api": {
    "baseUrl": "https://api.example.com",
    "timeout": 10000
  },
  "auth": {
    "clientId": "your-msal-client-id",
    "tenantId": "your-tenant-id",
    "authority": "https://login.microsoftonline.com/your-tenant-id",
    "redirectUri": "http://localhost:5173"
  },
  "monitoring": {
    "appInsightsConnectionString": "InstrumentationKey=your-key-here;IngestionEndpoint=https://your-region.in.applicationinsights.azure.com/;LiveEndpoint=https://your-region.livediagnostics.monitor.azure.com/",
    "enableMonitoring": false
  },
  "features": {
    "enableDebugMode": false,
    "enableAnalytics": false
  },
  "environment": {
    "name": "development",
    "version": "1.0.0"
  }
}
```

## Implementation Details

### ConfigService Class

```typescript
interface AppConfig {
  api: {
    baseUrl: string
    timeout: number
  }
  auth: {
    clientId: string
    tenantId: string
    authority: string
    redirectUri: string
  }
  monitoring: {
    appInsightsConnectionString: string
    enableMonitoring: boolean
  }
  features: {
    enableDebugMode: boolean
    enableAnalytics: boolean
  }
  environment: {
    name: string
    version: string
  }
}

class ConfigService {
  private config: AppConfig | null = null
  private isLoaded = false

  async loadConfig(): Promise<AppConfig> {
    // Implementation details in configService.ts
  }

  getConfig(): AppConfig {
    // Returns loaded config or throws error
  }

  // Utility methods
  get apiBaseUrl(): string
  get authConfig()
  get monitoringConfig()
  get isDevelopment(): boolean
  get isProduction(): boolean
}
```

### Initialization Flow

1. **App Start**: `initializeApp()` function called in `main.tsx`
2. **Config Load**: `configService.loadConfig()` fetches `/config.json`
3. **Validation**: Config is validated for required fields
4. **Service Init**: Services are initialized with loaded config:
   - `initializeApi()` - Sets up axios with runtime base URL
   - `initializeMsalInstance()` - Configures MSAL with runtime auth settings
   - `initMonitoring()` - Sets up App Insights if enabled
5. **App Render**: React app renders with configured services

### Error Handling

- **Config Load Failure**: Falls back to environment variables
- **Validation Failure**: Throws descriptive error messages
- **Service Init Failure**: App shows error screen with retry option
- **Network Issues**: Graceful degradation with console warnings

## Service Integration

### Axios Service
```typescript
export function initializeApi() {
  const config = configService.getConfig()

  api = axios.create({
    baseURL: config.api.baseUrl,  // Runtime config
    timeout: config.api.timeout,  // Runtime config
  })
}
```

### MSAL Configuration
```typescript
export function initializeMsalInstance() {
  const authConfig = configService.authConfig

  const msalConfig: Configuration = {
    auth: {
      clientId: authConfig.clientId,      // Runtime config
      authority: authConfig.authority,    // Runtime config
      redirectUri: authConfig.redirectUri, // Runtime config
    },
  }
}
```

### Monitoring Service
```typescript
export function initMonitoring() {
  const monitoringConfig = configService.monitoringConfig

  if (monitoringConfig.enableMonitoring && monitoringConfig.appInsightsConnectionString) {
    // Initialize with runtime config
  }
}
```

## Deployment Scenarios

### Development Environment
```json
{
  "environment": { "name": "development" },
  "api": { "baseUrl": "http://localhost:3000/api" },
  "monitoring": { "enableMonitoring": false }
}
```

### Staging Environment
```json
{
  "environment": { "name": "staging" },
  "api": { "baseUrl": "https://api-staging.example.com" },
  "monitoring": { "enableMonitoring": true }
}
```

### Production Environment
```json
{
  "environment": { "name": "production" },
  "api": { "baseUrl": "https://api.example.com" },
  "monitoring": { "enableMonitoring": true }
}
```

## Configuration Management

### File Location
- **Development**: `/public/config.json` (served by Vite dev server)
- **Production**: `/config.json` (served from web server root)

### Update Process
1. **Modify**: Update `config.json` on the server
2. **Deploy**: No application rebuild required
3. **Activate**: Changes take effect on next page load/refresh

### Validation
- **Required Fields**: `api.baseUrl`, `auth.clientId`, `auth.tenantId`
- **Type Checking**: TypeScript interfaces ensure type safety
- **Runtime Validation**: Config is validated before use

## Best Practices

### Configuration Design
- **Hierarchical**: Group related settings (api, auth, monitoring)
- **Defaults**: Provide sensible defaults for optional settings
- **Validation**: Validate required fields and types
- **Documentation**: Document all configuration options

### Deployment
- **Environment-Specific**: Different configs for dev/staging/prod
- **Version Control**: Keep config templates in version control
- **Secrets**: Never store secrets in config.json (use server-side config)
- **Backup**: Maintain backup configs for rollback scenarios

### Error Handling
- **Graceful Degradation**: App works with minimal config
- **Clear Messages**: Descriptive error messages for config issues
- **Fallbacks**: Environment variable fallbacks for critical settings
- **Monitoring**: Track config load failures

## Testing

### Unit Tests
```typescript
describe('ConfigService', () => {
  it('should load config from /config.json', async () => {
    const config = await configService.loadConfig()
    expect(config.api.baseUrl).toBeDefined()
  })

  it('should validate required fields', async () => {
    // Test validation logic
  })
})
```

### Integration Tests
```typescript
describe('App Initialization', () => {
  it('should load config before rendering', async () => {
    // Test that config is loaded before app starts
  })

  it('should initialize services with config', async () => {
    // Test service initialization
  })
})
```

## Troubleshooting

### Common Issues

**Config not loading**
- Check network connectivity
- Verify `/config.json` is accessible
- Check browser console for errors

**Invalid config format**
- Validate JSON syntax
- Check required fields are present
- Review TypeScript interface for expected structure

**Services not initializing**
- Ensure config loaded successfully
- Check service initialization order
- Verify config values are valid

### Debug Mode
Enable debug mode in config to get detailed logging:
```json
{
  "features": {
    "enableDebugMode": true
  }
}
```

## Migration from Environment Variables

### Before (Environment Variables)
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
const clientId = import.meta.env.VITE_MSAL_CLIENT_ID
```

### After (Runtime Config)
```typescript
const config = configService.getConfig()
const apiUrl = config.api.baseUrl
const clientId = config.auth.clientId
```

### Migration Steps
1. Create `config.json` with current environment values
2. Update code to use `configService`
3. Test in development environment
4. Deploy config files to staging/production
5. Remove old environment variables

This runtime configuration system provides flexibility, maintainability, and deployment ease while maintaining type safety and error handling robustness.