// src/features/pem-check-lists/types/checklist.ts

// ─── Document role — derived at runtime from currentUser.email ────────────────
// Priority: ORIGINATOR > CHECKER > APPROVER > READ_ONLY
export type DocumentRole = "READ_ONLY" | "ORIGINATOR" | "CHECKER" | "APPROVER";

// ─── Document workflow status ─────────────────────────────────────────────────
// Drives which roles are interactive and what columns highlight in the table.
// Backend will eventually return this; until then it is derived frontend-only.
export type DocumentStatus =
  | "NOT_STARTED" // No originator assigned yet
  | "IN_PROGRESS" // Originator working — not yet sent to checker
  | "SENT_TO_CHECKER" // Sent — checker + approver interactive
  | "COMPLETED"; // All checks done

// ─── Check result for a single checkpoint ────────────────────────────────────
export type CheckResult = "OK" | "NA" | null;

// ─── A single checklist item ──────────────────────────────────────────────────
// Backend: GET /api/ProjectDocumentChecklists/GetProjectDocumentChecklists/{id}
// Signature format: "Full Name|2025-02-12T10:30:00.000Z"
// Use buildSignature() / parseSignature() below — never construct the string manually
export interface ChecklistItem {
  id: string; // String(checkpointId)
  serialNo: number; // 1-based display index
  checkpointId: number; // Required for SaveCheckResults payload
  description: string; // checkpoint text
  category: string; // checkpoint category
  qualityLevel: string[]; // array from API — display as badges
  checkResult: CheckResult; // "OK" | "NA" | null
  originatorSignature: string | null; // "Name|ISO timestamp" — set by ORIGINATOR
  checkerSignature: string | null; // "Name|ISO timestamp" — set by CHECKER
}

// ─── Signature helpers ────────────────────────────────────────────────────────
/** Build the pipe-delimited signature string the API expects. */
export function buildSignature(name: string): string {
  return `${name}|${new Date().toISOString()}`;
}
/** Parse a signature string back into its parts. Returns null if invalid. */
export function parseSignature(
  signature: string | null | undefined
): { name: string; date: Date } | null {
  if (!signature) return null;
  const idx = signature.lastIndexOf("|");
  if (idx === -1) return null;
  const name = signature.slice(0, idx).trim();
  const dateStr = signature.slice(idx + 1).trim();
  if (!name || !dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return { name, date }; // return raw Date object, not formatted string
}