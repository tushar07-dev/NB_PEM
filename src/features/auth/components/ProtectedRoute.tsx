import { Navigate } from "react-router-dom"
import { useAuth } from "@/app/providers/AuthProvider"
import type { ReactNode } from "react"

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { authToken } = useAuth()
  if (!authToken) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
