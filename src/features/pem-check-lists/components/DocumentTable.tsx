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
// Mock users (frontend-only until backend ready)
// TODO: Replace with useUsers() hook once backend provides /api/Users endpoint
// ============================================
const ALL_USERS = [
  {
    value: "sanghati.chatterjee2@akersolutions.com",
    name: "sanghati.chatterjee2@akersolutions.com",
    label: "Sanghati Chatterjee",
  },
  { value: "nilesh.thakur@akersolutions.com", label: "Nilesh Thakur" },
  { value: "tushar.shelke@akersolutions.com", label: "Tushar Shelke" },
  { value: "shiv.kumar@akersolutions.com", label: "Shiv Kumar" },
  { value: "Rohit.Shelar@akersolutions.com", label: "Rohit Shelar" },
];

const CHECKLIST_ROUTE = "/pem-checklists/document-checklist/checklist";

// ============================================
// Types
// ============================================
export interface DocumentEntry {
  id: string;
  // NOTE: projectDocumentId is required by AssignProjectDocumentRoles.
  // Ask backend to include it in GetProjectDocuments response.
  projectDocumentId: number | null;
  title: string;
  documentNo: string;
  reasonForIssue: string;
  revisionStatus: string;
  revision: string | null;
  originatorSelfCheck: string | null;
  checker: string | null;
  approver: string | null;
  progress: "Completed" | "Not Started" | "In-Progress";
}

interface DocumentTableProps {
  /** Gates the API fetch — true only when project + discipline + group + type are selected */
  enabled: boolean;
  filters: DocumentFiltersType;
}

// ============================================
// Transform
// ============================================
function transformToDocumentEntry(
  item: ProjectDocumentsResponseDto,
  index: number
): DocumentEntry {
  const progressMap: Record<
    string,
    "Completed" | "Not Started" | "In-Progress"
  > = {
    completed: "Completed",
    complete: "Completed",
    "in-progress": "In-Progress",
    inprogress: "In-Progress",
    "not started": "Not Started",
    notstarted: "Not Started",
  };

  const normalizeProgress = (
    progress: string | null | undefined
  ): "Completed" | "Not Started" | "In-Progress" => {
    const key = progress?.toLowerCase().trim() ?? "";
    return progressMap[key] ?? "Not Started";
  };

  return {
    id: item.documentNo ?? String(index),
    // TODO: replace with item.projectDocumentId once backend adds it to response
    projectDocumentId: null,
    // projectDocumentId: item.projectDocumentId ?? null,
    title: item.documentName ?? "",
    documentNo: item.documentNo ?? "",
    reasonForIssue: item.reasonForIssue ?? "",
    revisionStatus: item.revisionStatus ?? "",
    revision: item.revision ?? null,
    originatorSelfCheck: item.originator ?? null,
    checker: item.checker ?? null,
    approver: item.approver ?? null,
    progress: normalizeProgress(item.progress),
  };
}

// ============================================
// Static filter options
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

// ============================================
// Component
// ============================================
export function DocumentTable({ enabled, filters }: DocumentTableProps) {
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  // TODO: Use filters and currentUser for server-side filtering when API supports it
  void filters;
  void currentUser;

  // ── Rev History dialog ────────────────────────────────────────────────────
  const [selectedRow, setSelectedRow] = useState<DocumentEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Workflow dialog ───────────────────────────────────────────────────────
  const {
    dialogState,
    open: openWorkflow,
    close: closeWorkflow,
  } = useDocumentWorkflowDialog();

  const [workflowRow, setWorkflowRow] = useState<DocumentEntry | null>(null);

  const [responsibilities, setResponsibilities] =
    useState<ResponsibilityValues>({
      originator: "",
      checker: "",
      approver: "",
    });

  // ── API: Queries ──────────────────────────────────────────────────────────
  const { data, isLoading, isError, error } = useProjectDocuments(
    { page: 1, pageSize: 100 },
    enabled
  );

  // ── API: Mutations ────────────────────────────────────────────────────────
  const { mutateAsync: assignRoles, isPending: isAssigning } =
    useAssignDocumentRoles();

  const { mutateAsync: sendEmail, isPending: isSendingEmail } =
    useSendDocumentEmail();

  const isSaving = isAssigning || isSendingEmail;

  // ── Documents ─────────────────────────────────────────────────────────────
  const documents = useMemo<DocumentEntry[]>(() => {
    if (!enabled || !data?.items) return [];
    return data.items.map((item, index) =>
      transformToDocumentEntry(item, index)
    );
  }, [enabled, data]);

  const pageCount = Math.ceil((data?.total ?? 0) / (data?.pageSize ?? 10));

  // ── Row click handler ─────────────────────────────────────────────────────
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

  // ── Rev History ───────────────────────────────────────────────────────────
  const handleRevHistoryClick = useCallback((row: DocumentEntry) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  }, []);

  // ── Workflow: Save (AC3 + AC4) ────────────────────────────────────────────
  // FIX: Removed duplicate toast.success / toast.error calls that were here.
  // Toasts are now owned by the mutation hooks (onSuccess / onError in queries.ts).
  // This component only handles navigation on success and stays put on error.
  const handleWorkflowSave = useCallback(
    async (vals: ResponsibilityValues) => {
      if (!workflowRow) return;

      try {
        // Step 1: Assign roles via API
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
              "[DocumentTable] projectDocumentId is null — skipping AssignProjectDocumentRoles call. " +
                "Ask backend to include projectDocumentId in GetProjectDocuments response."
            );
          }
        }

        // Step 2: Send email notification via API (if checker assigned)
        if (vals.checker) {
          await sendEmail({
            to: [vals.checker],
            cc: vals.approver ? [vals.approver] : [],
            subject: `Document Assigned: ${workflowRow.documentNo}`,
            body: [
              `You have been assigned as Checker for document ${workflowRow.documentNo}.`,
              `Title: ${workflowRow.title}`,
              vals.approver ? `Approver: ${vals.approver}` : "",
            ]
              .filter(Boolean)
              .join("\n"),
          });
        }

        // Step 3: Navigate to checklist on full success.
        // Toasts (success or error) are fired by the mutation hooks — not here.
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
        // Mutation hooks already show a specific toast.error via their onError.
        // No duplicate toast here — just stay on the page so the user can retry.
      }
    },
    [workflowRow, navigate, assignRoles, sendEmail]
  );

  // ── Workflow: View Only ───────────────────────────────────────────────────
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
            label="Originator(Self Check)"
          />
        ),
        cell: ({ row }) => (
          <span>
            {(row.getValue("originatorSelfCheck") as string | null) ?? "-"}
          </span>
        ),
        meta: {
          label: "Originator(Self Check)",
          placeholder: "Search originator...",
          variant: "text",
        },
      },
      {
        accessorKey: "checker",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Checker" />
        ),
        cell: ({ row }) => (
          <span>{(row.getValue("checker") as string | null) ?? "-"}</span>
        ),
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
        cell: ({ row }) => (
          <span>{(row.getValue("approver") as string | null) ?? "-"}</span>
        ),
        meta: {
          label: "Approver",
          placeholder: "Search approver...",
          variant: "text",
        },
      },
      {
        accessorKey: "progress",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Progress" />
        ),
        cell: ({ row }) => {
          const progress = row.getValue("progress") as string;
          return (
            <span
              className={`text-sm ${
                progress === "Completed"
                  ? "status-completed"
                  : progress === "Not Started"
                    ? "status-not-started"
                    : "status-in-progress"
              }`}
            >
              {progress}
            </span>
          );
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
        onClose={closeWorkflow}
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
                          <p
                            className={`font-medium ${
                              selectedRow.progress === "Completed"
                                ? "status-completed"
                                : selectedRow.progress === "Not Started"
                                  ? "status-not-started"
                                  : "status-in-progress"
                            }`}
                          >
                            {selectedRow.progress}
                          </p>
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
