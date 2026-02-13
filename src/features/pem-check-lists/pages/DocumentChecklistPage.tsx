import { useState } from "react";
import { DocumentFilters } from "./components/DocumentFilters";
import { Button } from "@/shared/components/ui/button";

import { Clock as ClockIcon, Eye } from "lucide-react";

import { AdvancedTable } from "@/shared/components/advanced-table/AdvancedTable";

import { TableModal } from "@/shared/components/advanced-table/modals/TableModal";
import { Badge } from "@/shared/components/ui/badge";

import type { AdvancedColumnDef } from "@/shared/components/advanced-table/types";
import type { DocumentFiltersType, DocumentRecord } from "../types/document";
import type { Row } from "@tanstack/react-table";

// Mock data - replace with API call
const mockDocuments: DocumentRecord[] = [
  {
    id: "1",
    title: "Drawing For P&ID",
    documentNo: "C143-AS-H-XC-00020-01",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: "14",
    originator: "Xavier Fernandes",
    checker: "-",
    approver: "-",
    status: "In Progress",
  },
  {
    id: "2",
    title: "Drawing For P&ID",
    documentNo: "C143-AS-H-XC-00020-01",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: "11",
    originator: "Sophie Chen",
    checker: "Ava Chen",
    approver: "Anna Lee",
    status: "Completed",
  },
  // {
  //   id: "3",
  //   title: "Drawing For P&ID",
  //   documentNo: "C143-AS-H-XC-00020-01",
  //   reasonForIssue: "IFC",
  //   revisionStatus: "OF",
  //   revision: "13",
  //   originator: "Liam O'Connor",
  //   checker: "Liam Rodriguez",
  //   approver: "James Park",
  //   status: "Completed",
  // },
  // {
  //   id: "4",
  //   title: "Drawing For P&ID",
  //   documentNo: "C143-AS-H-XC-00020-01",
  //   reasonForIssue: "IFC",
  //   revisionStatus: "OF",
  //   revision: "15",
  //   originator: "Isabella Martinez",
  //   checker: "Maya Patel",
  //   approver: "Sofia Kim",
  //   status: "Completed",
  // },
  // {
  //   id: "5",
  //   title: "Drawing For P&ID",
  //   documentNo: "C143-AS-H-XC-00020-01",
  //   reasonForIssue: "IFC",
  //   revisionStatus: "OF",
  //   revision: "-",
  //   originator: "-",
  //   checker: "-",
  //   approver: "-",
  //   status: "Not Started",
  // },
  // {
  //   id: "6",
  //   title: "Drawing For P&ID",
  //   documentNo: "C143-AS-H-XC-00020-01",
  //   reasonForIssue: "IFC",
  //   revisionStatus: "OF",
  //   revision: "-",
  //   originator: "-",
  //   checker: "-",
  //   approver: "-",
  //   status: "Not Started",
  // },
  // {
  //   id: "7",
  //   title: "Drawing For P&ID",
  //   documentNo: "C143-AS-H-XC-00020-01",
  //   reasonForIssue: "IFC",
  //   revisionStatus: "OF",
  //   revision: "-",
  //   originator: "-",
  //   checker: "-",
  //   approver: "-",
  //   status: "Not Started",
  // },
];

export default function DocumentChecklistPageAdvanced() {
  const [filters, setFilters] = useState<DocumentFiltersType>({});
  const [selectedRow, setSelectedRow] = useState<DocumentRecord | null>(null);
  const [historyRow, setHistoryRow] = useState<DocumentRecord | null>(null);

  // Column definitions
  const columns: AdvancedColumnDef<DocumentRecord>[] = [
    {
      id: "title",
      header: "Title",
      accessorKey: "title",
      filter: {
        type: "text",
        operators: ["contains", "startsWith"],
        placeholder: "Search title...",
      },
      width: 200,
    },
    {
      id: "documentNo",
      header: "Document No",
      accessorKey: "documentNo",
      filter: {
        type: "text",
        operators: ["contains", "equals"],
        placeholder: "Search document number...",
      },
      width: 220,
    },
    {
      id: "reasonForIssue",
      header: "Reason For Issue",
      accessorKey: "reasonForIssue",
      filter: {
        type: "select",
        mode: "multi",
        options: [
          { label: "IFC", value: "IFC" },
          { label: "IFD", value: "IFD" },
          { label: "AFC", value: "AFC" },
          { label: "IFR", value: "IFR" },
        ],
        searchable: false,
      },
      width: 180,
    },
    {
      id: "revisionStatus",
      header: "Revision Status",
      accessorKey: "revisionStatus",
      filter: {
        type: "select",
        mode: "multi",
        options: [
          { label: "OF", value: "OF" },
          { label: "R1", value: "R1" },
          { label: "R2", value: "R2" },
          { label: "R3", value: "R3" },
        ],
      },
      width: 160,
    },
    {
      id: "revision",
      header: "Revision",
      accessorKey: "revision",
      filter: {
        type: "number",
        operators: ["equals", "greaterThan", "lessThan"],
      },
      width: 120,
    },
    {
      id: "originator",
      header: "Originator(Self Check)",
      accessorKey: "originator",
      filter: {
        type: "text",
        operators: ["contains"],
      },
      width: 200,
    },
    {
      id: "checker",
      header: "Checker",
      accessorKey: "checker",
      width: 180,
    },
    {
      id: "approver",
      header: "Approver",
      accessorKey: "approver",
      width: 180,
    },
    {
      id: "status",
      header: "Progress",
      accessorKey: "status",
      filter: {
        type: "status",
        statuses: [
          {
            label: "Not Started",
            value: "Not Started",
            color: "gray",
            variant: "default",
          },
          {
            label: "In Progress",
            value: "In Progress",
            color: "orange",
            variant: "warning",
          },
          {
            label: "Completed",
            value: "Completed",
            color: "green",
            variant: "success",
          },
        ],
      },
      cell: ({ value }) => (
        <Badge
          variant={
            value === "Completed"
              ? "default"
              : value === "In Progress"
                ? "default"
                : "outline"
          }
          className={
            value === "Completed"
              ? "bg-success-100 text-success-700 border-success-200"
              : value === "In Progress"
                ? "bg-warning-100 text-warning-700 border-warning-200"
                : "bg-grey-100 text-grey-700 border-grey-300"
          }
        >
          {value}
        </Badge>
      ),
      width: 140,
    },
    {
      id: "revHistory",
      header: "Rev History",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setHistoryRow(row.original);
          }}
          className="h-8 w-8 p-0"
        >
          <ClockIcon className="h-4 w-4" />
        </Button>
      ),
      width: 120,
      sortable: false,
      filterable: false,
    },
  ];

  const handleRowClick = (row: Row<DocumentRecord>) => {
    setSelectedRow(row.original);
  };

  const handleFilterChange = (newFilters: Partial<DocumentFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearAll = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6">
      {/* Header — full width */}
      <div>
        <h1 className="text-primary-500 font-solutioneer text-xl font-semibold">
          Search for document
        </h1>
      </div>

      {/* Top Filters (Discipline, Document Group, etc.) */}
      <DocumentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
      {/* Advanced Table */}
      <AdvancedTable
        data={mockDocuments}
        columns={columns}
        enableFilters={true}
        enableSorting={true}
        enablePagination={true}
        enableColumnVisibility={true}
        enableRowClick={true}
        enableRowHover={true}
        onRowClick={handleRowClick}
        defaultPageSize={10}
        stickyHeader={true}
      />

      {/* Details Modal */}
      <TableModal
        open={!!selectedRow}
        onOpenChange={(open) => !open && setSelectedRow(null)}
        title="Document Details"
        size="lg"
      >
        {selectedRow && <DocumentDetailsContent document={selectedRow} />}
      </TableModal>

      {/* History Modal */}
      <TableModal
        open={!!historyRow}
        onOpenChange={(open) => !open && setHistoryRow(null)}
        title="Revision History"
        size="xl"
      >
        {historyRow && <DocumentHistoryContent document={historyRow} />}
      </TableModal>
    </div>
  );
}

// Details Modal Content
function DocumentDetailsContent({ document }: { document: DocumentRecord }) {
  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-2 gap-6">
        <DetailField label="Title" value={document.title} />
        <DetailField label="Document No" value={document.documentNo} />
        <DetailField label="Reason For Issue" value={document.reasonForIssue} />
        <DetailField label="Revision Status" value={document.revisionStatus} />
        <DetailField label="Revision" value={document.revision} />
        <DetailField label="Originator" value={document.originator} />
        <DetailField label="Checker" value={document.checker} />
        <DetailField label="Approver" value={document.approver} />
        <DetailField label="Status" value={document.status} />
      </div>
    </div>
  );
}

// History Modal Content
function DocumentHistoryContent({ document }: { document: DocumentRecord }) {
  // Mock history data
  const history = [
    {
      revision: "14",
      date: "2024-02-10",
      author: "Xavier Fernandes",
      action: "Created",
    },
    {
      revision: "13",
      date: "2024-02-09",
      author: "Liam O'Connor",
      action: "Updated",
    },
    {
      revision: "12",
      date: "2024-02-08",
      author: "Sophie Chen",
      action: "Approved",
    },
  ];

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-3">
        {history.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-lg border p-4"
          >
            <div className="bg-primary-100 text-primary-700 flex h-10 w-10 items-center justify-center rounded-full font-semibold">
              {item.revision}
            </div>
            <div className="flex-1">
              <div className="font-medium">{item.action}</div>
              <div className="text-muted-foreground text-sm">
                by {item.author} on {item.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-muted-foreground mb-1 text-sm font-medium">
        {label}
      </div>
      <div className="text-base">{value}</div>
    </div>
  );
}
