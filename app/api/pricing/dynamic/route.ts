import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createSupabaseAdminClient } from '@/lib/supabase/client'
import { z } from 'zod'

const pricingRequestSchema = z.object({
  service_id: z.string().uuid(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    radius: z.number().min(1).max(25).default(5),
  }),
  urgency: z.enum(['immediate', 'today', 'this_week', 'flexible']).default('flexible'),
  duration_minutes: z.number().min(30).max(480).optional(), // 30 minutes to 8 hours
  preferred_time: z.object({
    date: z.string().datetime(),
    time_of_day: z.enum(['morning', 'afternoon', 'evening', 'night']).optional(),
  }).optional(),
})

const priceUpdateSchema = z.object({
  service_id: z.string().uuid(),
  base_price: z.number().positive(),
  dynamic_pricing_enabled: z.boolean().default(true),
  surge_multiplier_max: z.number().min(1).max(3).default(2), // Max 3x surge
  minimum_price: z.number().positive().optional(),
})

interface PricingFactors {
  demand_multiplier: number
  supply_multiplier: number
  time_multiplier: number
  urgency_multiplier: number
  location_multiplier: number
  seasonal_multiplier: number
}

interface DynamicPriceResult {
  base_price: number
  dynamic_price: number
  surge_multiplier: number
  factors: PricingFactors
  confidence: 'high' | 'medium' | 'low'
  explanation: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = pricingRequestSchema.parse(body)
    
    const supabase = createSupabaseAdminClient()

    // Get service details
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select(`
        *,
        provider:providers!inner(
          id,
          business_name,
          rating_average,
          location
        ),
        category:categories(name, commission_rate)
      `)
      .eq('id', validatedData.service_id)
      .eq('is_active', true)
      .single()

    if (serviceError || !service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Calculate dynamic pricing
    const pricingResult = await calculateDynamicPrice(supabase, service, validatedData)

    // Log pricing calculation for analytics
    await supabase
      .from('pricing_calculations')
      .insert({
        service_id: validatedData.service_id,
        base_price: pricingResult.base_price,
        dynamic_price: pricingResult.dynamic_price,
        surge_multiplier: pricingResult.surge_multiplier,
        factors: pricingResult.factors,
        request_data: validatedData,
        calculated_at: new Date().toISOString(),
      })

    return NextResponse.json({
      service_id: validatedData.service_id,
      pricing: pricingResult,
      validity: {
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // Valid for 15 minutes
        conditions: 'Price valid for immediate booking within specified time window',
      },
      booking_recommendation: {
        urgency_level: getDemandLevel(pricingResult.surge_multiplier),
        alternative_times: await getSuggestedAlternativeTimes(supabase, validatedData),
      },
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid pricing request', details: error.errors }, { status: 400 })
    }

    console.error('Dynamic pricing error:', error)
    return NextResponse.json({ error: 'Failed to calculate dynamic pricing' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = priceUpdateSchema.parse(body)
    
    const supabase = createSupabaseAdminClient()

    // Verify provider owns the service
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select(`
        id,
        provider:providers!inner(user_id)
      `)
      .eq('id', validatedData.service_id)
      .single()

    if (serviceError || !service || service.provider.user_id !== userId) {
      return NextResponse.json({ error: 'Service not found or access denied' }, { status: 403 })
    }

    // Update service pricing configuration
    const { data: updatedService, error } = await supabase
      .from('services')
      .update({
        price: validatedData.base_price,
        dynamic_pricing_enabled: validatedData.dynamic_pricing_enabled,
        surge_multiplier_max: validatedData.surge_multiplier_max,
        minimum_price: validatedData.minimum_price || validatedData.base_price * 0.8,
        updated_at: new Date().toISOString(),
      })
      .eq('id', validatedData.service_id)
      .select()
      .single()

    if (error) {
      console.error('Service update error:', error)
      return NextResponse.json({ error: 'Failed to update pricing configuration' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Pricing configuration updated successfully',
      service: updatedService,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid update data', details: error.errors }, { status: 400 })
    }

    console.error('Pricing update error:', error)
    return NextResponse.json({ error: 'Failed to update pricing' }, { status: 500 })
  }
}

async function calculateDynamicPrice(
  supabase: any, 
  service: any, 
  request: any
): Promise<DynamicPriceResult> {
  const basePrice = service.price
  const maxSurge = service.surge_multiplier_max || 2
  
  // Calculate various pricing factors
  const factors: PricingFactors = {
    demand_multiplier: await calculateDemandMultiplier(supabase, service, request),
    supply_multiplier: await calculateSupplyMultiplier(supabase, service, request),
    time_multiplier: calculateTimeMultiplier(request),
    urgency_multiplier: calculateUrgencyMultiplier(request.urgency),
    location_multiplier: await calculateLocationMultiplier(supabase, request.location),
    seasonal_multiplier: calculateSeasonalMultiplier(),
  }

  // Combine factors with weights
  const surgeMultiplier = Math.min(
    maxSurge,
    Math.max(
      0.8, // Never go below 80% of base price
      1 + 
      (factors.demand_multiplier - 1) * 0.3 +
      (factors.supply_multiplier - 1) * 0.2 +
      (factors.time_multiplier - 1) * 0.2 +
      (factors.urgency_multiplier - 1) * 0.2 +
      (factors.location_multiplier - 1) * 0.1 +
      (factors.seasonal_multiplier - 1) * 0.1
    )
  )

  const dynamicPrice = Math.round(basePrice * surgeMultiplier * 100) / 100
  const explanation = generatePricingExplanation(factors, surgeMultiplier)
  const confidence = calculateConfidence(factors)

  return {
    base_price: basePrice,
    dynamic_price: dynamicPrice,
    surge_multiplier: surgeMultiplier,
    factors,
    confidence,
    explanation,
  }
}

async function calculateDemandMultiplier(supabase: any, service: any, request: any): Promise<number> {
  // Get recent booking requests in the area and category
  const { count: recentRequests } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', service.category_id)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .eq('status', 'pending')

  // Get historical average
  const { count: historicalAverage } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', service.category_id)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

  const dailyAverage = (historicalAverage || 0) / 30
  const demandRatio = (recentRequests || 0) / Math.max(dailyAverage, 1)

  return Math.min(2, Math.max(0.5, 1 + (demandRatio - 1) * 0.5))
}

async function calculateSupplyMultiplier(supabase: any, service: any, request: any): Promise<number> {
  // Get available providers in the area
  const { count: availableProviders } = await supabase
    .rpc('nearby_providers_count', {
      lat: request.location.lat,
      lng: request.location.lng,
      radius_km: request.location.radius,
      category_id: service.category_id,
    })

  // Lower supply = higher prices
  const supplyScore = Math.max(1, availableProviders || 1)
  return Math.min(1.5, Math.max(0.8, 2 - (supplyScore * 0.1)))
}

function calculateTimeMultiplier(request: any): number {
  if (!request.preferred_time) return 1

  const requestedTime = new Date(request.preferred_time.date)
  const hour = requestedTime.getHours()
  const isWeekend = requestedTime.getDay() === 0 || requestedTime.getDay() === 6

  // Peak hours pricing
  if (hour >= 17 && hour <= 20) return 1.2 // Evening peak
  if (hour >= 8 && hour <= 10) return 1.1 // Morning peak
  if (isWeekend) return 1.15 // Weekend premium
  if (hour < 8 || hour > 20) return 1.3 // Off-hours premium

  return 1
}

function calculateUrgencyMultiplier(urgency: string): number {
  switch (urgency) {
    case 'immediate': return 1.5
    case 'today': return 1.2
    case 'this_week': return 1.05
    case 'flexible': return 0.95
    default: return 1
  }
}

async function calculateLocationMultiplier(supabase: any, location: any): Promise<number> {
  // This could be enhanced with real estate data, traffic patterns, etc.
  // For now, use a simple urban/suburban model
  
  // In a real implementation, you'd check against known high-demand areas
  // For example: downtown cores, affluent neighborhoods, etc.
  
  return 1 // Placeholder
}

function calculateSeasonalMultiplier(): number {
  const now = new Date()
  const month = now.getMonth()
  
  // Holiday seasons (higher demand)
  if (month === 11 || month === 0) return 1.1 // December/January
  if (month >= 5 && month <= 7) return 1.05 // Summer months
  
  return 1
}

function generatePricingExplanation(factors: PricingFactors, surge: number): string[] {
  const explanations: string[] = []
  
  if (surge > 1.3) {
    explanations.push('High demand in your area')
  } else if (surge > 1.1) {
    explanations.push('Moderate demand increase')
  }
  
  if (factors.urgency_multiplier > 1.2) {
    explanations.push('Premium for immediate service')
  }
  
  if (factors.time_multiplier > 1.1) {
    explanations.push('Peak time pricing applied')
  }
  
  if (factors.supply_multiplier > 1.1) {
    explanations.push('Limited providers available')
  }
  
  if (surge < 1) {
    explanations.push('Discounted pricing for flexible timing')
  }
  
  return explanations
}

function calculateConfidence(factors: PricingFactors): 'high' | 'medium' | 'low' {
  const variance = Object.values(factors).reduce((acc, val) => acc + Math.abs(val - 1), 0)
  
  if (variance < 0.5) return 'high'
  if (variance < 1) return 'medium'
  return 'low'
}

function getDemandLevel(surge: number): string {
  if (surge > 1.5) return 'Very High Demand'
  if (surge > 1.2) return 'High Demand'
  if (surge > 1.05) return 'Moderate Demand'
  return 'Normal Demand'
}

async function getSuggestedAlternativeTimes(supabase: any, request: any): Promise<string[]> {
  // Suggest alternative times with potentially lower pricing
  const alternatives = []
  
  if (request.urgency === 'immediate') {
    alternatives.push('Consider booking for later today for lower prices')
  }
  
  if (request.preferred_time) {
    const date = new Date(request.preferred_time.date)
    const hour = date.getHours()
    
    if (hour >= 17 && hour <= 20) {
      alternatives.push('Morning slots typically have lower rates')
    }
    
    if (date.getDay() === 0 || date.getDay() === 6) {
      alternatives.push('Weekday bookings often have better pricing')
    }
  }
  
  return alternatives
}
