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
  const { currentUser } = useAuth();
  const isCollapsed = state === "collapsed";

  const menuItems = currentUser?.role
    ? ROLE_NAVIGATION[currentUser.role as keyof typeof ROLE_NAVIGATION]
    : [];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="monitor:p-2 p-1">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={pathname === item.url} // Logic trigger
                className="monitor:h-[60px] h-[40px]"
              >
                <Link to={item.url} className="flex w-full items-center">
                  {/* ICON BOX: Size jumps on monitor */}
                  <div className="monitor:h-[52px] monitor:w-[52px] flex h-[34.667px] w-[34.667px] shrink-0 items-center justify-center">
                    <item.icon className="aspect-square h-full w-full p-2" />
                  </div>

                  {/* LABEL: Typography jumps on monitor */}
                  {!isCollapsed && (
                    <span className="monitor:text-[16px] leading-lh-300 monitor:leading-lh-400 truncate text-[14px]">
                      {item.title}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="monitor:p-2 p-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={isCollapsed ? "Expand" : "Collapse"}
              onClick={toggleSidebar}
              className={cn(
                // Visual container (from design)
                "border-grey-250 bg-grey-100 border",
                "rounded-lg",
                // Same vertical rhythm as menu items
                "monitor:h-15 h-10"
              )}
            >
              {/* Icon box */}
              <div className="monitor:h-[52px] monitor:w-[52px] flex h-[34.667px] w-[34.667px] shrink-0 items-center justify-center">
                <Icons.SidebarToggle
                  isCollapsed={!isCollapsed}
                  size="md"
                  className="h-full w-full p-2"
                />
              </div>

              {/* Label (only when expanded) */}
              {!isCollapsed && (
                <span className="monitor:text-[16px] leading-lh-300 monitor:leading-lh-400 truncate text-[14px]">
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
