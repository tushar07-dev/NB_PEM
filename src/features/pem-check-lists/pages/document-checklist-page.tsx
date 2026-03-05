// src/features/pem-check-lists/pages/DocumentChecklistPage.tsx
import { useState } from "react";
import { DocumentFilters } from "./components/DocumentFilters";
import { DocumentTable } from "../components/DocumentTable";
import { useProjectStore } from "@/shared/store/projectStore";
import type { DocumentFiltersType } from "../types/document";

const EMPTY_FILTERS: DocumentFiltersType = {
  discipline: undefined,
  documentGroup: undefined,
  documentType: undefined,
  facilityCode: undefined,
  system: undefined,
  area: undefined,
};

export default function DocumentChecklistPage() {
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const [filters, setFilters] = useState<DocumentFiltersType>(EMPTY_FILTERS);

  const handleFilterChange = (newFilters: Partial<DocumentFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

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
        onClearAll={() => setFilters(EMPTY_FILTERS)}
      />

      <DocumentTable enabled={areMandatoryFiltersSelected} filters={filters} />
    </div>
  );
}
