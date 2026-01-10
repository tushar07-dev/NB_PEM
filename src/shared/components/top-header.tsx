import { useEffect, useRef } from "react";
import { Bell, Search, Settings } from "lucide-react";
// import { Input } from "@/shared/components/ui/input";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";

const HeaderSearch = () => (
  <div 
    className={cn(
      "flex items-center justify-between border bg-accent-grey-50 px-4 transition-all duration-200",
      "border-accent-grey-275 rounded-fully-rounded", // #EBEBEB mapping
      
      // --- RESPONSIVE SIZING (No Clamp) ---
      "w-[var(--header-search-width-sm)] h-[var(--header-search-height-sm)]",
      "monitor:w-[var(--header-search-width-lg)] monitor:h-[var(--header-search-height-lg)]"
    )}
  >
    <input
      type="text"
      placeholder="Search Anything..."
      className={cn(
        "bg-transparent border-none outline-none w-full",
        "placeholder:text-accent-grey-500",
        
        // --- TYPOGRAPHY ---
        "text-primary-dark-blue-600",
        "font-family-base tracking-[-0.32px]",
        
        // SMALL (Laptop)
        "text-[12px] font-weight-400 leading-[19px]",
        
        // BIG (Monitor)
        "monitor:text-font-size-200 monitor:font-weight-500"
      )}
    />

    {/* Search Icon */}
    <Search 
      className={cn(
        "text-accent-grey-600 shrink-0 ml-2 transition-all", 
        
        // --- RESPONSIVE ICON SIZE ---
        "w-[var(--header-search-icon-sm)] h-[var(--header-search-icon-sm)]",
        "monitor:w-[var(--header-search-icon-lg)] monitor:h-[var(--header-search-icon-lg)]"
      )} 
    />
  </div>
);

function ActionButton({ icon: Icon }: { icon: any }) {
  return (
    <button
      className={cn(
        "flex items-center justify-center border-none cursor-pointer transition-all",
        
        // --- COLORS ---
        "bg-accent-grey-50 text-primary-dark-blue-600 hover:bg-accent-grey-100",

        // --- SMALL (Laptop/Default) ---
        "w-[var(--header-action-btn-size-sm)]",
        "h-[var(--header-action-btn-size-sm)]",
        "p-[var(--header-action-btn-padding-sm)]",
        "rounded-[var(--header-action-btn-radius-sm)]",
        "gap-[var(--header-action-btn-gap-sm)]",

        // --- LARGE (Monitor) ---
        "monitor:w-[var(--header-action-btn-size-lg)]",
        "monitor:h-[var(--header-action-btn-size-lg)]",
        "monitor:p-[var(--header-action-btn-padding-lg)]",
        "monitor:rounded-[var(--header-action-btn-radius-lg)]",
        "monitor:gap-[var(--header-action-btn-gap-lg)]"
      )}
    >
      <Icon className="w-full h-full" />
    </button>
  );
}

export function TopHeader() {
    const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const computedHeight = getComputedStyle(headerRef.current).height;
    console.log("Resolved header height:", computedHeight);
  }, []);

  return (
    <header 
      ref={headerRef}
      className="flex items-center justify-between bg-sidebar-accent w-full border-none shadow-sm shrink-0"
      style={{ height: 'var(--header-height)', padding: '0 var(--header-px)' }}
    >
      {/* Left Section: Logo & Fluid Title */}
      <div className="flex items-center">
        <div 
          className={cn(
            "flex items-center justify-center shrink-0 transition-all duration-200",
            // --- SMALL SIZE (Laptop/Default) ---
            "w-[var(--header-logo-icon-sm)] h-[var(--header-logo-icon-sm)]",
            // --- BIG SIZE (Monitor) ---
            "monitor:w-[var(--header-logo-icon-lg)] monitor:h-[var(--header-logo-icon-lg)]"
          )}
        >
          <Icons.ProjectLogo className="w-full h-full" />
        </div>
        <h1 
          className={cn(
            "font-family-heading capitalize whitespace-nowrap leading-normal transition-all duration-200",
            
            // Laptop (Small)
            "text-[16px] tracking-[var(--header-logo-letter-spacing-sm)] font-bold", 
            
            // Monitor (Large)
            "monitor:text-[24px] monitor:tracking-[var(--header-logo-letter-spacing-lg)]",

            // FORCE COLOR AT THE END
            "!text-white" 
          )}
          style={{ marginLeft: 'var(--header-gap-logo-text)' }}
        >
          PEM knowledge Base and Check Lists
        </h1>
      </div>

      {/* Right Section: Search & Actions */}
      <div className="flex items-center gap-4">
        <HeaderSearch />
        
        <div className="flex items-center" style={{ gap: 'var(--header-actions-gap)' }}>
          <ActionButton icon={Bell} />
          <ActionButton icon={Settings} />
        </div>

        {/* Profile Prefix */}
        <div 
          className={cn(
            "flex items-center justify-center shrink-0 border",
            
            // --- COLORS ---
            "bg-accent-grey-50 text-primary-dark-blue-900", 
            
            // --- SMALL SCREEN (Default / Laptop) ---
            "w-[var(--header-prefix-small)] h-[var(--header-prefix-small)]",
            "rounded-[var(--header-prefix-radius-small)]",
            "text-font-size-200 font-weight-600",
            
            // --- BIG SCREEN (Monitor: 1600px+) ---
            "monitor:w-[var(--header-prefix-big)]",
            "monitor:h-[var(--header-prefix-big)]",
            "monitor:rounded-[var(--header-prefix-radius-big)]",
            "monitor:text-font-size-400 monitor:font-weight-700"
          )}
        >
          XF
        </div>
      </div>
    </header>
  );
}

// Parent Namespace
export const PEM = {
  Header: TopHeader,
};