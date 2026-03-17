// src/shared/store/activeDocumentStore.ts
//
// Single source of truth for the document currently open in the checklist
// detail page. Persisted to sessionStorage so page refresh works.
//
// Design decisions:
//
//  1. EMAIL NORMALIZATION
//     setDocument() lowercases all email fields once at the store boundary.
//     No other file needs to do this.
//
//  2. MUTABLE FIELDS
//     Only workflowStatus, checker, approver, originatorSelfCheck change
//     after a document is opened. patchDocument() only accepts these.
//     All other fields (title, documentNo, etc.) are display-only and fixed.
//
//  3. CLEARING
//     clearDocument() is called in:
//       — AuthProvider.handleLogout (alongside all other stores)
//       — DocumentTable on mount   (so arriving at the list always starts fresh)
//     This means back-navigation clears naturally (list mounts → clears).
//
//  4. SESSION SCOPE
//     sessionStorage means each browser tab has its own document.
//     Two tabs can work on different documents independently.

import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import type { DocumentEntry } from "@/features/pem-check-lists/types/document";

// Only these fields change after the document is opened
type MutableDocumentFields = Pick<
  DocumentEntry,
  "workflowStatus" | "checker" | "approver" | "originatorSelfCheck"
>;

interface ActiveDocumentStore {
  document: DocumentEntry | null;

  /** Write a new document — normalizes email fields to lowercase */
  setDocument: (doc: DocumentEntry) => void;

  /** Clear the active document (on logout, on arriving at list page) */
  clearDocument: () => void;

  /** Update only the fields that can change mid-session */
  patchDocument: (patch: Partial<MutableDocumentFields>) => void;
}

export const useActiveDocumentStore = create<ActiveDocumentStore>()(
  devtools(
    persist(
      (set) => ({
        document: null,

        setDocument: (doc) =>
          set({
            document: {
              ...doc,
              // Single normalization point — no other file needs toLowerCase()
              originatorSelfCheck:
                doc.originatorSelfCheck?.toLowerCase() ?? null,
              checker: doc.checker?.toLowerCase() ?? null,
              approver: doc.approver?.toLowerCase() ?? null,
            },
          }),

        clearDocument: () => set({ document: null }),

        patchDocument: (patch) =>
          set((state) => ({
            document: state.document
              ? { ...state.document, ...patch }
              : state.document,
          })),
      }),
      {
        name: "active-document-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { name: "active-document-store" }
  )
);
