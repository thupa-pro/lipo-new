import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createSupabaseAdminClient } from '@/lib/supabase/client'
import { z } from 'zod'

const createListingSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(2000),
  category_id: z.string().uuid(),
  price: z.number().positive(),
  price_type: z.enum(['fixed', 'hourly', 'quote']),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string(),
  }),
  availability: z.object({
    days: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])),
    hours: z.object({
      start: z.string(),
      end: z.string(),
    }),
  }),
  requirements: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
})

const searchListingsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    radius: z.number().optional().default(10),
  }).optional(),
  price_min: z.number().optional(),
  price_max: z.number().optional(),
  sort: z.enum(['relevance', 'price_asc', 'price_desc', 'rating', 'distance']).optional().default('relevance'),
  limit: z.number().min(1).max(100).optional().default(20),
  offset: z.number().min(0).optional().default(0),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = {
      q: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      location: searchParams.get('lat') && searchParams.get('lng') ? {
        lat: parseFloat(searchParams.get('lat')!),
        lng: parseFloat(searchParams.get('lng')!),
        radius: searchParams.get('radius') ? parseFloat(searchParams.get('radius')!) : 10,
      } : undefined,
      price_min: searchParams.get('price_min') ? parseFloat(searchParams.get('price_min')!) : undefined,
      price_max: searchParams.get('price_max') ? parseFloat(searchParams.get('price_max')!) : undefined,
      sort: (searchParams.get('sort') as any) || 'relevance',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    }

    const validatedQuery = searchListingsSchema.parse(query)
    const supabase = createSupabaseAdminClient()

    // Build query
    let dbQuery = supabase
      .from('services')
      .select(`
        *,
        provider:providers!inner(
          id,
          user_id,
          business_name,
          rating_average,
          rating_count,
          location,
          is_active
        ),
        category:categories(
          id,
          name,
          slug
        )
      `)
      .eq('is_active', true)
      .eq('provider.is_active', true)

    // Apply filters
    if (validatedQuery.q) {
      dbQuery = dbQuery.or(`title.ilike.%${validatedQuery.q}%,description.ilike.%${validatedQuery.q}%`)
    }

    if (validatedQuery.category) {
      dbQuery = dbQuery.eq('category_id', validatedQuery.category)
    }

    if (validatedQuery.price_min) {
      dbQuery = dbQuery.gte('price', validatedQuery.price_min)
    }

    if (validatedQuery.price_max) {
      dbQuery = dbQuery.lte('price', validatedQuery.price_max)
    }

    // Apply location filter
    if (validatedQuery.location) {
      const { lat, lng, radius } = validatedQuery.location
      dbQuery = dbQuery.rpc('nearby_providers', {
        lat,
        lng,
        radius_km: radius,
      })
    }

    // Apply sorting
    switch (validatedQuery.sort) {
      case 'price_asc':
        dbQuery = dbQuery.order('price', { ascending: true })
        break
      case 'price_desc':
        dbQuery = dbQuery.order('price', { ascending: false })
        break
      case 'rating':
        dbQuery = dbQuery.order('provider.rating_average', { ascending: false })
        break
      case 'distance':
        if (validatedQuery.location) {
          dbQuery = dbQuery.order('distance', { ascending: true })
        }
        break
      default:
        dbQuery = dbQuery.order('created_at', { ascending: false })
    }

    // Apply pagination
    dbQuery = dbQuery.range(validatedQuery.offset, validatedQuery.offset + validatedQuery.limit - 1)

    const { data: listings, error } = await dbQuery

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    return NextResponse.json({
      listings,
      pagination: {
        total: count || 0,
        limit: validatedQuery.limit,
        offset: validatedQuery.offset,
        hasMore: (validatedQuery.offset + validatedQuery.limit) < (count || 0),
      },
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 })
    }

    console.error('API error:', error)
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
    const validatedData = createListingSchema.parse(body)
    
    const supabase = createSupabaseAdminClient()

    // Check if user is a provider
    const { data: provider, error: providerError } = await supabase
      .from('providers')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (providerError || !provider) {
      return NextResponse.json({ error: 'User must be a registered provider to create listings' }, { status: 403 })
    }

    // Create the listing
    const { data: listing, error } = await supabase
      .from('services')
      .insert({
        provider_id: provider.id,
        name: validatedData.title,
        description: validatedData.description,
        category_id: validatedData.category_id,
        price: validatedData.price,
        price_type: validatedData.price_type,
        location: validatedData.location,
        availability: validatedData.availability,
        requirements: validatedData.requirements || [],
        images: validatedData.images || [],
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
    }

    return NextResponse.json(listing, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }

    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
