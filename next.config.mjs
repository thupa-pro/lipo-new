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

  // Production optimizations for quantum performance
  poweredByHeader: false,
  compress: true,
  generateEtags: true,

  // Advanced Image optimization with AI-powered compression
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year for maximum performance
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Advanced bundling with quantum-optimized chunks
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle splitting for better caching
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          animations: {
            test: /[\\/]node_modules[\\/](framer-motion|lottie-react)[\\/]/,
            name: 'animations',
            chunks: 'all',
          },
          ui: {
            test: /[\\/]components[\\/]ui[\\/]/,
            name: 'ui-components',
            chunks: 'all',
          },
        },
      },
    };

    // Add support for WebAssembly (for future quantum computing features)
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
      layers: true,
    };

    // Optimize for WebGL/WebXR
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    return config;
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
