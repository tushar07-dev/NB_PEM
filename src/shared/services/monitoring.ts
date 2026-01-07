import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { configService } from '@/shared/config/configService'

let appInsights: ApplicationInsights | null = null

export function initMonitoring() {
  try {
    const monitoringConfig = configService.monitoringConfig

    if (monitoringConfig.enableMonitoring && monitoringConfig.appInsightsConnectionString) {
      appInsights = new ApplicationInsights({
        config: {
          connectionString: monitoringConfig.appInsightsConnectionString,
          enableAutoRouteTracking: true,
          enableRequestHeaderTracking: true,
          enableResponseHeaderTracking: true,
          enableAjaxErrorStatusText: true,
          enableUnhandledPromiseRejectionTracking: true,
          enableAjaxPerfTracking: true,
        }
      })
      appInsights.loadAppInsights()
      appInsights.trackPageView()
    }
  } catch (error) {
    console.warn('Failed to initialize monitoring:', error)
  }
}

export function trackException(error: Error, properties?: Record<string, any>) {
  if (appInsights) {
    appInsights.trackException({
      exception: error,
      properties
    })
  }
}

export function trackEvent(name: string, properties?: Record<string, any>) {
  if (appInsights) {
    appInsights.trackEvent({ name }, properties)
  }
}

export function trackTrace(message: string, severityLevel?: number) {
  if (appInsights) {
    appInsights.trackTrace({ message, severityLevel })
  }
}
