// src/features/pem-check-lists/components/ChecklistTable.tsx
//
// Uses the shared DataTable (visual layer) with a plain useReactTable instance
// (no useDataTable hook — checklist items are client-side, no server pagination/filter).

import { useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import { DataTable } from "@/shared/components/data-table/data-table";
import { Check, Minus, Clock, Loader2, FileX } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { parseSignature } from "../types/checklist";
import type {
  ChecklistItem,
  CheckResult,
  DocumentRole,
} from "../types/checklist";
import { useState } from "react";

// ─── Signature cell ────────────────────────────────────────────────────────────

function SignatureCell({ signature }: { signature: string | null }) {
  const parsed = parseSignature(signature);
  if (!parsed) return <span className="text-xs text-gray-300">—</span>;

  const formatted = new Date(parsed.date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-gray-700">{parsed.name}</span>
      <div className="flex items-center gap-1 text-[10px] text-gray-400">
        <Clock className="size-2.5 shrink-0" />
        <span>{formatted}</span>
      </div>
    </div>
  );
}

// ─── Check buttons cell (rendered inline, not as a separate component with state,
//      so each row's saving state lives in a wrapper below) ─────────────────────

interface CheckCellProps {
  item: ChecklistItem;
  role: DocumentRole;
  canEdit?: boolean;
  onCheckResult: (checkpointId: number, result: CheckResult) => Promise<void>;
}

function CheckCell({ item, role, canEdit, onCheckResult }: CheckCellProps) {
  const [saving, setSaving] = useState(false);
  // If canEdit is explicitly provided, use it. Otherwise fall back to old behavior.
  const isEditable = canEdit ?? role === "ORIGINATOR";

  const handleToggle = useCallback(
    async (result: CheckResult) => {
      if (!isEditable || saving) return;
      if (item.checkResult === result) return; // same value — do nothing
      setSaving(true);
      try {
        await onCheckResult(item.checkpointId, result); // always OK or NA, never null
      } finally {
        setSaving(false);
      }
    },
    [isEditable, saving, item.checkResult, item.checkpointId, onCheckResult]
  );

  const btn = (label: "OK" | "NA") => {
    const isOK = label === "OK";
    const active = item.checkResult === label;
    const disabled = !isEditable;
    const showSpinner = saving && item.checkResult !== label;

    return (
      <button
        type="button"
        onClick={() => void handleToggle(label)}
        disabled={disabled || saving}
        aria-label={`Mark as ${label}`}
        aria-pressed={active}
        data-no-row-click
        className={cn(
          "inline-flex h-7 min-w-[46px] items-center justify-center gap-1 rounded px-2.5",
          "border text-[11px] font-semibold tracking-wide uppercase transition-all duration-150",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
          (disabled || saving) && "cursor-not-allowed opacity-40",
          isOK &&
            !active &&
            "border-green-300 bg-white text-green-600 hover:bg-green-50",
          isOK &&
            active &&
            "border-green-500 bg-green-500 text-white shadow-sm",
          !isOK &&
            !active &&
            "border-gray-300 bg-white text-gray-500 hover:bg-gray-50",
          !isOK && active && "border-gray-500 bg-gray-500 text-white shadow-sm"
        )}
      >
        {showSpinner ? (
          <Loader2 className="size-3 animate-spin" />
        ) : isOK ? (
          <Check className="size-3" />
        ) : (
          <Minus className="size-3" />
        )}
        {label}
      </button>
    );
  };

  return (
    <div className="flex items-center gap-1.5" data-no-row-click>
      {btn("OK")}
      {btn("NA")}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

interface ChecklistTableProps {
  items: ChecklistItem[];
  role: DocumentRole;
  canEdit?: boolean;
  loading?: boolean;
  onCheckResult: (checkpointId: number, result: CheckResult) => Promise<void>;
}

export function ChecklistTable({
  items,
  role,
  canEdit,
  loading = false,
  onCheckResult,
}: ChecklistTableProps) {
  const columns = useMemo<ColumnDef<ChecklistItem>[]>(
    () => [
      {
        accessorKey: "serialNo",
        header: "#",
        size: 48,
        cell: ({ getValue }) => (
          <span className="text-primary-300 text-xs font-medium tabular-nums">
            {String(getValue<number>()).padStart(2, "0")}
          </span>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        size: 120,
        cell: ({ getValue, row }) => (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-700">
              {getValue<string>() || "—"}
            </span>
            {row.original.qualityLevel.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {row.original.qualityLevel.map((ql) => {
                  const qlShort = `QL${ql.split(" ")[2]}`; // Extract number

                  return (
                    <span key={ql} className="px-0.5 py-0.5 text-[10px]">
                      {qlShort}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Checkpoint",
        cell: ({ getValue }) => (
          <p className="text-primary-500 text-sm leading-snug">
            {getValue<string>()}
          </p>
        ),
      },
      {
        id: "checkResult",
        header: "Check",
        size: 130,
        cell: ({ row }) => (
          <CheckCell
            item={row.original}
            role={role}
            canEdit={canEdit}
            onCheckResult={onCheckResult}
          />
        ),
      },
      {
        accessorKey: "originatorSignature",
        header: "Originator",
        size: 160,
        cell: ({ getValue }) => (
          <SignatureCell signature={getValue<string | null>()} />
        ),
      },
      {
        accessorKey: "checkerSignature",
        header: "Checker",
        size: 160,
        cell: ({ getValue }) => (
          <SignatureCell signature={getValue<string | null>()} />
        ),
      },
    ],
    [role, canEdit, onCheckResult]
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  return (
    <DataTable
      table={table}
      loading={loading}
      loadingRowCount={8}
      emptyState={
        <div className="flex flex-col items-center gap-2 py-8 text-gray-400">
          <FileX className="size-10 opacity-40" />
          <p className="text-sm">No checklist items found for this document.</p>
        </div>
      }
      rowClassName={(row) =>
        row.checkResult === "OK"
          ? "border-l-4 border-l-green-400 bg-green-50/40"
          : row.checkResult === "NA"
            ? "border-l-4 border-l-gray-400 bg-gray-50/40"
            : "border-l-4 border-l-transparent"
      }
      showRowsPerPage={false}
      showPageNumbers={false}
      showSelectedCount={false}
    />
  );
}
