import { z } from "zod";

import { dataTableConfig } from "@/shared/config/data-table";
import type {
  ExtendedColumnFilter,
  ExtendedColumnSort,
} from "@/shared/types/data-table";

const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

const filterItemSchema = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  variant: z.enum(dataTableConfig.filterVariants),
  operator: z.enum(dataTableConfig.operators),
  filterId: z.string(),
});

export type FilterItemSchema = z.infer<typeof filterItemSchema>;

export const parseSortingState = <TData>(
  value: string,
  columnIds?: string[] | Set<string>
): ExtendedColumnSort<TData>[] | null => {
  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null;

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
};

export const serializeSortingState = <TData>(
  value: ExtendedColumnSort<TData>[]
): string => JSON.stringify(value);

export const parseFiltersState = <TData>(
  value: string,
  columnIds?: string[] | Set<string>
): ExtendedColumnFilter<TData>[] | null => {
  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null;

  try {
    const parsed = JSON.parse(value);
    const result = z.array(filterItemSchema).safeParse(parsed);

    if (!result.success) return null;

    if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
      return null;
    }

    return result.data as ExtendedColumnFilter<TData>[];
  } catch {
    return null;
  }
};

export const serializeFiltersState = <TData>(
  value: ExtendedColumnFilter<TData>[]
): string => JSON.stringify(value);
