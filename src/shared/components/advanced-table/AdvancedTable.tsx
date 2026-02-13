// src/shared/components/advanced-table/AdvancedTable.tsx

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { AdvancedColumnHeader } from "./AdvancedColumnHeader";
import { AdvancedTablePagination } from "./AdvancedTablePagination";
import { AdvancedTableToolbar } from "./AdvancedTableToolbar";
import { getFilterFn } from "./utils/filterUtils";
import type { AdvancedTableProps, AdvancedColumnDef } from "./types";
import { cn } from "@/lib/utils";

export function AdvancedTable<TData extends Record<string, any>>({
  data,
  columns: columnDefs,

  // Features
  enableFilters = true,
  enableSorting = true,
  enablePagination = true,
  enableColumnVisibility = false,
  stickyHeader = true,

  // Row interactions
  enableRowClick = false,
  enableRowHover = true,
  onRowClick,
  onRowDoubleClick,

  // Pagination
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 30, 50, 100],

  // Styling
  rowHeight = "default",
  density = "default",
  striped = false,
  className,
  rowClassName,

  // Custom states
  emptyState,
  loadingState,
  loading = false,

  // Callbacks
  onFilterChange,
  onSortChange,
  onPaginationChange,

  // Row key
  getRowId,
}: AdvancedTableProps<TData>) {
  // Convert column defs to TanStack format
  const columns = useMemo<ColumnDef<TData>[]>(() => {
    return columnDefs.map((col: AdvancedColumnDef<TData>) => ({
      id: col.id,
      accessorKey: col.accessorKey,
      accessorFn: col.accessorFn,

      header: ({ column }) => (
        <AdvancedColumnHeader
          column={column}
          columnDef={col}
          title={col.header}
        />
      ),

      cell: col.cell
        ? ({ row, getValue }) => col.cell!({ row, value: getValue() })
        : ({ getValue }) => <div>{String(getValue() ?? "")}</div>,

      enableSorting: col.sortable !== false && enableSorting,
      enableColumnFilter:
        col.filterable !== false && enableFilters && !!col.filter,
      enableHiding: col.hideable !== false,

      // Custom filter function based on filter type
      filterFn: col.filter
        ? (row, columnId, filterValue) => {
            const value = row.getValue(columnId);
            const filterFn = getFilterFn(col.filter!.type);
            return filterFn(value, filterValue);
          }
        : undefined,

      size: col.width,
      minSize: col.minWidth,
      maxSize: col.maxWidth,

      meta: {
        align: col.align,
        className: col.className,
      },
    }));
  }, [columnDefs, enableSorting, enableFilters]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },

    getRowId: getRowId,

    // Callbacks
    onColumnFiltersChange: (updater) => {
      if (onFilterChange) {
        const newFilters =
          typeof updater === "function"
            ? updater(table.getState().columnFilters)
            : updater;
        const filtersObj = newFilters.reduce(
          (acc, filter) => ({ ...acc, [filter.id]: filter.value }),
          {}
        );
        onFilterChange(filtersObj);
      }
    },

    onSortingChange: (updater) => {
      if (onSortChange) {
        const newSorting =
          typeof updater === "function"
            ? updater(table.getState().sorting)
            : updater;
        onSortChange(newSorting as any);
      }
    },

    onPaginationChange: (updater) => {
      if (onPaginationChange) {
        const newPagination =
          typeof updater === "function"
            ? updater(table.getState().pagination)
            : updater;
        onPaginationChange(newPagination);
      }
    },
  });

  const densityClasses = {
    compact: "text-xs",
    default: "text-sm",
    comfortable: "text-base",
  };

  const rowHeightClasses = {
    compact: "h-8",
    default: "h-12",
    comfortable: "h-16",
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      {enableColumnVisibility && <AdvancedTableToolbar table={table} />}

      {/* Table */}
      <div className="rounded-md border">
        <div className="relative overflow-auto">
          <Table>
            <TableHeader
              className={cn(stickyHeader && "bg-background sticky top-0 z-10")}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        minWidth: header.column.columnDef.minSize,
                        maxWidth: header.column.columnDef.maxSize,
                      }}
                      className={cn(
                        densityClasses[density],
                        (header.column.columnDef.meta as any)?.align ===
                          "center" && "text-center",
                        (header.column.columnDef.meta as any)?.align ===
                          "right" && "text-right"
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading
                ? // Loading state
                  loadingState || (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                          <span className="text-muted-foreground">
                            Loading...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                : table.getRowModel().rows?.length
                  ? table.getRowModel().rows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        onClick={() => enableRowClick && onRowClick?.(row)}
                        onDoubleClick={() => onRowDoubleClick?.(row)}
                        className={cn(
                          rowHeightClasses[rowHeight],
                          densityClasses[density],
                          enableRowClick && "cursor-pointer",
                          enableRowHover && "hover:bg-muted/50",
                          striped && index % 2 === 0 && "bg-muted/20",
                          typeof rowClassName === "function"
                            ? rowClassName(row)
                            : rowClassName
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            style={{
                              width: cell.column.getSize(),
                            }}
                            className={cn(
                              (cell.column.columnDef.meta as any)?.className,
                              (cell.column.columnDef.meta as any)?.align ===
                                "center" && "text-center",
                              (cell.column.columnDef.meta as any)?.align ===
                                "right" && "text-right"
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : // Empty state
                    emptyState || (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          <div className="text-muted-foreground">
                            No results found.
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {enablePagination && !loading && (
        <AdvancedTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}
