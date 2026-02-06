"use client";

import * as React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { ChevronRight, ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string; isActive?: boolean }[];
  roles?: ("admin" | "user")[]; // Role-based access
};

export function NavMain({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  const { pathname } = useLocation();
  const { state, setOpen } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Track which menus are currently open (Multiple menus can be open)
  const [openMenus, setOpenMenus] = React.useState<Set<string>>(new Set());

  // Automatically open the menu that contains the active child route on load
  React.useEffect(() => {
    const activeItem = items.find(
      (item) =>
        item.items?.some((sub) => sub.url === pathname) || item.url === pathname
    );
    if (activeItem && !isCollapsed) {
      setOpenMenus((prev) => new Set(prev).add(activeItem.title));
    }
  }, [pathname, items, isCollapsed]);

  // Close all menus when sidebar collapses
  React.useEffect(() => {
    if (isCollapsed) {
      setOpenMenus(new Set());
    }
  }, [isCollapsed]);

  // Handle click when sidebar is collapsed - expand sidebar
  const handleCollapsedClick = (item: NavItem) => {
    if (isCollapsed) {
      setOpen(true);
      // Set this menu as open after a brief delay to allow sidebar to expand
      setTimeout(() => {
        if (item.items && item.items.length > 0) {
          setOpenMenus((prev) => new Set(prev).add(item.title));
        }
      }, 150);
    }
  };

  // Toggle menu open/close state
  const toggleMenu = (title: string, isOpen: boolean) => {
    setOpenMenus((prev) => {
      const newSet = new Set(prev);
      if (isOpen) {
        newSet.add(title);
      } else {
        newSet.delete(title);
      }
      return newSet;
    });
  };

  return (
    <SidebarGroup className={className}>
      <SidebarMenu>
        {items.map((item) => {
          const isMenuOpen = openMenus.has(item.title);
          const hasActiveChild = item.items?.some(
            (sub) => sub.url === pathname
          );
          const isParentActive = item.url === pathname;
          const hasSubItems = item.items && item.items.length > 0;

          return (
            <Collapsible
              key={item.title}
              asChild
              open={isMenuOpen && !isCollapsed}
              onOpenChange={(isOpen) => {
                if (!isCollapsed) {
                  toggleMenu(item.title, isOpen);
                }
              }}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {hasSubItems ? (
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isParentActive || hasActiveChild || isMenuOpen}
                      className={cn(
                        "group",
                        (isParentActive || hasActiveChild || isMenuOpen) &&
                          "font-semibold"
                      )}
                      onClick={() => handleCollapsedClick(item)}
                    >
                      {item.icon && (
                        <item.icon className="h-5 w-5 shrink-0 md:h-5 md:w-5" />
                      )}
                      <span className="truncate text-sm group-data-[state=collapsed]:hidden md:text-base">
                        {item.title}
                      </span>
                      <ChevronRight
                        className={cn(
                          "ml-auto h-4 w-4 shrink-0 transition-transform duration-200",
                          "group-data-[state=collapsed]:hidden",
                          "group-data-[state=open]/collapsible:rotate-90"
                        )}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                ) : (
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isParentActive}
                    className="group"
                    onClick={() => handleCollapsedClick(item)}
                  >
                    <NavLink to={item.url}>
                      {item.icon && (
                        <item.icon className="h-5 w-5 shrink-0 md:h-5 md:w-5" />
                      )}
                      <span className="truncate text-sm group-data-[state=collapsed]:hidden md:text-base">
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                )}

                {hasSubItems && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items!.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === subItem.url}
                          >
                            <NavLink to={subItem.url}>
                              <span className="truncate">{subItem.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
