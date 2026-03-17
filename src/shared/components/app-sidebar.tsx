// src/shared/components/app-sidebar.tsx
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
import { ROLE_NAVIGATION } from "@/shared/config/navigation";
import { useAuth } from "@/app/providers/useAuth";
import { ROLES } from "@/shared/types/roles";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar();
  const { currentUser } = useAuth();

  const navigationData = React.useMemo(
    () => ROLE_NAVIGATION[currentUser?.role ?? ROLES.USER] ?? [],
    [currentUser?.role]
  );

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="transition-[width] duration-200"
    >
      <SidebarContent>
        <NavMain items={navigationData} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              onClick={toggleSidebar}
              className={cn(
                "border-grey-275 bg-grey-100 hover:bg-grey-200",
                "transition-all duration-200",
                "justify-center lg:justify-start",
                !isCollapsed && "justify-between"
              )}
            >
              <div className="flex items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center",
                    " lg:h-9 lg:w-9 text-primary-400"
                  )}
                >
                  {isCollapsed ? (
                    <Icons.SidebarToggle />
                  ) : (
                    <Icons.SidebarToggle isCollapsed />
                  )}
                </div>
                {!isCollapsed && (
                  <span className="text-primary-400 text-sm font-medium lg:text-base">
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
