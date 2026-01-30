import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
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
 */
const SIDEBAR_WIDTH = "250px";
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

  return (
    <div
      ref={ref}
      className={cn(
        "group peer flex h-full shrink-0 flex-col transition-[width] duration-200 ease-linear",
        "bg-background border-border border-r",
        "w-[var(--sidebar-width)]",
        "xl:w-[var(--sidebar-width-monitor)]",
        "data-[state=collapsed]:w-[var(--sidebar-width-icon)]",
        "xl:data-[state=collapsed]:w-[var(--sidebar-width-icon-monitor)]",
        className
      )}
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
    >
      <div className="flex flex-1 flex-col overflow-hidden" {...props}>
        {children}
      </div>
    </div>
  );
});

// --- GROUPS ---
export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group"
    className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
    {...props}
  />
));

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      className={cn(
        "text-primary-400/70 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium transition-[margin,opacity] duration-200 ease-linear",
        "group-data-[state=collapsed]:-mt-8 group-data-[state=collapsed]:opacity-0",
        className
      )}
      {...props}
    />
  );
});

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-full text-sm", className)} {...props} />
));

// --- STRUCTURE COMPONENTS ---
export const SidebarContent = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    className={cn(
      "flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2 group-data-[state=collapsed]:overflow-hidden",
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

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex w-full list-none flex-col gap-2", className)}
    {...props}
  />
));

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("group/menu-item relative list-none", className)}
    {...props}
  />
));

// --- BUTTON LOGIC ---
const sidebarMenuButtonVariants = cva(
  "flex w-full items-center gap-2.5 transition-all duration-200 px-3 py-2 outline-none disabled:opacity-50 rounded-lg",
  {
    variants: {
      variant: {
        default: [
          "bg-transparent text-primary-400 font-medium",
          "hover:bg-secondary hover:text-primary",
          // Update this part for the dark background design
          "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
          "data-[active=true]:[&_svg]:text-primary-foreground",
          "group-data-[state=open]/collapsible:bg-secondary-foreground group-data-[state=open]/collapsible:text-primary-foreground",
          "group-data-[state=open]/collapsible:[&_svg]:text-primary-foreground",
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
          // This ensures icons stay centered and the button doesn't stretch awkwardly
          "group-data-[state=collapsed]:w-full group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-0",
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
          className="bg-primary text-background border-none"
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }
);

// --- SUB MENU COMPONENTS ---
export const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    // Add relative positioning and a slight margin-left to make room for the line
    className={cn(
      "border-border relative ml-6 flex flex-col gap-1 border-l py-2",
      "group-data-[state=collapsed]:hidden",
      className
    )}
    {...props}
  />
));

export const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      "before:bg-border relative list-none before:absolute before:top-[14px] before:left-[-1px] before:h-[1px] before:w-3",
      className
    )}
    {...props}
  />
));

export const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean;
    isActive?: boolean;
  }
>(({ asChild = false, isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      data-active={isActive}
      className={cn(
        "text-primary-400 flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 text-sm transition-all outline-none",
        "hover:bg-secondary hover:text-primary",
        "data-[active=true]:text-primary data-[active=true]:font-medium",
        "group-data-[state=collapsed]:hidden",
        className
      )}
      {...props}
    />
  );
});

export const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:hover:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  );
});
SidebarRail.displayName = "SidebarRail";

export const SidebarTrigger = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={toggleSidebar}
    >
      <PanelLeft className="text-primary" />
    </Button>
  );
};

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
