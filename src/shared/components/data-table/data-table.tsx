import {
  type Cell,
  type Row,
  type RowData,
  type Table as TanstackTable,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  getCommonCellStyles,
  getCommonPinningStyles,
} from "@/shared/lib/data-table";
import { cn } from "@/lib/utils";
import React, {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DataTablePagination } from "./data-table-pagination";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    getRowStyles?: (row: Row<TData>) => CSSProperties;
    getCellStyles?: (cell: Cell<TData, unknown>) => CSSProperties;
    updateData?: (rowIndex: number, columnId: string, value: string) => void;
    onRowClick?: (row: Row<TData>) => void;
  }
}

export type ICellWrapper<TData> = React.ComponentType<{
  cell: Cell<TData, unknown>;
  row: TData;
  index: number;
  children: React.ReactNode;
}>;

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  isLoading?: boolean;
  hasMore?: boolean;
  paginationOptimizedRowDetails?: {
    pageSize: number;
    enable: boolean;
    optimizedRows: Row<TData>[];
    showTopLoadingDiv: boolean;
    showBottomLoadingDiv: boolean;
  };
  fetchNextPage?: () => void;
  rowWrapper?: React.ComponentType<{
    row: TData;
    selectedRowIds: string[];
    children: React.ReactNode;
  }>;
  searchIds?: string[];
  variant?: "default" | "bordered";
  tableBodyRef?: React.RefObject<HTMLTableSectionElement>;
  rowTopLoadingDivRef?: React.RefObject<HTMLDivElement | null>;
  rowBottomLoadingDivRef?: React.RefObject<HTMLDivElement | null>;
  cellWrapper?: ICellWrapper<TData>;
}

export function DataTable<TData>({
  table,
  actionBar,
  hasMore,
  children,
  isLoading,
  tableBodyRef,
  rowTopLoadingDivRef,
  rowBottomLoadingDivRef,
  className,
  variant = "default",
  fetchNextPage,
  paginationOptimizedRowDetails,
  rowWrapper,
  cellWrapper,
  searchIds,
  ...props
}: DataTableProps<TData>) {
  const lastElementRef = useRef<HTMLDivElement>(null);

  const selectedRowIds = table.getSelectedRowModel().rows.map((r) => r.id);
  const RowWrapper = rowWrapper;
  const CellWrapper = cellWrapper;

  // Memoize so the Set isn't re-created on every render
  const searchableIdsSet = useMemo(() => new Set(searchIds ?? []), [searchIds]);

  function getRowDataState(row: Row<TData>): "selected" | undefined {
    return row.getIsSelected() ? "selected" : undefined;
  }

  // Intersection observer for infinite scroll
  useEffect(() => {
    const el = lastElementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (fetchNextPage && !isLoading && hasMore) {
              fetchNextPage();
            }
          }, 1000);
        }
      },
      { threshold: 1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasMore, isLoading]);

  // Scroll to highlighted row when searchIds change
  useEffect(() => {
    if (
      searchIds &&
      searchIds.length > 0 &&
      !paginationOptimizedRowDetails?.enable
    ) {
      const el = document.getElementById(`data-table-id-${searchIds[0]}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [paginationOptimizedRowDetails?.enable, searchIds]);

  // Track container width in state so we never read refs during render.
  // Uses ResizeObserver so the values stay accurate when the layout changes.
  const [mainContainerWidth, setMainContainerWidth] = useState(500);
  const [tableBodyWidth, setTableBodyWidth] = useState(500);

  useEffect(() => {
    const container = rowBottomLoadingDivRef?.current?.parentElement;
    if (!container) return;

    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width !== undefined) setMainContainerWidth(width);
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [rowBottomLoadingDivRef]);

  useEffect(() => {
    const body = tableBodyRef?.current;
    if (!body) return;

    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width !== undefined) setTableBodyWidth(width);
    });
    ro.observe(body);
    return () => ro.disconnect();
  }, [tableBodyRef]);

  const rows =
    paginationOptimizedRowDetails?.optimizedRows ?? table.getRowModel().rows;

  return (
    <div className={cn("flex w-full flex-col gap-2", className)} {...props}>
      {children}
      <div className="bg-background relative h-full overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup, index) => (
              <TableRow key={headerGroup.id} className="h-full">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="bg-secondary ps-4"
                    style={getCommonPinningStyles({
                      column: header.column,
                      index,
                    })}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.columnDef.enableResizing &&
                      header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={cn(
                            "bg-background focus:ring-primary absolute top-1/2 right-4 h-[60%] w-1 -translate-y-1/2 cursor-col-resize touch-none rounded-sm select-none focus:ring-2 focus:ring-offset-1 focus:outline-none",
                            header.column.getIsResizing() && "bg-secondary-100"
                          )}
                        />
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody bodyRef={tableBodyRef}>
            {paginationOptimizedRowDetails?.showTopLoadingDiv && (
              <tr
                className="h-5 w-full"
                ref={
                  rowTopLoadingDivRef as React.RefObject<HTMLTableRowElement>
                }
              >
                <td className="sticky" style={{ left: mainContainerWidth / 2 }}>
                  Loading...
                </td>
              </tr>
            )}
            {rows.length ? (
              rows.map((row, index) => {
                const rowNode = (
                  <TableRow
                    key={row.id}
                    id={`data-table-id-${row.id}`}
                    style={table.options.meta?.getRowStyles?.(row)}
                    onClick={() => table.options.meta?.onRowClick?.(row)}
                    data-state={getRowDataState(row)}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      const cellNode = (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            index % 2 === 0
                              ? "bg-background"
                              : "bg-background-secondary",
                            variant === "bordered" ? "px-2" : "ps-4"
                          )}
                          style={{
                            ...getCommonPinningStyles({
                              column: cell.column,
                              index: cellIndex,
                            }),
                            ...getCommonCellStyles({
                              row,
                              column: cell.column,
                              index: cellIndex,
                              noOfCells: row.getVisibleCells().length,
                              withBorder: variant === "bordered",
                              setOfSearchIds: searchableIdsSet,
                            }),
                            ...table.options.meta?.getCellStyles?.(cell),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );

                      return CellWrapper ? (
                        <CellWrapper
                          key={cell.id}
                          row={row.original}
                          cell={cell}
                          index={cellIndex}
                        >
                          {cellNode}
                        </CellWrapper>
                      ) : (
                        cellNode
                      );
                    })}
                  </TableRow>
                );

                if (RowWrapper) {
                  return (
                    <RowWrapper
                      key={row.id}
                      row={row.original}
                      selectedRowIds={selectedRowIds}
                    >
                      {rowNode}
                    </RowWrapper>
                  );
                }

                return rowNode;
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {hasMore && (
          <div
            ref={lastElementRef}
            className="flex h-10 w-full flex-col items-center"
          >
            Loading
          </div>
        )}
        {paginationOptimizedRowDetails?.showBottomLoadingDiv && (
          <div
            className="h-10 w-full"
            style={{
              minWidth: `${tableBodyWidth - 150}px`,
            }}
            ref={rowBottomLoadingDivRef as React.RefObject<HTMLDivElement>}
          >
            <div
              className="sticky left-0 flex h-full items-center justify-center"
              style={{
                width: `${mainContainerWidth}px`,
                maxWidth: `${mainContainerWidth}px`,
              }}
            >
              Loading...
            </div>
          </div>
        )}
      </div>
      {table.getPageCount() > 0 && (
        <div className="flex flex-col gap-2.5">
          <DataTablePagination table={table} />
          {actionBar &&
            table.getFilteredSelectedRowModel().rows.length > 0 &&
            actionBar}
        </div>
      )}
    </div>
  );
}
