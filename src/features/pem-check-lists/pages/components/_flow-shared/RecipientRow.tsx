// src/features/pem-check-lists/pages/components/_flow-shared/RecipientRow.tsx
//
// "To / CC  |  role label  |  email" row used in confirmation steps.
// Reused by SendDocumentFlow (Step 3), ConfirmActionDialog, and future flows.

import { cn } from "@/shared/lib/utils";

interface RecipientRowProps {
  /** Badge text e.g. "To" or "CC" */
  type: string;
  /** Optional role label shown above email e.g. "Checker", "Approver (you)" */
  roleLabel?: string;
  email: string;
  /** Tailwind classes for the badge bg + text colour */
  colorClass?: string;
}

export function RecipientRow({
  type,
  roleLabel,
  email,
  colorClass,
}: RecipientRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-2.5">
      <span
        className={cn(
          "min-w10 inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold",
          colorClass ?? "bg-gray-100 text-gray-600"
        )}
      >
        {type}
      </span>
      <div className="flex flex-col gap-0.5">
        {roleLabel && (
          <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">
            {roleLabel}
          </span>
        )}
        <span className="text-primary-500 text-sm">{email}</span>
      </div>
    </div>
  );
}
