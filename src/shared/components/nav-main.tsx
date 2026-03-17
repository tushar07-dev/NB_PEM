// src/shared/components/nav-main.tsx

import * as React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { NavItem } from "@/shared/config/navigation";

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

// NavItem is defined in and exported from @/shared/config/navigation.
// Import it from there — do not redefine it here.
export type { NavItem };

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
      setOpenMenus(
        new Set(items.filter((i) => i.items?.length).map((i) => i.title))
      );
    } else {
      setOpenMenus(new Set());
    }
  }, [isCollapsed, items]);

  const handleCollapsedClick = (item: NavItem) => {
    if (isCollapsed) {
      setOpen(true);
      setTimeout(() => {
        if (item.items && item.items.length > 0) {
          setOpenMenus((prev) => new Set(prev).add(item.title));
        }
      }, 150);
    }
  };

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
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isParentActive || hasActiveChild || isMenuOpen}
                      className={cn(
                        "group flex w-full items-center",
                        "data-[active=true]:bg-transparent",
                        "data-[active=true]:border-transparent",
                        "data-[active=true]:text-grey-700",
                        "data-[active=true]:shadow-none",
                        "data-[active=true]:font-medium",
                        "[&[data-active=true]_svg]:text-grey-700",
                        !isCollapsed &&
                          isMenuOpen &&
                          (hasActiveChild || isParentActive) && [
                            "bg-primary-600!",
                            "hover:bg-primary-300!",
                            "text-grey-50!",
                            "font-semibold!",
                            "[&_svg]:text-grey-50!",
                          ],
                        !isCollapsed &&
                          isMenuOpen &&
                          !hasActiveChild &&
                          !isParentActive && [
                            "bg-primary-200!",
                            "hover:bg-primary-300!",
                            "text-grey-50!",
                            "font-semibold!",
                            "[&_svg]:text-grey-50!",
                          ],
                        isCollapsed &&
                          isMenuOpen &&
                          (hasActiveChild || isParentActive) && [
                            "bg-primary-600!",
                            "hover:bg-primary-700!",
                            "text-white!",
                            "[&_svg]:text-white!",
                          ],
                        isCollapsed &&
                          isMenuOpen &&
                          !hasActiveChild &&
                          !isParentActive && [
                            "bg-transparent!",
                            "hover:bg-grey-200!",
                            "text-white!",
                          ],
                        !isCollapsed &&
                          !isMenuOpen &&
                          hasActiveChild && [
                            "bg-primary-600!",
                            "border-primary-600!",
                            "hover:bg-primary-600!",
                            "text-white!",
                            "font-semibold!",
                            "[&_svg]:text-white!",
                          ],
                        isCollapsed &&
                          !isMenuOpen &&
                          hasActiveChild && [
                            "bg-primary-600!",
                            "border-primary-600!",
                            "hover:bg-primary-600!",
                            "text-white!",
                            "[&_svg]:text-white!",
                          ],
                        !isCollapsed &&
                          !isMenuOpen &&
                          isParentActive &&
                          !hasActiveChild && [
                            "bg-primary-600!",
                            "border-primary-600!",
                            "hover:bg-primary-600!",
                            "text-white!",
                            "font-semibold!",
                            "[&_svg]:text-white!",
                          ],
                        isCollapsed &&
                          !isMenuOpen &&
                          isParentActive &&
                          !hasActiveChild && [
                            "bg-primary-600!",
                            "border-primary-600!",
                            "hover:bg-primary-600!",
                            "text-white!",
                            "[&_svg]:text-white!",
                          ]
                      )}
                      onClick={() => handleCollapsedClick(item)}
                    >
                      <span className="p-2 lg:px-3.5 lg:py-2.5 shrink-0 items-center justify-center">
                        {item.icon && (
                          <item.icon className="h-5 w-4 shrink-0 lg:h-8 lg:w-6" />
                        )}
                      </span>
                      <span className="truncate text-sm font-normal group-data-[state=collapsed]:hidden md:text-base">
                        {item.title}
                      </span>
                      <ChevronRight
                        className={cn(
                          "ml-auto mr-3",
                          "h-4 w-4 shrink-0 rotate-90 transition-transform duration-200",
                          "group-data-[state=collapsed]:hidden",
                          "group-data-[state=open]/collapsible:rotate-270"
                        )}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                ) : (
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isParentActive}
                    className={cn(
                      "group",
                      "data-[active=true]:bg-transparent",
                      "data-[active=true]:border-transparent",
                      "data-[active=true]:text-grey-700",
                      "data-[active=true]:shadow-none",
                      "data-[active=true]:font-medium",
                      "[&[data-active=true]_svg]:text-grey-700",
                      !isCollapsed &&
                        isParentActive && [
                          "bg-primary-600!",
                          "border-primary-600!",
                          "hover:bg-primary-600!",
                          "text-white!",
                          "font-semibold!",
                          "[&_svg]:text-white!",
                        ],
                      isCollapsed &&
                        isParentActive && [
                          "bg-primary-600!",
                          "border-primary-600!",
                          "hover:bg-primary-600!",
                          "text-white!",
                          "[&_svg]:text-white!",
                        ]
                    )}
                    onClick={() => handleCollapsedClick(item)}
                  >
                    <NavLink to={item.url}>
                      <span className="p-2 lg:px-3.5 lg:py-2.5 shrink-0 items-center justify-center">
                          {item.icon && (
                          <item.icon className="h-5 w-4 shrink-0 lg:h-8 lg:w-6" />
                        )}
                      </span>
                      <span className="truncate text-sm font-normal group-data-[state=collapsed]:hidden md:text-base">
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                )}

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
                                "border-grey-900 text-grey-900 bg-transparent font-medium"
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
