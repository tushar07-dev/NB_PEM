// src/app/router/index.tsx
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { RoleGuard } from "@/app/router/RoleGuard";
import { RoleBasedLayout } from "@/app/layouts/RoleBasedLayout";
import RouterError from "./RouterError";
import LoginPage from "@/features/auth/pages/LoginPage";
import UnauthorizedPage from "@/features/auth/pages/UnauthorizedPage";
import DocumentChecklistPage from "@/features/pem-check-lists/pages/DocumentChecklistPage";

// ==========================================
// LOADING FALLBACK
// ==========================================
const PageLoader = () => (
  <div className="flex h-full items-center justify-center">
    <div className="text-muted-foreground">Loading...</div>
  </div>
);

// ==========================================
// LAZY LOADED PAGES
// ==========================================
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

// PEM Requirements Pages
const ControlObjectRequirementPage = lazyPage("Control Object Requirement");

  const DocumentRequirementPage = lazyPage("Document Requirement");
const DisciplineActivityRequirementPage = lazyPage("Discipline Activity Requirement");

// PEM Checklists Pages
const ControlObjectChecklistPage = lazyPage("Control Object Check List");


const DisciplineActivityChecklistPage = lazyPage("Discipline Activity Check List");

// Admin Pages
  const AdminSettingsPage = lazyPage("Admin Settings");

// ==========================================
// COMING SOON FALLBACK
// ==========================================
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <p className="text-muted-foreground mt-2">Coming soon...</p>
      </div>
    </div>
  );
}



// ==========================================
// ROUTE WRAPPER WITH SUSPENSE
// ==========================================
function LazyRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: ("admin" | "user")[];
}) {
  return (
    <RoleGuard allowedRoles={roles}>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </RoleGuard>
  );
}

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
          {
            path: "document-checklist",
            element: (
              <LazyRoute roles={["admin"]}>
                <DocumentChecklistPage />
              </LazyRoute>
            ),
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
