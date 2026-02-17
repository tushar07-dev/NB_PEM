import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../providers/useAuth";
import type { ReactNode } from "react";

interface RoleGuardProps {
  children?: ReactNode;
  allowedRoles: ("admin" | "user")[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { authToken, currentUser, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!authToken || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but role not allowed → unauthorized
  if (!allowedRoles.includes(currentUser.role)) {
    console.warn(
      `🚫 Access denied: User role "${currentUser.role}" not in allowed roles [${allowedRoles.join(", ")}]`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children if provided, otherwise render Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};
