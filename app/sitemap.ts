import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://loconomy.com'
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/browse',
    '/become-provider',
    '/how-it-works',
    '/pricing',
    '/safety',
    '/help',
    '/contact',
    '/careers',
    '/blog',
    '/community',
    '/press',
    '/investors',
    '/partnerships',
    '/success-stories',
    '/provider-resources',
    '/provider-support',
    '/training-certification',
    '/privacy',
    '/terms',
    '/cookies',
    '/accessibility',
    '/gdpr',
    '/auth/signin',
    '/auth/signup',
  ]
  
  // Service categories
  const serviceCategories = [
    'home-cleaning',
    'tech-repair',
    'automotive',
    'education',
    'health-wellness',
    'entertainment',
    'gardening',
    'handyman',
    'pet-care',
    'personal-training',
  ]
  
  const currentDate = new Date()
  
  const staticSitemapEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: currentDate,
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : path.includes('auth') ? 0.3 : 0.8,
  }))
  
  const categorySitemapEntries: MetadataRoute.Sitemap = serviceCategories.map((category) => ({
    url: `${baseUrl}/browse/${category}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.7,
  }))
  
  return [
    ...staticSitemapEntries,
    ...categorySitemapEntries,
  ]
}
