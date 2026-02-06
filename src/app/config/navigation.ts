import { type LucideIcon } from "lucide-react";
import React from "react";
import { Icons } from "@/shared/components/icons";

/**
 * NavItem used by NavMain / Sidebar
 * icon should be a React component (Lucide icons are components too).
 */
export interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: NavItem[];
}

export type Role = "admin" | "user";

/**
 * Role-specific navigation. Keep URLs namespaced to match router:
 * - admin pages: /admin/...
 * - user pages:  /user/...
 * - shared: /dashboard
 *
 * NOTE: Ensure the icon components exist on your `Icons` export.
 */
export const ROLE_NAVIGATION: Record<Role, NavItem[]> = {
  admin: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Icons.HomeIcon,
    },
    {
      title: "PEM Requirements",
      url: "/admin/pem-requirements",
      icon: Icons.PEMRequirementsIcon,
    },
    {
      title: "Discipline Activity List",
      url: "/admin/discipline-activity-list",
      icon: Icons.DisciplineActivityListIcon,
    },
    {
      title: "Control Object Checklist",
      url: "/admin/control-object-checklist",
      icon: Icons.ControlObjectChecklistIcon,
    },
    {
      title: "Document Checklist (Admin view)",
      url: "/dashboard",
      icon: Icons.DocumentsChecklistIcon,
    },
  ],

  user: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Icons.HomeIcon,
    },
    {
      title: "My Profile",
      url: "/user/profile",
      icon: Icons.DisciplineActivityListIcon,
    },
  ],
} as const;
