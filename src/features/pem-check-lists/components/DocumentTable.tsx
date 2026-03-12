import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/shared/components/data-table/data-table";
import { DataTableColumnHeader } from "@/shared/components/data-table/data-table-column-header";
import { DataTableAdvancedToolbar } from "@/shared/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/shared/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/shared/components/data-table/data-table-sort-list";
import { useDataTable } from "@/shared/hooks/data-table/use-data-table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Clock, X, AlertCircle, FileSearch, FileX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  useProjectDocuments,
  useAssignDocumentRoles,
  useSendDocumentEmail,
  type ProjectDocumentsResponseDto,
} from "../api/queries";
import type { DocumentFiltersType } from "../types/document";
import { useAuth } from "@/app/providers/useAuth";
import {
  DocumentWorkflowDialog,
  useDocumentWorkflowDialog,
  type ResponsibilityValues,
} from "../pages/components/DocumentWorkflowDialog";

// ============================================
// Mock users — frontend-only until backend provides /api/Users
// TODO: Replace with useUsers() hook once endpoint is available
// ============================================
const ALL_USERS = [
  {
    value: "sanghati.chatterjee2@akersolutions.com",
    label: "Sanghati Chatterjee",
  },
  { value: "nilesh.thakur@akersolutions.com", label: "Nilesh Thakur" },
  { value: "tushar.shelke@akersolutions.com", label: "Tushar Shelke" },
  { value: "shiv.kumar@akersolutions.com", label: "Shiv Kumar" },
];

const CHECKLIST_ROUTE = "/pem-checklists/document-checklist/checklist";

// ============================================
// Types
// ============================================

/**
 * 7-value workflow status.
 *
 * Backend contract — field: workflowStatus
 * Expected values (exact, case-sensitive):
 *   NOT_STARTED | PENDING_WITH_ORIGINATOR | PENDING_WITH_CHECKER |
 *   PENDING_WITH_APPROVER | REJECTED_BY_CHECKER | REJECTED_BY_APPROVER | COMPLETED
 *
 * Backend sends "" | null when not yet set → frontend shows NOT_STARTED.
 */
export type DocumentWorkflowStatus =
  | "NOT_STARTED"
  | "PENDING_WITH_ORIGINATOR"
  | "PENDING_WITH_CHECKER"
  | "PENDING_WITH_APPROVER"
  | "REJECTED_BY_CHECKER"
  | "REJECTED_BY_APPROVER"
  | "COMPLETED";

/**
 * Progress values.
 *
 * Backend contract — field: progress
 * Expected values (exact, case-sensitive): Completed | In-Progress | Not Started
 *
 * Backend sends "" | null | inconsistent casing → frontend shows "Not Started".
 */
export type DocumentProgress = "Completed" | "In-Progress" | "Not Started";

export interface DocumentEntry {
  id: string;
  projectDocumentId: number | null;
  title: string;
  documentNo: string;
  reasonForIssue: string;
  revisionStatus: string;
  revision: string | null;
  originatorSelfCheck: string | null;
  checker: string | null;
  approver: string | null;
  progress: DocumentProgress;
  workflowStatus: DocumentWorkflowStatus;
}

interface DocumentTableProps {
  enabled: boolean;
  filters: DocumentFiltersType;
}

// ============================================
// Valid value sets — single source of truth
// ============================================

const VALID_WORKFLOW_STATUSES = new Set<string>([
  "NOT_STARTED",
  "PENDING_WITH_ORIGINATOR",
  "PENDING_WITH_CHECKER",
  "PENDING_WITH_APPROVER",
  "REJECTED_BY_CHECKER",
  "REJECTED_BY_APPROVER",
  "COMPLETED",
]);

// ============================================
// Normalizers — called once at the API boundary in transform
// ============================================

/**
 * AC2: If backend sends a valid enum key → use it.
 * Anything else (empty string, null, unknown) → NOT_STARTED.
 * No business logic, no guessing from other fields.
 */
function normalizeWorkflowStatus(
  raw: string | null | undefined
): DocumentWorkflowStatus {
  if (raw && VALID_WORKFLOW_STATUSES.has(raw)) {
    return raw as DocumentWorkflowStatus;
  }
  return "NOT_STARTED";
}

/**
 * AC3: Collapse all backend variants to one of the 3 canonical progress values.
 * Strips case, spaces, hyphens to a flat key for comparison.
 * Anything unrecognised → "Not Started".
 */
function normalizeProgress(raw: string | null | undefined): DocumentProgress {
  if (!raw) return "Not Started";

  // Strip spaces and hyphens, lowercase — handles "Not-Started", "not started", "notstarted"
  const key = raw.toLowerCase().replace(/[-\s]+/g, "");

  if (key === "completed" || key === "complete") return "Completed";
  if (key === "inprogress") return "In-Progress";
  if (key === "notstarted") return "Not Started";

  return "Not Started";
}

// ============================================
// Transform — API response → DocumentEntry
// ============================================

function transformToDocumentEntry(
  item: ProjectDocumentsResponseDto,
  index: number
): DocumentEntry {
  return {
    id: item.documentNo ?? String(index),
    projectDocumentId: item.projectDocumentId ?? null,
    title: item.documentName ?? "",
    documentNo: item.documentNo ?? "",
    reasonForIssue: item.reasonForIssue ?? "",
    revisionStatus: item.revisionStatus ?? "",
    revision: item.revision ?? null,
    originatorSelfCheck: item.originator ?? null,
    checker: item.checker ?? null,
    approver: item.approver ?? null,
    progress: normalizeProgress(item.progress),
    workflowStatus: normalizeWorkflowStatus(item.workflowStatus),
  };
}

// ============================================
// Filter options
// ============================================

const reasonForIssueOptions = [
  { label: "IFC", value: "IFC" },
  { label: "IFA", value: "IFA" },
  { label: "IFR", value: "IFR" },
];

const revisionStatusOptions = [
  { label: "OF", value: "OF" },
  { label: "AF", value: "AF" },
  { label: "DR", value: "DR" },
];

const progressOptions = [
  { label: "Completed", value: "Completed" },
  { label: "In-Progress", value: "In-Progress" },
  { label: "Not Started", value: "Not Started" },
];

const workflowStatusOptions = [
  { label: "Not Started", value: "NOT_STARTED" },
  { label: "Pending with Originator", value: "PENDING_WITH_ORIGINATOR" },
  { label: "Pending with Checker", value: "PENDING_WITH_CHECKER" },
  { label: "Pending with Approver", value: "PENDING_WITH_APPROVER" },
  { label: "Rejected by Checker", value: "REJECTED_BY_CHECKER" },
  { label: "Rejected by Approver", value: "REJECTED_BY_APPROVER" },
  { label: "Completed", value: "COMPLETED" },
];

// ============================================
// Status badge config
// ============================================

const WORKFLOW_STATUS_CONFIG: Record<
  DocumentWorkflowStatus,
  { label: string; className: string }
> = {
  NOT_STARTED: {
    label: "Not Started",
    className: "bg-gray-100 text-gray-500 border-gray-200",
  },
  PENDING_WITH_ORIGINATOR: {
    label: "With Originator",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  PENDING_WITH_CHECKER: {
    label: "With Checker",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  PENDING_WITH_APPROVER: {
    label: "With Approver",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  REJECTED_BY_CHECKER: {
    label: "Rejected by Checker",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  REJECTED_BY_APPROVER: {
    label: "Rejected by Approver",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-green-50 text-green-700 border-green-200",
  },
};

// ============================================
// Component
// ============================================

export function DocumentTable({ enabled, filters }: DocumentTableProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  // TODO: Pass filters + currentUser to API once server-side filtering is supported
  void filters;
  void currentUser;

  const [selectedRow, setSelectedRow] = useState<DocumentEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    dialogState,
    open: openWorkflow,
    close: closeWorkflow,
  } = useDocumentWorkflowDialog();

  const EMPTY_RESPONSIBILITIES: ResponsibilityValues = {
    originator: "",
    checker: "",
    approver: "",
  };

  const [workflowRow, setWorkflowRow] = useState<DocumentEntry | null>(null);
  const [responsibilities, setResponsibilities] =
    useState<ResponsibilityValues>(EMPTY_RESPONSIBILITIES);

  const handleCloseWorkflow = useCallback(() => {
    closeWorkflow();
    setWorkflowRow(null);
    setResponsibilities(EMPTY_RESPONSIBILITIES);
  }, [closeWorkflow]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── API ───────────────────────────────────────────────────────────────────

  const { data, isLoading, isError, error } = useProjectDocuments(
    { page: 1, pageSize: 100 },
    enabled
  );

  const { mutateAsync: assignRoles, isPending: isAssigning } =
    useAssignDocumentRoles();

  const { mutateAsync: sendEmail, isPending: isSendingEmail } =
    useSendDocumentEmail();

  const isSaving = isAssigning || isSendingEmail;

  const documents = useMemo<DocumentEntry[]>(() => {
    if (!enabled || !data?.items) return [];
    return data.items.map((item, index) =>
      transformToDocumentEntry(item, index)
    );
  }, [enabled, data]);

  const pageCount = Math.ceil((data?.total ?? 0) / (data?.pageSize ?? 10));

  // ── Handlers ──────────────────────────────────────────────────────────────

  // AC5: no originator → Define Responsibilities; originator set → checklist
  const handleRowClick = useCallback(
    (row: DocumentEntry) => {
      if (!row.originatorSelfCheck) {
        setResponsibilities({
          originator: "",
          checker: row.checker ?? "",
          approver: row.approver ?? "",
        });
        setWorkflowRow(row);
        openWorkflow("define");
      } else {
        navigate(CHECKLIST_ROUTE, { state: { document: row } });
      }
    },
    [navigate, openWorkflow]
  );

  const handleRevHistoryClick = useCallback((row: DocumentEntry) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  }, []);

  const handleWorkflowSave = useCallback(
    async (raw: ResponsibilityValues) => {
      if (!workflowRow) return;

      const vals: ResponsibilityValues = {
        originator: raw.originator.trim(),
        checker: raw.checker.trim(),
        approver: raw.approver.trim(),
      };

      if (!vals.originator) return;

      try {
        if (workflowRow.projectDocumentId !== null) {
          await assignRoles({
            projectDocumentId: workflowRow.projectDocumentId,
            originator: vals.originator,
            checker: vals.checker,
            approver: vals.approver,
          });
        } else {
          if (import.meta.env.DEV) {
            console.warn(
              "[DocumentTable] projectDocumentId is null — skipping AssignProjectDocumentRoles."
            );
          }
        }

        const toRecipients = [vals.checker, vals.approver].filter(
          Boolean
        ) as string[];

        const emailBody = [
          "Roles have been assigned for the following document.",
          "",
          `Document No  : ${workflowRow.documentNo}`,
          `Title        : ${workflowRow.title}`,
          `Originator   : ${vals.originator}`,
          vals.checker
            ? `Checker  : ${vals.checker}`
            : "Checker  : Not assigned",
          vals.approver
            ? `Approver : ${vals.approver}`
            : "Approver : Not assigned",
        ].join("\n");

        if (toRecipients.length > 0) {
          await sendEmail({
            to: toRecipients,
            cc: [vals.originator],
            subject: `Document Assigned: ${workflowRow.documentNo}`,
            body: emailBody,
          });
        } else {
          await sendEmail({
            to: [vals.originator],
            cc: [],
            subject: `Document Saved: ${workflowRow.documentNo}`,
            body: emailBody,
          });
        }

        navigate(CHECKLIST_ROUTE, {
          state: {
            document: {
              ...workflowRow,
              originatorSelfCheck: vals.originator,
              checker: vals.checker,
              approver: vals.approver,
            },
          },
        });
      } catch {
        // Toasts handled by mutation hooks — stay on page so user can retry
      }
    },
    [workflowRow, navigate, assignRoles, sendEmail]
  );

  const handleWorkflowViewOnly = useCallback(() => {
    if (!workflowRow) return;
    navigate(CHECKLIST_ROUTE, { state: { document: workflowRow } });
  }, [workflowRow, navigate]);

  // ── Columns ───────────────────────────────────────────────────────────────

  const columns = useMemo<ColumnDef<DocumentEntry>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        meta: {
          label: "Title",
          placeholder: "Search title...",
          variant: "text",
        },
      },
      {
        accessorKey: "documentNo",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Document No" />
        ),
        meta: {
          label: "Document No",
          placeholder: "Search document no...",
          variant: "text",
        },
      },
      {
        accessorKey: "reasonForIssue",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Reason For Issue" />
        ),
        meta: {
          label: "Reason For Issue",
          variant: "multiSelect",
          options: reasonForIssueOptions,
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
      {
        accessorKey: "revisionStatus",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Revision Status" />
        ),
        meta: {
          label: "Revision Status",
          variant: "multiSelect",
          options: revisionStatusOptions,
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
      {
        accessorKey: "revision",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Revision" />
        ),
        cell: ({ row }) => (
          <span>{(row.getValue("revision") as string | null) ?? "-"}</span>
        ),
        meta: { label: "Revision", variant: "number" },
      },
      {
        accessorKey: "originatorSelfCheck",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            label="Originator (Self Check)"
          />
        ),
        cell: ({ row }) => (
          <span>
            {(row.getValue("originatorSelfCheck") as string | null) ?? "-"}
          </span>
        ),
        meta: {
          label: "Originator (Self Check)",
          placeholder: "Search originator...",
          variant: "text",
        },
      },
      {
        accessorKey: "checker",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Checker" />
        ),
        cell: ({ row }) => {
          const checker = row.getValue("checker") as string | null;
          // AC6: amber highlight only when checker is the active stage
          const isActive =
            row.original.workflowStatus === "PENDING_WITH_CHECKER";
          return checker ? (
            <span className={isActive ? "font-medium text-amber-700" : ""}>
              {checker}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
        meta: {
          label: "Checker",
          placeholder: "Search checker...",
          variant: "text",
        },
      },
      {
        accessorKey: "approver",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Approver" />
        ),
        cell: ({ row }) => {
          const approver = row.getValue("approver") as string | null;
          // AC6: amber highlight only when approver is the active stage
          const isActive =
            row.original.workflowStatus === "PENDING_WITH_APPROVER";
          return approver ? (
            <span className={isActive ? "font-medium text-amber-700" : ""}>
              {approver}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
        meta: {
          label: "Approver",
          placeholder: "Search approver...",
          variant: "text",
        },
      },
      {
        accessorKey: "workflowStatus",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ row }) => {
          const status = row.original.workflowStatus;
          // AC4: normalizeWorkflowStatus guarantees a valid key.
          // Fallback to NOT_STARTED as absolute last resort.
          const cfg =
            WORKFLOW_STATUS_CONFIG[status] ??
            WORKFLOW_STATUS_CONFIG.NOT_STARTED;
          return (
            <Badge variant="outline" className={`text-xs ${cfg.className}`}>
              {cfg.label}
            </Badge>
          );
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: workflowStatusOptions,
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
      {
        accessorKey: "progress",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Progress" />
        ),
        cell: ({ row }) => {
          const progress = row.getValue("progress") as DocumentProgress;
          const className =
            progress === "Completed"
              ? "status-completed"
              : progress === "In-Progress"
                ? "status-in-progress"
                : "status-not-started";
          return <span className={`text-sm ${className}`}>{progress}</span>;
        },
        meta: {
          label: "Progress",
          variant: "multiSelect",
          options: progressOptions,
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
      {
        id: "revHistory",
        header: () => <span>Rev History</span>,
        cell: ({ row }) => (
          <button
            className="icon-btn-dark-blue"
            aria-label={`View revision history for ${row.original.documentNo}`}
            onClick={(e) => {
              e.stopPropagation();
              handleRevHistoryClick(row.original);
            }}
          >
            <Clock className="h-4 w-4" />
          </button>
        ),
        enableSorting: false,
        enableHiding: false,
        enableColumnFilter: false,
      },
    ],
    [handleRevHistoryClick]
  );

  const { table } = useDataTable({
    data: documents,
    columns,
    pageCount,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  // ── Empty states ──────────────────────────────────────────────────────────

  const emptyState = !enabled ? (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="bg-grey-200 rounded-full p-4">
        <FileSearch className="text-primary-100 size-8" />
      </div>
      <p className="text-primary-500 font-medium">Select required filters</p>
      <p className="text-primary-100 text-sm leading-relaxed">
        Please select{" "}
        <span className="text-primary-500 font-medium">Project</span>,{" "}
        <span className="text-primary-500 font-medium">Discipline</span>,{" "}
        <span className="text-primary-500 font-medium">Document Group</span>,
        and <span className="text-primary-500 font-medium">Document Type</span>{" "}
        to view documents.
      </p>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="bg-grey-200 rounded-full p-4">
        <FileX className="text-primary-100 size-8" />
      </div>
      <p className="text-primary-500 font-medium">No documents found</p>
      <p className="text-primary-100 text-sm">
        Try adjusting your filter selections.
      </p>
    </div>
  );

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <AlertCircle className="text-destructive h-12 w-12" />
        <div>
          <h3 className="text-lg font-semibold">Failed to load documents</h3>
          <p className="text-muted-foreground text-sm">
            {error?.message ?? "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Table ── */}
      <DataTable
        table={table}
        onRowClick={handleRowClick}
        emptyState={emptyState}
        loading={isLoading}
        loadingRowCount={8}
      >
        <DataTableAdvancedToolbar table={table}>
          <DataTableFilterList table={table} />
          <DataTableSortList table={table} />
        </DataTableAdvancedToolbar>
      </DataTable>

      {/* ── Define Responsibilities dialog ── */}
      <DocumentWorkflowDialog
        key={workflowRow?.id ?? "no-row"}
        {...dialogState}
        onClose={handleCloseWorkflow}
        userOptions={ALL_USERS}
        values={responsibilities}
        onChange={setResponsibilities}
        onSave={handleWorkflowSave}
        onViewOnly={handleWorkflowViewOnly}
        isSaving={isSaving}
      />

      {/* ── Revision History Dialog ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {isModalOpen && (
          <DialogContent className="m-0 h-screen w-screen max-w-none rounded-none p-0 [&>button:last-child]:hidden">
            <div className="flex h-full flex-col">
              <DialogHeader className="flex flex-row items-center justify-between border-b p-6">
                <DialogTitle className="text-2xl font-bold">
                  Revision History — {selectedRow?.documentNo}
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </DialogHeader>

              <div className="flex-1 overflow-auto p-6">
                {selectedRow && (
                  <div className="space-y-6">
                    <div className="bg-muted/50 rounded-lg p-6">
                      <h3 className="mb-4 text-lg font-semibold">
                        Document Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div>
                          <p className="text-muted-foreground text-sm">Title</p>
                          <p className="font-medium">{selectedRow.title}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Document No
                          </p>
                          <p className="font-medium">
                            {selectedRow.documentNo}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Reason For Issue
                          </p>
                          <p className="font-medium">
                            {selectedRow.reasonForIssue}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Revision Status
                          </p>
                          <p className="font-medium">
                            {selectedRow.revisionStatus}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-6">
                      <h3 className="mb-4 text-lg font-semibold">
                        Current Revision Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Revision
                          </p>
                          <p className="font-medium">
                            {selectedRow.revision ?? "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Originator (Self Check)
                          </p>
                          <p className="font-medium">
                            {selectedRow.originatorSelfCheck ?? "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Checker
                          </p>
                          <p className="font-medium">
                            {selectedRow.checker ?? "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Approver
                          </p>
                          <p className="font-medium">
                            {selectedRow.approver ?? "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Progress
                          </p>
                          <p className="font-medium">{selectedRow.progress}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-6">
                      <h3 className="mb-4 text-lg font-semibold">
                        Revision Timeline
                      </h3>
                      <div className="flex items-start gap-4">
                        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                        <div>
                          <p className="font-medium">
                            Current — Revision {selectedRow.revision ?? "N/A"}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Latest version
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
