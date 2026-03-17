// src/features/pem-check-lists/hooks/use-document-columns.tsx
import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Clock } from "lucide-react";
import { DataTableColumnHeader } from "@/shared/components/data-table/data-table-column-header";
import { TableCellContent } from "@/shared/components/ui/table";
import { useBreakpoint } from "@/shared/hooks/data-table/use-breakpoint";
import { getDisplayName } from "@/shared/config/users";
import {
  type DocumentEntry,
  type DocumentProgress,       // ✅ uncommented
  PROGRESS_CONFIG,             // ✅ uncommented
  WORKFLOW_STATUS_CONFIG,
  reasonForIssueOptions,
  revisionStatusOptions,
  progressOptions,             // ✅ uncommented
} from "../types/document";

export function useDocumentColumns(
  handleRevHistoryClick: (row: DocumentEntry) => void
) {
  const { isLg, isXl } = useBreakpoint();

  return useMemo<ColumnDef<DocumentEntry>[]>(
    () => [
      {
        accessorKey: "title",
        size: isXl ? 320 : isLg ? 280 : 200,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Title" />,
        cell: ({ row }) => <TableCellContent>{row.getValue("title")}</TableCellContent>,
        meta: { label: "Title", placeholder: "Search title...", variant: "text" },
      },
      {
        accessorKey: "documentNo",
        size: isXl ? 220 : isLg ? 200 : 160,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Document No" />,
        cell: ({ row }) => <TableCellContent>{row.getValue("documentNo")}</TableCellContent>,
        meta: { label: "Document No", placeholder: "Search document no...", variant: "text" },
      },
      {
        accessorKey: "reasonForIssue",
        size: isXl ? 180 : isLg ? 160 : 120,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Reason For Issue" />,
        cell: ({ row }) => (
          <TableCellContent>{row.getValue("reasonForIssue") || "N/A"}</TableCellContent>
        ),
        meta: { label: "Reason For Issue", variant: "multiSelect", options: reasonForIssueOptions },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
      {
        accessorKey: "revisionStatus",
        size: isXl ? 180 : isLg ? 160 : 120,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Revision Status" />,
        cell: ({ row }) => <TableCellContent>{row.getValue("revisionStatus")}</TableCellContent>,
        meta: { label: "Revision Status", variant: "multiSelect", options: revisionStatusOptions },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
      {
        accessorKey: "revision",
        size: isXl ? 120 : isLg ? 100 : 80,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Revision" />,
        cell: ({ row }) => (
          <TableCellContent>
            {(row.getValue("revision") as string | null) ?? "-"}
          </TableCellContent>
        ),
        meta: { label: "Revision", variant: "number" },
      },
      {
        accessorKey: "originatorSelfCheck",
        size: isXl ? 220 : isLg ? 180 : 140,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Originator (Self Check)" />
        ),
        cell: ({ row }) => {
          const email = row.getValue("originatorSelfCheck") as string | null;
          const name = getDisplayName(email);
          const status = row.original.workflowStatus;
          const isActive = status === "PENDING_WITH_ORIGINATOR";
          const isRejected = status === "REJECTED_BY_CHECKER" || status === "REJECTED_BY_APPROVER";
          return name ? (
            <TableCellContent
              className={isRejected ? "font-medium text-red-600" : isActive ? "font-medium text-amber-700" : ""}
            >
              {name}
            </TableCellContent>
          ) : <span className="text-muted-foreground">—</span>;
        },
        meta: { label: "Originator (Self Check)", placeholder: "Search originator...", variant: "text" },
      },
      {
        accessorKey: "checker",
        size: isXl ? 180 : isLg ? 160 : 130,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Checker" />,
        cell: ({ row }) => {
          const name = getDisplayName(row.getValue("checker") as string | null);
          const isActive = row.original.workflowStatus === "PENDING_WITH_CHECKER";
          return name
            ? <TableCellContent className={isActive ? "font-medium text-amber-700" : ""}>{name}</TableCellContent>
            : <span className="text-muted-foreground">—</span>;
        },
        meta: { label: "Checker", placeholder: "Search checker...", variant: "text" },
      },
      {
        accessorKey: "approver",
        size: isXl ? 180 : isLg ? 160 : 130,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Approver" />,
        cell: ({ row }) => {
          const name = getDisplayName(row.getValue("approver") as string | null);
          const isActive = row.original.workflowStatus === "PENDING_WITH_APPROVER";
          return name
            ? <TableCellContent className={isActive ? "font-medium text-amber-700" : ""}>{name}</TableCellContent>
            : <span className="text-muted-foreground">—</span>;
        },
        meta: { label: "Approver", placeholder: "Search approver...", variant: "text" },
      },
      {
        accessorKey: "workflowStatus",
        size: isXl ? 180 : isLg ? 160 : 130,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Workflow" />,
        cell: ({ row }) => {
          const status = row.getValue("workflowStatus") as DocumentEntry["workflowStatus"];
          const cfg = WORKFLOW_STATUS_CONFIG[status] ?? WORKFLOW_STATUS_CONFIG.NOT_STARTED;
          return <TableCellContent>{cfg.label}</TableCellContent>;
        },
        meta: { label: "Workflow", placeholder: "Search workflow...", variant: "text" },
      },
      // ✅ Uncommented — was blocked by missing PROGRESS_CONFIG export
      {
        accessorKey: "progress",
        size: isXl ? 150 : isLg ? 130 : 110,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Progress" />,
        cell: ({ row }) => {
          const cfg = PROGRESS_CONFIG[row.getValue("progress") as DocumentProgress] ?? PROGRESS_CONFIG.NOT_STARTED;
          return <span className={`text-sm ${cfg.className}`}>{cfg.label}</span>;
        },
        meta: { label: "Progress", variant: "multiSelect", options: progressOptions },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
      {
        id: "revHistory",
        size: isXl ? 120 : isLg ? 100 : 80,
        header: () => <span>Rev History</span>,
        cell: ({ row }) => (
          <button
            className="icon-btn-dark-blue"
            aria-label={`View revision history for ${row.original.documentNo}`}
            onClick={(e) => { e.stopPropagation(); handleRevHistoryClick(row.original); }}
          >
            <Clock className="h-4 w-4" />
          </button>
        ),
        enableSorting: false,
        enableHiding: false,
        enableColumnFilter: false,
      },
    ],
    [isLg, isXl, handleRevHistoryClick]
  );
}
