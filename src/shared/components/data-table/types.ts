import type { Column } from "@tanstack/react-table";

// Generic table state management
export interface DataTableState {
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  sorting: {
    id: string;
    desc: boolean;
  }[];
  columnFilters: {
    id: string;
    value: unknown;
  }[];
  globalFilter: string;
  rowSelection: Record<string, boolean>;
  columnVisibility: Record<string, boolean>;
}

// Generic paginated response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  pageCount: number;
}

// Filter option type
export interface FilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

// Filter field configuration
export interface DataTableFilterField<TData> {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: FilterOption[];
}

// Search config
export interface DataTableSearchableColumn<TData> {
  id: keyof TData;
  title: string;
}

// Toolbar props
export interface DataTableToolbarProps<TData> {
  table: any; // TanStack Table instance
  filterFields?: DataTableFilterField<TData>[];
  searchableColumns?: DataTableSearchableColumn<TData>[];
}

// Faceted filter props
export interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: FilterOption[];
}
