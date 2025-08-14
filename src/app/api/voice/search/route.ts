import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const voiceSearchSchema = z.object({
  query: z.string().optional(),
  serviceType: z.string().optional(),
  location: z.string().optional(),
  limit: z.number().min(1).max(10).default(5), // Voice results should be limited
})

interface VoiceSearchResult {
  id: string
  name: string
  description: string
  category: string
  rating: number
  price: number
  location: string
  distance: number
  responseTime: number
  availability: 'available' | 'busy' | 'unavailable'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, serviceType, location, limit } = voiceSearchSchema.parse(body)

    const supabase = createSupabaseServerClient()

    // Build search query optimized for voice results
    let searchQuery = supabase
      .from('providers')
      .select(`
        id,
        business_name,
        bio,
        rating_average,
        rating_count,
        response_time_minutes,
        is_active,
        categories!inner(name, slug),
        services(price),
        users!inner(display_name)
      `)
      .eq('is_active', true)
      .order('rating_average', { ascending: false })
      .order('rating_count', { ascending: false })
      .limit(limit)

    // Filter by service type if provided
    if (serviceType) {
      const serviceTypeMapping: Record<string, string[]> = {
        'plumber': ['plumbing', 'plumber'],
        'electrician': ['electrical', 'electrician'],
        'house cleaning': ['cleaning', 'housekeeping'],
        'handyman': ['handyman', 'repair'],
        'landscaping': ['landscaping', 'gardening'],
        'moving services': ['moving', 'relocation'],
        'appliance repair': ['appliance', 'repair'],
        'hvac technician': ['hvac', 'heating', 'cooling'],
        'painter': ['painting', 'painter'],
        'carpenter': ['carpentry', 'carpenter'],
      }

      const categoryKeywords = serviceTypeMapping[serviceType.toLowerCase()] || [serviceType]
      
      searchQuery = searchQuery.or(
        categoryKeywords.map(keyword => `categories.name.ilike.%${keyword}%`).join(',')
      )
    }

    // Execute search
    const { data: providers, error } = await searchQuery

    if (error) {
      console.error('Voice search error:', error)
      return NextResponse.json(
        { error: 'Search failed' },
        { status: 500 }
      )
    }

    // Format results for voice consumption
    const voiceResults: VoiceSearchResult[] = (providers || []).map(provider => {
      const avgPrice = provider.services?.length > 0 
        ? provider.services.reduce((sum, service) => sum + (service.price || 0), 0) / provider.services.length
        : 0

      return {
        id: provider.id,
        name: provider.business_name || provider.users.display_name,
        description: provider.bio || 'Professional service provider',
        category: provider.categories.name,
        rating: Number(provider.rating_average) || 0,
        price: Math.round(avgPrice),
        location: 'Local area', // Would be calculated from actual location data
        distance: Math.random() * 10, // Placeholder - would calculate actual distance
        responseTime: provider.response_time_minutes || 60,
        availability: provider.is_active ? 'available' : 'unavailable',
      }
    })

    // Sort by relevance for voice - prioritize high ratings and quick response
    voiceResults.sort((a, b) => {
      const scoreA = (a.rating * 0.6) + (1 / (a.responseTime / 60) * 0.4)
      const scoreB = (b.rating * 0.6) + (1 / (b.responseTime / 60) * 0.4)
      return scoreB - scoreA
    })

    return NextResponse.json(voiceResults)

  } catch (error) {
    console.error('Voice search processing error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid search parameters' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Voice-Optimized Search API',
    description: 'Search for services with voice-friendly results',
    parameters: {
      query: 'Free text search query',
      serviceType: 'Specific service category',
      location: 'Location for local search',
      limit: 'Number of results (1-10, default 5)'
    },
    response_format: {
      id: 'Provider ID',
      name: 'Business/provider name',
      description: 'Brief description',
      category: 'Service category',
      rating: 'Average rating (0-5)',
      price: 'Average price',
      location: 'Location description',
      distance: 'Distance in miles',
      responseTime: 'Response time in minutes',
      availability: 'Current availability status'
    }
  })
}
