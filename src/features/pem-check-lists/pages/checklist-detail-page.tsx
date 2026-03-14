// src/features/pem-check-lists/pages/checklist-detail-page.tsx
import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/config/routes";
import {
  Send,
  XCircle,
  CheckCircle2,
  Rocket,
  AlertTriangle,
  Lock,
  Info,
  User,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/app/providers/useAuth";
import { useProjectStore } from "@/shared/store/projectStore";
import { useGenericPEMStore } from "@/shared/store/genericPemStore";
import type {
  DocumentEntry,
  DocumentWorkflowStatus,
} from "../components/DocumentTable";
import type { DocumentRole, CheckResult } from "../types/checklist";
import { buildSignature } from "../types/checklist";
import { useChecklistItems, useSaveCheckResult } from "../api/queries";
import { ChecklistTable } from "../components/ChecklistTable";

// Inline lock derivation — checklist.ts does not export deriveIsLocked
function deriveIsLocked(
  role: DocumentRole,
  status: DocumentWorkflowStatus
): boolean {
  if (status === "COMPLETED") return true;
  switch (role) {
    case "ORIGINATOR":
      return ![
        "PENDING_WITH_ORIGINATOR",
        "REJECTED_BY_CHECKER",
        "REJECTED_BY_APPROVER",
      ].includes(status);
    case "CHECKER":
      return status !== "PENDING_WITH_CHECKER";
    case "APPROVER":
    case "READ_ONLY":
      return true;
  }
}

function deriveRole(userEmail: string, document: DocumentEntry): DocumentRole {
  const email = userEmail.toLowerCase();
  if (document.originatorSelfCheck?.toLowerCase() === email)
    return "ORIGINATOR";
  if (document.checker?.toLowerCase() === email) return "CHECKER";
  if (document.approver?.toLowerCase() === email) return "APPROVER";
  return "READ_ONLY";
}

const ROLE_BADGE: Record<DocumentRole, { label: string; className: string }> = {
  ORIGINATOR: {
    label: "Originator (Self Check)",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  CHECKER: {
    label: "Checker",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  APPROVER: {
    label: "Approver",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  READ_ONLY: {
    label: "Read Only",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

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

function WorkflowStepper({ status }: WorkflowStepperProps) {
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
            {/* Step bubble — smaller h-6 w-6 */}
            <div className="flex flex-col items-center gap-0.5">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-semibold transition-colors",
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
                  "text-[9px] font-medium whitespace-nowrap",
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

            {/* Connector — responsive width */}
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

interface WarningBannerProps {
  message: string;
}

function WarningBanner({ message }: WarningBannerProps) {
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-amber-200 bg-amber-50 px-3.5 py-2.5">
      <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
      <p className="text-xs text-amber-700">{message}</p>
    </div>
  );
}

function InfoBanner({ message }: WarningBannerProps) {
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-blue-200 bg-blue-50 px-3.5 py-2.5">
      <Info className="mt-0.5 size-3.5 shrink-0 text-blue-500" />
      <p className="text-xs text-blue-700">{message}</p>
    </div>
  );
}

interface AssignedRolesProps {
  originator: string | null;
  checker: string | null;
  approver: string | null;
}

function AssignedRoles({ originator, checker, approver }: AssignedRolesProps) {
  const roles = [
    { label: "Originator", value: originator },
    { label: "Checker", value: checker },
    { label: "Approver", value: approver },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-0 gap-y-1">
      {roles.map(({ label, value }, idx) => (
        <div
          key={label}
          className={cn(
            "flex items-center gap-1 px-3",
            idx !== 0 && "border-l border-gray-100"
          )}
        >
          <User className="size-3 shrink-0 text-gray-300" />
          <span className="text-[11px] text-gray-400">{label}:</span>
          <span className="text-[11px] font-medium text-gray-600">
            {value ?? (
              <span className="italic text-gray-300">—</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ChecklistDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const document = location.state?.document as DocumentEntry | undefined;

  const selectedProject = useProjectStore((s) => s.selectedProject);
  const selectedGenericPEM = useGenericPEMStore((s) => s.selectedGenericPEM);

  useEffect(() => {
    if (!document) {
      navigate(ROUTES.PEM_CHECKLISTS.DOCUMENT_CHECKLIST, { replace: true });
    }
  }, [document, navigate]);

  const mountedProjectId = useMemo(() => selectedProject?.id, []); // eslint-disable-line react-hooks/exhaustive-deps
  const mountedPEMValue = useMemo(() => selectedGenericPEM?.value, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (
      selectedProject?.id !== mountedProjectId ||
      selectedGenericPEM?.value !== mountedPEMValue
    ) {
      navigate(ROUTES.PEM_CHECKLISTS.DOCUMENT_CHECKLIST, { replace: true });
    }
  }, [
    selectedProject?.id,
    selectedGenericPEM?.value,
    mountedProjectId,
    mountedPEMValue,
    navigate,
  ]);

  const role = useMemo<DocumentRole>(() => {
    if (!currentUser?.email || !document) return "READ_ONLY";
    return deriveRole(currentUser.email, document);
  }, [currentUser, document]);

  const isLocked = useMemo(
    () => (document ? deriveIsLocked(role, document.workflowStatus) : true),
    [role, document]
  );

  const { data: checklistItems = [], isLoading: isLoadingItems } =
    useChecklistItems(document?.projectDocumentId ?? null, !!document);

  const { mutateAsync: saveCheckResult } = useSaveCheckResult(
    document?.projectDocumentId ?? null
  );

  const handleCheckResult = useCallback(
    async (checkpointId: number, result: CheckResult) => {
      await saveCheckResult({
        checkpointId,
        checkResult: result,
        originatorSignature:
          result != null && currentUser?.name
            ? buildSignature(currentUser.name)
            : null,
        checkerSignature: null,
      });
    },
    [saveCheckResult, currentUser]
  );

  const [sendFlowOpen, setSendFlowOpen] = useState(false);
  void sendFlowOpen;

  if (!document) return null;

  const status = document.workflowStatus;
  const badge = ROLE_BADGE[role];

  const done = checklistItems.filter((i) => i.checkResult !== null).length;
  const total = checklistItems.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const canSend = done === total && total > 0;

  const warningMessage: string | null = (() => {
    if (status === "NOT_STARTED") {
      return 'Responsibilities have not been defined for this document yet. Click "Define Responsibilities" to assign the originator, checker, and approver.';
    }
    if (role === "READ_ONLY") {
      return "You are not assigned to this document. You can view it but cannot make any changes.";
    }
    if (role === "ORIGINATOR" && status === "PENDING_WITH_ORIGINATOR") {
      return 'You haven\'t sent this document to the checker yet. Complete the checklist and click "Send to Checker".';
    }
    if (role === "ORIGINATOR" && status === "REJECTED_BY_CHECKER") {
      return "The checker has rejected this document. Check your email for the reason, update the checklist, and re-send.";
    }
    if (role === "ORIGINATOR" && status === "REJECTED_BY_APPROVER") {
      return "The approver has rejected this document. Check your email for the reason, update the checklist, and re-send.";
    }
    if (role === "CHECKER" && status !== "PENDING_WITH_CHECKER") {
      return "This document has not been sent to you yet. You will be notified by email when the originator submits it.";
    }
    if (role === "APPROVER" && status !== "PENDING_WITH_APPROVER") {
      return "The checker has not completed their review yet. You will be notified by email when it is ready for approval.";
    }
    return null;
  })();

  return (
    /* ↓ tighter outer padding */
    <div className="flex flex-col gap-3 px-5 pb-8">

      {/* ── Header card — tighter p-4 ── */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">

        {/* Row 1: Title block + Stepper — break to column only on sm */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">

          {/* Left: doc number + badges + title + meta */}
          <div className="flex min-w-0 flex-col gap-1">

            {/* Doc No + badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Doc No
              </span>
              <span className="font-solutioneer text-base font-bold text-gray-800">
                {document.documentNo}
              </span>
              <Badge
                variant="outline"
                className={cn("px-2 py-0 text-[10px]", badge.className)}
              >
                {badge.label}
              </Badge>
              {isLocked && (
                <span className="flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-400">
                  <Lock className="size-2.5" /> Locked
                </span>
              )}
            </div>

            {/* Title — truncate on small screens with full text on hover */}
            <p
              className="max-w-xl truncate text-sm font-medium leading-snug text-gray-700"
              title={document.title}
            >
              {document.title}
            </p>

            {/* Meta row — inline with mid-dots as dividers */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-gray-400">
              {document.reasonForIssue && (
                <span>
                  Reason:{" "}
                  <span className="font-medium text-gray-600">
                    {document.reasonForIssue}
                  </span>
                </span>
              )}
              {document.revisionStatus && (
                <>
                  <span className="text-gray-200">·</span>
                  <span>
                    Rev Status:{" "}
                    <span className="font-medium text-gray-600">
                      {document.revisionStatus}
                    </span>
                  </span>
                </>
              )}
              {document.revision && (
                <>
                  <span className="text-gray-200">·</span>
                  <span>
                    Revision:{" "}
                    <span className="font-medium text-gray-600">
                      {document.revision}
                    </span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right: Stepper */}
          <div className="shrink-0 self-start">
            <WorkflowStepper status={status} />
          </div>
        </div>

        {/* ── Divider + Row 2: Roles + Actions in one stripe ── */}
        <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3 sm:flex-row sm:items-center sm:justify-between">

          {/* Assigned roles */}
          <AssignedRoles
            originator={document.originatorSelfCheck}
            checker={document.checker}
            approver={document.approver}
          />

          {/* Progress + action buttons — right-aligned */}
          <div className="flex flex-wrap items-center gap-2">

            {/* Progress bar — Originator only */}
            {role === "ORIGINATOR" && (
              <div className="flex min-w-[160px] items-center gap-2">
                <Progress value={pct} className="h-1.5 flex-1" />
                <span className="whitespace-nowrap text-[11px] font-semibold text-gray-600">
                  {done}/{total}
                  <span className="ml-0.5 font-normal text-gray-400">
                    ({pct}%)
                  </span>
                </span>
              </div>
            )}

            {/* ORIGINATOR action */}
            {role === "ORIGINATOR" && (
              <button
                type="button"
                onClick={() => setSendFlowOpen(true)}
                disabled={!canSend}
                title={!canSend ? "Complete all checklist items first" : undefined}
                className={cn(
                  "flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-white transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  canSend
                    ? "bg-primary-600 hover:bg-primary-500"
                    : "cursor-not-allowed bg-gray-300"
                )}
              >
                <Send className="size-3" />
                Send to Checker
              </button>
            )}

            {/* CHECKER actions */}
            {role === "CHECKER" && !isLocked && (
              <>
                <button
                  type="button"
                  onClick={() => { /* open CheckerActionFlow reject */ }}
                  className="flex h-8 items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <XCircle className="size-3" />
                  Check Rejected
                </button>
                <button
                  type="button"
                  onClick={() => { /* open CheckerActionFlow complete */ }}
                  className="flex h-8 items-center gap-1.5 rounded-md bg-green-600 px-3 text-xs font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <CheckCircle2 className="size-3" />
                  Check Completed
                </button>
              </>
            )}

            {/* APPROVER actions */}
            {role === "APPROVER" && !isLocked && (
              <>
                <button
                  type="button"
                  onClick={() => { /* open ApproverActionFlow reject */ }}
                  className="flex h-8 items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <XCircle className="size-3" />
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => { /* open ApproverActionFlow release */ }}
                  className="flex h-8 items-center gap-1.5 rounded-md bg-primary-600 px-3 text-xs font-medium text-white transition-colors hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Rocket className="size-3" />
                  Approve & Release
                </button>
              </>
            )}

            {/* COMPLETED badge */}
            {status === "COMPLETED" && (
              <Badge
                variant="outline"
                className="border-green-200 bg-green-50 px-2.5 py-0.5 text-[11px] text-green-700"
              >
                ✓ Document Released
              </Badge>
            )}
          </div>
        </div>

        {/* Progress hint — below the row, only when items incomplete */}
        {role === "ORIGINATOR" && !canSend && total > 0 && (
          <p className="mt-1 text-[10px] text-amber-500">
            Complete all {total} items to enable Send to Checker
          </p>
        )}
      </div>

      {/* ── Warning / info banner ── */}
      {status === "NOT_STARTED" || role === "READ_ONLY"
        ? warningMessage && <InfoBanner message={warningMessage} />
        : warningMessage && <WarningBanner message={warningMessage} />}

      {/* ── Checklist table ── */}
      <ChecklistTable
        items={checklistItems}
        role={role}
        loading={isLoadingItems}
        onCheckResult={handleCheckResult}
      />
    </div>
  );
}