import { type ReactNode, useState, useCallback, useEffect } from "react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import {
  msalInstance,
  msalInitPromise,
  loginRequest,
} from "@/shared/config/msalConfig";
import type { AccountInfo } from "@azure/msal-browser";
import {
  setApiToken,
  setTokenRefreshCallback,
} from "@/api/mutator/custom-instance";
import { useAuthStore } from "@/shared/store/authStore";
import { useProjectStore } from "@/shared/store/projectStore";
import { useFilterStore } from "@/shared/store/filter-store";
import { AuthContext } from "./AuthContext";

// ── Hardcoded admin emails (TECH DEBT) ────────────────────────────────────────
// TODO: Replace with MSAL token claims (account.idTokenClaims?.roles) once
// Azure AD App Roles are configured in the app manifest by the backend team.
const ADMIN_EMAILS = [
  "tushar.shelke@akersolutions.com",
  "sanghati.chatterjee2@akersolutions.com",
  "nilesh.thakur@akersolutions.com",
];

interface CurrentUser {
  name: string;
  email: string;
  role: "admin" | "user";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setProfile, clearProfile } = useAuthStore();
  const clearProject = useProjectStore((s) => s.clearProject);
  const resetFilters = useFilterStore((s) => s.resetFilters);

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Token acquisition: silent → popup fallback ────────────────────────────
  // NOTE: msalInitPromise must be awaited before this is called.
  const acquireToken = useCallback(
    async (account: AccountInfo): Promise<string | null> => {
      try {
        const result = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account,
        });
        return result.accessToken;
      } catch (silentError) {
        if (import.meta.env.DEV) {
          console.warn(
            "[AuthProvider] Silent token acquisition failed, trying popup:",
            silentError
          );
        }

        if (silentError instanceof InteractionRequiredAuthError) {
          try {
            const result = await msalInstance.acquireTokenPopup({
              ...loginRequest,
              account,
            });
            return result.accessToken;
          } catch (popupError) {
            if (import.meta.env.DEV) {
              console.error(
                "[AuthProvider] Popup token acquisition failed:",
                popupError
              );
            }
            return null;
          }
        }

        return null;
      }
    },
    []
  );

  // ── Session restore on mount ──────────────────────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      try {
        // MSAL v3+ REQUIREMENT: initialize() must complete before any other
        // MSAL API (getAllAccounts, acquireTokenSilent, loginPopup, etc).
        // msalInitPromise is created once when msalConfig.ts is imported,
        // so awaiting it here is safe and idempotent.
        await msalInitPromise;

        const accounts = msalInstance.getAllAccounts();
        if (accounts.length === 0) {
          return; // No session — show login page
        }

        const account = accounts[0];
        const token = await acquireToken(account);

        if (token) {
          const email = account.username ?? "";
          const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
          const user: CurrentUser = {
            name: account.name ?? email,
            email,
            role: isAdmin ? "admin" : "user",
          };

          setCurrentUser(user);
          setAuthToken(token);
          setApiToken(token);
          setProfile(user);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("[AuthProvider] Session restore failed:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void initAuth();
  }, [acquireToken, setProfile]);

  // ── Wire token refresh callback to Axios interceptor ─────────────────────
  const refreshToken = useCallback(async (): Promise<string | null> => {
    // msalInitPromise is already resolved by the time any API call triggers
    // a 401, but await it defensively in case of edge-case early calls.
    await msalInitPromise;
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) return null;

    const token = await acquireToken(accounts[0]);
    if (token) {
      setAuthToken(token);
      setApiToken(token);
    }
    return token;
  }, [acquireToken]);

  useEffect(() => {
    setTokenRefreshCallback(refreshToken);
  }, [refreshToken]);

  // ── Login ─────────────────────────────────────────────────────────────────
  const handleLogin = useCallback(async () => {
    try {
      // Must await initialization before loginPopup — this is what was
      // causing the login button to silently do nothing.
      await msalInitPromise;

      const result = await msalInstance.loginPopup(loginRequest);
      const token = await acquireToken(result.account);

      if (token) {
        const email = result.account.username ?? "";
        const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
        const user: CurrentUser = {
          name: result.account.name ?? email,
          email,
          role: isAdmin ? "admin" : "user",
        };

        setCurrentUser(user);
        setAuthToken(token);
        setApiToken(token);
        setProfile(user);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("[AuthProvider] Login failed:", error);
      }
      // Re-throw so LoginPage's try/catch can handle navigation correctly
      throw error;
    }
  }, [acquireToken, setProfile]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = useCallback(async () => {
    try {
      await msalInitPromise;
      await msalInstance.logoutPopup();
    } finally {
      setCurrentUser(null);
      setAuthToken(null);
      setApiToken(null);
      clearProfile();
      clearProject();
      resetFilters();
    }
  }, [clearProfile, clearProject, resetFilters]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authToken,
        isLoading,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
