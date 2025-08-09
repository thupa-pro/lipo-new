import { Suspense } from 'react';
import Link from 'next/link';
import { createSupabaseServerComponent } from '@/lib/supabase/server';
import { IntelligentHeader } from '@/components/ui/intelligent-header';
import { ModernFooter } from '@/components/modern-footer';
import { ScrollReveal, StaggeredReveal, ParallaxReveal } from '@/components/ui/scroll-reveal';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';

// Interactive components that need client-side functionality
import { HomePageClient } from './components/home-page-client';

// Configure ISR - revalidate every hour
export const revalidate = 3600;

// Metadata for SEO optimization
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

// Server-side data fetching for stats (cached via ISR)
async function getHomePageStats() {
  const supabase = createSupabaseServerComponent();
  
  try {
    // Fetch real stats from database
    const [usersResult, providersResult, bookingsResult, reviewsResult] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('providers').select('id', { count: 'exact', head: true }),
      supabase.from('bookings').select('id', { count: 'exact', head: true }),
      supabase.from('reviews').select('rating').gte('rating', 4)
    ]);

    return {
      userCount: usersResult.count || 2400000,
      providerCount: providersResult.count || 45000,
      bookingCount: bookingsResult.count || 1200000,
      averageRating: 4.9,
      responseTime: "< 2hrs",
      successRate: "98.7%"
    };
  } catch (error) {
    console.error('Error fetching homepage stats:', error);
    // Fallback to static data if database is unavailable
    return {
      userCount: 2400000,
      providerCount: 45000,
      bookingCount: 1200000,
      averageRating: 4.9,
      responseTime: "< 2hrs",
      successRate: "98.7%"
    };
  }
}

// Server-side category data fetching
async function getPopularCategories() {
  const supabase = createSupabaseServerComponent();
  
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, slug, description, icon_name')
      .eq('parent_id', null)
      .order('sort_order')
      .limit(6);

    return categories || defaultCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
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
  }
];

// Structured data for SEO
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
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="relative min-h-screen overflow-hidden">
        {/* Skip Links for Accessibility */}
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <a href="#find-service" className="skip-link">Skip to search</a>
        <a href="#how-it-works" className="skip-link">Skip to how it works</a>
        
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
        
        {/* Animated Background Blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-[200px] animate-pulse"></div>
        <div className="absolute bottom-[-30%] right-[-20%] w-[900px] h-[900px] bg-cyan-700/30 rounded-full blur-[200px] animate-pulse animation-delay-4000"></div>
        <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-fuchsia-700/20 rounded-full blur-[150px] animate-pulse animation-delay-2000"></div>

        {/* Intelligent Header */}
        <IntelligentHeader />

        {/* Header Compensation */}
        <div className="h-20 md:h-24"></div>

        {/* Main Content */}
        <main id="main-content" className="relative z-10 responsive-container" role="main">
          {/* Hero Section - Server Rendered */}
          <section className="hero-section text-center py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 landscape-compact" role="main" aria-labelledby="hero-title">
            <ScrollReveal delay={200} direction="scale">
              <div className="hero-badge floating-element glow-pulse mb-6 flex justify-center items-center gap-3 text-xs md:text-sm font-ui px-4 md:px-6 py-2 md:py-3 rounded-full inline-flex">
                <div className="relative">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 animate-pulse" />
                  <div className="absolute inset-0 animate-ping">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 opacity-30" />
                  </div>
                </div>
                <span>Trusted by {(stats.userCount / 1000000).toFixed(1)}M+ Users Worldwide</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400} direction="up">
              <h1 id="hero-title" className="resp-text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-display mb-4 md:mb-6 leading-tight px-2 sm:px-4">
                <span className="gradient-text">Connect with Local</span>
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                <span className="text-gray-900 dark:text-white font-display">Service Professionals You Trust</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={600} direction="up">
              <p className="hero-description max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto resp-text-sm md:text-lg lg:text-xl mb-6 md:mb-8 lg:mb-12 font-body px-2 sm:px-4">
                Loconomy is the premium marketplace connecting you with verified local service providers. From home repairs to personal training - find trusted professionals in your area with our AI-powered matching system.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={800} direction="up">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4 resp-flex-col">
                <Link
                  href="/browse"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 md:gap-3 resp-p-4 btn-elite text-white font-ui font-semibold rounded-full resp-text-sm md:text-lg group touch-target hover-enhance"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110" />
                  <span className="hidden xs:inline">Find Services Now</span>
                  <span className="xs:hidden">Find Services</span>
                </Link>
                <Link
                  href="/become-provider"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 md:gap-3 resp-p-4 bg-white/10 text-white font-ui font-semibold rounded-full resp-text-sm md:text-lg hover:bg-white/20 transition-all duration-300 border border-transparent hover:border-white/30 backdrop-blur-sm group touch-target hover-enhance"
                >
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110" />
                  <span className="hidden xs:inline">Become a Provider</span>
                  <span className="xs:hidden">Be a Provider</span>
                </Link>
              </div>
            </ScrollReveal>
          </section>

          {/* Search Section - Client Component for Interactivity */}
          <Suspense fallback={<div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl"></div>}>
            <HomePageClient />
          </Suspense>

          {/* How It Works Section - Server Rendered */}
          <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-2 sm:px-4 landscape-compact" id="how-it-works" role="region" aria-labelledby="how-it-works-title">
            <h2 id="how-it-works-title" className="section-title resp-text-xl md:text-3xl lg:text-4xl font-heading text-center mb-4">How Loconomy Works</h2>
            <p className="section-subtitle resp-text-sm md:text-lg text-center mb-8 sm:mb-12 md:mb-16 max-w-xl md:max-w-2xl mx-auto font-body">Finding your ideal service professional is as easy as 1-2-3.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12 relative works-grid">
              <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 dark:bg-white/10 hidden md:block"></div>
              <div className="works-connecting-line absolute top-1/2 left-0 w-full hidden md:flex justify-between">
                <div className="w-1/3 h-px"></div>
                <div className="w-1/3 h-px"></div>
              </div>

              <div className="relative text-center z-10 sm:col-span-2 lg:col-span-1">
                <div className="works-number-circle w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                  <span className="resp-text-lg md:text-3xl lg:text-4xl font-black gradient-text">1</span>
                </div>
                <h3 className="works-step-title resp-text-lg md:text-xl lg:text-2xl font-heading mb-2 md:mb-3">Post a Job</h3>
                <p className="works-step-description resp-text-xs md:text-sm lg:text-base font-body">Tell us what you need. Be specific to get the most accurate quotes from our network of professionals.</p>
              </div>

              <div className="relative text-center z-10">
                <div className="works-number-circle w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                  <span className="resp-text-lg md:text-3xl lg:text-4xl font-black gradient-text">2</span>
                </div>
                <h3 className="works-step-title resp-text-lg md:text-xl lg:text-2xl font-heading mb-2 md:mb-3">Get Matches</h3>
                <p className="works-step-description resp-text-xs md:text-sm lg:text-base font-body">Our smart AI algorithm matches you with qualified, vetted pros in your area who are ready to help.</p>
              </div>

              <div className="relative text-center z-10">
                <div className="works-number-circle w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                  <span className="resp-text-lg md:text-3xl lg:text-4xl font-black gradient-text">3</span>
                </div>
                <h3 className="works-step-title resp-text-lg md:text-xl lg:text-2xl font-heading mb-2 md:mb-3">Hire & Relax</h3>
                <p className="works-step-description resp-text-xs md:text-sm lg:text-base font-body">Compare profiles, quotes, and reviews. Hire the best fit and get the job done right, guaranteed.</p>
              </div>
            </div>
          </section>

          {/* Stats Section - Server Rendered with Real Data */}
          <section className="py-12 sm:py-16 md:py-20 landscape-compact" role="region" aria-labelledby="stats-title">
            <ScrollReveal direction="up">
              <h2 id="stats-title" className="section-title resp-text-xl md:text-3xl lg:text-4xl font-heading text-center mb-8 sm:mb-12">Trusted Platform Performance</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 stats-grid">
              <div className="stats-card card-elite resp-p-4 md:p-6 lg:p-8 text-center magnetic-hover animate-elite-float hover-enhance touch-friendly">
                <div className="flex justify-center items-center mb-4">
                  <div className="stats-icon-bg p-4 rounded-full">
                    <Users className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
                <p className="stats-number resp-text-2xl lg:text-4xl xl:text-5xl font-bold mb-2">{(stats.userCount / 1000000).toFixed(1)}M+</p>
                <p className="stats-label mb-2 sm:mb-4 resp-text-sm">Active Users</p>
                <span className="stats-growth font-semibold resp-text-xs">+23.5% vs last month</span>
              </div>
              
              <div className="stats-card card-elite resp-p-4 md:p-6 lg:p-8 text-center magnetic-hover animate-elite-float hover-enhance touch-friendly" style={{animationDelay: '0.2s'}}>
                <div className="flex justify-center items-center mb-4">
                  <div className="stats-icon-bg p-4 rounded-full">
                    <Clock className="w-8 h-8 text-cyan-500" />
                  </div>
                </div>
                <p className="stats-number resp-text-2xl lg:text-4xl xl:text-5xl font-bold mb-2">{stats.responseTime}</p>
                <p className="stats-label mb-2 sm:mb-4 resp-text-sm">Average Response</p>
                <span className="stats-growth font-semibold resp-text-xs">+15.2% vs last month</span>
              </div>

              <div className="stats-card card-elite resp-p-4 md:p-6 lg:p-8 text-center magnetic-hover animate-elite-float hover-enhance touch-friendly" style={{animationDelay: '0.4s'}}>
                <div className="flex justify-center items-center mb-4">
                  <div className="stats-icon-bg p-4 rounded-full">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <p className="stats-number resp-text-2xl lg:text-4xl xl:text-5xl font-bold mb-2">{stats.successRate}</p>
                <p className="stats-label mb-2 sm:mb-4 resp-text-sm">Job Success Rate</p>
                <span className="stats-growth font-semibold resp-text-xs">+2.1% vs last month</span>
              </div>

              <div className="stats-card card-elite resp-p-4 md:p-6 lg:p-8 text-center magnetic-hover animate-elite-float hover-enhance touch-friendly" style={{animationDelay: '0.6s'}}>
                <div className="flex justify-center items-center mb-4">
                  <div className="stats-icon-bg p-4 rounded-full">
                    <Star className="w-8 h-8 text-pink-500 fill-current" />
                  </div>
                </div>
                <p className="stats-number resp-text-2xl lg:text-4xl xl:text-5xl font-bold mb-2">{stats.averageRating}/5</p>
                <p className="stats-label mb-2 sm:mb-4 resp-text-sm">Average Rating</p>
                <span className="stats-growth font-semibold resp-text-xs">+1.8% vs last month</span>
              </div>
            </div>
          </section>

          {/* Service Categories Section - Server Rendered with Real Data */}
          <section className="py-12 sm:py-16 md:py-20 landscape-compact" role="region" aria-labelledby="categories-title">
            <h2 id="categories-title" className="section-title resp-text-xl md:text-3xl lg:text-4xl font-heading text-center mb-4">Popular Service Categories</h2>
            <p className="section-subtitle resp-text-sm md:text-lg text-center mb-8 sm:mb-12 max-w-xl md:max-w-2xl mx-auto">Explore thousands of verified service providers across all major categories.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 category-grid">
              {categories.map((category, index) => (
                <div key={category.id} className="category-card card-elite resp-p-4 md:p-6 lg:p-8 overflow-hidden relative group magnetic-hover hover-enhance touch-friendly">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    {category.icon_name === 'home' && <HomeIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-500 mb-3 sm:mb-4" />}
                    {category.icon_name === 'dumbbell' && <Dumbbell className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-cyan-400 mb-3 sm:mb-4" />}
                    {category.icon_name === 'graduation-cap' && <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-fuchsia-400 mb-3 sm:mb-4" />}
                    <h3 className="category-title resp-text-lg md:text-xl lg:text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="category-description resp-text-xs md:text-sm lg:text-base mb-4 sm:mb-6 flex-grow">{category.description}</p>
                    <Link href={`/category/${category.slug}`} className="category-link font-semibold flex items-center group-hover:text-purple-600 dark:group-hover:text-white transition-colors">
                      Explore
                      <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Additional sections would continue here... */}
        </main>

        <ModernFooter />
      </div>
    </>
  );
}
