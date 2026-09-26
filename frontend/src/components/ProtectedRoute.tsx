import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, verificarAuth } = useAuthStore()

  useEffect(() => {
    if (token) {
      verificarAuth()
    }
  }, [token, verificarAuth])

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
