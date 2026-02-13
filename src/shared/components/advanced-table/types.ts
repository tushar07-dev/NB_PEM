// src/shared/components/advanced-table/types.ts

import type { ReactNode, ComponentType } from "react";
import type { Row, Column } from "@tanstack/react-table";

// ============================================
// FILTER TYPES
// ============================================

export type FilterOperator =
  | "contains"
  | "equals"
  | "notEquals"
  | "startsWith"
  | "endsWith"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqual"
  | "lessThanOrEqual"
  | "between"
  | "before"
  | "after"
  | "in"
  | "notIn";

export interface BaseFilterConfig {
  enabled?: boolean;
  placeholder?: string;
  label?: string;
}

export interface TextFilterConfig extends BaseFilterConfig {
  type: "text";
  operators?: Array<
    "contains" | "equals" | "startsWith" | "endsWith" | "notContains"
  >;
  caseSensitive?: boolean;
  debounceMs?: number;
}

export interface SelectFilterConfig extends BaseFilterConfig {
  type: "select";
  mode?: "single" | "multi";
  options: FilterOption[];
  searchable?: boolean;
  showCount?: boolean;
}

export interface NumberFilterConfig extends BaseFilterConfig {
  type: "number";
  operators?: Array<
    "equals" | "notEquals" | "greaterThan" | "lessThan" | "between"
  >;
  min?: number;
  max?: number;
  step?: number;
}

export interface DateFilterConfig extends BaseFilterConfig {
  type: "date";
  operators?: Array<"equals" | "before" | "after" | "between">;
  format?: string;
  showTime?: boolean;
  maxDate?: Date;
  minDate?: Date;
}

export interface DateTimeFilterConfig extends BaseFilterConfig {
  type: "datetime";
  operators?: Array<"before" | "after" | "between">;
  format?: string;
  timezone?: string;
}

export interface BooleanFilterConfig extends BaseFilterConfig {
  type: "boolean";
  trueLabel?: string;
  falseLabel?: string;
  allowNull?: boolean;
}

export interface StatusFilterConfig extends BaseFilterConfig {
  type: "status";
  statuses: StatusOption[];
}

export interface RangeSliderFilterConfig extends BaseFilterConfig {
  type: "rangeSlider";
  min: number;
  max: number;
  step?: number;
  showInput?: boolean;
}

export interface TagsFilterConfig extends BaseFilterConfig {
  type: "tags";
  tags: FilterOption[];
  maxSelection?: number;
}

export interface CustomFilterConfig extends BaseFilterConfig {
  type: "custom";
  component: ComponentType<any>;
  props?: any;
}

export type FilterConfig =
  | TextFilterConfig
  | SelectFilterConfig
  | NumberFilterConfig
  | DateFilterConfig
  | DateTimeFilterConfig
  | BooleanFilterConfig
  | StatusFilterConfig
  | RangeSliderFilterConfig
  | TagsFilterConfig
  | CustomFilterConfig;

// ============================================
// OPTION TYPES
// ============================================

export interface FilterOption {
  label: string;
  value: string;
  icon?: ComponentType<{ className?: string }>;
  count?: number;
}

export interface StatusOption extends FilterOption {
  color: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
}

// ============================================
// COLUMN DEFINITION
// ============================================

export interface AdvancedColumnDef<TData> {
  id: string;
  header: string;
  accessorKey?: keyof TData;
  accessorFn?: (row: TData) => any;

  // Filter configuration
  filter?: FilterConfig;
  filterable?: boolean;

  // Sorting
  sortable?: boolean;
  sortDescFirst?: boolean;

  // Display
  cell?: (props: { row: Row<TData>; value: any }) => ReactNode;
  width?: number;
  minWidth?: number;
  maxWidth?: number;

  // Column features
  resizable?: boolean;
  pinnable?: boolean;
  hideable?: boolean;

  // Alignment
  align?: "left" | "center" | "right";

  // Custom class
  className?: string;
  headerClassName?: string;
}

// ============================================
// TABLE CONFIGURATION
// ============================================

export interface AdvancedTableConfig {
  // Features
  enableFilters?: boolean;
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableSelection?: boolean;
  enableColumnVisibility?: boolean;
  enableRowExpansion?: boolean;
  stickyHeader?: boolean;

  // Row interactions
  enableRowClick?: boolean;
  enableRowHover?: boolean;

  // Pagination
  defaultPageSize?: number;
  pageSizeOptions?: number[];

  // Styling
  rowHeight?: "compact" | "default" | "comfortable";
  density?: "compact" | "default" | "comfortable";
  striped?: boolean;

  // Loading state
  loading?: boolean;
  loadingRows?: number;
}

// ============================================
// TABLE PROPS
// ============================================

export interface AdvancedTableProps<TData> extends AdvancedTableConfig {
  // Required
  data: TData[];
  columns: AdvancedColumnDef<TData>[];

  // Optional callbacks
  onRowClick?: (row: Row<TData>) => void;
  onRowDoubleClick?: (row: Row<TData>) => void;
  onSelectionChange?: (selectedRows: TData[]) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  onSortChange?: (sorting: SortingState) => void;
  onPaginationChange?: (pagination: PaginationState) => void;

  // Custom components
  emptyState?: ReactNode;
  loadingState?: ReactNode;

  // Styling
  className?: string;
  rowClassName?: string | ((row: Row<TData>) => string);

  // Row key
  getRowId?: (row: TData) => string;
}

// ============================================
// STATE TYPES
// ============================================

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface SortingState {
  id: string;
  desc: boolean;
}
[];

export interface FilterState {
  id: string;
  value: any;
}
[];

export interface ColumnVisibilityState {
  [key: string]: boolean;
}

// ============================================
// MODAL TYPES
// ============================================

export interface ModalConfig<TData> {
  title?: string;
  content: ComponentType<{ row: Row<TData>; onClose: () => void }>;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOutsideClick?: boolean;
}

// ============================================
// FILTER VALUE TYPES
// ============================================

export interface TextFilterValue {
  operator: "contains" | "equals" | "startsWith" | "endsWith" | "notContains";
  value: string;
  caseSensitive?: boolean;
}

export interface NumberFilterValue {
  operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "between";
  value: number | [number, number];
}

export interface DateFilterValue {
  operator: "equals" | "before" | "after" | "between";
  value: Date | [Date, Date];
}

export interface SelectFilterValue {
  values: string[];
}

export type FilterValue =
  | TextFilterValue
  | NumberFilterValue
  | DateFilterValue
  | SelectFilterValue
  | boolean
  | string
  | number
  | any;

// ============================================
// API INTEGRATION TYPES (for future)
// ============================================

export interface ServerSideConfig {
  enabled: boolean;
  onFetchData?: (state: TableServerState) => Promise<ServerResponse<any>>;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
}

export interface TableServerState {
  pagination: PaginationState;
  sorting: SortingState;
  filters: FilterState;
  globalFilter?: string;
}

export interface ServerResponse<TData> {
  data: TData[];
  pageCount: number;
  rowCount: number;
}

// ============================================
// UTILITY TYPES
// ============================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];
