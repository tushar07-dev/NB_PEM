// src/features/pem-check-lists/pages/components/SendDocumentFlow.tsx
//
// 3-step Send Document flow — only accessible to ORIGINATOR.
//
// Step 1 — Responsibilities: pre-filled from document, all 3 required to proceed.
//           Save (left btn) = draft save, no validation.
//           Send to Checker (right btn) = validates all 3 fields → Step 2.
//
// Step 2 — Notes / Comments: optional free-text.
//           Cancel → back to Step 1.
//           Next   → Step 3.
//
// Step 3 — Confirmation: shows recipients + note preview.
//           Cancel           → back to Step 2.
//           Send to Checker  → fires email mutation → onSent().

import { useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  X,
  Send,
  Users,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { SearchableFilterSelect } from "@/shared/components/ui/SearchableFilterSelect";
import { cn } from "@/shared/lib/utils";
import type { Option } from "@/shared/components/ui/SearchableFilterSelect";
import {
  sendSchema,
  type ResponsibilityValues,
} from "../../types/DocumentWorkflowSchema";

import {
  useSendDocumentEmail,
  useAssignDocumentRoles,
} from "../../api/queries";
import type { DocumentEntry } from "../../components/DocumentTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SendDocumentFlowProps {
  open: boolean;
  onClose: () => void;
  document: DocumentEntry;
  /** currentUser.email — used as CC on the outgoing email */
  originatorEmail: string;
  originatorName: string;
  userOptions: Option[];
  /** Called after email is successfully sent */
  onSent: (responsibilities: ResponsibilityValues) => void;
}

type FlowStep = 1 | 2 | 3;

const STEP_LABELS: Record<FlowStep, string> = {
  1: "Send Document",
  2: "Notes & Comments",
  3: "Confirm & Send",
};

// ─── Shared shell ─────────────────────────────────────────────────────────────

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

const BTN_BASE = cn(
  "flex shrink-0 items-center justify-center gap-[8px]",
  "text-sm font-medium uppercase",
  "transition-colors",
  "h-[34px] lg:h-[40px]",
  "px-[10px] lg:px-[14px]",
  "rounded-[7px] lg:rounded-[8px]"
);

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: FlowStep }) {
  return (
    <div className="flex items-center gap-2">
      {([1, 2, 3] as FlowStep[]).map((step) => (
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
          {step < 3 && (
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

// ─── Header ───────────────────────────────────────────────────────────────────

function FlowHeader({
  step,
  onClose,
  onBack,
}: {
  step: FlowStep;
  onClose: () => void;
  onBack?: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="hover:bg-grey-100 flex size-7 items-center justify-center rounded-full transition-colors"
            >
              <ChevronLeft className="text-primary-300 size-4" />
            </button>
          )}
          <h2 className="font-solutioneer text-primary-600 text-xl leading-none">
            {STEP_LABELS[step]}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="hover:bg-grey-100 flex size-[30px] items-center justify-center rounded-full transition-colors"
        >
          <X className="text-primary-300 size-4" />
        </button>
      </div>
      <StepIndicator current={step} />
    </div>
  );
}

// ─── Yellow note ──────────────────────────────────────────────────────────────

function YellowNote() {
  return (
    <div className="flex flex-col gap-[3px] rounded-[10px] border border-[#FFF3A7] bg-[#FFFED6] px-[12px] py-[8px] lg:rounded-[12px] lg:px-[16px] lg:py-[12px]">
      <p className="text-sm font-medium text-[#F04438]">Note:</p>
      <p className="text-primary-500 text-sm leading-snug">
        Please ensure that the names you fill in match those provided in the
        document.
      </p>
    </div>
  );
}

// ─── Recipient row (Step 3) ───────────────────────────────────────────────────

function RecipientRow({
  role,
  email,
  className,
}: {
  role: string;
  email: string;
  className?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3">
      <span
        className={cn(
          "inline-flex min-w-[72px] items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold",
          className
        )}
      >
        {role}
      </span>
      <span className="text-primary-500 text-sm">{email}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SendDocumentFlow({
  open,
  onClose,
  document,
  originatorEmail,
  originatorName,
  userOptions,
  onSent,
}: SendDocumentFlowProps) {
  const [step, setStep] = useState<FlowStep>(1);
  const [notes, setNotes] = useState("");

  // ── Step 1 form ────────────────────────────────────────────────────────────
  const form = useForm<ResponsibilityValues>({
    resolver: zodResolver(sendSchema),
    defaultValues: {
      originator: document.originatorSelfCheck ?? "",
      checker: document.checker ?? "",
      approver: document.approver ?? "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const currentValues = form.watch();

  // AC5: each dropdown hides already-selected emails in siblings
  const originatorOptions = useMemo(
    () =>
      userOptions.filter(
        (o) =>
          o.value !== currentValues.checker &&
          o.value !== currentValues.approver
      ),
    [userOptions, currentValues.checker, currentValues.approver]
  );
  const checkerOptions = useMemo(
    () =>
      userOptions.filter(
        (o) =>
          o.value !== currentValues.originator &&
          o.value !== currentValues.approver
      ),
    [userOptions, currentValues.originator, currentValues.approver]
  );
  const approverOptions = useMemo(
    () =>
      userOptions.filter(
        (o) =>
          o.value !== currentValues.originator &&
          o.value !== currentValues.checker
      ),
    [userOptions, currentValues.originator, currentValues.checker]
  );

  // ── Mutations ──────────────────────────────────────────────────────────────
  const { mutateAsync: sendEmail, isPending: isSending } =
    useSendDocumentEmail();
  const { mutateAsync: assignRoles, isPending: isAssigning } =
    useAssignDocumentRoles();
  const isBusy = isSending || isAssigning;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    onClose();
    // Reset to step 1 after dialog finishes closing
    setTimeout(() => {
      setStep(1);
      setNotes("");
      form.reset({
        originator: document.originatorSelfCheck ?? "",
        checker: document.checker ?? "",
        approver: document.approver ?? "",
      });
    }, 300);
  }, [onClose, form, document]);

  // ── Step 1: Save draft (no validation) ────────────────────────────────────
  const handleSaveDraft = useCallback(() => {
    // TODO: call PATCH /api/Checklist/SaveDraft with form.getValues() once endpoint exists
    if (import.meta.env.DEV) {
      console.log("[SendDocumentFlow] draft saved:", form.getValues());
    }
  }, [form]);

  // ── Step 1 → Step 2: validate all 3 fields ────────────────────────────────
  const handleStep1Next = form.handleSubmit(() => {
    setStep(2);
  });

  // ── Step 3: Send email ─────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const vals = form.getValues();

    try {
      // Assign roles if projectDocumentId is available
      if (document.projectDocumentId !== null) {
        await assignRoles({
          projectDocumentId: document.projectDocumentId,
          originator: vals.originator,
          checker: vals.checker,
          approver: vals.approver,
        });
      }

      // Send email: To = checker + approver, CC = originator
      const recipients = [vals.checker, vals.approver].filter(Boolean);
      await sendEmail({
        to: recipients,
        cc: [originatorEmail],
        subject: `Document Sent for Review: ${document.documentNo}`,
        body: [
          `Document ${document.documentNo} — ${document.title} has been sent for review.`,
          "",
          `Originator: ${originatorName}`,
          `Checker:     ${vals.checker}`,
          `Approver:    ${vals.approver}`,
          notes ? `\nNotes:\n${notes}` : "",
        ]
          .filter((l) => l !== null)
          .join("\n"),
      });

      onSent(vals);
      handleClose();
    } catch {
      // Mutation hooks own the toasts — nothing to do here
    }
  }, [
    form,
    document,
    originatorEmail,
    originatorName,
    notes,
    assignRoles,
    sendEmail,
    onSent,
    handleClose,
  ]);

  const vals = form.getValues();

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className={DIALOG_SHELL}>
        {/* ── Step 1: Responsibilities ── */}
        {step === 1 && (
          <>
            <FlowHeader step={1} onClose={handleClose} />

            <div className="flex flex-col gap-[16px] lg:gap-[24px]">
              <div className="flex flex-col gap-[20px] lg:gap-[28px]">
                <Controller
                  name="originator"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <SearchableFilterSelect
                      label="Originator (Responsible)"
                      placeholder="EG. Amir"
                      options={originatorOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      error={fieldState.error?.message}
                      required
                      size="md"
                    />
                  )}
                />
                <Controller
                  name="checker"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <SearchableFilterSelect
                      label="Checker (Reviewer)"
                      placeholder="EG. Sanghati"
                      options={checkerOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      error={fieldState.error?.message}
                      required
                      size="md"
                    />
                  )}
                />
                <Controller
                  name="approver"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <SearchableFilterSelect
                      label="Approver (Accountable)"
                      placeholder="EG. Xavier"
                      options={approverOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      error={fieldState.error?.message}
                      required
                      size="md"
                    />
                  )}
                />
              </div>
              <YellowNote />
            </div>

            <div className="flex w-full items-center justify-end gap-[8px] lg:gap-[10px]">
              {/* Save draft — no validation */}
              <button
                type="button"
                onClick={handleSaveDraft}
                className={cn(
                  BTN_BASE,
                  "border-primary-200 text-primary-200 hover:bg-grey-100 w-[90px] border lg:w-[112px]"
                )}
              >
                Save
              </button>
              {/* Send to Checker — validates all 3 */}
              <button
                type="button"
                onClick={handleStep1Next}
                className={cn(
                  BTN_BASE,
                  "bg-primary-600 text-grey-50 hover:bg-primary-500 px-[12px] lg:px-[18px]"
                )}
              >
                Send To Checker
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: Notes ── */}
        {step === 2 && (
          <>
            <FlowHeader
              step={2}
              onClose={handleClose}
              onBack={() => setStep(1)}
            />

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MessageSquare className="size-4" />
                <span>
                  Add any notes or comments for the checker and approver.
                </span>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter notes or comments (optional)..."
                rows={5}
                className={cn(
                  "w-full resize-none rounded-lg border border-gray-200 bg-white",
                  "px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400",
                  "focus:border-primary-400 focus:ring-primary-400 focus:ring-1 focus:outline-none",
                  "transition-colors"
                )}
              />
            </div>

            <div className="flex w-full items-center justify-end gap-[8px] lg:gap-[10px]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={cn(
                  BTN_BASE,
                  "border-primary-200 text-primary-200 hover:bg-grey-100 w-[90px] border lg:w-[112px]"
                )}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className={cn(
                  BTN_BASE,
                  "bg-primary-600 text-grey-50 hover:bg-primary-500 w-[90px] lg:w-[112px]"
                )}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* ── Step 3: Confirmation ── */}
        {step === 3 && (
          <>
            <FlowHeader
              step={3}
              onClose={handleClose}
              onBack={() => setStep(2)}
            />

            <div className="flex flex-col gap-4">
              {/* Document info */}
              <div className="rounded-lg border border-gray-100 bg-white px-4 py-3">
                <p className="text-primary-100 mb-1 text-xs font-medium tracking-wider uppercase">
                  Document
                </p>
                <p className="text-primary-500 text-sm font-semibold">
                  {document.documentNo}
                </p>
                <p className="text-primary-300 text-xs">{document.title}</p>
              </div>

              {/* Recipients */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-gray-400 uppercase">
                  <Users className="size-3.5" />
                  Recipients
                </div>
                <RecipientRow
                  role="To"
                  email={vals.checker}
                  className="bg-amber-50 text-amber-700"
                />
                <RecipientRow
                  role="To"
                  email={vals.approver}
                  className="bg-purple-50 text-purple-700"
                />
                <RecipientRow
                  role="CC"
                  email={originatorEmail}
                  className="bg-blue-50 text-blue-700"
                />
              </div>

              {/* Notes preview */}
              {notes.trim() && (
                <div className="rounded-lg border border-gray-100 bg-white px-4 py-3">
                  <p className="text-primary-100 mb-1 text-xs font-medium tracking-wider uppercase">
                    Notes
                  </p>
                  <p className="text-primary-400 text-sm whitespace-pre-wrap">
                    {notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex w-full items-center justify-end gap-[8px] lg:gap-[10px]">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={isBusy}
                className={cn(
                  BTN_BASE,
                  "border-primary-200 text-primary-200 hover:bg-grey-100 w-[90px] border lg:w-[112px]",
                  isBusy && "cursor-not-allowed opacity-50"
                )}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleSend()}
                disabled={isBusy}
                className={cn(
                  BTN_BASE,
                  "bg-primary-600 text-grey-50 hover:bg-primary-500 flex items-center gap-2 px-[12px] lg:px-[18px]",
                  isBusy && "cursor-not-allowed opacity-50"
                )}
              >
                <Send className="size-3.5" />
                {isBusy ? "Sending..." : "Send to Checker"}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
