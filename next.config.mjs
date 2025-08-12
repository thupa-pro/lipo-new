/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features for futuristic performance optimization
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB'],
    instrumentationHook: true,
    ppr: true, // Partial Prerendering for quantum-fast performance
    dynamicIO: true,
    authInterrupts: true,
  },

  // Allow cross-origin requests from preview domains
  allowedDevOrigins: [
    '*.builder.io',
    '*.vercel.app',
    '*.netlify.app',
    '*.fly.dev',
    'd4d881df829349b782b0cfae8b91d649-3c85ac9e8bde4163835739553.fly.dev'
  ],

  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Image optimization - simplified
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    unoptimized: false,
  },

  // Very permissive headers for development and preview
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // Explicitly allow iframe embedding for preview
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          }
        ]
      }
    ]
  },

  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Strict mode for better performance
  reactStrictMode: true,
  
  // SWC minification for speed
  swcMinify: true,
  
  // ESLint during builds
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },

  // Environment variables optimization
  env: {
    BUILD_TIME: new Date().toISOString(),
  },
}

export default nextConfig
