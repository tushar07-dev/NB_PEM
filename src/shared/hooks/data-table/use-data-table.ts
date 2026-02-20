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
import { useFilterStore } from "@/shared/store/filter-store";
import { applyFilterOperator } from "@/shared/lib/data-table/data-table";
import type {
  ExtendedColumnFilter,
  ExtendedColumnSort,
} from "@/shared/types/data-table";

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
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    columns,
    pageCount = -1,
    initialState,
    debounceMs = DEBOUNCE_MS,
    ...tableProps
  } = props;

  // Get filters from Zustand store
  const advancedFilters = useFilterStore(
    (state) => state.filters
  ) as ExtendedColumnFilter<TData>[];
  const globalJoinOperator = useFilterStore(
    (state) => state.globalJoinOperator
  );
  const columnJoinOperators = useFilterStore(
    (state) => state.columnJoinOperators
  );
  const resetFilters = useFilterStore((state) => state.resetFilters);

  // Pagination state
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: initialState?.pagination?.pageIndex ?? 0,
    pageSize: initialState?.pagination?.pageSize ?? 10,
  });

  // Sorting state
  const [sorting, setSorting] = React.useState<SortingState>(
    initialState?.sorting ?? []
  );

  // Column filters state (for basic toolbar filters)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    initialState?.columnFilters ?? []
  );

  // Column visibility state
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

  // Row selection state
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {}
  );

  // Debounced filter setter
  const debouncedSetColumnFilters = useDebouncedCallback(
    setColumnFilters,
    debounceMs
  );

  // Clear all filters handler
  const clearFilters = React.useCallback(() => {
    setColumnFilters([]);
    resetFilters();
  }, [resetFilters]);

  // Global filter function that applies advanced filters from Zustand
  const globalFilterFn = React.useCallback(
    (row: Row<TData>) => {
      if (advancedFilters.length === 0) return true;

      // Group filters by column
      const filtersByColumn = advancedFilters.reduce(
        (acc, filter) => {
          const columnId = filter.id;
          if (!acc[columnId]) acc[columnId] = [];
          acc[columnId].push(filter);
          return acc;
        },
        {} as Record<string, ExtendedColumnFilter<TData>[]>
      );

      // Evaluate each column's filters with per-column join operator
      const columnResults = Object.entries(filtersByColumn).map(
        ([columnId, columnFilters]) => {
          const cellValue = row.getValue(columnId);
          const columnJoinOp = columnJoinOperators[columnId] ?? "and";

          const filterResults = columnFilters.map((filter) =>
            applyFilterOperator(cellValue, filter.value, filter.operator)
          );

          // Apply per-column join operator
          if (columnJoinOp === "and") {
            return filterResults.every(Boolean);
          } else {
            return filterResults.some(Boolean);
          }
        }
      );

      // Combine column results with global join operator
      if (globalJoinOperator === "and") {
        return columnResults.every(Boolean);
      } else {
        return columnResults.some(Boolean);
      }
    },
    [advancedFilters, globalJoinOperator, columnJoinOperators]
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
