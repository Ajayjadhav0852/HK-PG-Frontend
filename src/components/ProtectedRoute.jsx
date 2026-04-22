import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * RBAC-protected route — ultra-secure, server-verified role.
 *
 * Rules:
 *   - Not logged in          → redirect to /login
 *   - Logged in, wrong role  → redirect to their own dashboard
 *   - Logged in, correct role → render children
 *
 * SECURITY: role is taken from the server-verified user object only.
 * localStorage is used only as a cache — AuthContext always re-validates
 * against /api/users/me on mount, so stale/tampered localStorage is overwritten.
 */
export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth()

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Normalize role — always lowercase for comparison
  const userRole = (user.role || '').toLowerCase().trim()
  const requiredRole = (role || '').toLowerCase().trim()

  // Wrong role → redirect to their own dashboard
  if (requiredRole && userRole !== requiredRole) {
    // Student trying to access admin → go to student dashboard
    // Admin trying to access student → go to admin dashboard
    const ownDashboard = userRole === 'admin' ? '/admin' : '/student'
    return <Navigate to={ownDashboard} replace />
  }

  return children
}
