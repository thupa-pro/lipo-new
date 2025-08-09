import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthButtons } from '@/components/auth/auth-buttons'

// Mock Clerk hooks
vi.mock('@clerk/nextjs', () => ({
  useUser: vi.fn(),
  SignInButton: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  SignUpButton: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  UserButton: () => <div>User Menu</div>,
}))

describe('AuthButtons', () => {
  it('should render sign in and sign up buttons for guest users', () => {
    // Mock guest user
    vi.mocked(require('@clerk/nextjs').useUser).mockReturnValue({
      isSignedIn: false,
      user: null,
    })

    render(<AuthButtons />)
    
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })

  it('should render user menu for authenticated users', () => {
    // Mock authenticated user
    vi.mocked(require('@clerk/nextjs').useUser).mockReturnValue({
      isSignedIn: true,
      user: { id: 'user-123', firstName: 'John' },
    })

    render(<AuthButtons />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('User Menu')).toBeInTheDocument()
  })
})
