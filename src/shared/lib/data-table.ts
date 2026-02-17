import type {
  ExtendedColumnFilter,
  FilterOperator,
  FilterVariant,
} from "@/shared/types/data-table";
import type { Column, Row } from "@tanstack/react-table";

import { dataTableConfig } from "@/shared/config/data-table";
import React from "react";

export function getCommonPinningStyles<TData>({
  column,
}: {
  column: Column<TData>;
  index?: number;
}): React.CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");

  const boxShadow = isLastLeftPinnedColumn
    ? "-10px 0 0px -2px var(--background) inset"
    : undefined;

  return {
    boxShadow: boxShadow,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    zIndex: isPinned ? 1 : 0,
    width: column.getSize(),
    minWidth: isPinned ? column.getSize() : undefined,
    maxWidth: isPinned || column.getCanResize() ? column.getSize() : undefined,

    // border: withBorder ? "1px solid var(--border)" : undefined,
  };
}

export function getCommonCellStyles<TData>({
  index,
  noOfCells,
  withBorder = false,
  column,
  setOfSearchIds,
  row,
}: {
  index: number;
  noOfCells: number;
  withBorder?: boolean;
  setOfSearchIds?: Set<string>;
  column: Column<TData>;
  row: Row<TData>;
}): React.CSSProperties {
  const boxShadow =
    index === noOfCells - 1
      ? " inset 1px 0 0 0 black, inset 0 -1px 0 0 black, inset -1px 0 0 0 black"
      : ` inset 1px 0 0 0 black, inset 0 -1px 0 0 black`;

  const obj: React.CSSProperties = {
    minWidth: column.columnDef.minSize || -Infinity,
    maxWidth:
      column.columnDef.maxSize === 9007199254740991
        ? 300
        : column.columnDef.maxSize,
  };

  if (withBorder) {
    obj.boxShadow = boxShadow;
  }
  if (setOfSearchIds && setOfSearchIds.has(row.id)) {
    obj.backgroundColor = "var(--secondary-100)";
  }

  return obj;
}

export function getCommonRowStyles<TData>({
  row,
  setOfSearchIds,
}: {
  row: Row<TData>;
  setOfSearchIds?: Set<string>;
}): React.CSSProperties {
  const obj: React.CSSProperties = {};
  if (setOfSearchIds && setOfSearchIds.has(row.id)) {
    obj.backgroundColor = "var(--secondary-100)";
  }

  return obj;
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
