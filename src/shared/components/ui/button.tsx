import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/10",
        outline: [
          // Shape & container
          "border border-[var(--color-primary-200)]",
          "bg-transparent",
          // "rounded-lg md:rounded-xl",
          "shadow-none",

          // Typography
          "uppercase",
          "text-[var(--color-primary-200)]",
          "font-[var(--font-weight-700)]",

          // Interaction
          "hover:bg-[var(--color-grey-100)]",
          "hover:text-[var(--color-primary-300)]",
          "active:scale-[0.98]",
        ],
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Responsive sizes (Mobile → Tablet → Desktop)
        sm: [
          "h-8 md:h-9",
          "px-2.5 md:px-3",
          "text-xs md:text-sm",
          "rounded-md",
          "[&_svg]:size-3 md:[&_svg]:size-3.5",
        ],
        default: [
          "h-9 md:h-10 lg:h-11",
          "px-3 md:px-4 lg:px-5",
          "text-sm md:text-base",
          "rounded-md md:rounded-lg",
          "[&_svg]:size-4 md:[&_svg]:size-4.5",
        ],
        lg: [
          "h-10 md:h-11 lg:h-12",
          "px-6 md:px-8 lg:px-10",
          "text-base md:text-lg",
          "rounded-lg md:rounded-xl",
          "[&_svg]:size-5 md:[&_svg]:size-5.5",
        ],
        icon: [
          // Base: 30px (Small screens < 1500px)
          "h-[30px] w-[30px]",
          "rounded-full", // Matching your header-pill style

          // Laptop: 44px (At 1500px)
          "lg:h-[44px] lg:w-[44px]",

          // Icon (SVG) scaling: size-4 (16px) on mobile, size-5 (20px) on laptop/monitor
          "[&_svg]:size-4 lg:[&_svg]:size-5",

          // Optional Monitor Scaling: 50px (At 1800px)
          "xl:h-[44px] xl:w-[44px] xl:[&_svg]:size-5",
        ],
        "fixed-sm": "h-8 px-3 text-xs rounded-md [&_svg]:size-3",
        "fixed-default": "h-9 px-4 text-sm rounded-md [&_svg]:size-4",
        "fixed-lg": "h-11 px-8 text-base rounded-lg [&_svg]:size-5",
        "fixed-icon": "h-9 w-9 rounded-md [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  helperText?: React.ReactNode;
  helperTextClassName?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      helperText,
      helperTextClassName,
      ...props
    },

    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <div className="flex flex-col gap-1">
        <Comp
          className={cn(buttonVariants({ variant, size }), className)}
          ref={ref}
          {...props}
        />
        {helperText && (
          <span
            className={cn(
              "text-muted-foreground text-xs",

              helperTextClassName
            )}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
