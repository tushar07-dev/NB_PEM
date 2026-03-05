// src/app/router/index.tsx
import { lazy } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { RoleGuard } from "@/app/router/RoleGuard";
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
const DocumentChecklistDetailPage = lazyPage("Document Checklist Detail");

// PEM Requirements Pages
const ControlObjectRequirementPage = lazyPage("Control Object Requirement");

const DisciplineActivityRequirementPage = lazyPage(
  "Discipline Activity Requirement"
);

// Admin Pages
const AdminSettingsPage = lazyPage("Admin Settings");

// ==========================================
// ROUTER CONFIGURATION
// ==========================================
export const router = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },

  // Protected app routes
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

      // Dashboard (accessible to all authenticated users)
      {
        path: "dashboard",
        element: (
          <LazyRoute roles={["admin", "user"]}>
            <DashboardPage />
          </LazyRoute>
        ),
      },

      // PEM Requirements section
      {
        path: "pem-requirements",
        element: (
          <RoleGuard allowedRoles={["admin", "user"]}>
            <Outlet />
          </RoleGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="control-object-requirement" replace />,
          },
          {
            path: "control-object-requirement",
            element: (
              <LazyRoute roles={["admin", "user"]}>
                <ControlObjectRequirementPage />
              </LazyRoute>
            ),
          },
          {
            path: "document-requirement",
            element: (
              <LazyRoute roles={["admin"]}>
                <DocumentRequirementPage />
              </LazyRoute>
            ),
          },
          {
            path: "discipline-activity-requirement",
            element: (
              <LazyRoute roles={["admin"]}>
                <DisciplineActivityRequirementPage />
              </LazyRoute>
            ),
          },
        ],
      },

      // PEM Checklists section
      {
        path: "pem-checklists",
        element: (
          <RoleGuard allowedRoles={["admin", "user"]}>
            <Outlet />
          </RoleGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="control-object-checklist" replace />,
          },
          {
            path: "control-object-checklist",
            element: (
              <LazyRoute roles={["admin"]}>
                <ControlObjectChecklistPage />
              </LazyRoute>
            ),
          },
          // AFTER
          {
            path: "document-checklist",
            children: [
              {
                index: true,
                element: (
                  <LazyRoute roles={["admin"]}>
                    <DocumentChecklistPage />
                  </LazyRoute>
                ),
              },
              {
                path: "checklist",
                element: (
                  <LazyRoute roles={["admin"]}>
                    <DocumentChecklistDetailPage />
                  </LazyRoute>
                ),
              },
            ],
          },
          {
            path: "discipline-activity-checklist",
            element: (
              <LazyRoute roles={["admin"]}>
                <DisciplineActivityChecklistPage />
              </LazyRoute>
            ),
          },
        ],
      },

      // Admin routes
      {
        path: "admin",
        element: (
          <RoleGuard allowedRoles={["admin"]}>
            <Outlet />
          </RoleGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="settings" replace />,
          },
          {
            path: "settings",
            element: (
              <LazyRoute roles={["admin"]}>
                <AdminSettingsPage />
              </LazyRoute>
            ),
          },
        ],
      },
    ],
  },

  // 404 catch-all
  {
    path: "*",
    element: (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <p className="text-muted-foreground mt-2">Page Not Found</p>
        </div>
      </div>
    ),
  },
]);
