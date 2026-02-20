// src/shared/lib/data-table/format.test.ts
import { describe, it, expect } from "vitest";
import { formatDate } from "@/shared/lib/data-table/format";

describe("formatDate", () => {
  it("formats a valid Date object", () => {
    const result = formatDate(new Date("2024-06-15"));
    expect(result).toContain("2024");
    expect(result).toContain("15");
  });

  it("formats a valid ISO date string", () => {
    expect(formatDate("2024-01-01")).toContain("2024");
  });

  it("formats a valid numeric timestamp", () => {
    expect(formatDate(new Date("2024-03-20").getTime())).toContain("2024");
  });

  it("returns empty string for undefined", () => {
    expect(formatDate(undefined)).toBe("");
  });

  it("returns empty string for an invalid date string", () => {
    expect(formatDate("not-a-date")).toBe("");
  });

  it("uses 'long' month by default", () => {
    const result = formatDate(new Date("2024-06-15"));
    // June is long form
    expect(result).toContain("June");
  });

  it("respects month: 'short' option", () => {
    const result = formatDate(new Date("2024-06-15"), { month: "short" });
    expect(result).toContain("Jun");
    expect(result).not.toContain("June");
  });

  it("respects year: '2-digit' option", () => {
    const result = formatDate(new Date("2024-06-15"), { year: "2-digit" });
    expect(result).toContain("24");
    expect(result).not.toContain("2024");
  });

  it("handles timestamp 0 (epoch) without throwing", () => {
    expect(typeof formatDate(0)).toBe("string");
  });
});
