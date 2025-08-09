import { createSupabaseClient } from '@/lib/supabase/client'
import { createSupabaseAdminClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/client'

export type UserRole = 'customer' | 'provider' | 'admin' | 'super_admin'

export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  userType: UserRole
  agreeToTerms: boolean
  agreeToMarketing: boolean
}

export interface SignInData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthError {
  message: string
  field?: string
}

export class AuthService {
  private supabase = createSupabaseClient()

  async signUp(data: SignUpData): Promise<{ error: AuthError | null; needsVerification?: boolean }> {
    try {
      // Validate password strength
      if (data.password.length < 8) {
        return { error: { message: 'Password must be at least 8 characters long', field: 'password' } }
      }

      // Create user with Clerk API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          userType: data.userType,
          agreeToTerms: data.agreeToTerms,
          agreeToMarketing: data.agreeToMarketing,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        return { error: { message: result.error || 'Failed to create account' } }
      }

      return { error: null, needsVerification: result.needsVerification || false }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: { message: 'An unexpected error occurred during sign up' } }
    }
  }

  async signIn(data: SignInData): Promise<{ error: AuthError | null }> {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        return { error: { message: result.error || 'Failed to sign in' } }
      }

      // If successful, the session will be handled by Clerk's cookies
      return { error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: { message: 'An unexpected error occurred during sign in' } }
    }
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await this.supabase.auth.signOut()
      if (error) {
        return { error: { message: error.message } }
      }
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error: { message: 'An unexpected error occurred during sign out' } }
    }
  }

  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { error: { message: error.message } }
      }

      return { error: null }
    } catch (error) {
      console.error('Reset password error:', error)
      return { error: { message: 'An unexpected error occurred while sending reset email' } }
    }
  }

  async signInWithProvider(provider: 'google' | 'github'): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (error) {
        return { error: { message: error.message } }
      }

      return { error: null }
    } catch (error) {
      console.error('Social sign in error:', error)
      return { error: { message: 'An unexpected error occurred during social sign in' } }
    }
  }

  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return { error: { message: error.message } }
      }

      return { error: null }
    } catch (error) {
      console.error('Update password error:', error)
      return { error: { message: 'An unexpected error occurred while updating password' } }
    }
  }

  async getCurrentUser() {
    const { data: { user } } = await this.supabase.auth.getUser()
    return user
  }

  async getUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Get user profile error:', error)
      return null
    }

    return data
  }

  async getProviderProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('providers')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Get provider profile error:', error)
      return null
    }

    return data
  }
}

export const authService = new AuthService()
