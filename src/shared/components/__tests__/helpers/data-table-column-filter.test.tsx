import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTableColumnFilter } from "@/shared/components/data-table/data-table-column-filter";
import { createMockColumn } from "@/shared/components/__tests__/helpers/create-mock-table";
import { useFilterStore } from "@/shared/store/filter-store";

// Reset Zustand store before each test to prevent bleed-through
beforeEach(() => {
  useFilterStore.getState().resetFilters();
});

// useDebouncedCallback — use real hook but with delay=0 so updates are immediate in tests
vi.mock("@/shared/hooks/data-table/use-debounced-callback", () => ({
  useDebouncedCallback: (fn: (...args: unknown[]) => unknown) => fn,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeColumn(variant: string, extra: Record<string, unknown> = {}) {
  return createMockColumn({
    id: "name",
    getFilterValue: vi.fn().mockReturnValue(undefined),
    columnDef: {
      meta: { label: "Name", variant, ...extra },
      enableColumnFilter: true,
    },
  });
}

// ── Rendering ─────────────────────────────────────────────────────────────────

describe("DataTableColumnFilter — rendering", () => {
  it("renders filter icon button", () => {
    const column = makeColumn("text");
    render(<DataTableColumnFilter column={column} />);
    expect(
      screen.getByRole("button", { name: /filter name/i })
    ).toBeInTheDocument();
  });

  it("returns null when enableColumnFilter is false", () => {
    const column = createMockColumn({
      id: "name",
      columnDef: {
        meta: { label: "Name", variant: "text" },
        enableColumnFilter: false,
      },
    });
    const { container } = render(<DataTableColumnFilter column={column} />);
    expect(container.firstChild).toBeNull();
  });

  it("filter icon button has 'text-primary' class when column has active filters", () => {
    // Pre-seed the store with a filter for this column
    useFilterStore.getState().addFilter({
      id: "name" as never,
      value: "alice",
      variant: "text",
      operator: "iLike",
      filterId: "f1",
    });
    const column = makeColumn("text");
    render(<DataTableColumnFilter column={column} />);
    const btn = screen.getByRole("button", { name: /filter name/i });
    expect(btn).toHaveClass("text-primary");
  });
});

// ── Popover open/close ────────────────────────────────────────────────────────

describe("DataTableColumnFilter — popover behavior", () => {
  it("opens popover when filter button clicked", async () => {
    const column = makeColumn("text");
    render(<DataTableColumnFilter column={column} />);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));
    expect(screen.getByText(/filter name/i)).toBeInTheDocument();
  });

  it("auto-adds a filter to store when popover opens with no existing filters", async () => {
    const column = makeColumn("text");
    render(<DataTableColumnFilter column={column} />);

    expect(useFilterStore.getState().filters).toHaveLength(0);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => {
      expect(useFilterStore.getState().filters).toHaveLength(1);
    });
  });

  it("newly auto-added filter has correct column id and default operator", async () => {
    const column = makeColumn("text");
    render(<DataTableColumnFilter column={column} />);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => {
      const filters = useFilterStore.getState().filters;
      expect(filters[0].id).toBe("name");
      expect(filters[0].variant).toBe("text");
      expect(filters[0].operator).toBe("iLike"); // default for text
    });
  });

  it("does not add duplicate filter when popover is opened while filters exist", async () => {
    useFilterStore.getState().addFilter({
      id: "name" as never,
      value: "existing",
      variant: "text",
      operator: "iLike",
      filterId: "existing-f",
    });
    const column = makeColumn("text");
    render(<DataTableColumnFilter column={column} />);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => {
      expect(useFilterStore.getState().filters).toHaveLength(1);
    });
  });
});

// ── Operator selector ─────────────────────────────────────────────────────────

describe("DataTableColumnFilter — operator selector", () => {
  it("renders operator select dropdown inside popover", async () => {
    const column = makeColumn("text");
    render(<DataTableColumnFilter column={column} />);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => {
      // Operator dropdown shows current operator label — for text, default is "iLike" → "Contains"
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  it("shows isEmpty placeholder when isEmpty operator is selected", async () => {
    useFilterStore.getState().addFilter({
      id: "name" as never,
      value: "",
      variant: "text",
      operator: "isEmpty",
      filterId: "f1",
    });
    const column = makeColumn("text");
    render(<DataTableColumnFilter column={column} />);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => {
      expect(screen.getByText("is empty")).toBeInTheDocument();
    });
  });
});

// ── Remove filter ─────────────────────────────────────────────────────────────

describe("DataTableColumnFilter — removing filters", () => {
  it("removes filter from store when trash button clicked", async () => {
    useFilterStore.getState().addFilter({
      id: "name" as never,
      value: "test",
      variant: "text",
      operator: "iLike",
      filterId: "f-remove",
    });
    const column = makeColumn("text");
    render(<DataTableColumnFilter column={column} />);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    const trashBtn = await screen.findByRole("button", { name: "" }); // Trash2 icon button
    await userEvent.click(trashBtn);

    await waitFor(() => {
      expect(useFilterStore.getState().filters).toHaveLength(0);
    });
  });
});

// ── Variant-specific inputs ───────────────────────────────────────────────────

describe("DataTableColumnFilter — text variant", () => {
  it("renders text input for text variant", async () => {
    const column = makeColumn("text");
    render(<DataTableColumnFilter column={column} />);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
  });

  it("updates filter value in store when typing in text input", async () => {
    const column = makeColumn("text");
    render(<DataTableColumnFilter column={column} />);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => screen.getByRole("textbox"));
    await userEvent.type(screen.getByRole("textbox"), "alice");

    await waitFor(() => {
      const filter = useFilterStore.getState().filters[0];
      expect(filter.value).toBe("alice");
    });
  });
});

describe("DataTableColumnFilter — boolean variant", () => {
  it("renders select (True/False) for boolean variant", async () => {
    const column = makeColumn("boolean");
    render(<DataTableColumnFilter column={column} />);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => {
      // Boolean renders a Select component
      expect(screen.getAllByRole("combobox").length).toBeGreaterThan(0);
    });
  });
});

describe("DataTableColumnFilter — select variant", () => {
  it("renders faceted option list for select variant", async () => {
    const column = makeColumn("select", {
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    });
    render(<DataTableColumnFilter column={column} />);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => {
      expect(screen.getByText(/select option/i)).toBeInTheDocument();
    });
  });
});

describe("DataTableColumnFilter — number variant with isBetween", () => {
  it("renders range inputs when operator is isBetween", async () => {
    useFilterStore.getState().addFilter({
      id: "name" as never,
      value: ["", ""],
      variant: "number",
      operator: "isBetween",
      filterId: "f-between",
    });
    const column = createMockColumn({
      id: "name",
      columnDef: {
        meta: { label: "Amount", variant: "number" },
        enableColumnFilter: true,
        accessorFn: () => undefined, // Fix: add dummy accessorFn
      },
    });
    render(<DataTableColumnFilter column={column} />);
    await userEvent.click(
      screen.getByRole("button", { name: /filter amount/i })
    );

    await waitFor(() => {
      // DataTableRangeFilter renders two number inputs with aria-label
      expect(
        screen.getByRole("spinbutton", { name: /minimum/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("spinbutton", { name: /maximum/i })
      ).toBeInTheDocument();
    });
  });
});
