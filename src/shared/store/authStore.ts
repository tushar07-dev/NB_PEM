// src/shared/store/authStore.ts
import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import type { User } from "@/shared/types/user";

interface AuthStore {
  profile: Pick<User, "name" | "email"> | null;
  setProfile: (user: User | null) => void;
  clearProfile: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        profile: null,
        setProfile: (user) =>
          set({
            profile: user
              ? { name: user.name, email: user.email }
              : null,
          }),

        clearProfile: () => set({ profile: null }),
      }),
      {
        name: "auth-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({ profile: state.profile }),
      }
    ),
    { name: "auth-store" }
  )
);
