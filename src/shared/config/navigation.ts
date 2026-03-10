import React from "react";
import { Icons } from "@/shared/components/icons";
import { Settings2 } from "lucide-react";
import type { Role } from "@/shared/types/roles";
import { ROLES } from "@/shared/types/roles";

/**
 * Navigation item type — single definition used by both navigation.ts
 * and nav-main.tsx. Import from here, not from nav-main.
 */
export interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  /** Children cannot have icons or nested items */
  items?: Omit<NavItem, "icon" | "items">[];
  roles?: Role[];
}

/**
 * Role-based navigation configuration.
 * URLs must match the router exactly.
 * Add new routes here when creating new pages.
 */
export const ROLE_NAVIGATION: Record<Role, NavItem[]> = {
  [ROLES.ADMIN]: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Icons.HomeIcon,
      roles: [ROLES.ADMIN, ROLES.USER],
    },
    {
      title: "PEM Requirements",
      url: "/pem-requirements",
      icon: Icons.PEMRequirementsIcon,
      roles: [ROLES.ADMIN, ROLES.USER],
      items: [
        {
          title: "Control Object Requirement",
          url: "/pem-requirements/control-object-requirement",
          roles: [ROLES.ADMIN, ROLES.USER],
        },
        {
          title: "Document Requirement",
          url: "/pem-requirements/document-requirement",
          roles: [ROLES.ADMIN],
        },
        {
          title: "Discipline Activity Requirement",
          url: "/pem-requirements/discipline-activity-requirement",
          roles: [ROLES.ADMIN],
        },
      ],
    },
    {
      title: "PEM Check Lists",
      url: "/pem-checklists",
      icon: Icons.DocumentsChecklistIcon,
      roles: [ROLES.ADMIN, ROLES.USER],
      items: [
        {
          title: "Control Object Check List",
          url: "/pem-checklists/control-object-checklist",
          roles: [ROLES.ADMIN, ROLES.USER],
        },
        {
          title: "Document Check List",
          url: "/pem-checklists/document-checklist",
          roles: [ROLES.ADMIN, ROLES.USER],
        },
        {
          title: "Discipline Activity Check List",
          url: "/pem-checklists/discipline-activity-checklist",
          roles: [ROLES.ADMIN, ROLES.USER],
        },
      ],
    },
    {
      title: "Admin Settings",
      url: "/admin/settings",
      icon: Settings2,
      roles: [ROLES.ADMIN],
    },
  ],

  [ROLES.USER]: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Icons.HomeIcon,
      roles: [ROLES.ADMIN, ROLES.USER],
    },
    {
      title: "PEM Requirements",
      url: "/pem-requirements",
      icon: Icons.PEMRequirementsIcon,
      roles: [ROLES.ADMIN, ROLES.USER],
      items: [
        {
          title: "Control Object Requirement",
          url: "/pem-requirements/control-object-requirement",
          roles: [ROLES.ADMIN, ROLES.USER],
        },
      ],
    },
  ],
};
