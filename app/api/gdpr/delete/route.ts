import { NextRequest, NextResponse } from 'next/server'
// Using Supabase auth instead of Clerk
import { createSupabaseAdminClient } from '@/lib/supabase/client'
import { z } from 'zod'

const deleteRequestSchema = z.object({
  confirmation: z.literal('DELETE_MY_ACCOUNT'),
  reason: z.string().min(1).max(500).optional(),
  backup_email: z.string().email().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = deleteRequestSchema.parse(body)

    const supabase = createSupabaseAdminClient()

    // Check for active obligations that prevent immediate deletion
    const { data: activeBookings } = await supabase
      .from('bookings')
      .select('id, status, scheduled_at')
      .or(`customer_id.eq.${userId},provider_id.in.(select id from providers where user_id = '${userId}')`)
      .in('status', ['pending', 'confirmed', 'in_progress'])

    const { data: pendingPayments } = await supabase
      .from('payments')
      .select('id, status, amount')
      .eq('user_id', userId)
      .in('status', ['pending', 'processing'])

    if (activeBookings && activeBookings.length > 0) {
      return NextResponse.json({
        error: 'Cannot delete account with active bookings',
        details: {
          active_bookings: activeBookings.length,
          earliest_completion: activeBookings[0]?.scheduled_at,
          suggestion: 'Please complete or cancel all active bookings before requesting deletion',
        },
      }, { status: 400 })
    }

    if (pendingPayments && pendingPayments.length > 0) {
      return NextResponse.json({
        error: 'Cannot delete account with pending payments',
        details: {
          pending_payments: pendingPayments.length,
          total_amount: pendingPayments.reduce((sum, p) => sum + p.amount, 0),
          suggestion: 'Please resolve all pending payments before requesting deletion',
        },
      }, { status: 400 })
    }

    // Create deletion request record
    const { data: deletionRequest, error: deletionError } = await supabase
      .from('data_deletion_requests')
      .insert({
        user_id: userId,
        reason: validatedData.reason,
        backup_email: validatedData.backup_email,
        status: 'pending',
        requested_at: new Date().toISOString(),
        scheduled_deletion_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days grace period
      })
      .select()
      .single()

    if (deletionError) {
      console.error('Deletion request error:', deletionError)
      return NextResponse.json({ error: 'Failed to create deletion request' }, { status: 500 })
    }

    // Begin anonymization of non-essential data immediately
    await anonymizeUserData(supabase, userId)

    // Log the deletion request
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: 'data_deletion_requested',
        details: {
          deletion_request_id: deletionRequest.id,
          reason: validatedData.reason,
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown',
        },
      })

    return NextResponse.json({
      deletion_request_id: deletionRequest.id,
      status: 'pending',
      grace_period_ends: deletionRequest.scheduled_deletion_at,
      message: 'Your deletion request has been received. You have 30 days to cancel this request.',
      what_happens_next: [
        'Your account will be deactivated immediately',
        'Personal data will be anonymized where possible',
        'Complete deletion will occur after the 30-day grace period',
        'Some data may be retained for legal compliance (7 years for financial records)',
        'You can cancel this request within 30 days by contacting support',
      ],
      data_retention: {
        immediately_anonymized: ['Profile photos', 'Personal messages', 'Search history'],
        deleted_after_grace_period: ['Profile information', 'Reviews', 'Analytics data'],
        retained_for_compliance: ['Payment records', 'Tax documents', 'Dispute records'],
      },
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }

    console.error('GDPR deletion error:', error)
    return NextResponse.json({ error: 'Failed to process deletion request' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const deletionRequestId = searchParams.get('request_id')

    if (!deletionRequestId) {
      return NextResponse.json({ error: 'deletion_request_id is required' }, { status: 400 })
    }

    const supabase = createSupabaseAdminClient()

    // Cancel the deletion request
    const { data: cancelledRequest, error } = await supabase
      .from('data_deletion_requests')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', deletionRequestId)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to cancel deletion request or request not found' }, { status: 404 })
    }

    // Reactivate the user account
    await supabase
      .from('users')
      .update({
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    // Log the cancellation
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: 'data_deletion_cancelled',
        details: {
          deletion_request_id: deletionRequestId,
        },
      })

    return NextResponse.json({
      message: 'Deletion request cancelled successfully',
      status: 'cancelled',
      account_reactivated: true,
    })

  } catch (error) {
    console.error('GDPR deletion cancellation error:', error)
    return NextResponse.json({ error: 'Failed to cancel deletion request' }, { status: 500 })
  }
}

async function anonymizeUserData(supabase: any, userId: string) {
  try {
    // Anonymize user profile
    await supabase
      .from('users')
      .update({
        email: `anonymized-${userId}@deleted.local`,
        display_name: 'Deleted User',
        avatar_url: null,
        phone: null,
        is_active: false,
        anonymized_at: new Date().toISOString(),
      })
      .eq('id', userId)

    // Anonymize messages content (keep metadata for conversation integrity)
    await supabase
      .from('messages')
      .update({
        content: '[Message deleted by user request]',
        anonymized_at: new Date().toISOString(),
      })
      .eq('sender_id', userId)

    // Remove personal identifiers from analytics events
    await supabase
      .from('analytics_events')
      .update({
        properties: {},
        anonymized_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    console.log(`Anonymized data for user ${userId}`)
  } catch (error) {
    console.error('Error anonymizing user data:', error)
  }
}
