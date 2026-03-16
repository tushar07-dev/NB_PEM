import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { DataTableColumnFilter } from "@/shared/components/data-table/data-table-column-filter";
import { createMockColumn } from "@/shared/components/__tests__/helpers/create-mock-table";
import { createFilterStore } from "@/shared/store/create-filter-store";
import { FilterStoreContext } from "@/shared/context/FilterStoreContext";
import type { FilterStore } from "@/shared/store/create-filter-store";

// useDebouncedCallback — bypass debounce so store updates are synchronous in tests
vi.mock("@/shared/hooks/data-table/use-debounced-callback", () => ({
  useDebouncedCallback: (fn: (...args: unknown[]) => unknown) => fn,
}));

// ── Per-test isolated store ───────────────────────────────────────────────────
// Each helper creates a FRESH store so tests never bleed into each other.

let testStore: FilterStore;

/**
 * Renders the component wrapped in its own isolated FilterStoreContext.
 * Always call this instead of bare render() so the component reads from
 * testStore, not the (non-existent) global singleton.
 */
function renderWithStore(ui: React.ReactElement) {
  testStore = createFilterStore("test");
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <FilterStoreContext.Provider value={testStore}>
        {children}
      </FilterStoreContext.Provider>
    );
  }
  return render(ui, { wrapper: Wrapper });
}

/**
 * Seed state BEFORE render when a test needs pre-existing filters.
 * Create the store first, seed it, then render manually with the same store.
 */
function renderWithSeededStore(
  ui: React.ReactElement,
  seed: (store: FilterStore) => void
) {
  testStore = createFilterStore("test");
  seed(testStore);
  return render(
    <FilterStoreContext.Provider value={testStore}>
      {ui}
    </FilterStoreContext.Provider>
  );
}

// Reset testStore reference between tests (store itself is always fresh via helpers above)
beforeEach(() => {
  testStore = createFilterStore("test");
});

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
    renderWithStore(<DataTableColumnFilter column={makeColumn("text")} />);
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
    const { container } = renderWithStore(
      <DataTableColumnFilter column={column} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("filter icon button has active class when column has filters", () => {
    renderWithSeededStore(
      <DataTableColumnFilter column={makeColumn("text")} />,
      (store) =>
        store.getState().addFilter({
          id: "name" as never,
          value: "alice",
          variant: "text",
          operator: "iLike",
          filterId: "f1",
        })
    );
    const btn = screen.getByRole("button", { name: /filter name/i });
    // The component uses "text-warning-900" when filters are active
    expect(btn).toHaveClass("text-warning-900");
  });
});

// ── Popover open/close ────────────────────────────────────────────────────────

describe("DataTableColumnFilter — popover behavior", () => {
  it("opens popover when filter button clicked", async () => {
    renderWithStore(<DataTableColumnFilter column={makeColumn("text")} />);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));
    expect(screen.getByText(/filter name/i)).toBeInTheDocument();
  });

  it("auto-adds a filter to store when popover opens with no existing filters", async () => {
    renderWithStore(<DataTableColumnFilter column={makeColumn("text")} />);

    expect(testStore.getState().filters).toHaveLength(0);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => {
      expect(testStore.getState().filters).toHaveLength(1);
    });
  });

  it("newly auto-added filter has correct column id and default operator", async () => {
    renderWithStore(<DataTableColumnFilter column={makeColumn("text")} />);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => {
      const filters = testStore.getState().filters;
      expect(filters[0].id).toBe("name");
      expect(filters[0].variant).toBe("text");
      expect(filters[0].operator).toBe("iLike");
    });
  });

  it("does not add duplicate filter when popover is opened while filters exist", async () => {
    renderWithSeededStore(
      <DataTableColumnFilter column={makeColumn("text")} />,
      (store) =>
        store.getState().addFilter({
          id: "name" as never,
          value: "existing",
          variant: "text",
          operator: "iLike",
          filterId: "existing-f",
        })
    );
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => {
      expect(testStore.getState().filters).toHaveLength(1);
    });
  });
});

// ── Operator selector ─────────────────────────────────────────────────────────

describe("DataTableColumnFilter — operator selector", () => {
  it("renders operator select dropdown inside popover", async () => {
    renderWithStore(<DataTableColumnFilter column={makeColumn("text")} />);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  it("shows isEmpty placeholder when isEmpty operator is selected", async () => {
    renderWithSeededStore(
      <DataTableColumnFilter column={makeColumn("text")} />,
      (store) =>
        store.getState().addFilter({
          id: "name" as never,
          value: "",
          variant: "text",
          operator: "isEmpty",
          filterId: "f1",
        })
    );
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => {
      expect(screen.getByText("is empty")).toBeInTheDocument();
    });
  });
});

// ── Remove filter ─────────────────────────────────────────────────────────────

describe("DataTableColumnFilter — removing filters", () => {
  it("removes filter from store when trash button clicked", async () => {
    renderWithSeededStore(
      <DataTableColumnFilter column={makeColumn("text")} />,
      (store) =>
        store.getState().addFilter({
          id: "name" as never,
          value: "test",
          variant: "text",
          operator: "iLike",
          filterId: "f-remove",
        })
    );
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    const trashBtn = await screen.findByRole("button", { name: "" });
    await userEvent.click(trashBtn);

    await waitFor(() => {
      expect(testStore.getState().filters).toHaveLength(0);
    });
  });
});

// ── Variant-specific inputs ───────────────────────────────────────────────────

describe("DataTableColumnFilter — text variant", () => {
  it("renders text input for text variant", async () => {
    renderWithStore(<DataTableColumnFilter column={makeColumn("text")} />);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
  });

  it("updates filter value in store when typing in text input", async () => {
    renderWithStore(<DataTableColumnFilter column={makeColumn("text")} />);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => screen.getByRole("textbox"));
    await userEvent.type(screen.getByRole("textbox"), "alice");

    await waitFor(() => {
      const filter = testStore.getState().filters[0];
      expect(filter.value).toBe("alice");
    });
  });
});

describe("DataTableColumnFilter — boolean variant", () => {
  it("renders select (True/False) for boolean variant", async () => {
    renderWithStore(<DataTableColumnFilter column={makeColumn("boolean")} />);
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => {
      expect(screen.getAllByRole("combobox").length).toBeGreaterThan(0);
    });
  });
});

describe("DataTableColumnFilter — select variant", () => {
  it("renders faceted option list for select variant", async () => {
    renderWithStore(
      <DataTableColumnFilter
        column={makeColumn("select", {
          options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ],
        })}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /filter name/i }));

    await waitFor(() => {
      expect(screen.getByText(/select option/i)).toBeInTheDocument();
    });
  });
});

describe("DataTableColumnFilter — number variant with isBetween", () => {
  it("renders range inputs when operator is isBetween", async () => {
    const column = createMockColumn({
      id: "name",
      columnDef: {
        meta: { label: "Amount", variant: "number" },
        enableColumnFilter: true,
        accessorFn: () => undefined,
      },
    });

    renderWithSeededStore(<DataTableColumnFilter column={column} />, (store) =>
      store.getState().addFilter({
        id: "name" as never,
        value: ["", ""],
        variant: "number",
        operator: "isBetween",
        filterId: "f-between",
      })
    );

    await userEvent.click(
      screen.getByRole("button", { name: /filter amount/i })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("spinbutton", { name: /minimum/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("spinbutton", { name: /maximum/i })
      ).toBeInTheDocument();
    });
  });
});
