import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/shared/config/routes";
import { useAuth } from "../providers/useAuth";
import type { ReactNode } from "react";
import type { Permission } from "@/shared/config/permissions";
import { hasPermission } from "@/shared/config/permissions";

interface RoleGuardProps {
  children?: ReactNode;
  permission: Permission;
}

export const RoleGuard = ({ children, permission }: RoleGuardProps) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!hasPermission(currentUser.role, permission)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
