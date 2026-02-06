"use client";

import * as React from "react";
import {
  Home,
  FileText,
  ClipboardList,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Building2,
} from "lucide-react";

import { NavMain, type NavItem } from "@/shared/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";

// Role type
export type UserRole = "admin" | "user";

// Navigation data for different roles
const getNavigationData = (role: UserRole): NavItem[] => {
  console.log("Generating navigation for role:", role);
  const baseNavigation: NavItem[] = [
    {
      title: "Home",
      url: "/dashboard",
      icon: Icons.HomeIcon || Home,
      roles: ["admin", "user"],
    },
    {
      title: "PEM Requirements",
      url: "/pem-requirements",
      icon: Icons.PEMRequirementsIcon,
      roles: ["admin", "user"],
      items: [
        {
          title: "Control Object Requirements",
          url: "/control-object-requirements",
        },
        {
          title: "Document Requirements",
          url: "/document-requirements",
        },
        {
          title: "Discipline Activity Requirements",
          url: "/discipline-activity-requirements",
        },
      ],
    },
    {
      title: "PEM Check Lists",
      url: "/pem-checklists",
      icon: ClipboardList,
      roles: ["admin", "user"],
      items: [
        {
          title: "Control Object Check List",
          url: "/control-object-checklist",
        },
        {
          title: "Document Check List",
          url: "/document-checklist",
        },
        {
          title: "Discipline Activity Check List",
          url: "/discipline-activity-checklist",
        },
      ],
    },
    {
      title: "Admin Settings",
      url: "/admin/settings",
      icon: Icons.SettingsIcon || Settings,
      roles: ["admin", "user"],
    },
  ];

  // Admin-only routes
  const adminNavigation: NavItem[] = [
    {
      title: "Admin Settings",
      url: "/admin/settings",
      icon: Settings,
      roles: ["admin"],
      items: [
        {
          title: "User Management",
          url: "/admin/users",
        },
        {
          title: "System Configuration",
          url: "/admin/config",
        },
        {
          title: "Audit Logs",
          url: "/admin/logs",
        },
      ],
    },
  ];

  // Filter based on role
  if (role === "admin") {
    return [...baseNavigation, ...adminNavigation];
  }

  return baseNavigation.filter((item) => item.roles?.includes(role));
};

export function AppSidebar({
  userRole = "user",
  userName = "User",
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  userRole?: UserRole;
  userName?: string;
}) {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const navigationData = React.useMemo(
    () => getNavigationData(userRole),
    [userRole]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header with Logo/Brand */}
      {/* <SidebarHeader>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0f172a] text-white",
              "md:h-11 md:w-11"
            )}
          >
            <Building2 className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-base font-bold text-grey-900 md:text-lg">
                PEM System
              </span>
              <span className="truncate text-xs text-grey-500">
                {userRole === "admin" ? "Administrator" : "User Portal"}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader> */}

      {/* Main Navigation */}
      <SidebarContent>
        <NavMain items={navigationData} />
      </SidebarContent>

      {/* Footer with User Info and Toggle */}
      <SidebarFooter>
        <SidebarMenu>
          {/* User Info */}
          {/* {!isCollapsed && (
            <SidebarMenuItem>
              <div className="flex items-center gap-3 px-3 py-2 text-sm text-grey-600">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-grey-200 font-semibold text-grey-700">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex min-w-0 flex-col overflow-hidden">
                  <span className="truncate text-sm font-medium text-grey-900 md:text-base">
                    {userName}
                  </span>
                  <span className="truncate text-xs text-grey-500">
                    {userRole === "admin" ? "Admin" : "User"}
                  </span>
                </div>
              </div>
            </SidebarMenuItem>
          )} */}

          {/* Collapse/Expand Button */}
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
                    <Icons.SidebarToggle className="text-grey-700 h-5 w-5" />
                  ) : (
                    <Icons.SidebarToggle
                      isCollapsed
                      className="text-grey-700 h-5 w-5"
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
