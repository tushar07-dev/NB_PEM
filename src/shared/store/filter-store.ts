import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useShallow } from "zustand/shallow";
import type {
  ExtendedColumnFilter,
  JoinOperator,
} from "@/shared/types/data-table";

interface FilterState<TData = unknown> {
  // Filter state
  filters: ExtendedColumnFilter<TData>[];
  globalJoinOperator: JoinOperator;
  columnJoinOperators: Record<string, JoinOperator>; // Per-column join operators

  // Actions
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

export const useFilterStore = create<FilterState>()(
  devtools(
    (set) => ({
      // Initial state
      filters: [],
      globalJoinOperator: "and",
      columnJoinOperators: {},

      // Actions
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
        set((state) => ({
          filters: [...state.filters, filter],
        }));
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
          filters: state.filters.filter(
            (filter) => filter.filterId !== filterId
          ),
        }));
      },

      removeFiltersForColumn: (columnId) => {
        set((state) => ({
          filters: state.filters.filter((filter) => filter.id !== columnId),
        }));
      },

      resetFilters: () => {
        set({
          filters: [],
          globalJoinOperator: "and",
          columnJoinOperators: {},
        });
      },
    }),
    { name: "filter-store" }
  )
);

// Selector hooks for performance optimization
export const useFilters = () =>
  useFilterStore(useShallow((state) => state.filters));

export const useGlobalJoinOperator = () =>
  useFilterStore((state) => state.globalJoinOperator);

export const useColumnJoinOperator = (columnId: string) =>
  useFilterStore((state) => state.columnJoinOperators[columnId] ?? "and");

export const useFilterActions = () =>
  useFilterStore(
    useShallow((state) => ({
      setFilters: state.setFilters,
      setGlobalJoinOperator: state.setGlobalJoinOperator,
      setColumnJoinOperator: state.setColumnJoinOperator,
      addFilter: state.addFilter,
      updateFilter: state.updateFilter,
      removeFilter: state.removeFilter,
      removeFiltersForColumn: state.removeFiltersForColumn,
      resetFilters: state.resetFilters,
    }))
  );

// Per-column filter selectors
export const useFiltersByColumn = (columnId: string) =>
  useFilterStore(
    useShallow((state) =>
      state.filters.filter((filter) => filter.id === columnId)
    )
  );

export const useHasColumnFilter = (columnId: string) =>
  useFilterStore((state) =>
    state.filters.some((filter) => filter.id === columnId)
  );

export const useColumnFilterCount = (columnId: string) =>
  useFilterStore(
    (state) => state.filters.filter((filter) => filter.id === columnId).length
  );
