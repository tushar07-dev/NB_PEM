// src/features/pem-check-lists/components/ChecklistItemRow.tsx
import { useState, useCallback } from "react";
import { Check, Minus, Clock, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { parseSignature } from "../types/checklist";
import type {
  ChecklistItem,
  CheckResult,
  DocumentRole,
} from "../types/checklist";

interface ChecklistItemRowProps {
  item: ChecklistItem;
  role: DocumentRole;
  /** Called when originator toggles OK or NA — receives checkpointId (number, not string) */
  onCheckResult: (checkpointId: number, result: CheckResult) => Promise<void>;
}

// ─── OK / NA toggle button ────────────────────────────────────────────────────

interface CheckButtonProps {
  label: "OK" | "NA";
  active: boolean;
  disabled: boolean;
  saving: boolean;
  onClick: () => void;
}

function CheckButton({
  label,
  active,
  disabled,
  saving,
  onClick,
}: CheckButtonProps) {
  const isOK = label === "OK";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || saving}
      aria-label={`Mark as ${label}`}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 min-w-[52px] items-center justify-center gap-1.5 rounded-md px-3",
        "border text-xs font-semibold tracking-wider uppercase transition-all duration-150",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
        (disabled || saving) && "cursor-not-allowed opacity-40",
        isOK &&
          !active &&
          "border-green-300 bg-white text-green-600 hover:bg-green-50",
        isOK && active && "border-green-500 bg-green-500 text-white shadow-sm",
        !isOK &&
          !active &&
          "border-gray-300 bg-white text-gray-500 hover:bg-gray-50",
        !isOK && active && "border-gray-500 bg-gray-500 text-white shadow-sm"
      )}
    >
      {saving ? (
        <Loader2 className="size-3 animate-spin" />
      ) : isOK ? (
        <Check className="size-3" />
      ) : (
        <Minus className="size-3" />
      )}
      {label}
    </button>
  );
}

// ─── Timestamp pill (parses "Name|ISODate" signature string) ─────────────────

function SavedStamp({ signature }: { signature: string | null }) {
  const parsed = parseSignature(signature);
  if (!parsed) return null;
const formatted = new Date(parsed.date).toLocaleString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
      <Clock className="size-3 shrink-0" />
      <span>
        {parsed.name} · {formatted}
      </span>
    </div>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

export function ChecklistItemRow({
  item,
  role,
  onCheckResult,
}: ChecklistItemRowProps) {
  const [saving, setSaving] = useState(false);
  const isOriginator = role === "ORIGINATOR";

  const handleToggle = useCallback(
    async (result: CheckResult) => {
      if (!isOriginator || saving) return;
      const next: CheckResult = item.checkResult === result ? null : result;
      setSaving(true);
      try {
        await onCheckResult(item.checkpointId, next);
      } finally {
        setSaving(false);
      }
    },
    [isOriginator, saving, item.checkResult, item.checkpointId, onCheckResult]
  );

  const resultColour =
    item.checkResult === "OK"
      ? "bg-green-50 border-l-4 border-l-green-400"
      : item.checkResult === "NA"
        ? "bg-gray-50 border-l-4 border-l-gray-400"
        : "border-l-4 border-l-transparent";

  return (
    <div
      className={cn(
        "grid grid-cols-[40px_1fr_auto] items-start gap-4 rounded-md border border-gray-100 bg-white px-4 py-3 transition-colors",
        resultColour
      )}
    >
      {/* Serial No */}
      <span className="text-primary-300 mt-0.5 text-xs font-medium">
        {String(item.serialNo).padStart(2, "0")}
      </span>

      {/* Checkpoint text + quality levels + originator stamp */}
      <div className="flex flex-col gap-1">
        <p className="text-primary-500 text-sm leading-snug">
          {item.description}
        </p>
        {item.qualityLevel.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.qualityLevel.map((ql) => (
              <span
                key={ql}
                className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500"
              >
                {ql}
              </span>
            ))}
          </div>
        )}
        <SavedStamp signature={item.originatorSignature} />
      </div>

      {/* OK / NA buttons */}
      <div className="flex items-center gap-2" data-no-row-click>
        <CheckButton
          label="OK"
          active={item.checkResult === "OK"}
          disabled={!isOriginator}
          saving={saving && item.checkResult !== "OK"}
          onClick={() => void handleToggle("OK")}
        />
        <CheckButton
          label="NA"
          active={item.checkResult === "NA"}
          disabled={!isOriginator}
          saving={saving && item.checkResult !== "NA"}
          onClick={() => void handleToggle("NA")}
        />
      </div>
    </div>
  );
}
