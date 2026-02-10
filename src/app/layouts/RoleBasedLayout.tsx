// src/app/layouts/RoleBasedLayout.tsx
import { Outlet } from "react-router-dom";
import AppShell from "../components/AppShell";

export const RoleBasedLayout = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};
