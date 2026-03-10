import { useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { SearchableFilterSelect } from "@/shared/components/ui/SearchableFilterSelect";
import { cn } from "@/shared/lib/utils";
import type { Option } from "@/shared/components/ui/SearchableFilterSelect";
import {
  defineSchema,
  sendSchema,
  type ResponsibilityValues,
} from "../../types/DocumentWorkflowSchema";

// ─── Re-export so existing imports from this file keep working ─────────────────
export type { ResponsibilityValues };

// ─── Types ────────────────────────────────────────────────────────────────────

export type DialogVariant = "define" | "send";

interface DocumentWorkflowDialogProps {
  open: boolean;
  onClose: () => void;
  variant: DialogVariant;
  /** Full user list — dialog filters per role for AC5 uniqueness internally */
  userOptions?: Option[];
  values?: ResponsibilityValues;
  onChange?: (values: ResponsibilityValues) => void;
  // "define"
  onSave?: (values: ResponsibilityValues) => void;
  onViewOnly?: () => void;
  // "send"
  onSaveDraft?: (values: ResponsibilityValues) => void;
  onSendToChecker?: (values: ResponsibilityValues) => void;
  isSaving?: boolean;
}

const EMPTY: ResponsibilityValues = {
  originator: "",
  checker: "",
  approver: "",
};

// ─── Yellow Note ──────────────────────────────────────────────────────────────

function YellowNote() {
  return (
    <div
      className={cn(
        "flex w-full flex-col",
        "gap-[3px] lg:gap-[4px]",
        "border border-[#FFF3A7] bg-[#FFFED6]",
        "rounded-[10px] lg:rounded-[12px]",
        "px-[12px] py-[8px] lg:px-[16px] lg:py-[12px]"
      )}
    >
      <p className="text-450 leading-none font-medium text-[#F04438]">Note:</p>
      <p className="text-md text-primary-500 leading-snug">
        Please ensure that the names you fill in match those provided in the
        document
      </p>
    </div>
  );
}

// ─── Popup Header ─────────────────────────────────────────────────────────────

function PopupHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="flex w-full items-center justify-between">
      <h2 className="font-solutioneer text-primary-600 text-xl leading-none">
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close dialog"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full",
          "hover:bg-grey-100 transition-colors",
          "size-[24px] lg:size-[30px]"
        )}
      >
        <X className="text-primary-300 size-[13px] lg:size-[16px]" />
      </button>
    </div>
  );
}

// ─── Action Buttons ───────────────────────────────────────────────────────────

interface ActionButtonsProps {
  leftLabel: string;
  rightLabel: string;
  onLeft: () => void;
  onRight: () => void;
  rightDisabled?: boolean;
  rightAutoWidth?: boolean;
}

function ActionButtons({
  leftLabel,
  rightLabel,
  onLeft,
  onRight,
  rightDisabled = false,
  rightAutoWidth = false,
}: ActionButtonsProps) {
  const base = cn(
    "flex shrink-0 items-center justify-center gap-[8px]",
    "text-sm font-medium uppercase",
    "leading-[--line-height-300]",
    "transition-colors",
    "h-[34px] lg:h-[40px]",
    "px-[10px] lg:px-[14px]",
    "rounded-[7px] lg:rounded-[8px]"
  );

  return (
    <div className="flex w-full items-center justify-end gap-[8px] lg:gap-[10px]">
      <button
        type="button"
        onClick={onLeft}
        className={cn(
          base,
          "border-primary-200 text-primary-200 hover:bg-grey-100 w-[90px] border lg:w-[112px]"
        )}
      >
        {leftLabel}
      </button>
      <button
        type="button"
        onClick={onRight}
        disabled={rightDisabled}
        className={cn(
          base,
          "bg-primary-600 text-grey-50 hover:bg-primary-500",
          rightDisabled && "cursor-not-allowed opacity-50",
          rightAutoWidth ? "px-[12px] lg:px-[18px]" : "w-[90px] lg:w-[112px]"
        )}
      >
        {rightLabel}
      </button>
    </div>
  );
}

// ─── Main Dialog ──────────────────────────────────────────────────────────────

export function DocumentWorkflowDialog({
  open,
  onClose,
  variant,
  userOptions = [],
  values,
  onChange,
  onSave,
  onViewOnly,
  onSaveDraft,
  onSendToChecker,
  isSaving = false,
}: DocumentWorkflowDialogProps) {
  const schema = variant === "send" ? sendSchema : defineSchema;

  const form = useForm<ResponsibilityValues>({
    resolver: zodResolver(schema),
    defaultValues: values ?? EMPTY,
    // Only validate on submit — show errors after first attempt, then on change
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Live values needed for AC5 cross-field option filtering
  const currentValues = form.watch();

  // ── AC5: each dropdown hides emails already selected in sibling roles ──────
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

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleClose = useCallback(() => {
    form.reset(values ?? EMPTY);
    onClose();
  }, [form, values, onClose]);

  const handleViewOnly = useCallback(() => {
    onViewOnly?.();
    handleClose();
  }, [onViewOnly, handleClose]);

  // "define" primary — validated submit
  const handleSave = form.handleSubmit((data) => {
    onSave?.(data);
    // Notify parent of final committed values
    onChange?.(data);
    handleClose();
  });

  // "send" primary — validated submit
  const handleSendToCheckerSubmit = form.handleSubmit((data) => {
    onSendToChecker?.(data);
    onChange?.(data);
    handleClose();
  });

  // "send" secondary — draft save, no validation required
  const handleSaveDraft = useCallback(() => {
    onSaveDraft?.(form.getValues());
  }, [form, onSaveDraft]);

  const isSubmitting = form.formState.isSubmitting || isSaving;
  const allRequired = variant === "send";
  const title =
    variant === "define" ? "Define Responsibilities" : "Send Document";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className={cn(
          // Hide shadcn's built-in close button — we render our own
          "[&>button:last-child]:hidden",
          // Reset shadcn
          "gap-0 border-0 p-0 shadow-xl outline-none",
          // Shell
          "bg-grey-50 overflow-hidden",
          "rounded-[18px] lg:rounded-[24px]",
          "px-[20px] pt-[16px] pb-[20px] lg:px-[30px] lg:pt-[24px] lg:pb-[30px]",
          "w-[340px] lg:w-[500px]",
          "flex flex-col",
          "gap-[16px] lg:gap-[24px]"
        )}
      >
        <PopupHeader title={title} onClose={handleClose} />

        <div className="flex w-full flex-col gap-[16px] lg:gap-[24px]">
          {/* ── Fields ── */}
          <div className="flex w-full flex-col gap-[20px] lg:gap-[30px]">
            <Controller
              name="originator"
              control={form.control}
              render={({ field, fieldState }) => (
                <SearchableFilterSelect
                  label="Originator (Responsible)"
                  placeholder="EG. Amir"
                  options={originatorOptions}
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v);
                    onChange?.({ ...form.getValues(), originator: v });
                  }}
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
                  onValueChange={(v) => {
                    field.onChange(v);
                    onChange?.({ ...form.getValues(), checker: v });
                  }}
                  error={fieldState.error?.message}
                  required={allRequired}
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
                  onValueChange={(v) => {
                    field.onChange(v);
                    onChange?.({ ...form.getValues(), approver: v });
                  }}
                  error={fieldState.error?.message}
                  required={allRequired}
                  size="md"
                />
              )}
            />
          </div>
          <YellowNote />
        </div>

        {variant === "define" ? (
          <ActionButtons
            leftLabel="View Only"
            rightLabel="Save"
            onLeft={handleViewOnly}
            onRight={handleSave}
            rightDisabled={isSubmitting}
          />
        ) : (
          <ActionButtons
            leftLabel="Save"
            rightLabel="Send To Checker"
            onLeft={handleSaveDraft}
            onRight={handleSendToCheckerSubmit}
            rightDisabled={isSubmitting}
            rightAutoWidth
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDocumentWorkflowDialog() {
  const [state, setState] = useState<{ open: boolean; variant: DialogVariant }>(
    {
      open: false,
      variant: "define",
    }
  );

  const open = useCallback(
    (v: DialogVariant) => setState({ open: true, variant: v }),
    []
  );
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  return { dialogState: state, open, close };
}
