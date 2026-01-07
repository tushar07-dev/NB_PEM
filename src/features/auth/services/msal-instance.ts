import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../config/auth-config";

// Create a single shared MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize the instance
export const initializeMsal = async () => {
  await msalInstance.initialize();
  return msalInstance;
};
