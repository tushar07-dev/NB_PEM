import { z } from "zod";
import { dataTableConfig } from "@/shared/config/data-table";

const sortItemSchema = z.object({
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

export type TSortSchemaItem = z.infer<typeof sortItemSchema>;
export type TFilterSchemaItem = z.infer<typeof filterItemSchema>;

export const tableSortSchema = z.array(sortItemSchema);
export const tableFilterSchema = z.array(filterItemSchema);
