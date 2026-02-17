import { login } from "@/api/auth";
import type { User } from "@/types/user";
import { setAuthToken } from "@/api/client";
import { useEffect, useState, type PropsWithChildren } from "react";
import { AuthContext } from "./AuthContext";

type AuthProviderProps = PropsWithChildren;

function getStoredAuth(): { token: string | null; user: User | null } {
  try {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("currentUser");
    if (token && userStr) {
      return { token, user: JSON.parse(userStr) };
    }
  } catch {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
  }
  return { token: null, user: null };
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [authToken, setAuthTokenState] = useState<string | null>(
    () => getStoredAuth().token
  );
  const [currentUser, setCurrentUser] = useState<User | null>(
    () => getStoredAuth().user
  );
  const [isLoading] = useState(false);

  useEffect(() => {
    if (authToken) {
      setAuthToken(authToken);
    }
  });

  async function handleLogin(email: string, password: string) {
    try {
      const response = await login(email, password);

      setAuthTokenState(response.authToken);
      setCurrentUser(response.user);
      setAuthToken(response.authToken);

      localStorage.setItem("authToken", response.authToken);
      localStorage.setItem("currentUser", JSON.stringify(response.user));

      console.log("🔐 User logged in:", response.user.role);
    } catch (error) {
      setAuthTokenState(null);
      setCurrentUser(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      throw error instanceof Error ? error : new Error("Login failed");
    }
  }

  function handleLogout() {
    console.log("🔓 User logged out");
    setAuthTokenState(null);
    setCurrentUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setAuthToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        authToken,
        currentUser,
        handleLogin,
        handleLogout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
