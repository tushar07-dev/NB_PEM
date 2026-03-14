// src/features/pem-check-lists/pages/components/action-bars/ApproverActions.tsx
//
// Approver action buttons — each individually gated by permissions flags.
// Rejection dialog wiring is a stub — separate roadmap.

import { XCircle, Rocket } from "lucide-react";

interface ApproverActionsProps {
  onReject: () => void;
  onApprove: () => void;
  canReject: boolean;
  canApprove: boolean;
}

export function ApproverActions({
  onReject,
  onApprove,
  canReject,
  canApprove,
}: ApproverActionsProps) {
  return (
    <>
      {canReject && (
        <button
          type="button"
          onClick={onReject}
          className="focus-visible:ring-ring flex h-8 items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 focus-visible:ring-2 focus-visible:outline-none"
        >
          <XCircle className="size-3" />
          Reject
        </button>
      )}
      {canApprove && (
        <button
          type="button"
          onClick={onApprove}
          className="bg-primary-600 hover:bg-primary-500 focus-visible:ring-ring flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-white transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <Rocket className="size-3" />
          Approve & Release
        </button>
      )}
    </>
  );
}
