import { useState } from "react";
import { DocumentFilters } from "./components/DocumentFilters";
import type { DocumentFiltersType, DocumentRecord } from "../types/document";

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
  {
    id: "3",
    title: "Drawing For P&ID",
    documentNo: "C143-AS-H-XC-00020-01",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: "13",
    originator: "Liam O'Connor",
    checker: "Liam Rodriguez",
    approver: "James Park",
    status: "Completed",
  },
  {
    id: "4",
    title: "Drawing For P&ID",
    documentNo: "C143-AS-H-XC-00020-01",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: "15",
    originator: "Isabella Martinez",
    checker: "Maya Patel",
    approver: "Sofia Kim",
    status: "Completed",
  },
  {
    id: "5",
    title: "Drawing For P&ID",
    documentNo: "C143-AS-H-XC-00020-01",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: "-",
    originator: "-",
    checker: "-",
    approver: "-",
    status: "Not Started",
  },
  {
    id: "6",
    title: "Drawing For P&ID",
    documentNo: "C143-AS-H-XC-00020-01",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: "-",
    originator: "-",
    checker: "-",
    approver: "-",
    status: "Not Started",
  },
  {
    id: "7",
    title: "Drawing For P&ID",
    documentNo: "C143-AS-H-XC-00020-01",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: "-",
    originator: "-",
    checker: "-",
    approver: "-",
    status: "Not Started",
  },
];

export default function DocumentChecklistPage() {
  const [filters, setFilters] = useState<DocumentFiltersType>({
    discipline: undefined,
    documentGroup: undefined,
    documentType: undefined,
    facilityCode: undefined,
    system: undefined,
    area: undefined,
  });

  const [documents] = useState<DocumentRecord[]>(mockDocuments);

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

      {/* Filters — left column */}
      <DocumentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />

      {/* Table — right column */}
    </div>
  );
}
