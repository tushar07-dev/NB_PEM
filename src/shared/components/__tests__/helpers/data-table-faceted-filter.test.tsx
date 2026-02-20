import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTableFacetedFilter } from "../data-table-faceted-filter";
import { createMockColumn } from "./helpers/create-mock-table";

const mockOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
];

describe("DataTableFacetedFilter", () => {
  // ── Rendering ─────────────────────────────────────────────────────

  it("renders trigger button with title", () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue(undefined),
    });
    render(
      <DataTableFacetedFilter
        column={column}
        title="Status"
        options={mockOptions}
      />
    );
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("shows PlusCircle icon when no filter is active", () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue(undefined),
    });
    const { container } = render(
      <DataTableFacetedFilter
        column={column}
        title="Status"
        options={mockOptions}
      />
    );
    // XCircle should NOT be present; PlusCircle should be
    expect(
      container.querySelector('[aria-label*="Clear"]')
    ).not.toBeInTheDocument();
  });

  it("shows XCircle clear button when a filter is selected", () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue(["active"]),
    });
    render(
      <DataTableFacetedFilter
        column={column}
        title="Status"
        options={mockOptions}
      />
    );
    expect(
      screen.getByRole("button", { name: /clear status filter/i })
    ).toBeInTheDocument();
  });

  it("shows selected count badge when multiple values selected", () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue(["active", "inactive"]),
    });
    render(
      <DataTableFacetedFilter
        column={column}
        title="Status"
        options={mockOptions}
        multiple
      />
    );
    // Badge with count
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  // ── Interactions ──────────────────────────────────────────────────

  it("opens popover and shows all options when trigger clicked", async () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue(undefined),
    });
    render(
      <DataTableFacetedFilter
        column={column}
        title="Status"
        options={mockOptions}
      />
    );
    await userEvent.click(screen.getByText("Status"));
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("calls setFilterValue with selected option in single mode", async () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue(undefined),
    });
    render(
      <DataTableFacetedFilter
        column={column}
        title="Status"
        options={mockOptions}
      />
    );
    await userEvent.click(screen.getByText("Status"));
    await userEvent.click(screen.getByText("Active"));
    expect(column.setFilterValue).toHaveBeenCalledWith(["active"]);
  });

  it("calls setFilterValue with array in multi mode", async () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue(undefined),
    });
    render(
      <DataTableFacetedFilter
        column={column}
        title="Status"
        options={mockOptions}
        multiple
      />
    );
    await userEvent.click(screen.getByText("Status"));
    await userEvent.click(screen.getByText("Active"));
    expect(column.setFilterValue).toHaveBeenCalledWith(["active"]);
  });

  it("deselects already-selected value in multi mode", async () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue(["active"]),
    });
    render(
      <DataTableFacetedFilter
        column={column}
        title="Status"
        options={mockOptions}
        multiple
      />
    );
    await userEvent.click(screen.getByText("Status"));
    // Click Active again to deselect
    await userEvent.click(screen.getByText("Active"));
    // Set called with empty (undefined)
    expect(column.setFilterValue).toHaveBeenCalledWith(undefined);
  });

  it("clears filter when XCircle is clicked", async () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue(["active"]),
    });
    render(
      <DataTableFacetedFilter
        column={column}
        title="Status"
        options={mockOptions}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: /clear status filter/i })
    );
    expect(column.setFilterValue).toHaveBeenCalledWith(undefined);
  });

  it("clears filter via 'Clear filters' command item in open popover", async () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue(["active"]),
    });
    render(
      <DataTableFacetedFilter
        column={column}
        title="Status"
        options={mockOptions}
      />
    );
    await userEvent.click(screen.getByText("Status"));
    await userEvent.click(screen.getByText(/clear filters/i));
    expect(column.setFilterValue).toHaveBeenCalledWith(undefined);
  });

  // ── Edge cases ────────────────────────────────────────────────────

  it("shows option count badge when option has count", async () => {
    const optionsWithCount = [{ label: "Active", value: "active", count: 42 }];
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue(undefined),
    });
    render(
      <DataTableFacetedFilter
        column={column}
        title="Status"
        options={optionsWithCount}
      />
    );
    await userEvent.click(screen.getByText("Status"));
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("filters options via search input", async () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue(undefined),
    });
    render(
      <DataTableFacetedFilter
        column={column}
        title="Status"
        options={mockOptions}
      />
    );
    await userEvent.click(screen.getByText("Status"));
    await userEvent.type(screen.getByPlaceholderText("Status"), "act");
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.queryByText("Inactive")).not.toBeInTheDocument();
  });
});
