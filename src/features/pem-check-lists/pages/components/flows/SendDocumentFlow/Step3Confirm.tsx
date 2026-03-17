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
import { FlowHeader } from "../../_flow-shared";

const BTN_BASE = cn(
  "flex shrink-0 items-center justify-center gap-2",
  "text-sm font-medium uppercase transition-colors",
  "h-[34px] lg:h-[40px]",
  "px-2 lg:px-[14px]",
  "rounded-[7px] lg:rounded-[8px]"
);

// ─── Illustration placeholder ─────────────────────────────────────────────────
// Replace the inner content with a <Lottie> or <img> when the asset is ready.
// The outer shell dimensions and layout will stay the same.

function IllustrationPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <div className="flex h-45 w-full items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50">
        <span className="text-sm text-gray-300 italic">
          <svg
            width="440"
            height="393"
            viewBox="0 0 440 393"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <rect
              width="440"
              height="275"
              fill="url(#pattern0_11260_2702)"
              style={{ mixBlendMode: "luminosity" }}
            />
            {/* ... all the path elements unchanged ... */}
            <defs>
              <pattern
                id="pattern0_11260_2702"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use
                  xlinkHref="#image0_11260_2702"
                  transform="matrix(0.000625 0 0 0.001 0 -0.316364)"
                />
              </pattern>
              <image
                id="image0_11260_2702"
                width="1600"
                height="1600"
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,..."
              />
            </defs>
          </svg>
        </span>
      </div>
      {/* ... */}
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
        {/* <StepIndicator total={3} current={3} /> */}
      </FlowHeader>

      <div className="flex flex-1 flex-col items-center justify-center">
        <IllustrationPlaceholder />
      </div>

      <div className="flex w-full items-center justify-end gap-2 lg:gap-2">
        <button
          type="button"
          onClick={onBack}
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
          onClick={onSend}
          disabled={isBusy}
          className={cn(
            BTN_BASE,
            "bg-primary-600 text-grey-50 hover:bg-primary-500 flex items-center gap-2 px-3 lg:px-5",
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
