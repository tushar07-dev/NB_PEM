// src/features/pem-check-lists/pages/components/ConfirmActionDialog.tsx

import { X, Users, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConfirmRecipient {
  /** "To" or "CC" badge displayed in the dialog */
  type: "To" | "CC";
  /** Human label e.g. "Checker", "Approver (you)" */
  roleLabel: string;
  email: string;
  /** Tailwind classes for the badge background + text colour */
  colorClass: string;
}

export interface ConfirmActionDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  document: { documentNo: string; title: string };
  recipients: ConfirmRecipient[];
  confirmLabel: string;
  confirmIcon?: React.ReactNode;
  /** Must be async — handles the full API call sequence */
  onConfirm: () => Promise<void>;
  isBusy?: boolean;
}

// ─── Shared style constants (match SendDocumentFlow shell) ────────────────────

const DIALOG_SHELL = cn(
  "[&>button:last-child]:hidden",
  "gap-0 border-0 p-0 shadow-xl outline-none",
  "bg-grey-50 overflow-hidden",
  "rounded-[18px] lg:rounded-[24px]",
  "px-5 pt-4 pb-5 lg:px-8 lg:pt-[24px] lg:pb-8",
  "w-85 lg:w-[480px]",
  "flex flex-col",
  "gap-4 lg:gap-6"
);

const BTN_BASE = cn(
  "flex shrink-0 items-center justify-center gap-2",
  "text-sm font-medium uppercase transition-colors",
  "h-[34px] lg:h-[40px]",
  "px-2 lg:px-[14px]",
  "rounded-[7px] lg:rounded-[8px]"
);

// ─── Component ────────────────────────────────────────────────────────────────

export function ConfirmActionDialog({
  open,
  onClose,
  title,
  description,
  document,
  recipients,
  confirmLabel,
  confirmIcon,
  onConfirm,
  isBusy = false,
}: ConfirmActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && !isBusy && onClose()}>
      <DialogContent className={DIALOG_SHELL}>
        {/* Hidden title satisfies Radix accessibility requirement */}
        <DialogTitle className="sr-only">{title}</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-helvetica-now text-primary-600 text-xl leading-none">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            aria-label="Close dialog"
            className="hover:bg-grey-100 flex size-8 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="text-primary-300 size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-500">{description}</p>

          {/* Document chip */}
          <div className="rounded-lg border border-gray-100 bg-white px-4 py-3">
            <p className="text-primary-100 mb-1 text-xs font-medium tracking-wider uppercase">
              Document
            </p>
            <p className="text-primary-500 text-sm font-semibold">
              {document.documentNo}
            </p>
            <p className="text-primary-300 text-xs">{document.title}</p>
          </div>

          {/* Recipients */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-gray-400 uppercase">
              <Users className="size-3.5" />
              Email recipients
            </div>
            <div className="flex flex-col gap-1.5">
              {recipients.map((r, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-2.5"
                >
                  <span
                    className={cn(
                      "min-w10 inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold",
                      r.colorClass
                    )}
                  >
                    {r.type}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-400 uppercase">
                      {r.roleLabel}
                    </span>
                    <span className="text-primary-500 text-sm">{r.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex w-full items-center justify-end gap-2 lg:gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className={cn(
              BTN_BASE,
              "border-primary-200 text-primary-200 hover:bg-grey-100 w-23 border lg:w-28",
              isBusy && "cursor-not-allowed opacity-50"
            )}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={isBusy}
            className={cn(
              BTN_BASE,
              "bg-primary-600 text-grey-50 hover:bg-primary-500 px-3 lg:px-5",
              isBusy && "cursor-not-allowed opacity-50"
            )}
          >
            {isBusy ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              confirmIcon
            )}
            {isBusy ? "Processing..." : confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
