import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { createSupabaseAdminClient } from '@/lib/supabase/client'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: any

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as any
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  const { id } = evt.data
  const eventType = evt.type

  const supabase = createSupabaseAdminClient()

  try {
    switch (eventType) {
      case 'user.created':
        await supabase.from('users').insert({
          id: evt.data.id,
          email: evt.data.email_addresses[0]?.email_address,
          display_name: `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim(),
          avatar_url: evt.data.image_url,
          is_verified: true,
          role: 'customer',
        })
        break

      case 'user.updated':
        await supabase.from('users').update({
          email: evt.data.email_addresses[0]?.email_address,
          display_name: `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim(),
          avatar_url: evt.data.image_url,
          updated_at: new Date().toISOString(),
        }).eq('id', evt.data.id)
        break

      case 'user.deleted':
        await supabase.from('users').delete().eq('id', evt.data.id)
        break
    }
  } catch (error) {
    console.error('Database operation error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return new Response('', { status: 200 })
}
