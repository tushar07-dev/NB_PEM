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

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isMobile: boolean;
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
  const [isMobile, setIsMobile] = React.useState(false);

  const toggleSidebar = React.useCallback(() => setOpen((prev) => !prev), []);
  const state = open ? "expanded" : "collapsed";

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 800);
      if (window.innerWidth < 800) {
        setOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <SidebarContext.Provider
      value={{ state, open, setOpen, toggleSidebar, isMobile }}
    >
      <TooltipProvider delayDuration={200}>
        <div
          style={
            {
              "--sidebar-width": "280px", // 800-1500px expanded
              "--sidebar-width-lg": "330px", // 1500px+ expanded
              "--sidebar-width-icon": "90px", // 800-1500px collapsed
              "--sidebar-width-icon-lg": "90px", // 1500px+ collapsed
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
SidebarProvider.displayName = "SidebarProvider";

// --- MAIN SIDEBAR CONTAINER ---
export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { collapsible?: "icon" | "none" }
>(({ collapsible = "icon", className, children, ...props }, ref) => {
  const { state } = useSidebar();

  return (
    <>
      <div
        ref={ref}
        className={cn(
          "group peer flex h-full shrink-0 flex-col transition-all duration-300 ease-in-out",
          "border-grey-200 bg-grey-50 border-r",
          "fixed top-0 left-0 z-50 md:relative",

          // Expanded widths: 280px (800-1500px) → 330px (1500px+)
          "w-[var(--sidebar-width)]",
          "lg:w-[var(--sidebar-width-lg)]",

          // Collapsed widths: 60px (800-1500px) → 90px (1500px+)
          "data-[state=collapsed]:w-[var(--sidebar-width-icon)]",
          "lg:data-[state=collapsed]:w-[var(--sidebar-width-icon-lg)]",

          // Mobile: slide off-screen when collapsed
          "data-[state=collapsed]:-translate-x-full md:data-[state=collapsed]:translate-x-0",
          className
        )}
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
      >
        <div className="flex flex-1 flex-col overflow-hidden" {...props}>
          {children}
        </div>
      </div>
    </>
  );
});
Sidebar.displayName = "Sidebar";

// --- GROUPS ---
export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group"
    className={cn("relative flex w-full min-w-0 flex-col gap-1 p-2", className)}
    {...props}
  />
));
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      className={cn(
        "text-grey-500 flex h-8 shrink-0 items-center px-3 text-xs font-semibold tracking-wider uppercase transition-[margin,opacity] duration-200 ease-linear",
        "group-data-[state=collapsed]:h-0 group-data-[state=collapsed]:overflow-hidden group-data-[state=collapsed]:opacity-0",
        className
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full text-sm md:text-base", className)}
    {...props}
  />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

// --- STRUCTURE COMPONENTS ---
export const SidebarHeader = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    className={cn(
      "border-grey-200 flex items-center gap-3 border-b p-4 md:p-5",
      className
    )}
    {...props}
  />
);

export const SidebarContent = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    className={cn(
      "flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-3 md:p-0",
      "group-data-[state=collapsed]:overflow-hidden",
      // Custom scrollbar
      "scrollbar-thin scrollbar-thumb-grey-300 scrollbar-track-transparent",
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
      "border-grey-200 mt-auto flex w-full flex-col items-start gap-2 p-3 md:p-4",
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
SidebarMenu.displayName = "SidebarMenu";

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
SidebarMenuItem.displayName = "SidebarMenuItem";

// --- BUTTON LOGIC ---
const sidebarMenuButtonVariants = cva(
  "flex w-full items-center gap-3 transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: [
          "bg-transparent text-grey-700 font-medium",
          "hover:bg-grey-100 hover:text-grey-900",
          "rounded-lg px-3 py-2.5 md:py-3",
          // Active state - dark background like in the image
          // "data-[active=true]:bg-primary-600 data-[active=true]:border-primary-600 data-[active=true]:text-white",
          // "data-[active=true]:[&_svg]:text-white",
          // Open collapsible state
          "group-data-[state=open]/collapsible:bg-grey-50",
        ].join(" "),
      },
      size: {
        default: "h-15",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof sidebarMenuButtonVariants> & {
      asChild?: boolean;
      isActive?: boolean;
      tooltip?: string;
    }
>(
  (
    {
      asChild = false,
      isActive = false,
      tooltip,
      className,
      variant,
      size,
      ...props
    },
    ref
  ) => {
    const { state } = useSidebar();
    const Comp = asChild ? Slot : "button";

    const button = (
      <Comp
        ref={ref}
        data-active={isActive}
        className={cn(
          sidebarMenuButtonVariants({ variant, size }),
          "group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2",
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
          className="bg-grey-900 border-none font-medium text-white"
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

// --- SUB MENU COMPONENTS ---
export const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "border-grey-200 relative ml-6 flex flex-col gap-0.5 border-l-2 py-2 md:ml-5",
      "group-data-[state=collapsed]:hidden",
      className
    )}
    {...props}
  />
));
SidebarMenuSub.displayName = "SidebarMenuSub";

export const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      "relative list-none",
      // "before:absolute before:top-1/2 before:left-[-2px] before:-translate-y-1/2",
      // "before:h-[1px] before:w-4 before:bg-grey-200",
      className
    )}
    {...props}
  />
));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

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
        "text-grey-600 md:text-font-size-100 flex h-9 min-w-0 items-center gap-2 overflow-hidden rounded-md text-sm transition-all outline-none md:h-10",
        "hover:text-grey-900",
        // Active state - light background for sub-items
        // "data-[active=true]:bg-grey-100 data-[active=true]:text-grey-900 data-[active=true]:font-semibold",
        "group-data-[state=collapsed]:hidden",
        className
      )}
      {...props}
    />
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

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
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-[2px]",
        "hover:after:bg-grey-300",
        "group-data-[side=left]:-right-4",
        "md:flex",
        className
      )}
      {...props}
    />
  );
});
SidebarRail.displayName = "SidebarRail";

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8 md:h-9 md:w-9", className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="text-grey-700 h-5 w-5" />
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => (
  <main
    ref={ref}
    className={cn(
      "bg-grey-100 relative flex w-full flex-1 flex-col overflow-y-auto",
      "transition-all duration-300",
      className
    )}
    {...props}
  />
));
SidebarInset.displayName = "SidebarInset";
