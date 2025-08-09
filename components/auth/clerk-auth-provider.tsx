'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs'

interface AuthContextType {
  user: any | null
  session: any | null
  userProfile: any | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userProfile: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
})

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const { signOut: clerkSignOut } = useClerkAuth()
  const [userProfile, setUserProfile] = useState<any | null>(null)

  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/users?id=${userId}`)
      if (response.ok) {
        const profile = await response.json()
        return profile
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
    return null
  }

  const refreshUser = async () => {
    if (user?.id) {
      const profile = await fetchUserProfile(user.id)
      setUserProfile(profile)
    }
  }

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserProfile(user.id).then(setUserProfile)
    } else if (isLoaded && !user) {
      setUserProfile(null)
    }
  }, [user, isLoaded])

  const signOut = async () => {
    await clerkSignOut()
    setUserProfile(null)
  }

  const value = {
    user,
    session: user ? { user } : null,
    userProfile,
    loading: !isLoaded,
    signOut,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
