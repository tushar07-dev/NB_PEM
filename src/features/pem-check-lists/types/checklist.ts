// src/features/pem-check-lists/types/checklist.ts

// ─── Document role — derived at runtime from currentUser.email ────────────────
// READ_ONLY  : user is not assigned to this document
// ORIGINATOR : user's email === document.originatorSelfCheck
// CHECKER    : user's email === document.checker  AND doc has been sent to checker
// APPROVER   : user's email === document.approver AND doc has been sent to approver
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
export interface ChecklistItem {
  /** React list key — same value as checkpointId as string */
  id: string;
  /** Backend primary key — sent to SaveCheckResults */
  checkpointId: number;
  serialNo: number;
  description: string;
  category: string | null;
  qualityLevel: string[] | null;
  checkResult: CheckResult;
  /** Raw backend value: "name|ISO" — use parseSignature() to display */
  originatorSignature: string | null;
  /** Raw backend value: "name|ISO" — use parseSignature() to display */
  checkerSignature: string | null;
}

// ─── Signature helpers ────────────────────────────────────────────────────────
// Format stored on the backend: "Full Name|2025-02-12T10:30:00.000Z"

export function buildSignature(name: string): string {
  return `${name}|${new Date().toISOString()}`;
}

export function parseSignature(
  raw: string | null | undefined
): { name: string; date: string } | null {
  if (!raw) return null;
  const idx = raw.lastIndexOf("|");
  if (idx === -1) return null;
  const name = raw.slice(0, idx).trim();
  const iso = raw.slice(idx + 1).trim();
  const d = new Date(iso);
  if (!name || isNaN(d.getTime())) return null;
  const date = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return { name, date };
}