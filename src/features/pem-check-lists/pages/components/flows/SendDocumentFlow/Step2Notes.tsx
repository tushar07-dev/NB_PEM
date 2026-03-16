// src/features/pem-check-lists/pages/components/flows/SendDocumentFlow/Step2Notes.tsx
//
// Step 2: optional notes / comments from the originator.
// Notes are stored in parent state (in-memory only, not persisted here).
// They are included in the email body and saved as SetStatusAndComments.comments in step 3.
//
// Cancel → back to step 1 (notes are preserved in parent state)
// Next   → step 3

import { cn } from "@/shared/lib/utils";
import { FlowHeader, StepIndicator } from "../../_flow-shared";

const BTN_BASE = cn(
  "flex shrink-0 items-center justify-center gap-2",
  "text-sm font-medium uppercase transition-colors",
  "h-[34px] lg:h-[40px]",
  "px-2 lg:px-[14px]",
  "rounded-[7px] lg:rounded-[8px]"
);

interface Step2NotesProps {
  notes: string;
  onNotesChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function Step2Notes({
  notes,
  onNotesChange,
  onBack,
  onNext,
  onClose,
}: Step2NotesProps) {
  return (
    <>
      <FlowHeader title="Send Document" onClose={onClose} onBack={onBack}>
        <StepIndicator total={3} current={2} />
      </FlowHeader>

      <div className="flex flex-col gap-3">
        <label className="text-primary-400 text-sm font-medium">
          Notes Or Comments
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Enter Any Comments Or Notes You Want To Share With The Recipient"
          rows={8}
          className={cn(
            "w-full resize-none rounded-lg border border-gray-200 bg-gray-50",
            "px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400",
            "focus:border-primary-400 focus:ring-primary-400 focus:ring-1 focus:outline-none",
            "transition-colors"
          )}
        />
      </div>

      <div className="flex w-full items-center justify-end gap-2 lg:gap-2">
        <button
          type="button"
          onClick={onBack}
          className={cn(
            BTN_BASE,
            "border-primary-200 text-primary-200 hover:bg-grey-100 w-23 border lg:w-28"
          )}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onNext}
          className={cn(
            BTN_BASE,
            "bg-primary-600 text-grey-50 hover:bg-primary-500 w-23 lg:w-28"
          )}
        >
          Next
        </button>
      </div>
    </>
  );
}
