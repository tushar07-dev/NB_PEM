// src/features/pem-checklists/components/DocumentColumns.tsx

import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Badge } from "@/shared/components/ui/badge";
import { DataTableColumnHeader } from "@/shared/components/data-table/DataTableColumnHeader";
import { DataTableRowActions } from "@/shared/components/data-table/DataTableRowActions";
import type { DocumentRecord } from "../../types/document";

// Status badge styling
const statusStyles = {
  "Not Started": "bg-gray-100 text-gray-800 border-gray-200",
  "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
  Completed: "bg-green-100 text-green-800 border-green-200",
};

export const documentColumns: ColumnDef<DocumentRecord>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "documentNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Document No" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px]">{row.getValue("documentNo")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "reasonForIssue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reason For Issue" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span>{row.getValue("reasonForIssue")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "revisionStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Revision Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span>{row.getValue("revisionStatus")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "revision",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Revision" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("revision")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "originator",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Originator(Self Check)" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("originator")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "checker",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Checker" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("checker")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "approver",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Approver" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("approver")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as DocumentRecord["status"];
      return (
        <Badge variant="outline" className={statusStyles[status]}>
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
