// src/features/pem-check-lists/pages/components/flows/SendDocumentFlow/index.tsx

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";
import type { Option } from "@/shared/components/ui/SearchableFilterSelect";
import type { ResponsibilityValues } from "@/features/pem-check-lists/pages/components/DocumentWorkflowSchema";
import type { DocumentEntry } from "@/features/pem-check-lists/types/document";
import {
  useAssignDocumentRoles,
  useSendDocumentEmail,
  useSetStatusAndComments,
} from "@/features/pem-check-lists/api/queries";
import { Step1Roles } from "./Step1Roles";
import { Step2Notes } from "./Step2Notes";
import { Step3Confirm } from "./Step3Confirm";
import { getDisplayName } from "@/shared/config/users";

// ─── Dialog shell ─────────────────────────────────────────────────────────────

const DIALOG_SHELL = cn(
  "[&>button:last-child]:hidden",
  "gap-0 border-0 p-0 shadow-xl outline-none",
  "bg-grey-50 overflow-hidden",
  "rounded-[18px] lg:rounded-[24px]",
  "px-5 pt-4 pb-5 lg:px-8 lg:pt-[24px] lg:pb-8",
  "w-85 lg:w-125",
  "h-[460px] lg:h-[540px]",
  "flex flex-col",
  "gap-4 lg:gap-6"
);

type FlowStep = 1 | 2 | 3;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SendDocumentFlowProps {
  open: boolean;
  onClose: () => void;
  document: DocumentEntry;
  /** currentUser.email — always the originator, fixed in Step 1 */
  originatorEmail: string;
  originatorName: string;
  userOptions: Option[];
  /** Originator-signature count — passed to Step 1 for checkpoint validation */
  done: number;
  total: number;
  /** Fired after Step 3 send succeeds — caller updates store with new roles + status */
  onSent: (responsibilities: ResponsibilityValues) => void;
  /** Fired after Step 1 save succeeds — caller updates store with new roles only */
  onSaved?: (responsibilities: ResponsibilityValues) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SendDocumentFlow({
  open,
  onClose,
  document,
  originatorEmail,
  originatorName,
  userOptions,
  done,
  total,
  onSent,
  onSaved,
}: SendDocumentFlowProps) {
  const [step, setStep] = useState<FlowStep>(1);
  const [notes, setNotes] = useState("");

  // null until Step 1 validates + submits; carries values forward to Step 3
  const [roleValues, setRoleValues] = useState<ResponsibilityValues | null>(
    null
  );

  // Falls back to document props if user skips Step 1 (shouldn't happen, but safe)
  const resolved = useMemo<ResponsibilityValues>(
    () => roleValues ?? {
      originator: originatorEmail,
      checker: document.checker ?? "",
      approver: document.approver ?? "",
    },
    [roleValues, originatorEmail, document.checker, document.approver]
  );

  // ── Mutations ───────────────────────────────────────────────────────────────
  const { mutateAsync: assignRoles, isPending: isAssigning } =
    useAssignDocumentRoles();
  const { mutateAsync: sendEmail } = useSendDocumentEmail();
  const { mutateAsync: setStatusAndComments, isPending: isSettingStatus } =
    useSetStatusAndComments();

  const isBusy = isAssigning || isSettingStatus;

  // ── Reset + close ───────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setNotes("");
      setRoleValues(null);
    }, 300);
  }, [onClose]);

  // ── SAVE (Step 1) ───────────────────────────────────────────────────────────
  // Partial assign — checker/approver may be null.
  // After success: notifies caller (store patchDocument) then closes.
  const handleSave = useCallback(
    async (vals: ResponsibilityValues) => {
      if (!document.projectDocumentId) return;
      const checkerUnchanged = vals.checker === (document.checker ?? "");
      const approverUnchanged = vals.approver === (document.approver ?? "");

      if (checkerUnchanged && approverUnchanged) {
        onSaved?.(vals); // ← notify caller even if no API call needed
        handleClose();
        return;
      }

      await assignRoles({
        projectDocumentId: document.projectDocumentId,
        originator: originatorEmail,
        checker: vals.checker || null,
        approver: vals.approver || null,
      });
      onSaved?.(vals);
      handleClose();
    },
    [
      assignRoles,
      document.projectDocumentId,
      document.checker,
      document.approver,
      originatorEmail,
      onSaved,
      handleClose,
    ]
  );

  // ── Step 1 → Step 2 ──────────────────────────────────────────────────────────
  const handleStep1Next = useCallback((vals: ResponsibilityValues) => {
    setRoleValues(vals);
    setStep(2);
  }, []);

  // ── SEND TO CHECKER (Step 3) ─────────────────────────────────────────────────
  // 1. SetStatusAndComments must succeed (priority)
  // 2. AssignDocumentRoles + sendEmail run in parallel (best-effort)
  const handleSend = useCallback(async () => {
    if (!document.projectDocumentId) return;

    try {
      await setStatusAndComments({
        projectDocumentId: document.projectDocumentId,
        workflowStatus: "PENDING_WITH_CHECKER",
        comments: notes.trim() || null,
      });

      const [rolesResult, emailResult] = await Promise.allSettled([
        assignRoles({
          projectDocumentId: document.projectDocumentId,
          originator: originatorEmail,
          checker: resolved.checker || null,
          approver: resolved.approver || null,
        }),
        
        // ── 1. SEND TO CHECKER (SendDocumentFlow Step 3) ──────────────────────────────
        sendEmail({
          to: [resolved.checker].filter((v): v is string => !!v?.trim()),
          cc: [originatorEmail, resolved.approver].filter((v): v is string => !!v?.trim()),
          subject: `[PEM] Document Sent for Review: ${document.documentNo}`,
          body: [
            `Hello ${getDisplayName(resolved.checker)},`,
            ``,
            `The following document has been assigned to you for review.`,
            ``,
            `──────────────────────────────`,
            `Document No : ${document.documentNo}`,
            `Title       : ${document.title}`,
            `──────────────────────────────`,
            `Originator  : ${getDisplayName(originatorEmail)}`,
            `Checker     : ${getDisplayName(resolved.checker)}`,
            `Approver    : ${getDisplayName(resolved.approver)}`,
            `──────────────────────────────`,
            notes.trim() ? `Notes:\n${notes.trim()}` : "",
            ``,
            `Please log in to PEM Digital to review this document.`,
          ]
            .filter((l) => l !== undefined && l !== null)
            .join("\n"),
        }),
      ]);

      const failures = [rolesResult, emailResult].filter(
        (r) => r.status === "rejected"
      );
      if (failures.length > 0) {
        toast.warning("Document sent, but some notifications may have failed", {
          description:
            "The status was updated. Please verify email delivery manually.",
          duration: 8000,
        });
      }

      onSent(resolved);
      handleClose();
    } catch {
      toast.error("Failed to send document", {
        description: "The status could not be updated. Please try again.",
        duration: 8000,
      });
    }
  }, [
    document,
    notes,
    resolved,
    originatorEmail,
    originatorName,
    setStatusAndComments,
    assignRoles,
    sendEmail,
    onSent,
    handleClose,
  ]);

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !isBusy && handleClose()}>
      <DialogContent className={DIALOG_SHELL}>
        <DialogTitle className="sr-only">Send Document</DialogTitle>

        {step === 1 && (
          <Step1Roles
            key={`step1-${document.projectDocumentId ?? "new"}-${String(open)}`}
            initialValues={{
              originator: originatorEmail,
              checker: document.checker ?? "",
              approver: document.approver ?? "",
            }}
            originatorEmail={originatorEmail}
            userOptions={userOptions}
            done={done}
            total={total}
            isSaving={isAssigning}
            onSave={(vals) => void handleSave(vals)}
            onNext={handleStep1Next}
            onClose={handleClose}
          />
        )}

        {step === 2 && (
          <Step2Notes
            notes={notes}
            onNotesChange={setNotes}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
            onClose={handleClose}
          />
        )}

        {step === 3 && (
          <Step3Confirm
            isBusy={isBusy}
            onBack={() => setStep(2)}
            onSend={() => void handleSend()}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
