// src/shared/lib/data-table/parsers.test.ts
import { describe, it, expect } from "vitest";
import {
  parseSortingState,
  parseFiltersState,
  serializeSortingState,
  serializeFiltersState,
} from "@/shared/lib/data-table/parsers";

// ── parseSortingState ─────────────────────────────────────────────────────────

describe("parseSortingState", () => {
  it("parses valid sorting JSON", () => {
    const input = JSON.stringify([{ id: "name", desc: false }]);
    expect(parseSortingState(input)).toEqual([{ id: "name", desc: false }]);
  });

  it("parses multiple sort entries", () => {
    const input = JSON.stringify([
      { id: "name", desc: false },
      { id: "status", desc: true },
    ]);
    expect(parseSortingState(input)).toHaveLength(2);
  });

  it("returns null for invalid JSON", () => {
    expect(parseSortingState("not-json")).toBeNull();
  });

  it("returns null when desc is not boolean", () => {
    const bad = JSON.stringify([{ id: "name", desc: "false" }]);
    expect(parseSortingState(bad)).toBeNull();
  });

  it("returns null when column id not in allowed array", () => {
    const input = JSON.stringify([{ id: "secret", desc: true }]);
    expect(parseSortingState(input, ["name", "status"])).toBeNull();
  });

  it("returns result when column id is in allowed array", () => {
    const input = JSON.stringify([{ id: "name", desc: true }]);
    expect(parseSortingState(input, ["name", "status"])).toEqual([
      { id: "name", desc: true },
    ]);
  });

  it("accepts a Set as columnIds", () => {
    const input = JSON.stringify([{ id: "name", desc: false }]);
    expect(parseSortingState(input, new Set(["name"]))).toEqual([
      { id: "name", desc: false },
    ]);
  });
});

describe("serializeSortingState", () => {
  it("serializes to JSON and parses back correctly", () => {
    const input = [{ id: "name", desc: false }];
    expect(JSON.parse(serializeSortingState(input))).toEqual(input);
  });
});

// ── parseFiltersState ─────────────────────────────────────────────────────────

const validFilter = {
  id: "name",
  value: "alice",
  variant: "text",
  operator: "iLike",
  filterId: "f1",
};

describe("parseFiltersState", () => {
  it("parses a valid filter", () => {
    expect(parseFiltersState(JSON.stringify([validFilter]))).toEqual([
      validFilter,
    ]);
  });

  it("returns null for invalid JSON", () => {
    expect(parseFiltersState("not-json")).toBeNull();
  });

  it("returns null when required fields are missing", () => {
    const bad = JSON.stringify([{ id: "name", value: "x" }]);
    expect(parseFiltersState(bad)).toBeNull();
  });

  it("returns null when column id not in allowed set", () => {
    expect(
      parseFiltersState(JSON.stringify([validFilter]), ["status"])
    ).toBeNull();
  });

  it("returns result when column id is in allowed set", () => {
    expect(parseFiltersState(JSON.stringify([validFilter]), ["name"])).toEqual([
      validFilter,
    ]);
  });

  it("parses array filter value correctly", () => {
    const filter = {
      ...validFilter,
      value: ["a", "b"],
      variant: "multiSelect",
      operator: "inArray",
    };
    const result = parseFiltersState(JSON.stringify([filter]));
    expect(result?.[0].value).toEqual(["a", "b"]);
  });
});

describe("serializeFiltersState", () => {
  it("serializes filter state and parses back correctly", () => {
    const input = [
      {
        id: "name" as never,
        value: "alice",
        variant: "text" as const,
        operator: "iLike" as const,
        filterId: "f1",
      },
    ];
    expect(JSON.parse(serializeFiltersState(input))).toEqual(input);
  });
});
