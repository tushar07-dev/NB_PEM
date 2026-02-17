"use client";

import type { Column, ColumnMeta, Table } from "@tanstack/react-table";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  GripVertical,
  ListFilter,
  Trash2,
} from "lucide-react";
import * as React from "react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
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
import SearchInput from "@/shared/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@/shared/components/ui/sortable";

import { cn } from "@/lib/utils";
import type {
  ExtendedColumnFilter,
  FilterOperator,
  JoinOperator,
} from "@/shared/types/data-table";
import { useTableActions, useTableState } from "@/shared/store/tableStore";
import { useDebouncedCallback } from "@/shared/hooks/use-debounced-callback";
import { generateId } from "@/shared/lib/id";
import {
  getDefaultFilterOperator,
  getFilterOperators,
} from "@/shared/lib/data-table";
import { dataTableConfig } from "@/shared/config/data-table";
import { DataTableRangeFilter } from "./data-table-range-filter";
import { toFormattedDate } from "@/shared/lib/datatime/format";

const DEBOUNCE_MS = 300;
// const THROTTLE_MS = 50;
const OPEN_MENU_SHORTCUT = "f";
const REMOVE_FILTER_SHORTCUTS = new Set(["backspace", "delete"]);

export type DataTableFilterSearchInputProps<TData> = {
  details?: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>;
  label?: string;
  onClear?: () => void;
};

interface DataTableFilterListProps<TData> extends React.ComponentProps<
  typeof PopoverContent
> {
  table: Table<TData>;
  debounceMs?: number;
  throttleMs?: number;
  searchable?: boolean;
  shallow?: boolean;
  tableid: string;
  searchInput?: DataTableFilterSearchInputProps<TData>;
}

export function DataTableFilterList<TData>({
  table,
  searchInput,
  searchable = true,
  debounceMs = DEBOUNCE_MS,
  throttleMs = THROTTLE_MS, // destructured so it never reaches PopoverContent / DOM
  shallow = true, // same
  tableid, // same
  ...props
}: DataTableFilterListProps<TData>) {
  const id = React.useId();
  const labelId = React.useId();
  const descriptionId = React.useId();
  const [open, setOpen] = React.useState(false);
  const addButtonRef = React.useRef<HTMLButtonElement>(null);

  const columns = React.useMemo(() => {
    return table
      .getAllColumns()
      .filter((column) => column.columnDef.enableColumnFilter);
  }, [table]);

  const [search, setSearch] = React.useState("");
  const { setPage, setFilters, setJoinOperator } =
    useTableActions<TData>(tableid);

  const { filters, joinOperator } = useTableState<TData>(tableid);

  // const [filters, setFilters] = useQueryState(
  //   FILTERS_KEY,
  //   getFiltersStateParser<TData>(columns.map((field) => field.id))
  //     .withDefault(tempArray)
  //     .withOptions({
  //       clearOnDefault: true,
  //       shallow,
  //       throttleMs,
  //     })
  // );

  const debouncedSetFilters = useDebouncedCallback(setFilters, debounceMs);

  const onFilterAdd = React.useCallback(() => {
    const column = columns[0];

    if (!column) return;

    const filterId = generateId({ length: 8 });

    debouncedSetFilters([
      ...filters,
      {
        id: column.id as Extract<keyof TData, string>,
        value: "",
        variant: column.columnDef.meta?.variant ?? "text",
        operator: getDefaultFilterOperator(
          column.columnDef.meta?.variant ?? "text"
        ),
        filterId: filterId,
      },
    ]);
  }, [columns, filters, debouncedSetFilters]);

  const onFilterUpdate = React.useCallback(
    (
      filterId: string,
      updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
    ) => {
      const updatedFilters = filters.map((filter) => {
        if (filter.filterId === filterId) {
          return { ...filter, ...updates } as ExtendedColumnFilter<TData>;
        }
        return filter;
      });
      debouncedSetFilters(updatedFilters);
    },
    [debouncedSetFilters, filters]
  );

  const onFilterRemove = React.useCallback(
    (filterId: string) => {
      const updatedFilters = filters.filter(
        (filter) => filter.filterId !== filterId
      );
      setFilters(updatedFilters);
      requestAnimationFrame(() => {
        addButtonRef.current?.focus();
      });
    },
    [filters, setFilters]
  );

  const onFiltersReset = React.useCallback(() => {
    setFilters(null);
    setJoinOperator("and");
  }, [setFilters, setJoinOperator]);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (
        event.key.toLowerCase() === OPEN_MENU_SHORTCUT &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey
      ) {
        event.preventDefault();
        setOpen(true);
      }

      if (
        event.key.toLowerCase() === OPEN_MENU_SHORTCUT &&
        event.shiftKey &&
        filters.length > 0
      ) {
        event.preventDefault();
        onFilterRemove(filters[filters.length - 1]?.filterId ?? "");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [filters, onFilterRemove]);

  const onTriggerKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (
        REMOVE_FILTER_SHORTCUTS.has(event.key.toLowerCase()) &&
        filters.length > 0
      ) {
        event.preventDefault();
        onFilterRemove(filters[filters.length - 1]?.filterId ?? "");
      }
    },
    [filters, onFilterRemove]
  );

  React.useEffect(() => {
    if (!searchable) return;

    if (filters.length === 0) {
      const filterId = generateId({ length: 8 });
      let column = columns[0];
      if (searchInput?.details?.id) {
        column =
          columns.find((c) => c.id === searchInput?.details?.id) ?? column;
      }

      if (!column) return;
      debouncedSetFilters([
        ...filters,
        {
          id:
            searchInput?.details?.id ??
            (column.id as Extract<keyof TData, string>),
          value: "",
          variant:
            searchInput?.details?.variant ??
            column.columnDef.meta?.variant ??
            "text",
          operator:
            searchInput?.details?.operator ??
            getDefaultFilterOperator(column.columnDef.meta?.variant ?? "text"),
          filterId: filterId,
        },
      ]);
      return;
    }

    if (filters[0]) {
      setSearch(filters[0].value as string);
    }
  }, [columns, debouncedSetFilters, filters, searchable, searchInput?.details]);

  const filterLengthToDisplay = searchable
    ? filters.length - 1
    : filters.length;

  React.useEffect(() => {
    setPage(1);
  }, [filters, setPage]);

  return (
    <>
      {searchable ? (
        <SearchInput
          onChange={(event) => setSearch(event.target.value)}
          handleSearchClick={() => {
            if (!filters[0]) return;
            onFilterUpdate(filters[0].filterId, {
              value: search,
            });
          }}
          onClear={() => {
            setSearch("");
            if (!filters[0]) return;
            onFilterUpdate(filters[0].filterId, {
              value: "",
            });
          }}
          value={search}
          placeholder={searchInput?.label}
          className="h-8"
        />
      ) : (
        ""
      )}
      <Sortable
        value={filters}
        onValueChange={setFilters}
        getItemValue={(item) => item.filterId}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="default" size="sm" onKeyDown={onTriggerKeyDown}>
              <ListFilter />
              {filterLengthToDisplay > 0 && (
                <Badge
                  variant="secondary"
                  className="h-[18.24px] px-[5.12px] font-mono text-[10.4px] font-normal"
                >
                  {filterLengthToDisplay}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            aria-describedby={descriptionId}
            aria-labelledby={labelId}
            className="flex w-full max-w-[var(--radix-popover-content-available-width)] origin-[var(--radix-popover-content-transform-origin)] flex-col gap-3.5 p-4 sm:min-w-[380px]"
            {...props}
          >
            <div className="flex flex-col gap-1">
              <h4 id={labelId} className="leading-none font-medium">
                {filters.length === 0 || (filters.length === 1 && searchable)
                  ? "No filters applied"
                  : "Filters"}
              </h4>
              <p
                id={descriptionId}
                className={cn("text-muted-foreground text-sm")}
              >
                {filters.length === 0 || (filters.length === 1 && searchable)
                  ? "Add filters to refine your rows."
                  : "Modify filters to refine your rows."}
              </p>
            </div>
            {!(filters.length === 0 || (filters.length === 1 && searchable)) ? (
              <SortableContent asChild>
                <div
                  role="list"
                  className="flex max-h-[300px] flex-col gap-2 overflow-y-auto p-1"
                >
                  {filters.map((filter, index) =>
                    searchable && index === 0 ? (
                      ""
                    ) : (
                      <DataTableFilterItem<TData>
                        key={filter.filterId}
                        filter={filter}
                        index={index}
                        isSearchableInput={searchable && index === 0}
                        filterItemId={`${id}-filter-${filter.filterId}`}
                        joinOperator={joinOperator}
                        setJoinOperator={setJoinOperator}
                        columns={columns}
                        onFilterUpdate={onFilterUpdate}
                        onFilterRemove={onFilterRemove}
                      />
                    )
                  )}
                </div>
              </SortableContent>
            ) : null}
            <div className="flex w-full items-center justify-end gap-2">
              <Button
                size="sm"
                className=""
                ref={addButtonRef}
                onClick={onFilterAdd}
              >
                Add filter
              </Button>
              {filters.length > (searchable ? 1 : 0) ? (
                <Button size="sm" className="" onClick={onFiltersReset}>
                  Reset filter
                </Button>
              ) : null}
            </div>
          </PopoverContent>
        </Popover>
        <SortableOverlay>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 h-8 min-w-[72px]" />
            <div className="bg-primary/10 h-8 w-32" />
            <div className="bg-primary/10 h-8 w-32" />
            <div className="bg-primary/10 h-8 min-w-36 flex-1" />
            <div className="bg-primary/10 size-8 shrink-0" />
            <div className="bg-primary/10 size-8 shrink-0" />
          </div>
        </SortableOverlay>
      </Sortable>
    </>
  );
}

interface DataTableFilterItemProps<TData> {
  filter: ExtendedColumnFilter<TData>;
  index: number;
  filterItemId: string;
  joinOperator: JoinOperator;
  setJoinOperator: (value: JoinOperator) => void;
  isSearchableInput: boolean;
  columns: Column<TData>[];
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
  ) => void;
  onFilterRemove: (filterId: string) => void;
}

function DataTableFilterItem<TData>({
  filter,
  index,
  filterItemId,
  joinOperator,
  setJoinOperator,
  isSearchableInput,
  columns,
  onFilterUpdate,
  onFilterRemove,
}: DataTableFilterItemProps<TData>) {
  const [showFieldSelector, setShowFieldSelector] = React.useState(false);
  const [showOperatorSelector, setShowOperatorSelector] = React.useState(false);
  const [showValueSelector, setShowValueSelector] = React.useState(false);

  const column = columns.find((column) => column.id === filter.id);

  const joinOperatorListboxId = `${filterItemId}-join-operator-listbox`;
  const fieldListboxId = `${filterItemId}-field-listbox`;
  const operatorListboxId = `${filterItemId}-operator-listbox`;
  const inputId = `${filterItemId}-input`;

  const filterOperators = getFilterOperators(filter.variant);

  const onItemKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (showFieldSelector || showOperatorSelector || showValueSelector) {
        return;
      }

      if (REMOVE_FILTER_SHORTCUTS.has(event.key.toLowerCase())) {
        event.preventDefault();
        onFilterRemove(filter.filterId);
      }
    },
    [
      filter.filterId,
      showFieldSelector,
      showOperatorSelector,
      showValueSelector,
      onFilterRemove,
    ]
  );

  if (!column) return null;
  const columnMeta = column.columnDef.meta;

  return (
    <SortableItem value={filter.filterId} asChild>
      <div
        role="listitem"
        id={filterItemId}
        tabIndex={-1}
        className="flex items-center gap-2"
        onKeyDown={onItemKeyDown}
      >
        <div className="min-w-[72px] text-center">
          {index === 0 ? (
            <span className="text-muted-foreground text-sm">Where</span>
          ) : index === 1 ? (
            <Select
              value={joinOperator}
              onValueChange={(value: JoinOperator) => setJoinOperator(value)}
            >
              <SelectTrigger
                aria-label="Select join operator"
                aria-controls={joinOperatorListboxId}
                className="h-8 lowercase [&[data-size]]:h-8"
              >
                <SelectValue placeholder={joinOperator} />
              </SelectTrigger>
              <SelectContent
                id={joinOperatorListboxId}
                position="popper"
                className="min-w-(--radix-select-trigger-width) lowercase"
              >
                {dataTableConfig.joinOperators.map((joinOperator) => (
                  <SelectItem key={joinOperator} value={joinOperator}>
                    {joinOperator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-muted-foreground text-sm">
              {joinOperator}
            </span>
          )}
        </div>
        <Popover open={showFieldSelector} onOpenChange={setShowFieldSelector}>
          <PopoverTrigger asChild>
            <Button
              role="combobox"
              aria-controls={fieldListboxId}
              variant="outline"
              disabled={isSearchableInput}
              size="sm"
              className="bg-input font-helvetica w-32 justify-between font-normal"
            >
              <span className="truncate">
                {columns.find((column) => column.id === filter.id)?.columnDef
                  .meta?.label ?? "Select field"}
              </span>
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            id={fieldListboxId}
            align="start"
            className="w-40 origin-[var(--radix-popover-content-transform-origin)] p-0"
          >
            <Command>
              <CommandInput placeholder="Search fields..." />
              <CommandList>
                <CommandEmpty>No fields found.</CommandEmpty>
                <CommandGroup>
                  {columns.map((column) => (
                    <CommandItem
                      key={column.id}
                      value={column.id}
                      onSelect={(value) => {
                        onFilterUpdate(filter.filterId, {
                          id: value as Extract<keyof TData, string>,
                          variant: column.columnDef.meta?.variant ?? "text",
                          operator: getDefaultFilterOperator(
                            column.columnDef.meta?.variant ?? "text"
                          ),
                          value: "",
                        });

                        setShowFieldSelector(false);
                      }}
                    >
                      <span className="truncate">
                        {column.columnDef.meta?.label}
                      </span>
                      <Check
                        className={cn(
                          "ml-auto",
                          column.id === filter.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Select
          open={showOperatorSelector}
          onOpenChange={setShowOperatorSelector}
          value={filter.operator}
          disabled={isSearchableInput}
          onValueChange={(value: FilterOperator) =>
            onFilterUpdate(filter.filterId, {
              operator: value,
              value:
                value === "isEmpty" || value === "isNotEmpty"
                  ? ""
                  : filter.value,
            })
          }
        >
          <SelectTrigger
            aria-controls={operatorListboxId}
            className="h-8 w-32 lowercase [&[data-size]]:h-8"
          >
            <div className="truncate">
              <SelectValue placeholder={filter.operator} />
            </div>
          </SelectTrigger>
          <SelectContent
            id={operatorListboxId}
            className="origin-[var(--radix-select-content-transform-origin)]"
          >
            {filterOperators.map((operator) => (
              <SelectItem
                key={operator.value}
                value={operator.value}
                className="lowercase"
              >
                {operator.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="min-w-36 flex-1">
          {onFilterInputRender({
            filter,
            inputId,
            column,
            columnMeta,
            onFilterUpdate,
            showValueSelector,
            setShowValueSelector,
          })}
        </div>
        {isSearchableInput && index === 0 ? (
          ""
        ) : (
          <>
            <Button
              aria-controls={filterItemId}
              variant="default"
              size="icon"
              className="size-8"
              onClick={() => onFilterRemove(filter.filterId)}
            >
              <Trash2 />
            </Button>
            <SortableItemHandle asChild>
              <Button variant="default" size="icon" className="size-8">
                <GripVertical />
              </Button>
            </SortableItemHandle>
          </>
        )}
      </div>
    </SortableItem>
  );
}

// Helper functions for rendering different filter input types
function renderEmptyFilter<TData>(
  inputId: string,
  columnMeta: ColumnMeta<TData, unknown> | undefined,
  filter: ExtendedColumnFilter<TData>
) {
  return (
    <div
      id={inputId}
      role="status"
      aria-label={`${columnMeta?.label} filter is ${
        filter.operator === "isEmpty" ? "empty" : "not empty"
      }`}
      aria-live="polite"
      className="dark:bg-input/30 h-8 w-full border bg-transparent"
    />
  );
}

function renderTextNumberFilter<TData>(
  filter: ExtendedColumnFilter<TData>,
  column: Column<TData>,
  inputId: string,
  columnMeta: ColumnMeta<TData, unknown> | undefined,
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
  ) => void
) {
  if (
    (filter.variant === "range" && filter.operator === "isBetween") ||
    filter.operator === "isBetween"
  ) {
    return (
      <DataTableRangeFilter
        filter={filter}
        column={column}
        inputId={inputId}
        onFilterUpdate={onFilterUpdate}
      />
    );
  }

  const isNumber = filter.variant === "number" || filter.variant === "range";

  return (
    <Input
      // label={columnMeta?.placeholder ?? "Enter a value..."}
      id={inputId}
      type={isNumber ? "number" : filter.variant}
      aria-label={`${columnMeta?.label} filter value`}
      aria-describedby={`${inputId}-description`}
      inputMode={isNumber ? "numeric" : undefined}
      placeholder={columnMeta?.placeholder ?? "Enter a value..."}
      className="h-8 w-full"
      defaultValue={typeof filter.value === "string" ? filter.value : undefined}
      onChange={(event) =>
        onFilterUpdate(filter.filterId, {
          value: event.target.value,
        })
      }
    />
  );
}

function renderSelectFilter<TData>(
  filter: ExtendedColumnFilter<TData>,
  inputId: string,
  columnMeta: ColumnMeta<TData, unknown> | undefined,
  showValueSelector: boolean,
  setShowValueSelector: (value: boolean) => void,
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
  ) => void
) {
  if (Array.isArray(filter.value)) return null;

  const inputListboxId = `${inputId}-listbox`;

  return (
    <Select
      open={showValueSelector}
      onOpenChange={setShowValueSelector}
      value={filter.value}
      onValueChange={(value) =>
        onFilterUpdate(filter.filterId, {
          value,
        })
      }
    >
      <SelectTrigger
        id={inputId}
        aria-controls={inputListboxId}
        aria-label={`${columnMeta?.label} select filter`}
        className="h-8 w-full [&[data-size]]:h-8"
      >
        <SelectValue placeholder={"Select Option"} />
      </SelectTrigger>
      <SelectContent id={inputListboxId}>
        {columnMeta?.options?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function renderMultiSelectFilter<TData>(
  filter: ExtendedColumnFilter<TData>,
  inputId: string,
  columnMeta: ColumnMeta<TData, unknown> | undefined,
  showValueSelector: boolean,
  setShowValueSelector: (value: boolean) => void,
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
  ) => void
) {
  const inputListboxId = `${inputId}-listbox`;
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
      onValueChange={(value) => {
        onFilterUpdate(filter.filterId, {
          value,
        });
      }}
      multiple={multiple}
    >
      <FacetedTrigger asChild>
        <Button
          id={inputId}
          aria-controls={inputListboxId}
          aria-label={`${columnMeta?.label} filter value${multiple ? "s" : ""}`}
          variant="outline"
          size="sm"
          className="w-full font-normal"
        >
          <FacetedBadgeList
            options={columnMeta?.options}
            placeholder={
              columnMeta?.placeholder ??
              `Select option${multiple ? "s" : ""}...`
            }
          />
        </Button>
      </FacetedTrigger>
      <FacetedContent
        id={inputListboxId}
        className="w-[200px] origin-[var(--radix-popover-content-transform-origin)]"
      >
        <FacetedInput placeholder="Search..." />
        <FacetedList>
          <FacetedEmpty>No results found.</FacetedEmpty>
          <FacetedGroup>
            {columnMeta?.options?.map((option) => (
              <FacetedItem key={option.value} value={option.value}>
                {option.icon && (
                  <option.icon
                    className="text-muted-foreground mr-2 size-4"
                    aria-hidden="true"
                  />
                )}
                {option.label}
              </FacetedItem>
            ))}
          </FacetedGroup>
        </FacetedList>
      </FacetedContent>
    </Faceted>
  );
}

function renderDateFilter<TData>(
  filter: ExtendedColumnFilter<TData>,
  inputId: string,
  columnMeta: ColumnMeta<TData, unknown> | undefined,
  showValueSelector: boolean,
  setShowValueSelector: (value: boolean) => void,
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
  ) => void
) {
  const inputListboxId = `${inputId}-listbox`;
  const dateValue = filter.value as string;
  const displayValue = dateValue
    ? toFormattedDate(dateValue, "dd/MM/yyyy") || "Pick a date"
    : "Pick a date";

  return (
    <Popover open={showValueSelector} onOpenChange={setShowValueSelector}>
      <PopoverTrigger asChild>
        <Button
          id={inputId}
          aria-controls={inputListboxId}
          aria-label={`${columnMeta?.label} date filter`}
          variant="outline"
          size="sm"
          className={cn(
            "w-full justify-start text-left font-normal",
            !filter.value && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          <span className="truncate">{displayValue}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        id={inputListboxId}
        align="start"
        className="w-auto origin-[var(--radix-popover-content-transform-origin)] p-0"
      >
        <Calendar
          aria-label={`Select ${columnMeta?.label} date`}
          initialFocus
          selected={dateValue ? new Date(dateValue) : undefined}
          onSelect={(date) => {
            onFilterUpdate(filter.filterId, {
              value: toFormattedDate(date, "yyyy-MM-dd") as string,
            });
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function renderBooleanFilter<TData>(
  filter: ExtendedColumnFilter<TData>,
  inputId: string,
  columnMeta: ColumnMeta<TData, unknown> | undefined,
  showValueSelector: boolean,
  setShowValueSelector: (value: boolean) => void,
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
  ) => void
) {
  if (Array.isArray(filter.value)) return null;

  const inputListboxId = `${inputId}-listbox`;

  return (
    <Select
      open={showValueSelector}
      onOpenChange={setShowValueSelector}
      value={filter.value}
      onValueChange={(value) =>
        onFilterUpdate(filter.filterId, {
          value,
        })
      }
    >
      <SelectTrigger
        id={inputId}
        aria-controls={inputListboxId}
        aria-label={`${columnMeta?.label} boolean filter`}
        className="h-8 w-full [&[data-size]]:h-8"
      >
        <SelectValue placeholder={"Select Option"} />
      </SelectTrigger>
      <SelectContent id={inputListboxId}>
        <SelectItem value="true">Yes</SelectItem>
        <SelectItem value="false">No</SelectItem>
      </SelectContent>
    </Select>
  );
}

function onFilterInputRender<TData>({
  filter,
  inputId,
  column,
  columnMeta,
  onFilterUpdate,
  showValueSelector,
  setShowValueSelector,
}: {
  filter: ExtendedColumnFilter<TData>;
  inputId: string;
  column: Column<TData>;
  columnMeta?: ColumnMeta<TData, unknown>;
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
  ) => void;
  showValueSelector: boolean;
  setShowValueSelector: (value: boolean) => void;
}) {
  if (filter.operator === "isEmpty" || filter.operator === "isNotEmpty") {
    return renderEmptyFilter(inputId, columnMeta, filter);
  }

  switch (filter.variant) {
    case "text":
    case "number":
    case "range":
      return renderTextNumberFilter(
        filter,
        column,
        inputId,
        columnMeta,
        onFilterUpdate
      );

    case "boolean":
      return renderBooleanFilter(
        filter,
        inputId,
        columnMeta,
        showValueSelector,
        setShowValueSelector,
        onFilterUpdate
      );

    case "select":
      return renderSelectFilter(
        filter,
        inputId,
        columnMeta,
        showValueSelector,
        setShowValueSelector,
        onFilterUpdate
      );
    case "multiSelect":
      return renderMultiSelectFilter(
        filter,
        inputId,
        columnMeta,
        showValueSelector,
        setShowValueSelector,
        onFilterUpdate
      );

    case "date":
      return renderDateFilter(
        filter,
        inputId,
        columnMeta,
        showValueSelector,
        setShowValueSelector,
        onFilterUpdate
      );
    case "dateRange":
      // TODO: Implement date range filter
      return <></>;

    default:
      return null;
  }
}
