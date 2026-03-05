// Re-export from the proper msalConfig that handles async config loading
export {
  getMsalInstance as msalInstance,
  initializeMsalInstance,
} from "@/shared/config/msalConfig";
