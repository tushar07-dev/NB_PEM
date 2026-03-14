// src/features/pem-check-lists/pages/components/action-bars/RoleActionBar.tsx
//
// Renders the correct action button(s) based on permissions.
// Progress bar has been intentionally removed from here — it now lives in the
// page header so ALL roles can see originator completion at a glance.
// No role checks in calling code — permissions drive everything.

import type { DocumentPermissions } from "../../../permissions";
import type { DocumentWorkflowStatus } from "../../../components/DocumentTable";
import { OriginatorActions } from "./OriginatorActions";
import { CheckerActions } from "./CheckerActions";
import { ApproverActions } from "./ApproverActions";
import { CompletedBadge } from "./CompletedBadge";

interface RoleActionBarProps {
  permissions: DocumentPermissions;
  status: DocumentWorkflowStatus;
  /** Originator completion counts — used to gate the Send button */
  done: number;
  total: number;
  /** Callbacks — wired by the page */
  onSendToChecker: () => void;
  onCheckerReject: () => void;
  onCheckerComplete: () => void;
  onApproverReject: () => void;
  onApproverApprove: () => void;
}

export function RoleActionBar({
  permissions,
  status,
  done,
  total,
  onSendToChecker,
  onCheckerReject,
  onCheckerComplete,
  onApproverReject,
  onApproverApprove,
}: RoleActionBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Originator: Send to Checker button */}
      {permissions.canSend && (
        <OriginatorActions done={done} total={total} onSend={onSendToChecker} />
      )}

      {/* Checker actions */}
      {(permissions.canRejectAsChecker || permissions.canCompleteAsChecker) && (
        <CheckerActions
          onReject={onCheckerReject}
          onComplete={onCheckerComplete}
          canReject={permissions.canRejectAsChecker}
          canComplete={permissions.canCompleteAsChecker}
        />
      )}

      {/* Approver actions */}
      {(permissions.canRejectAsApprover || permissions.canApprove) && (
        <ApproverActions
          onReject={onApproverReject}
          onApprove={onApproverApprove}
          canReject={permissions.canRejectAsApprover}
          canApprove={permissions.canApprove}
        />
      )}

      {/* Completed badge */}
      {status === "COMPLETED" && <CompletedBadge />}
    </div>
  );
}
