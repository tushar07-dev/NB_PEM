import { ROLES, type Role } from "@/shared/types/roles";

// ─── All permissions in the app ───────────────────────────────────────────────
// When adding a new protected page: add a constant here, assign it to the
// relevant roles below, then use it in the router. Zero other files change.

export const PERMISSIONS = {
  VIEW_DASHBOARD: "view_dashboard",
  VIEW_PEM_REQUIREMENTS: "view_pem_requirements",
  VIEW_DOCUMENT_REQUIREMENT: "view_document_requirement",
  VIEW_DISCIPLINE_ACTIVITY_REQ: "view_discipline_activity_req",
  VIEW_CONTROL_OBJECT_CHECKLIST: "view_control_object_checklist",
  VIEW_DOCUMENT_CHECKLIST: "view_document_checklist",
  VIEW_DISCIPLINE_ACTIVITY_CHECKLIST: "view_discipline_activity_checklist",
  ACCESS_ADMIN: "access_admin",
  // Future: MANAGE_USERS:            "manage_users",
  // Future: VIEW_ANALYTICS:          "view_analytics",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ─── Role → permissions map ───────────────────────────────────────────────────
// To add a new role: add it to ROLES, then add an entry here.
// To change what a role can access: only edit THIS map — no router changes needed.

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.USER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PEM_REQUIREMENTS,
    PERMISSIONS.VIEW_CONTROL_OBJECT_CHECKLIST,
    PERMISSIONS.VIEW_DOCUMENT_CHECKLIST,
    PERMISSIONS.VIEW_DISCIPLINE_ACTIVITY_CHECKLIST,
    // Intentionally excluded:
    // PERMISSIONS.VIEW_DOCUMENT_REQUIREMENT
    // PERMISSIONS.VIEW_DISCIPLINE_ACTIVITY_REQ
    // PERMISSIONS.ACCESS_ADMIN
  ],

  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PEM_REQUIREMENTS,
    PERMISSIONS.VIEW_DOCUMENT_REQUIREMENT,
    PERMISSIONS.VIEW_DISCIPLINE_ACTIVITY_REQ,
    PERMISSIONS.VIEW_CONTROL_OBJECT_CHECKLIST,
    PERMISSIONS.VIEW_DOCUMENT_CHECKLIST,
    PERMISSIONS.VIEW_DISCIPLINE_ACTIVITY_CHECKLIST,
    PERMISSIONS.ACCESS_ADMIN,
  ],

  // Future example — just add the role to ROLES and list its permissions here:
//   [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS) as Permission[],
};

// ─── Helper ───────────────────────────────────────────────────────────────────

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
