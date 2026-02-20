// src/shared/lib/data-table/data-table.test.ts
import { describe, it, expect } from "vitest";
import {
  applyFilterOperator,
  getValidFilters,
} from "@/shared/lib/data-table/data-table";
import type { ExtendedColumnFilter } from "@/shared/types/data-table";

function makeFilter(
  overrides: Partial<ExtendedColumnFilter<unknown>> = {}
): ExtendedColumnFilter<unknown> {
  return {
    id: "name" as never,
    value: "test",
    variant: "text",
    operator: "iLike",
    filterId: "f1",
    ...overrides,
  };
}

// ── applyFilterOperator ───────────────────────────────────────────────────────

describe("applyFilterOperator — isEmpty / isNotEmpty", () => {
  it("isEmpty returns true for empty string", () =>
    expect(applyFilterOperator("", "", "isEmpty")).toBe(true));
  it("isEmpty returns true for null", () =>
    expect(applyFilterOperator(null, "", "isEmpty")).toBe(true));
  it("isEmpty returns true for undefined", () =>
    expect(applyFilterOperator(undefined, "", "isEmpty")).toBe(true));
  it("isEmpty returns false for non-empty value", () =>
    expect(applyFilterOperator("hello", "", "isEmpty")).toBe(false));
  it("isNotEmpty returns true for non-empty value", () =>
    expect(applyFilterOperator("hello", "", "isNotEmpty")).toBe(true));
  it("isNotEmpty returns false for empty string", () =>
    expect(applyFilterOperator("", "", "isNotEmpty")).toBe(false));
});

describe("applyFilterOperator — text operators", () => {
  it("iLike matches case-insensitive substring", () =>
    expect(applyFilterOperator("Hello World", "hello", "iLike")).toBe(true));
  it("iLike returns false when substring absent", () =>
    expect(applyFilterOperator("Hello", "xyz", "iLike")).toBe(false));
  it("notILike returns true when substring absent", () =>
    expect(applyFilterOperator("Hello", "xyz", "notILike")).toBe(true));
  it("notILike returns false when substring present", () =>
    expect(applyFilterOperator("Hello", "hello", "notILike")).toBe(false));
  it("contains works like iLike", () =>
    expect(applyFilterOperator("abcdef", "bcd", "contains")).toBe(true));
  it("notContains returns true when absent", () =>
    expect(applyFilterOperator("abcdef", "xyz", "notContains")).toBe(true));
  it("startsWith matches beginning", () =>
    expect(applyFilterOperator("hello world", "hello", "startsWith")).toBe(
      true
    ));
  it("startsWith false when not at start", () =>
    expect(applyFilterOperator("hello world", "world", "startsWith")).toBe(
      false
    ));
  it("endsWith matches end", () =>
    expect(applyFilterOperator("hello world", "world", "endsWith")).toBe(true));
  it("endsWith false when not at end", () =>
    expect(applyFilterOperator("hello world", "hello", "endsWith")).toBe(
      false
    ));
  it("eq exact match case-insensitive", () =>
    expect(applyFilterOperator("Hello", "hello", "eq")).toBe(true));
  it("eq false for partial match", () =>
    expect(applyFilterOperator("Hello World", "hello", "eq")).toBe(false));
  it("notEq true when values differ", () =>
    expect(applyFilterOperator("hello", "world", "notEq")).toBe(true));
  it("notEq false when same", () =>
    expect(applyFilterOperator("hello", "hello", "notEq")).toBe(false));
  it("equals is alias for eq", () =>
    expect(applyFilterOperator("hello", "hello", "equals")).toBe(true));
  it("notEquals is alias for notEq", () =>
    expect(applyFilterOperator("hello", "world", "notEquals")).toBe(true));
});

describe("applyFilterOperator — numeric operators", () => {
  it("gt true when cell > filter", () =>
    expect(applyFilterOperator(10, "5", "gt")).toBe(true));
  it("gt false when cell = filter", () =>
    expect(applyFilterOperator(5, "5", "gt")).toBe(false));
  it("gte true when cell = filter", () =>
    expect(applyFilterOperator(5, "5", "gte")).toBe(true));
  it("gte true when cell > filter", () =>
    expect(applyFilterOperator(6, "5", "gte")).toBe(true));
  it("lt true when cell < filter", () =>
    expect(applyFilterOperator(3, "5", "lt")).toBe(true));
  it("lt false when cell = filter", () =>
    expect(applyFilterOperator(5, "5", "lt")).toBe(false));
  it("lte true when cell = filter", () =>
    expect(applyFilterOperator(5, "5", "lte")).toBe(true));
  it("lte true when cell < filter", () =>
    expect(applyFilterOperator(4, "5", "lte")).toBe(true));
});

describe("applyFilterOperator — isBetween", () => {
  it("true when value within range (inclusive)", () =>
    expect(applyFilterOperator(50, ["10", "100"], "isBetween")).toBe(true));
  it("true at lower bound", () =>
    expect(applyFilterOperator(10, ["10", "100"], "isBetween")).toBe(true));
  it("true at upper bound", () =>
    expect(applyFilterOperator(100, ["10", "100"], "isBetween")).toBe(true));
  it("false below range", () =>
    expect(applyFilterOperator(5, ["10", "100"], "isBetween")).toBe(false));
  it("false above range", () =>
    expect(applyFilterOperator(150, ["10", "100"], "isBetween")).toBe(false));
  it("graceful fallback when filter not array of 2", () =>
    expect(applyFilterOperator(50, "30", "isBetween")).toBe(true));
});

describe("applyFilterOperator — inArray / notInArray", () => {
  it("inArray true when value in array", () =>
    expect(
      applyFilterOperator("active", ["active", "pending"], "inArray")
    ).toBe(true));
  it("inArray false when value not in array", () =>
    expect(
      applyFilterOperator("archived", ["active", "pending"], "inArray")
    ).toBe(false));
  it("inArray case-insensitive", () =>
    expect(applyFilterOperator("ACTIVE", ["active"], "inArray")).toBe(true));
  it("notInArray true when value absent", () =>
    expect(
      applyFilterOperator("archived", ["active", "pending"], "notInArray")
    ).toBe(true));
  it("notInArray false when value present", () =>
    expect(
      applyFilterOperator("active", ["active", "pending"], "notInArray")
    ).toBe(false));
});

describe("applyFilterOperator — unknown operator fallback", () => {
  it("falls back to contains behavior", () =>
    expect(applyFilterOperator("hello world", "hello", "unknownOp")).toBe(
      true
    ));
  it("returns false when substring absent with unknown op", () =>
    expect(applyFilterOperator("hello world", "xyz", "unknownOp")).toBe(false));
});

// ── getValidFilters ───────────────────────────────────────────────────────────

describe("getValidFilters", () => {
  it("keeps filter with non-empty string value", () =>
    expect(getValidFilters([makeFilter({ value: "alice" })])).toHaveLength(1));
  it("removes filter with empty string value", () =>
    expect(getValidFilters([makeFilter({ value: "" })])).toHaveLength(0));
  it("removes filter with null value", () =>
    expect(
      getValidFilters([makeFilter({ value: null as never })])
    ).toHaveLength(0));
  it("removes filter with undefined value", () =>
    expect(
      getValidFilters([makeFilter({ value: undefined as never })])
    ).toHaveLength(0));
  it("keeps filter with non-empty array value", () =>
    expect(getValidFilters([makeFilter({ value: ["a"] })])).toHaveLength(1));
  it("removes filter with empty array value", () =>
    expect(getValidFilters([makeFilter({ value: [] })])).toHaveLength(0));
  it("always keeps isEmpty operator regardless of value", () =>
    expect(
      getValidFilters([makeFilter({ operator: "isEmpty", value: "" })])
    ).toHaveLength(1));
  it("always keeps isNotEmpty operator regardless of value", () =>
    expect(
      getValidFilters([makeFilter({ operator: "isNotEmpty", value: "" })])
    ).toHaveLength(1));

  it("filters mixed valid and invalid correctly", () => {
    const filters = [
      makeFilter({ filterId: "f1", value: "alice" }),
      makeFilter({ filterId: "f2", value: "" }),
      makeFilter({ filterId: "f3", value: ["x"] }),
      makeFilter({ filterId: "f4", value: [] }),
      makeFilter({ filterId: "f5", operator: "isEmpty", value: "" }),
    ];
    const result = getValidFilters(filters);
    expect(result.map((f) => f.filterId)).toEqual(["f1", "f3", "f5"]);
  });
});
