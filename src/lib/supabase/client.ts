import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase environment variables are properly configured
const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-ref') && 
  !supabaseAnonKey.includes('your-anon-key') &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder') &&
  !supabaseUrl.includes('your-supabase-url-here') &&
  !supabaseAnonKey.includes('your-supabase-anon-key-here');

// Cache the warning to prevent spam
let hasWarned = false;

export function createSupabaseClient() {
  if (!isSupabaseConfigured) {
    if (!hasWarned) {
      console.warn('Supabase environment variables are not configured properly. Using mock client.');
      hasWarned = true;
    }
    // Return a comprehensive mock client that won't cause errors
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange: (callback: any) => {
          // Call callback with initial null state
          setTimeout(() => callback('INITIAL_SESSION', null), 0);
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
        signOut: () => Promise.resolve({ error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Mock client') }),
        signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Mock client') })
      },
      from: (table: string) => ({
        select: (columns?: string) => ({
          eq: (column: string, value: any) => ({
            single: () => Promise.resolve({ data: null, error: null }),
            limit: (count: number) => Promise.resolve({ data: [], error: null })
          }),
          limit: (count: number) => Promise.resolve({ data: [], error: null }),
          order: (column: string, options?: any) => Promise.resolve({ data: [], error: null })
        }),
        insert: (values: any) => Promise.resolve({ data: null, error: null }),
        update: (values: any) => ({
          eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
        }),
        delete: () => ({
          eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
        })
      }),
      channel: (name: string) => ({
        on: (event: string, schema: any, callback: any) => ({ subscribe: () => {} }),
        subscribe: () => {}
      })
    } as any;
  }

  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}

// Export configuration status for other components
export { isSupabaseConfigured };
