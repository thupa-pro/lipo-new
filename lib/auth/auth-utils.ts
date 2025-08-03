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

      // Sign up user with Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            display_name: `${data.firstName} ${data.lastName}`,
            role: data.userType,
            agree_to_terms: data.agreeToTerms,
            agree_to_marketing: data.agreeToMarketing,
          }
        }
      })

      if (authError) {
        return { error: { message: authError.message } }
      }

      if (!authData.user) {
        return { error: { message: 'Failed to create user account' } }
      }

      // Create user profile in our database
      const { error: profileError } = await this.supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: data.email,
          display_name: `${data.firstName} ${data.lastName}`,
          role: data.userType,
          is_verified: false,
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Don't fail signup if profile creation fails, user can complete it later
      }

      // If user type is provider, create provider profile
      if (data.userType === 'provider') {
        const { error: providerError } = await this.supabase
          .from('providers')
          .insert({
            user_id: authData.user.id,
            business_name: `${data.firstName} ${data.lastName}`,
            rating_average: 0,
            rating_count: 0,
            is_active: true,
          })

        if (providerError) {
          console.error('Provider profile creation error:', providerError)
        }
      }

      // Check if email confirmation is required
      const needsVerification = !authData.session

      return { error: null, needsVerification }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: { message: 'An unexpected error occurred during sign up' } }
    }
  }

  async signIn(data: SignInData): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await this.supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { error: { message: 'Invalid email or password' } }
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: { message: 'Please check your email and click the confirmation link before signing in' } }
        }
        return { error: { message: error.message } }
      }

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
