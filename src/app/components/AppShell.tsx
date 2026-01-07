import { type ReactNode } from "react";

import { TopHeader } from "@/shared/components/top-header";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/app-sidebar";

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  return (
    <div>
      <SidebarProvider defaultOpen={true} className="flex flex-col">
        <TopHeader />
        <div className="flex flex-1">
          <AppSidebar />
          {/* <SidebarInset>
            {children}
          </SidebarInset> */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AppShell;
