// src/shared/context/FilterStoreContext.tsx
//
// React Context that provides an isolated filter store instance to all
// data-table components (useDataTable, DataTableFilterList,
// DataTableFilterMenu, DataTableColumnFilter).
//
// Every <FilterStoreProvider> creates its own store instance, so multiple
// tables on the same page (or across pages) never share filter state.
//
// Usage:
//   <FilterStoreProvider>
//     <DataTable table={table} ...>
//       <DataTableAdvancedToolbar table={table}>
//         <DataTableFilterList table={table} />
//       </DataTableAdvancedToolbar>
//     </DataTable>
//   </FilterStoreProvider>

import * as React from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/shallow";
import {
  createFilterStore,
  type FilterStore,
  type FilterState,
} from "@/shared/store/create-filter-store";

// ─── Context ─────────────────────────────────────────────────────────────────

const FilterStoreContext = React.createContext<FilterStore | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

interface FilterStoreProviderProps {
  children: React.ReactNode;
  /** Optional name shown in Zustand devtools — use the table's purpose e.g. "documents" */
  name?: string;
}

export function FilterStoreProvider({
  children,
  name,
}: FilterStoreProviderProps) {
  // useState lazy initializer — store is created exactly once per mount,
  // never re-created on re-render, and never accessed during render (no ref needed)
  const [store] = React.useState<FilterStore>(() =>
    createFilterStore(name ? `filter-store-${name}` : "filter-store")
  );

  return (
    <FilterStoreContext.Provider value={store}>
      {children}
    </FilterStoreContext.Provider>
  );
}

// ─── Hook — base (requires context) ──────────────────────────────────────────

function useFilterStoreContext() {
  const store = React.useContext(FilterStoreContext);
  if (!store) {
    throw new Error(
      "useFilterStoreContext: component must be inside <FilterStoreProvider>."
    );
  }
  return store;
}

// ─── Selector hooks (drop-in replacements for the old useFilterStore hooks) ──

export function useFilterContext<T>(selector: (state: FilterState) => T): T {
  return useStore(useFilterStoreContext(), selector);
}

export function useFiltersFromContext() {
  return useFilterContext(useShallow((s) => s.filters));
}

export function useGlobalJoinOperatorFromContext() {
  return useFilterContext((s) => s.globalJoinOperator);
}

export function useColumnJoinOperatorFromContext(columnId: string) {
  return useFilterContext((s) => s.columnJoinOperators[columnId] ?? "and");
}

export function useFilterActionsFromContext() {
  return useFilterContext(
    useShallow((s) => ({
      setFilters: s.setFilters,
      setGlobalJoinOperator: s.setGlobalJoinOperator,
      setColumnJoinOperator: s.setColumnJoinOperator,
      addFilter: s.addFilter,
      updateFilter: s.updateFilter,
      removeFilter: s.removeFilter,
      removeFiltersForColumn: s.removeFiltersForColumn,
      resetFilters: s.resetFilters,
    }))
  );
}

export function useFiltersByColumnFromContext(columnId: string) {
  return useFilterContext(
    useShallow((s) => s.filters.filter((f) => f.id === columnId))
  );
}

export function useHasColumnFilterFromContext(columnId: string) {
  return useFilterContext((s) => s.filters.some((f) => f.id === columnId));
}

export function useColumnFilterCountFromContext(columnId: string) {
  return useFilterContext(
    (s) => s.filters.filter((f) => f.id === columnId).length
  );
}

export function useColumnJoinOperatorsFromContext() {
  return useFilterContext(useShallow((s) => s.columnJoinOperators));
}

export function useGlobalSearchTermFromContext() {
  return useFilterContext(
    useShallow((s) => ({
      globalSearchTerm: s.globalSearchTerm,
      setGlobalSearchTerm: s.setGlobalSearchTerm,
    }))
  );
}
