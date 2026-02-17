"use client";

import { useTableActions, useTableState } from "@/shared/store/tableStore";
import type { ExtendedColumnSort } from "@/shared/types/data-table";
import {
  // type ColumnFiltersState,
  type ExpandedState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import * as React from "react";
// import { useDebouncedCallback } from "../use-debounced-callback";

// const ARRAY_SEPARATOR = ",";
const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;

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
  state?: {
    expanded?: ExpandedState;
  };
  history?: "push" | "replace";
  debounceMs?: number;
  throttleMs?: number;
  clearOnDefault?: boolean;
  enableAdvancedFilter?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  tableid: string;

  startTransition?: React.TransitionStartFunction;
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    columns,
    pageCount = -1,
    initialState,
    // history = "replace",
    debounceMs = DEBOUNCE_MS,
    throttleMs = THROTTLE_MS,
    // clearOnDefault = false,
    // enableAdvancedFilter = true,
    // scroll = false,
    shallow = true,
    state,
    // startTransition,
    ...tableProps
  } = props;

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {}
  );

  const { setPage, setPerPage, setSorting, setColumnVisibility } =
    useTableActions<TData>(props.tableid);
  const { page, perPage, sorting, columnVisibility } = useTableState<TData>(
    props.tableid
  );

  const pagination: PaginationState = React.useMemo(() => {
    return {
      pageIndex: page - 1, // zero-based index -> one-based index
      pageSize: perPage,
    };
  }, [page, perPage]);

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === "function") {
        const newPagination = updaterOrValue(pagination);
        setPage(newPagination.pageIndex + 1);
        setPerPage(newPagination.pageSize);
      } else {
        setPage(updaterOrValue.pageIndex + 1);
        setPerPage(updaterOrValue.pageSize);
      }
    },
    [pagination, setPage, setPerPage]
  );

  // const columnIds = React.useMemo(() => {
  //   return new Set(
  //     columns?.map((column) => column.id).filter(Boolean) as string[]
  //   );
  // }, [columns]);

  // console.log({ columnIds });

  // const [columnVisibility, setColumnVisibility] = useQueryState(
  //   COLUMN_VISIBLITY_KEY,
  //   getColumnVisibilityStateParser(columnIds)
  //     .withOptions(queryStateOptions)
  //     .withDefault(
  //       initialState?.columnVisibility ?? ({} as Record<string, boolean>)
  //     )
  // );

  function onColumnVisibilityChange(updaterOrValue: Updater<VisibilityState>) {
    if (typeof updaterOrValue === "function") {
      const newVisibility = updaterOrValue(columnVisibility);
      setColumnVisibility(newVisibility);
    } else {
      setColumnVisibility(updaterOrValue);
    }
  }

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === "function") {
        const newSorting = updaterOrValue(sorting);
        setSorting(newSorting as ExtendedColumnSort<TData>[]);
      } else {
        setSorting(updaterOrValue as ExtendedColumnSort<TData>[]);
      }
    },
    [sorting, setSorting]
  );

  // const filterableColumns = React.useMemo(() => {
  //   if (enableAdvancedFilter) return [];

  //   return columns.filter((column) => column.enableColumnFilter);
  // }, [columns, enableAdvancedFilter]);

  // const buildFilterUpdates = React.useCallback(
  //   (next: ColumnFiltersState, prev: ColumnFiltersState) => {
  //     const filterUpdates = next.reduce<
  //       Record<string, string | string[] | null>
  //     >((acc, filter) => {
  //       const isFilterable = filterableColumns.some(
  //         (column) => column.id === filter.id
  //       );
  //       if (isFilterable) {
  //         acc[filter.id] = filter.value as string | string[];
  //       }
  //       return acc;
  //     }, {});

  //     // Handle removed filters
  //     for (const prevFilter of prev) {
  //       const isRemoved = !next.some((filter) => filter.id === prevFilter.id);
  //       if (isRemoved) {
  //         filterUpdates[prevFilter.id] = null;
  //       }
  //     }

  //     return filterUpdates;
  //   },
  //   [filterableColumns]
  // );

  React.useEffect(() => {
    setColumnVisibility(initialState?.columnVisibility ?? {});
  }, [initialState?.columnVisibility, setColumnVisibility]);

  const table = useReactTable({
    ...tableProps,
    columns,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      ...state,
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
    },
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;

      setRowSelection(newSelection);
    },
    onPaginationChange,
    onSortingChange,
    onColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return { table, shallow, debounceMs, throttleMs };
}
