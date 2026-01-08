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
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={pathname === item.url}
                className="h-15"
              >
                <Link to={item.url} className="flex items-center w-full ">
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: "52px",
                      height: "52px",
                      padding: "10px 14px",
                      borderRadius: "8px",
                    }}
                  >
                    <item.icon size={24} strokeWidth={1.5} />
                  </div>
                  {!isCollapsed && (
                    <span className="ml-1 text-base truncate font-medium">
                      {item.title}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={isCollapsed ? "Expand" : "Collapse"}
              onClick={toggleSidebar}
              style={{
                borderRadius: "12px",
                border: "1px solid #F3F3F3",
                background: "#F9F9F9",
              }}
            >
              <div className="flex items-center justify-center w-13 h-13 shrink-0">
                <Icons.SidebarToggle isCollapsed={isCollapsed} />
              </div>
              {!isCollapsed && (
                <span className="ml-1 text-[#394B5B]">Collapse</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
