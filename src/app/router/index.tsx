// src/app/router/index.tsx
import { lazy } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { RoleBasedLayout } from "@/app/layouts/RoleBasedLayout";
import RouterError from "./RouterError";
import LoginPage from "@/features/auth/pages/LoginPage";
import UnauthorizedPage from "@/features/auth/pages/UnauthorizedPage";
import DocumentChecklistPage from "@/features/pem-check-lists/pages/document-checklist-page";
import { ComingSoon } from "@/shared/components/ui/coming-soon";
import { LazyRoute } from "@/shared/components/ui/lazy-route";
import DocumentRequirementPage from "@/features/pem-requirements/pages/document-requirement/DocumentRequirementPage";
import ControlObjectChecklistPage from "@/features/pem-check-lists/pages/control-object-checklist-page";
import DisciplineActivityChecklistPage from "@/features/pem-check-lists/pages/discipline-activity-checklist-page";
import { ChecklistDetailPage } from "@/features/pem-check-lists/pages/checklist-detail-page";
import { PERMISSIONS } from "@/shared/config/permissions";
import { ROUTES } from "@/shared/config/routes";

const lazyPage = (title: string) =>
  lazy(async () => ({
    default: () => <ComingSoon title={title} />,
  }));

// Dashboard
const DashboardPage = lazy(() =>
  import("@/features/dashboard/pages/DashboardPage").catch(() => ({
    default: () => <ComingSoon title="Dashboard" />,
  }))
);

// PEM Requirements
const ControlObjectRequirementPage = lazyPage("Control Object Requirement");
const DisciplineActivityRequirementPage = lazyPage(
  "Discipline Activity Requirement"
);

// Admin
const AdminSettingsPage = lazyPage("Admin Settings");

// ==========================================
// ROUTER CONFIGURATION
// ==========================================
// Access control is declared per-route via a single `permission` prop.
// Which roles have which permissions is defined in permissions.ts only.
// To open/close a route to a role: edit ROLE_PERMISSIONS in permissions.ts.
// ==========================================
export const router = createBrowserRouter([
  // ── Public routes ──────────────────────────────────────────────────────────
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },

  // ── Protected app routes ───────────────────────────────────────────────────
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RoleBasedLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouterError />,
    children: [
      // Root redirect
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },

      // Dashboard
      {
        path: "dashboard",
        element: (
          <LazyRoute permission={PERMISSIONS.VIEW_DASHBOARD}>
            <DashboardPage />
          </LazyRoute>
        ),
      },

      // ── PEM Requirements ─────────────────────────────────────────────────
      {
        path: "pem-requirements",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Navigate to="control-object-requirement" replace />,
          },
          {
            path: "control-object-requirement",
            element: (
              <LazyRoute permission={PERMISSIONS.VIEW_PEM_REQUIREMENTS}>
                <ControlObjectRequirementPage />
              </LazyRoute>
            ),
          },
          {
            path: "document-requirement",
            element: (
              <LazyRoute permission={PERMISSIONS.VIEW_DOCUMENT_REQUIREMENT}>
                <DocumentRequirementPage />
              </LazyRoute>
            ),
          },
          {
            path: "discipline-activity-requirement",
            element: (
              <LazyRoute permission={PERMISSIONS.VIEW_DISCIPLINE_ACTIVITY_REQ}>
                <DisciplineActivityRequirementPage />
              </LazyRoute>
            ),
          },
        ],
      },

      // ── PEM Checklists ───────────────────────────────────────────────────
      {
        path: "pem-checklists",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Navigate to="control-object-checklist" replace />,
          },
          {
            path: "control-object-checklist",
            element: (
              <LazyRoute permission={PERMISSIONS.VIEW_CONTROL_OBJECT_CHECKLIST}>
                <ControlObjectChecklistPage />
              </LazyRoute>
            ),
          },
          {
            path: "document-checklist",
            children: [
              {
                index: true,
                element: (
                  <LazyRoute permission={PERMISSIONS.VIEW_DOCUMENT_CHECKLIST}>
                    <DocumentChecklistPage />
                  </LazyRoute>
                ),
              },
              {
                path: "checklist-details",
                element: (
                  <LazyRoute permission={PERMISSIONS.VIEW_DOCUMENT_CHECKLIST}>
                    <ChecklistDetailPage />
                  </LazyRoute>
                ),
              },
            ],
          },
          {
            path: "discipline-activity-checklist",
            element: (
              <LazyRoute
                permission={PERMISSIONS.VIEW_DISCIPLINE_ACTIVITY_CHECKLIST}
              >
                <DisciplineActivityChecklistPage />
              </LazyRoute>
            ),
          },
        ],
      },

      // ── Admin ─────────────────────────────────────────────────────────────
      {
        path: "admin",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Navigate to="settings" replace />,
          },
          {
            path: "settings",
            element: (
              <LazyRoute permission={PERMISSIONS.ACCESS_ADMIN}>
                <AdminSettingsPage />
              </LazyRoute>
            ),
          },
        ],
      },
    ],
  },

  // ── 404 catch-all ─────────────────────────────────────────────────────────
  {
    path: "*",
    element: (
      <ProtectedRoute>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">404</h1>
            <p className="text-muted-foreground mt-2">Page Not Found</p>
          </div>
        </div>
      </ProtectedRoute>
    ),
  },
]);
