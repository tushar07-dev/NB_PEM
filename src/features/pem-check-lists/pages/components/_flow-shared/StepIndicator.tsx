// src/features/pem-check-lists/pages/components/_flow-shared/StepIndicator.tsx
//
// Generic step indicator — works for any number of steps.
// Completed steps show a check icon, current step has a ring, future steps are grey.

import { CheckCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface StepIndicatorProps {
  /** Total number of steps in this flow */
  total: number;
  /** 1-based index of the active step */
  current: number;
}

export function StepIndicator({ total, current }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-6 items-center justify-center rounded-full text-xs font-semibold transition-colors",
              step < current && "bg-primary-600 text-white",
              step === current &&
                "bg-primary-600 ring-primary-200 text-white ring-2",
              step > current && "bg-gray-200 text-gray-500"
            )}
          >
            {step < current ? <CheckCircle className="size-3.5" /> : step}
          </div>
          {step < total && (
            <div
              className={cn(
                "h-0.5 w-8 rounded transition-colors",
                step < current ? "bg-primary-600" : "bg-gray-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
