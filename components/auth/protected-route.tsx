'use client'

import { useAuth } from '@/components/auth/clerk-auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
  requireEmailVerification?: boolean
  allowedRoles?: string[]
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  fallback,
  requireEmailVerification = false,
  allowedRoles = [],
  redirectTo = '/auth/signin',
}: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Redirect if not authenticated
      if (!user) {
        router.push(redirectTo)
        return
      }

      // Check email verification if required
      if (requireEmailVerification && !user.email_confirmed_at) {
        router.push('/auth/verify-email')
        return
      }

      // Check role permissions if specified
      if (allowedRoles.length > 0 && userProfile) {
        if (!allowedRoles.includes(userProfile.role)) {
          router.push('/unauthorized')
          return
        }
      }
    }
  }, [user, userProfile, loading, router, requireEmailVerification, allowedRoles, redirectTo])

  // Show loading state
  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    )
  }

  // Don't render if not authenticated
  if (!user) {
    return null
  }

  // Don't render if email verification required but not verified
  if (requireEmailVerification && !user.email_confirmed_at) {
    return null
  }

  // Don't render if role not allowed
  if (allowedRoles.length > 0 && userProfile && !allowedRoles.includes(userProfile.role)) {
    return null
  }

  return <>{children}</>
}

// Specific wrapper for admin routes
export function AdminRoute({ children, ...props }: Omit<ProtectedRouteProps, 'allowedRoles'>) {
  return (
    <ProtectedRoute allowedRoles={['admin', 'super_admin']} {...props}>
      {children}
    </ProtectedRoute>
  )
}

// Specific wrapper for provider routes
export function ProviderRoute({ children, ...props }: Omit<ProtectedRouteProps, 'allowedRoles'>) {
  return (
    <ProtectedRoute allowedRoles={['provider']} {...props}>
      {children}
    </ProtectedRoute>
  )
}

// Wrapper for guest-only routes (redirect if authenticated)
export function GuestRoute({ 
  children, 
  redirectTo = '/dashboard' 
}: { 
  children: ReactNode
  redirectTo?: string 
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Don't render if authenticated
  if (user) {
    return null
  }

  return <>{children}</>
}
