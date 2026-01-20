"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/lib/utils";
import { SearchableFilterSelect } from "@/shared/components/ui/SearchableFilterSelect";
import { MultiSelectWithChips } from "@/shared/components/ui/MultiSelectWithChips";

// Define discipline options
const disciplineOptions = [
  { value: "hvac", label: "HVAC" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "mechanical", label: "Mechanical" },
  { value: "civil", label: "Civil" },
  { value: "structural", label: "Structural" },
];

export function DashboardFilter() {
  // Add state for multi-select
  const [selectedDisciplines, setSelectedDisciplines] = React.useState<
    string[]
  >([]);

  const handleReset = () => {
    console.log("Filters Reset");
    setSelectedDisciplines([]); // Clear disciplines on reset
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full rounded-lg border border-slate-200 bg-white shadow-sm"
    >
      <AccordionItem value="filters" className="border-none">
        <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]_.filter-chips]:hidden">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-600">
              Global Filter
            </span>

            {/* Visual Chips: These hide when the accordion is open */}
            <div className="filter-chips flex gap-2">
              <BadgeChip label="Project 1" />
              <BadgeChip label="HVAC" />
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-6 pt-2 pb-6">
          <div className="flex items-end gap-4">
            {/* 5-Column Grid for Selects */}
            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
              <SearchableFilterSelect
                label="Project"
                placeholder="Eg. Project 1"
                required
                options={[
                  { value: "p1", label: "Project 1" },
                  { value: "p2", label: "Project 2" },
                ]}
              />

              <MultiSelectWithChips
                label="Discipline"
                placeholder="Eg. HVAC"
                options={disciplineOptions}
                value={selectedDisciplines}
                onValueChange={setSelectedDisciplines}
                required
                maxDisplay={3}
                searchPlaceholder="Search disciplines..."
                emptyMessage="No disciplines found"
              />

              <FilterSelect label="Key Deliverables" placeholder="Eg. 3D">
                <SelectItem value="3d">3D</SelectItem>
              </FilterSelect>
            </div>

            {/* Clear All Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              className="h-10 gap-2 text-xs font-bold tracking-wider uppercase hover:bg-slate-50"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

// Sub-component for the orange filter chips
function BadgeChip({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-[#FFD699] px-3 py-1 text-[11px] font-bold text-[#855B14]">
      {label}
    </span>
  );
}

// Helper component for regular select
function FilterSelect({
  label,
  placeholder,
  children,
}: {
  label: string;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-medium text-slate-500">
        {label}
        <span className="ml-0.5 text-red-500">*</span>
      </label>
      <Select>
        <SelectTrigger className="h-10 w-full border-slate-200 bg-[#F8F9FA] text-slate-400 focus:ring-1 focus:ring-slate-300">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}
