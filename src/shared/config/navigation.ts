import React from "react";
import { Icons } from "@/shared/components/icons";
import { Settings2 } from "lucide-react";
import type { Role } from "@/shared/types/roles";
import { ROLES } from "@/shared/types/roles";

export interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: Omit<NavItem, "icon" | "items">[];
  roles?: Role[];
}

export const ROLE_NAVIGATION: Record<Role, NavItem[]> = {
  // ── ADMIN: sees everything including Admin Settings ───────────────────────
  [ROLES.ADMIN]: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Icons.HomeIcon,
    },
    {
      title: "PEM Requirements",
      url: "/pem-requirements",
      icon: Icons.PEMRequirementsIcon,
      items: [
        {
          title: "Control Object Requirement",
          url: "/pem-requirements/control-object-requirement",
        },
        {
          title: "Document Requirement",
          url: "/pem-requirements/document-requirement",
        },
        {
          title: "Discipline Activity Requirement",
          url: "/pem-requirements/discipline-activity-requirement",
        },
      ],
    },
    {
      title: "PEM Check Lists",
      url: "/pem-checklists",
      icon: Icons.DocumentsChecklistIcon,
      items: [
        {
          title: "Control Object Check List",
          url: "/pem-checklists/control-object-checklist",
        },
        {
          title: "Document Check List",
          url: "/pem-checklists/document-checklist",
        },
        {
          title: "Discipline Activity Check List",
          url: "/pem-checklists/discipline-activity-checklist",
        },
      ],
    },
    {
      title: "Admin Settings",
      url: "/admin/settings",
      icon: Settings2,
    },
  ],

  // ── USER: sees everything except Document/Discipline Requirements + Admin ─
  [ROLES.USER]: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Icons.HomeIcon,
    },
    {
      title: "PEM Requirements",
      url: "/pem-requirements",
      icon: Icons.PEMRequirementsIcon,
      items: [
        {
          title: "Control Object Requirement",
          url: "/pem-requirements/control-object-requirement",
        },
      ],
    },
    {
      title: "PEM Check Lists",
      url: "/pem-checklists",
      icon: Icons.DocumentsChecklistIcon,
      items: [
        {
          title: "Control Object Check List",
          url: "/pem-checklists/control-object-checklist",
        },
        {
          title: "Document Check List",
          url: "/pem-checklists/document-checklist",
        },
        {
          title: "Discipline Activity Check List",
          url: "/pem-checklists/discipline-activity-checklist",
        },
      ],
    },
    // No Admin Settings
  ],
};
