// src/shared/components/nav-main.tsx
"use client";

import * as React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
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
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  items?: Omit<NavItem, "icon" | "items">[]; // Children can't have icons or nested items
  roles?: ("admin" | "user")[];
};

interface NavMainProps {
  items: NavItem[];
  className?: string;
}

export function NavMain({ items, className }: NavMainProps) {
  const { pathname } = useLocation();
  const { state, setOpen } = useSidebar();

  const isCollapsed = state === "collapsed";

  const [openMenus, setOpenMenus] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (!isCollapsed) {
      // Sidebar expanded → open ALL menus with children
      setOpenMenus(
        new Set(items.filter((i) => i.items?.length).map((i) => i.title))
      );
    } else {
      // Sidebar collapsed → close all
      setOpenMenus(new Set());
    }
  }, [isCollapsed, items]);

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

  // Check if URL is active (exact match or starts with for parent routes)
  const isUrlActive = (url: string, hasChildren: boolean) => {
    if (hasChildren) {
      return pathname.startsWith(url);
    }
    return pathname === url;
  };

  return (
    <SidebarGroup className={className}>
      <SidebarMenu>
        {items.map((item) => {
          const isMenuOpen = openMenus.has(item.title);
          const hasSubItems = item.items && item.items.length > 0;
          const hasActiveChild = item.items?.some((sub) =>
            pathname.startsWith(sub.url)
          );
          const isParentActive = isUrlActive(item.url, !!hasSubItems);

          return (
            <Collapsible
              key={item.title}
              asChild
              open={isMenuOpen}
              onOpenChange={(isOpen) => {
                if (!isCollapsed) {
                  toggleMenu(item.title, isOpen);
                }
              }}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {hasSubItems ? (
                  // ========================================================================
                  // MENU WITH SUBMENU (Parent Menu Items like "PEM Requirements")
                  // ========================================================================
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isParentActive || hasActiveChild || isMenuOpen}
                      className={cn(
                        "group",

                        // ================================================================
                        // OVERRIDE DEFAULT data-[active=true] STYLES FROM sidebar.tsx
                        // ================================================================
                        "data-[active=true]:bg-transparent",
                        "data-[active=true]:border-transparent",
                        "data-[active=true]:text-grey-700",
                        "data-[active=true]:shadow-none",
                        "data-[active=true]:font-medium",
                        "[&[data-active=true]_svg]:text-grey-700",

                        // ================================================================
                        // SIDEBAR EXPANDED + SUBMENU OPEN + SELECTED
                        // Light Blue Background
                        // ================================================================
                        !isCollapsed &&
                          isMenuOpen &&
                          (hasActiveChild || isParentActive) && [
                            "bg-primary-200!", // Light blue
                            "hover:bg-primary-300!", // Hover: darker light blue
                            "text-grey-50!", // Dark text
                            "font-semibold!",
                            "[&_svg]:text-grey-50!",
                            
                          ],

                        // ================================================================
                        // SIDEBAR EXPANDED + SUBMENU OPEN + NOT SELECTED
                        // Light Blue Background (same as above)
                        // ================================================================
                        !isCollapsed &&
                          isMenuOpen &&
                          !hasActiveChild &&
                          !isParentActive && [
                            "bg-primary-200!", // Light blue
                            "hover:bg-primary-300!",
                            "text-grey-50!",
                            "font-semibold!",
                            "[&_svg]:text-grey-50!",
                            
                          ],

                        // ================================================================
                        // SIDEBAR COLLAPSED + SUBMENU OPEN + SELECTED
                        // ================================================================
                        isCollapsed &&
                          isMenuOpen &&
                          (hasActiveChild || isParentActive) && [
                            "bg-primary-600!", // Dark blue
                            "hover:bg-primary-700!",
                            "text-white!",
                            "[&_svg]:text-white!",
                            
                          ],

                        // ================================================================
                        // SIDEBAR COLLAPSED + SUBMENU OPEN + NOT SELECTED
                        // ================================================================
                        isCollapsed &&
                          isMenuOpen &&
                          !hasActiveChild &&
                          !isParentActive && [
                            "bg-transparent!", // Transparent background
                            "hover:bg-grey-200!",
                            "text-white!",
                            // "[&_svg]:text-white!",
                            // 
                          ],

                        // ================================================================
                        // SIDEBAR EXPANDED + SUBMENU CLOSED + HAS ACTIVE CHILD
                        // Dark Blue Background
                        // ================================================================
                        !isCollapsed &&
                          !isMenuOpen &&
                          hasActiveChild && [
                            "bg-primary-600!", // Dark blue
                            "border-primary-600!",
                            "hover:bg-primary-600!",
                            "text-white!",
                            "font-semibold!",
                            "[&_svg]:text-white!",
                            
                          ],

                        // ================================================================
                        // SIDEBAR COLLAPSED + SUBMENU CLOSED + HAS ACTIVE CHILD
                        // Dark Blue Background
                        // ================================================================
                        isCollapsed &&
                          !isMenuOpen &&
                          hasActiveChild && [
                            "bg-primary-600!", // Dark blue
                            "border-primary-600!",
                            "hover:bg-primary-600!",
                            "text-white!",
                            "[&_svg]:text-white!",
                            
                          ],

                        // ================================================================
                        // SIDEBAR EXPANDED + SUBMENU CLOSED + PARENT ACTIVE + NO ACTIVE CHILD
                        // Dark Blue Background
                        // ================================================================
                        !isCollapsed &&
                          !isMenuOpen &&
                          isParentActive &&
                          !hasActiveChild && [
                            "bg-primary-600!", // Dark blue
                            "border-primary-600!",
                            "hover:bg-primary-600!",
                            "text-white!",
                            "font-semibold!",
                            "[&_svg]:text-white!",
                            
                          ],

                        // ================================================================
                        // SIDEBAR COLLAPSED + SUBMENU CLOSED + PARENT ACTIVE + NO ACTIVE CHILD
                        // Dark Blue Background
                        // ================================================================
                        isCollapsed &&
                          !isMenuOpen &&
                          isParentActive &&
                          !hasActiveChild && [
                            "bg-primary-600!", // Dark blue
                            "border-primary-600!",
                            "hover:bg-primary-600!",
                            "text-white!",
                            "[&_svg]:text-white!",
                            
                          ]

                        // ================================================================
                        // DEFAULT STATE (SUBMENU CLOSED + NOT ACTIVE)
                        // Transparent Background - handled by base styles
                        // ================================================================
                      )}
                      onClick={() => handleCollapsedClick(item)}
                    >
                      {item.icon && (
                        <item.icon className="h-5 w-5 shrink-0 md:h-6 md:w-6" />
                      )}
                      <span className="truncate text-sm group-data-[state=collapsed]:hidden md:text-base">
                        {item.title}
                      </span>
                      <ChevronRight
                        className={cn(
                          "ml-auto h-4 w-4 shrink-0 rotate-90 transition-transform duration-200",
                          "group-data-[state=collapsed]:hidden",
                          "group-data-[state=open]/collapsible:rotate-270"
                        )}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                ) : (
                  // ========================================================================
                  // MENU WITHOUT SUBMENU (Simple Menu Items like "Home", "Admin Settings")
                  // ========================================================================
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isParentActive}
                    className={cn(
                      "group",

                      // ================================================================
                      // OVERRIDE DEFAULT data-[active=true] STYLES
                      // ================================================================
                      "data-[active=true]:bg-transparent",
                      "data-[active=true]:border-transparent",
                      "data-[active=true]:text-grey-700",
                      "data-[active=true]:shadow-none",
                      "data-[active=true]:font-medium",
                      "[&[data-active=true]_svg]:text-grey-700",

                      // ================================================================
                      // SIDEBAR EXPANDED + ACTIVE/SELECTED
                      // Dark Blue Background (always dark blue for simple menu)
                      // ================================================================
                      !isCollapsed &&
                        isParentActive && [
                          "bg-primary-600!", // Dark blue
                          "border-primary-600!",
                          "hover:bg-primary-600!",
                          "text-white!",
                          "font-semibold!",
                          "[&_svg]:text-white!",
                          
                        ],

                      // ================================================================
                      // SIDEBAR COLLAPSED + ACTIVE/SELECTED
                      // Dark Blue Background
                      // ================================================================
                      isCollapsed &&
                        isParentActive && [
                          "bg-primary-600!", // Dark blue
                          "border-primary-600!",
                          "hover:bg-primary-600!",
                          "text-white!",
                          "[&_svg]:text-white!",
                          
                        ]

                      // ================================================================
                      // DEFAULT STATE (NOT ACTIVE)
                      // Transparent Background - handled by base styles
                      // ================================================================
                    )}
                    onClick={() => handleCollapsedClick(item)}
                  >
                    <NavLink to={item.url}>
                      {item.icon && (
                        <item.icon className="h-5 w-5 shrink-0 md:h-6 md:w-6" />
                      )}
                      <span className="truncate text-sm group-data-[state=collapsed]:hidden md:text-base">
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                )}

                {/* ========================================================================
                    SUB-MENU ITEMS (Children like "Control Object Requirement")
                    ======================================================================== */}
                {hasSubItems && (
                  <CollapsibleContent>
                    <SidebarMenuSub className="border-grey-300 relative ml-9 border-l pl-0">
                      {item.items!.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname.startsWith(subItem.url)}
                            className={cn(
                              "relative -ml-px rounded-none border-l-2 border-transparent pl-2 transition-all",
                              "hover:border-grey-700/40",
                              pathname.startsWith(subItem.url) &&
                                "border-grey-900 text-grey-900 bg-transparent font-semibold"
                            )}
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
