import { RoleGuard } from "@/app/router/RoleGuard";
import { Suspense } from "react";
import { PageLoader } from "./page-loader";
import type { Permission } from "@/shared/config/permissions";

interface LazyRouteProps {
  children: React.ReactNode;
  permission: Permission;
}

export function LazyRoute({ children, permission }: LazyRouteProps) {
  return (
    <RoleGuard permission={permission}>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </RoleGuard>
  );
}
