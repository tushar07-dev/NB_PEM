// src/app/router/RoleGuard.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/app/providers/AuthProvider"
import type { ReactNode } from "react"

interface Props {
  children?: ReactNode // 1. Make children optional
  allowedRoles: string[]
}

export const RoleGuard = ({ children, allowedRoles }: Props) => {
  const { authToken, currentUser } = useAuth()
  const location = useLocation()
  // 2. Not logged in → go to login
  // Standard practice: save the current location so you can redirect back after login
  if (!authToken) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 3. Logged in but role not allowed → unauthorized
  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  // 4. Industry Standard Return:
  // If children exist, render them. Otherwise, render the Outlet for nested routes.
  return children ? <>{children}</> : <Outlet />
}