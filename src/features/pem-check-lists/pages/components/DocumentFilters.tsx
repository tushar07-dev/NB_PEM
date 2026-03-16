// src/features/pem-check-lists/pages/components/DocumentFilters.tsx
import { useCallback } from "react";
import { AlertTriangle, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { SearchableFilterSelect } from "@/shared/components/ui/SearchableFilterSelect";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useProjectStore } from "@/shared/store/projectStore";
import type { DocumentFiltersType } from "../../types/document";
import {
  useDisciplines,
  useDocumentGroups,
  useDocumentTypes,
  useFacilityCodes,
  useSystems,
  useAreas,
} from "../../api/queries";

interface DocumentFiltersProps {
  filters: DocumentFiltersType;
  onFilterChange: (filters: Partial<DocumentFiltersType>) => void;
  onClearAll: () => void;
}

export function DocumentFilters({
  filters,
  onFilterChange,
  onClearAll,
}: DocumentFiltersProps) {
  const selectedProject = useProjectStore((state) => state.selectedProject);

  // ── UI gating ─────────────────────────────────────────────────────────────
  const hasProject = !!selectedProject;
  const documentGroupEnabled = hasProject && !!filters.discipline;
  const documentTypeEnabled = documentGroupEnabled && !!filters.documentGroup;
  const downstreamEnabled = documentTypeEnabled && !!filters.documentType;

  // ── Fetch on mount (2 calls) ──────────────────────────────────────────────
  const {
    data: disciplines = [],
    isLoading: loadingDisciplines,
    error: errorDisciplines,
    refetch: refetchDisciplines,
  } = useDisciplines();
  const {
    data: documentGroups = [],
    isLoading: loadingGroups,
    error: errorGroups,
    refetch: refetchGroups,
  } = useDocumentGroups();

  // ── Fetch only when documentGroup is selected (1 call) ───────────────────
  const {
    data: documentTypes = [],
    isLoading: loadingTypes,
    error: errorTypes,
    refetch: refetchTypes,
  } = useDocumentTypes(filters.documentGroup);

  // ── Fetch only when all 3 mandatory filters are selected (3 calls) ────────
  const {
    data: facilityCodes = [],
    isLoading: loadingFacilities,
    error: errorFacilities,
    refetch: refetchFacilities,
  } = useFacilityCodes(downstreamEnabled);
  const {
    data: systems = [],
    isLoading: loadingSystems,
    error: errorSystems,
    refetch: refetchSystems,
  } = useSystems(downstreamEnabled);
  const {
    data: areas = [],
    isLoading: loadingAreas,
    error: errorAreas,
    refetch: refetchAreas,
  } = useAreas(downstreamEnabled);

  // ── Handlers with cascade clearing ───────────────────────────────────────
  const handleDisciplineChange = useCallback(
    (value?: string) => {
      onFilterChange({
        discipline: value || undefined,
        documentGroup: undefined,
        documentType: undefined,
        facilityCode: undefined,
        system: undefined,
        area: undefined,
      });
    },
    [onFilterChange]
  );

  const handleDocumentGroupChange = useCallback(
    (value?: string) => {
      onFilterChange({
        documentGroup: value || undefined,
        documentType: undefined,
        facilityCode: undefined,
        system: undefined,
        area: undefined,
      });
    },
    [onFilterChange]
  );

  const handleDocumentTypeChange = useCallback(
    (value?: string) => {
      onFilterChange({
        documentType: value || undefined,
        facilityCode: undefined,
        system: undefined,
        area: undefined,
      });
    },
    [onFilterChange]
  );

  const handleFacilityChange = useCallback(
    (value?: string) => {
      onFilterChange({ facilityCode: value || undefined });
    },
    [onFilterChange]
  );

  const handleSystemChange = useCallback(
    (value?: string) => {
      onFilterChange({ system: value || undefined });
    },
    [onFilterChange]
  );

  const handleAreaChange = useCallback(
    (value?: string) => {
      onFilterChange({ area: value || undefined });
    },
    [onFilterChange]
  );

  // ── Error handling ────────────────────────────────────────────────────────
  const errors = [
    errorDisciplines,
    errorGroups,
    errorTypes,
    errorFacilities,
    errorSystems,
    errorAreas,
  ].filter(Boolean);

  const handleRetry = useCallback(() => {
    if (errorDisciplines) refetchDisciplines();
    if (errorGroups) refetchGroups();
    if (errorTypes) refetchTypes();
    if (errorFacilities) refetchFacilities();
    if (errorSystems) refetchSystems();
    if (errorAreas) refetchAreas();
  }, [
    errorDisciplines,
    errorGroups,
    errorTypes,
    errorFacilities,
    errorSystems,
    errorAreas,
    refetchDisciplines,
    refetchGroups,
    refetchTypes,
    refetchFacilities,
    refetchSystems,
    refetchAreas,
  ]);

  const isInitialLoading = loadingDisciplines || loadingGroups;

  return (
    <div className="bg-grey-50 mb-2 rounded-lg border border-gray-200 px-3 py-3 lg:px-5 lg:py-4 xl:px-6 xl:py-5">
      {/* Header */}
      <div className="mb-5 flex flex-row items-center gap-3">
        <h2 className="text-md shrink-0 font-medium text-gray-700">Filter</h2>
        <div className="ml-auto flex items-center gap-3">
          {!hasProject && (
            <Alert variant="warning" className="w-fit py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="whitespace-nowrap">
                Please select a Project first to enable filters.
              </AlertDescription>
            </Alert>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="border-primary-200 text-primary-200 hover:bg-grey-100 hover:border-primary-300 hover:text-primary-300 shrink-0 gap-2 rounded-4 px-3 py-2 text-xs leading-4 font-medium uppercase"
          >
            <Trash2 className="h-4 w-4" />
            CLEAR ALL
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load filter options. Please try again.</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="ml-2 gap-1 text-xs"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filter Grid */}
      <div className="grid grid-cols-3 gap-x-3 gap-y-3 lg:gap-x-5 lg:gap-y-5 xl:gap-x-6 xl:gap-y-6">
        {isInitialLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))
        ) : (
          <>
            <SearchableFilterSelect
              label="Discipline"
              placeholder="Select discipline"
              options={disciplines}
              value={filters.discipline}
              onValueChange={handleDisciplineChange}
              disabled={!hasProject}
              required
              clearable
            />

            <SearchableFilterSelect
              label="Document Group"
              placeholder="Eg. ENG"
              options={documentGroups}
              value={filters.documentGroup}
              onValueChange={handleDocumentGroupChange}
              disabled={!documentGroupEnabled}
              required
            />

            <SearchableFilterSelect
              label="Document Type"
              placeholder={loadingTypes ? "Loading..." : "Eg. XC"}
              options={documentTypes}
              value={filters.documentType}
              onValueChange={handleDocumentTypeChange}
              disabled={!documentTypeEnabled || loadingTypes}
              required
            />

            <SearchableFilterSelect
              label="Facility Code"
              placeholder={loadingFacilities ? "Loading..." : "Select facility"}
              options={facilityCodes}
              value={filters.facilityCode}
              onValueChange={handleFacilityChange}
              disabled={!downstreamEnabled || loadingFacilities}
            />

            <SearchableFilterSelect
              label="System"
              placeholder={loadingSystems ? "Loading..." : "Eg. 70"}
              options={systems}
              value={filters.system}
              onValueChange={handleSystemChange}
              disabled={!downstreamEnabled || loadingSystems}
            />

            <SearchableFilterSelect
              label="Area"
              placeholder={loadingAreas ? "Loading..." : "Eg. N/A"}
              options={areas}
              value={filters.area}
              onValueChange={handleAreaChange}
              disabled={!downstreamEnabled || loadingAreas}
            />
          </>
        )}
      </div>
    </div>
  );
}
