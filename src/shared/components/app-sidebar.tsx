import { Link, useLocation } from "react-router-dom"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar"
import { ROLE_NAVIGATION } from "@/app/config/navigation"
import { useAuth } from "@/app/providers/AuthProvider"

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar()
  const { pathname } = useLocation()
  const isCollapsed = state === "collapsed"

  // 1. Get the current user's role from AuthProvider
  const { currentUser } = useAuth()
  
  // 2. Get the specific menu items for this role (fallback to empty array)
  const menuItems = currentUser?.role ? ROLE_NAVIGATION[currentUser.role as keyof typeof ROLE_NAVIGATION] : []

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    // isActive triggers your 8px radius + navy background
                    isActive={pathname === item.url}
                  >
                    {/* Use Link instead of <a> for SPA navigation */}
                    <Link to={item.url} className="flex justify-start w-full items-center gap-1">
                      <item.icon className="ml-2.5" size={24} />
                      <span className="text-base truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={toggleSidebar}
              tooltip={isCollapsed ? "Expand" : "Collapse"}
              className="bg-[#F6F6F6] border border-transparent text-[#394B5B]"
            >
              {isCollapsed ? (
                <PanelLeftOpen size={24} strokeWidth={1.5} />
              ) : (
                <div className="flex items-center gap-4">
                  <PanelLeftClose size={24} strokeWidth={1.5} />
                  <span className="text-base">Collapse</span>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}