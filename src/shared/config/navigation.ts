import React from "react";
import { Icons } from "@/shared/components/icons";
import { Settings2 } from "lucide-react";
import type { Role } from "@/shared/types/roles";
import { ROLES } from "@/shared/types/roles";
import { ROUTES } from "@/shared/config/routes";

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
      url: ROUTES.DASHBOARD,
      icon: Icons.HomeIcon,
    },
    {
      title: "PEM Requirements",
      url: ROUTES.PEM_REQUIREMENTS.ROOT,
      icon: Icons.PEMRequirementsIcon,
      items: [
        {
          title: "Control Object Requirement",
          url: ROUTES.PEM_REQUIREMENTS.CONTROL_OBJECT,
        },
        {
          title: "Document Requirement",
          url: ROUTES.PEM_REQUIREMENTS.DOCUMENT,
        },
        {
          title: "Discipline Activity Requirement",
          url: ROUTES.PEM_REQUIREMENTS.DISCIPLINE_ACTIVITY,
        },
      ],
    },
    {
      title: "PEM Check Lists",
      url: ROUTES.PEM_CHECKLISTS.ROOT,
      icon: Icons.DocumentsChecklistIcon,
      items: [
        {
          title: "Control Object Check List",
          url: ROUTES.PEM_CHECKLISTS.CONTROL_OBJECT,
        },
        {
          title: "Document Check List",
          url: ROUTES.PEM_CHECKLISTS.DOCUMENT_CHECKLIST,
        },
        {
          title: "Discipline Activity Check List",
          url: ROUTES.PEM_CHECKLISTS.DISCIPLINE_ACTIVITY,
        },
      ],
    },
    {
      title: "Admin Settings",
      url: ROUTES.ADMIN.SETTINGS,
      icon: Settings2,
    },
  ],

  // ── USER: sees everything except Document/Discipline Requirements + Admin ─
  [ROLES.USER]: [
    {
      title: "Home",
      url: ROUTES.DASHBOARD,
      icon: Icons.HomeIcon,
    },
    {
      title: "PEM Requirements",
      url: ROUTES.PEM_REQUIREMENTS.ROOT,
      icon: Icons.PEMRequirementsIcon,
      items: [
        {
          title: "Control Object Requirement",
          url: ROUTES.PEM_REQUIREMENTS.CONTROL_OBJECT,
        },
      ],
    },
    {
      title: "PEM Check Lists",
      url: ROUTES.PEM_CHECKLISTS.ROOT,
      icon: Icons.DocumentsChecklistIcon,
      items: [
        {
          title: "Control Object Check List",
          url: ROUTES.PEM_CHECKLISTS.CONTROL_OBJECT,
        },
        {
          title: "Document Check List",
          url: ROUTES.PEM_CHECKLISTS.DOCUMENT_CHECKLIST,
        },
        {
          title: "Discipline Activity Check List",
          url: ROUTES.PEM_CHECKLISTS.DISCIPLINE_ACTIVITY,
        },
      ],
    },
    // No Admin Settings
  ],
};
