import { type Row, type Table as TanstackTable } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

interface useDataTableOptimizedRowProps<
  TData,
> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  pageSize: number;
}

const useDataTableOptimizedRow = <TData,>({
  table,
  pageSize,
}: useDataTableOptimizedRowProps<TData>) => {
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const rowTopLoadingDivRef = useRef<HTMLDivElement>(null);
  const rowBottomLoadingDivRef = useRef<HTMLDivElement>(null);

  const rows = table.getRowModel()?.rows;
  const isSearchScrolling = useRef(false);

  const [paginatedData, setPaginatedData] = useState<Row<TData>[][]>([]);
  const [paginationRange, setPaginationRange] = useState({ start: 0, end: 3 });

  useEffect(() => {
    let tempRows: Row<TData>[] = [];
    const tempListOfRows: Row<TData>[][] = [];
    for (let row of rows) {
      if (tempRows.length === pageSize) {
        tempListOfRows.push(tempRows);
        tempRows = [];
      }
      tempRows.push(row);
    }
    if (tempRows.length) {
      tempListOfRows.push(tempRows);
    }
    setPaginatedData(tempListOfRows);
    setPaginationRange({ start: 0, end: 3 });
  }, [rows, pageSize]);

  useEffect(() => {
    let belowObserver = null;
    let topObserver = null;
    if (rowTopLoadingDivRef?.current) {
      topObserver = new IntersectionObserver(
        async (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && !isSearchScrolling.current) {
            updatePaginationRange("top");
          }
        },
        { threshold: 0 }
      );
      topObserver.observe(rowTopLoadingDivRef?.current);
    }
    if (rowBottomLoadingDivRef?.current) {
      belowObserver = new IntersectionObserver(
        async (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            if (paginatedData.length === 0) return;
            updatePaginationRange("below");
          }
        },
        { threshold: 0 }
      );
      belowObserver.observe(rowBottomLoadingDivRef?.current);
    }

    return () => {
      if (rowBottomLoadingDivRef?.current) {
        belowObserver?.unobserve(rowBottomLoadingDivRef?.current);
      }
      if (rowTopLoadingDivRef?.current) {
        topObserver?.unobserve(rowTopLoadingDivRef?.current);
      }
    };
  }, [paginatedData, paginationRange]);

  function updatePaginationRange(state: "below" | "top") {
    flushSync(() => {
      setPaginationRange((prev) => {
        const start = state === "below" ? prev.start + 1 : prev.start - 1;
        const end = state === "below" ? prev.end + 1 : prev.end - 1;

        return getPaginationRangeFormattedValue(start, end);
      });
    });

    if (tableBodyRef?.current && (state === "top" || state === "below")) {
      const nthChild = tableBodyRef?.current?.children[pageSize]; // 3rd child (n = 3)
      nthChild?.scrollIntoView({ behavior: "instant" });
    }
  }

  function getPaginationRangeFormattedValue(start: number, end: number) {
    return {
      start: start < 0 ? 0 : start,
      end: end > paginatedData.length ? paginatedData.length : end,
    };
  }

  function scrollElementIntoView(key: string, value: string) {
    for (let i = 0; i < paginatedData.length; i++) {
      const rows = paginatedData[i];
      const index = rows.findIndex((e: any) => e[key] === value);
      if (index !== -1) {
        const newRange = getPaginationRangeFormattedValue(i - 1, i + 2);
        setPaginationRange(newRange);
        // Scroll only after DOM has re-rendered
        requestAnimationFrame(() => {
          const el = document.getElementById(`data-table-id-${value}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            isSearchScrolling.current = true;
          }
        });

        setTimeout(() => {
          isSearchScrolling.current = false;
        }, 1000);
        break;
      }
    }
  }

  const finalRows = paginatedData
    .slice(paginationRange.start, paginationRange.end)
    .flat(2);

  return {
    rows: finalRows,
    paginationRange,
    setPaginationRange,
    tableBodyRef,
    rowTopLoadingDivRef,
    rowBottomLoadingDivRef,
    paginatedData,
    scrollElementIntoView,
  };
};

export default useDataTableOptimizedRow;
