'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  // Get Supabase configuration status
  const supabase = createSupabaseClient()

  // Always try to create client but handle gracefully if not configured
  const initializeAuth = async () => {
    try {
      supabase = createSupabaseClient()
    } catch (error) {
      console.warn('Failed to create Supabase client:', error)
      supabase = null
    }
  }

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return null

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  const refreshUser = async () => {
    if (!supabase) return

    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const profile = await fetchUserProfile(session.user.id)
      setUserProfile(profile)
    }
  }

  useEffect(() => {
    // If Supabase is not configured, set loading to false and return
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
        }

        setSession(session)
        setUser(session?.user ?? null)

        // Fetch user profile if user exists
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id)
          setUserProfile(profile)
        }
      } catch (error) {
        console.error('Session initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)

        setSession(session)
        setUser(session?.user ?? null)

        // Fetch user profile for new sessions
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          const profile = await fetchUserProfile(session.user.id)
          setUserProfile(profile)
        } else if (event === 'SIGNED_OUT') {
          setUserProfile(null)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    if (!supabase) {
      // Clear local state even if Supabase is not configured
      setUser(null)
      setSession(null)
      setUserProfile(null)
      return
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }

      // Clear local state
      setUser(null)
      setSession(null)
      setUserProfile(null)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const value = {
    user,
    session,
    userProfile,
    loading,
    signOut,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
