'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Custom hook to use auth context
export { useAuth }

// Hook for protected routes
export function useRequireAuth(redirectTo: string = '/auth/signin') {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  return { user, loading }
}

// Hook for guest routes (redirect if already authenticated)
export function useGuestOnly(redirectTo: string = '/dashboard') {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  return { user, loading }
}

// Hook to check if user has specific role
export function useUserRole() {
  const { userProfile } = useAuth()
  
  const hasRole = (role: string | string[]) => {
    if (!userProfile) return false
    
    const userRole = userProfile.role
    if (Array.isArray(role)) {
      return role.includes(userRole)
    }
    return userRole === role
  }

  const isCustomer = () => hasRole('customer')
  const isProvider = () => hasRole('provider')
  const isAdmin = () => hasRole(['admin', 'super_admin'])
  const isSuperAdmin = () => hasRole('super_admin')

  return {
    userRole: userProfile?.role || null,
    hasRole,
    isCustomer,
    isProvider,
    isAdmin,
    isSuperAdmin,
  }
}

// Hook for authentication status with detailed states
export function useAuthStatus() {
  const { user, session, userProfile, loading } = useAuth()

  const isAuthenticated = !!user && !!session
  const isEmailVerified = user?.email_confirmed_at ? true : false
  const hasProfile = !!userProfile
  const isLoading = loading

  return {
    isAuthenticated,
    isEmailVerified,
    hasProfile,
    isLoading,
    user,
    session,
    userProfile,
  }
}
