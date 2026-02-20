// src/shared/components/app-sidebar.tsx
"use client";

import * as React from "react";
import { NavMain } from "@/shared/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { cn } from "@/shared/lib/utils";
import { Icons } from "./icons";
import { ROLE_NAVIGATION } from "@/app/config/navigation";
import { useAuth } from "@/app/providers/useAuth";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar();
  const { currentUser } = useAuth();
  const navigationData = React.useMemo(
    () => ROLE_NAVIGATION[currentUser?.role || "user"] || [],
    [currentUser?.role]
  );
  const isCollapsed = state === "collapsed";

  const userRole = currentUser?.role || "user";
  console.log("Current User Role:", userRole);
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="transition-[width] duration-200"
    >
      {/* Main Navigation */}
      <SidebarContent>
        <NavMain items={navigationData} />
      </SidebarContent>

      {/* Footer with Collapse/Expand Button */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              onClick={toggleSidebar}
              className={cn(
                "border-grey-275 bg-grey-100 hover:bg-grey-200",
                "transition-all duration-200",
                "justify-center md:justify-start",
                !isCollapsed && "justify-between"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center",
                    "md:h-9 md:w-9"
                  )}
                >
                  {isCollapsed ? (
                    <Icons.SidebarToggle
                    // className="text-grey-700 h-5 w-5"
                    />
                  ) : (
                    <Icons.SidebarToggle
                      isCollapsed
                      // className="text-grey-700 h-5 w-5"
                    />
                  )}
                </div>
                {!isCollapsed && (
                  <span className="text-grey-700 text-sm font-medium md:text-base">
                    Collapse
                  </span>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
