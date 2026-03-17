// src/features/pem-checklists/hooks/use-document-table.ts
import { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/config/routes";
import { useDataTable } from "@/shared/hooks/data-table/use-data-table";
import { useActiveDocumentStore } from "@/shared/store/activeDocumentStore";
import { getDisplayName } from "@/shared/config/users";
import {
  useProjectDocuments,
  useAssignDocumentRoles,
  useSendDocumentEmail,
  useSetStatusAndComments,
  type ProjectDocumentsResponseDto,
} from "../api/queries";
import {
  useDocumentWorkflowDialog,
  type ResponsibilityValues,
} from "../pages/components/DocumentWorkflowDialog";
import { type DocumentEntry, type DocumentFiltersType } from "../types/document";
import { useDocumentColumns } from "./use-document-columns";

// ── Helpers ───────────────────────────────────────────────────────────────

const VALID_WORKFLOW_STATUSES = new Set([
  "NOT_STARTED","PENDING_WITH_ORIGINATOR","PENDING_WITH_CHECKER",
  "PENDING_WITH_APPROVER","REJECTED_BY_CHECKER","REJECTED_BY_APPROVER","COMPLETED",
]);

function normalizeWorkflowStatus(raw?: string | null): DocumentEntry["workflowStatus"] {
  return (raw && VALID_WORKFLOW_STATUSES.has(raw))
    ? raw as DocumentEntry["workflowStatus"]
    : "NOT_STARTED";
}

function normalizeProgress(raw?: string | null): DocumentEntry["progress"] {
  const key = (raw ?? "").toLowerCase().replace(/[-_\s]+/g, "");
  if (key === "completed" || key === "complete") return "COMPLETED";
  if (key === "inprogress") return "IN_PROGRESS";
  return "NOT_STARTED";
}

function transformToDocumentEntry(item: ProjectDocumentsResponseDto, index: number): DocumentEntry {
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
    projectId: item.projectId ?? null,
    disciplineId: item.disciplineId ?? null,
    documentTypeId: item.documentTypeId ?? null,
  };
}

// ── Filter converter ──────────────────────────────────────────────────────
// Converts UI DocumentFiltersType → PageFilterDto[] for the API.
// documentGroupId is intentionally excluded — it is a UI-only cascade filter
// used to narrow down document types; the API does not filter by it.
function buildApiFilters(filters: DocumentFiltersType) {
  const result: { field: string; operator: string; value: unknown; variant: string }[] = [];

  if (filters.projectId != null)
    result.push({ field: "projectId",      operator: "eq", value: filters.projectId,  variant: "text" });
  if (filters.discipline != null)
    result.push({ field: "disciplineId",   operator: "eq", value: filters.discipline,  variant: "text" });
  if (filters.documentType != null)
    result.push({ field: "documentTypeId", operator: "eq", value: filters.documentType, variant: "text" });
  // documentGroup excluded — UI-only cascade filter, not a field on documents

  return result;
}

const EMPTY_RESPONSIBILITIES: ResponsibilityValues = { originator: "", checker: "", approver: "" };

// ── Hook ──────────────────────────────────────────────────────────────────

export function useDocumentTable(enabled: boolean, filters: DocumentFiltersType) {
  const navigate = useNavigate();
  const { setDocument, clearDocument } = useActiveDocumentStore();

  // Clear on mount (handles back navigation)
  useEffect(() => { clearDocument(); }, [clearDocument]);

  // ── Modal state ───────────────────────────────────────────────────────
  const [selectedRow, setSelectedRow] = useState<DocumentEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Workflow dialog ───────────────────────────────────────────────────
  const { dialogState, open: openWorkflow, close: closeWorkflow } = useDocumentWorkflowDialog();
  const [workflowRow, setWorkflowRow] = useState<DocumentEntry | null>(null);
  const [responsibilities, setResponsibilities] = useState<ResponsibilityValues>(EMPTY_RESPONSIBILITIES);

  const handleCloseWorkflow = useCallback(() => {
    closeWorkflow();
    setWorkflowRow(null);
    setResponsibilities(EMPTY_RESPONSIBILITIES);
  }, [closeWorkflow]);

  // ── Build API filters — memoized so query key only changes when filters change
    const { projectId, discipline, documentType } = filters;

    const apiFilters = useMemo(
        () => buildApiFilters({ projectId, discipline, documentType }),
    [projectId, discipline, documentType]
    );

  // ── API ───────────────────────────────────────────────────────────────
  const { data, isLoading, isError, error } = useProjectDocuments(
    { page: 1, pageSize: 100, filters: apiFilters },
    enabled
  );
  const { mutateAsync: assignRoles, isPending: isAssigning } = useAssignDocumentRoles();
  const { mutateAsync: sendEmail,   isPending: isSendingEmail } = useSendDocumentEmail();
  const { mutateAsync: setStatus,   isPending: isSettingStatus } = useSetStatusAndComments();
  const isSaving = isAssigning || isSendingEmail || isSettingStatus;

  const documents = useMemo<DocumentEntry[]>(() => {
    if (!enabled || !data?.items) return [];
    return data.items.map(transformToDocumentEntry);
  }, [enabled, data]);

  const pageCount = Math.ceil((data?.total ?? 0) / (data?.pageSize ?? 10));

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleRevHistoryClick = useCallback((row: DocumentEntry) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  }, []);

  const handleRowClick = useCallback((row: DocumentEntry) => {
    if (!row.originatorSelfCheck) {
      setResponsibilities({ originator: "", checker: row.checker ?? "", approver: row.approver ?? "" });
      setWorkflowRow(row);
      openWorkflow("define");
    } else {
      setDocument(row);
      navigate(ROUTES.PEM_CHECKLISTS.CHECKLIST_DETAIL);
    }
  }, [navigate, openWorkflow, setDocument]);

  const handleWorkflowSave = useCallback(async (raw: ResponsibilityValues) => {
    if (!workflowRow) return;
    const vals = { originator: raw.originator.trim(), checker: raw.checker.trim(), approver: raw.approver.trim() };
    if (!vals.originator) return;
    try {
      if (workflowRow.projectDocumentId !== null) {
        await assignRoles({ projectDocumentId: workflowRow.projectDocumentId, ...vals });
        await setStatus({ projectDocumentId: workflowRow.projectDocumentId, workflowStatus: "PENDING_WITH_ORIGINATOR", comments: "Roles assigned, workflow started." });
      }
      const toRecipients = [vals.checker, vals.approver].filter(Boolean) as string[];
      const emailBody = [
        `Hello,`, ``,
        `Roles have been assigned for the following document and the workflow has started.`, ``,
        `──────────────────────────────`,
        `Document No : ${workflowRow.documentNo}`,
        `Title       : ${workflowRow.title}`,
        `──────────────────────────────`,
        `Originator  : ${getDisplayName(vals.originator)}`,
        `Checker     : ${vals.checker  ? getDisplayName(vals.checker)  : "Not assigned"}`,
        `Approver    : ${vals.approver ? getDisplayName(vals.approver) : "Not assigned"}`,
        `──────────────────────────────`, ``,
        `Please log in to PEM Digital to view this document.`,
      ].join("\n");
      await sendEmail(
        toRecipients.length > 0
          ? { to: toRecipients, cc: [vals.originator], subject: `[PEM] Roles Assigned: ${workflowRow.documentNo}`, body: emailBody }
          : { to: [vals.originator], cc: [], subject: `[PEM] Roles Saved: ${workflowRow.documentNo}`, body: emailBody }
      );
      setDocument({ ...workflowRow, originatorSelfCheck: vals.originator, checker: vals.checker, approver: vals.approver, workflowStatus: "PENDING_WITH_ORIGINATOR" });
      navigate(ROUTES.PEM_CHECKLISTS.CHECKLIST_DETAIL);
    } catch { /* toasts handled by mutation hooks */ }
  }, [workflowRow, navigate, assignRoles, sendEmail, setStatus, setDocument]);

  const handleWorkflowViewOnly = useCallback(() => {
    if (!workflowRow) return;
    setDocument(workflowRow);
    navigate(ROUTES.PEM_CHECKLISTS.CHECKLIST_DETAIL);
  }, [workflowRow, navigate, setDocument]);

  // ── Table ─────────────────────────────────────────────────────────────
  const columns = useDocumentColumns(handleRevHistoryClick);

  const { table } = useDataTable({
    data: documents,
    columns,
    pageCount,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    searchableColumns: ["title", "documentNo", "originatorSelfCheck", "checker", "approver"],
    defaultColumn: { minSize: 80, maxSize: 400, size: 150 },
  });

  return {
    // table
    table, isLoading, isError, error, enabled,
    // rev history modal
    selectedRow, isModalOpen, setIsModalOpen,
    // workflow dialog
    dialogState, workflowRow, responsibilities, isSaving,
    setResponsibilities,
    // handlers
    handleRowClick, handleRevHistoryClick,
    handleWorkflowSave, handleWorkflowViewOnly, handleCloseWorkflow,
  };
}