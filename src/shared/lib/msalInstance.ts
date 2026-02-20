import { msalConfig } from "@/config/auth-config";
import { PublicClientApplication } from "@azure/msal-browser";

// Create a single shared MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize the instance
export const initializeMsal = async () => {
  await msalInstance.initialize();
  return msalInstance;
};
