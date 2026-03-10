// src/shared/store/documentFilterStore.ts
//
// Persists the 6 document-selection filter values across navigation.
// Intentionally separate from filter-store.ts — that store manages
// TanStack Table column filters (UI state). This store manages the
// API query parameters that drive GetProjectDocuments.
//
// Cleared on:
//   - logout        (AuthProvider calls resetDocumentFilters)
//   - project change (top-header calls resetDocumentFilters)
//   - PEM change    (top-header calls resetDocumentFilters)

import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import type { DocumentFiltersType } from "@/features/pem-check-lists/types/document";

interface DocumentFilterStore {
  filters: DocumentFiltersType;
  setFilter: (updates: Partial<DocumentFiltersType>) => void;
  resetDocumentFilters: () => void;
}

const EMPTY: DocumentFiltersType = {
  discipline: undefined,
  documentGroup: undefined,
  documentType: undefined,
  facilityCode: undefined,
  system: undefined,
  area: undefined,
};

export const useDocumentFilterStore = create<DocumentFilterStore>()(
  devtools(
    persist(
      (set) => ({
        filters: EMPTY,

        setFilter: (updates) =>
          set((state) => ({
            filters: { ...state.filters, ...updates },
          })),

        resetDocumentFilters: () => set({ filters: EMPTY }),
      }),
      {
        name: "document-filter-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { name: "document-filter-store" }
  )
);
