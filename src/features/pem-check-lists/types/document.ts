// src/features/pem-check-lists/types/document.ts

// ── Workflow / Progress types ─────────────────────────────────────────────
export type DocumentWorkflowStatus =
  | "NOT_STARTED"
  | "PENDING_WITH_ORIGINATOR"
  | "PENDING_WITH_CHECKER"
  | "PENDING_WITH_APPROVER"
  | "REJECTED_BY_CHECKER"
  | "REJECTED_BY_APPROVER"
  | "COMPLETED";

export type DocumentProgress = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

// ── Main entity ───────────────────────────────────────────────────────────
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
  projectId: number | null;
  disciplineId: number | null;
  documentTypeId: number | null;
}

// ✅ ONE definition only — removed the old duplicate at the top of the file
export interface DocumentFiltersType {
  projectId?: string | null;
  discipline?: string;
  documentGroup?: string;
  documentType?: string;
  facilityCode?: string;
  system?: string;
  area?: string;
}

// ── Filter options ────────────────────────────────────────────────────────
export const reasonForIssueOptions = [
  { label: "IFC", value: "IFC" },
  { label: "IFA", value: "IFA" },
  { label: "IFR", value: "IFR" },
];

export const revisionStatusOptions = [
  { label: "OF", value: "OF" },
  { label: "AF", value: "AF" },
  { label: "DR", value: "DR" },
];

export const progressOptions = [
  { label: "Not Started", value: "NOT_STARTED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
];

// ── Display configs ───────────────────────────────────────────────────────
export const PROGRESS_CONFIG: Record<
  DocumentProgress,
  { label: string; className: string }
> = {
  NOT_STARTED: { label: "Not Started", className: "status-not-started" },
  IN_PROGRESS: { label: "In Progress", className: "status-in-progress" },
  COMPLETED: { label: "Completed", className: "status-completed" },
};

// Workflow status configuration
export const WORKFLOW_STATUS_CONFIG: Record<
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