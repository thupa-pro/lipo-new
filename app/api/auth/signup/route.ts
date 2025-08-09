import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { createSupabaseAdminClient } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, userType, agreeToTerms, agreeToMarketing } = await request.json()

    // Validate input
    if (!email || !password || !firstName || !lastName || !userType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!agreeToTerms) {
      return NextResponse.json({ error: 'You must agree to the terms and conditions' }, { status: 400 })
    }

    // Create user with Clerk
    const user = await clerkClient.users.createUser({
      emailAddress: [email],
      password,
      firstName,
      lastName,
      publicMetadata: {
        role: userType,
        agreeToTerms,
        agreeToMarketing,
      },
    })

    // Sync user to Supabase database
    const supabase = createSupabaseAdminClient()
    
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: email,
        display_name: `${firstName} ${lastName}`,
        role: userType,
        is_verified: true, // Clerk handles verification
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Continue even if profile creation fails
    }

    // If user type is provider, create provider profile
    if (userType === 'provider') {
      const { error: providerError } = await supabase
        .from('providers')
        .insert({
          user_id: user.id,
          business_name: `${firstName} ${lastName}`,
          rating_average: 0,
          rating_count: 0,
          is_active: true,
        })

      if (providerError) {
        console.error('Provider profile creation error:', providerError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      userId: user.id,
      needsVerification: false // Clerk doesn't require email verification by default
    })

  } catch (error: any) {
    console.error('Signup API error:', error)
    
    // Handle Clerk-specific errors
    if (error.errors) {
      const clerkError = error.errors[0]
      if (clerkError.code === 'form_identifier_exists') {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 })
      }
      if (clerkError.code === 'form_password_pwned') {
        return NextResponse.json({ error: 'This password has been compromised. Please choose a different password.' }, { status: 400 })
      }
      if (clerkError.code === 'form_password_length_too_short') {
        return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 })
      }
      return NextResponse.json({ error: clerkError.longMessage || clerkError.message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
