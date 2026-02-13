// src/shared/components/advanced-table/index.ts

// Main component
export { AdvancedTable } from "./AdvancedTable";

// Sub-components
export { AdvancedColumnHeader } from "./AdvancedColumnHeader";
export { AdvancedTablePagination } from "./AdvancedTablePagination";
export { AdvancedTableToolbar } from "./AdvancedTableToolbar";

// Filters
export { TextFilter } from "./filters/TextFilter";
export { SelectFilter } from "./filters/SelectFilter";
export { NumberFilter } from "./filters/NumberFilter";
export { DateFilter } from "./filters/DateFilter";

// Modals
export { TableModal } from "./modals/TableModal";

// Utils
export * from "./utils/filterUtils";

// Types
export type {
  AdvancedTableProps,
  AdvancedColumnDef,
  AdvancedTableConfig,
  FilterConfig,
  TextFilterConfig,
  SelectFilterConfig,
  NumberFilterConfig,
  DateFilterConfig,
  DateTimeFilterConfig,
  BooleanFilterConfig,
  StatusFilterConfig,
  RangeSliderFilterConfig,
  TagsFilterConfig,
  CustomFilterConfig,
  FilterOption,
  StatusOption,
  FilterValue,
  TextFilterValue,
  NumberFilterValue,
  DateFilterValue,
  SelectFilterValue,
  PaginationState,
  SortingState,
  FilterState,
  ColumnVisibilityState,
  ModalConfig,
  ServerSideConfig,
  TableServerState,
  ServerResponse,
} from "./types";
