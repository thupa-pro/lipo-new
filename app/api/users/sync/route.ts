// Using Supabase auth instead of Clerk
import { createSupabaseAdminClient } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, firstName, lastName, imageUrl } = body

    const supabase = createSupabaseAdminClient()
    
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (existingUser) {
      // Update existing user
      const { data, error } = await supabase
        .from('users')
        .update({
          email,
          display_name: `${firstName} ${lastName}`.trim(),
          avatar_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(data)
    } else {
      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email,
          display_name: `${firstName} ${lastName}`.trim(),
          avatar_url: imageUrl,
          is_verified: true,
          role: 'customer',
        })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(data)
    }
  } catch (error) {
    console.error('User sync error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
