// src/features/pem-check-lists/pages/components/flows/SendDocumentFlow/index.tsx
//
// Orchestrates the 3-step "Send Document" flow for the ORIGINATOR.
// This is the ONLY file in this folder that is imported externally.
//
// ─── Step ownership ───────────────────────────────────────────────────────────
//   Step 1 (Step1Roles)   — role dropdowns, Save + Send To Checker
//   Step 2 (Step2Notes)   — optional notes textarea
//   Step 3 (Step3Confirm) — illustration + final confirm
//
// ─── State owned here ────────────────────────────────────────────────────────
//   step         — FlowStep 1 | 2 | 3
//   notes        — free-text from Step 2 (in-memory, not persisted)
//   roleValues   — validated ResponsibilityValues from Step 1 (carried to Step 3)
//
// ─── API calls ────────────────────────────────────────────────────────────────
//   SAVE (Step 1):
//     AssignDocumentRoles (originator fixed, checker/approver nullable) → toast → close
//
//   SEND TO CHECKER (Step 3):
//     1. SetStatusAndComments → PENDING_WITH_CHECKER + notes (PRIORITY — must succeed)
//     2. AssignDocumentRoles + sendEmail fired in parallel (best-effort)
//     If #1 succeeds and #2 partially fails → warning toast, still close + call onSent
//     If #1 fails → show error, stay on step 3
//
// ─── Email recipients ────────────────────────────────────────────────────────
//   To:  checker
//   CC:  originator + approver

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";
import type { Option } from "@/shared/components/ui/SearchableFilterSelect";
import type { ResponsibilityValues } from "@/features/pem-check-lists/types/DocumentWorkflowSchema";
import type { DocumentEntry } from "@/features/pem-check-lists/components/DocumentTable";
import {
  useAssignDocumentRoles,
  useSendDocumentEmail,
  useSetStatusAndComments,
} from "@/features/pem-check-lists/api/queries";
import { Step1Roles } from "@/features/pem-check-lists/pages/components/flows/SendDocumentFlow/Step1Roles";
import { Step2Notes } from "@/features/pem-check-lists/pages/components/flows/SendDocumentFlow/Step2Notes";
import { Step3Confirm } from "@/features/pem-check-lists/pages/components/flows/SendDocumentFlow/Step3Confirm";

// ─── Dialog shell ─────────────────────────────────────────────────────────────
 
const DIALOG_SHELL = cn(
  "[&>button:last-child]:hidden",
  "gap-0 border-0 p-0 shadow-xl outline-none",
  "bg-grey-50 overflow-hidden",
  "rounded-[18px] lg:rounded-[24px]",
  "px-[20px] pt-[16px] pb-[20px] lg:px-[30px] lg:pt-[24px] lg:pb-[30px]",
  "w-[340px] lg:w-[500px]",
  "flex flex-col",
  "gap-[16px] lg:gap-[24px]"
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
  /** Fired after a successful send — page patches local document state */
  onSent: (responsibilities: ResponsibilityValues) => void;
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
}: SendDocumentFlowProps) {
  const [step, setStep] = useState<FlowStep>(1);
  const [notes, setNotes] = useState("");

  // null until Step 1 validates and submits — carries values forward to Step 3.
  // Step1Roles always gets initialValues directly from props (+ key remount),
  // so we never need to seed this from props here.
  const [roleValues, setRoleValues] = useState<ResponsibilityValues | null>(
    null
  );

  // Safe resolved values for Step 3 API calls — falls back to current document
  // props if the user somehow reaches Step 3 without Step 1 setting roleValues.
  const resolved: ResponsibilityValues = roleValues ?? {
    originator: originatorEmail,
    checker: document.checker ?? "",
    approver: document.approver ?? "",
  };

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
    // Reset internal state after the close animation (~300ms)
    setTimeout(() => {
      setStep(1);
      setNotes("");
      setRoleValues(null);
    }, 300);
  }, [onClose]);

  // ── SAVE (Step 1) ───────────────────────────────────────────────────────────
  // Partial assign — checker/approver may be null. Originator is always set.
  // Mutation hook fires its own success/error toast.
  const handleSave = useCallback(
    async (vals: ResponsibilityValues) => {
      if (!document.projectDocumentId) return;
      await assignRoles({
        projectDocumentId: document.projectDocumentId,
        originator: originatorEmail,
        checker: vals.checker || null,
        approver: vals.approver || null,
      });
      handleClose();
    },
    [assignRoles, document.projectDocumentId, originatorEmail, handleClose]
  );

  // ── Step 1 → Step 2 ──────────────────────────────────────────────────────────
  // Only called after Step1Roles passes all validation.
  const handleStep1Next = useCallback((vals: ResponsibilityValues) => {
    setRoleValues(vals);
    setStep(2);
  }, []);

  // ── SEND TO CHECKER (Step 3) ─────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!document.projectDocumentId) return;

    try {
      // 1. PRIORITY — must succeed
      await setStatusAndComments({
        projectDocumentId: document.projectDocumentId,
        workflowStatus: "PENDING_WITH_CHECKER",
        comments: notes.trim() || null,
      });

      // 2. BEST-EFFORT — parallel, non-blocking
      const [rolesResult, emailResult] = await Promise.allSettled([
        assignRoles({
          projectDocumentId: document.projectDocumentId,
          originator: originatorEmail,
          checker: resolved.checker || null,
          approver: resolved.approver || null,
        }),
        sendEmail({
          to: [resolved.checker].filter(Boolean),
          cc: [originatorEmail, resolved.approver].filter(Boolean),
          subject: `Document Sent for Review: ${document.documentNo}`,
          body: [
            `Document ${document.documentNo} — ${document.title} has been sent to you for review.`,
            "",
            `Originator: ${originatorName}`,
            `Checker:     ${resolved.checker}`,
            `Approver:    ${resolved.approver}`,
            notes.trim() ? `\nNotes:\n${notes.trim()}` : "",
          ]
            .filter(Boolean)
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
        {/* Hidden title satisfies Radix accessibility requirement */}
        <DialogTitle className="sr-only">Send Document</DialogTitle>

        {step === 1 && (
          // key forces full remount on every open so useForm defaultValues
          // always picks up the latest document.checker / document.approver
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