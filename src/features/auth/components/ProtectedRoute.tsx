import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/shared/config/routes";
import { useAuth } from "@/app/providers/useAuth";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  // MSAL is checking existing session on mount — always wait
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  // No user after MSAL check → redirect to login
  if (!currentUser) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
