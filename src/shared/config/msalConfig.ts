import { type Configuration, PublicClientApplication } from "@azure/msal-browser"
import { configService } from "./configService"

// Note: msalInstance will be initialized after config is loaded
let msalInstance: PublicClientApplication | null = null

export function initializeMsalInstance() {
  const authConfig = configService.authConfig

  const msalConfig: Configuration = {
    auth: {
      clientId: authConfig.clientId,
      authority: authConfig.authority,
      redirectUri: authConfig.redirectUri || window.location.origin,
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    },
  };

  msalInstance = new PublicClientApplication(msalConfig)
  return msalInstance
}

export function getMsalInstance(): PublicClientApplication {
  if (!msalInstance) {
    throw new Error('MSAL instance not initialized. Call initializeMsalInstance() after config is loaded.')
  }
  return msalInstance
}