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
  handleLogout: () => Promise<void>;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = PropsWithChildren;

export default function AuthProvider({ children }: AuthProviderProps) {
  const [authToken, setAuthTokenState] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Sync token with axios interceptor
  useEffect(() => {
    setAuthToken(authToken);
  }, [authToken]);

  useEffect(() => {
    // Temporary bypass: directly set admin user
    const mockAdminUser: User = {
      name: "Admin User",
      id: 1,
      email: "admin@example.com",
      role: "admin",
    };
    const mockAuthToken = "mock-admin-token";

    setAuthTokenState(mockAuthToken);
    setCurrentUser(mockAdminUser);
  }, []);

  async function handleLogin(email: string, password: string) {
    try {
      const response = await login(email, password);

      setAuthTokenState(response.authToken);
      setCurrentUser(response.user);
    } catch {
      setAuthTokenState(null);
      setCurrentUser(null);
      throw new Error("Login failed");
    }
  }

  async function handleLogout() {
    setAuthTokenState(null);
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        authToken,
        currentUser,
        handleLogin,
        handleLogout,
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
