import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../providers/useAuth";
import type { ReactNode } from "react";

interface RoleGuardProps {
  children?: ReactNode;
  allowedRoles: ("admin" | "user")[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { currentUser, isLoading } = useAuth(); // ← removed authToken
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
