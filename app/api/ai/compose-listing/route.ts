import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { llmClient } from '@/lib/ai/llm-client'
import { createSupabaseAdminClient } from '@/lib/supabase/client'
import { z } from 'zod'

const composeListingSchema = z.object({
  serviceType: z.string().min(1).max(100),
  description: z.string().min(10).max(500),
  experience: z.string().optional(),
  specializations: z.array(z.string()).optional(),
  location: z.string().min(1).max(100),
  priceRange: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
})

const listingOutputSchema = {
  title: "string (max 200 characters, compelling and professional)",
  description: "string (max 2000 characters, detailed and persuasive)",
  pricing: {
    suggested_price: "number",
    price_type: "fixed | hourly | quote",
    justification: "string explaining pricing reasoning"
  },
  tags: "array of strings (relevant keywords and specializations)",
  requirements: "array of strings (what client should prepare/provide)",
  availability_suggestions: "array of strings (suggested schedule options)",
  competitive_advantages: "array of strings (unique selling points)"
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = composeListingSchema.parse(body)
    
    const supabase = createSupabaseAdminClient()

    // Check if user is a provider
    const { data: provider, error: providerError } = await supabase
      .from('providers')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (providerError || !provider) {
      return NextResponse.json({ error: 'User must be a registered provider' }, { status: 403 })
    }

    // Get relevant categories for context
    const { data: categories } = await supabase
      .from('categories')
      .select('name, description')
      .limit(20)

    // Build AI prompt
    const prompt = `Create a professional service listing for a marketplace platform.

Service Details:
- Service Type: ${validatedData.serviceType}
- Provider Description: ${validatedData.description}
- Experience: ${validatedData.experience || 'Not specified'}
- Specializations: ${validatedData.specializations?.join(', ') || 'Not specified'}
- Location: ${validatedData.location}
- Price Range: ${validatedData.priceRange ? `$${validatedData.priceRange.min || 'N/A'} - $${validatedData.priceRange.max || 'N/A'}` : 'Not specified'}

Provider Background:
- Business Name: ${provider.business_name}
- Current Rating: ${provider.rating_average}/5 (${provider.rating_count} reviews)
- Bio: ${provider.bio || 'No bio provided'}

Available Categories: ${categories?.map(c => c.name).join(', ')}

Create a compelling, professional listing that:
1. Has an attention-grabbing title that includes the service type
2. Provides a detailed description highlighting expertise and value
3. Suggests competitive pricing based on the service type and experience
4. Includes relevant tags for discoverability
5. Lists what clients should prepare or provide
6. Suggests availability options
7. Highlights unique competitive advantages

Make the listing trustworthy, professional, and likely to convert browsers into customers.`

    // Generate AI response
    const response = await llmClient.generateStructuredOutput(
      prompt,
      listingOutputSchema,
      {
        userId,
        maxTokens: 1500,
      }
    )

    // Log AI interaction for analytics
    await supabase
      .from('ai_interactions')
      .insert({
        user_id: userId,
        interaction_type: 'listing_composer',
        input_data: validatedData,
        output_data: response.content,
        tokens_used: response.usage.totalTokens,
        cost: response.usage.cost,
      })

    return NextResponse.json({
      listing: response.content,
      usage: {
        tokens: response.usage.totalTokens,
        cost: response.usage.cost,
      },
      timestamp: response.timestamp,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }

    console.error('AI compose listing error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate listing' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's AI usage statistics
    const budget = await llmClient.checkTokenBudget(userId)
    
    return NextResponse.json({
      tokenBudget: budget,
      available: budget.dailyLimit - budget.currentDaily,
      features: [
        'AI-powered listing generation',
        'Competitive pricing suggestions',
        'SEO-optimized descriptions',
        'Market-specific recommendations',
      ],
    })

  } catch (error) {
    console.error('AI compose listing GET error:', error)
    return NextResponse.json({ error: 'Failed to get AI statistics' }, { status: 500 })
  }
}
