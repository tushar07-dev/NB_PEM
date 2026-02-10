// src/features/pem-checklists/components/DocumentFilters.tsx
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import type { DocumentFiltersType } from "../../types/document";
import { SearchableFilterSelect } from "@/shared/components/ui/SearchableFilterSelect";

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
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-5 sm:px-3 sm:py-4">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-md font-medium text-gray-700">Filter</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="gap-2 text-gray-600"
        >
          <Trash2 className="h-4 w-4" />
          CLEAR ALL
        </Button>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {/* Discipline */}

        <div className="space-y-2">
          {/* <Label htmlFor="discipline" className="text-sm text-gray-600">
            Discipline <span className="text-red-500">*</span>
          </Label> */}
          {/* <Select
            value={filters.discipline}
            onValueChange={(value) => onFilterChange({ discipline: value })}
          >
            <SelectTrigger id="discipline" className="w-full bg-gray-50">
              {" "}
              <SelectValue placeholder="Eg. HVAC" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hvac">HVAC</SelectItem>
              <SelectItem value="mechanical">Mechanical</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="civil">Civil</SelectItem>
            </SelectContent>
          </Select>
           */}
          <SearchableFilterSelect
            label="Discipline"
            size="sm"
            placeholder="Select discipline"
            options={[
              { value: "hvac", label: "HVAC" },
              { value: "mechanical", label: "Mechanical" },
            ]}
            value={filters.discipline}
            onValueChange={(value) => onFilterChange({ discipline: value })}
            required
            clearable
          />
        </div>

        {/* Document Group */}
        <div className="space-y-2">
          <Label htmlFor="documentGroup" className="text-sm text-gray-600">
            Document Group <span className="text-red-500">*</span>
          </Label>
          <Select
            value={filters.documentGroup}
            onValueChange={(value) => onFilterChange({ documentGroup: value })}
          >
            <SelectTrigger id="documentGroup" className="bg-gray-50">
              <SelectValue placeholder="Eg. ENG" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eng">ENG</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Document Type */}
        <div className="space-y-2">
          <Label htmlFor="documentType" className="text-sm text-gray-600">
            Document Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={filters.documentType}
            onValueChange={(value) => onFilterChange({ documentType: value })}
          >
            <SelectTrigger id="documentType" className="bg-gray-50">
              <SelectValue placeholder="EG. XC" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xc">XC</SelectItem>
              <SelectItem value="drawing">Drawing</SelectItem>
              <SelectItem value="specification">Specification</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Facility Code */}
        <div className="space-y-2">
          <Label htmlFor="facilityCode" className="text-sm text-gray-600">
            Facility Code
          </Label>
          <Select
            value={filters.facilityCode}
            onValueChange={(value) => onFilterChange({ facilityCode: value })}
          >
            <SelectTrigger id="facilityCode" className="bg-gray-50">
              <SelectValue placeholder="EG." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fac1">Facility 1</SelectItem>
              <SelectItem value="fac2">Facility 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* System */}
        <div className="space-y-2">
          <Label htmlFor="system" className="text-sm text-gray-600">
            System
          </Label>
          <Select
            value={filters.system}
            onValueChange={(value) => onFilterChange({ system: value })}
          >
            <SelectTrigger id="system" className="bg-gray-50">
              <SelectValue placeholder="EG. 70" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="70">70</SelectItem>
              <SelectItem value="80">80</SelectItem>
              <SelectItem value="90">90</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Area */}
        <div className="space-y-2">
          <Label htmlFor="area" className="text-sm text-gray-600">
            Area
          </Label>
          <Select
            value={filters.area}
            onValueChange={(value) => onFilterChange({ area: value })}
          >
            <SelectTrigger id="area" className="bg-gray-50">
              <SelectValue placeholder="EG. N/A" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="na">N/A</SelectItem>
              <SelectItem value="zone-a">Zone A</SelectItem>
              <SelectItem value="zone-b">Zone B</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
