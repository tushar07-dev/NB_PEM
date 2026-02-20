import { vi } from "vitest";
import type { Table, Column, HeaderGroup, Row } from "@tanstack/react-table";

export interface MockTableOptions<TData> {
  rows?: TData[];
  pageIndex?: number;
  pageSize?: number;
  pageCount?: number;
  canPreviousPage?: boolean;
  canNextPage?: boolean;
  columnFiltersLength?: number;
  selectedRowCount?: number;
  columns?: Partial<Column<TData>>[];
}

export function createMockColumn<TData>(
  overrides: Partial<Column<TData>> = {}
): Column<TData> {
  return {
    id: "test-column",
    getFilterValue: vi.fn().mockReturnValue(undefined),
    setFilterValue: vi.fn(),
    getCanFilter: vi.fn().mockReturnValue(true),
    getCanSort: vi.fn().mockReturnValue(true),
    getCanHide: vi.fn().mockReturnValue(true),
    getIsLastColumn: vi.fn().mockReturnValue(false),
    getIsFirstColumn: vi.fn().mockReturnValue(false),
    getIsPinned: vi.fn().mockReturnValue(false),
    getStart: vi.fn().mockReturnValue(0),
    getAfter: vi.fn().mockReturnValue(0),
    getSize: vi.fn().mockReturnValue(150),
    getIsSorted: vi.fn().mockReturnValue(false),
    getIsVisible: vi.fn().mockReturnValue(true),
    toggleSorting: vi.fn(),
    clearSorting: vi.fn(),
    toggleVisibility: vi.fn(),
    getFacetedMinMaxValues: vi.fn().mockReturnValue([0, 100]),
    accessorFn: () => "",
    columnDef: {
      meta: { label: "Test Column", variant: "text" },
      enableColumnFilter: true,
    },
    ...overrides,
  } as unknown as Column<TData>;
}

export function createMockTable<TData extends object>(
  options: MockTableOptions<TData> = {}
): Table<TData> {
  const {
    rows = [],
    pageIndex = 0,
    pageSize = 10,
    pageCount = 1,
    canPreviousPage = false,
    canNextPage = false,
    columnFiltersLength = 0,
    selectedRowCount = 0,
    columns = [],
  } = options;

  const mockRows = rows.map((original, index) => ({
    id: String(index),
    original,
    getIsSelected: vi.fn().mockReturnValue(false),
    getVisibleCells: vi.fn().mockReturnValue([]),
  })) as unknown as Row<TData>[];

  const mockColumns: Column<TData>[] =
    columns.length > 0
      ? (columns as Column<TData>[])
      : [createMockColumn<TData>()];

  const mockHeaderGroups: HeaderGroup<TData>[] = [
    {
      id: "header-group-0",
      depth: 0,
      headers: mockColumns.map((col) => ({
        id: col.id,
        colSpan: 1,
        isPlaceholder: false,
        column: col,
        getContext: vi.fn().mockReturnValue({}),
      })),
    } as unknown as HeaderGroup<TData>,
  ];

  return {
    getState: vi.fn().mockReturnValue({
      pagination: { pageIndex, pageSize },
      columnFilters: Array(columnFiltersLength).fill({}),
      rowSelection: {},
      sorting: [],
    }),
    getPageCount: vi.fn().mockReturnValue(pageCount),
    getCanPreviousPage: vi.fn().mockReturnValue(canPreviousPage),
    getCanNextPage: vi.fn().mockReturnValue(canNextPage),
    setPageIndex: vi.fn(),
    setPageSize: vi.fn(),
    resetColumnFilters: vi.fn(),
    setSorting: vi.fn(),
    initialState: { sorting: [] },
    getFilteredRowModel: vi.fn().mockReturnValue({ rows: mockRows }),
    getFilteredSelectedRowModel: vi.fn().mockReturnValue({
      rows: mockRows.slice(0, selectedRowCount),
    }),
    getRowModel: vi.fn().mockReturnValue({ rows: mockRows }),
    getAllColumns: vi.fn().mockReturnValue(mockColumns),
    getHeaderGroups: vi.fn().mockReturnValue(mockHeaderGroups),
  } as unknown as Table<TData>;
}
