"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  // Added w-full and a small gap between items if multiple exist
  return <AccordionPrimitive.Root data-slot="accordion" className="w-full space-y-2" {...props} />
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
  )
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
          "flex flex-1 items-center justify-between py-3 px-4 text-left text-sm font-medium transition-all outline-none",
          "bg-white border border-slate-200 rounded-lg shadow-sm", // White background and rounded corners
          "text-slate-600 hover:no-underline", // Text color and removing default underline
          "focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>div>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        {/* Chevron wrapped in a light gray circle to match the UI */}
        <div className="flex items-center justify-center size-7 rounded-full bg-slate-50 transition-colors">
            <ChevronDownIcon className="text-slate-400 size-4 transition-transform duration-200" />
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
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
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm bg-white rounded-b-lg border-x border-b border-slate-200 -mt-1"
      {...props}
    >
      <div className={cn("p-4 pt-2", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }