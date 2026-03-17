// src/shared/config/users.ts
//
// Frontend-only user list until /api/Users endpoint is available.
// TODO: Replace with useUsers() hook once endpoint is ready.
//
// Used by:
//   — DocumentTable (Define Responsibilities dialog)
//   — checklist-detail-page-v2 (SendDocumentFlow)

import type { Option } from "@/shared/components/ui/SearchableFilterSelect";

export const ALL_USERS: Option[] = [
  {
    label: "Sanghati Chatterjee",
    value: "sanghati.chatterjee2@akersolutions.com",
  },
  { label: "Nilesh Thakur", value: "nilesh.thakur@akersolutions.com" },
  { label: "Tushar Shelke", value: "tushar.shelke@akersolutions.com" },
  { label: "Shiv Kumar", value: "shiv.kumar@akersolutions.com" },
  { label: "Rohit Shelar", value: "rohit.shelar@akersolutions.com" },
  { label: "Amir Ashtari", value:  "amir.h.ashtari@akersolutions.com"}
];

// Email → display name lookup
// O(1) lookup, built once at module level
const USER_NAME_BY_EMAIL = new Map(
  ALL_USERS.map((u) => [u.value.toLowerCase(), u.label])
);

// Helper
export function getDisplayName(email: string | null | undefined): string {
  if (!email?.trim()) return "—";
  return USER_NAME_BY_EMAIL.get(email.toLowerCase()) ?? email;
}