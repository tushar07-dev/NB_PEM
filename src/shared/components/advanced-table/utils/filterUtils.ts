// src/shared/components/advanced-table/utils/filterUtils.ts

import type {
  FilterValue,
  TextFilterValue,
  NumberFilterValue,
  DateFilterValue,
  SelectFilterValue,
} from "../types";

// ============================================
// FILTER FUNCTIONS
// ============================================

/**
 * Text filter function
 */
export function textFilter(
  rowValue: any,
  filterValue: TextFilterValue | string
): boolean {
  if (!rowValue) return false;

  const value = String(rowValue);

  // Simple string filter
  if (typeof filterValue === "string") {
    return value.toLowerCase().includes(filterValue.toLowerCase());
  }

  // Advanced text filter
  const { operator, value: searchValue, caseSensitive } = filterValue;
  const compareValue = caseSensitive ? value : value.toLowerCase();
  const compareSearch = caseSensitive ? searchValue : searchValue.toLowerCase();

  switch (operator) {
    case "contains":
      return compareValue.includes(compareSearch);
    case "equals":
      return compareValue === compareSearch;
    case "startsWith":
      return compareValue.startsWith(compareSearch);
    case "endsWith":
      return compareValue.endsWith(compareSearch);
    case "notContains":
      return !compareValue.includes(compareSearch);
    default:
      return true;
  }
}

/**
 * Number filter function
 */
export function numberFilter(
  rowValue: any,
  filterValue: NumberFilterValue | number
): boolean {
  const value = Number(rowValue);
  if (isNaN(value)) return false;

  // Simple number filter
  if (typeof filterValue === "number") {
    return value === filterValue;
  }

  // Advanced number filter
  const { operator, value: filterNum } = filterValue;

  switch (operator) {
    case "equals":
      return value === filterNum;
    case "notEquals":
      return value !== filterNum;
    case "greaterThan":
      return value > (filterNum as number);
    case "lessThan":
      return value < (filterNum as number);
    case "between":
      if (Array.isArray(filterNum)) {
        return value >= filterNum[0] && value <= filterNum[1];
      }
      return false;
    default:
      return true;
  }
}

/**
 * Date filter function
 */
export function dateFilter(
  rowValue: any,
  filterValue: DateFilterValue | Date
): boolean {
  const value = new Date(rowValue);
  if (isNaN(value.getTime())) return false;

  // Simple date filter
  if (filterValue instanceof Date) {
    return value.toDateString() === filterValue.toDateString();
  }

  // Advanced date filter
  const { operator, value: filterDate } = filterValue;

  switch (operator) {
    case "equals":
      return value.toDateString() === (filterDate as Date).toDateString();
    case "before":
      return value < (filterDate as Date);
    case "after":
      return value > (filterDate as Date);
    case "between":
      if (Array.isArray(filterDate)) {
        return value >= filterDate[0] && value <= filterDate[1];
      }
      return false;
    default:
      return true;
  }
}

/**
 * Select filter function (multi-select)
 */
export function selectFilter(
  rowValue: any,
  filterValue: SelectFilterValue | string[]
): boolean {
  if (!filterValue) return true;

  const values = Array.isArray(filterValue) ? filterValue : filterValue.values;

  if (!values || values.length === 0) return true;

  return values.includes(String(rowValue));
}

/**
 * Boolean filter function
 */
export function booleanFilter(rowValue: any, filterValue: boolean): boolean {
  return Boolean(rowValue) === filterValue;
}

/**
 * Status filter function
 */
export function statusFilter(rowValue: any, filterValue: string[]): boolean {
  if (!filterValue || filterValue.length === 0) return true;
  return filterValue.includes(String(rowValue));
}

/**
 * Tags filter function (for multi-tag fields)
 */
export function tagsFilter(rowValue: any[], filterValue: string[]): boolean {
  if (!filterValue || filterValue.length === 0) return true;
  if (!Array.isArray(rowValue)) return false;

  return filterValue.some((tag) => rowValue.includes(tag));
}

// ============================================
// FILTER HELPERS
// ============================================

/**
 * Get filter function based on filter type
 */
export function getFilterFn(filterType: string) {
  switch (filterType) {
    case "text":
      return textFilter;
    case "number":
    case "rangeSlider":
      return numberFilter;
    case "date":
    case "datetime":
      return dateFilter;
    case "select":
    case "status":
      return selectFilter;
    case "boolean":
      return booleanFilter;
    case "tags":
      return tagsFilter;
    default:
      return () => true;
  }
}

/**
 * Check if filter has active value
 */
export function hasActiveFilter(filterValue: FilterValue): boolean {
  if (filterValue === null || filterValue === undefined) return false;

  if (typeof filterValue === "string") return filterValue.length > 0;
  if (typeof filterValue === "number") return true;
  if (typeof filterValue === "boolean") return true;

  if (Array.isArray(filterValue)) return filterValue.length > 0;

  if (typeof filterValue === "object") {
    if ("values" in filterValue) {
      return filterValue.values && filterValue.values.length > 0;
    }
    if ("value" in filterValue) {
      return filterValue.value !== null && filterValue.value !== undefined;
    }
  }

  return false;
}

/**
 * Clear filter value
 */
export function clearFilterValue(filterType: string): FilterValue {
  switch (filterType) {
    case "text":
      return { operator: "contains", value: "", caseSensitive: false };
    case "number":
      return { operator: "equals", value: 0 };
    case "date":
    case "datetime":
      return { operator: "equals", value: new Date() };
    case "select":
    case "status":
    case "tags":
      return { values: [] };
    case "boolean":
      return false;
    default:
      return null;
  }
}

/**
 * Format filter value for display
 */
export function formatFilterValue(
  filterValue: FilterValue,
  filterType: string
): string {
  if (!hasActiveFilter(filterValue)) return "";

  switch (filterType) {
    case "text":
      if (typeof filterValue === "string") return filterValue;
      return (filterValue as TextFilterValue).value;

    case "number":
      if (typeof filterValue === "number") return String(filterValue);
      const numFilter = filterValue as NumberFilterValue;
      if (numFilter.operator === "between" && Array.isArray(numFilter.value)) {
        return `${numFilter.value[0]} - ${numFilter.value[1]}`;
      }
      return String(numFilter.value);

    case "date":
    case "datetime":
      if (filterValue instanceof Date) {
        return filterValue.toLocaleDateString();
      }
      const dateFilter = filterValue as DateFilterValue;
      if (
        dateFilter.operator === "between" &&
        Array.isArray(dateFilter.value)
      ) {
        return `${dateFilter.value[0].toLocaleDateString()} - ${dateFilter.value[1].toLocaleDateString()}`;
      }
      return (dateFilter.value as Date).toLocaleDateString();

    case "select":
    case "status":
    case "tags":
      const values = Array.isArray(filterValue)
        ? filterValue
        : (filterValue as SelectFilterValue).values;
      return values.length > 2
        ? `${values.length} selected`
        : values.join(", ");

    case "boolean":
      return filterValue ? "Yes" : "No";

    default:
      return String(filterValue);
  }
}
