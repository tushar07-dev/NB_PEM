"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  SquareTerminal,
  ChevronLeft, // Standard icon fallback
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { NavMain } from "@/shared/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarGroupLabel, // CRITICAL: Hook to get sidebar state
} from "@/shared/components/ui/sidebar";
import { cn } from "@/lib/utils";

import { Home, FileText, ClipboardList, LayoutDashboard } from "lucide-react";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard", // Points to your index/dashboard route
      icon: Home,
      isActive: false,
    },
    {
      title: "PEM Requirements",
      url: "/pem-requirements", // Matches the admin route path
      icon: FileText,
      items: [], // Expandable but currently empty based on router
    },
    {
      title: "PEM Check Lists",
      url: "#",
      icon: ClipboardList,
      isActive: true, // Set to true to match the expanded state in your image
      items: [
        {
          title: "Control Object Check List",
          url: "/control-object-checklist", // Matches router path
        },
        {
          title: "Document Check List",
          url: "/document-checklist", // Matches router path
        },
        {
          title: "Discipline Activity Check List",
          url: "/discipline-activity-list", // Matches router path
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // 1. Extract state from the context provider
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="p-1 xl:p-2">
        <SidebarMenu>
          <SidebarGroupLabel>fdkijnfdk</SidebarGroupLabel>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={isCollapsed ? "Expand" : "Collapse"}
              onClick={toggleSidebar}
              className={cn(
                "border-grey-250 bg-secondary border",
                "rounded-lg transition-all duration-200",
                "flex h-10 w-full items-center xl:h-15"
              )}
            >
              {/* Icon box - Centered and sized */}
              <div className="flex h-[34.667px] w-[34.667px] shrink-0 items-center justify-center xl:h-[52px] xl:w-[52px]">
                {/* Using Lucide icons as a fallback for Icons.SidebarToggle */}
                {isCollapsed ? (
                  <PanelLeftOpen className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
              </div>

              {/* Label (only when expanded) */}
              {!isCollapsed && (
                <span className="truncate text-[14px] leading-none font-medium xl:ml-2 xl:text-[16px]">
                  Collapse
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
