import type { Column } from "@tanstack/react-table";
import { dataTableConfig } from "@/shared/config/data-table";
import type {
  ExtendedColumnFilter,
  FilterOperator,
  FilterVariant,
} from "@/shared/types/data-table";

export function getColumnPinningStyle<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>;
  withBorder?: boolean;
}): React.CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  return {
    boxShadow: withBorder
      ? isLastLeftPinnedColumn
        ? "-4px 0 4px -4px var(--border) inset"
        : isFirstRightPinnedColumn
          ? "4px 0 4px -4px var(--border) inset"
          : undefined
      : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? "sticky" : "relative",
    // background: isPinned ? "var(--background)" : "var(--background)",
    width: column.getSize(),
    zIndex: isPinned ? 1 : undefined,
  };
}

export function getFilterOperators(filterVariant: FilterVariant) {
  const operatorMap: Record<
    FilterVariant,
    { label: string; value: FilterOperator }[]
  > = {
    text: dataTableConfig.textOperators,
    number: dataTableConfig.numericOperators,
    range: dataTableConfig.numericOperators,
    date: dataTableConfig.dateOperators,
    dateRange: dataTableConfig.dateOperators,
    boolean: dataTableConfig.booleanOperators,
    select: dataTableConfig.selectOperators,
    multiSelect: dataTableConfig.multiSelectOperators,
  };

  return operatorMap[filterVariant] ?? dataTableConfig.textOperators;
}

export function getDefaultFilterOperator(filterVariant: FilterVariant) {
  const operators = getFilterOperators(filterVariant);

  return operators[0]?.value ?? (filterVariant === "text" ? "iLike" : "eq");
}

export function getValidFilters<TData>(
  filters: ExtendedColumnFilter<TData>[]
): ExtendedColumnFilter<TData>[] {
  return filters.filter(
    (filter) =>
      filter.operator === "isEmpty" ||
      filter.operator === "isNotEmpty" ||
      (Array.isArray(filter.value)
        ? filter.value.length > 0
        : filter.value !== "" &&
          filter.value !== null &&
          filter.value !== undefined)
  );
}

/**
 * Apply a filter operator to compare cell value against filter value.
 * Centralized logic for all filter operations.
 */
export function applyFilterOperator(
  cellValue: unknown,
  filterValue: string | string[],
  operator: string
): boolean {
  // Handle empty/not empty operators
  if (operator === "isEmpty") {
    return cellValue === null || cellValue === undefined || cellValue === "";
  }
  if (operator === "isNotEmpty") {
    return cellValue !== null && cellValue !== undefined && cellValue !== "";
  }

  // Convert cell value to string for text comparisons
  const stringValue = cellValue?.toString().toLowerCase() ?? "";
  const filterStr = Array.isArray(filterValue)
    ? (filterValue[0]?.toLowerCase() ?? "")
    : filterValue.toLowerCase();

  switch (operator) {
    case "iLike":
    case "contains":
      return stringValue.includes(filterStr);

    case "notILike":
    case "notContains":
      return !stringValue.includes(filterStr);

    case "eq":
    case "equals":
      return stringValue === filterStr;

    case "notEq":
    case "notEquals":
      return stringValue !== filterStr;

    case "startsWith":
      return stringValue.startsWith(filterStr);

    case "endsWith":
      return stringValue.endsWith(filterStr);

    case "gt":
      return Number(cellValue) > Number(filterStr);

    case "gte":
      return Number(cellValue) >= Number(filterStr);

    case "lt":
      return Number(cellValue) < Number(filterStr);

    case "lte":
      return Number(cellValue) <= Number(filterStr);

    case "isBetween":
      if (Array.isArray(filterValue) && filterValue.length === 2) {
        const num = Number(cellValue);
        return num >= Number(filterValue[0]) && num <= Number(filterValue[1]);
      }
      return true;

    case "isRelativeToToday":
      // Handle date comparisons for "last 7 days", etc.
      if (Array.isArray(filterValue) && filterValue.length === 2) {
        const cellDate = new Date(cellValue as string);
        const now = new Date();
        const daysAgo = new Date(
          now.setDate(now.getDate() - Number(filterValue[0]))
        );
        const daysAhead = new Date(
          new Date().setDate(new Date().getDate() + Number(filterValue[1]))
        );
        return cellDate >= daysAgo && cellDate <= daysAhead;
      }
      return true;

    case "inArray":
      if (Array.isArray(filterValue)) {
        return filterValue.some((v) => v.toLowerCase() === stringValue);
      }
      return filterStr === stringValue;

    case "notInArray":
      if (Array.isArray(filterValue)) {
        return !filterValue.some((v) => v.toLowerCase() === stringValue);
      }
      return filterStr !== stringValue;

    default:
      return stringValue.includes(filterStr);
  }
}
