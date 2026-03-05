import { useState, useCallback, useMemo } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { SearchableFilterSelect } from "@/shared/components/ui/SearchableFilterSelect";
import { cn } from "@/shared/lib/utils";
import type { Option } from "@/shared/components/ui/SearchableFilterSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DialogVariant = "define" | "send";

export interface ResponsibilityValues {
  originator: string;
  checker: string;
  approver: string;
}

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

// ─── Responsibility Fields ────────────────────────────────────────────────────
// AC5: each dropdown excludes emails already selected in the other two roles

function ResponsibilityFields({
  variant,
  allOptions,
  values,
  onChange,
}: {
  variant: DialogVariant;
  allOptions: Option[];
  values: ResponsibilityValues;
  onChange: (v: ResponsibilityValues) => void;
}) {
  const allRequired = variant === "send";

  // AC5: filter out already-selected values from sibling roles
  const originatorOptions = useMemo(
    () =>
      allOptions.filter(
        (o) => o.value !== values.checker && o.value !== values.approver
      ),
    [allOptions, values.checker, values.approver]
  );
  const checkerOptions = useMemo(
    () =>
      allOptions.filter(
        (o) => o.value !== values.originator && o.value !== values.approver
      ),
    [allOptions, values.originator, values.approver]
  );
  const approverOptions = useMemo(
    () =>
      allOptions.filter(
        (o) => o.value !== values.originator && o.value !== values.checker
      ),
    [allOptions, values.originator, values.checker]
  );

  return (
    <div className="flex w-full flex-col gap-[20px] lg:gap-[30px]">
      <SearchableFilterSelect
        label="Originator (Responsible)"
        placeholder="EG. Amir"
        options={originatorOptions}
        value={values.originator}
        onValueChange={(v) => onChange({ ...values, originator: v })}
        required
        size="md"
      />
      <SearchableFilterSelect
        label="Checker (Reviewer)"
        placeholder="EG. Sanghati"
        options={checkerOptions}
        value={values.checker}
        onValueChange={(v) => onChange({ ...values, checker: v })}
        required={allRequired}
        size="md"
      />
      <SearchableFilterSelect
        label="Approver (Accountable)"
        placeholder="EG. Xavier"
        options={approverOptions}
        value={values.approver}
        onValueChange={(v) => onChange({ ...values, approver: v })}
        required={allRequired}
        size="md"
      />
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
  const [local, setLocal] = useState<ResponsibilityValues>(values ?? EMPTY);

  // Sync if parent passes new values (e.g. when row changes)
  const handleChange = useCallback(
    (v: ResponsibilityValues) => {
      setLocal(v);
      onChange?.(v);
    },
    [onChange]
  );

  const handleClose = useCallback(() => {
    setLocal(values ?? EMPTY);
    onClose();
  }, [values, onClose]);

  const handleViewOnly = () => {
    onViewOnly?.();
    handleClose();
  };
  const handleSave = () => {
    onSave?.(local);
    handleClose();
  };
  const handleSaveDraft = () => {
    onSaveDraft?.(local);
  };
  const handleSendToChecker = () => {
    onSendToChecker?.(local);
    handleClose();
  };

  // "define": only originator required
  // "send":   all 3 required
  const defineDisabled = !local.originator || isSaving;
  const sendDisabled = !local.originator || !local.checker || !local.approver || isSaving;

  const title =
    variant === "define" ? "Define Responsibilities" : "Send Document";

  // Sync local state when the dialog opens with new values
  // (handles case where user clicks different rows)
  const syncedValues = values ?? EMPTY;
  // TODO: Use syncedValues when implementing form pre-population
  void syncedValues;

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
          <ResponsibilityFields
            variant={variant}
            allOptions={userOptions}
            values={local}
            onChange={handleChange}
          />
          <YellowNote />
        </div>

        {variant === "define" ? (
          <ActionButtons
            leftLabel="View Only"
            rightLabel="Save"
            onLeft={handleViewOnly}
            onRight={handleSave}
            rightDisabled={defineDisabled}
          />
        ) : (
          <ActionButtons
            leftLabel="Save"
            rightLabel="Send To Checker"
            onLeft={handleSaveDraft}
            onRight={handleSendToChecker}
            rightDisabled={sendDisabled}
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
