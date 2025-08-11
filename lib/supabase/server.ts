import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './client'
import { isSupabaseConfigured } from '@/lib/env-check'

export function createSupabaseServerComponent() {
  const cookieStore = cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Supabase environment variables not configured. Using fallback client.')
      // Return a null client that handles graceful fallbacks
      return null
    } else {
      throw new Error('Missing Supabase environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
    }
  }

  if (!isSupabaseConfigured()) {
    console.warn('⚠️ Supabase appears to be using placeholder values. Data operations may not work correctly.')
  }

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
