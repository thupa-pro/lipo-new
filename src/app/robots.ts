import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/auth/',
          '/settings/',
          '/messages/',
          '/my-bookings/',
          '/profile/',
          '/payments/',
          '/requests/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/', 
          '/api/',
          '/auth/',
          '/settings/',
          '/messages/',
          '/my-bookings/',
          '/profile/',
          '/payments/',
          '/requests/',
        ],
      },
    ],
    sitemap: 'https://loconomy.com/sitemap.xml',
  }
}
