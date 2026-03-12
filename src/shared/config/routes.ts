// src/shared/config/routes.ts
export const ROUTES = {
  // ── Public ──────────────────────────────────────────────────────────────
  LOGIN: "/login",
  UNAUTHORIZED: "/unauthorized",

  // ── App ─────────────────────────────────────────────────────────────────
  DASHBOARD: "/dashboard",

  // ── PEM Requirements ────────────────────────────────────────────────────
  PEM_REQUIREMENTS: {
    ROOT: "/pem-requirements",
    CONTROL_OBJECT: "/pem-requirements/control-object-requirement",
    DOCUMENT: "/pem-requirements/document-requirement",
    DISCIPLINE_ACTIVITY: "/pem-requirements/discipline-activity-requirement",
  },

  // ── PEM Checklists ───────────────────────────────────────────────────────
  PEM_CHECKLISTS: {
    ROOT: "/pem-checklists",
    CONTROL_OBJECT: "/pem-checklists/control-object-checklist",
    DOCUMENT_CHECKLIST: "/pem-checklists/document-checklist",
    CHECKLIST_DETAIL: "/pem-checklists/document-checklist/checklist",
    DISCIPLINE_ACTIVITY: "/pem-checklists/discipline-activity-checklist",
  },

  // ── Admin ────────────────────────────────────────────────────────────────
  ADMIN: {
    SETTINGS: "/admin/settings",
  },
} as const;
