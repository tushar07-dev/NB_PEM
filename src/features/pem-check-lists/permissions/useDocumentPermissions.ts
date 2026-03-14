// src/features/pem-check-lists/permissions/useDocumentPermissions.ts
//
// Encapsulates role derivation + permissions lookup into a single hook.
// The consuming page only needs to read the returned object.

import { useMemo } from "react";
import type { DocumentRole } from "../types/checklist";
import type {
  DocumentEntry,
  DocumentWorkflowStatus,
} from "../components/DocumentTable";
import {
  deriveRole,
  getPermissions,
  ROLE_BADGE,
  type DocumentPermissions,
} from "./permissions-map";

export interface UseDocumentPermissionsResult {
  role: DocumentRole;
  permissions: DocumentPermissions;
  roleBadge: { label: string; className: string };
  status: DocumentWorkflowStatus;
}

/**
 * Derives the user's role and looks up permissions from the centralized map.
 *
 * @param document  The document entry (from navigation state).
 * @param userEmail The current user's email — usually from useAuth().
 */
export function useDocumentPermissions(
  document: DocumentEntry | undefined,
  userEmail: string | undefined
): UseDocumentPermissionsResult {
  const role = useMemo<DocumentRole>(() => {
    if (!userEmail || !document) return "READ_ONLY";
    return deriveRole(userEmail, document);
  }, [userEmail, document]);

  const status: DocumentWorkflowStatus =
    document?.workflowStatus ?? "NOT_STARTED";

  const permissions = useMemo(
    () => getPermissions(role, status),
    [role, status]
  );

  const roleBadge = ROLE_BADGE[role];

  return { role, permissions, roleBadge, status };
}
