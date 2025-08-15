import { NextRequest, NextResponse } from 'next/server'
// Using Supabase auth instead of Clerk

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Sign in with Clerk is typically handled on the client side
    // This endpoint is mainly for compatibility with the existing auth interface
    // The actual authentication should happen through Clerk's client-side methods
    
    // Check if user exists in Clerk
    try {
      const users = await clerkClient.users.getUserList({
        emailAddress: [email],
      })

      if (users.length === 0) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 })
      }

      // For security reasons, we can't validate password on the server
      // This should be handled by Clerk's client-side authentication
      return NextResponse.json({ 
        success: true,
        message: 'Please use Clerk client-side authentication' 
      })

    } catch (clerkError) {
      console.error('Clerk user lookup error:', clerkError)
      return NextResponse.json({ error: 'Authentication service unavailable' }, { status: 500 })
    }

  } catch (error) {
    console.error('Signin API error:', error)
    return NextResponse.json({ error: 'Failed to sign in' }, { status: 500 })
  }
}
