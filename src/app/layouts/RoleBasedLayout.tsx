import { Outlet } from "react-router-dom"
import AppShell from "@/app/components/AppShell"
import { useAuth } from "@/app/providers/AuthProvider"

export const RoleBasedLayout = () => {
  const { currentUser, authToken } = useAuth()
  // console.log("RoleBasedLayout currentUser:", currentUser)
  // console.log("RoleBasedLayout authToken:", authToken)
  // If not authenticated, let ProtectedRoute handle redirect
  if (!authToken) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
