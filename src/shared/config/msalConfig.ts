import { PublicClientApplication, type Configuration } from "@azure/msal-browser";
import { env } from "@/config/env";

const msalConfig: Configuration = {
  auth: {
    clientId: env.VITE_MSAL_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${env.VITE_MSAL_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: [env.VITE_MSAL_SCOPE],
};

export const msalInstance = new PublicClientApplication(msalConfig);

// MSAL v3+ requires initialize() to be awaited before ANY other API call.
// We export the promise so AuthProvider can await it once on mount.
// Calling initialize() multiple times is safe — it no-ops after the first call.
export const msalInitPromise = msalInstance.initialize();