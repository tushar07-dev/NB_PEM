// src/shared/hooks/use-breakpoint.ts
import { useState, useEffect } from "react";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export function useBreakpoint() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    const observer = new ResizeObserver(handler);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);

  return {
    width,
    isLg: width >= BREAKPOINTS.lg,
    isXl: width >= BREAKPOINTS.xl,
    is2xl: width >= BREAKPOINTS["2xl"],
    isMd: width >= BREAKPOINTS.md,
  };
}