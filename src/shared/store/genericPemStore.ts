// src/shared/store/genericPemStore.ts
import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";

export type GenericPEM = {
  value: string;
  label: string;
};

interface GenericPEMStore {
  selectedGenericPEM: GenericPEM | null;
  setSelectedGenericPEM: (pem: GenericPEM | null) => void;
  clearGenericPEM: () => void;
}

export const useGenericPEMStore = create<GenericPEMStore>()(
  devtools(
    persist(
      (set) => ({
        selectedGenericPEM: null,
        setSelectedGenericPEM: (pem) => set({ selectedGenericPEM: pem }),
        clearGenericPEM: () => set({ selectedGenericPEM: null }),
      }),
      {
        name: "generic-pem-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { name: "generic-pem-store" }
  )
);
