import { type ReactNode } from "react";

import { TopHeader } from "@/shared/components/top-header";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/app-sidebar";

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  return (
    // Outer wrapper: Stack Header on top of the Content Area
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <TopHeader />
      <SidebarProvider defaultOpen={true} className="flex flex-row  overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 overflow-y-auto">
          <main className="h-full">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default AppShell;
