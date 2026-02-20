import { useState } from "react";
import { DocumentFilters } from "./components/DocumentFilters";
import type { DocumentFiltersType } from "../types/document";
import { DocumentTable } from "../components/DocumentTable";

export default function DocumentChecklistPage() {
  const [filters, setFilters] = useState<DocumentFiltersType>({
    discipline: undefined,
    documentGroup: undefined,
    documentType: undefined,
    facilityCode: undefined,
    system: undefined,
    area: undefined,
  });

  const handleFilterChange = (newFilters: Partial<DocumentFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearAll = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6 px-7.5">
      {/* Header — full width */}
      <div className="mb-4">
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
      <DocumentTable />
    </div>
  );
}
