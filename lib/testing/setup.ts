import { beforeAll, afterAll, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Mock environment variables for tests
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_mock'
process.env.CLERK_SECRET_KEY = 'sk_test_mock'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock_anon_key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock_service_key'
process.env.GOOGLE_AI_API_KEY = 'mock_ai_key'

// Global test setup
beforeAll(() => {
  // Setup global test configuration
})

afterEach(() => {
  // Cleanup after each test
  cleanup()
})

afterAll(() => {
  // Global cleanup
})

// Mock fetch globally for tests
global.fetch = global.fetch || require('node-fetch')

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock Clerk
vi.mock('@clerk/nextjs', () => ({
  auth: () => ({ userId: 'test-user-id' }),
  useUser: () => ({ user: null, isLoaded: true }),
  useAuth: () => ({ isLoaded: true, signOut: vi.fn() }),
  useSignIn: () => ({ isLoaded: true, signIn: { create: vi.fn() }, setActive: vi.fn() }),
  useSignUp: () => ({ isLoaded: true, signUp: { create: vi.fn(), update: vi.fn() }, setActive: vi.fn() }),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createSupabaseClient: () => ({
    from: () => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    },
  }),
  createSupabaseAdminClient: () => ({
    from: () => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  }),
}))
