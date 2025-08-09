import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createSupabaseAdminClient } from '@/lib/supabase/client'
import { z } from 'zod'

const matchingRequestSchema = z.object({
  service_category: z.string().uuid(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    radius: z.number().min(1).max(50).default(10),
  }),
  budget: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
  urgency: z.enum(['immediate', 'today', 'this_week', 'flexible']).default('flexible'),
  requirements: z.array(z.string()).optional(),
  preferred_time: z.object({
    day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).optional(),
    time: z.string().optional(), // HH:MM format
  }).optional(),
})

interface MatchScore {
  provider_id: string
  score: number
  factors: {
    distance: number
    rating: number
    availability: number
    price: number
    experience: number
  }
  estimated_arrival: string
  confidence: 'high' | 'medium' | 'low'
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = matchingRequestSchema.parse(body)
    
    const supabase = createSupabaseAdminClient()

    // Get providers in the specified category and location
    const { data: providers, error: providersError } = await supabase
      .rpc('nearby_providers_with_services', {
        lat: validatedData.location.lat,
        lng: validatedData.location.lng,
        radius_km: validatedData.location.radius,
        category_id: validatedData.service_category,
        budget_min: validatedData.budget?.min,
        budget_max: validatedData.budget?.max,
      })

    if (providersError) {
      console.error('Database error:', providersError)
      return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 })
    }

    if (!providers || providers.length === 0) {
      return NextResponse.json({
        matches: [],
        message: 'No providers found matching your criteria. Try expanding your search radius or budget.',
      })
    }

    // Calculate match scores
    const matches: MatchScore[] = await Promise.all(
      providers.map(async (provider: any) => {
        const score = calculateMatchScore(provider, validatedData)
        const estimatedArrival = calculateEstimatedArrival(provider, validatedData)
        
        return {
          provider_id: provider.id,
          score: score.total,
          factors: score.factors,
          estimated_arrival: estimatedArrival,
          confidence: score.total > 80 ? 'high' : score.total > 60 ? 'medium' : 'low',
        }
      })
    )

    // Sort by score and take top matches
    const sortedMatches = matches
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

    // Get detailed provider information for top matches
    const providerIds = sortedMatches.map(m => m.provider_id)
    const { data: detailedProviders } = await supabase
      .from('providers')
      .select(`
        *,
        user:users(id, display_name, avatar_url),
        services:services!inner(
          id, name, description, price, price_type, 
          category:categories(name)
        )
      `)
      .in('id', providerIds)
      .eq('is_active', true)

    // Combine match scores with provider details
    const enrichedMatches = sortedMatches.map(match => {
      const provider = detailedProviders?.find(p => p.id === match.provider_id)
      return {
        ...match,
        provider,
      }
    })

    // Log matching request for analytics
    await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_type: 'matching_request',
        properties: {
          category: validatedData.service_category,
          location: validatedData.location,
          urgency: validatedData.urgency,
          matches_found: enrichedMatches.length,
        },
      })

    return NextResponse.json({
      matches: enrichedMatches,
      total_found: providers.length,
      search_criteria: validatedData,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }

    console.error('Matching API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function calculateMatchScore(provider: any, request: any) {
  const factors = {
    distance: 0,
    rating: 0,
    availability: 0,
    price: 0,
    experience: 0,
  }

  // Distance factor (closer = better, max 25 points)
  const distance = provider.distance || 0
  factors.distance = Math.max(0, 25 - (distance / request.location.radius) * 25)

  // Rating factor (max 25 points)
  factors.rating = (provider.rating_average / 5) * 25

  // Availability factor (max 20 points)
  // In a real implementation, this would check actual calendar availability
  factors.availability = provider.response_time_minutes < 60 ? 20 : 
                        provider.response_time_minutes < 180 ? 15 : 10

  // Price factor (max 15 points)
  if (request.budget?.max) {
    const avgPrice = provider.services?.[0]?.price || 0
    if (avgPrice <= request.budget.max) {
      factors.price = 15 - ((avgPrice / request.budget.max) * 15)
    }
  } else {
    factors.price = 10 // Default if no budget specified
  }

  // Experience factor (max 15 points)
  factors.experience = Math.min(15, provider.rating_count / 10 * 15)

  const total = Object.values(factors).reduce((sum, score) => sum + score, 0)

  return { factors, total }
}

function calculateEstimatedArrival(provider: any, request: any): string {
  const baseMinutes = provider.response_time_minutes || 120
  const distance = provider.distance || 0
  const travelTime = distance * 3 // Rough estimate: 3 minutes per km
  
  let urgencyMultiplier = 1
  switch (request.urgency) {
    case 'immediate':
      urgencyMultiplier = 0.5
      break
    case 'today':
      urgencyMultiplier = 0.7
      break
    case 'this_week':
      urgencyMultiplier = 1.2
      break
  }

  const totalMinutes = (baseMinutes + travelTime) * urgencyMultiplier
  const arrivalTime = new Date(Date.now() + totalMinutes * 60000)
  
  return arrivalTime.toISOString()
}
