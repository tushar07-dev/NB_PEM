import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { configService } from "@/shared/config/configService";

let appInsights: ApplicationInsights | null = null;

export function initMonitoring(): void {
  const { appInsightsConnectionString, enableMonitoring } =
    configService.monitoringConfig;

  if (!enableMonitoring || !appInsightsConnectionString) return;

  appInsights = new ApplicationInsights({
    config: {
      connectionString: appInsightsConnectionString,
      enableAutoRouteTracking: true,
    },
  });

  appInsights.loadAppInsights();
}

export function trackException(
  error: Error,
  properties?: Record<string, unknown>
): void {
  appInsights?.trackException({ exception: error, properties });
}

export function trackEvent(
  name: string,
  properties?: Record<string, unknown>
): void {
  appInsights?.trackEvent({ name }, properties);
}
