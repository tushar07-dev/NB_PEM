import { type LucideIcon } from "lucide-react";
import { Icons } from "@/shared/components/icons";
import React from "react";

// 1. Update the interface to accept BOTH Lucide and Custom Icons
export interface NavItem {
  title: string;
  url: string;
  // This type allows any component that accepts a className string
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
}

// 2. Define the record type
export type RoleNavigation = Record<"admin" | "user", NavItem[]>;

export const ROLE_NAVIGATION: RoleNavigation = {
  admin: [
    { title: "Home", url: "/dashboard", icon: Icons.Home },
    { title: "PEM Requirements", url: "/pem-requirements", icon: Icons.Edit },
    { title: "Discipline Activity List", url: "/discipline-activity-list", icon: Icons.UserCard },
    { title: "Control Object Checklist", url: "/control-object-checklist", icon: Icons.Nodes },
    { title: "Document Checklist", url: "/document-checklist", icon: Icons.Documents },
  ],
  user: [
    { title: "Home", url: "/dashboard", icon: Icons.Home },
    { title: "My Profile", url: "/profile", icon: Icons.UserCard },
  ],
} as const;