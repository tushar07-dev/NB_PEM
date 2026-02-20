import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTablePagination } from "../data-table-pagination";
import { createMockTable } from "./helpers/create-mock-table";

describe("DataTablePagination", () => {
  // ── Simple variant (default in your project) ─────────────────────

  describe("simple variant", () => {
    it("shows 'No entries found' when totalRows is 0", () => {
      const table = createMockTable({ pageCount: 0 });
      render(
        <DataTablePagination table={table} variant="simple" totalRows={0} />
      );
      expect(screen.getByText(/no entries found/i)).toBeInTheDocument();
    });

    it("shows 'Showing X to Y of Z Entries' when rows exist", () => {
      const table = createMockTable({
        pageIndex: 0,
        pageSize: 10,
        pageCount: 3,
      });
      render(
        <DataTablePagination table={table} variant="simple" totalRows={25} />
      );
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("25")).toBeInTheDocument();
    });

    it("shows 'Entry' (singular) when totalRows is 1", () => {
      const table = createMockTable({
        pageIndex: 0,
        pageSize: 10,
        pageCount: 1,
      });
      render(
        <DataTablePagination table={table} variant="simple" totalRows={1} />
      );
      expect(screen.getByText("Entry")).toBeInTheDocument();
    });

    it("shows 'Entries' (plural) when totalRows > 1", () => {
      const table = createMockTable({
        pageIndex: 0,
        pageSize: 10,
        pageCount: 2,
      });
      render(
        <DataTablePagination table={table} variant="simple" totalRows={15} />
      );
      expect(screen.getByText("Entries")).toBeInTheDocument();
    });

    it("calculates correct start row on page 2", () => {
      const table = createMockTable({
        pageIndex: 1,
        pageSize: 10,
        pageCount: 3,
      });
      render(
        <DataTablePagination table={table} variant="simple" totalRows={25} />
      );
      expect(screen.getByText("11")).toBeInTheDocument();
      expect(screen.getByText("20")).toBeInTheDocument();
    });

    it("clamps endRow to totalRows on last page", () => {
      const table = createMockTable({
        pageIndex: 2,
        pageSize: 10,
        pageCount: 3,
      });
      render(
        <DataTablePagination table={table} variant="simple" totalRows={25} />
      );
      // Last page: rows 21–25
      expect(screen.getByText("21")).toBeInTheDocument();
      expect(screen.getByText("25")).toBeInTheDocument();
    });
  });

  // ── Navigation buttons ────────────────────────────────────────────

  describe("navigation buttons", () => {
    it("disables prev/first buttons on first page", () => {
      const table = createMockTable({ canPreviousPage: false });
      render(<DataTablePagination table={table} />);
      expect(
        screen.getByRole("button", { name: /go to previous page/i })
      ).toBeDisabled();
    });

    it("disables next/last buttons on last page", () => {
      const table = createMockTable({ canNextPage: false });
      render(<DataTablePagination table={table} />);
      expect(
        screen.getByRole("button", { name: /go to next page/i })
      ).toBeDisabled();
    });

    it("calls setPageIndex when next button clicked", async () => {
      const table = createMockTable({
        pageIndex: 0,
        pageSize: 10,
        pageCount: 3,
        canNextPage: true,
      });
      render(<DataTablePagination table={table} />);
      await userEvent.click(
        screen.getByRole("button", { name: /go to next page/i })
      );
      expect(table.setPageIndex).toHaveBeenCalledWith(1);
    });

    it("calls setPageIndex when prev button clicked", async () => {
      const table = createMockTable({
        pageIndex: 2,
        pageSize: 10,
        pageCount: 3,
        canPreviousPage: true,
      });
      render(<DataTablePagination table={table} />);
      await userEvent.click(
        screen.getByRole("button", { name: /go to previous page/i })
      );
      expect(table.setPageIndex).toHaveBeenCalledWith(1);
    });

    it("calls onPageChange callback when navigating", async () => {
      const onPageChange = vi.fn();
      const table = createMockTable({
        pageIndex: 0,
        pageCount: 3,
        canNextPage: true,
      });
      render(<DataTablePagination table={table} onPageChange={onPageChange} />);
      await userEvent.click(
        screen.getByRole("button", { name: /go to next page/i })
      );
      expect(onPageChange).toHaveBeenCalledWith(1);
    });
  });

  // ── Page size ─────────────────────────────────────────────────────

  describe("rows per page", () => {
    it("renders rows per page dropdown when showRowsPerPage=true", () => {
      const table = createMockTable();
      render(<DataTablePagination table={table} showRowsPerPage />);
      expect(screen.getByText(/rows per page/i)).toBeInTheDocument();
    });

    it("does not render rows per page when showRowsPerPage=false", () => {
      const table = createMockTable();
      render(<DataTablePagination table={table} showRowsPerPage={false} />);
      expect(screen.queryByText(/rows per page/i)).not.toBeInTheDocument();
    });
  });

  // ── Loading state ─────────────────────────────────────────────────

  describe("isLoading", () => {
    it("disables next button when isLoading=true even if canNextPage=true", () => {
      const table = createMockTable({ canNextPage: true });
      render(<DataTablePagination table={table} isLoading />);
      expect(
        screen.getByRole("button", { name: /go to next page/i })
      ).toBeDisabled();
    });

    it("disables prev button when isLoading=true even if canPreviousPage=true", () => {
      const table = createMockTable({ canPreviousPage: true });
      render(<DataTablePagination table={table} isLoading />);
      expect(
        screen.getByRole("button", { name: /go to previous page/i })
      ).toBeDisabled();
    });
  });

  // ── Go to page ────────────────────────────────────────────────────

  describe("go to page", () => {
    it("renders go to page input when showGoToPage=true and pageCount > 1", () => {
      const table = createMockTable({ pageCount: 5 });
      render(<DataTablePagination table={table} showGoToPage />);
      expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    });

    it("navigates to correct page on valid input", async () => {
      const table = createMockTable({ pageCount: 5, pageIndex: 0 });
      render(<DataTablePagination table={table} showGoToPage />);
      const input = screen.getByRole("spinbutton");
      await userEvent.clear(input);
      await userEvent.type(input, "3");
      await userEvent.click(screen.getByRole("button", { name: /^go$/i }));
      expect(table.setPageIndex).toHaveBeenCalledWith(2); // page 3 = index 2
    });
  });
});
