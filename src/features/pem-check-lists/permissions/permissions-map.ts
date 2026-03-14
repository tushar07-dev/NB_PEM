// src/features/pem-check-lists/permissions/permissions-map.ts
//
// Single source of truth for role × status permissions.
// Add/remove capabilities here — the rest of the app reads from this map.

import type { DocumentRole } from "../types/checklist";
import type { DocumentWorkflowStatus } from "../components/DocumentTable";

// ─── Permission flags ─────────────────────────────────────────────────────────

export interface DocumentPermissions {
  /** User can toggle OK/NA on checklist items */
  canEditChecklist: boolean;
  /** "Send to Checker" button visible + enabled */
  canSend: boolean;
  /** Checker reject / complete buttons visible */
  canRejectAsChecker: boolean;
  canCompleteAsChecker: boolean;
  /** Approver reject / approve buttons visible */
  canRejectAsApprover: boolean;
  canApprove: boolean;
  /** Show progress bar (done/total) */
  showProgress: boolean;
  /** The entire checklist + header is locked (read-only view) */
  isLocked: boolean;
  /** Banner type + message — null means no banner */
  banner: { variant: "info" | "warning"; message: string } | null;
}

// ─── Default: everything locked ───────────────────────────────────────────────

const LOCKED: DocumentPermissions = {
  canEditChecklist: false,
  canSend: false,
  canRejectAsChecker: false,
  canCompleteAsChecker: false,
  canRejectAsApprover: false,
  canApprove: false,
  showProgress: false,
  isLocked: true,
  banner: null,
};

// ─── Helpers to build partial overrides cleanly ───────────────────────────────

function withOverrides(
  overrides: Partial<DocumentPermissions>
): DocumentPermissions {
  return { ...LOCKED, ...overrides };
}

// ─── The map ──────────────────────────────────────────────────────────────────
// Key: `${DocumentRole}:${DocumentWorkflowStatus}`
//
// Any combination not listed falls back to LOCKED.

type PermissionKey = `${DocumentRole}:${DocumentWorkflowStatus}`;

const PERMISSIONS_MAP: Record<PermissionKey, DocumentPermissions> = {
  // ── NOT_STARTED — regardless of role, show info banner ──────────────────
  "ORIGINATOR:NOT_STARTED": withOverrides({
    banner: {
      variant: "info",
      message:
        'Responsibilities have not been defined for this document yet. Click "Define Responsibilities" to assign the originator, checker, and approver.',
    },
  }),
  "CHECKER:NOT_STARTED": withOverrides({
    banner: {
      variant: "info",
      message:
        'Responsibilities have not been defined for this document yet. Click "Define Responsibilities" to assign the originator, checker, and approver.',
    },
  }),
  "APPROVER:NOT_STARTED": withOverrides({
    banner: {
      variant: "info",
      message:
        'Responsibilities have not been defined for this document yet. Click "Define Responsibilities" to assign the originator, checker, and approver.',
    },
  }),
  "READ_ONLY:NOT_STARTED": withOverrides({
    banner: {
      variant: "info",
      message:
        'Responsibilities have not been defined for this document yet. Click "Define Responsibilities" to assign the originator, checker, and approver.',
    },
  }),

  // ── ORIGINATOR ──────────────────────────────────────────────────────────
  "ORIGINATOR:PENDING_WITH_ORIGINATOR": withOverrides({
    canEditChecklist: true,
    canSend: true, // UI will disable until 100% complete
    showProgress: true,
    isLocked: false,
    banner: {
      variant: "warning",
      message:
        'You haven\'t sent this document to the checker yet. Complete the checklist and click "Send to Checker".',
    },
  }),
  "ORIGINATOR:REJECTED_BY_CHECKER": withOverrides({
    canEditChecklist: true,
    canSend: true,
    showProgress: true,
    isLocked: false,
    banner: {
      variant: "warning",
      message:
        "The checker has rejected this document. Check your email for the reason, update the checklist, and re-send.",
    },
  }),
  "ORIGINATOR:REJECTED_BY_APPROVER": withOverrides({
    canEditChecklist: true,
    canSend: true,
    showProgress: true,
    isLocked: false,
    banner: {
      variant: "warning",
      message:
        "The approver has rejected this document. Check your email for the reason, update the checklist, and re-send.",
    },
  }),
  "ORIGINATOR:PENDING_WITH_CHECKER": withOverrides({
    banner: {
      variant: "info",
      message:
        "You have sent this document to the checker. Waiting for their review.",
    },
  }),
  "ORIGINATOR:PENDING_WITH_APPROVER": withOverrides({
    banner: {
      variant: "info",
      message:
        "The checker has completed their review. Waiting for the approver.",
    },
  }),
  "ORIGINATOR:COMPLETED": withOverrides({
    banner: null,
  }),

  // ── CHECKER ─────────────────────────────────────────────────────────────
  "CHECKER:PENDING_WITH_CHECKER": withOverrides({
    canEditChecklist: true,
    canRejectAsChecker: true,
    canCompleteAsChecker: true,
    isLocked: false,
    banner: null,
  }),
  "CHECKER:PENDING_WITH_ORIGINATOR": withOverrides({
    banner: {
      variant: "warning",
      message:
        "This document has not been sent to you yet. You will be notified by email when the originator submits it.",
    },
  }),
  "CHECKER:REJECTED_BY_CHECKER": withOverrides({
    banner: {
      variant: "info",
      message:
        "You rejected this document. Waiting for the originator to update and re-send.",
    },
  }),
  "CHECKER:REJECTED_BY_APPROVER": withOverrides({
    banner: {
      variant: "warning",
      message:
        "The approver has rejected this document. Waiting for the originator to update.",
    },
  }),
  "CHECKER:PENDING_WITH_APPROVER": withOverrides({
    banner: {
      variant: "info",
      message: "You have completed your review. Waiting for the approver.",
    },
  }),
  "CHECKER:COMPLETED": withOverrides({
    banner: null,
  }),

  // ── APPROVER ────────────────────────────────────────────────────────────
  "APPROVER:PENDING_WITH_APPROVER": withOverrides({
    canEditChecklist: true,
    canRejectAsApprover: true,
    canApprove: true,
    isLocked: false,
    banner: null,
  }),
  "APPROVER:PENDING_WITH_ORIGINATOR": withOverrides({
    banner: {
      variant: "warning",
      message:
        "The checker has not completed their review yet. You will be notified by email when it is ready for approval.",
    },
  }),
  "APPROVER:PENDING_WITH_CHECKER": withOverrides({
    banner: {
      variant: "warning",
      message:
        "The checker has not completed their review yet. You will be notified by email when it is ready for approval.",
    },
  }),
  "APPROVER:REJECTED_BY_CHECKER": withOverrides({
    banner: {
      variant: "warning",
      message:
        "The checker has not completed their review yet. You will be notified by email when it is ready for approval.",
    },
  }),
  "APPROVER:REJECTED_BY_APPROVER": withOverrides({
    banner: {
      variant: "info",
      message:
        "You rejected this document. Waiting for the originator to update and re-send.",
    },
  }),
  "APPROVER:COMPLETED": withOverrides({
    banner: null,
  }),

  // ── READ_ONLY — always locked, info banner ──────────────────────────────
  "READ_ONLY:PENDING_WITH_ORIGINATOR": withOverrides({
    banner: {
      variant: "info",
      message:
        "You are not assigned to this document. You can view it but cannot make any changes.",
    },
  }),
  "READ_ONLY:PENDING_WITH_CHECKER": withOverrides({
    banner: {
      variant: "info",
      message:
        "You are not assigned to this document. You can view it but cannot make any changes.",
    },
  }),
  "READ_ONLY:PENDING_WITH_APPROVER": withOverrides({
    banner: {
      variant: "info",
      message:
        "You are not assigned to this document. You can view it but cannot make any changes.",
    },
  }),
  "READ_ONLY:REJECTED_BY_CHECKER": withOverrides({
    banner: {
      variant: "info",
      message:
        "You are not assigned to this document. You can view it but cannot make any changes.",
    },
  }),
  "READ_ONLY:REJECTED_BY_APPROVER": withOverrides({
    banner: {
      variant: "info",
      message:
        "You are not assigned to this document. You can view it but cannot make any changes.",
    },
  }),
  "READ_ONLY:COMPLETED": withOverrides({
    banner: null,
  }),
} as Record<string, DocumentPermissions>;

// ─── Lookup function ──────────────────────────────────────────────────────────

export function getPermissions(
  role: DocumentRole,
  status: DocumentWorkflowStatus
): DocumentPermissions {
  const key: PermissionKey = `${role}:${status}`;
  return (PERMISSIONS_MAP[key] as DocumentPermissions | undefined) ?? LOCKED;
}

// ─── Role derivation (moved from page) ───────────────────────────────────────

export function deriveRole(
  userEmail: string,
  document: {
    originatorSelfCheck?: string | null;
    checker?: string | null;
    approver?: string | null;
  }
): DocumentRole {
  const email = userEmail.toLowerCase();
  if (document.originatorSelfCheck?.toLowerCase() === email)
    return "ORIGINATOR";
  if (document.checker?.toLowerCase() === email) return "CHECKER";
  if (document.approver?.toLowerCase() === email) return "APPROVER";
  return "READ_ONLY";
}

// ─── Role badge config ────────────────────────────────────────────────────────

export const ROLE_BADGE: Record<
  DocumentRole,
  { label: string; className: string }
> = {
  ORIGINATOR: {
    label: "Originator (Self Check)",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  CHECKER: {
    label: "Checker",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  APPROVER: {
    label: "Approver",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  READ_ONLY: {
    label: "Read Only",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};
