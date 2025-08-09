import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createSupabaseAdminClient } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createSupabaseAdminClient()

    // Get all user data from various tables
    const [
      userData,
      providerData,
      bookingsData,
      reviewsData,
      messagesData,
      paymentsData,
      analyticsData,
      aiInteractionsData,
    ] = await Promise.all([
      // User profile data
      supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single(),
      
      // Provider data (if applicable)
      supabase
        .from('providers')
        .select('*')
        .eq('user_id', userId),
      
      // Booking data (as customer and provider)
      supabase
        .from('bookings')
        .select('*')
        .or(`customer_id.eq.${userId},provider_id.in.(select id from providers where user_id = '${userId}')`),
      
      // Reviews data (given and received)
      supabase
        .from('reviews')
        .select('*')
        .or(`customer_id.eq.${userId},provider_id.in.(select id from providers where user_id = '${userId}')`),
      
      // Messages data
      supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`),
      
      // Payment data
      supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId),
      
      // Analytics events
      supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', userId),
      
      // AI interactions
      supabase
        .from('ai_interactions')
        .select('*')
        .eq('user_id', userId),
    ])

    // Structure the export data
    const exportData = {
      export_metadata: {
        requested_at: new Date().toISOString(),
        user_id: userId,
        format: 'JSON',
        version: '1.0',
      },
      personal_information: {
        profile: userData.data,
        provider_profile: providerData.data,
      },
      activity_data: {
        bookings: bookingsData.data,
        reviews: reviewsData.data,
        messages: messagesData.data?.map(msg => ({
          ...msg,
          content: msg.content, // Full message content
        })),
      },
      financial_data: {
        payments: paymentsData.data,
      },
      analytics_data: {
        events: analyticsData.data,
        ai_interactions: aiInteractionsData.data,
      },
      data_processing_information: {
        purposes: [
          'Service delivery and marketplace operations',
          'Customer support and communication',
          'Payment processing and financial reporting',
          'Platform improvement and analytics',
          'Legal compliance and dispute resolution',
        ],
        retention_periods: {
          profile_data: 'Until account deletion',
          booking_data: '7 years for tax purposes',
          payment_data: '7 years for legal compliance',
          analytics_data: '2 years for business intelligence',
          support_messages: '3 years for quality assurance',
        },
        third_party_processors: [
          'Clerk (authentication)',
          'Supabase (database hosting)',
          'Stripe (payment processing)',
          'Google AI (artificial intelligence features)',
          'Vercel (application hosting)',
        ],
      },
    }

    // Log the export request
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: 'data_export_requested',
        details: {
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown',
        },
      })

    // In production, you might want to:
    // 1. Generate this asynchronously
    // 2. Store it securely and send a download link
    // 3. Add encryption
    // 4. Set expiration time

    return NextResponse.json(exportData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="loconomy-data-export-${userId}-${Date.now()}.json"`,
      },
    })

  } catch (error) {
    console.error('GDPR export error:', error)
    return NextResponse.json({ error: 'Failed to generate data export' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return information about the export process
    return NextResponse.json({
      description: 'GDPR Data Export Service',
      what_data_included: [
        'Personal profile information',
        'Provider business details (if applicable)',
        'Booking history and transaction records',
        'Reviews and ratings given/received',
        'Messages and communications',
        'Payment and financial data',
        'Platform usage analytics',
        'AI interaction history',
      ],
      format: 'JSON',
      estimated_processing_time: '1-2 minutes',
      notes: [
        'Export includes all personal data as required by GDPR Article 15',
        'Some data may be redacted for security or legal reasons',
        'Financial data retained for legal compliance periods',
        'Third-party processor information included for transparency',
      ],
      instructions: 'Send a POST request to this endpoint to generate your data export',
    })

  } catch (error) {
    console.error('GDPR export info error:', error)
    return NextResponse.json({ error: 'Failed to get export information' }, { status: 500 })
  }
}
