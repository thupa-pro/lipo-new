import { NextRequest, NextResponse } from 'next/server'
// Using Supabase auth instead of Clerk
import { createSupabaseAdminClient } from '@/lib/supabase/client'
import { z } from 'zod'

const availabilitySchema = z.object({
  provider_id: z.string().uuid(),
  date: z.string().datetime(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  status: z.enum(['available', 'busy', 'blocked']).default('available'),
  recurring: z.object({
    type: z.enum(['none', 'daily', 'weekly', 'monthly']).default('none'),
    interval: z.number().min(1).max(12).default(1),
    end_date: z.string().datetime().optional(),
  }).optional(),
})

const scheduleRequestSchema = z.object({
  provider_id: z.string().uuid(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const providerId = searchParams.get('provider_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    if (!providerId) {
      return NextResponse.json({ error: 'provider_id is required' }, { status: 400 })
    }

    const query = scheduleRequestSchema.parse({
      provider_id: providerId,
      start_date: startDate || new Date().toISOString(),
      end_date: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    })

    const supabase = createSupabaseAdminClient()

    // Get provider availability
    const { data: availability, error } = await supabase
      .from('provider_availability')
      .select('*')
      .eq('provider_id', query.provider_id)
      .gte('date', query.start_date)
      .lte('date', query.end_date || query.start_date)
      .order('date', { ascending: true })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
    }

    // Get existing bookings to mark busy slots
    const { data: bookings } = await supabase
      .from('bookings')
      .select('scheduled_at, duration_minutes, status')
      .eq('provider_id', query.provider_id)
      .in('status', ['pending', 'confirmed', 'in_progress'])
      .gte('scheduled_at', query.start_date)
      .lte('scheduled_at', query.end_date || query.start_date)

    // Generate time slots with availability status
    const timeSlots = generateTimeSlots(query.start_date, query.end_date, availability, bookings)

    return NextResponse.json({
      provider_id: query.provider_id,
      date_range: {
        start: query.start_date,
        end: query.end_date,
      },
      time_slots: timeSlots,
      summary: {
        total_slots: timeSlots.length,
        available_slots: timeSlots.filter(slot => slot.status === 'available').length,
        busy_slots: timeSlots.filter(slot => slot.status === 'busy').length,
      },
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 })
    }

    console.error('Availability GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = availabilitySchema.parse(body)
    
    const supabase = createSupabaseAdminClient()

    // Verify user owns the provider account
    const { data: provider, error: providerError } = await supabase
      .from('providers')
      .select('id')
      .eq('id', validatedData.provider_id)
      .eq('user_id', userId)
      .single()

    if (providerError || !provider) {
      return NextResponse.json({ error: 'Provider not found or access denied' }, { status: 403 })
    }

    // Create availability record
    const { data: availability, error } = await supabase
      .from('provider_availability')
      .insert({
        provider_id: validatedData.provider_id,
        date: validatedData.date,
        start_time: validatedData.start_time,
        end_time: validatedData.end_time,
        status: validatedData.status,
        recurring_config: validatedData.recurring,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create availability' }, { status: 500 })
    }

    // Handle recurring availability
    if (validatedData.recurring && validatedData.recurring.type !== 'none') {
      await createRecurringAvailability(supabase, availability, validatedData.recurring)
    }

    return NextResponse.json(availability, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }

    console.error('Availability POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { availability_id, ...updateData } = body
    
    const supabase = createSupabaseAdminClient()

    // Verify ownership and update
    const { data: availability, error } = await supabase
      .from('provider_availability')
      .update(updateData)
      .eq('id', availability_id)
      .eq('provider.user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 })
    }

    return NextResponse.json(availability)

  } catch (error) {
    console.error('Availability PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateTimeSlots(startDate: string, endDate: string | undefined, availability: any[], bookings: any[]) {
  const slots = []
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date(start.getTime() + 24 * 60 * 60 * 1000)
  
  // Generate 30-minute slots for each day
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dayAvailability = availability.filter(a => 
      new Date(a.date).toDateString() === date.toDateString()
    )

    for (let hour = 8; hour < 20; hour++) { // 8 AM to 8 PM
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(date)
        slotTime.setHours(hour, minute, 0, 0)
        
        const timeString = slotTime.toTimeString().substring(0, 5)
        
        // Check if this slot is within available hours
        const isAvailable = dayAvailability.some(a => 
          timeString >= a.start_time && timeString < a.end_time && a.status === 'available'
        )

        // Check if this slot conflicts with existing bookings
        const isBooked = bookings.some(booking => {
          const bookingStart = new Date(booking.scheduled_at)
          const bookingEnd = new Date(bookingStart.getTime() + booking.duration_minutes * 60000)
          return slotTime >= bookingStart && slotTime < bookingEnd
        })

        let status = 'unavailable'
        if (isAvailable && !isBooked) {
          status = 'available'
        } else if (isBooked) {
          status = 'busy'
        }

        slots.push({
          datetime: slotTime.toISOString(),
          time: timeString,
          status,
        })
      }
    }
  }

  return slots.filter(slot => slot.status !== 'unavailable')
}

async function createRecurringAvailability(supabase: any, baseAvailability: any, recurring: any) {
  const records = []
  const startDate = new Date(baseAvailability.date)
  const endDate = recurring.end_date ? new Date(recurring.end_date) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  
  let currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    switch (recurring.type) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + recurring.interval)
        break
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7 * recurring.interval)
        break
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + recurring.interval)
        break
    }
    
    if (currentDate <= endDate) {
      records.push({
        provider_id: baseAvailability.provider_id,
        date: currentDate.toISOString(),
        start_time: baseAvailability.start_time,
        end_time: baseAvailability.end_time,
        status: baseAvailability.status,
        recurring_config: recurring,
      })
    }
  }

  if (records.length > 0) {
    await supabase
      .from('provider_availability')
      .insert(records)
  }
}
