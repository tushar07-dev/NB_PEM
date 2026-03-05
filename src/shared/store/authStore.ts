// src/shared/store/authStore.ts
import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/user";

interface AuthStore {
  profile: User | null;
  setProfile: (user: User | null) => void;
  clearProfile: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        profile: null,
        setProfile: (user) => set({ profile: user }),
        clearProfile: () => set({ profile: null }),
      }),
      {
        name: "auth-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { name: "auth-store" }
  )
);
