// src/features/pem-check-lists/components/ChecklistTable.tsx
//
// Migrated from plain useReactTable → useDataTable so it gets the full
// shared table feature set: column filters, sorting, pagination, show/hide
// columns — all isolated via FilterStoreProvider (no bleed with DocumentTable).

import { useMemo, useCallback, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/shared/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/shared/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/shared/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/shared/components/data-table/data-table-sort-list";
import { DataTableColumnHeader } from "@/shared/components/data-table/data-table-column-header";
import { DataTableGlobalSearch } from "@/shared/components/data-table/data-table-global-search";
import { useDataTable } from "@/shared/hooks/data-table/use-data-table";
import { FilterStoreProvider } from "@/shared/context/FilterStoreContext";
import { Check, Minus, Clock, Loader2, FileX } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { parseSignature } from "../types/checklist";
import type {
  ChecklistItem,
  CheckResult,
  DocumentRole,
} from "../types/checklist";

// ─── Filter options ────────────────────────────────────────────────────────────

const CHECK_RESULT_OPTIONS = [
  { label: "OK", value: "OK" },
  { label: "NA", value: "NA" },
  { label: "Not Set", value: "NOT_SET" },
];

// ─── Signature cell ────────────────────────────────────────────────────────────

function SignatureCell({ signature }: { signature: string | null }) {
  const parsed = parseSignature(signature);
  if (!parsed) return <span className="text-xs text-gray-300">—</span>;

  const formatted = parsed.date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  });

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-primary-700 text-sm font-medium lg:text-lg">
        {parsed.name}
      </span>
      <div className="text-primary-400 flex items-center gap-1 text-xs">
        <Clock className="size-2.5 shrink-0" />
        <span className="text-primary-700 text-sm lg:text-base">
          {formatted}
        </span>
      </div>
    </div>
  );
}

// ─── Check cell ───────────────────────────────────────────────────────────────

interface CheckCellProps {
  item: ChecklistItem;
  role: DocumentRole;
  canEdit?: boolean;
  onCheckResult: (checkpointId: number, result: CheckResult) => Promise<void>;
}

function CheckCell({ item, role, canEdit, onCheckResult }: CheckCellProps) {
  const [saving, setSaving] = useState(false);
  const isEditable = canEdit ?? role === "ORIGINATOR";

  const handleToggle = useCallback(
    async (result: CheckResult) => {
      if (!isEditable || saving) return;
      if (item.checkResult === result) return;
      setSaving(true);
      try {
        await onCheckResult(item.checkpointId, result);
      } finally {
        setSaving(false);
      }
    },
    [isEditable, saving, item.checkResult, item.checkpointId, onCheckResult]
  );

  const btn = (label: "OK" | "NA") => {
    // const isOK = label === "OK";
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
          "inline-flex h-7 min-w-13 items-center justify-center gap-1 rounded-full px-3 lg:h-9 lg:min-w-18 lg:px-4",
          "border text-sm tracking-wide uppercase transition-all duration-150 lg:text-base",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
          (disabled || saving) && "cursor-not-allowed opacity-40",
          active
            ? "border-primary-600 text-primary-600 bg-white"
            : "bg-grey-200 text-grey-600 hover:bg-grey-275 border-transparent"
        )}
      >
        {showSpinner && <Loader2 className="size-3 animate-spin" />}
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

function ChecklistTableInner({
  items,
  role,
  canEdit,
  loading = false,
  onCheckResult,
}: ChecklistTableProps) {
  // Derive unique category + qualityLevel options from current data
  const categoryOptions = useMemo(() => {
    const unique = [...new Set(items.map((i) => i.category).filter(Boolean))];
    return unique.map((v) => ({ label: v, value: v }));
  }, [items]);

  const qualityLevelOptions = useMemo(() => {
    const unique = [...new Set(items.flatMap((i) => i.qualityLevel))].filter(
      Boolean
    );
    return unique.map((v) => ({ label: v, value: v }));
  }, [items]);

  const columns = useMemo<ColumnDef<ChecklistItem>[]>(
    () => [
      {
        accessorKey: "serialNo",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="ID" />
        ),
        size: 48,
        cell: ({ getValue }) => (
          <span className="font-helvetica-now text-primary-500 lg:text-md text-base leading-snug font-medium capitalize">
            {String(getValue<number>()).padStart(2, "0")}
          </span>
        ),
        meta: { label: "ID" },
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Checkpoint" />
        ),
        cell: ({ getValue }) => (
          <p className="font-helvetica-now text-primary-500 lg:text-md text-base leading-snug font-medium capitalize">
            {getValue<string>()}
          </p>
        ),
        meta: {
          label: "Checkpoint",
          placeholder: "Search checkpoint...",
          variant: "text",
        },
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Category" />
        ),
        size: 140,
        cell: ({ getValue }) => (
          <span className="font-helvetica-now text-primary-500 lg:text-md text-base leading-snug font-medium capitalize">
            {getValue<string>() || "—"}
          </span>
        ),
        meta: {
          label: "Category",
          variant: "multiSelect",
          options: categoryOptions,
        },
        filterFn: (row, id, value: string[]) =>
          value.includes(row.getValue(id)),
      },
      {
        accessorKey: "qualityLevel",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Quality Level" />
        ),
        size: 180,
        cell: ({ getValue }) => {
          const levels = getValue<string[]>();
          if (!levels.length)
            return <span className="text-primary-300 text-xs">—</span>;
          return (
            <span className="font-helvetica-now text-primary-500 lg:text-md text-base leading-snug font-medium capitalize">
              {levels.join("; ")}
            </span>
          );
        },
        meta: {
          label: "Quality Level",
          variant: "multiSelect",
          options: qualityLevelOptions,
        },
        // qualityLevel is string[] — match if row array contains any selected value
        filterFn: (row, id, value: string[]) => {
          const cellLevels = row.getValue<string[]>(id);
          return value.some((v) => cellLevels.includes(v));
        },
      },
      {
        accessorKey: "checkResult",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Check Result" />
        ),
        size: 150,
        cell: ({ row }) => (
          <CheckCell
            item={row.original}
            role={role}
            canEdit={canEdit}
            onCheckResult={onCheckResult}
          />
        ),
        meta: {
          label: "Check Result",
          variant: "multiSelect",
          options: CHECK_RESULT_OPTIONS,
        },
        // null maps to "NOT_SET" for filter comparison
        filterFn: (row, id, value: string[]) => {
          const cellVal = row.getValue<string | null>(id);
          const normalized = cellVal ?? "NOT_SET";
          return value.includes(normalized);
        },
      },
      {
        accessorKey: "originatorSignature",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Originator signature" />
        ),
        size: 160,
        cell: ({ getValue }) => (
          <SignatureCell signature={getValue<string | null>()} />
        ),
        meta: { label: "Originator signature" },
      },
      {
        accessorKey: "checkerSignature",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Checker signature" />
        ),
        size: 160,
        cell: ({ getValue }) => (
          <SignatureCell signature={getValue<string | null>()} />
        ),
        meta: { label: "Checker signature" },
      },
    ],
    [role, canEdit, onCheckResult, categoryOptions, qualityLevelOptions]
  );

  const { table } = useDataTable({
    data: items,
    columns,
    pageCount: -1,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    searchableColumns: ["description", "category", "qualityLevel"],
  });

  return (
    <DataTable
      table={table}
      loading={loading}
      loadingRowCount={8}
      emptyState={
        <div className="text-primary-400 flex flex-col items-center gap-2 py-8">
          <FileX className="size-10 opacity-40" />
          <p className="text-sm">No checklist items found for this document.</p>
        </div>
      }
      //   rowClassName={(row) =>
      //     row.checkResult === "OK"
      //       ? "border-l-4 border-l-primary-400 bg-primary-50/40"
      //       : row.checkResult === "NA"
      //         ? "border-l-4 border-l-primary-400 bg-primary-50/40"
      //         : "border-l-4 border-l-transparent"
      //   }
      showRowsPerPage
      showPageNumbers
      showSelectedCount={false}
      paginationVariant="simple"
    >
      {/* <DataTableAdvancedToolbar table={table}>
        <DataTableGlobalSearch placeholder="Search checkpoints..." />
        <DataTableFilterList table={table} />
        <DataTableSortList table={table} />
      </DataTableAdvancedToolbar> */}
    </DataTable>
  );
}

// ─── Public export — wraps inner component with isolated filter store ──────────

export function ChecklistTable(props: ChecklistTableProps) {
  return (
    <FilterStoreProvider name="checklist">
      <ChecklistTableInner {...props} />
    </FilterStoreProvider>
  );
}
