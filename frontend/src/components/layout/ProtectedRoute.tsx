import { useAuthStore } from '@/store/authStore'
import { Navigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}





