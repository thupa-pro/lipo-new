import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting store (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

// Security configuration
const SECURITY_CONFIG = {
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // requests per window
    apiMaxRequests: 50, // stricter for API routes
    authMaxRequests: 5, // very strict for auth routes
  },
  blockedUserAgents: [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
  ],
  allowedOrigins: [
    'https://loconomy.com',
    'https://www.loconomy.com',
    'https://app.loconomy.com',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  sensitiveRoutes: [
    '/admin',
    '/api/admin',
    '/api/auth',
    '/dashboard',
    '/settings',
  ]
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname, origin } = request.nextUrl
  const userAgent = request.headers.get('user-agent') || ''
  const ip = getClientIP(request)
  const method = request.method

  // Skip middleware for static assets and internal Next.js routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return response
  }

  try {
    // 1. Security Headers
    addSecurityHeaders(response, pathname)

    // 2. Rate Limiting - disabled for development
    if (process.env.NODE_ENV === 'production' && isRateLimited(ip, pathname, method)) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '900', // 15 minutes
          'X-RateLimit-Limit': getRateLimit(pathname).toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(Date.now() / 1000 + 900).toString(),
        },
      })
    }

    // 3. User Agent Filtering - disabled for development
    if (process.env.NODE_ENV === 'production' && isBlockedUserAgent(userAgent) && !pathname.startsWith('/api/health')) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // 4. Origin Validation for API routes - disabled for development
    if (process.env.NODE_ENV === 'production' && pathname.startsWith('/api/') && method !== 'GET') {
      if (!isValidOrigin(request)) {
        return new NextResponse('Forbidden', { status: 403 })
      }
    }

    // 5. Authentication Check for Protected Routes
    if (isSensitiveRoute(pathname)) {
      const authResult = checkAuthentication(request)
      if (authResult) {
        return authResult
      }
    }

    // 6. Input Validation for API routes
    if (pathname.startsWith('/api/') && ['POST', 'PUT', 'PATCH'].includes(method)) {
      // Add request validation headers
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('X-XSS-Protection', '1; mode=block')
    }

    // 7. Geolocation Security (basic)
    const country = request.geo?.country
    if (country && isBlockedCountry(country)) {
      return new NextResponse('Service not available in your region', { status: 451 })
    }

    // 8. Log security events
    logSecurityEvent(request, 'allowed')

    return response

  } catch (error) {
    console.error('Middleware error:', error)
    logSecurityEvent(request, 'error', error)
    
    // Don't expose internal errors
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

function addSecurityHeaders(response: NextResponse, pathname: string) {
  // Basic security headers - removed X-Frame-Options to allow preview iframe
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)')

  // HSTS (HTTP Strict Transport Security)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    )
  }

  // Content Security Policy - relaxed for preview iframe
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://va.vercel-scripts.com https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: *.supabase.co *.supabase.in",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https: wss: *.supabase.co *.supabase.in https://api.stripe.com",
    "media-src 'self' blob: data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self' https://*.builder.io https://*.vercel.app https://*.netlify.app *",
    "block-all-mixed-content",
    "upgrade-insecure-requests"
  ]

  // Relaxed CSP for development
  if (process.env.NODE_ENV === 'development') {
    cspDirectives[1] = "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:"
    cspDirectives[5] = "connect-src 'self' https: wss: ws: http: *.supabase.co *.supabase.in"
  }

  // Admin routes get stricter CSP
  if (pathname.startsWith('/admin')) {
    cspDirectives[1] = "script-src 'self'"
    cspDirectives[2] = "style-src 'self'"
  }

  response.headers.set('Content-Security-Policy', cspDirectives.join('; '))

  // Additional headers for sensitive routes
  if (isSensitiveRoute(pathname)) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }
}

function getClientIP(request: NextRequest): string {
  // Try to get real IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(',')[0].trim()
  
  return request.ip || 'unknown'
}

function isRateLimited(ip: string, pathname: string, method: string): boolean {
  const now = Date.now()
  const key = `${ip}:${pathname}`
  const current = rateLimitMap.get(key)
  
  // Determine rate limit based on route type
  const limit = getRateLimit(pathname)
  
  if (!current) {
    rateLimitMap.set(key, { count: 1, timestamp: now })
    return false
  }
  
  // Reset window if expired
  if (now - current.timestamp > SECURITY_CONFIG.rateLimiting.windowMs) {
    rateLimitMap.set(key, { count: 1, timestamp: now })
    return false
  }
  
  // Increment counter
  current.count++
  
  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance
    cleanupRateLimitMap()
  }
  
  return current.count > limit
}

function getRateLimit(pathname: string): number {
  if (pathname.startsWith('/api/auth/')) {
    return SECURITY_CONFIG.rateLimiting.authMaxRequests
  }
  if (pathname.startsWith('/api/')) {
    return SECURITY_CONFIG.rateLimiting.apiMaxRequests
  }
  return SECURITY_CONFIG.rateLimiting.maxRequests
}

function cleanupRateLimitMap() {
  const now = Date.now()
  const expiredKeys: string[] = []
  
  rateLimitMap.forEach((value, key) => {
    if (now - value.timestamp > SECURITY_CONFIG.rateLimiting.windowMs) {
      expiredKeys.push(key)
    }
  })
  
  expiredKeys.forEach(key => rateLimitMap.delete(key))
}

function isBlockedUserAgent(userAgent: string): boolean {
  return SECURITY_CONFIG.blockedUserAgents.some(pattern => pattern.test(userAgent))
}

function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  
  if (!origin) {
    // Allow same-origin requests
    return true
  }
  
  return SECURITY_CONFIG.allowedOrigins.includes(origin)
}

function isSensitiveRoute(pathname: string): boolean {
  return SECURITY_CONFIG.sensitiveRoutes.some(route => pathname.startsWith(route))
}

function checkAuthentication(request: NextRequest): NextResponse | null {
  // Basic authentication check (extend with your auth logic)
  const authHeader = request.headers.get('authorization')
  const sessionCookie = request.cookies.get('session')
  
  // Skip auth check for login/signup pages
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    return null
  }
  
  // Check for valid session
  if (!sessionCookie && !authHeader) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  return null
}

function isBlockedCountry(country: string): boolean {
  // List of blocked countries (example - adjust as needed)
  const blockedCountries = ['XX'] // Add country codes as needed
  return blockedCountries.includes(country)
}

function logSecurityEvent(
  request: NextRequest, 
  type: 'allowed' | 'blocked' | 'error', 
  error?: any
) {
  if (process.env.NODE_ENV === 'development') {
    return // Skip logging in development
  }
  
  const logData = {
    timestamp: new Date().toISOString(),
    type,
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent'),
    path: request.nextUrl.pathname,
    method: request.method,
    country: request.geo?.country,
    error: error?.message,
  }
  
  // In production, send to your logging service
  console.log('Security Event:', JSON.stringify(logData))
  
  // You could send to services like:
  // - Sentry
  // - DataDog
  // - CloudWatch
  // - Custom webhook
}

// Security monitoring functions
export function getSecurityMetrics() {
  const now = Date.now()
  const recentRequests = Array.from(rateLimitMap.values())
    .filter(entry => now - entry.timestamp < SECURITY_CONFIG.rateLimiting.windowMs)
  
  return {
    activeConnections: rateLimitMap.size,
    recentRequests: recentRequests.length,
    highTrafficIPs: recentRequests
      .filter(entry => entry.count > 50)
      .length,
    rateLimitHits: recentRequests
      .filter(entry => entry.count > getRateLimit('/api/'))
      .length
  }
}

// IP whitelist/blacklist management
const ipWhitelist = new Set<string>([
  '127.0.0.1',
  '::1',
  // Add trusted IPs
])

const ipBlacklist = new Set<string>([
  // Add blocked IPs
])

function isWhitelistedIP(ip: string): boolean {
  return ipWhitelist.has(ip)
}

function isBlacklistedIP(ip: string): boolean {
  return ipBlacklist.has(ip)
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)',
  ],
}
