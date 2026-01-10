import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"

// Design tokens from index.css - fallback values if not defined

const SIDEBAR_WIDTH = "222px" //not collapsed
const SIDEBAR_WIDTH_MONITOR = "270px" //not collapsed on monitor
const SIDEBAR_WIDTH_ICON = "60px" //collapsed
const SIDEBAR_WIDTH_ICON_MONITOR = "90px" //collapsed on monitor

console.log("SIDEBAR_WIDTH_ICON_MONITOR:", SIDEBAR_WIDTH_ICON, SIDEBAR_WIDTH_ICON_MONITOR);
console.log("SIDEBAR_WIDTH_MONITOR:", SIDEBAR_WIDTH, SIDEBAR_WIDTH_MONITOR);

type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.")
  return context
}

// --- PROVIDER ---
export const SidebarProvider = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { defaultOpen?: boolean }>(
  ({ defaultOpen = true, className, style, children, ...props }, ref) => {
    const [open, setOpen] = React.useState(defaultOpen)
    const toggleSidebar = React.useCallback(() => setOpen((prev) => !prev), [])
    const state = open ? "expanded" : "collapsed"

    return (
      <SidebarContext.Provider value={{ state, open, setOpen, toggleSidebar }}>
        <TooltipProvider delayDuration={200}>
          <div
            style={{ 
              "--sidebar-width": SIDEBAR_WIDTH, 
              "--sidebar-width-monitor": SIDEBAR_WIDTH_MONITOR,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON, 
              "--sidebar-width-icon-monitor": SIDEBAR_WIDTH_ICON_MONITOR, // Added this
              ...style 
            } as React.CSSProperties}
            className={cn("group/sidebar-wrapper flex w-full flex-1 overflow-hidden", className)}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)

// --- MAIN SIDEBAR CONTAINER ---
export const Sidebar = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { collapsible?: "icon" | "none" }>(
  ({ collapsible = "icon", className, children, ...props }, ref) => {
    const { state } = useSidebar();

    // Internal ref to access the DOM element for measuring
    const internalRef = React.useRef<HTMLDivElement>(null);
    
    // Merge the forwarded ref with our internal ref
    React.useImperativeHandle(ref, () => internalRef.current!);

    React.useEffect(() => {
      // Small timeout to allow the CSS transition (200ms) to complete
      const timer = setTimeout(() => {
        if (internalRef.current) {
          const width = internalRef.current.getBoundingClientRect().width;
          console.log(`Sidebar State: ${state} | Current Width: ${width.toFixed(2)}px`);
        }
      }, 250); // Slightly longer than transition duration

      return () => clearTimeout(timer);
    }, [state]); // Runs every time the sidebar expands or collapses

    return (
      <div
        ref={internalRef}
        className={cn(
          "group peer flex h-full flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-linear shrink-0",
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
        // style={{ width: state === "expanded" ? "var(--sidebar-width)" : "var(--sidebar-width-icon)" }}
      >
        <div className={cn("flex flex-1 flex-col overflow-hidden", className)} {...props}>
          {children}
        </div>
      </div>
    )
  }
)

// --- INSET (The Main Content Area) ---
export const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<"main">>(
  ({ className, ...props }, ref) => (
    <main
      ref={ref}
      className={cn("relative flex w-full flex-1 flex-col bg-background overflow-y-auto", className)}
      {...props}
    />
  )
)

// --- STRUCTURE COMPONENTS ---
export const SidebarContent = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2", className)} {...props} />
)

export const SidebarFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("flex flex-col gap-2 p-2 mt-auto w-full items-start", className)} {...props} />
)

export const SidebarMenu = ({ className, ...props }: React.ComponentProps<"ul">) => (
  <ul className={cn("flex w-full flex-col gap-1", className)} {...props} />
)

export const SidebarMenuItem = ({ className, ...props }: React.ComponentProps<"li">) => (
  <li className={cn("group/menu-item relative list-none", className)} {...props} />
)

// --- BUTTON LOGIC ---
const sidebarMenuButtonVariants = cva(
  "flex w-full items-center h-[60px] text-base transition-all duration-200 overflow-hidden outline-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: [
          "bg-transparent text-sidebar-foreground rounded-none",
          "hover:bg-sidebar-hover hover:text-sidebar-hover-foreground hover:rounded-[4px]",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:rounded-[8px] data-[active=true]:border-[#051320]",
        ].join(" "),
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean; isActive?: boolean; tooltip?: string }
>(({ asChild = false, isActive = false, tooltip, className, ...props }, ref) => {
  const { state } = useSidebar()
  const Comp = asChild ? Slot : "button"

  const button = (
    <Comp
      ref={ref}
      data-active={isActive}
      className={cn(
        sidebarMenuButtonVariants(), 
        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0", 
        className
      )}
      {...props}
    />
  )

  if (!tooltip || state !== "collapsed") return button

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center">{tooltip}</TooltipContent>
    </Tooltip>
  )
})

export const SidebarTrigger = () => {
  const { toggleSidebar } = useSidebar()
  return (
    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleSidebar}>
      <PanelLeft />
    </Button>
  )
}