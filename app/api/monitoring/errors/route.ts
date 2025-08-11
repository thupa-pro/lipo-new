import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schemas
const breadcrumbSchema = z.object({
  timestamp: z.string().transform(str => new Date(str)),
  message: z.string(),
  category: z.enum(['navigation', 'http', 'user', 'ui', 'error', 'debug']),
  level: z.enum(['info', 'warning', 'error', 'debug']),
  data: z.record(z.any()).optional()
})

const errorReportSchema = z.object({
  id: z.string(),
  error: z.object({
    name: z.string(),
    message: z.string(),
    stack: z.string().optional(),
    cause: z.string().optional()
  }),
  metadata: z.object({
    timestamp: z.string().transform(str => new Date(str)),
    userAgent: z.string(),
    url: z.string(),
    userId: z.string().optional(),
    sessionId: z.string(),
    buildVersion: z.string().optional(),
    environment: z.enum(['development', 'staging', 'production']),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    tags: z.array(z.string()),
    fingerprint: z.string(),
    breadcrumbs: z.array(breadcrumbSchema)
  }),
  context: z.object({
    component: z.string().optional(),
    props: z.record(z.any()).optional(),
    state: z.record(z.any()).optional(),
    route: z.string().optional()
  }),
  performance: z.object({
    memory: z.any().optional(),
    timing: z.any().optional(),
    resources: z.array(z.any()).optional()
  }),
  user: z.object({
    id: z.string().optional(),
    email: z.string().optional(),
    role: z.string().optional(),
    permissions: z.array(z.string()).optional()
  })
})

const analyticsEventSchema = z.object({
  id: z.string(),
  name: z.string(),
  timestamp: z.string().transform(str => new Date(str)),
  properties: z.record(z.any()),
  userId: z.string().optional(),
  sessionId: z.string(),
  page: z.string().optional(),
  category: z.enum(['user', 'system', 'business', 'performance'])
})

const requestSchema = z.object({
  errors: z.array(errorReportSchema),
  analytics: z.array(analyticsEventSchema)
})

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Error processing and storage
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request)
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = requestSchema.parse(body)

    // Process errors
    const processedErrors = await Promise.all(
      validatedData.errors.map(error => processError(error))
    )

    // Process analytics events
    const processedAnalytics = await Promise.all(
      validatedData.analytics.map(event => processAnalyticsEvent(event))
    )

    // Store in your preferred storage solution
    // This could be a database, logging service, or external monitoring service
    await storeErrorReports(processedErrors)
    await storeAnalyticsEvents(processedAnalytics)

    // Send to external monitoring services
    await sendToExternalServices(processedErrors, processedAnalytics)

    return NextResponse.json({
      success: true,
      processed: {
        errors: processedErrors.length,
        analytics: processedAnalytics.length
      }
    })

  } catch (error) {
    console.error('Error processing monitoring data:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper functions
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(',')[0].trim()
  
  return 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 100 // 100 requests per minute
  
  const key = `error-monitoring:${ip}`
  const current = rateLimitMap.get(key)
  
  if (!current || now >= current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return false
  }
  
  current.count++
  return current.count > maxRequests
}

async function processError(error: z.infer<typeof errorReportSchema>) {
  // Enhance error with additional processing
  const processed = {
    ...error,
    processed: {
      timestamp: new Date(),
      fingerprint: generateErrorFingerprint(error),
      severity: calculateSeverity(error),
      category: categorizeError(error),
      stackTrace: parseStackTrace(error.error.stack),
      impactedUsers: await getImpactedUsers(error.metadata.fingerprint),
      similarErrors: await findSimilarErrors(error.metadata.fingerprint)
    }
  }

  // Enrich with context
  if (error.metadata.userId) {
    processed.user = await enrichUserData(error.metadata.userId)
  }

  return processed
}

async function processAnalyticsEvent(event: z.infer<typeof analyticsEventSchema>) {
  return {
    ...event,
    processed: {
      timestamp: new Date(),
      sessionDuration: await getSessionDuration(event.sessionId),
      deviceInfo: parseUserAgent(event.properties.userAgent),
      geoLocation: await getGeoLocation(event.properties.ip),
      funnelPosition: await getFunnelPosition(event.userId, event.name)
    }
  }
}

function generateErrorFingerprint(error: any): string {
  // Create a unique fingerprint for error grouping
  const components = [
    error.error.name,
    error.error.message.replace(/\d+/g, 'N'), // Replace numbers with N
    error.context.component || '',
    error.metadata.url.split('?')[0] // Remove query params
  ]
  
  return btoa(components.join('|')).slice(0, 16)
}

function calculateSeverity(error: any): 'low' | 'medium' | 'high' | 'critical' {
  // Business logic to determine severity
  if (error.error.name === 'ChunkLoadError') return 'low'
  if (error.error.message.includes('Network Error')) return 'medium'
  if (error.context.route?.includes('/payment')) return 'critical'
  if (error.context.route?.includes('/admin')) return 'high'
  
  return error.metadata.severity || 'medium'
}

function categorizeError(error: any): string {
  if (error.error.name.includes('Chunk')) return 'chunk_loading'
  if (error.error.name.includes('Network')) return 'network'
  if (error.error.name.includes('TypeError')) return 'type_error'
  if (error.error.name.includes('ReferenceError')) return 'reference_error'
  if (error.context.component) return 'component_error'
  
  return 'unknown'
}

function parseStackTrace(stack?: string) {
  if (!stack) return []
  
  return stack
    .split('\n')
    .slice(1) // Remove error message line
    .map(line => {
      const match = line.match(/at (.+) \((.+):(\d+):(\d+)\)/)
      if (match) {
        return {
          function: match[1],
          file: match[2],
          line: parseInt(match[3]),
          column: parseInt(match[4])
        }
      }
      return { raw: line.trim() }
    })
    .filter(frame => frame.function !== 'Object.eval' && !frame.raw?.includes('node_modules'))
}

async function getImpactedUsers(fingerprint: string): Promise<number> {
  // In production, query your database for similar errors
  // Return count of unique users affected by this error
  return Math.floor(Math.random() * 10) + 1
}

async function findSimilarErrors(fingerprint: string): Promise<string[]> {
  // In production, find errors with similar fingerprints
  return []
}

async function enrichUserData(userId: string) {
  // In production, fetch additional user data from your database
  return {
    id: userId,
    // Add other user fields as needed
  }
}

async function getSessionDuration(sessionId: string): Promise<number> {
  // Calculate session duration from first event
  return Math.floor(Math.random() * 3600000) // Random duration for demo
}

function parseUserAgent(userAgent?: string) {
  if (!userAgent) return {}
  
  // Basic user agent parsing (use a proper library in production)
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent)
  const isBot = /bot|crawler|spider/i.test(userAgent)
  
  return {
    isMobile,
    isBot,
    platform: isMobile ? 'mobile' : 'desktop'
  }
}

async function getGeoLocation(ip?: string) {
  // In production, use a geolocation service
  return {
    country: 'US',
    region: 'CA',
    city: 'San Francisco'
  }
}

async function getFunnelPosition(userId?: string, eventName?: string): Promise<string | null> {
  // Determine where user is in conversion funnel
  if (!userId || !eventName) return null
  
  const funnelSteps = ['signup', 'onboarding', 'first_action', 'conversion']
  return funnelSteps[Math.floor(Math.random() * funnelSteps.length)]
}

async function storeErrorReports(errors: any[]) {
  // Store in your database or logging service
  console.log(`Storing ${errors.length} error reports`)
  
  // Example: Store in Supabase, PostgreSQL, MongoDB, etc.
  // await supabase.from('error_reports').insert(errors)
}

async function storeAnalyticsEvents(events: any[]) {
  // Store analytics events
  console.log(`Storing ${events.length} analytics events`)
  
  // Example: Store in your analytics database
  // await analyticsDB.insert(events)
}

async function sendToExternalServices(errors: any[], analytics: any[]) {
  // Send to external monitoring services
  
  // Example: Send to Sentry
  if (process.env.SENTRY_DSN && errors.length > 0) {
    try {
      // await sendToSentry(errors)
    } catch (error) {
      console.error('Failed to send to Sentry:', error)
    }
  }
  
  // Example: Send to PostHog, Mixpanel, etc.
  if (process.env.POSTHOG_KEY && analytics.length > 0) {
    try {
      // await sendToPostHog(analytics)
    } catch (error) {
      console.error('Failed to send to PostHog:', error)
    }
  }
  
  // Example: Send to DataDog, New Relic, etc.
  if (process.env.DATADOG_API_KEY) {
    try {
      // await sendToDataDog([...errors, ...analytics])
    } catch (error) {
      console.error('Failed to send to DataDog:', error)
    }
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown'
  })
}
