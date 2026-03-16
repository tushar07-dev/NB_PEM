// src/features/pem-check-lists/pages/checklist-detail-page-v2.tsx

import { useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle2, Rocket, User } from "lucide-react";
import { Progress } from "@/shared/components/ui/progress";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

import { ROUTES } from "@/shared/config/routes";
import { ALL_USERS } from "@/shared/config/users";
import { useAuth } from "@/app/providers/useAuth";
import { useProjectStore } from "@/shared/store/projectStore";
import { useGenericPEMStore } from "@/shared/store/genericPemStore";
import { useActiveDocumentStore } from "@/shared/store/activeDocumentStore";

import type { CheckResult } from "../types/checklist";
import { buildSignature } from "../types/checklist";
import type { ResponsibilityValues } from "../types/DocumentWorkflowSchema";

import {
  useChecklistItems,
  useSaveCheckResult,
  useSetStatusAndComments,
  useSendDocumentEmail,
} from "../api/queries";
import { ChecklistTable } from "../components/ChecklistTable";
import { useDocumentPermissions } from "../permissions";
import { WorkflowStepper } from "./components/WorkflowStepper";
import { StatusBanner } from "./components/StatusBanner";
import { RoleActionBar } from "./components/action-bars";
import { SendDocumentFlow } from "./components/flows/SendDocumentFlow";
import {
  ConfirmActionDialog,
  type ConfirmRecipient,
} from "./components/ConfirmActionDialog";
import { useState } from "react";

// ─── Sub-components ───────────────────────────────────────────────────────────

function AssignedRoles({
  originator,
  checker,
  approver,
}: {
  originator: string | null;
  checker: string | null;
  approver: string | null;
}) {
  const roles = [
    { label: "Originator", value: originator },
    { label: "Checker", value: checker },
    { label: "Approver", value: approver },
  ];
  return (
    <div className="flex flex-wrap items-center">
      {roles.map(({ label, value }, idx) => (
        <div
          key={label}
          className={cn(
            "flex items-center gap-1 px-3 py-0.5",
            idx !== 0 && "border-l border-gray-100"
          )}
        >
          <User className="size-3 shrink-0 text-gray-300" />
          <span className="text-[11px] text-gray-400">{label}:</span>
          <span className="text-[11px] font-medium text-gray-600">
            {value ?? <span className="text-gray-300 italic">—</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

function OriginatorProgress({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="flex min-w-[160px] flex-col gap-0 lg:min-w-[200px]">
      <div className="flex items-baseline gap-0.5">
        <span className="font-solutioneer text-primary-600 text-md font-semibold lg:text-md">
          {done}
        </span>
        <span className="text-primary-300 lg:text-base text-sm font-medium">
          /{total}
        </span>
      </div>
      <Progress value={pct} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ChecklistDetailPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Document comes from the store (set by DocumentTable on row click).
  // Persisted in sessionStorage — survives refresh.
  const { document, patchDocument } = useActiveDocumentStore();

  const selectedProject = useProjectStore((s) => s.selectedProject);
  const selectedGenericPEM = useGenericPEMStore((s) => s.selectedGenericPEM);

  // Redirect if store has no document (e.g. direct URL access)
  useEffect(() => {
    if (!document) {
      navigate(ROUTES.PEM_CHECKLISTS.DOCUMENT_CHECKLIST, { replace: true });
    }
  }, [document, navigate]);

  // Redirect if project/PEM changes while on this page
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mountedProjectId = useMemo(() => selectedProject?.id, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mountedPEMValue = useMemo(() => selectedGenericPEM?.value, []);

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

  // Permissions — reactive to store document
  const { role, permissions, roleBadge, status } = useDocumentPermissions(
    document ?? undefined,
    currentUser?.email
  );

  // Checklist data
  const { data: checklistItems = [], isLoading: isLoadingItems } =
    useChecklistItems(document?.projectDocumentId ?? null, !!document);

  const { mutateAsync: saveCheckResult } = useSaveCheckResult(
    document?.projectDocumentId ?? null
  );
  const { mutateAsync: setStatusAndComments, isPending: isTransitioning } =
    useSetStatusAndComments();
  const { mutateAsync: sendEmail } = useSendDocumentEmail();

  // Role-aware auto-save:
  //   ORIGINATOR → writes originatorSignature, preserves checkerSignature
  //   CHECKER    → writes checkerSignature,    preserves originatorSignature
  const handleCheckResult = useCallback(
    async (checkpointId: number, result: CheckResult) => {
      const item = checklistItems.find((i) => i.checkpointId === checkpointId);
      if (item?.checkResult === result) return; // same value — do nothing
      const name = currentUser?.name ?? "";
      const isOriginator = role === "ORIGINATOR";
      const newSig = buildSignature(name); // result is always OK or NA

      await saveCheckResult({
        checkpointId,
        checkResult: result,
        originatorSignature: isOriginator
          ? newSig
          : item?.originatorSignature || null,
        checkerSignature: !isOriginator
          ? newSig
          : item?.checkerSignature || null,
      });
    },
    [saveCheckResult, currentUser, role, checklistItems]
  );

  // Progress counts items where any value (OK/NA) has been selected — visible to all roles
  const originatorDone = checklistItems.filter(
    (i) => i.checkResult !== null
  ).length;

  const total = checklistItems.length;

  // Dialog open states
  const [sendFlowOpen, setSendFlowOpen] = useState(false);
  const [checkerCompleteOpen, setCheckerCompleteOpen] = useState(false);
  const [approverApproveOpen, setApproverApproveOpen] = useState(false);

  // Called by SendDocumentFlow after Step 3 API calls succeed (status already changed inside flow)
  const handleSent = useCallback(
    (vals: ResponsibilityValues) => {
      patchDocument({
        workflowStatus: "PENDING_WITH_CHECKER",
        originatorSelfCheck: vals.originator.toLowerCase(),
        checker: vals.checker.toLowerCase(),
        approver: vals.approver.toLowerCase(),
      });
    },
    [patchDocument]
  );

  // Called by SendDocumentFlow after Save (Step 1) API succeeds
  const handleSaved = useCallback(
    (vals: ResponsibilityValues) => {
      patchDocument({
        checker: vals.checker.toLowerCase(),
        approver: vals.approver.toLowerCase(),
      });
    },
    [patchDocument]
  );

  const handleCheckerComplete = useCallback(async () => {
    if (!document?.projectDocumentId) return;

    await setStatusAndComments({
      projectDocumentId: document.projectDocumentId,
      workflowStatus: "PENDING_WITH_APPROVER",
      comments: null,
    });

    const toList = [document.approver].filter(Boolean) as string[];
    const ccList = [document.checker, document.originatorSelfCheck].filter(
      Boolean
    ) as string[];
    if (toList.length > 0) {
      await sendEmail({
        to: toList,
        cc: ccList,
        subject: `Document Ready for Approval: ${document.documentNo}`,
        body: [
          `Document ${document.documentNo} — ${document.title} has been reviewed by the checker and is ready for your approval.`,
          "",
          `Originator: ${document.originatorSelfCheck ?? "—"}`,
          `Checker:    ${document.checker ?? "—"}`,
          `Approver:   ${document.approver ?? "—"}`,
        ].join("\n"),
      });
    }

    patchDocument({ workflowStatus: "PENDING_WITH_APPROVER" });
    setCheckerCompleteOpen(false);
  }, [document, setStatusAndComments, sendEmail, patchDocument]);

  const handleApproverApprove = useCallback(async () => {
    if (!document?.projectDocumentId) return;

    await setStatusAndComments({
      projectDocumentId: document.projectDocumentId,
      workflowStatus: "COMPLETED",
      comments: null,
    });

    const allParties = [
      document.originatorSelfCheck,
      document.checker,
      document.approver,
    ].filter(Boolean) as string[];
    if (allParties.length > 0) {
      await sendEmail({
        to: allParties,
        cc: [],
        subject: `Document Approved & Released: ${document.documentNo}`,
        body: [
          `Document ${document.documentNo} — ${document.title} has been approved and officially released.`,
          "",
          `Originator: ${document.originatorSelfCheck ?? "—"}`,
          `Checker:    ${document.checker ?? "—"}`,
          `Approver:   ${document.approver ?? "—"}`,
        ].join("\n"),
      });
    }

    patchDocument({ workflowStatus: "COMPLETED" });
    setApproverApproveOpen(false);
  }, [document, setStatusAndComments, sendEmail, patchDocument]);

  if (!document) return null;

  // Recipient lists for confirm dialogs
  const checkerCompleteRecipients: ConfirmRecipient[] = [
    ...(document.approver
      ? [
          {
            type: "To" as const,
            roleLabel: "Approver",
            email: document.approver,
            colorClass: "bg-purple-50 text-purple-700",
          },
        ]
      : []),
    ...(document.checker
      ? [
          {
            type: "CC" as const,
            roleLabel: "Checker (you)",
            email: document.checker,
            colorClass: "bg-amber-50 text-amber-700",
          },
        ]
      : []),
    ...(document.originatorSelfCheck
      ? [
          {
            type: "CC" as const,
            roleLabel: "Originator",
            email: document.originatorSelfCheck,
            colorClass: "bg-blue-50 text-blue-700",
          },
        ]
      : []),
  ];

  const approverApproveRecipients: ConfirmRecipient[] = [
    document.originatorSelfCheck,
    document.checker,
    document.approver,
  ]
    .filter(Boolean)
    .map((email, idx) => {
      const labels = ["Originator", "Checker", "Approver (you)"];
      const colours = [
        "bg-blue-50 text-blue-700",
        "bg-amber-50 text-amber-700",
        "bg-purple-50 text-purple-700",
      ];
      return {
        type: "To" as const,
        roleLabel: labels[idx] ?? "Recipient",
        email: email as string,
        colorClass: colours[idx] ?? "bg-gray-50 text-gray-700",
      };
    });

  return (
    <div className="flex flex-col gap-3 px-5 pb-8 lg:px-8">
      {/* Header card */}
      <div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Document identity */}
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-solutioneer text-primary-500 text-lg font-semibold lg:text-xl">
                Document Check List ({document.documentNo}_{document.title})
              </span>
              <Badge
                variant="outline"
                className={cn("px-2 py-0 text-[10px]", roleBadge.className)}
              >
                {roleBadge.label}
              </Badge>
              {permissions.isLocked && (
                <span className="flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-400">
                  <Lock className="size-2.5" /> Locked
                </span>
              )}
            </div>

            <div className="flex hidden flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-gray-400">
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

          {/* Progress + action buttons */}
          <div className="flex flex-wrap items-center gap-3 lg:gap-6">
            {total > 0 && (
              <OriginatorProgress done={originatorDone} total={total} />
            )}
            <RoleActionBar
              permissions={permissions}
              status={status}
              done={originatorDone}
              total={total}
              onSendToChecker={() => setSendFlowOpen(true)}
              onCheckerReject={() => {
                /* TODO: rejection roadmap */
              }}
              onCheckerComplete={() => setCheckerCompleteOpen(true)}
              onApproverReject={() => {
                /* TODO: rejection roadmap */
              }}
              onApproverApprove={() => setApproverApproveOpen(true)}
            />
          </div>
        </div>

        {/* Assigned roles + workflow stepper */}
        <div className="mt-3 flex hidden flex-col gap-2 border-t border-gray-100 pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <AssignedRoles
            originator={document.originatorSelfCheck}
            checker={document.checker}
            approver={document.approver}
          />
          <div className="shrink-0 self-start">
            <WorkflowStepper status={status} />
          </div>
        </div>

        {/* {role === "ORIGINATOR" &&
          permissions.canSend &&
          originatorDone < total &&
          total > 0 && (
            <p className="mt-1 text-[10px] text-amber-500">
              Complete all {total} checkpoints to enable Send to Checker
            </p>
          )} */}
      </div>

      <StatusBanner banner={permissions.banner} />

      <ChecklistTable
        items={checklistItems}
        role={role}
        canEdit={permissions.canEditChecklist}
        loading={isLoadingItems}
        onCheckResult={handleCheckResult}
      />

      <SendDocumentFlow
        open={sendFlowOpen}
        onClose={() => setSendFlowOpen(false)}
        document={document}
        originatorEmail={currentUser?.email ?? ""}
        originatorName={currentUser?.name ?? ""}
        userOptions={ALL_USERS}
        done={originatorDone}
        total={total}
        onSent={handleSent}
        onSaved={handleSaved}
      />

      <ConfirmActionDialog
        open={checkerCompleteOpen}
        onClose={() => setCheckerCompleteOpen(false)}
        title="Complete Review"
        description="You are confirming your review is complete. The document will move to the approver."
        document={{ documentNo: document.documentNo, title: document.title }}
        recipients={checkerCompleteRecipients}
        confirmLabel="Check Completed"
        confirmIcon={<CheckCircle2 className="size-3.5" />}
        onConfirm={handleCheckerComplete}
        isBusy={isTransitioning}
      />

      <ConfirmActionDialog
        open={approverApproveOpen}
        onClose={() => setApproverApproveOpen(false)}
        title="Approve & Release"
        description="You are approving this document for official release. All parties will be notified."
        document={{ documentNo: document.documentNo, title: document.title }}
        recipients={approverApproveRecipients}
        confirmLabel="Approve & Release"
        confirmIcon={<Rocket className="size-3.5" />}
        onConfirm={handleApproverApprove}
        isBusy={isTransitioning}
      />
    </div>
  );
}
