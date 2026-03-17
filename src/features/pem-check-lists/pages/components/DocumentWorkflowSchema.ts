import { z } from "zod";

// ─── "Define" variant: only originator is required ────────────────────────────
export const defineSchema = z.object({
  originator: z.string().min(1, "Originator is required"),
  checker: z.string(),
  approver: z.string(),
});

// ─── "Send" variant: all three are required ───────────────────────────────────
export const sendSchema = z.object({
  originator: z.string().min(1, "Originator is required"),
  checker: z.string().min(1, "Checker is required"),
  approver: z.string().min(1, "Approver is required"),
});

// ResponsibilityValues is derived from the base (define) schema.
// Both schemas share the same field names and types.
export type ResponsibilityValues = z.infer<typeof defineSchema>;
