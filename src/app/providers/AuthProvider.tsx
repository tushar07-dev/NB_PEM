import { getUser, login } from "@/api/auth";
import type { User } from "@/types/user";
import { setAuthToken } from "@/shared/services/axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

type AuthContext = {
  authToken: string | null;
  currentUser: User | null;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleLogout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = PropsWithChildren;

export default function AuthProvider({ children }: AuthProviderProps) {
  const [authToken, setAuthTokenState] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("currentUser");

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthTokenState(storedToken);
        setCurrentUser(user);
        setAuthToken(storedToken);
        console.log("🔐 User logged in:", user.role);
      } catch (error) {
        console.error("Failed to parse stored user data");
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  // Sync token with axios interceptor
  useEffect(() => {
    if (authToken) {
      setAuthToken(authToken);
    }
  }, [authToken]);

  async function handleLogin(email: string, password: string) {
    try {
      const response = await login(email, password);

      setAuthTokenState(response.authToken);
      setCurrentUser(response.user);

      // Persist to localStorage
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

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside of a AuthProvider");
  }

  return context;
}
