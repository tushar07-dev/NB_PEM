// src/shared/store/filter-store.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  useFilterStore,
  useFilters,
  useFiltersByColumn,
  useHasColumnFilter,
  useColumnFilterCount,
  useGlobalJoinOperator,
  useColumnJoinOperator,
  useFilterActions,
} from "@/shared/store/filter-store";
import type { ExtendedColumnFilter } from "@/shared/types/data-table";

function makeFilter(
  overrides: Partial<ExtendedColumnFilter<unknown>> = {}
): ExtendedColumnFilter<unknown> {
  return {
    id: "name" as never,
    value: "alice",
    variant: "text",
    operator: "iLike",
    filterId: "filter-001",
    ...overrides,
  };
}

beforeEach(() => {
  useFilterStore.getState().resetFilters();
});

// ── Initial state ─────────────────────────────────────────────────────────────

describe("filterStore — initial state", () => {
  it("starts with empty filters", () =>
    expect(useFilterStore.getState().filters).toEqual([]));
  it("starts with globalJoinOperator 'and'", () =>
    expect(useFilterStore.getState().globalJoinOperator).toBe("and"));
  it("starts with empty columnJoinOperators", () =>
    expect(useFilterStore.getState().columnJoinOperators).toEqual({}));
});

// ── addFilter ─────────────────────────────────────────────────────────────────

describe("filterStore — addFilter", () => {
  it("adds one filter", () => {
    act(() => useFilterStore.getState().addFilter(makeFilter()));
    expect(useFilterStore.getState().filters).toHaveLength(1);
  });

  it("appends without replacing existing filters", () => {
    act(() => {
      useFilterStore.getState().addFilter(makeFilter({ filterId: "f1" }));
      useFilterStore.getState().addFilter(makeFilter({ filterId: "f2" }));
    });
    expect(useFilterStore.getState().filters).toHaveLength(2);
  });
});

// ── updateFilter ──────────────────────────────────────────────────────────────

describe("filterStore — updateFilter", () => {
  it("updates value by filterId", () => {
    act(() => {
      useFilterStore
        .getState()
        .addFilter(makeFilter({ filterId: "f1", value: "old" }));
      useFilterStore.getState().updateFilter("f1", { value: "new" });
    });
    expect(useFilterStore.getState().filters[0].value).toBe("new");
  });

  it("updates operator", () => {
    act(() => {
      useFilterStore
        .getState()
        .addFilter(makeFilter({ filterId: "f1", operator: "iLike" }));
      useFilterStore.getState().updateFilter("f1", { operator: "eq" });
    });
    expect(useFilterStore.getState().filters[0].operator).toBe("eq");
  });

  it("does not affect other filters", () => {
    act(() => {
      useFilterStore
        .getState()
        .addFilter(makeFilter({ filterId: "f1", value: "alice" }));
      useFilterStore
        .getState()
        .addFilter(makeFilter({ filterId: "f2", value: "bob" }));
      useFilterStore.getState().updateFilter("f1", { value: "updated" });
    });
    expect(useFilterStore.getState().filters[1].value).toBe("bob");
  });

  it("no-op when filterId not found", () => {
    act(() => {
      useFilterStore
        .getState()
        .addFilter(makeFilter({ filterId: "f1", value: "original" }));
      useFilterStore
        .getState()
        .updateFilter("nonexistent", { value: "changed" });
    });
    expect(useFilterStore.getState().filters[0].value).toBe("original");
  });
});

// ── removeFilter ──────────────────────────────────────────────────────────────

describe("filterStore — removeFilter", () => {
  it("removes filter by filterId", () => {
    act(() => {
      useFilterStore.getState().addFilter(makeFilter({ filterId: "f1" }));
      useFilterStore.getState().removeFilter("f1");
    });
    expect(useFilterStore.getState().filters).toHaveLength(0);
  });

  it("only removes matching filter", () => {
    act(() => {
      useFilterStore.getState().addFilter(makeFilter({ filterId: "f1" }));
      useFilterStore.getState().addFilter(makeFilter({ filterId: "f2" }));
      useFilterStore.getState().removeFilter("f1");
    });
    expect(useFilterStore.getState().filters[0].filterId).toBe("f2");
  });
});

// ── removeFiltersForColumn ────────────────────────────────────────────────────

describe("filterStore — removeFiltersForColumn", () => {
  it("removes all filters for a column, keeps others", () => {
    act(() => {
      useFilterStore
        .getState()
        .addFilter(makeFilter({ filterId: "f1", id: "name" as never }));
      useFilterStore
        .getState()
        .addFilter(makeFilter({ filterId: "f2", id: "name" as never }));
      useFilterStore
        .getState()
        .addFilter(makeFilter({ filterId: "f3", id: "status" as never }));
      useFilterStore.getState().removeFiltersForColumn("name");
    });
    const filters = useFilterStore.getState().filters;
    expect(filters).toHaveLength(1);
    expect(filters[0].id).toBe("status");
  });
});

// ── setFilters ────────────────────────────────────────────────────────────────

describe("filterStore — setFilters", () => {
  it("replaces all filters with array", () => {
    act(() => {
      useFilterStore.getState().addFilter(makeFilter({ filterId: "old" }));
      useFilterStore.getState().setFilters([makeFilter({ filterId: "new" })]);
    });
    expect(useFilterStore.getState().filters[0].filterId).toBe("new");
  });

  it("accepts an updater function", () => {
    act(() => {
      useFilterStore
        .getState()
        .addFilter(makeFilter({ filterId: "f1", value: "original" }));
      useFilterStore
        .getState()
        .setFilters((prev) =>
          prev.map((f) => ({ ...f, value: "updated-by-fn" }))
        );
    });
    expect(useFilterStore.getState().filters[0].value).toBe("updated-by-fn");
  });
});

// ── resetFilters ──────────────────────────────────────────────────────────────

describe("filterStore — resetFilters", () => {
  it("clears filters, resets join operators to defaults", () => {
    act(() => {
      useFilterStore.getState().addFilter(makeFilter());
      useFilterStore.getState().setGlobalJoinOperator("or");
      useFilterStore.getState().setColumnJoinOperator("name", "or");
      useFilterStore.getState().resetFilters();
    });
    const s = useFilterStore.getState();
    expect(s.filters).toHaveLength(0);
    expect(s.globalJoinOperator).toBe("and");
    expect(s.columnJoinOperators).toEqual({});
  });
});

// ── join operators ────────────────────────────────────────────────────────────

describe("filterStore — join operators", () => {
  it("sets globalJoinOperator to 'or'", () => {
    act(() => useFilterStore.getState().setGlobalJoinOperator("or"));
    expect(useFilterStore.getState().globalJoinOperator).toBe("or");
  });

  it("sets per-column join operator", () => {
    act(() => useFilterStore.getState().setColumnJoinOperator("name", "or"));
    expect(useFilterStore.getState().columnJoinOperators["name"]).toBe("or");
  });

  it("does not affect other columns", () => {
    act(() => {
      useFilterStore.getState().setColumnJoinOperator("name", "or");
      useFilterStore.getState().setColumnJoinOperator("status", "and");
    });
    expect(useFilterStore.getState().columnJoinOperators["name"]).toBe("or");
    expect(useFilterStore.getState().columnJoinOperators["status"]).toBe("and");
  });
});

// ── Selector hooks ────────────────────────────────────────────────────────────

describe("filterStore — selector hooks", () => {
  it("useFilters returns current filters", () => {
    act(() => useFilterStore.getState().addFilter(makeFilter()));
    const { result } = renderHook(() => useFilters());
    expect(result.current).toHaveLength(1);
  });

  it("useFiltersByColumn returns only filters for given column", () => {
    act(() => {
      useFilterStore
        .getState()
        .addFilter(makeFilter({ filterId: "f1", id: "name" as never }));
      useFilterStore
        .getState()
        .addFilter(makeFilter({ filterId: "f2", id: "status" as never }));
    });
    const { result } = renderHook(() => useFiltersByColumn("name"));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe("name");
  });

  it("useHasColumnFilter true when filter exists", () => {
    act(() =>
      useFilterStore.getState().addFilter(makeFilter({ id: "name" as never }))
    );
    const { result } = renderHook(() => useHasColumnFilter("name"));
    expect(result.current).toBe(true);
  });

  it("useHasColumnFilter false when no filter", () => {
    const { result } = renderHook(() => useHasColumnFilter("name"));
    expect(result.current).toBe(false);
  });

  it("useColumnFilterCount returns correct count", () => {
    act(() => {
      useFilterStore
        .getState()
        .addFilter(makeFilter({ filterId: "f1", id: "name" as never }));
      useFilterStore
        .getState()
        .addFilter(makeFilter({ filterId: "f2", id: "name" as never }));
      useFilterStore
        .getState()
        .addFilter(makeFilter({ filterId: "f3", id: "status" as never }));
    });
    const { result } = renderHook(() => useColumnFilterCount("name"));
    expect(result.current).toBe(2);
  });

  it("useGlobalJoinOperator returns current operator", () => {
    act(() => useFilterStore.getState().setGlobalJoinOperator("or"));
    const { result } = renderHook(() => useGlobalJoinOperator());
    expect(result.current).toBe("or");
  });

  it("useColumnJoinOperator defaults to 'and' for unknown column", () => {
    const { result } = renderHook(() => useColumnJoinOperator("unknown-col"));
    expect(result.current).toBe("and");
  });

  it("useFilterActions returns all action functions", () => {
    const { result } = renderHook(() => useFilterActions());
    const fns = [
      "addFilter",
      "updateFilter",
      "removeFilter",
      "resetFilters",
      "setFilters",
      "setGlobalJoinOperator",
      "setColumnJoinOperator",
    ];
    for (const fn of fns) {
      expect(typeof result.current[fn as keyof typeof result.current]).toBe(
        "function"
      );
    }
  });
});
