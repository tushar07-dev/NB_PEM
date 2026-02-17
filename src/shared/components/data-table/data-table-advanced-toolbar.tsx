"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

export function DataTableAdvancedToolbar({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        "flex w-full flex-wrap items-start justify-between gap-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
