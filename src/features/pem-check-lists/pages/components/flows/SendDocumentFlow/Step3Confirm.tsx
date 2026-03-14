// src/features/pem-check-lists/pages/components/flows/SendDocumentFlow/Step3Confirm.tsx
//
// Step 3: final confirmation screen before firing the API calls.
//
// Layout:
//   — Illustration placeholder (swap for Lottie/SVG asset when ready)
//   — "Do you want to send the Document to the Checker?"
//
// Cancel → back to step 2 (notes preserved)
// Send to Checker → parent fires SetStatusAndComments + AssignRoles + sendEmail

import { Send, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { FlowHeader, StepIndicator } from "../../_flow-shared";

const BTN_BASE = cn(
  "flex shrink-0 items-center justify-center gap-[8px]",
  "text-sm font-medium uppercase transition-colors",
  "h-[34px] lg:h-[40px]",
  "px-[10px] lg:px-[14px]",
  "rounded-[7px] lg:rounded-[8px]"
);

// ─── Illustration placeholder ─────────────────────────────────────────────────
// Replace the inner content with a <Lottie> or <img> when the asset is ready.
// The outer shell dimensions and layout will stay the same.

function IllustrationPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-5 py-2">
      {/* Asset slot — swap this div for your Lottie / img component */}
      <div className="flex h-[180px] w-full items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50">
        <span className="text-sm text-gray-300 italic">
          [ Illustration — replace with asset ]
        </span>
      </div>

      <p className="text-primary-600 max-w-[280px] text-center text-lg leading-snug font-semibold">
        Do you want to send the Document to the Checker?
      </p>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Step3ConfirmProps {
  isBusy: boolean;
  onBack: () => void;
  onSend: () => void;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Step3Confirm({
  isBusy,
  onBack,
  onSend,
  onClose,
}: Step3ConfirmProps) {
  return (
    <>
      <FlowHeader
        title="Send Document"
        onClose={onClose}
        onBack={!isBusy ? onBack : undefined}
        disabled={isBusy}
      >
        <StepIndicator total={3} current={3} />
      </FlowHeader>

      <IllustrationPlaceholder />

      <div className="flex w-full items-center justify-end gap-[8px] lg:gap-[10px]">
        <button
          type="button"
          onClick={onBack}
          disabled={isBusy}
          className={cn(
            BTN_BASE,
            "border-primary-200 text-primary-200 hover:bg-grey-100 w-[90px] border lg:w-[112px]",
            isBusy && "cursor-not-allowed opacity-50"
          )}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSend}
          disabled={isBusy}
          className={cn(
            BTN_BASE,
            "bg-primary-600 text-grey-50 hover:bg-primary-500 flex items-center gap-2 px-[12px] lg:px-[18px]",
            isBusy && "cursor-not-allowed opacity-50"
          )}
        >
          {isBusy ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Send className="size-3.5" />
          )}
          {isBusy ? "Sending..." : "Send to Checker"}
        </button>
      </div>
    </>
  );
}
