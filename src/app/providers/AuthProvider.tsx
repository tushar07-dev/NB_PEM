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
import { useGenericPEMStore } from "@/shared/store/genericPemStore";
import { AuthContext } from "./AuthContext";
import { ROLES } from "@/shared/types/roles";
import type { User } from "@/shared/types/user";

// ── Hardcoded admin emails (TECH DEBT) ────────────────────────────────────────
// TODO: Replace with MSAL token claims (account.idTokenClaims?.roles) once
// Azure AD App Roles are configured in the app manifest by the backend team.
const ADMIN_EMAILS = [
  "tushar.shelke@akersolutions.com",
  "sanghati.chatterjee2@akersolutions.com",
  "nilesh.thakur@akersolutions.com",
  "Rohit.Shelar@akersolutions.com",
];

/**
 * Builds a User object from an MSAL AccountInfo.
 * Uses account.localAccountId as the stable unique id — this is a GUID
 * that MSAL assigns per account and is consistent across sessions.
 */
function buildUser(account: AccountInfo): User {
  const email = account.username ?? "";
  const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
  return {
    id: account.localAccountId,
    name: account.name ?? email,
    email,
    role: isAdmin ? ROLES.ADMIN : ROLES.USER,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setProfile, clearProfile } = useAuthStore();
  const clearProject = useProjectStore((s) => s.clearProject);
  const resetFilters = useFilterStore((s) => s.resetFilters);
  const clearGenericPEM = useGenericPEMStore((s) => s.clearGenericPEM);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Token acquisition: silent → popup fallback ────────────────────────────
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
        await msalInitPromise;

        const accounts = msalInstance.getAllAccounts();
        if (accounts.length === 0) return;

        const account = accounts[0];
        if (!account) return;
        const token = await acquireToken(account);

        if (token) {
          const user = buildUser(account);
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
    await msalInitPromise;
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) return null;

    const account = accounts[0];
    if (!account) return null;
    const token = await acquireToken(account);
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
      await msalInitPromise;

      const result = await msalInstance.loginPopup(loginRequest);
      const token = await acquireToken(result.account);

      if (token) {
        const user = buildUser(result.account);
        setCurrentUser(user);
        setAuthToken(token);
        setApiToken(token);
        setProfile(user);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("[AuthProvider] Login failed:", error);
      }
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
      clearGenericPEM();
      resetFilters();
    }
  }, [clearProfile, clearProject, clearGenericPEM, resetFilters]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authToken,
        isLoading,
        handleLogin,
        handleLogout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
