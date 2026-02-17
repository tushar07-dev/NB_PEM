import { createContext } from "react";
import type { User } from "@/types/user";

export type AuthContextType = {
  authToken: string | null;
  currentUser: User | null;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleLogout: () => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
