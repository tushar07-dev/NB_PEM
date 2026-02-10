// src/features/pem-checklists/types/document.ts
export interface DocumentFiltersType {
  discipline: string;
  documentGroup: string;
  documentType: string;
  facilityCode: string;
  system: string;
  area: string;
}

export interface DocumentRecord {
  id: string;
  title: string;
  documentNo: string;
  reasonForIssue: string;
  revisionStatus: string;
  revision: string;
  originator: string;
  checker: string;
  approver: string;
  status: "In Progress" | "Completed" | "Not Started";
}
