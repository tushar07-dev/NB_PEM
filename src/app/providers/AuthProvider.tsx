import { useState, useCallback, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "@/types/user";
import { AuthContext } from "./AuthContext";
import { login } from "@/api/auth";
import { setApiToken } from "@/api/mutator/custom-instance";
import { setAuthToken as setClientAuthToken } from "@/api/client";
import { useAuthStore } from "@/shared/store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setProfile, clearProfile } = useAuthStore();

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await login(email, password);
        setCurrentUser(response.user);
        setAuthToken(response.authToken);
        setProfile(response.user);
      } finally {
        setIsLoading(false);
      }
    },
    [setProfile]
  );

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setAuthToken(null);
    clearProfile();
  }, [clearProfile]);

  // Keep both axios instances in sync with auth token on login/logout
  useEffect(() => {
    setApiToken(authToken);
    setClientAuthToken(authToken);
  }, [authToken]);

  const value = useMemo(
    () => ({
      currentUser,
      authToken,
      handleLogin,
      handleLogout,
      isLoading,
    }),
    [currentUser, authToken, handleLogin, handleLogout, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
