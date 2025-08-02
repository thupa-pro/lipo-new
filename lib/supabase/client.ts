import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string
          avatar_url: string | null
          phone: string | null
          is_verified: boolean
          role: 'customer' | 'provider' | 'admin' | 'super_admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          display_name: string
          avatar_url?: string | null
          phone?: string | null
          is_verified?: boolean
          role?: 'customer' | 'provider' | 'admin' | 'super_admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string
          avatar_url?: string | null
          phone?: string | null
          is_verified?: boolean
          role?: 'customer' | 'provider' | 'admin' | 'super_admin'
          created_at?: string
          updated_at?: string
        }
      }
      providers: {
        Row: {
          id: string
          user_id: string
          business_name: string
          bio: string | null
          cover_photo_url: string | null
          category_id: string | null
          rating_average: number
          rating_count: number
          response_time_minutes: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          bio?: string | null
          cover_photo_url?: string | null
          category_id?: string | null
          rating_average?: number
          rating_count?: number
          response_time_minutes?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          bio?: string | null
          cover_photo_url?: string | null
          category_id?: string | null
          rating_average?: number
          rating_count?: number
          response_time_minutes?: number | null
          is_active?: boolean
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon_name: string | null
          parent_id: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon_name?: string | null
          parent_id?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon_name?: string | null
          parent_id?: string | null
          sort_order?: number
        }
      }
      services: {
        Row: {
          id: string
          provider_id: string
          name: string
          description: string | null
          price: number
          duration_minutes: number | null
          is_active: boolean
        }
        Insert: {
          id?: string
          provider_id: string
          name: string
          description?: string | null
          price: number
          duration_minutes?: number | null
          is_active?: boolean
        }
        Update: {
          id?: string
          provider_id?: string
          name?: string
          description?: string | null
          price?: number
          duration_minutes?: number | null
          is_active?: boolean
        }
      }
      bookings: {
        Row: {
          id: string
          customer_id: string
          provider_id: string
          service_id: string
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          scheduled_at: string
          duration_minutes: number | null
          location: any
          notes: string | null
          pricing: any
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          provider_id: string
          service_id: string
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          scheduled_at: string
          duration_minutes?: number | null
          location: any
          notes?: string | null
          pricing: any
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          provider_id?: string
          service_id?: string
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          scheduled_at?: string
          duration_minutes?: number | null
          location?: any
          notes?: string | null
          pricing?: any
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          customer_id: string
          provider_id: string
          rating: number
          title: string | null
          content: string | null
          would_recommend: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          customer_id: string
          provider_id: string
          rating: number
          title?: string | null
          content?: string | null
          would_recommend?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          customer_id?: string
          provider_id?: string
          rating?: number
          title?: string | null
          content?: string | null
          would_recommend?: boolean | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          recipient_id: string
          content: string
          message_type: 'text' | 'image' | 'file'
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          recipient_id: string
          content: string
          message_type?: 'text' | 'image' | 'file'
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          message_type?: 'text' | 'image' | 'file'
          read_at?: string | null
          created_at?: string
        }
      }
      health_check: {
        Row: {
          id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          status?: string
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

// Client-side Supabase client (for components)
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client (for API routes and server components)
export function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Admin Supabase client (with service role key)
export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase admin environment variables')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
