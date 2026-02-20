// src/shared/lib/data-table/filter-operators.test.ts
import { describe, it, expect } from "vitest";
import {
  getFilterOperators,
  getDefaultFilterOperator,
} from "@/shared/lib/data-table/data-table";
import { dataTableConfig } from "@/shared/config/data-table";

describe("getFilterOperators", () => {
  it("returns textOperators for 'text'", () =>
    expect(getFilterOperators("text")).toEqual(dataTableConfig.textOperators));
  it("returns numericOperators for 'number'", () =>
    expect(getFilterOperators("number")).toEqual(
      dataTableConfig.numericOperators
    ));
  it("returns numericOperators for 'range'", () =>
    expect(getFilterOperators("range")).toEqual(
      dataTableConfig.numericOperators
    ));
  it("returns dateOperators for 'date'", () =>
    expect(getFilterOperators("date")).toEqual(dataTableConfig.dateOperators));
  it("returns dateOperators for 'dateRange'", () =>
    expect(getFilterOperators("dateRange")).toEqual(
      dataTableConfig.dateOperators
    ));
  it("returns selectOperators for 'select'", () =>
    expect(getFilterOperators("select")).toEqual(
      dataTableConfig.selectOperators
    ));
  it("returns multiSelectOperators for 'multiSelect'", () =>
    expect(getFilterOperators("multiSelect")).toEqual(
      dataTableConfig.multiSelectOperators
    ));
  it("returns booleanOperators for 'boolean'", () =>
    expect(getFilterOperators("boolean")).toEqual(
      dataTableConfig.booleanOperators
    ));

  it("every variant returns at least one operator", () => {
    for (const variant of dataTableConfig.filterVariants) {
      expect(getFilterOperators(variant).length).toBeGreaterThan(0);
    }
  });

  it("every operator has label and value strings", () => {
    for (const op of getFilterOperators("text")) {
      expect(typeof op.label).toBe("string");
      expect(typeof op.value).toBe("string");
    }
  });

  it("text operators include isEmpty and isNotEmpty", () => {
    const values = getFilterOperators("text").map((o) => o.value);
    expect(values).toContain("isEmpty");
    expect(values).toContain("isNotEmpty");
  });

  it("numeric operators include isBetween", () => {
    expect(getFilterOperators("number").map((o) => o.value)).toContain(
      "isBetween"
    );
  });

  it("date operators include isRelativeToToday", () => {
    expect(getFilterOperators("date").map((o) => o.value)).toContain(
      "isRelativeToToday"
    );
  });

  it("multiSelect operators include inArray and notInArray", () => {
    const values = getFilterOperators("multiSelect").map((o) => o.value);
    expect(values).toContain("inArray");
    expect(values).toContain("notInArray");
  });

  it("boolean operators do NOT include isEmpty", () => {
    expect(getFilterOperators("boolean").map((o) => o.value)).not.toContain(
      "isEmpty"
    );
  });
});

describe("getDefaultFilterOperator", () => {
  it("text → 'iLike' (first in list)", () =>
    expect(getDefaultFilterOperator("text")).toBe("iLike"));
  it("number → 'eq'", () =>
    expect(getDefaultFilterOperator("number")).toBe("eq"));
  it("range → 'eq'", () =>
    expect(getDefaultFilterOperator("range")).toBe("eq"));
  it("date → 'eq'", () => expect(getDefaultFilterOperator("date")).toBe("eq"));
  it("dateRange → 'eq'", () =>
    expect(getDefaultFilterOperator("dateRange")).toBe("eq"));
  it("select → 'eq'", () =>
    expect(getDefaultFilterOperator("select")).toBe("eq"));
  it("multiSelect → 'notInArray' (first in list)", () =>
    expect(getDefaultFilterOperator("multiSelect")).toBe("notInArray"));
  it("boolean → 'eq'", () =>
    expect(getDefaultFilterOperator("boolean")).toBe("eq"));

  it("always returns a string for every variant", () => {
    for (const variant of dataTableConfig.filterVariants) {
      expect(typeof getDefaultFilterOperator(variant)).toBe("string");
    }
  });
});
