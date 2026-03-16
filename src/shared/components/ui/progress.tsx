import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/shared/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "border-border relative h-2 w-[175px] overflow-visible rounded-full border border-primary-800 bg-transparent",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="relative h-full overflow-hidden rounded-full transition-all"
      style={{
        width: `${value || 0}%`,
        background:
          "repeating-linear-gradient(-45deg, #039855 0px, #039855 2px, #ffffff 3px, #ffffff 6px)",
      }}
    >
      <span
        className="absolute top-1/2 -right-[6px] z-10 size-3.5 -translate-y-1/2 rounded-full border-2 border-white"
        style={{ backgroundColor: "#039855" }}
      />
    </ProgressPrimitive.Indicator>
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
