import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

/**
 * SIDEBAR DIMENSIONS
 * Managed via CSS variables for responsive jumps on 'monitor' breakpoint
 */
const SIDEBAR_WIDTH = "222px";
const SIDEBAR_WIDTH_MONITOR = "270px";
const SIDEBAR_WIDTH_ICON = "60px";
const SIDEBAR_WIDTH_ICON_MONITOR = "90px";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within a SidebarProvider.");
  return context;
}

// --- PROVIDER ---
export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { defaultOpen?: boolean }
>(({ defaultOpen = true, className, style, children, ...props }, ref) => {
  const [open, setOpen] = React.useState(defaultOpen);
  const toggleSidebar = React.useCallback(() => setOpen((prev) => !prev), []);
  const state = open ? "expanded" : "collapsed";

  return (
    <SidebarContext.Provider value={{ state, open, setOpen, toggleSidebar }}>
      <TooltipProvider delayDuration={200}>
        <div
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-monitor": SIDEBAR_WIDTH_MONITOR,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              "--sidebar-width-icon-monitor": SIDEBAR_WIDTH_ICON_MONITOR,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex w-full flex-1 overflow-hidden",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
});

// --- MAIN SIDEBAR CONTAINER ---
export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { collapsible?: "icon" | "none" }
>(({ collapsible = "icon", className, children, ...props }, ref) => {
  const { state } = useSidebar();
  const internalRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => internalRef.current!);

  return (
    <div
      ref={internalRef}
      className={cn(
        "group peer flex h-full shrink-0 flex-col transition-[width] duration-200 ease-linear",
        // THEME INTEGRATION: Using variables instead of hardcoded bg-sidebar
        "border-[var(--color-grey-275)] bg-[var(--color-grey-50)]",

        // Expanded Widths
        "w-[var(--sidebar-width)]",
        "monitor:w-[var(--sidebar-width-monitor)]",

        // Collapsed Widths
        "data-[state=collapsed]:w-[var(--sidebar-width-icon)]",
        "monitor:data-[state=collapsed]:w-[var(--sidebar-width-icon-monitor)]",
        className
      )}
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
    >
      <div
        className={cn("flex flex-1 flex-col overflow-hidden", className)}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});

// --- INSET ---
export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => (
  <main
    ref={ref}
    className={cn(
      "bg-background relative flex w-full flex-1 flex-col overflow-y-auto",
      className
    )}
    {...props}
  />
));

// --- STRUCTURE COMPONENTS ---
export const SidebarContent = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    className={cn(
      "flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2",
      className
    )}
    {...props}
  />
);

export const SidebarFooter = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    className={cn(
      "mt-auto flex w-full flex-col items-start gap-2 p-2",
      className
    )}
    {...props}
  />
);

export const SidebarMenu = ({
  className,
  ...props
}: React.ComponentProps<"ul">) => (
  <ul className={cn("flex w-full flex-col gap-2", className)} {...props} />
);

export const SidebarMenuItem = ({
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    className={cn("group/menu-item relative list-none", className)}
    {...props}
  />
);

// --- BUTTON LOGIC (Theme Aware) ---
const sidebarMenuButtonVariants = cva(
  "flex w-full items-center gap-1.5 monitor:gap-2.5 transition-all duration-200 px-1.5 outline-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: [
          // BASE / DEFAULT STATE
          "bg-transparent text-[var(--color-primary-500)] font-medium text-[16px] leading-normal",
          "hover:rounded-[4px]",
          "hover:bg-[var(--color-grey-100)]",

          // ACTIVE / SELECTED STATE
          "data-[active=true]:rounded-[6px]",
          "data-[active=true]:border-[1px] data-[active=true]:border-[var(--color-primary-700)]",
          "data-[active=true]:bg-[var(--color-primary-600)]",
          "data-[active=true]:text-[var(--color-grey-50)]",
          "data-[active=true]:font-semibold",

          "monitor:data-[active=true]:rounded-[8px]",

          // Ensure icons inside active buttons inherit the color
          "data-[active=true]:[&_svg]:text-[var(--color-grey-50)]",
          "data-[active=true]:[&_div]:text-[var(--color-grey-50)]",
        ].join(" "),
      },
    },
    defaultVariants: { variant: "default" },
  }
);
export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string;
  }
>(
  (
    { asChild = false, isActive = false, tooltip, className, ...props },
    ref
  ) => {
    const { state } = useSidebar();
    const Comp = asChild ? Slot : "button";

    const button = (
      <Comp
        ref={ref}
        data-active={isActive}
        className={cn(
          sidebarMenuButtonVariants(),
          "group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-0",
          className
        )}
        {...props}
      />
    );

    if (!tooltip || state !== "collapsed") return button;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          className="border-none bg-[var(--color-primary-700)] text-[var(--color-grey-50)]"
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }
);

export const SidebarTrigger = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={toggleSidebar}
    >
      <PanelLeft className="text-[var(--color-primary-700)]" />
    </Button>
  );
};
