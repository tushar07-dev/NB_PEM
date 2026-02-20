// src/shared/lib/data-table/id.test.ts
import { describe, it, expect } from "vitest";
import { generateId } from "@/shared/lib/data-table/id";

describe("generateId", () => {
  it("generates a non-empty string", () => {
    expect(typeof generateId()).toBe("string");
    expect(generateId().length).toBeGreaterThan(0);
  });

  it("generates unique ids on 20 consecutive calls", () => {
    const ids = new Set(Array.from({ length: 20 }, () => generateId()));
    expect(ids.size).toBe(20);
  });

  it("uses default length of 12", () => {
    expect(generateId().length).toBe(12);
  });

  it("respects custom length option", () => {
    expect(generateId({ length: 8 }).length).toBe(8);
  });

  it("respects length: 16", () => {
    expect(generateId({ length: 16 }).length).toBe(16);
  });

  it("does not include separator when prefix not in prefixes map", () => {
    // Unknown prefix falls through to plain id — no separator
    const id = generateId("unknown" as never);
    expect(id.length).toBe(12);
    expect(id).not.toContain("_");
  });
});
