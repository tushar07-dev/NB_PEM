// src/shared/config/navigation.ts
import React from "react";
import { Icons } from "@/shared/components/icons";
import { Settings2 } from "lucide-react";

/**
 * Navigation item type used throughout the app
 */
export interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: Omit<NavItem, "icon" | "items">[]; // Children don't have icons or nested items
  roles?: ("admin" | "user")[];
}

/**
 * Role-based navigation configuration
 * URLs are absolute paths that match the router exactly
 */
export const ROLE_NAVIGATION = {
  admin: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Icons.HomeIcon,
      roles: ["admin", "user"],
    },
    {
      title: "PEM Requirements",
      url: "/pem-requirements",
      icon: Icons.PEMRequirementsIcon,
      roles: ["admin", "user"],
      items: [
        {
          title: "Control Object Requirement",
          url: "/pem-requirements/control-object-requirement",
          roles: ["admin", "user"],
        },
        {
          title: "Document Requirement",
          url: "/pem-requirements/document-requirement",
          roles: ["admin"],
        },
        {
          title: "Discipline Activity Requirement",
          url: "/pem-requirements/discipline-activity-requirement",
          roles: ["admin"],
        },
      ],
    },
    {
      title: "PEM Check Lists",
      url: "/pem-checklists",
      icon: Icons.DocumentsChecklistIcon,
      roles: ["admin", "user"],
      items: [
        {
          title: "Control Object Check List",
          url: "/pem-checklists/control-object-checklist",
          roles: ["admin", "user"],
        },
        {
          title: "Document Check List",
          url: "/pem-checklists/document-checklist",
          roles: ["admin", "user"],
        },
        {
          title: "Discipline Activity Check List",
          url: "/pem-checklists/discipline-activity-checklist",
          roles: ["admin", "user"],
        },
      ],
    },
    {
      title: "Admin Settings",
      url: "/admin/settings",
      icon: Settings2,
      roles: ["admin"],
    },
  ] as NavItem[],

  user: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Icons.HomeIcon,
      roles: ["admin", "user"],
    },
    {
      title: "PEM Requirements",
      url: "/pem-requirements",
      icon: Icons.PEMRequirementsIcon,
      roles: ["admin", "user"],
      items: [
        {
          title: "Control Object Requirement",
          url: "/pem-requirements/control-object-requirement",
          roles: ["admin", "user"],
        },
      ],
    },
  ] as NavItem[],
} as const;
