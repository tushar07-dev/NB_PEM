import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import UnauthorizedPage from "@/features/auth/pages/UnauthorizedPage";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { RoleGuard } from "@/app/router/RoleGuard";
import { RoleBasedLayout } from "@/app/layouts/RoleBasedLayout";
import RouterError from "./RouterError";
import { DocumentChecklist } from "@/features/document-checklist/pages/DocumentChecklist";

// --------------------
// ADMIN PAGES
// --------------------
const PemRequirementsPage = () => <div>PEM Requirements Page</div>;
const DisciplineActivityListPage = () => (
  <div>Discipline Activity List Page</div>
);
const ControlObjectChecklistPage = () => (
  <div>Control Object Checklist Page</div>
);

// --------------------
// USER PAGES
// --------------------
const UserProfilePage = () => <div>User Profile</div>;

// --------------------
// ROUTER CONFIG
// --------------------
export const router = createBrowserRouter([
  // ====================
  // PUBLIC ROUTES
  // ====================
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },

  // ====================
  // PROTECTED APP ROUTES
  // ====================
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RoleBasedLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouterError />,
    children: [
      // Redirect root → dashboard
      { index: true, element: <Navigate to="/dashboard" replace /> },

      // --------------------
      // COMMON (ADMIN + USER)
      // --------------------
      {
        path: "dashboard",
        element: (
          <RoleGuard allowedRoles={["admin", "user"]}>
            <DocumentChecklist />
          </RoleGuard>
        ),
      },

      // ====================
      // ADMIN ROUTES
      // ====================
      {
        path: "admin",
        element: (
          <RoleGuard allowedRoles={["admin"]}>
            <Outlet />
          </RoleGuard>
        ),
        children: [
          { index: true, element: <Navigate to="pem-requirements" replace /> },
          { path: "pem-requirements", element: <PemRequirementsPage /> },
          {
            path: "dashboard",
            element: <DisciplineActivityListPage />,
          },
          {
            path: "control-object-checklist",
            element: <ControlObjectChecklistPage />,
          },
        ],
      },

      // ====================
      // USER ROUTES
      // ====================
      {
        path: "user",
        element: (
          <RoleGuard allowedRoles={["user"]}>
            <Outlet />
          </RoleGuard>
        ),
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          { path: "profile", element: <UserProfilePage /> },
        ],
      },
    ],
  },

  // ====================
  // dash
  // ====================
  {
    path: "*",
    element: <div className="p-10 text-center">404 - Page Not Found</div>,
  },
]);
