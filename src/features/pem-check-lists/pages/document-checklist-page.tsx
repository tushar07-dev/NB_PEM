// src/features/pem-check-lists/pages/document-checklist-page.tsx
import { useCallback, useMemo } from "react";
import { DocumentFilters } from "./components/DocumentFilters";
import { DocumentTable } from "../components/DocumentTable";
import { useProjectStore } from "@/shared/store/projectStore";
import { useDocumentFilterStore } from "@/shared/store/documentFilterStore";
import type { DocumentFiltersType } from "../types/document";

export default function DocumentChecklistPage() {
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const { filters: storeFilters, setFilter, resetDocumentFilters } = useDocumentFilterStore();

  const handleFilterChange = useCallback(
    (updates: Partial<DocumentFiltersType>) => {
      setFilter(updates);
    },
    [setFilter]
  );

  // Merge projectId from selectedProject into the filters object.
  // projectId lives in projectStore (not documentFilterStore) so it must
  // be injected here before passing to DocumentTable → useDocumentTable → API.
  const filters = useMemo<DocumentFiltersType>(
    () => ({
      ...storeFilters,
      rojectId: selectedProject?.id ?? null,
    }),
    [storeFilters, selectedProject?.id]
  );

  // All 4 mandatory filters must be selected before firing the API call.
  // documentGroupId gates documentTypeId in the UI but is not sent to the API.
  const areMandatoryFiltersSelected =
    !!selectedProject &&
    !!filters.discipline &&      // ← correct
    !!filters.documentGroup &&   // ← correct
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