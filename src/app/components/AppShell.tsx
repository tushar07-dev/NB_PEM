import { type ReactNode } from "react";

import { TopHeader } from "@/shared/components/top-header";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/app-sidebar";

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <TopHeader />
      <SidebarProvider defaultOpen={true} className="flex flex-1">
        <AppSidebar />
        <SidebarInset className="overflow-y-auto p-4 md:p-6">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default AppShell;
