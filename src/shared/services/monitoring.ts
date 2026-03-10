import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { env } from "@/config/env";

let appInsights: ApplicationInsights | null = null;

export function initMonitoring(): void {
  const connectionString = env.VITE_APP_INSIGHTS_CONNECTION_STRING;

  if (!connectionString) return;

  appInsights = new ApplicationInsights({
    config: {
      connectionString,
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
