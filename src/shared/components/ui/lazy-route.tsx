import { RoleGuard } from "@/app/router/RoleGuard";
import { Suspense } from "react";
import { PageLoader } from "./page-loader";

export function LazyRoute({
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
