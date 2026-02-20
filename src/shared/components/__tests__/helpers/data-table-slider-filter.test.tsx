import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTableSliderFilter } from "../data-table-slider-filter";
import { createMockColumn } from "./helpers/create-mock-table";

describe("DataTableSliderFilter", () => {
  // ── Rendering ─────────────────────────────────────────────────────

  it("renders trigger button with title", () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue(undefined),
      columnDef: { meta: { range: [0, 100] } },
    });
    render(<DataTableSliderFilter column={column} title="Price" />);
    expect(screen.getByText("Price")).toBeInTheDocument();
  });

  it("does not show clear button when no filter is active", () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue(undefined),
      columnDef: { meta: { range: [0, 100] } },
    });
    render(<DataTableSliderFilter column={column} title="Price" />);
    expect(
      screen.queryByRole("button", { name: /clear price filter/i })
    ).not.toBeInTheDocument();
  });

  it("shows active filter values in trigger when filter is set", () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue([20, 80]),
      columnDef: { meta: { range: [0, 100] } },
    });
    render(<DataTableSliderFilter column={column} title="Price" />);
    expect(screen.getByText(/20/)).toBeInTheDocument();
    expect(screen.getByText(/80/)).toBeInTheDocument();
  });

  it("shows unit suffix when unit is defined in meta", () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue([10, 50]),
      columnDef: { meta: { range: [0, 100], unit: "kg" } },
    });
    render(<DataTableSliderFilter column={column} title="Weight" />);
    expect(screen.getByText(/kg/)).toBeInTheDocument();
  });

  // ── Popover content ───────────────────────────────────────────────

  it("opens popover and shows min/max inputs", async () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue(undefined),
      columnDef: { meta: { range: [0, 100] } },
    });
    render(<DataTableSliderFilter column={column} title="Price" />);
    await userEvent.click(screen.getByText("Price"));
    expect(
      screen.getByRole("spinbutton", { name: /from/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: /to/i })).toBeInTheDocument();
  });

  it("shows Clear button inside popover", async () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue(undefined),
      columnDef: { meta: { range: [0, 100] } },
    });
    render(<DataTableSliderFilter column={column} title="Price" />);
    await userEvent.click(screen.getByText("Price"));
    expect(
      screen.getByRole("button", { name: /clear price filter/i })
    ).toBeInTheDocument();
  });

  it("calls setFilterValue(undefined) when Clear button clicked", async () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue([20, 80]),
      columnDef: { meta: { range: [0, 100] } },
    });
    render(<DataTableSliderFilter column={column} title="Price" />);
    await userEvent.click(screen.getByText("Price"));
    await userEvent.click(
      screen.getByRole("button", { name: /clear price filter/i })
    );
    expect(column.setFilterValue).toHaveBeenCalledWith(undefined);
  });

  it("calls setFilterValue with updated min when From input changes", async () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue([0, 100]),
      columnDef: { meta: { range: [0, 100] } },
    });
    render(<DataTableSliderFilter column={column} title="Price" />);
    await userEvent.click(screen.getByText("Price"));

    const fromInput = screen.getByRole("spinbutton", { name: /from/i });
    await userEvent.clear(fromInput);
    await userEvent.type(fromInput, "25");
    // setFilterValue called with new min and existing max
    expect(column.setFilterValue).toHaveBeenCalledWith(
      expect.arrayContaining([25])
    );
  });

  // ── Range defaults ────────────────────────────────────────────────

  it("uses facetedMinMaxValues when no range meta is provided", async () => {
    const column = createMockColumn({
      getFilterValue: vi.fn().mockReturnValue(undefined),
      getFacetedMinMaxValues: vi.fn().mockReturnValue([5, 95]),
      columnDef: { meta: {} },
    });
    render(<DataTableSliderFilter column={column} title="Score" />);
    await userEvent.click(screen.getByText("Score"));
    const fromInput = screen.getByRole("spinbutton", { name: /from/i });
    expect(fromInput).toHaveAttribute("placeholder", "5");
  });
});
