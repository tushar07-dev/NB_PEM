// src/shared/components/advanced-table/AdvancedColumnHeader.tsx

import { useState } from "react";
import { type Column } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Filter,
  FilterX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { TextFilter } from "./filters/TextFilter";
import { SelectFilter } from "./filters/SelectFilter";
import { NumberFilter } from "./filters/NumberFilter";
import { DateFilter } from "./filters/DateFilter";
import type { AdvancedColumnDef, FilterValue } from "./types";

interface AdvancedColumnHeaderProps<TData> {
  column: Column<TData>;
  columnDef: AdvancedColumnDef<TData>;
  title: string;
}

export function AdvancedColumnHeader<TData>({
  column,
  columnDef,
  title,
}: AdvancedColumnHeaderProps<TData>) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const hasActiveFilter = column.getFilterValue() !== undefined;
  const canSort = columnDef.sortable !== false;
  const canFilter = columnDef.filterable !== false && columnDef.filter;

  const handleFilterChange = (value: FilterValue | null) => {
    column.setFilterValue(value);
  };

  const renderFilter = () => {
    if (!columnDef.filter) return null;

    const commonProps = {
      config: columnDef.filter as any,
      value: column.getFilterValue() as any,
      onChange: handleFilterChange,
      onClose: () => setFilterOpen(false),
    };

    switch (columnDef.filter.type) {
      case "text":
        return <TextFilter {...commonProps} />;
      case "select":
      case "status":
        return <SelectFilter {...commonProps} />;
      case "number":
      case "rangeSlider":
        return <NumberFilter {...commonProps} />;
      case "date":
      case "datetime":
        return <DateFilter {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        columnDef.align === "center" && "justify-center",
        columnDef.align === "right" && "justify-end",
        columnDef.headerClassName
      )}
    >
      {/* Sort Button */}
      {canSort && (
        <DropdownMenu open={sortMenuOpen} onOpenChange={setSortMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="data-[state=open]:bg-accent -ml-3 h-8"
            >
              <span>{title}</span>
              {column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUp className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
              Desc
            </DropdownMenuItem>
            {column.getIsSorted() && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => column.clearSorting()}>
                  <FilterX className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                  Clear Sort
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Non-sortable Title */}
      {!canSort && <span className="font-medium">{title}</span>}

      {/* Filter Button */}
      {canFilter && (
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-7 w-7 p-0", hasActiveFilter && "text-primary")}
            >
              {hasActiveFilter ? (
                <Filter className="h-4 w-4 fill-current" />
              ) : (
                <Filter className="h-4 w-4" />
              )}
              <span className="sr-only">Filter {title}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            side="bottom"
            className="w-auto p-0"
            onInteractOutside={(e) => {
              // Prevent closing when clicking inside calendar
              const target = e.target as HTMLElement;
              if (target.closest('[role="dialog"]')) {
                e.preventDefault();
              }
            }}
          >
            {renderFilter()}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
