import { RoleGuard } from "@/app/router/RoleGuard";
import { Suspense } from "react";
import { PageLoader } from "./page-loader";
import type { Role } from "@/shared/types/roles";

interface LazyRouteProps {
  children: React.ReactNode;
  roles: Role[];
}

export function LazyRoute({ children, roles }: LazyRouteProps) {
  return (
    <RoleGuard allowedRoles={roles}>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </RoleGuard>
  );
}
