"use client";

import * as React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { ChevronRight, type LucideIcon } from "lucide-react";
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
} from "@/shared/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: { title: string; url: string }[];
  }[];
}) {
  const { pathname } = useLocation();

  // Track which menu is currently open (Accordion behavior)
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  // Automatically open the menu that contains the active child route on load
  React.useEffect(() => {
    const activeItem = items.find(
      (item) =>
        item.items?.some((sub) => sub.url === pathname) || item.url === pathname
    );
    if (activeItem) setOpenMenu(activeItem.title);
  }, [pathname, items]);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isMenuOpen = openMenu === item.title;
          const hasActiveChild = item.items?.some(
            (sub) => sub.url === pathname
          );
          const isParentActive = item.url === pathname;

          return (
            <Collapsible
              key={item.title}
              asChild
              //disabled={!item.items}
              open={isMenuOpen}
              onOpenChange={(isOpen) => {
                // Accordion logic: set this as open, or null if closing
                setOpenMenu(isOpen ? item.title : null);
              }}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    // Highlight if parent is the route OR if a child is active
                    isActive={isParentActive || hasActiveChild}
                    className="h-12"
                  >
                    {item.icon && <item.icon className="size-5" />}
                    <span className="font-semibold group-data-[state=collapsed]:hidden">
                      {item.title}
                    </span>
                    {item.items && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=collapsed]:hidden group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {item.items && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === subItem.url}
                          >
                            <NavLink to={subItem.url}>
                              <span>{subItem.title}</span>
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
