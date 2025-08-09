import { Suspense } from 'react';
import Link from 'next/link';
import { createSupabaseServerComponent } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env-check';
import { IntelligentHeader } from '@/components/ui/intelligent-header';
import { ModuleErrorBoundary, ModuleFallback } from '@/components/error-boundaries/module-error-boundary';
import { PWAProvider } from '@/components/ui/pwa-features';
import { ModernFooter } from '@/components/modern-footer';
import { CommandPaletteHint } from '@/components/ui/command-palette-hint';
import { FloatingFAB, MobileBottomNav } from '@/components/ui/floating-fab';
import { Badge } from '@/components/ui/badge';
import { ModernHero } from '@/components/ui/modern-hero';
import {
  Search,
  UserPlus,
  CheckCircle,
  MapPin,
  Sparkles,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Users,
  Clock,
  Wrench,
  HomeIcon,
  GraduationCap,
  Car,
  Brain,
  HeadphonesIcon,
  Dumbbell,
  PartyPopper,
  Bot,
  Monitor,
  Briefcase,
  Heart,
} from 'lucide-react';

// Interactive components
import { HomePageClient } from './components/home-page-client';

// Configure ISR - revalidate every hour for fresh stats
export const revalidate = 3600;

// Enhanced metadata for SEO
export const metadata = {
  title: "Loconomy - AI-Powered Local Services Platform | Find Trusted Professionals",
  description: "Connect with verified local service professionals through our intelligent platform. From home repairs to personal training - find trusted providers with AI-powered matching, real-time chat, and smart recommendations.",
  keywords: ["local services", "AI marketplace", "service providers", "home repair", "professional services", "artificial intelligence", "smart matching"],
  openGraph: {
    title: "Loconomy - AI-Powered Local Services Platform",
    description: "Connect with trusted local service professionals through our intelligent platform",
    url: "https://loconomy.com",
    siteName: "Loconomy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Loconomy - AI-Powered Local Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loconomy - AI-Powered Local Services Platform",
    description: "Connect with trusted local service professionals through our intelligent platform",
    creator: "@loconomy",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://loconomy.com",
  },
};

// Server-side data fetching
async function getHomePageStats() {
  // Return fallback data for development when Supabase is not properly configured
  const fallbackStats = {
    userCount: 2400000,
    providerCount: 45000,
    bookingCount: 1200000,
    averageRating: 4.9,
    responseTime: "< 2hrs",
    successRate: "98.7%"
  };

  // Check if Supabase is properly configured
  if (!isSupabaseConfigured()) {
    console.log('Using fallback stats - Supabase not configured for production');
    return fallbackStats;
  }

  try {
    const supabase = createSupabaseServerComponent();

    const [usersResult, providersResult, bookingsResult] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('providers').select('id', { count: 'exact', head: true }),
      supabase.from('bookings').select('id', { count: 'exact', head: true })
    ]);

    return {
      userCount: usersResult.count || fallbackStats.userCount,
      providerCount: providersResult.count || fallbackStats.providerCount,
      bookingCount: bookingsResult.count || fallbackStats.bookingCount,
      averageRating: 4.9,
      responseTime: "< 2hrs",
      successRate: "98.7%"
    };
  } catch (error) {
    console.error('Error fetching homepage stats, using fallback data:', error);
    return fallbackStats;
  }
}

async function getPopularCategories() {
  // Check if Supabase is properly configured
  if (!isSupabaseConfigured()) {
    console.log('Using default categories - Supabase not configured for production');
    return defaultCategories;
  }

  try {
    const supabase = createSupabaseServerComponent();

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, slug, description, icon_name')
      .eq('parent_id', null)
      .order('sort_order')
      .limit(6);

    return categories || defaultCategories;
  } catch (error) {
    console.error('Error fetching categories, using default data:', error);
    return defaultCategories;
  }
}

const defaultCategories = [
  {
    id: '1',
    name: 'Home Services',
    slug: 'home-services',
    description: 'Plumbing, electrical, cleaning, and more. All your home needs covered.',
    icon_name: 'home'
  },
  {
    id: '2',
    name: 'Wellness & Fitness',
    slug: 'wellness-fitness',
    description: 'Personal trainers, yoga instructors, and nutritionists to achieve your goals.',
    icon_name: 'dumbbell'
  },
  {
    id: '3',
    name: 'Education & Tutoring',
    slug: 'education-tutoring',
    description: 'Find expert tutors for any subject, from math and science to music lessons.',
    icon_name: 'graduation-cap'
  },
  {
    id: '4',
    name: 'Tech & Repair',
    slug: 'tech-repair',
    description: 'Computer, phone, appliance repair and technical support services.',
    icon_name: 'monitor'
  },
  {
    id: '5',
    name: 'Automotive',
    slug: 'automotive',
    description: 'Car repair, maintenance, detailing and automotive services.',
    icon_name: 'car'
  },
  {
    id: '6',
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Events, photography, music and entertainment services.',
    icon_name: 'party-popper'
  }
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Loconomy",
  "description": "AI-Powered Local Services Platform connecting customers with verified service professionals",
  "url": "https://loconomy.com",
  "logo": "https://loconomy.com/logo.png",
  "serviceType": "Local Services Marketplace",
  "areaServed": "Worldwide",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Local Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Home Services"
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Wellness & Fitness"
        }
      }
    ]
  }
};

export default async function HomePage() {
  // Server-side data fetching
  const [stats, categories] = await Promise.all([
    getHomePageStats(),
    getPopularCategories()
  ]);

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <PWAProvider>
        <div className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
          {/* Skip Links for Accessibility */}
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <a href="#find-service" className="skip-link">Skip to search</a>
          <a href="#how-it-works" className="skip-link">Skip to how it works</a>
          
          {/* Beautiful Background Elements */}
          <div className="absolute inset-0 bg-grid-white/[0.04] dark:bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
          
          {/* Animated Background Blobs - Only visible in dark mode */}
          <div className="hidden dark:block absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-[200px] animate-pulse"></div>
          <div className="hidden dark:block absolute bottom-[-30%] right-[-20%] w-[900px] h-[900px] bg-cyan-700/30 rounded-full blur-[200px] animate-pulse animation-delay-4000"></div>
          <div className="hidden dark:block absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-fuchsia-700/20 rounded-full blur-[150px] animate-pulse animation-delay-2000"></div>

          {/* Light mode subtle background pattern */}
          <div className="block dark:hidden absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30"></div>

          {/* Intelligent Header */}
          <IntelligentHeader />

          {/* Header Compensation */}
          <div className="h-20 md:h-24"></div>

          {/* Main Content */}
          <main id="main-content" className="relative z-10" role="main">
            {/* Modern Hero Section */}
            <ModernHero stats={stats} />

            {/* Welcome Section - Enhanced Introduction */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8" role="region" aria-labelledby="welcome-title">
              <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-8 sm:mb-12 md:mb-16">
                    <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-white/80 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-white/20">
                      <Heart className="w-4 h-4 mr-2 text-red-500" />
                      Welcome to Loconomy
                    </Badge>
                    <h2 id="welcome-title" className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 sm:mb-6 text-gray-900 dark:text-white">
                      Your Gateway to Trusted Local Services
                    </h2>
                    <p className="text-lg md:text-xl lg:text-2xl text-center mb-6 sm:mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed">
                      Experience the future of local services with our AI-powered platform that connects you with verified, trusted professionals in your community. From emergency repairs to scheduled maintenance, we've got you covered.
                    </p>
                  </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-12">
                    <div className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 text-center border border-gray-200 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                      <div className="mb-4 sm:mb-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">Verified & Trusted</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Every service provider is thoroughly background-checked, verified, and insured. Your safety and satisfaction are our top priorities.
                      </p>
                    </div>

                    <div className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 text-center border border-gray-200 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                      <div className="mb-4 sm:mb-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">AI-Powered Matching</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Our intelligent algorithm learns your preferences and matches you with the perfect professionals for your specific needs and location.
                      </p>
                    </div>

                    <div className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 text-center border border-gray-200 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                      <div className="mb-4 sm:mb-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">Instant Connection</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Connect with available professionals in real-time. Get quotes, schedule services, and track progress all in one seamless experience.
                      </p>
                    </div>
                </div>

                  <div className="text-center">
                    <div className="inline-flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm md:text-base font-medium text-green-600 dark:text-green-400">
                          Live Support Available 24/7
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
                          {stats.averageRating}/5 Average Rating
                        </span>
                      </div>
                    </div>
                  </div>
              </div>
            </section>

            {/* Search Section - Client Component for Interactivity */}
            <Suspense fallback={<div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl mx-4"></div>}>
              <HomePageClient />
            </Suspense>

            {/* How It Works Section - Server Rendered */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8" id="how-it-works" role="region" aria-labelledby="how-it-works-title">
              <h2 id="how-it-works-title" className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">How Loconomy Works</h2>
              <p className="text-lg md:text-xl text-center mb-8 sm:mb-12 md:mb-16 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">Finding your ideal service professional is as easy as 1-2-3.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12 relative max-w-5xl mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 dark:bg-white/10 hidden md:block"></div>

                <div className="relative text-center z-10">
                  <div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-white dark:bg-gray-800 border-4 border-purple-500 flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                    <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">1</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-gray-900 dark:text-white">Post a Job</h3>
                  <p className="text-gray-600 dark:text-gray-300">Tell us what you need. Be specific to get the most accurate quotes from our network of professionals.</p>
                </div>

                <div className="relative text-center z-10">
                  <div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-white dark:bg-gray-800 border-4 border-purple-500 flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                    <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">2</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-gray-900 dark:text-white">Get Matches</h3>
                  <p className="text-gray-600 dark:text-gray-300">Our smart AI algorithm matches you with qualified, vetted pros in your area who are ready to help.</p>
                </div>

                <div className="relative text-center z-10">
                  <div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-white dark:bg-gray-800 border-4 border-purple-500 flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                    <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">3</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-gray-900 dark:text-white">Hire & Relax</h3>
                  <p className="text-gray-600 dark:text-gray-300">Compare profiles, quotes, and reviews. Hire the best fit and get the job done right, guaranteed.</p>
                </div>
              </div>
            </section>

            {/* Service Categories Section - Server Rendered with Real Data */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8" role="region" aria-labelledby="categories-title">
              <h2 id="categories-title" className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">Popular Service Categories</h2>
              <p className="text-lg md:text-xl text-center mb-8 sm:mb-12 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">Explore thousands of verified service providers across all major categories.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-6xl mx-auto">
                {categories.map((category, index) => {
                  // Icon mapping
                  const IconComponent = {
                    'home': HomeIcon,
                    'dumbbell': Dumbbell,
                    'graduation-cap': GraduationCap,
                    'monitor': Monitor,
                    'car': Car,
                    'party-popper': PartyPopper
                  }[category.icon_name] || HomeIcon;

                  // Color mapping
                  const colors = [
                    { gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                    { gradient: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
                    { gradient: 'from-green-500 to-teal-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                    { gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                    { gradient: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                    { gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-50 dark:bg-pink-900/20' }
                  ];
                  const colorScheme = colors[index % colors.length];

                  return (
                    <div key={category.id} className="group">
                      <Link href={`/category/${category.slug}`} className="block">
                        <div className={`${colorScheme.bg} rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm`}>
                          <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${colorScheme.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 dark:text-white">{category.name}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{category.description}</p>
                          <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                            Explore
                            <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800/30">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">What Our Users Say</h2>
              <p className="text-lg md:text-xl text-center mb-8 sm:mb-12 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                Join millions of satisfied customers who trust Loconomy for their service needs
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">SJ</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Sarah Johnson</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Homeowner</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic">
                    "Found an amazing house cleaner through Loconomy in minutes. The booking process was seamless and the service quality exceeded my expectations!"
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">MR</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Mike Rodriguez</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Business Owner</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic">
                    "As a provider, Loconomy has transformed my business. The AI matching brings me perfect clients and the platform handles everything seamlessly."
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">ET</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Emma Thompson</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tech Professional</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic">
                    "The AI recommendations are spot-on! Got my laptop fixed by a certified technician who arrived within 2 hours. Incredible service!"
                  </p>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                      Ready to Get Started with Loconomy?
                    </h2>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                      Join millions of satisfied customers who have found their perfect service providers through our platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/browse" className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        Find Services Now
                      </Link>
                      <Link href="/become-provider" className="bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50 backdrop-blur-sm">
                        Start Earning as Provider
                      </Link>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                </div>
              </div>
            </section>
          </main>

          <ModernFooter />
          <CommandPaletteHint />
          <FloatingFAB />
          <MobileBottomNav currentPath="/" />

          {/* Mobile Bottom Spacing */}
          <div className="h-20 md:h-0"></div>
        </div>
      </PWAProvider>
    </>
  );
}
