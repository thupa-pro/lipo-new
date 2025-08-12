import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerComponent } from '@/lib/supabase/server'

interface WebVitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

export async function POST(request: NextRequest) {
  try {
    const metric: WebVitalMetric = await request.json()
    
    // Validate the metric
    if (!metric.name || typeof metric.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      )
    }

    // Store in database for analytics
    const supabase = createSupabaseServerComponent()

    // Handle case where Supabase is not configured
    if (!supabase) {
      console.warn('Supabase not configured, skipping metrics storage')
      return NextResponse.json({ success: true, note: 'Metrics logged locally only' })
    }

    await supabase.from('performance_metrics').insert({
      endpoint: '/web-vitals',
      method: 'METRIC',
      response_time_ms: metric.value,
      status_code: 200,
      user_agent: request.headers.get('user-agent')?.slice(0, 500),
      ip_address: request.ip || request.headers.get('x-forwarded-for'),
      created_at: new Date(metric.timestamp).toISOString(),
    })

    // Log performance issues
    if (metric.rating === 'poor') {
      console.warn(`Poor ${metric.name} performance: ${metric.value}ms`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Web vitals logging error:', error)
    return NextResponse.json(
      { error: 'Failed to log metric' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()
    
    // Get performance summary from last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    const { data: metrics, error } = await supabase
      .from('performance_metrics')
      .select('response_time_ms, endpoint, created_at')
      .gte('created_at', twentyFourHoursAgo)
      .eq('method', 'METRIC')
      .order('created_at', { ascending: false })
      .limit(1000)

    if (error) {
      throw error
    }

    // Calculate performance statistics
    const stats = {
      totalMetrics: metrics?.length || 0,
      averageResponseTime: 0,
      p95ResponseTime: 0,
      slowestEndpoints: [] as Array<{ endpoint: string; avgTime: number }>,
      performanceTrend: 'stable' as 'improving' | 'stable' | 'degrading'
    }

    if (metrics && metrics.length > 0) {
      const responseTimes = metrics.map(m => m.response_time_ms).sort((a, b) => a - b)
      
      stats.averageResponseTime = Math.round(
        responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      )
      
      stats.p95ResponseTime = Math.round(
        responseTimes[Math.floor(responseTimes.length * 0.95)]
      )

      // Group by endpoint
      const endpointStats = metrics.reduce((acc, metric) => {
        if (!acc[metric.endpoint]) {
          acc[metric.endpoint] = { times: [], count: 0 }
        }
        acc[metric.endpoint].times.push(metric.response_time_ms)
        acc[metric.endpoint].count++
        return acc
      }, {} as Record<string, { times: number[]; count: number }>)

      stats.slowestEndpoints = Object.entries(endpointStats)
        .map(([endpoint, data]) => ({
          endpoint,
          avgTime: Math.round(data.times.reduce((sum, time) => sum + time, 0) / data.times.length)
        }))
        .sort((a, b) => b.avgTime - a.avgTime)
        .slice(0, 5)
    }

    return NextResponse.json({
      message: 'Web Vitals Performance API',
      description: 'Track and analyze Core Web Vitals metrics',
      stats,
      thresholds: {
        LCP: { good: '<2.5s', poor: '>4s' },
        FID: { good: '<100ms', poor: '>300ms' },
        CLS: { good: '<0.1', poor: '>0.25' },
        FCP: { good: '<1.8s', poor: '>3s' },
        TTFB: { good: '<600ms', poor: '>1.5s' }
      }
    })
  } catch (error) {
    console.error('Performance stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get performance stats' },
      { status: 500 }
    )
  }
}
