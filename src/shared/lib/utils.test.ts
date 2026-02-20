// src/shared/lib/utils.test.ts
import { describe, it, expect } from "vitest";
import { cn } from "@/shared/lib/utils";

describe("cn", () => {
  it("merges multiple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("deduplicates conflicting Tailwind classes — last wins", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
  });

  it("ignores falsy values", () => {
    expect(cn("base", false && "skip", "active")).toBe("base active");
  });

  it("handles undefined and null gracefully", () => {
    expect(cn("a", undefined, null as never, "b")).toBe("a b");
  });

  it("handles object syntax — includes truthy, skips falsy", () => {
    expect(cn({ "text-red-500": true, "text-blue-500": false })).toBe(
      "text-red-500"
    );
  });

  it("handles array syntax", () => {
    expect(cn(["flex", "items-center"])).toBe("flex items-center");
  });

  it("returns empty string with no arguments", () => {
    expect(cn()).toBe("");
  });

  it("resolves text-color conflict — last wins", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });
});
