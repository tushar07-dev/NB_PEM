"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  // Added w-full and a small gap between items if multiple exist
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className="w-full space-y-2"
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      // Removed the bottom border to allow the Trigger to define the shape
      className={cn("border-none", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          // Visual styles to match "Global Filter" image:
          "flex flex-1 items-center justify-between px-4 py-3 text-left text-sm font-medium transition-all outline-none",
          "bg-grey-50 text-slate-600 hover:no-underline", // White background and rounded corners
          // BORDER LOGIC:
          "border-t border-r border-l border-slate-200", // Top/Sides always present
          "data-[state=closed]:border-b", // Bottom border ONLY when closed

          // ROUNDING LOGIC:
          "rounded-t-lg", // Top corners always rounded
          "data-[state=closed]:rounded-b-lg",
          "focus-visible:ring-ring focus-visible:ring-2",
          "disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>div>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        {/* Chevron wrapped in a light gray circle to match the UI */}
        <div className="flex size-7 items-center justify-center rounded-full bg-slate-50 transition-colors">
          <ChevronDownIcon className="size-4 text-slate-400 transition-transform duration-200" />
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      // Added background and matching rounded bottom to connect with the trigger
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down bg-grey-50 -mt-1 overflow-hidden rounded-b-lg border-x border-b border-slate-200 text-sm"
      {...props}
    >
      <div className={cn("p-4 pt-2", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
