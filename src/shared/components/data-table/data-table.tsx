import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import * as React from "react";

import { DataTablePagination } from "@/shared/components/data-table/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getColumnPinningStyle } from "@/shared/lib/data-table/data-table";
import { cn } from "@/shared/lib/utils";
import { useDragClickGuard } from "@/shared/hooks/data-table/use-drag-click-guard";
interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  /** Pagination variant: "default" or "simple" (Showing X To Y Of Z Entries) */
  paginationVariant?: "default" | "simple";
  /** Show/hide rows per page dropdown */
  showRowsPerPage?: boolean;
  /** Show/hide selected row count */
  showSelectedCount?: boolean;
  /** Show numbered page buttons */
  showPageNumbers?: boolean;
  /** Callback when a row is clicked */
  onRowClick?: (row: TData) => void;
  /** Custom empty state when no data */
  emptyState?: React.ReactNode;
  /** Show loading skeleton */
  loading?: boolean;
  /** Number of skeleton rows to show when loading */
  loadingRowCount?: number;
  /** Custom className for the table element */
  tableClassName?: string;
  /** Custom className for header rows */
  headerClassName?: string;
  /** Custom className for body rows (function receives row data) */
  rowClassName?: string | ((row: TData) => string);
  /** Page size options for pagination dropdown */
  pageSizeOptions?: number[];
  /** Callback when row selection changes */
  onSelectionChange?: (selectedRows: TData[]) => void;
  /** Make table header sticky on scroll */
  stickyHeader?: boolean;
  /** Show "Go to page" input in pagination */
  showGoToPage?: boolean;
}

export function DataTable<TData>({
  // ...existing code...
  table,
  actionBar,
  children,
  className,
  paginationVariant = "simple",
  showRowsPerPage = false,
  showSelectedCount = false,
  showPageNumbers = true,
  onRowClick,
  emptyState,
  loading = false,
  loadingRowCount = 5,
  tableClassName,
  headerClassName,
  rowClassName,
  pageSizeOptions,
  onSelectionChange,
  stickyHeader = false,
  showGoToPage = false,
  ...props
}: DataTableProps<TData>) {
  // Track selection changes
  const selectedRowsRef = React.useRef<string[]>([]);
  const { onMouseDown, isDrag } = useDragClickGuard();
  const rowSelection = table.getState().rowSelection;
  React.useEffect(() => {
    if (!onSelectionChange) return;

    const selectedRowIds = Object.keys(rowSelection);
    const prevSelectedIds = selectedRowsRef.current;

    // Only call if selection actually changed
    if (
      selectedRowIds.length !== prevSelectedIds.length ||
      !selectedRowIds.every((id) => prevSelectedIds.includes(id))
    ) {
      selectedRowsRef.current = selectedRowIds;
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, table]);

  // Get row className (supports string or function)
  const getRowClassName = (row: TData) => {
    if (typeof rowClassName === "function") {
      return rowClassName(row);
    }
    return rowClassName ?? "";
  };

  // Render loading skeleton
  const renderLoadingSkeleton = () => {
    const columnCount = table.getAllColumns().length;
    return Array.from({ length: loadingRowCount }).map((_, rowIndex) => (
      <TableRow key={`skeleton-${rowIndex}`}>
        {Array.from({ length: columnCount }).map((_, colIndex) => (
          <TableCell key={`skeleton-${rowIndex}-${colIndex}`}>
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div
      className={cn(
        "bg-grey-50 flex w-full flex-col gap-2.5 overflow-auto rounded-sm",
        className
      )}
      {...props}
    >
      {children}
      <div
        className={cn(
          "data-table-scroll-wrapper overflow-hidden rounded-md",
          stickyHeader && "max-h-[70vh] overflow-auto"
        )}
      >
        <Table
          className={tableClassName}
          role="grid"
          aria-rowcount={table.getFilteredRowModel().rows.length}
          aria-colcount={table.getAllColumns().length}
        >
          <TableHeader
            className={stickyHeader ? "sticky top-0 z-10" : undefined}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={headerClassName}
                role="row"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getColumnPinningStyle({ column: header.column }),
                    }}
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
            {loading ? (
              renderLoadingSkeleton()
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    onRowClick
                      ? "hover:bg-muted/50 focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
                      : "",
                    getRowClassName(row.original)
                  )}
                  tabIndex={onRowClick ? 0 : undefined}
                  onMouseDown={onMouseDown}
                  onClick={(e) => {
                    if (isDrag(e)) return;
                    const target = e.target as HTMLElement;
                    const isInteractive =
                      target.closest("button") ||
                      target.closest("a") ||
                      target.closest("input") ||
                      target.closest("[role='button']") ||
                      target.closest("[data-no-row-click]");
                    if (!isInteractive) {
                      onRowClick?.(row.original);
                    }
                  }}
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onRowClick(row.original);
                          }
                        }
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getColumnPinningStyle({ column: cell.column }),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  {emptyState ?? "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="bg-background m-2 flex flex-col gap-2.5 rounded-sm">
        <DataTablePagination
          table={table}
          variant={paginationVariant}
          showRowsPerPage={showRowsPerPage}
          showSelectedCount={showSelectedCount}
          showPageNumbers={showPageNumbers}
          pageSizeOptions={pageSizeOptions}
          showGoToPage={showGoToPage}
        />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}

export default DataTable;
