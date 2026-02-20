import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";

interface DataTablePaginationProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  /** "default" = original style, "simple" = "Showing X To Y Of Z Entries" */
  variant?: "default" | "simple";
  /** Show/hide "Rows per page" dropdown */
  showRowsPerPage?: boolean;
  /** Show/hide "X of Y row(s) selected" text */
  showSelectedCount?: boolean;
  /** Show numbered page buttons (1, 2, 3...) */
  showPageNumbers?: boolean;
  /** Max number of page buttons to show */
  maxVisiblePages?: number;
  /** Show "Go to page" input */
  showGoToPage?: boolean;
  /**
   * Total rows from server response.
   * Pass this when using server-side pagination so the component
   * shows the correct total instead of deriving it from loaded rows.
   */
  totalRows?: number;
  /**
   * When true, all pagination controls are disabled.
   * Set this while a server fetch is in-flight to prevent
   * duplicate requests from rapid clicking.
   */
  isLoading?: boolean;
  /**
   * Called when the user navigates to a different page.
   * Use this to trigger your server-side fetch.
   * pageIndex is 0-based.
   */
  onPageChange?: (pageIndex: number) => void;
  /**
   * Called when the user changes the page size.
   * Use this to trigger your server-side fetch with the new limit.
   */
  onPageSizeChange?: (pageSize: number) => void;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  variant = "default",
  showRowsPerPage = true,
  showSelectedCount = true,
  showPageNumbers = false,
  maxVisiblePages = 5,
  showGoToPage = false,
  totalRows: totalRowsProp,
  isLoading = false,
  onPageChange,
  onPageSizeChange,
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const isSimple = variant === "simple";

  // ✅ Use server-provided total if available, otherwise fall back to client model
  const totalRows = totalRowsProp ?? table.getFilteredRowModel().rows.length;

  // ✅ Selection count — only meaningful in client-side mode
  const selectedRows = table.getFilteredSelectedRowModel().rows.length;

  // ✅ Safe range calculation — handles edge cases like 0 rows
  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  // ✅ Safe page count — prevents "Page 1 of 0" when loading/empty
  const safePageCount = Math.max(pageCount, 1);

  // Local state for "Go to page" input
  const [goToPageValue, setGoToPageValue] = React.useState("");
  const [goToPageError, setGoToPageError] = React.useState(false);

  // ✅ Centralized page navigation — fires table method + optional callback
  const goToPage = React.useCallback(
    (index: number) => {
      table.setPageIndex(index);
      onPageChange?.(index);
    },
    [table, onPageChange]
  );

  // ✅ Centralized page size change — fires table method + optional callback
  const handlePageSizeChange = React.useCallback(
    (value: string) => {
      const size = Number(value);
      table.setPageSize(size);
      // Reset to first page when page size changes to avoid being on
      // an out-of-range page
      table.setPageIndex(0);
      onPageSizeChange?.(size);
      onPageChange?.(0);
    },
    [table, onPageSizeChange, onPageChange]
  );

  // ✅ Go to page — with validation feedback and keyboard support
  const handleGoToPage = (e?: React.FormEvent) => {
    e?.preventDefault();
    const pageNum = parseInt(goToPageValue, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= safePageCount) {
      goToPage(pageNum - 1);
      setGoToPageValue("");
      setGoToPageError(false);
    } else {
      // Show error state briefly then clear
      setGoToPageError(true);
      setTimeout(() => setGoToPageError(false), 1500);
    }
  };

  // ✅ Ellipsis-safe page number generator
  // Uses unique keys to avoid React key collision warnings
  const getPageNumbers = React.useCallback((): (
    | number
    | { type: "ellipsis"; key: string }
  )[] => {
    if (safePageCount <= 0) return [];

    const pages: (number | { type: "ellipsis"; key: string })[] = [];

    if (safePageCount <= maxVisiblePages) {
      for (let i = 0; i < safePageCount; i++) pages.push(i);
      return pages;
    }

    // Always show first page
    pages.push(0);

    const start = Math.max(1, pageIndex - 1);
    const end = Math.min(safePageCount - 2, pageIndex + 1);

    if (start > 1) {
      pages.push({ type: "ellipsis", key: "ellipsis-start" });
    }

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < safePageCount - 2) {
      pages.push({ type: "ellipsis", key: "ellipsis-end" });
    }

    if (safePageCount > 1) {
      pages.push(safePageCount - 1);
    }

    return pages;
  }, [safePageCount, pageIndex, maxVisiblePages]);

  // ✅ All controls should be disabled when loading
  const canPrev = table.getCanPreviousPage() && !isLoading;
  const canNext = table.getCanNextPage() && !isLoading;

  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto px-3 py-1.5 sm:flex-row sm:gap-8",
        className
      )}
      {...props}
    >
      {/* ── Left side ─────────────────────────────────────────────── */}
      <div className="text-muted-foreground flex-1 text-sm whitespace-nowrap">
        {isSimple ? (
          // ✅ Handles 0-row edge case gracefully
          totalRows === 0 ? (
            <span className="text-primary-300 font-medium">
              No entries found
            </span>
          ) : (
            <>
              <span className="text-primary-300 font-medium">Showing</span>{" "}
              <span className="text-primary-300 font-medium">{startRow}</span>{" "}
              <span className="text-primary-300 font-medium">to</span>{" "}
              <span className="text-primary-300 font-medium">{endRow}</span>{" "}
              <span className="text-primary-300 font-medium">of</span>{" "}
              <span className="text-primary-300 font-medium">{totalRows}</span>{" "}
              <span className="text-primary-300 font-medium">
                {totalRows === 1 ? "Entry" : "Entries"}
              </span>
            </>
          )
        ) : (
          showSelectedCount && (
            <span>
              <span className="text-primary-600 font-medium">
                {selectedRows}
              </span>{" "}
              <span className="text-primary-600 font-medium">of</span>{" "}
              <span className="text-primary-600 font-medium">{totalRows}</span>{" "}
              <span className="text-primary-600 font-medium">
                {totalRows === 1 ? "row selected." : "row(s) selected."}
              </span>
            </span>
          )
        )}
      </div>

      {/* ── Right side: Controls ───────────────────────────────────── */}
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        {/* Rows per page — available in both variants */}
        {showRowsPerPage && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium whitespace-nowrap">
              Rows per page
            </p>
            <Select
              value={`${pageSize}`}
              onValueChange={handlePageSizeChange}
              disabled={isLoading}
            >
              <SelectTrigger
                className="h-8 w-18 data-size:h-8"
                aria-label="Rows per page"
              >
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Page indicator — default variant only, when numbered buttons are off */}
        {!isSimple && !showPageNumbers && (
          <div className="flex items-center justify-center text-sm font-medium">
            {/* ✅ Never shows "Page 1 of 0" */}
            Page {totalRows === 0 ? 0 : pageIndex + 1} of{" "}
            {totalRows === 0 ? 0 : safePageCount}
          </div>
        )}

        {/* ── Navigation buttons ─────────────────────────── */}
        <div className="flex items-center space-x-2">
          {/* First page — default variant only */}
          {!isSimple && (
            <Button
              aria-label="Go to first page"
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => goToPage(0)}
              disabled={!canPrev}
            >
              <ChevronsLeft />
            </Button>
          )}

          {/* Previous */}
          <Button
            aria-label="Go to previous page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => goToPage(pageIndex - 1)}
            disabled={!canPrev}
          >
            <ChevronLeft />
          </Button>

          {/* Numbered page buttons */}
          {(showPageNumbers || isSimple) && safePageCount > 0 && (
            <>
              {getPageNumbers().map((page) =>
                typeof page === "object" && page.type === "ellipsis" ? (
                  // ✅ Unique keys prevent React warnings
                  <span
                    key={page.key}
                    className="text-muted-foreground px-1 text-sm select-none"
                    aria-hidden="true"
                  >
                    …
                  </span>
                ) : (
                  <Button
                    key={page as number}
                    variant={page === pageIndex ? "default" : "outline"}
                    size="icon"
                    className="size-8"
                    aria-label={`Go to page ${(page as number) + 1}`}
                    aria-current={page === pageIndex ? "page" : undefined}
                    onClick={() => goToPage(page as number)}
                    disabled={isLoading}
                  >
                    {(page as number) + 1}
                  </Button>
                )
              )}
            </>
          )}

          {/* Next */}
          <Button
            aria-label="Go to next page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => goToPage(pageIndex + 1)}
            disabled={!canNext}
          >
            <ChevronRight />
          </Button>

          {/* Last page — default variant only */}
          {!isSimple && (
            <Button
              aria-label="Go to last page"
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => goToPage(safePageCount - 1)}
              disabled={!canNext}
            >
              <ChevronsRight />
            </Button>
          )}
        </div>

        {/* ── Go to page ─────────────────────────────────── */}
        {showGoToPage && safePageCount > 1 && (
          <form
            onSubmit={handleGoToPage}
            className="flex items-center gap-2"
            aria-label="Go to specific page"
          >
            <span className="text-muted-foreground text-sm whitespace-nowrap">
              Go to
            </span>
            <Input
              type="number"
              min={1}
              max={safePageCount}
              value={goToPageValue}
              onChange={(e) => {
                setGoToPageValue(e.target.value);
                setGoToPageError(false);
              }}
              // ✅ Submit on blur too, not just Enter — better UX
              onBlur={() => goToPageValue && handleGoToPage()}
              placeholder={`1–${safePageCount}`}
              disabled={isLoading}
              className={cn(
                "h-8 w-16 text-center",
                // ✅ Error state visual feedback
                goToPageError &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              aria-label={`Go to page, between 1 and ${safePageCount}`}
              aria-invalid={goToPageError}
            />
            {/* ✅ Explicit Go button — works reliably on mobile */}
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs"
              disabled={isLoading || !goToPageValue}
            >
              Go
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
