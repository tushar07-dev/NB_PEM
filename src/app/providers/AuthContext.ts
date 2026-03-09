import { createContext } from "react";
import type { User } from "@/types/user";

export type AuthContextType = {
  currentUser: User | null;
  authToken: string | null;
  isLoading: boolean;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
