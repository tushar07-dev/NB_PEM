// src/features/pem-check-lists/pages/document-checklist-page.tsx
import { useCallback } from "react";
import { DocumentFilters } from "./components/DocumentFilters";
import { DocumentTable } from "../components/DocumentTable";
import { useProjectStore } from "@/shared/store/projectStore";
import { useDocumentFilterStore } from "@/shared/store/documentFilterStore";
import type { DocumentFiltersType } from "../types/document";

export default function DocumentChecklistPage() {
  const selectedProject = useProjectStore((state) => state.selectedProject);

  const { filters, setFilter, resetDocumentFilters } = useDocumentFilterStore();

  const handleFilterChange = useCallback(
    (updates: Partial<DocumentFiltersType>) => {
      setFilter(updates);
    },
    [setFilter]
  );

  const areMandatoryFiltersSelected =
    !!selectedProject &&
    !!filters.discipline &&
    !!filters.documentGroup &&
    !!filters.documentType;

  return (
    <div className="space-y-6 px-7.5">
      <div className="mb-4">
        <h1 className="text-primary-500 font-solutioneer text-xl font-semibold">
          Search for document
        </h1>
      </div>

      <DocumentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAll={resetDocumentFilters}
      />

      <DocumentTable enabled={areMandatoryFiltersSelected} filters={filters} />
    </div>
  );
}
