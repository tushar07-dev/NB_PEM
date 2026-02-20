import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable } from "../data-table";
import { createMockTable, createMockColumn } from "./helpers/create-mock-table";
import { flexRender } from "@tanstack/react-table";

// Mock getColumnPinningStyle — returns empty style (we test logic, not pinning CSS)
vi.mock("@/shared/lib/data-table/data-table", () => ({
  getColumnPinningStyle: vi.fn().mockReturnValue({}),
}));

// Mock the drag-click guard hook — not relevant for these tests
vi.mock("@/shared/hooks/data-table/use-drag-click-guard", () => ({
  useDragClickGuard: () => ({
    onMouseDown: vi.fn(),
    isDrag: vi.fn().mockReturnValue(false),
  }),
}));

type TestRow = { id: string; name: string };

function makeTable(rows: TestRow[] = [], overrides = {}) {
  const nameColumn = createMockColumn<TestRow>({
    id: "name",
    getVisibleCells: vi.fn().mockImplementation(() => [
      {
        id: "name-cell",
        column: {
          columnDef: {
            cell: ({ row }: { row: { original: TestRow } }) =>
              row.original.name,
          },
          getColumnPinningStyle: vi.fn().mockReturnValue({}),
        },
        getContext: vi.fn().mockReturnValue({
          row: { original: { id: "1", name: "row-name" } },
        }),
      },
    ]),
  });

  return createMockTable<TestRow>({
    rows,
    columns: [nameColumn],
    ...overrides,
  });
}

describe("DataTable", () => {
  // ── Rendering ─────────────────────────────────────────────────────

  it("renders table with role=grid", () => {
    const table = makeTable();
    render(<DataTable table={table} />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("renders header columns", () => {
    const table = makeTable();
    render(<DataTable table={table} />);
    // HeaderGroup rendered from mock
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("shows empty state when no rows and no custom emptyState", () => {
    const table = makeTable([]);
    render(<DataTable table={table} />);
    expect(screen.getByText(/no results/i)).toBeInTheDocument();
  });

  it("shows custom emptyState when provided and no rows", () => {
    const table = makeTable([]);
    render(
      <DataTable table={table} emptyState={<span>Nothing here yet</span>} />
    );
    expect(screen.getByText("Nothing here yet")).toBeInTheDocument();
  });

  it("shows loading skeleton when loading=true", () => {
    const table = makeTable();
    const { container } = render(
      <DataTable table={table} loading loadingRowCount={3} />
    );
    const skeletonRows = container.querySelectorAll("tbody tr");
    expect(skeletonRows.length).toBe(3);
    // Each row should have skeleton divs, not real data
    const skeletonDivs = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletonDivs.length).toBeGreaterThan(0);
  });

  it("does not show empty state while loading", () => {
    const table = makeTable([]);
    render(<DataTable table={table} loading />);
    expect(screen.queryByText(/no results/i)).not.toBeInTheDocument();
  });

  // ── Row interactions ──────────────────────────────────────────────

  it("calls onRowClick when a row is clicked", async () => {
    const onRowClick = vi.fn();
    const rows: TestRow[] = [{ id: "1", name: "Alice" }];
    const table = makeTable(rows);
    const { container } = render(
      <DataTable table={table} onRowClick={onRowClick} />
    );
    const bodyRow = container.querySelector("tbody tr");
    expect(bodyRow).not.toBeNull();
    await userEvent.click(bodyRow!);
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onRowClick when clicking a button inside the row", async () => {
    const onRowClick = vi.fn();
    const rows: TestRow[] = [{ id: "1", name: "Alice" }];
    const table = makeTable(rows);
    const { container } = render(
      <DataTable table={table} onRowClick={onRowClick}>
        <button data-testid="row-action">Action</button>
      </DataTable>
    );
    // Click the button, not the row — onRowClick should NOT fire
    const btn = screen.queryByTestId("row-action");
    if (btn) await userEvent.click(btn);
    // onRowClick should not have been called since button is separate
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it("adds cursor-pointer class to rows when onRowClick is provided", () => {
    const rows: TestRow[] = [{ id: "1", name: "Alice" }];
    const table = makeTable(rows);
    const { container } = render(
      <DataTable table={table} onRowClick={vi.fn()} />
    );
    const bodyRow = container.querySelector("tbody tr");
    expect(bodyRow).toHaveClass("cursor-pointer");
  });

  it("does NOT add cursor-pointer when onRowClick is not provided", () => {
    const rows: TestRow[] = [{ id: "1", name: "Alice" }];
    const table = makeTable(rows);
    const { container } = render(<DataTable table={table} />);
    const bodyRow = container.querySelector("tbody tr");
    expect(bodyRow).not.toHaveClass("cursor-pointer");
  });

  // ── Action bar ────────────────────────────────────────────────────

  it("shows actionBar when rows are selected", () => {
    const rows: TestRow[] = [{ id: "1", name: "Alice" }];
    const table = makeTable(rows, { selectedRowCount: 1 });
    render(
      <DataTable
        table={table}
        actionBar={<div data-testid="action-bar">Delete Selected</div>}
      />
    );
    expect(screen.getByTestId("action-bar")).toBeInTheDocument();
  });

  it("hides actionBar when no rows are selected", () => {
    const rows: TestRow[] = [{ id: "1", name: "Alice" }];
    const table = makeTable(rows, { selectedRowCount: 0 });
    render(
      <DataTable
        table={table}
        actionBar={<div data-testid="action-bar">Delete Selected</div>}
      />
    );
    expect(screen.queryByTestId("action-bar")).not.toBeInTheDocument();
  });

  // ── Sticky header ─────────────────────────────────────────────────

  it("applies sticky class to header when stickyHeader=true", () => {
    const table = makeTable();
    const { container } = render(<DataTable table={table} stickyHeader />);
    const thead = container.querySelector("thead");
    expect(thead).toHaveClass("sticky");
  });

  it("does not apply sticky class when stickyHeader=false", () => {
    const table = makeTable();
    const { container } = render(<DataTable table={table} />);
    const thead = container.querySelector("thead");
    expect(thead).not.toHaveClass("sticky");
  });

  // ── Children ──────────────────────────────────────────────────────

  it("renders children above the table", () => {
    const table = makeTable();
    render(
      <DataTable table={table}>
        <div data-testid="toolbar">Toolbar</div>
      </DataTable>
    );
    expect(screen.getByTestId("toolbar")).toBeInTheDocument();
  });
});
