import { NextRequest, NextResponse } from 'next/server'
import { embeddingsService, extractKeywords } from '@/lib/ai/embeddings'
import { createSupabaseAdminClient } from '@/lib/supabase/client'
import { z } from 'zod'

const semanticSearchSchema = z.object({
  query: z.string().min(1).max(500),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    radius: z.number().min(1).max(50).default(10),
  }).optional(),
  category: z.string().uuid().optional(),
  budget: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
  limit: z.number().min(1).max(50).default(20),
  threshold: z.number().min(0).max(1).default(0.7),
  hybrid: z.boolean().default(true), // Enable hybrid search (semantic + traditional)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = semanticSearchSchema.parse(body)
    
    const supabase = createSupabaseAdminClient()

    // Perform semantic search
    const semanticResults = await embeddingsService.searchListings(
      validatedData.query,
      {
        limit: validatedData.limit,
        threshold: validatedData.threshold,
        filters: {
          category: validatedData.category,
          location: validatedData.location,
          budget: validatedData.budget,
        },
      }
    )

    let combinedResults = semanticResults

    // If hybrid search is enabled and semantic results are limited, supplement with traditional search
    if (validatedData.hybrid && semanticResults.length < validatedData.limit) {
      const keywords = extractKeywords(validatedData.query)
      const keywordQuery = keywords.slice(0, 5).join(' | ') // Use first 5 keywords for full-text search

      let traditionalQuery = supabase
        .from('services')
        .select(`
          id,
          name,
          description,
          price,
          price_type,
          location,
          provider:providers!inner(
            id,
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
        .textSearch('description', keywordQuery)

      // Apply filters
      if (validatedData.category) {
        traditionalQuery = traditionalQuery.eq('category_id', validatedData.category)
      }

      if (validatedData.budget?.min) {
        traditionalQuery = traditionalQuery.gte('price', validatedData.budget.min)
      }

      if (validatedData.budget?.max) {
        traditionalQuery = traditionalQuery.lte('price', validatedData.budget.max)
      }

      // Apply location filter
      if (validatedData.location) {
        traditionalQuery = traditionalQuery.rpc('nearby_services', {
          lat: validatedData.location.lat,
          lng: validatedData.location.lng,
          radius_km: validatedData.location.radius,
        })
      }

      const { data: traditionalResults } = await traditionalQuery
        .limit(validatedData.limit - semanticResults.length)

      // Merge results, avoiding duplicates
      if (traditionalResults) {
        const semanticIds = new Set(semanticResults.map(r => r.id))
        const additionalResults = traditionalResults
          .filter((result: any) => !semanticIds.has(result.id))
          .map((result: any) => ({
            id: result.id,
            similarity: 0.5, // Lower similarity score for traditional matches
            content: `${result.name} ${result.description}`,
            metadata: {
              listing_id: result.id,
              type: 'traditional_match',
              service: result,
            },
          }))

        combinedResults = [...semanticResults, ...additionalResults]
      }
    }

    // Get detailed information for all results
    const listingIds = combinedResults.map(r => r.id)
    const { data: detailedListings } = await supabase
      .from('services')
      .select(`
        *,
        provider:providers!inner(*),
        category:categories(*)
      `)
      .in('id', listingIds)

    // Enrich results with full listing data
    const enrichedResults = combinedResults.map(result => {
      const listing = detailedListings?.find(l => l.id === result.id)
      return {
        ...result,
        listing,
        search_type: result.similarity > validatedData.threshold ? 'semantic' : 'traditional',
      }
    })

    // Sort by similarity score
    enrichedResults.sort((a, b) => b.similarity - a.similarity)

    // Log search analytics
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'semantic_search',
        properties: {
          query: validatedData.query,
          results_count: enrichedResults.length,
          semantic_matches: semanticResults.length,
          traditional_matches: enrichedResults.length - semanticResults.length,
          avg_similarity: enrichedResults.reduce((sum, r) => sum + r.similarity, 0) / enrichedResults.length,
          search_filters: {
            category: validatedData.category,
            location: validatedData.location,
            budget: validatedData.budget,
          },
        },
      })

    return NextResponse.json({
      query: validatedData.query,
      results: enrichedResults,
      search_metadata: {
        total_results: enrichedResults.length,
        semantic_matches: semanticResults.length,
        traditional_matches: enrichedResults.length - semanticResults.length,
        search_type: validatedData.hybrid ? 'hybrid' : 'semantic_only',
        threshold_used: validatedData.threshold,
      },
      suggestions: generateSearchSuggestions(validatedData.query, enrichedResults),
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid search parameters', details: error.errors }, { status: 400 })
    }

    console.error('Semantic search error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to perform semantic search' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return search capabilities and usage statistics
    const supabase = createSupabaseAdminClient()
    
    const { count: indexedListings } = await supabase
      .from('listing_embeddings')
      .select('*', { count: 'exact', head: true })

    const { count: totalListings } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    return NextResponse.json({
      semantic_search_info: {
        description: 'AI-powered semantic search for marketplace listings',
        capabilities: [
          'Understanding intent behind search queries',
          'Finding relevant results even without exact keyword matches',
          'Hybrid search combining AI and traditional methods',
          'Location-based filtering',
          'Budget and category constraints',
        ],
        indexed_listings: indexedListings || 0,
        total_listings: totalListings || 0,
        index_coverage: totalListings ? ((indexedListings || 0) / totalListings * 100).toFixed(1) + '%' : '0%',
      },
      search_parameters: {
        query: 'string (required) - Natural language search query',
        location: 'object (optional) - Geographic constraints',
        category: 'string (optional) - Service category UUID',
        budget: 'object (optional) - Price range constraints',
        limit: 'number (optional) - Maximum results (1-50, default: 20)',
        threshold: 'number (optional) - Similarity threshold (0-1, default: 0.7)',
        hybrid: 'boolean (optional) - Enable hybrid search (default: true)',
      },
      example_queries: [
        'Find a dog walker near downtown',
        'Need help with plumbing emergency',
        'Looking for yoga instructor with experience in prenatal classes',
        'Professional house cleaning service for move-out',
        'Expert mechanic for vintage car restoration',
      ],
    })

  } catch (error) {
    console.error('Search info error:', error)
    return NextResponse.json({ error: 'Failed to get search information' }, { status: 500 })
  }
}

function generateSearchSuggestions(query: string, results: any[]): string[] {
  const suggestions: string[] = []
  
  // Extract common categories from results
  const categories = new Set(
    results
      .map(r => r.listing?.category?.name)
      .filter(Boolean)
  )

  // Extract common locations
  const locations = new Set(
    results
      .map(r => r.listing?.provider?.location?.city)
      .filter(Boolean)
  )

  // Generate suggestions based on results
  if (categories.size > 0) {
    const topCategory = Array.from(categories)[0]
    suggestions.push(`${topCategory} services near me`)
  }

  if (locations.size > 0) {
    const topLocation = Array.from(locations)[0]
    suggestions.push(`${query} in ${topLocation}`)
  }

  // Add generic refinement suggestions
  suggestions.push(
    `${query} with high ratings`,
    `affordable ${query}`,
    `professional ${query} services`
  )

  return suggestions.slice(0, 3)
}
