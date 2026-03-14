// src/features/pem-check-lists/pages/components/action-bars/CheckerActions.tsx
//
// Checker action buttons — each button is individually gated by permissions
// so we can show "Complete only" without "Reject" if the map says so.
// Rejection dialog wiring is a stub — separate roadmap.

import { XCircle, CheckCircle2 } from "lucide-react";

interface CheckerActionsProps {
  onReject: () => void;
  onComplete: () => void;
  canReject: boolean;
  canComplete: boolean;
}

export function CheckerActions({
  onReject,
  onComplete,
  canReject,
  canComplete,
}: CheckerActionsProps) {
  return (
    <>
      {canReject && (
        <button
          type="button"
          onClick={onReject}
          className="focus-visible:ring-ring flex h-8 items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 focus-visible:ring-2 focus-visible:outline-none"
        >
          <XCircle className="size-3" />
          Check Rejected
        </button>
      )}
      {canComplete && (
        <button
          type="button"
          onClick={onComplete}
          className="focus-visible:ring-ring flex h-8 items-center gap-1.5 rounded-md bg-green-600 px-3 text-xs font-medium text-white transition-colors hover:bg-green-500 focus-visible:ring-2 focus-visible:outline-none"
        >
          <CheckCircle2 className="size-3" />
          Check Completed
        </button>
      )}
    </>
  );
}
