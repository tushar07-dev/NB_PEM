import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { ROLE_NAVIGATION } from "@/app/config/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const { pathname } = useLocation();
  const isCollapsed = state === "collapsed";

  // 1. Get the current user's role from AuthProvider
  const { currentUser } = useAuth();

  // 2. Get the specific menu items for this role (fallback to empty array)
  const menuItems = currentUser?.role
    ? ROLE_NAVIGATION[currentUser.role as keyof typeof ROLE_NAVIGATION]
    : [];

  return (
    <Sidebar collapsible="icon" className="bg-accent-grey-50 shadow-sidebar border-r-accent-grey-275">
      <SidebarContent className="p-1 monitor:p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={pathname === item.url}
                className="h-[40px] monitor:h-[60px]"
              >
                <Link to={item.url} className="flex items-center w-full">
                  <div
                    className={cn(
                      "flex items-center justify-center shrink-0 overflow-hidden",

                      // --- SMALL SCREEN (34.667px) ---
                      "w-[34.667px] h-[34.667px] p-[6.667px_8px] gap-[6.667px] rounded-[30px]",

                      // --- BIG SCREEN (52px) ---
                      "monitor:w-[52px] monitor:h-[52px] monitor:p-[10px_12px] monitor:gap-[10px] monitor:rounded-[30px]",

                      // Optional: Background/Border if needed to see the container shape
                      "bg-transparent"
                    )}
                  >
                    <item.icon
                      className="w-full h-full aspect-square"
                      strokeWidth={1.5}
                    />
                  </div>
                  {!isCollapsed && (
                    <span className={cn(
                      "truncate text-[16px] leading-normal",
                      
                      // --- COLORS ---
                      // "text-white", // Mapping to FFF / Grey-50
                      
                      // --- SMALL (Laptop) ---
                      "font-normal", // Weight 400
                      
                      // --- BIG (Monitor) ---
                      "monitor:font-medium monitor:text-center" // Weight 500 & Centered
                    )}>
                      {item.title}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-[6px] flex flex-col items-center justify-center">
        <SidebarMenu className="items-center">
          <SidebarMenuItem className="flex items-center justify-center w-full">
            <SidebarMenuButton
              tooltip={isCollapsed ? "Expand" : "Collapse"}
              onClick={toggleSidebar}
              className={cn(
                "flex items-center transition-all duration-200",
                // --- COLORS (Same for both) ---
                "bg-accent-grey-100 border border-accent-grey-250 rounded-radius-large",

                // --- SMALL SCREEN (Laptop) ---
                "rounded-[8px] border-[0.667px]",

                // --- BIG SCREEN (Monitor) ---
                "monitor:rounded-[12px] monitor:border-[1px]",

                // --- SPACING & SIZING ---
                "p-f-sm gap-f-xs",
                isCollapsed
                  ? "w-[49px] h-[40px] monitor:w-[74px] monitor:h-[60px] justify-center"
                  : "w-[197px] h-[40px] px-3 monitor:w-[254px] monitor:h-[60px]"
              )}
            >
              <div className="flex items-center justify-center shrink-0 w-[17px] h-[17px] monitor:w-[26px] monitor:h-[26px]">
                <Icons.SidebarToggle
                  isCollapsed={isCollapsed}
                  className="w-[14.44px] h-[14.44px] monitor:w-[21.66px] monitor:h-[21.66px] transition-all duration-200"
                />
              </div>

              {/* Text using Fluid Typography and Responsive Weight/Case */}
              {!isCollapsed && (
                <span className="ml-f-sm truncate text-sidebar-foreground text-[16px] font-normal monitor:font-medium monitor:uppercase">
                  Collapse
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
