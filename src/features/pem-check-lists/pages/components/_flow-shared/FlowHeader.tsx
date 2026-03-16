// src/features/pem-check-lists/pages/components/_flow-shared/FlowHeader.tsx
//
// Reusable dialog header for all multi-step flows.
// Accepts an optional children slot for StepIndicator below the title row.

import { ChevronLeft, X } from "lucide-react";

interface FlowHeaderProps {
  title: string;
  onClose: () => void;
  onBack?: () => void;
  /** Disables both back + close during API calls */
  disabled?: boolean;
  /** Typically: <StepIndicator total={3} current={1} /> */
  children?: React.ReactNode;
}

export function FlowHeader({
  title,
  onClose,
  onBack,
  disabled,
  children,
}: FlowHeaderProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={disabled}
              aria-label="Go back"
              className="hover:bg-grey-100 flex size-7 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="text-primary-300 size-4" />
            </button>
          )}
          <h2 className="font-helvetica-now text-primary-600 text-xl leading-none">
            {title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={disabled}
          aria-label="Close dialog"
          className="hover:bg-grey-100 flex size-[30px] items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="text-primary-300 size-4" />
        </button>
      </div>

      {/* Step indicator slot */}
      {children}
    </div>
  );
}
