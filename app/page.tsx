import { Suspense } from 'react';
import Link from 'next/link';
import { createSupabaseServerComponent } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env-check';
import { HomeClientComponents } from '@/components/client-wrappers/home-client-components';
import { ModernFooter } from '@/components/modern-footer';
import { Badge } from '@/components/ui/badge';
import { ModernHeroServer } from '@/components/ui/modern-hero-server';
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card-simple';
import { EnhancedButton } from '@/components/ui/enhanced-button-simple';
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
      
      <HomeClientComponents>
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-stratosphere via-cirrus to-white dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300">
          {/* Skip Links for Accessibility */}
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <a href="#find-service" className="skip-link">Skip to search</a>
          <a href="#how-it-works" className="skip-link">Skip to how it works</a>

          {/* Neural Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, hsl(var(--neural-500)) 2px, transparent 0),
                               radial-gradient(circle at 75px 75px, hsl(var(--quantum-500)) 1px, transparent 0)`,
              backgroundSize: '100px 100px'
            }} />
          </div>

          {/* Animated Background Blobs - Enhanced with modern gradients */}
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-gradient-neural/20 rounded-full blur-[200px] animate-float"></div>
          <div className="absolute bottom-[-30%] right-[-20%] w-[900px] h-[900px] bg-gradient-quantum/20 rounded-full blur-[200px] animate-float animation-delay-4000"></div>
          <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-gradient-plasma/10 rounded-full blur-[150px] animate-float animation-delay-2000"></div>

          {/* Header Compensation */}
          <div className="h-20 md:h-24"></div>

          {/* Main Content */}
          <main id="main-content" className="relative z-10" role="main">
            {/* Modern Hero Section */}
            <ModernHeroServer stats={stats} />

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
                    <EnhancedCard variant="glass" className="text-center hover:scale-105 transition-all duration-500 group">
                      <EnhancedCardContent>
                        <div className="mb-4 sm:mb-6">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-trust flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                          </div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-gradient-trust">Verified & Trusted</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Every service provider is thoroughly background-checked, verified, and insured. Your safety and satisfaction are our top priorities.
                        </p>
                      </EnhancedCardContent>
                    </EnhancedCard>

                    <EnhancedCard variant="glass" className="text-center hover:scale-105 transition-all duration-500 group">
                      <EnhancedCardContent>
                        <div className="mb-4 sm:mb-6">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-neural flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                          </div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-gradient-neural">AI-Powered Matching</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Our intelligent algorithm learns your preferences and matches you with the perfect professionals for your specific needs and location.
                        </p>
                      </EnhancedCardContent>
                    </EnhancedCard>

                    <EnhancedCard variant="glass" className="text-center hover:scale-105 transition-all duration-500 group">
                      <EnhancedCardContent>
                        <div className="mb-4 sm:mb-6">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-quantum flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                          </div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-gradient-quantum">Instant Connection</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Connect with available professionals in real-time. Get quotes, schedule services, and track progress all in one seamless experience.
                        </p>
                      </EnhancedCardContent>
                    </EnhancedCard>
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

                  // Enhanced gradient mapping with modern colors
                  const gradients = [
                    'gradient-neural',
                    'gradient-quantum',
                    'gradient-trust',
                    'gradient-plasma',
                    'gradient-ai',
                    'gradient-glow'
                  ];
                  const gradientClass = gradients[index % gradients.length];

                  return (
                    <div key={category.id} className="group">
                      <Link href={`/category/${category.slug}`} className="block">
                        <EnhancedCard variant="interactive" className="hover:scale-105 transition-all duration-500 h-full">
                          <EnhancedCardContent>
                            <div className={`w-12 h-12 md:w-16 md:h-16 bg-${gradientClass} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                              <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                            <h3 className={`text-xl md:text-2xl font-bold mb-2 text-${gradientClass}`}>{category.name}</h3>
                            <p className="text-muted-foreground mb-4 leading-relaxed">{category.description}</p>
                            <div className={`flex items-center text-${gradientClass} font-semibold group-hover:text-opacity-80 transition-colors`}>
                              Explore
                              <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </EnhancedCardContent>
                        </EnhancedCard>
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
                <EnhancedCard variant="glass" className="hover:scale-105 transition-all duration-500">
                  <EnhancedCardContent>
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-neural rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold">SJ</span>
                      </div>
                      <div>
                        <h4 className="font-bold">Sarah Johnson</h4>
                        <p className="text-sm text-muted-foreground">Homeowner</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">
                      "Found an amazing house cleaner through Loconomy in minutes. The booking process was seamless and the service quality exceeded my expectations!"
                    </p>
                  </EnhancedCardContent>
                </EnhancedCard>

                <EnhancedCard variant="glass" className="hover:scale-105 transition-all duration-500">
                  <EnhancedCardContent>
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-quantum rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold">MR</span>
                      </div>
                      <div>
                        <h4 className="font-bold">Mike Rodriguez</h4>
                        <p className="text-sm text-muted-foreground">Business Owner</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">
                      "As a provider, Loconomy has transformed my business. The AI matching brings me perfect clients and the platform handles everything seamlessly."
                    </p>
                  </EnhancedCardContent>
                </EnhancedCard>

                <EnhancedCard variant="glass" className="hover:scale-105 transition-all duration-500">
                  <EnhancedCardContent>
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-trust rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold">ET</span>
                      </div>
                      <div>
                        <h4 className="font-bold">Emma Thompson</h4>
                        <p className="text-sm text-muted-foreground">Tech Professional</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">
                      "The AI recommendations are spot-on! Got my laptop fixed by a certified technician who arrived within 2 hours. Incredible service!"
                    </p>
                  </EnhancedCardContent>
                </EnhancedCard>
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
                      <Link href="/browse">
                        <EnhancedButton size="lg" className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl hover:shadow-2xl px-8 py-4 text-lg">
                          <Search className="w-5 h-5 mr-2" />
                          Find Services Now
                        </EnhancedButton>
                      </Link>
                      <Link href="/become-provider">
                        <EnhancedButton variant="glass" size="lg" className="text-white border-white/30 hover:border-white/50 px-8 py-4 text-lg">
                          <UserPlus className="w-5 h-5 mr-2" />
                          Start Earning as Provider
                        </EnhancedButton>
                      </Link>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                </div>
              </div>
            </section>
          </main>

          <ModernFooter />

          {/* Mobile Bottom Spacing */}
          <div className="h-20 md:h-0"></div>
        </div>
      </HomeClientComponents>
    </>
  );
}
