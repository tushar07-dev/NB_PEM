// src/features/pem-check-lists/pages/components/WorkflowStepper.tsx
//
// Workflow step indicator — extracted from checklist-detail-page.
// Pure presentational component — no permissions logic.

import { cn } from "@/shared/lib/utils";
import type { DocumentWorkflowStatus } from "../../components/DocumentTable";

const WORKFLOW_STEPS: { status: DocumentWorkflowStatus[]; label: string }[] = [
  {
    status: [
      "PENDING_WITH_ORIGINATOR",
      "REJECTED_BY_CHECKER",
      "REJECTED_BY_APPROVER",
    ],
    label: "Originator",
  },
  { status: ["PENDING_WITH_CHECKER"], label: "Checker" },
  { status: ["PENDING_WITH_APPROVER"], label: "Approver" },
  { status: ["COMPLETED"], label: "Completed" },
];

function getStepIndex(status: DocumentWorkflowStatus): number {
  if (status === "NOT_STARTED") return -1;
  for (let i = 0; i < WORKFLOW_STEPS.length; i++) {
    if (WORKFLOW_STEPS[i]?.status.includes(status)) return i;
  }
  return -1;
}

interface WorkflowStepperProps {
  status: DocumentWorkflowStatus;
}

export function WorkflowStepper({ status }: WorkflowStepperProps) {
  const activeIndex = getStepIndex(status);
  const isRejected =
    status === "REJECTED_BY_CHECKER" || status === "REJECTED_BY_APPROVER";

  return (
    <div className="flex items-center gap-0">
      {WORKFLOW_STEPS.map((step, i) => {
        const isDone = activeIndex > i;
        const isActive = activeIndex === i;
        const isLast = i === WORKFLOW_STEPS.length - 1;

        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-0.5">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                  isDone && "border-green-500 bg-green-500 text-white",
                  isActive &&
                    !isRejected &&
                    "border-blue-500 bg-blue-500 text-white",
                  isActive &&
                    isRejected &&
                    "border-red-500 bg-red-50 text-red-600",
                  !isDone &&
                    !isActive &&
                    "border-gray-200 bg-white text-gray-400"
                )}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isDone && "text-green-600",
                  isActive && !isRejected && "text-blue-600",
                  isActive && isRejected && "text-red-600",
                  !isDone && !isActive && "text-gray-400"
                )}
              >
                {step.label}
                {isActive && isRejected && " ↩"}
              </span>
            </div>

            {!isLast && (
              <div
                className={cn(
                  "mb-3.5 h-px w-8 md:w-12",
                  isDone ? "bg-green-400" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
