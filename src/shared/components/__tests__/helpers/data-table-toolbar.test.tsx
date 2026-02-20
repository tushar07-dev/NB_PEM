import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTableToolbar } from "../data-table-toolbar";
import { createMockTable, createMockColumn } from "./helpers/create-mock-table";

// DataTableToolbar renders filter controls based on column meta variant.
// We test each filter variant branch renders correctly.

function makeTableWithColumn(
  meta: Record<string, unknown>,
  filterValue: unknown = undefined
) {
  const column = createMockColumn({
    id: "test-col",
    getCanFilter: vi.fn().mockReturnValue(true),
    getFilterValue: vi.fn().mockReturnValue(filterValue),
    columnDef: {
      meta: { label: "Test Column", ...meta },
      enableColumnFilter: true,
    },
  });
  return createMockTable({
    columns: [column],
    columnFiltersLength: filterValue ? 1 : 0,
  });
}

describe("DataTableToolbar", () => {
  // ── Rendering ─────────────────────────────────────────────────────

  it("renders with role=toolbar", () => {
    const table = makeTableWithColumn({ variant: "text" });
    render(<DataTableToolbar table={table} />);
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
  });

  it("renders children inside toolbar", () => {
    const table = makeTableWithColumn({ variant: "text" });
    render(
      <DataTableToolbar table={table}>
        <button>Custom Action</button>
      </DataTableToolbar>
    );
    expect(screen.getByText("Custom Action")).toBeInTheDocument();
  });

  // ── Text filter variant ───────────────────────────────────────────

  it("renders text input for 'text' variant", () => {
    const table = makeTableWithColumn({
      variant: "text",
      placeholder: "Search...",
    });
    render(<DataTableToolbar table={table} />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("calls setFilterValue when typing in text input", async () => {
    const column = createMockColumn({
      id: "name",
      getCanFilter: vi.fn().mockReturnValue(true),
      getFilterValue: vi.fn().mockReturnValue(""),
      columnDef: {
        meta: { variant: "text", label: "Name", placeholder: "Search name" },
        enableColumnFilter: true,
      },
    });
    const table = createMockTable({ columns: [column] });
    render(<DataTableToolbar table={table} />);
    await userEvent.type(screen.getByPlaceholderText("Search name"), "alice");
    expect(column.setFilterValue).toHaveBeenCalled();
  });

  // ── Number filter variant ─────────────────────────────────────────

  it("renders number input for 'number' variant", () => {
    const table = makeTableWithColumn({
      variant: "number",
      label: "Amount",
      placeholder: "Enter amount",
    });
    render(<DataTableToolbar table={table} />);
    const input = screen.getByPlaceholderText("Enter amount");
    expect(input).toHaveAttribute("type", "number");
  });

  it("shows unit suffix when unit is defined in number variant", () => {
    const table = makeTableWithColumn({
      variant: "number",
      label: "Weight",
      placeholder: "Weight",
      unit: "kg",
    });
    render(<DataTableToolbar table={table} />);
    expect(screen.getByText("kg")).toBeInTheDocument();
  });

  // ── Select / multiSelect filter variant ──────────────────────────

  it("renders faceted filter trigger for 'select' variant", () => {
    const table = makeTableWithColumn({
      variant: "select",
      label: "Status",
      options: [{ label: "Active", value: "active" }],
    });
    render(<DataTableToolbar table={table} />);
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders faceted filter trigger for 'multiSelect' variant", () => {
    const table = makeTableWithColumn({
      variant: "multiSelect",
      label: "Tags",
      options: [{ label: "React", value: "react" }],
    });
    render(<DataTableToolbar table={table} />);
    expect(screen.getByText("Tags")).toBeInTheDocument();
  });

  // ── Range filter variant ──────────────────────────────────────────

  it("renders slider filter trigger for 'range' variant", () => {
    const table = makeTableWithColumn({
      variant: "range",
      label: "Price",
      range: [0, 1000],
    });
    render(<DataTableToolbar table={table} />);
    expect(screen.getByText("Price")).toBeInTheDocument();
  });

  // ── Date filter variant ───────────────────────────────────────────

  it("renders date filter trigger for 'date' variant", () => {
    const table = makeTableWithColumn({ variant: "date", label: "Created At" });
    render(<DataTableToolbar table={table} />);
    expect(screen.getByText("Created At")).toBeInTheDocument();
  });

  it("renders date range filter trigger for 'dateRange' variant", () => {
    const table = makeTableWithColumn({
      variant: "dateRange",
      label: "Date Range",
    });
    render(<DataTableToolbar table={table} />);
    expect(screen.getByText("Date Range")).toBeInTheDocument();
  });

  // ── Reset button ──────────────────────────────────────────────────

  it("shows Reset button when at least one column filter is active", () => {
    const table = makeTableWithColumn({ variant: "text" }, "some-value");
    render(<DataTableToolbar table={table} />);
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
  });

  it("does not show Reset button when no filters are active", () => {
    const table = makeTableWithColumn({ variant: "text" });
    render(<DataTableToolbar table={table} />);
    expect(
      screen.queryByRole("button", { name: /reset/i })
    ).not.toBeInTheDocument();
  });

  it("calls resetColumnFilters when Reset button clicked", async () => {
    const table = makeTableWithColumn({ variant: "text" }, "value");
    render(<DataTableToolbar table={table} />);
    await userEvent.click(screen.getByRole("button", { name: /reset/i }));
    expect(table.resetColumnFilters).toHaveBeenCalledOnce();
  });

  // ── Non-filterable columns ────────────────────────────────────────

  it("does not render filter for columns where getCanFilter returns false", () => {
    const column = createMockColumn({
      id: "readonly-col",
      getCanFilter: vi.fn().mockReturnValue(false),
      columnDef: {
        meta: { variant: "text", label: "Read Only" },
        enableColumnFilter: false,
      },
    });
    const table = createMockTable({ columns: [column] });
    render(<DataTableToolbar table={table} />);
    expect(screen.queryByPlaceholderText("Read Only")).not.toBeInTheDocument();
  });

  // ── View options ──────────────────────────────────────────────────

  it("always renders View options button", () => {
    const table = makeTableWithColumn({ variant: "text" });
    render(<DataTableToolbar table={table} />);
    expect(
      screen.getByRole("combobox", { name: /toggle columns/i })
    ).toBeInTheDocument();
  });
});
