import { createParser } from "nuqs/server";
import { z } from "zod";

import { tableFilterSchema } from "@/shared/schema/api";
import type {
  ExtendedColumnFilter,
  ExtendedColumnSort,
} from "@/shared/types/data-table";
import { type VisibilityState } from "@tanstack/react-table";

const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

export const getSortingStateParser = <TData>(
  columnIds?: string[] | Set<string>
) => {
  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null;

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(sortingItemSchema).safeParse(parsed);

        if (!result.success) return null;

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        return result.data as ExtendedColumnSort<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (item, index) =>
          item.id === b[index]?.id && item.desc === b[index]?.desc
      ),
  });
};

const columnVisibilitySchema = z.record(z.string(), z.boolean());

export const getColumnVisibilityStateParser = (
  columnIds?: string[] | Set<string>
) => {
  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null;

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = columnVisibilitySchema.safeParse(parsed);

        if (!result.success) return null;

        if (validKeys) {
          for (let key in result.data) {
            if (!validKeys.has(key)) {
              return null;
            }
          }
        }

        return result.data as VisibilityState;
      } catch {
        return null;
      }
    },
    serialize: (value) => {
      let allColumnAreVisible = true;
      for (let key in value) {
        if (!value[key]) {
          allColumnAreVisible = false;
        }
      }
      return allColumnAreVisible ? "{}" : JSON.stringify(value);
    },
  });
};

export const getFiltersStateParser = <TData>(
  columnIds?: string[] | Set<string>
) => {
  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null;

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = tableFilterSchema.safeParse(parsed);

        if (!result.success) return null;

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        return result.data as ExtendedColumnFilter<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (filter, index) =>
          filter.id === b[index]?.id &&
          filter.value === b[index]?.value &&
          filter.variant === b[index]?.variant &&
          filter.operator === b[index]?.operator
      ),
  });
};
