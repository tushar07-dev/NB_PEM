// src/features/pem-check-lists/pages/checklist-detail-page.tsx
import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Send,
  XCircle,
  CheckCircle2,
  Rocket,
  AlertTriangle,
  Lock,
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
import type { DocumentRole } from "../types/checklist";
import { ROUTES } from "@/shared/config/routes";

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

// ─── Role derivation ──────────────────────────────────────────────────────────
// Priority: ORIGINATOR > CHECKER > APPROVER > READ_ONLY
// All comparisons are case-insensitive.

function deriveRole(userEmail: string, document: DocumentEntry): DocumentRole {
  const email = userEmail.toLowerCase();
  if (document.originatorSelfCheck?.toLowerCase() === email)
    return "ORIGINATOR";
  if (document.checker?.toLowerCase() === email) return "CHECKER";
  if (document.approver?.toLowerCase() === email) return "APPROVER";
  return "READ_ONLY";
}

// ─── Role badge config ────────────────────────────────────────────────────────

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

// ─── Workflow stepper ─────────────────────────────────────────────────────────

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
            {/* Step bubble */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
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
                  "text-[10px] font-medium whitespace-nowrap",
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

            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  "mb-4 h-0.5 w-10",
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

// ─── Warning banner ───────────────────────────────────────────────────────────

interface WarningBannerProps {
  message: string;
}

function WarningBanner({ message }: WarningBannerProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
      <p className="text-sm text-amber-700">{message}</p>
    </div>
  );
}

// ─── Assigned roles strip ─────────────────────────────────────────────────────

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
    <div className="flex flex-wrap gap-4">
      {roles.map(({ label, value }) => (
        <div key={label} className="flex items-center gap-1.5">
          <User className="text-primary-100 size-3.5 shrink-0" />
          <span className="text-primary-100 text-xs">{label}:</span>
          <span className="text-primary-400 text-xs font-medium">
            {value ?? (
              <span className="text-gray-300 italic">Not assigned</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// Mock progress — replace with real items from useGetChecklistItems
const MOCK_DONE = 14;
const MOCK_TOTAL = 20;

export function ChecklistDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const document = location.state?.document as DocumentEntry | undefined;

  const selectedProject = useProjectStore((s) => s.selectedProject);
  const selectedGenericPEM = useGenericPEMStore((s) => s.selectedGenericPEM);

  // ── Guards ────────────────────────────────────────────────────────────────
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

  // ── Role + lock ────────────────────────────────────────────────────────────
  const role = useMemo<DocumentRole>(() => {
    if (!currentUser?.email || !document) return "READ_ONLY";
    return deriveRole(currentUser.email, document);
  }, [currentUser, document]);

  const isLocked = useMemo(
    () => (document ? deriveIsLocked(role, document.workflowStatus) : true),
    [role, document]
  );

  // ── Dialog state (stubs — wired later) ────────────────────────────────────
  const [sendFlowOpen, setSendFlowOpen] = useState(false);
  void sendFlowOpen; // used when SendDocumentFlow is added

  if (!document) return null;

  const status = document.workflowStatus;
  const badge = ROLE_BADGE[role];

  // TODO: Replace with real item counts from useGetChecklistItems
  const done: number = MOCK_DONE;
  const total: number = MOCK_TOTAL;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const canSend = done === total && total > 0;

  // ── Warning messages per role + status ────────────────────────────────────
  const warningMessage: string | null = (() => {
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
    <div className="flex flex-col gap-4 px-7.5 pb-10">
      {/* ── Header card ── */}
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        {/* Row 1: Title + Stepper */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          {/* Left: doc info */}
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-primary-100 text-xs font-medium tracking-wider uppercase">
                Document No
              </span>
              <span className="text-primary-500 font-solutioneer text-lg font-semibold">
                {document.documentNo}
              </span>
              <Badge variant="outline" className={badge.className}>
                {badge.label}
              </Badge>
              {isLocked && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Lock className="size-3" /> Locked
                </span>
              )}
            </div>

            <p className="text-primary-400 max-w-xl text-sm leading-relaxed">
              {document.title}
            </p>

            <div className="text-primary-100 flex flex-wrap gap-4 text-xs">
              {document.reasonForIssue && (
                <span>
                  Reason:{" "}
                  <span className="text-primary-400">
                    {document.reasonForIssue}
                  </span>
                </span>
              )}
              {document.revisionStatus && (
                <span>
                  Rev Status:{" "}
                  <span className="text-primary-400">
                    {document.revisionStatus}
                  </span>
                </span>
              )}
              {document.revision && (
                <span>
                  Revision:{" "}
                  <span className="text-primary-400">{document.revision}</span>
                </span>
              )}
            </div>
          </div>

          {/* Right: Stepper */}
          <WorkflowStepper status={status} />
        </div>

        {/* Row 2: Assigned roles */}
        <AssignedRoles
          originator={document.originatorSelfCheck}
          checker={document.checker}
          approver={document.approver}
        />

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Row 3: Progress + Actions (role-specific) */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Progress — Originator only (checker/approver don't need to track this) */}
          {role === "ORIGINATOR" && (
            <div className="flex min-w-[220px] flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-primary-300 text-xs font-medium">
                  Progress
                </span>
                <span className="text-primary-500 text-sm font-semibold">
                  {done}/{total}
                  <span className="text-primary-100 ml-1 font-normal">
                    ({pct}%)
                  </span>
                </span>
              </div>
              <Progress value={pct} className="h-2 w-full" />
              {!canSend && total > 0 && (
                <p className="text-[11px] text-amber-600">
                  Complete all {total} items to enable Send to Checker
                </p>
              )}
            </div>
          )}

          {/* Spacer for non-originator roles */}
          {role !== "ORIGINATOR" && <div />}

          {/* Action buttons — role-specific */}
          <div className="flex items-center gap-2">
            {/* ORIGINATOR */}
            {role === "ORIGINATOR" && (
              <button
                type="button"
                onClick={() => setSendFlowOpen(true)}
                disabled={!canSend}
                title={
                  !canSend ? "Complete all checklist items first" : undefined
                }
                className={cn(
                  "flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium text-white transition-colors",
                  "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                  canSend
                    ? "bg-primary-600 hover:bg-primary-500"
                    : "cursor-not-allowed bg-gray-300"
                )}
              >
                <Send className="size-3.5" />
                Send to Checker
              </button>
            )}

            {/* CHECKER */}
            {role === "CHECKER" && !isLocked && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    /* open CheckerActionFlow reject */
                  }}
                  className="focus-visible:ring-ring flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 focus-visible:ring-2 focus-visible:outline-none"
                >
                  <XCircle className="size-3.5" />
                  Check Rejected
                </button>
                <button
                  type="button"
                  onClick={() => {
                    /* open CheckerActionFlow complete */
                  }}
                  className="focus-visible:ring-ring flex h-9 items-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:ring-2 focus-visible:outline-none"
                >
                  <CheckCircle2 className="size-3.5" />
                  Check Completed
                </button>
              </>
            )}

            {/* APPROVER */}
            {role === "APPROVER" && !isLocked && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    /* open ApproverActionFlow reject */
                  }}
                  className="focus-visible:ring-ring flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 focus-visible:ring-2 focus-visible:outline-none"
                >
                  <XCircle className="size-3.5" />
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => {
                    /* open ApproverActionFlow release */
                  }}
                  className="bg-primary-600 hover:bg-primary-500 focus-visible:ring-ring flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <Rocket className="size-3.5" />
                  Approve & Release
                </button>
              </>
            )}

            {/* COMPLETED — all roles */}
            {status === "COMPLETED" && (
              <Badge
                variant="outline"
                className="border-green-200 bg-green-50 px-3 py-1 text-green-700"
              >
                ✓ Document Released
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* ── Warning banner ── */}
      {warningMessage && <WarningBanner message={warningMessage} />}

      {/* ── Checklist table goes here ── */}
    </div>
  );
}
