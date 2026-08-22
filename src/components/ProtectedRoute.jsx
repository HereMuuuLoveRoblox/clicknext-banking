import { Navigate, Outlet } from 'react-router-dom'
import { getCookie } from '@/lib/cookie'

function ProtectedRoute() {
  const email = getCookie('email')

  if (!email) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
