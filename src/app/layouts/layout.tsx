
import { SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <main>
        {children}
      </main>
    </SidebarProvider>
  )
}