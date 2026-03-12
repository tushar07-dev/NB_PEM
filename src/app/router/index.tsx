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
import { ROLES } from "@/shared/types/roles";
import { ChecklistDetailPage } from "@/features/pem-check-lists/pages/checklist-detail-page";

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
// Role checking happens exactly ONCE per navigation — inside each
// page's <LazyRoute roles={[...]}> via RoleGuard.
// Section wrappers use plain <Outlet /> — no double role-checking.
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
        element: <Navigate to="/dashboard" replace />,
      },

      // Dashboard
      {
        path: "dashboard",
        element: (
          <LazyRoute roles={[ROLES.ADMIN, ROLES.USER]}>
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
              <LazyRoute roles={[ROLES.ADMIN, ROLES.USER]}>
                <ControlObjectRequirementPage />
              </LazyRoute>
            ),
          },
          {
            path: "document-requirement",
            element: (
              <LazyRoute roles={[ROLES.ADMIN]}>
                <DocumentRequirementPage />
              </LazyRoute>
            ),
          },
          {
            path: "discipline-activity-requirement",
            element: (
              <LazyRoute roles={[ROLES.ADMIN]}>
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
              <LazyRoute roles={[ROLES.ADMIN]}>
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
                  <LazyRoute roles={[ROLES.ADMIN]}>
                    <DocumentChecklistPage />
                  </LazyRoute>
                ),
              },
              {
                path: "checklist",
                element: (
                  <LazyRoute roles={[ROLES.ADMIN]}>
                    <ChecklistDetailPage />
                  </LazyRoute>
                ),
              },
            ],
          },
          {
            path: "discipline-activity-checklist",
            element: (
              <LazyRoute roles={[ROLES.ADMIN]}>
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
              <LazyRoute roles={[ROLES.ADMIN]}>
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
