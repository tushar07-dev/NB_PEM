// src/shared/lib/data-table/compose-refs.test.ts
import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import React from "react";
import {
  composeRefs,
  useComposedRefs,
} from "@/shared/lib/data-table/compose-refs";

describe("composeRefs", () => {
  it("calls a callback ref with the node", () => {
    const cb = vi.fn();
    composeRefs(cb)(document.createElement("div"));
    expect(cb).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("sets RefObject.current with the node", () => {
    const ref = {
      current: null,
    } as React.MutableRefObject<HTMLDivElement | null>;
    const el = document.createElement("div");
    composeRefs(ref)(el);
    expect(ref.current).toBe(el);
  });

  it("composes multiple refs — all receive the same node", () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    const ref = {
      current: null,
    } as React.MutableRefObject<HTMLDivElement | null>;
    const el = document.createElement("div");
    composeRefs(cb1, cb2, ref)(el);
    expect(cb1).toHaveBeenCalledWith(el);
    expect(cb2).toHaveBeenCalledWith(el);
    expect(ref.current).toBe(el);
  });

  it("handles undefined refs without throwing", () => {
    expect(() =>
      composeRefs(undefined, undefined)(document.createElement("div"))
    ).not.toThrow();
  });

  it("passes null when node is null (unmount case)", () => {
    const ref = {
      current: document.createElement("div"),
    } as React.MutableRefObject<HTMLDivElement | null>;
    composeRefs(ref)(null as never);
    expect(ref.current).toBeNull();
  });
});

describe("useComposedRefs", () => {
  it("returns a function", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { result } = renderHook(() => useComposedRefs(ref));
    expect(typeof result.current).toBe("function");
  });

  it("sets all provided refs when called with a node", () => {
    const cb = vi.fn();
    const refObj = {
      current: null,
    } as React.MutableRefObject<HTMLDivElement | null>;
    const { result } = renderHook(() => useComposedRefs(cb, refObj));
    const el = document.createElement("div");
    result.current(el);
    expect(cb).toHaveBeenCalledWith(el);
    expect(refObj.current).toBe(el);
  });
});
