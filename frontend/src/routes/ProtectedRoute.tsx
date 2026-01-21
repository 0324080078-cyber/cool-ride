import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

type Role = 'passenger' | 'rider' | 'admin'

interface ProtectedRouteProps {
  allowedRoles: Role[]
  children: JSX.Element
}

export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const location = useLocation()
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
