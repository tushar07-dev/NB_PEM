// src/shared/store/create-filter-store.ts
//
// Factory function that creates an isolated Zustand filter store instance.
// Used by FilterStoreProvider to give each DataTable its own store.
//
// The singleton useFilterStore in filter-store.ts is kept unchanged for
// any existing code that still imports it directly. New tables should
// use FilterStoreProvider instead.

import { createStore } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  ExtendedColumnFilter,
  JoinOperator,
} from "@/shared/types/data-table";

export interface FilterState<TData = unknown> {
  filters: ExtendedColumnFilter<TData>[];
  globalJoinOperator: JoinOperator;
  columnJoinOperators: Record<string, JoinOperator>;
  globalSearchTerm: string;
  setGlobalSearchTerm: (term: string) => void;

  setFilters: (
    filters:
      | ExtendedColumnFilter<TData>[]
      | ((prev: ExtendedColumnFilter<TData>[]) => ExtendedColumnFilter<TData>[])
  ) => void;
  setGlobalJoinOperator: (operator: JoinOperator) => void;
  setColumnJoinOperator: (columnId: string, operator: JoinOperator) => void;
  addFilter: (filter: ExtendedColumnFilter<TData>) => void;
  updateFilter: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
  ) => void;
  removeFilter: (filterId: string) => void;
  removeFiltersForColumn: (columnId: string) => void;
  resetFilters: () => void;
}

export type FilterStore = ReturnType<typeof createFilterStore>;

export function createFilterStore(name = "filter-store") {
  return createStore<FilterState>()(
    devtools(
      (set) => ({
        filters: [],
        globalJoinOperator: "and",
        columnJoinOperators: {},
        globalSearchTerm: "",

        setGlobalSearchTerm: (term) => {
          set({ globalSearchTerm: term });
        },

        setFilters: (filtersOrUpdater) => {
          set((state) => ({
            filters:
              typeof filtersOrUpdater === "function"
                ? filtersOrUpdater(state.filters)
                : filtersOrUpdater,
          }));
        },

        setGlobalJoinOperator: (operator) => {
          set({ globalJoinOperator: operator });
        },

        setColumnJoinOperator: (columnId, operator) => {
          set((state) => ({
            columnJoinOperators: {
              ...state.columnJoinOperators,
              [columnId]: operator,
            },
          }));
        },

        addFilter: (filter) => {
          set((state) => ({ filters: [...state.filters, filter] }));
        },

        updateFilter: (filterId, updates) => {
          set((state) => ({
            filters: state.filters.map((filter) =>
              filter.filterId === filterId ? { ...filter, ...updates } : filter
            ),
          }));
        },

        removeFilter: (filterId) => {
          set((state) => ({
            filters: state.filters.filter((f) => f.filterId !== filterId),
          }));
        },

        removeFiltersForColumn: (columnId) => {
          set((state) => ({
            filters: state.filters.filter((f) => f.id !== columnId),
          }));
        },

        resetFilters: () => {
          set({
            filters: [],
            globalJoinOperator: "and",
            columnJoinOperators: {},
            globalSearchTerm: "",
          });
        },
      }),
      { name }
    )
  );
}
