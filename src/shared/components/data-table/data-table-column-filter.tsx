"use client";

import type { Column, ColumnMeta } from "@tanstack/react-table";
import { CalendarIcon, Filter, Trash2 } from "lucide-react";
import * as React from "react";

import { DataTableRangeFilter } from "@/shared/components/data-table/data-table-range-filter";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Faceted,
  FacetedBadgeList,
  FacetedContent,
  FacetedEmpty,
  FacetedGroup,
  FacetedInput,
  FacetedItem,
  FacetedList,
  FacetedTrigger,
} from "@/shared/components/ui/faceted";
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useDebouncedCallback } from "@/shared/hooks/data-table/use-debounced-callback";
import {
  getDefaultFilterOperator,
  getFilterOperators,
} from "@/shared/lib/data-table/data-table";
import { formatDate } from "@/shared/lib/data-table/format";
import { generateId } from "@/shared/lib/data-table/id";
import { cn } from "@/shared/lib/utils";

// ✅ CHANGED: replaced useFilterStore/useFiltersByColumn with context hooks
import {
  useFiltersByColumnFromContext,
  useFilterActionsFromContext,
} from "@/shared/context/FilterStoreContext";

import type {
  ExtendedColumnFilter,
  FilterOperator,
} from "@/shared/types/data-table";

const DEBOUNCE_MS = 300;

interface DataTableColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  debounceMs?: number;
}

export function DataTableColumnFilter<TData, TValue>({
  column,
  debounceMs = DEBOUNCE_MS,
}: DataTableColumnFilterProps<TData, TValue>) {
  const [open, setOpen] = React.useState(false);

  const columnId = column.id;
  const columnMeta = column.columnDef.meta;
  const variant = columnMeta?.variant ?? "text";
  const label = columnMeta?.label ?? columnId;

  // ✅ CHANGED: read from context store, not global singleton
  const columnFilters = useFiltersByColumnFromContext(
    columnId
  ) as ExtendedColumnFilter<TData>[];
  const { addFilter, updateFilter, removeFilter } =
    useFilterActionsFromContext();

  const debouncedUpdateFilter = useDebouncedCallback(updateFilter, debounceMs);

  const onFilterUpdate = React.useCallback(
    (
      filterId: string,
      updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
    ) => {
      debouncedUpdateFilter(
        filterId,
        updates as Partial<Omit<ExtendedColumnFilter<unknown>, "filterId">>
      );
    },
    [debouncedUpdateFilter]
  );

  const handleFilterRemove = React.useCallback(
    (filterId: string) => {
      removeFilter(filterId);
      const remaining = columnFilters.filter((f) => f.filterId !== filterId);
      if (remaining.length === 0) {
        setOpen(false);
      }
    },
    [removeFilter, columnFilters]
  );

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      if (newOpen && columnFilters.length === 0) {
        const newFilter: ExtendedColumnFilter<TData> = {
          id: columnId as Extract<keyof TData, string>,
          value: "",
          variant: variant,
          operator: getDefaultFilterOperator(variant),
          filterId: generateId({ length: 8 }),
        };
        addFilter(newFilter as ExtendedColumnFilter<unknown>);
      }
    },
    [columnFilters.length, columnId, variant, addFilter]
  );

  if (column.columnDef.enableColumnFilter === false) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-6 shrink-0 text-primary-100",
            columnFilters.length > 0 && "text-blue-900 font-semibold"
          )}
          aria-label={`Filter ${label}`}
        >
          <Filter className="size-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-3">
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-medium">Filter {label}</h4>
          {columnFilters.map((filter) => (
            <ColumnFilterItem
              key={filter.filterId}
              filter={filter}
              column={column}
              columnMeta={columnMeta}
              onFilterUpdate={onFilterUpdate}
              onFilterRemove={handleFilterRemove}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ── ColumnFilterItem — unchanged ──────────────────────────────────────────────

interface ColumnFilterItemProps<TData, TValue> {
  filter: ExtendedColumnFilter<TData>;
  column: Column<TData, TValue>;
  columnMeta?: ColumnMeta<TData, TValue>;
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
  ) => void;
  onFilterRemove: (filterId: string) => void;
}

function ColumnFilterItem<TData, TValue>({
  filter,
  column,
  columnMeta,
  onFilterUpdate,
  onFilterRemove,
}: ColumnFilterItemProps<TData, TValue>) {
  const [showValueSelector, setShowValueSelector] = React.useState(false);
  const inputId = React.useId();
  const filterOperators = getFilterOperators(filter.variant);

  return (
    <div className="flex flex-col gap-2 rounded-md border p-2">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">Where</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={() => onFilterRemove(filter.filterId)}
        >
          <Trash2 className="size-3" />
        </Button>
      </div>
      <Select
        value={filter.operator}
        onValueChange={(value: FilterOperator) =>
          onFilterUpdate(filter.filterId, {
            operator: value,
            value:
              value === "isEmpty" || value === "isNotEmpty" ? "" : filter.value,
          })
        }
      >
        <SelectTrigger size="sm" className="h-8 rounded text-xs lowercase">
          <SelectValue placeholder={filter.operator} />
        </SelectTrigger>
        <SelectContent>
          {filterOperators.map((operator) => (
            <SelectItem
              key={operator.value}
              value={operator.value}
              className="text-xs lowercase"
            >
              {operator.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FilterValueInput
        filter={filter}
        inputId={inputId}
        column={column}
        columnMeta={columnMeta}
        onFilterUpdate={onFilterUpdate}
        showValueSelector={showValueSelector}
        setShowValueSelector={setShowValueSelector}
      />
    </div>
  );
}

// ── FilterValueInput — unchanged ──────────────────────────────────────────────

interface FilterValueInputProps<TData, TValue> {
  filter: ExtendedColumnFilter<TData>;
  inputId: string;
  column: Column<TData, TValue>;
  columnMeta?: ColumnMeta<TData, TValue>;
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
  ) => void;
  showValueSelector: boolean;
  setShowValueSelector: (value: boolean) => void;
}

function FilterValueInput<TData, TValue>({
  filter,
  inputId,
  column,
  columnMeta,
  onFilterUpdate,
  showValueSelector,
  setShowValueSelector,
}: FilterValueInputProps<TData, TValue>) {
  if (filter.operator === "isEmpty" || filter.operator === "isNotEmpty") {
    return (
      <div
        id={inputId}
        className="bg-muted/30 flex h-8 w-full items-center justify-center rounded border"
      >
        <span className="text-muted-foreground text-xs">
          {filter.operator === "isEmpty" ? "is empty" : "is not empty"}
        </span>
      </div>
    );
  }

  switch (filter.variant) {
    case "text":
    case "number":
    case "range": {
      if (filter.operator === "isBetween") {
        return (
          <DataTableRangeFilter
            filter={filter}
            column={column as Column<TData, unknown>}
            inputId={inputId}
            onFilterUpdate={onFilterUpdate}
          />
        );
      }
      const isNumber =
        filter.variant === "number" || filter.variant === "range";
      return (
        <Input
          id={inputId}
          type={isNumber ? "number" : "text"}
          inputMode={isNumber ? "numeric" : undefined}
          placeholder={columnMeta?.placeholder ?? "Enter a value..."}
          className="h-8 text-sm"
          defaultValue={
            typeof filter.value === "string" ? filter.value : undefined
          }
          onChange={(event) =>
            onFilterUpdate(filter.filterId, { value: event.target.value })
          }
        />
      );
    }

    case "boolean": {
      if (Array.isArray(filter.value)) return null;
      return (
        <Select
          open={showValueSelector}
          onOpenChange={setShowValueSelector}
          value={filter.value}
          onValueChange={(value) => onFilterUpdate(filter.filterId, { value })}
        >
          <SelectTrigger size="sm" className="h-8 text-sm">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">True</SelectItem>
            <SelectItem value="false">False</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    case "select":
    case "multiSelect": {
      const multiple = filter.variant === "multiSelect";
      const selectedValues = multiple
        ? Array.isArray(filter.value)
          ? filter.value
          : []
        : typeof filter.value === "string"
          ? filter.value
          : undefined;
      return (
        <Faceted
          open={showValueSelector}
          onOpenChange={setShowValueSelector}
          value={selectedValues}
          onValueChange={(value) => onFilterUpdate(filter.filterId, { value })}
          multiple={multiple}
        >
          <FacetedTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-full justify-start text-sm font-normal"
            >
              <FacetedBadgeList
                options={columnMeta?.options}
                placeholder={`Select option${multiple ? "s" : ""}...`}
              />
            </Button>
          </FacetedTrigger>
          <FacetedContent className="w-56">
            <FacetedInput placeholder="Search options..." />
            <FacetedList>
              <FacetedEmpty>No options found.</FacetedEmpty>
              <FacetedGroup>
                {columnMeta?.options?.map((option) => (
                  <FacetedItem key={option.value} value={option.value}>
                    {option.icon && <option.icon />}
                    <span>{option.label}</span>
                  </FacetedItem>
                ))}
              </FacetedGroup>
            </FacetedList>
          </FacetedContent>
        </Faceted>
      );
    }

    case "date":
    case "dateRange": {
      const dateValue = Array.isArray(filter.value)
        ? filter.value.filter(Boolean)
        : [filter.value, filter.value].filter(Boolean);
      const startDate = dateValue[0]
        ? new Date(Number(dateValue[0]))
        : undefined;
      const endDate = dateValue[1] ? new Date(Number(dateValue[1])) : undefined;
      const isSameDate =
        startDate &&
        endDate &&
        startDate.toDateString() === endDate.toDateString();
      const displayValue =
        filter.operator === "isBetween" && dateValue.length === 2 && !isSameDate
          ? `${formatDate(startDate, { month: "short" })} - ${formatDate(endDate, { month: "short" })}`
          : startDate
            ? formatDate(startDate, { month: "short" })
            : "Pick a date";
      return (
        <Popover open={showValueSelector} onOpenChange={setShowValueSelector}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 w-full justify-start text-left text-sm font-normal",
                !filter.value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 size-3.5" />
              <span className="truncate">{displayValue}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            {filter.operator === "isBetween" ? (
              <Calendar
                autoFocus
                captionLayout="dropdown"
                mode="range"
                selected={
                  dateValue.length === 2
                    ? {
                        from: new Date(Number(dateValue[0])),
                        to: new Date(Number(dateValue[1])),
                      }
                    : { from: new Date(), to: new Date() }
                }
                onSelect={(date) => {
                  onFilterUpdate(filter.filterId, {
                    value: date
                      ? [
                          (date.from?.getTime() ?? "").toString(),
                          (date.to?.getTime() ?? "").toString(),
                        ]
                      : [],
                  });
                }}
              />
            ) : (
              <Calendar
                autoFocus
                captionLayout="dropdown"
                mode="single"
                selected={
                  dateValue[0] ? new Date(Number(dateValue[0])) : undefined
                }
                onSelect={(date) => {
                  onFilterUpdate(filter.filterId, {
                    value: (date?.getTime() ?? "").toString(),
                  });
                  setShowValueSelector(false);
                }}
              />
            )}
          </PopoverContent>
        </Popover>
      );
    }

    default:
      return null;
  }
}
