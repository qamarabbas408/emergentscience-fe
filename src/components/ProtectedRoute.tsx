import { Navigate, useLocation } from 'react-router-dom'
import { useMe } from '../api/hooks'
import { getAuthToken } from '../lib/apiClient'
import { appRoutes } from '../appRoutes'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const hasToken = Boolean(getAuthToken())
  const { data: user, isLoading } = useMe()

  if (!hasToken) {
    return <Navigate to={appRoutes.home} state={{ from: location }} replace />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-body">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={appRoutes.home} state={{ from: location }} replace />
  }

  return <>{children}</>
}
