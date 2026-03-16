// src/shared/hooks/data-table/use-data-table.ts
//
// Reads filter state from FilterStoreContext (isolated per table instance)
// instead of the global useFilterStore singleton.
// Every other piece of logic is unchanged.

import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

import { useDebouncedCallback } from "@/shared/hooks/data-table/use-debounced-callback";
import { applyFilterOperator } from "@/shared/lib/data-table/data-table";
import type {
  ExtendedColumnFilter,
  ExtendedColumnSort,
} from "@/shared/types/data-table";
import {
  useFiltersFromContext,
  useGlobalJoinOperatorFromContext,
  useColumnJoinOperatorsFromContext,
  useFilterActionsFromContext,
  useGlobalSearchTermFromContext,
} from "@/shared/context/FilterStoreContext";

const DEBOUNCE_MS = 300;

interface UseDataTableProps<TData>
  extends
    Omit<
      TableOptions<TData>,
      | "state"
      | "pageCount"
      | "getCoreRowModel"
      | "manualFiltering"
      | "manualPagination"
      | "manualSorting"
    >,
    Required<Pick<TableOptions<TData>, "pageCount">> {
  initialState?: Omit<Partial<TableState>, "sorting"> & {
    sorting?: ExtendedColumnSort<TData>[];
  };
  debounceMs?: number;
  /**
   * Column accessorKeys to include in global text search.
   * Each table controls which columns are searched.
   * Example: ["description", "category", "checkResult"]
   */
  searchableColumns?: Extract<keyof TData, string>[];
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    columns,
    pageCount = -1,
    initialState,
    debounceMs = DEBOUNCE_MS,
    searchableColumns = [],
    ...tableProps
  } = props;

  // ── Filter state from isolated context store ─────────────────────────────
  const advancedFilters =
    useFiltersFromContext() as ExtendedColumnFilter<TData>[];
  const globalJoinOperator = useGlobalJoinOperatorFromContext();
  const columnJoinOperators = useColumnJoinOperatorsFromContext();
  const { resetFilters } = useFilterActionsFromContext();
  const { globalSearchTerm } = useGlobalSearchTermFromContext();

  // ── Local table state ────────────────────────────────────────────────────
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: initialState?.pagination?.pageIndex ?? 0,
    pageSize: initialState?.pagination?.pageSize ?? 10,
  });

  const [sorting, setSorting] = React.useState<SortingState>(
    initialState?.sorting ?? []
  );

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    initialState?.columnFilters ?? []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {}
  );

  const debouncedSetColumnFilters = useDebouncedCallback(
    setColumnFilters,
    debounceMs
  );

  const clearFilters = React.useCallback(() => {
    setColumnFilters([]);
    resetFilters();
  }, [resetFilters]);

  // ── Combined filter function ─────────────────────────────────────────────
  // Checks both advanced column filters AND global search term.
  // Both must pass (AND logic between them).
  const globalFilterFn = React.useCallback(
    (row: Row<TData>) => {
      // 1. Global text search — check searchableColumns if term is set
      if (globalSearchTerm.trim() && searchableColumns.length > 0) {
        const term = globalSearchTerm.toLowerCase().trim();
        const matchesSearch = searchableColumns.some((colId) => {
          const cellValue = row.getValue(colId as string);
          if (cellValue == null) return false;
          // Handle arrays (e.g. qualityLevel: string[])
          if (Array.isArray(cellValue)) {
            return cellValue.some((v) =>
              String(v).toLowerCase().includes(term)
            );
          }
          return String(cellValue).toLowerCase().includes(term);
        });
        if (!matchesSearch) return false;
      }

      // 2. Advanced column filters
      if (advancedFilters.length === 0) return true;

      const filtersByColumn = advancedFilters.reduce(
        (acc, filter) => {
          const columnId = filter.id;
          if (!acc[columnId]) acc[columnId] = [];
          acc[columnId].push(filter);
          return acc;
        },
        {} as Record<string, ExtendedColumnFilter<TData>[]>
      );

      const columnResults = Object.entries(filtersByColumn).map(
        ([columnId, columnFilters]) => {
          const cellValue = row.getValue(columnId);
          const columnJoinOp = columnJoinOperators[columnId] ?? "and";
          const filterResults = columnFilters.map((filter) =>
            applyFilterOperator(cellValue, filter.value, filter.operator)
          );
          return columnJoinOp === "and"
            ? filterResults.every(Boolean)
            : filterResults.some(Boolean);
        }
      );

      return globalJoinOperator === "and"
        ? columnResults.every(Boolean)
        : columnResults.some(Boolean);
    },
    [
      advancedFilters,
      globalJoinOperator,
      columnJoinOperators,
      globalSearchTerm,
      searchableColumns,
    ]
  );

  const table = useReactTable({
    ...tableProps,
    columns,
    data: tableProps.data,
    pageCount,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: advancedFilters.length > 0 ? advancedFilters : undefined,
    },
    enableRowSelection: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    globalFilterFn: (row) => globalFilterFn(row),
  });

  return {
    table,
    clearFilters,
    debouncedSetColumnFilters,
  };
}
