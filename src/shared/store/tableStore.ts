import { type VisibilityState } from "@tanstack/react-table";
import { useMemo } from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  ExtendedColumnFilter,
  ExtendedColumnSort,
} from "../types/data-table";

const TABLE_DEFAULT_DETAILS = {
  page: 1,
  perPage: 20,
  sorting: [] as ExtendedColumnSort<unknown>[],
  filters: [] as ExtendedColumnFilter<unknown>[],
  joinOperator: "and" as const,
  columnVisibility: {} as VisibilityState,
};

export interface TableDetails<T> {
  page: number;
  perPage: number;
  sorting: ExtendedColumnSort<T>[];
  filters: ExtendedColumnFilter<T>[];
  joinOperator: "and" | "or";
  columnVisibility: VisibilityState;
}

export interface TableState {
  tableDetails: Record<string, TableDetails<unknown>>;
}

export interface TableAction {
  setTableDetails: (key: string, details: TableDetails<unknown>) => void;
  setPage: (key: string, page: number) => void;
  setColumnVisibility: (key: string, visibility: VisibilityState) => void;
  setPerPage: (key: string, perPage: number) => void;
  setJoinOperator: (key: string, operator: "and" | "or") => void;
  setSorting: (key: string, sorting: ExtendedColumnSort<unknown>[]) => void;
  setFilters: (
    key: string,
    filters: ExtendedColumnFilter<unknown>[] | null
  ) => void;
  resetTableDetails: (key: string) => void;
}

interface TableStore extends TableState {
  actions: TableAction;
}

const TABLE_INITIAL_STATE: TableState = {
  tableDetails: {},
};

/** Ensures an entry exists for `key`, initialising it with defaults if not. */
function ensureEntry(
  state: TableState,
  key: string
): asserts state is TableState & {
  tableDetails: Record<string, TableDetails<unknown>>;
} {
  if (!state.tableDetails[key]) {
    state.tableDetails[key] = { ...TABLE_DEFAULT_DETAILS };
  }
}

const useTableStore = create<TableStore>()(
  devtools(
    immer((set) => ({
      ...TABLE_INITIAL_STATE,
      actions: {
        setTableDetails: (key, details) => {
          set((state) => {
            state.tableDetails[key] = details;
          });
        },
        resetTableDetails: (key) => {
          set((state) => {
            state.tableDetails[key] = { ...TABLE_DEFAULT_DETAILS };
          });
        },
        setPage: (key, page) => {
          set((state) => {
            ensureEntry(state, key);
            state.tableDetails[key].page = page;
          });
        },
        setColumnVisibility: (key, visibility) => {
          set((state) => {
            ensureEntry(state, key);
            state.tableDetails[key].columnVisibility = { ...visibility };
          });
        },
        setJoinOperator: (key, operator) => {
          set((state) => {
            ensureEntry(state, key);
            state.tableDetails[key].joinOperator = operator;
          });
        },
        setPerPage: (key, perPage) => {
          set((state) => {
            ensureEntry(state, key);
            state.tableDetails[key].perPage = perPage;
          });
        },
        setSorting: (key, sorting) => {
          set((state) => {
            ensureEntry(state, key);
            state.tableDetails[key].sorting = sorting;
          });
        },
        setFilters: (key, filters) => {
          set((state) => {
            ensureEntry(state, key);
            state.tableDetails[key].filters = filters ?? [];
          });
        },
      },
    }))
  )
);

export const useTableState = <T>(key: string): TableDetails<T> =>
  useTableStore((state) => {
    return (
      (state.tableDetails[key] as TableDetails<T>) ??
      (TABLE_DEFAULT_DETAILS as TableDetails<T>)
    );
  });

export const useTableActions = <T>(key: string) => {
  const actions = useTableStore((state) => state.actions);

  return useMemo(
    () => ({
      setPage: (page: number) => actions.setPage(key, page),
      setPerPage: (perPage: number) => actions.setPerPage(key, perPage),
      setColumnVisibility: (visibility: VisibilityState) =>
        actions.setColumnVisibility(key, visibility),
      setJoinOperator: (operator: "and" | "or") =>
        actions.setJoinOperator(key, operator),
      setSorting: (sorting: ExtendedColumnSort<T>[]) =>
        actions.setSorting(key, sorting as ExtendedColumnSort<unknown>[]),
      setFilters: (filters: ExtendedColumnFilter<T>[] | null) =>
        actions.setFilters(
          key,
          filters as ExtendedColumnFilter<unknown>[] | null
        ),
      resetTableDetails: () => actions.resetTableDetails(key),
      setTableDetails: (details: TableDetails<T>) =>
        actions.setTableDetails(key, details as TableDetails<unknown>),
    }),
    [actions, key]
  );
};
