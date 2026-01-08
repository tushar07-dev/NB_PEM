import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/shared/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        // Core Layout
        "z-50 overflow-hidden inline-flex items-center justify-center gap-1",
        // Sizing & Spacing (Padding: 4px 10px)
        "px-2.5 py-1 rounded-lg",
        // Light Theme: Background #FFF + Shadow
        "bg-[#FFF] text-[#394B5B] shadow-[0_0_20px_0_rgba(0,0,0,0.06)]",
        // Dark Theme: Background #203446
        "dark:bg-[#203446] dark:text-white dark:border dark:border-[#2D455C]",
        // Typography
        "text-xs font-medium",
        // Animations
        "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
