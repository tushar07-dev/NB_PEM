import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { SearchableFilterSelect } from "@/shared/components/ui/SearchableFilterSelect";
import { cn } from "@/shared/lib/utils";

interface FilterOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FilterConfig {
  label: string;
  placeholder: string;
  required: boolean;
  key: string;
}

interface ChecklistFiltersProps {
  onFilterChange?: (filters: Record<string, string>) => void;
  initialFilters?: Record<string, string>;
  className?: string;
  collapsible?: boolean;
}

export const ChecklistFilters = ({
  onFilterChange,
  initialFilters = {},
  className,
  collapsible = false,
}: ChecklistFiltersProps) => {
  // State management
  const [filters, setFilters] =
    React.useState<Record<string, string>>(initialFilters);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // Filter configuration
  const filterConfigs: FilterConfig[] = [
    {
      key: "discipline",
      label: "Discipline",
      placeholder: "Eg. HVAC",
      required: true,
    },
    {
      key: "documentGroup",
      label: "Document Group",
      placeholder: "Eg. ENG",
      required: true,
    },
    {
      key: "documentType",
      label: "Document Type",
      placeholder: "Eg. XC",
      required: true,
    },
    {
      key: "facilityCode",
      label: "Facility Code",
      placeholder: "Eg. XC",
      required: false,
    },
    { key: "system", label: "System", placeholder: "Eg. XC", required: false },
    { key: "area", label: "Area", placeholder: "Eg. XC", required: false },
  ];

  // Mock options - replace with your actual data source
  const getOptionsForFilter = (filterKey: string): FilterOption[] => {
    // This would typically come from your API, context, or props
    const optionsMap: Record<string, FilterOption[]> = {
      discipline: [
        { value: "hvac", label: "HVAC" },
        { value: "electrical", label: "Electrical" },
        { value: "mechanical", label: "Mechanical" },
        { value: "plumbing", label: "Plumbing" },
      ],
      documentGroup: [
        { value: "eng", label: "ENG - Engineering" },
        { value: "proc", label: "PROC - Procurement" },
        { value: "qc", label: "QC - Quality Control" },
      ],
      documentType: [
        { value: "xc", label: "XC - Cross Check" },
        { value: "sp", label: "SP - Specification" },
        { value: "dr", label: "DR - Drawing" },
      ],
      facilityCode: [
        { value: "f01", label: "F01 - Main Facility" },
        { value: "f02", label: "F02 - Secondary Facility" },
      ],
      system: [
        { value: "sys01", label: "System 01" },
        { value: "sys02", label: "System 02" },
      ],
      area: [
        { value: "a1", label: "Area 1" },
        { value: "a2", label: "Area 2" },
      ],
    };
    return optionsMap[filterKey] || [];
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  // Handle clear all
  const handleClearAll = () => {
    setFilters({});
    onFilterChange?.({});
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card
      className={cn("h-full w-full transition-all duration-200", className)}
    >
      {/* Responsive Header */}
      <CardHeader
        className={cn(
          "flex flex-row items-center justify-between space-y-0",
          "px-4 pb-3 md:px-6 md:pb-4 lg:px-8",
          collapsible && "hover:bg-grey-100/50 cursor-pointer transition-colors"
        )}
        onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
      >
        <div className="flex items-center gap-2 md:gap-3">
          <CardTitle className="text-sm font-semibold text-slate-700 md:text-base lg:text-lg">
            Filter
          </CardTitle>
          {activeFilterCount > 0 && (
            <span className="bg-primary-100 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium text-white">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs font-bold text-slate-500 uppercase md:gap-2"
            onClick={(e) => {
              e.stopPropagation();
              handleClearAll();
            }}
            disabled={activeFilterCount === 0}
          >
            <Trash2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
            <span className="hidden sm:inline">Clear All</span>
            <span className="sm:hidden">Clear</span>
          </Button>

          {collapsible && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setIsCollapsed(!isCollapsed);
              }}
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Collapsible Content */}
      {(!collapsible || !isCollapsed) && (
        <CardContent className="space-y-4 p-4 pt-0 md:space-y-6 md:p-6 lg:p-8">
          {/* Responsive Grid */}
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 md:gap-x-6 md:gap-y-4 lg:grid-cols-3">
            {filterConfigs.map((config) => (
              <div key={config.key} className="w-full min-w-0">
                <SearchableFilterSelect
                  size="sm"
                  label={config.label}
                  placeholder={config.placeholder}
                  options={getOptionsForFilter(config.key)}
                  value={filters[config.key] || ""}
                  onValueChange={(value) =>
                    handleFilterChange(config.key, value)
                  }
                  required={config.required}
                  clearable
                  searchPlaceholder={`Search ${config.label.toLowerCase()}...`}
                  emptyMessage={`No ${config.label.toLowerCase()} found`}
                />
              </div>
            ))}
          </div>

          {/* Optional: Summary Section */}
          {activeFilterCount > 0 && (
            <div className="border-grey-300 border-t pt-2 md:pt-4">
              <p className="text-muted-foreground text-xs md:text-sm">
                <span className="font-medium">{activeFilterCount}</span> filter
                {activeFilterCount !== 1 ? "s" : ""} applied
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
