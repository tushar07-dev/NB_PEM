import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTableViewOptions } from "../data-table-view-options";
import { createMockTable, createMockColumn } from "./helpers/create-mock-table";

describe("DataTableViewOptions", () => {
  function makeTableWithColumns() {
    const columns = [
      createMockColumn({
        id: "name",
        getIsVisible: vi.fn().mockReturnValue(true),
        getCanHide: vi.fn().mockReturnValue(true),
        accessorFn: () => "",
        columnDef: { meta: { label: "Name" }, enableColumnFilter: true },
      }),
      createMockColumn({
        id: "status",
        getIsVisible: vi.fn().mockReturnValue(false),
        getCanHide: vi.fn().mockReturnValue(true),
        accessorFn: () => "",
        columnDef: { meta: { label: "Status" }, enableColumnFilter: true },
      }),
    ];
    return createMockTable({ columns });
  }

  it("renders View button", () => {
    const table = makeTableWithColumns();
    render(<DataTableViewOptions table={table} />);
    expect(
      screen.getByRole("combobox", { name: /toggle columns/i })
    ).toBeInTheDocument();
    expect(screen.getByText("View")).toBeInTheDocument();
  });

  it("disables button when disabled prop is true", () => {
    const table = makeTableWithColumns();
    render(<DataTableViewOptions table={table} disabled />);
    expect(
      screen.getByRole("combobox", { name: /toggle columns/i })
    ).toBeDisabled();
  });

  it("opens popover and shows column names", async () => {
    const table = makeTableWithColumns();
    render(<DataTableViewOptions table={table} />);
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("calls toggleVisibility when column item clicked", async () => {
    const table = makeTableWithColumns();
    render(<DataTableViewOptions table={table} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByText("Name"));
    const columns = table.getAllColumns();
    expect(columns[0].toggleVisibility).toHaveBeenCalledWith(false);
  });

  it("shows check icon for visible columns", async () => {
    const table = makeTableWithColumns();
    const { container } = render(<DataTableViewOptions table={table} />);
    await userEvent.click(screen.getByRole("combobox"));
    // Name is visible (opacity-100), Status is not (opacity-0)
    const checkIcons = container.querySelectorAll(".ml-auto.size-4");
    expect(checkIcons[0]).toHaveClass("opacity-100"); // Name — visible
    expect(checkIcons[1]).toHaveClass("opacity-0"); // Status — hidden
  });

  it("filters columns via search", async () => {
    const table = makeTableWithColumns();
    render(<DataTableViewOptions table={table} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.type(
      screen.getByPlaceholderText(/search columns/i),
      "stat"
    );
    expect(screen.queryByText("Name")).not.toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });
});
