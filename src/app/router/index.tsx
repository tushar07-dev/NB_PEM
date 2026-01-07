import { createBrowserRouter, Navigate, Outlet } from "react-router-dom"
import DashboardPage from "@/features/dashboard/pages/DashboardPage"
import LoginPage from "@/features/auth/pages/LoginPage"
import UnauthorizedPage from "@/features/auth/pages/UnauthorizedPage"
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute"
import { RoleGuard } from "@/app/router/RoleGuard"
import { RoleBasedLayout } from "@/app/layouts/RoleBasedLayout"
import RouterError from "./RouterError"

// Admin pages
const DocsPage = () => <div>Document page</div>
const PemRequirementsPage = () => <div>PEM Requirements Page</div>
const DisciplineActivityListPage = () => <div>Discipline Activity List Page</div>
const ControlObjectChecklistPage = () => <div>Control Object Checklist Page</div>

// User pages
const UserProfilePage = () => <div>User Profile</div>

export const router = createBrowserRouter([
  // 1. PUBLIC ROUTES
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
// 2. PROTECTED APP ROUTES (Wrapped in App Shell/Sidebar)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RoleBasedLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouterError />,  
    children: [
      // Default landing page
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: "dashboard",
        element: (
          <RoleGuard allowedRoles={["admin", "user"]}>
            <DashboardPage />
          </RoleGuard>
        )
      },

      // 🔐 ADMIN ONLY (No prefix in URL)
      {
        element: (
          <RoleGuard allowedRoles={["admin"]}>
            <Outlet />
          </RoleGuard>
        ),
        children: [
          { path: "pem-requirements", element: <PemRequirementsPage /> },
          { path: "discipline-activity-list", element: <DisciplineActivityListPage /> },
          { path: "control-object-checklist", element: <ControlObjectChecklistPage /> },
          { path: "document-checklist", element: <DocsPage /> },
        ]
      },

      // 🔐 USER ONLY (No prefix in URL)
      {
        element: (
          <RoleGuard allowedRoles={["user"]}>
            <Outlet />
          </RoleGuard>
        ),
        children: [
          { path: "profile", element: <UserProfilePage /> },
        ]
      },
    ],
  },

  // 3. FALLBACK
  {
    path: "*",
    element: <div className="p-10 text-center">404 - Page Not Found</div>,
  },
])
