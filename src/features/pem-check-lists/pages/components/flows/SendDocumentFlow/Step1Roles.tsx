// src/features/pem-check-lists/pages/components/flows/SendDocumentFlow/Step1Roles.tsx
//
// Step 1 of the Send Document flow.
//
// Originator field: always disabled — pre-filled with the current user's email.
//   The logged-in user is always the originator for this document; this cannot
//   be changed in the flow.
//
// Checker + Approver: pre-filled from document if already set, otherwise empty.
//   Each dropdown excludes emails already selected in sibling dropdowns.
//
// SAVE button:
//   — No validation required (originator is always set).
//   — Calls AssignDocumentRoles with checker/approver as-is (null if empty).
//   — The mutation hook fires its own toast on success/failure.
//   — Dialog closes after the call (parent handles this via onSave).
//
// SEND TO CHECKER button:
//   — Validates all 3 roles are filled (react-hook-form + sendSchema).
//   — Validates all checklist items are signed (done === total).
//   — Shows inline errors for both validations if they fail.
//   — Only advances to step 2 if both pass.

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useCallback } from "react";
import { cn } from "@/shared/lib/utils";
import { SearchableFilterSelect } from "@/shared/components/ui/SearchableFilterSelect";
import { FlowHeader, StepIndicator, YellowNote } from "../../_flow-shared";
import {
  sendSchema,
  type ResponsibilityValues,
} from "@/features/pem-check-lists/types/DocumentWorkflowSchema";
import type { Option } from "@/shared/components/ui/SearchableFilterSelect";

// ─── Shared button base (local constant — not exported) ───────────────────────

const BTN_BASE = cn(
  "flex shrink-0 items-center justify-center gap-2",
  "text-sm font-medium uppercase transition-colors",
  "h-[34px] lg:h-[40px]",
  "px-2 lg:px-[14px]",
  "rounded-[7px] lg:rounded-[8px]"
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface Step1RolesProps {
  /** Pre-filled values from parent (document state or previous save) */
  initialValues: ResponsibilityValues;
  /** Current logged-in user's email — shown as disabled originator field */
  originatorEmail: string;
  /** Full user options list — siblings are filtered to exclude already-selected */
  userOptions: Option[];
  /** Originator-signature count — used to validate all items are signed */
  done: number;
  total: number;
  /** True while the parent's AssignRoles mutation is in flight */
  isSaving: boolean;
  /** Called when user clicks Save — parent fires API + closes dialog */
  onSave: (vals: ResponsibilityValues) => void;
  /** Called when Send To Checker passes all validation — advances to step 2 */
  onNext: (vals: ResponsibilityValues) => void;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Step1Roles({
  initialValues,
  originatorEmail,
  userOptions,
  done,
  total,
  isSaving,
  onSave,
  onNext,
  onClose,
}: Step1RolesProps) {
  const form = useForm<ResponsibilityValues>({
    resolver: zodResolver(sendSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const currentValues = form.watch();
  const allSigned = total > 0 && done === total;

  const checkerOptions = useMemo(
    () =>
      userOptions.filter(
        (o) =>
          o.value === currentValues.checker || // always keep own selection
          (o.value !== currentValues.originator &&
            o.value !== currentValues.approver)
      ),
    [
      userOptions,
      currentValues.originator,
      currentValues.checker,
      currentValues.approver,
    ]
  );
  const approverOptions = useMemo(
    () =>
      userOptions.filter(
        (o) =>
          o.value === currentValues.approver || // always keep own selection
          (o.value !== currentValues.originator &&
            o.value !== currentValues.checker)
      ),
    [
      userOptions,
      currentValues.originator,
      currentValues.checker,
      currentValues.approver,
    ]
  );

  // SAVE — no validation, passes current form values as-is
  const handleSave = useCallback(() => {
    onSave(form.getValues());
  }, [form, onSave]);

  // SEND TO CHECKER — validates roles via react-hook-form, then checks signatures
  const handleSendToChecker = form.handleSubmit((vals) => {
    if (!allSigned) {
      // Don't advance — inline message is shown below
      return;
    }
    onNext(vals);
  });

  return (
    <>
      <FlowHeader title="Send Document" onClose={onClose} disabled={isSaving}>
        <StepIndicator total={3} current={1} />
      </FlowHeader>

      <div className="flex flex-col gap-4 lg:gap-5">
        <div className="flex flex-col gap-5 lg:gap-6">
          {/* ── Originator — disabled, always the current logged-in user ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-primary-400 text-sm font-medium">
              Originator (Responsible) <span className="text-red-500">*</span>
            </label>
            <div className="bg-grey-100 flex h-11 cursor-not-allowed items-center rounded-2 border border-gray-200 px-3 text-sm text-gray-400 opacity-70 select-none">
              {originatorEmail}
            </div>
          </div>

          {/* ── Checker ── */}
          <Controller
            name="checker"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
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
              );
            }}
          />

          {/* ── Approver ── */}
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

        {/* ── Checkpoint completion warning (shown only when Send To Checker is blocked) ── */}
        {!allSigned && total > 0 && (
          <div className="flex items-start gap-1.5 rounded-md border border-amber-100 bg-amber-50 px-3 py-2">
            <span className="mt-0.5 text-amber-500">⚠</span>
            <p className="text-xs text-amber-700">
              All {total} checkpoints must be signed before sending to checker.{" "}
              <span className="font-semibold">
                {done}/{total} done.
              </span>
            </p>
          </div>
        )}

        <YellowNote />
      </div>

      {/* ── Footer ── */}
      <div className="flex w-full items-center justify-end gap-2 lg:gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            BTN_BASE,
            "border-primary-200 text-primary-200 hover:bg-grey-100 w-23 border lg:w-28",
            isSaving && "cursor-not-allowed opacity-50"
          )}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={handleSendToChecker}
          disabled={isSaving}
          className={cn(
            BTN_BASE,
            "bg-primary-600 text-grey-50 hover:bg-primary-500 px-3 lg:px-5",
            isSaving && "cursor-not-allowed opacity-50"
          )}
        >
          Send To Checker
        </button>
      </div>
    </>
  );
}
