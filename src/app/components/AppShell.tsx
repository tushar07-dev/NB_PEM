// src/app/components/AppShell.tsx
import { type ReactNode } from "react";
import { TopHeader } from "@/shared/components/top-header";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/app-sidebar";
import { DynamicBreadcrumb } from "@/shared/components/DynamicBreadcrumb";
import { ErrorBoundary } from "@/shared/errors/ErrorBoundary";

interface AppShellProps {
  children: ReactNode;
}

// src/app/components/AppShell.tsx
const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <TopHeader />
      <SidebarProvider
        defaultOpen={true}
        className="flex flex-1 min-h-0 overflow-hidden"
      >
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-h-0 overflow-y-auto"> {/* ← flex flex-col flex-1 */}
          <DynamicBreadcrumb />
          <ErrorBoundary>
            <div className="flex flex-col flex-1"> {/* ← wrap children */}
              {children}
            </div>
          </ErrorBoundary>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default AppShell;
