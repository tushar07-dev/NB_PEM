import { useCallback } from "react";
import { AlertTriangle, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { SearchableFilterSelect } from "@/shared/components/ui/SearchableFilterSelect";
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

  const {
    data: disciplines = [],
    isLoading: loadingDisciplines,
    error: errorDisciplines,
    refetch: refetchDisciplines,
  } = useDisciplines(selectedProject?.id);

  const {
    data: documentGroups = [],
    isLoading: loadingGroups,
    error: errorGroups,
    refetch: refetchGroups,
  } = useDocumentGroups(filters.discipline);

  const {
    data: documentTypes = [],
    isLoading: loadingTypes,
    error: errorTypes,
    refetch: refetchTypes,
  } = useDocumentTypes(filters.discipline);

  const {
    data: facilityCodes = [],
    isLoading: loadingFacilities,
    error: errorFacilities,
    refetch: refetchFacilities,
  } = useFacilityCodes(filters.discipline);

  const {
    data: systems = [],
    isLoading: loadingSystems,
    error: errorSystems,
    refetch: refetchSystems,
  } = useSystems(filters.discipline);

  const {
    data: areas = [],
    isLoading: loadingAreas,
    error: errorAreas,
    refetch: refetchAreas,
  } = useAreas(filters.discipline);

  // Gating Logic
  const baseEnabled = !!selectedProject;
  const disciplineEnabled = baseEnabled;
  const documentGroupEnabled = baseEnabled && !!filters.discipline;
  const documentTypeEnabled =
    baseEnabled && !!filters.discipline && !!filters.documentGroup;
  const downstreamEnabled =
    baseEnabled &&
    !!filters.discipline &&
    !!filters.documentGroup &&
    !!filters.documentType;

  // ============================================
  // Change Handlers (with cascade clearing)
  // ============================================
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

  // ============================================
  // Error Collection
  // ============================================
  const errors = [
    errorDisciplines,
    errorGroups,
    errorTypes,
    errorFacilities,
    errorSystems,
    errorAreas,
  ].filter(Boolean);

  const hasErrors = errors.length > 0;
  console.log("Disciplines:", disciplines);
  // console.log("Groups:", documentGroups);
  // console.log("Types:", documentTypes);

  // ============================================
  // Render
  // ============================================
  return (
    <div className="bg-grey-50 mb-2 rounded-lg border border-gray-200 px-3 py-4 lg:px-5 lg:py-4">
      {/* Header */}
      <div className="mb-5 flex flex-row items-center gap-3">
        <h2 className="text-md shrink-0 font-medium text-gray-700">Filter</h2>

        <div className="ml-auto flex items-center gap-3">
          {!selectedProject && (
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
            className="shrink-0 gap-2 text-gray-600"
          >
            <Trash2 className="h-4 w-4" />
            CLEAR ALL
          </Button>
        </div>
      </div>

      {/* API Error Alert */}
      {hasErrors && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load filter options. Please try again.</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (errorDisciplines) refetchDisciplines();
                if (errorGroups) refetchGroups();
                if (errorTypes) refetchTypes();
                if (errorFacilities) refetchFacilities();
                if (errorSystems) refetchSystems();
                if (errorAreas) refetchAreas();
              }}
              className="ml-2 gap-1 text-xs"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filter Grid */}
      <div className="grid grid-cols-3 gap-x-3 gap-y-4 md:gap-x-5 md:gap-y-6">
        {/* Discipline */}
        <SearchableFilterSelect
          label="Discipline"
          size="md"
          placeholder={loadingDisciplines ? "Loading..." : "Select discipline"}
          options={disciplines}
          value={filters.discipline}
          onValueChange={handleDisciplineChange}
          disabled={!disciplineEnabled || loadingDisciplines}
          required
          helperText={
            disciplines.length === 0 && !loadingDisciplines && disciplineEnabled
              ? "No disciplines available"
              : undefined
          }
        />

        {/* Document Group */}
        <SearchableFilterSelect
          label="Document Group"
          size="md"
          placeholder={loadingGroups ? "Loading..." : "Eg. ENG"}
          options={documentGroups}
          value={filters.documentGroup}
          onValueChange={handleDocumentGroupChange}
          required
          disabled={!documentGroupEnabled || loadingGroups}
          helperText={
            documentGroups.length === 0 &&
            !loadingGroups &&
            documentGroupEnabled
              ? "No groups available"
              : undefined
          }
        />

        {/* Document Type */}
        <SearchableFilterSelect
          label="Document Type"
          size="md"
          placeholder={loadingTypes ? "Loading..." : "EG. XC"}
          options={documentTypes}
          value={filters.documentType}
          onValueChange={handleDocumentTypeChange}
          required
          disabled={!documentTypeEnabled || loadingTypes}
          helperText={
            documentTypes.length === 0 && !loadingTypes && documentTypeEnabled
              ? "No types available"
              : undefined
          }
        />

        {/* Facility Code */}
        <SearchableFilterSelect
          label="Facility Code"
          size="md"
          placeholder={loadingFacilities ? "Loading..." : "Select facility"}
          options={facilityCodes}
          value={filters.facilityCode}
          onValueChange={handleFacilityChange}
          disabled={!downstreamEnabled || loadingFacilities}
          helperText={
            facilityCodes.length === 0 &&
            !loadingFacilities &&
            downstreamEnabled
              ? "No facilities available"
              : undefined
          }
        />

        {/* System */}
        <SearchableFilterSelect
          label="System"
          size="md"
          placeholder={loadingSystems ? "Loading..." : "EG. 70"}
          options={systems}
          value={filters.system}
          onValueChange={handleSystemChange}
          disabled={!downstreamEnabled || loadingSystems}
          helperText={
            systems.length === 0 && !loadingSystems && downstreamEnabled
              ? "No systems available"
              : undefined
          }
        />

        {/* Area */}
        <SearchableFilterSelect
          label="Area"
          size="md"
          placeholder={loadingAreas ? "Loading..." : "EG. N/A"}
          options={areas}
          value={filters.area}
          onValueChange={handleAreaChange}
          disabled={!downstreamEnabled || loadingAreas}
          helperText={
            areas.length === 0 && !loadingAreas && downstreamEnabled
              ? "No areas available"
              : undefined
          }
        />
      </div>
    </div>
  );
}
