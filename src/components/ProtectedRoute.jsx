import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * RBAC-protected route.
 *
 * Rules:
 *   - Not logged in          → redirect to /login
 *   - Logged in, wrong role  → redirect to their own dashboard
 *   - Logged in, correct role → render children
 *
 * Usage:
 *   <ProtectedRoute role="admin">   → only ADMIN can access
 *   <ProtectedRoute role="student"> → only STUDENT can access
 *   <ProtectedRoute>                → any logged-in user
 */
export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth()

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Wrong role → redirect to their own dashboard
  if (role && user.role !== role) {
    const ownDashboard = user.role === 'admin' ? '/admin' : '/student'
    return <Navigate to={ownDashboard} replace />
  }

  return children
}
