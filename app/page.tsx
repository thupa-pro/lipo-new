'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HomeClientComponents } from '@/components/client-wrappers/home-client-components';
import { ModernFooter } from '@/components/modern-footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
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
  TrendingUp,
  Target,
  Award,
  ChevronRight,
  Play,
  MousePointer,
  Smartphone,
  Globe,
  Wifi,
  MessageCircle,
  Calendar,
  CreditCard,
  Lightbulb,
  Rocket,
  Eye,
  Compass,
  Fingerprint,
  Lock,
  Gauge,
  Layers3,
  Palette,
  Database,
  PresentationChart,
} from 'lucide-react';

// Interactive components
import { HomePageClient } from './components/home-page-client';
import { AIInsightsSection } from '@/components/ai/ai-insights-section';
import { LiveProviderStatus } from '@/components/providers/live-provider-status';

// Types
interface HomePageStats {
  userCount: number;
  providerCount: number;
  bookingCount: number;
  averageRating: number;
  responseTime: string;
  successRate: string;
  liveProviders: number;
  avgEarnings: string;
  satisfactionRate: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_name: string;
}

// Enhanced structured data for rich snippets
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://loconomy.com/#website",
      "url": "https://loconomy.com",
      "name": "Loconomy",
      "description": "AI-Powered Local Services Platform",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://loconomy.com/browse?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://loconomy.com/#organization",
      "name": "Loconomy",
      "url": "https://loconomy.com",
      "logo": "https://loconomy.com/logo.png",
      "description": "AI-Powered Local Services Platform connecting customers with verified service professionals",
      "foundingDate": "2023",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-800-LOCONOMY",
        "contactType": "customer service",
        "availableLanguage": ["English", "Spanish", "French"]
      },
      "sameAs": [
        "https://twitter.com/loconomy",
        "https://linkedin.com/company/loconomy",
        "https://facebook.com/loconomy"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://loconomy.com/#service",
      "name": "Local Services Marketplace",
      "provider": {
        "@id": "https://loconomy.com/#organization"
      },
      "serviceType": "Local Services Platform",
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Local Services Categories",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Home Services",
              "description": "Professional home maintenance and repair services"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "Wellness & Fitness",
              "description": "Personal training and wellness coaching services"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "Education & Tutoring",
              "description": "Expert tutoring and educational services"
            }
          }
        ]
      }
    }
  ]
};

// Enhanced loading component
function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="h-20 md:h-24"></div>
      
      {/* Hero skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto mb-4 animate-pulse"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-6 animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>
        
        {/* Search skeleton */}
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl max-w-4xl mx-auto mb-12 animate-pulse"></div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [stats, setStats] = useState<HomePageStats | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Parallel fetch of stats and categories
        const [statsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/homepage-stats'),
          fetch('/api/popular-categories')
        ]);

        if (!statsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [statsData, categoriesData] = await Promise.all([
          statsResponse.json(),
          categoriesResponse.json()
        ]);

        setStats(statsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('Failed to load data');
        
        // Fallback data in case of error
        setStats({
          userCount: 2400000,
          providerCount: 45000,
          bookingCount: 1200000,
          averageRating: 4.9,
          responseTime: "< 2hrs",
          successRate: "98.7%",
          liveProviders: 12000,
          avgEarnings: "$3,200",
          satisfactionRate: "99.2%"
        });
        setCategories([
          {
            id: '1',
            name: 'Home Services',
            slug: 'home-services',
            description: 'Plumbing, electrical, cleaning, and repairs. Professional home maintenance.',
            icon_name: 'home'
          },
          {
            id: '2', 
            name: 'Wellness & Fitness',
            slug: 'wellness-fitness',
            description: 'Personal trainers, yoga, nutrition coaching, and wellness services.',
            icon_name: 'dumbbell'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unable to load page</h1>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Enhanced structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <HomeClientComponents>
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500">
          
          {/* Advanced Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Mesh gradient overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
              <div 
                className="absolute inset-0" 
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 25% 25%, hsl(220 70% 50%) 2px, transparent 0),
                    radial-gradient(circle at 75% 75%, hsl(280 65% 60%) 1px, transparent 0),
                    radial-gradient(circle at 50% 50%, hsl(200 80% 55%) 1.5px, transparent 0)
                  `,
                  backgroundSize: '100px 100px, 150px 150px, 80px 80px'
                }}
              />
            </div>
            
            {/* Dynamic floating elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-[120px] animate-float"></div>
            <div className="absolute bottom-[-30%] right-[-20%] w-[800px] h-[800px] bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-[150px] animate-float animation-delay-4000"></div>
            <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-[100px] animate-float animation-delay-2000"></div>
          </div>

          {/* Header Compensation */}
          <div className="h-20 md:h-24"></div>

          {/* Main Content */}
          <main id="main-content" className="relative z-10" role="main">
            
            {/* Enhanced Hero Section */}
            <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32" role="banner" aria-labelledby="hero-title">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Live Status Badge */}
                <div className="flex justify-center mb-8" role="status" aria-live="polite">
                  <Badge className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white px-6 py-3 text-sm font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-20"></div>
                      </div>
                      <span className="font-semibold">
                        <span className="hidden sm:inline">Live: </span>
                        {stats.liveProviders.toLocaleString()}+ Active Professionals
                      </span>
                      <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        24/7
                      </Badge>
                    </div>
                  </Badge>
                </div>

                {/* Hero Title & Description */}
                <div className="text-center mb-12 lg:mb-16">
                  <h1 
                    id="hero-title"
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight tracking-tight"
                  >
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Find Local Services
                    </span>
                    <br />
                    <span className="text-gray-900 dark:text-white">
                      <span className="hidden sm:inline">with </span>AI-Powered Matching
                    </span>
                  </h1>
                  
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
                    Connect with <strong className="text-gray-900 dark:text-white">verified professionals</strong> in seconds. 
                    From emergency repairs to wellness coaching - our AI finds your perfect match.
                  </p>

                  {/* Social Proof */}
                  <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Trusted by {(stats.userCount / 1000000).toFixed(1)}M+ users
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                      <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {stats.averageRating}/5 ({stats.satisfactionRate} satisfaction)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Search Section */}
                <div id="search-section" role="search" aria-labelledby="search-title">
                  <Card className="max-w-5xl mx-auto mb-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                      <h2 id="search-title" className="sr-only">Search for local services</h2>
                      
                      {/* Search Form */}
                      <div className="space-y-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                          {/* Service Input */}
                          <div className="flex-1 relative group">
                            <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 backdrop-blur rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 group-hover:border-blue-300 dark:group-hover:border-blue-600 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                              <Sparkles className="w-6 h-6 text-blue-500 mr-4 flex-shrink-0" />
                              <div className="flex-1">
                                <label htmlFor="service-search" className="sr-only">What service do you need?</label>
                                <input
                                  id="service-search"
                                  type="text"
                                  placeholder="What service do you need?"
                                  className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none text-lg font-medium"
                                  aria-describedby="service-help"
                                />
                                <div id="service-help" className="sr-only">
                                  Enter the type of service you're looking for, such as plumbing, tutoring, or house cleaning
                                </div>
                              </div>
                              <Badge variant="secondary" className="ml-2 text-xs">
                                <Bot className="w-3 h-3 mr-1" />
                                AI
                              </Badge>
                            </div>
                          </div>

                          {/* Location Input */}
                          <div className="lg:w-80 relative group">
                            <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 backdrop-blur rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 group-hover:border-purple-300 dark:group-hover:border-purple-600 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10">
                              <MapPin className="w-6 h-6 text-purple-500 mr-4 flex-shrink-0" />
                              <div className="flex-1">
                                <label htmlFor="location-search" className="sr-only">Enter your location</label>
                                <input
                                  id="location-search"
                                  type="text"
                                  placeholder="Your location"
                                  className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none text-lg font-medium"
                                  aria-describedby="location-help"
                                />
                                <div id="location-help" className="sr-only">
                                  Enter your city, zip code, or allow location access
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2 text-xs"
                                aria-label="Use GPS to detect current location"
                                type="button"
                              >
                                <Compass className="w-3 h-3 mr-1" aria-hidden="true" />
                                GPS
                              </Button>
                            </div>
                          </div>

                          {/* Search Button */}
                          <div className="lg:w-auto">
                            <Link href="/browse">
                              <Button 
                                size="lg"
                                className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                                aria-label="Search for services in your area"
                              >
                                <Search className="w-6 h-6 mr-3" />
                                <span className="hidden sm:inline">Find Professionals</span>
                                <span className="sm:hidden">Search</span>
                              </Button>
                            </Link>
                          </div>
                        </div>

                        {/* Quick Tags */}
                        <div className="flex flex-wrap gap-3 justify-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Popular:</span>
                          {['Emergency Plumber', 'House Cleaning', 'Math Tutor', 'Personal Trainer', 'Electrician', 'Pet Sitting'].map((tag) => (
                            <button
                              key={tag}
                              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              aria-label={`Search for ${tag.toLowerCase()}`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Insights Dashboard */}
                <Suspense fallback={
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-3xl max-w-5xl mx-auto mb-16 animate-pulse"></div>
                }>
                  <AIInsightsSection stats={stats} />
                </Suspense>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
                  <Link
                    href="/post-job"
                    className="group"
                    aria-label="Post a job and get matched with professionals in minutes"
                  >
                    <Card className="h-full bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-3xl overflow-hidden">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-6">
                          <div className="p-4 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <MousePointer className="w-10 h-10" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-2">Post a Job</h3>
                            <p className="text-blue-100 text-lg">Get matched with pros in minutes</p>
                            <div className="flex items-center mt-3 text-sm text-blue-200">
                              <Clock className="w-4 h-4 mr-1" />
                              Avg response: {stats.responseTime}
                            </div>
                          </div>
                          <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link
                    href="/become-provider"
                    className="group"
                    aria-label="Become a service provider and start earning money today"
                  >
                    <Card className="h-full bg-gradient-to-r from-green-600 to-teal-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-3xl overflow-hidden">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-6">
                          <div className="p-4 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <Rocket className="w-10 h-10" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-2">Become a Provider</h3>
                            <p className="text-green-100 text-lg">Start earning today</p>
                            <div className="flex items-center mt-3 text-sm text-green-200">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              Avg monthly: {stats.avgEarnings}
                            </div>
                          </div>
                          <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                  {[
                    {
                      icon: Users,
                      value: `${(stats.userCount / 1000000).toFixed(1)}M+`,
                      label: "Active Users",
                      change: "+23.5%",
                      gradient: "from-purple-500 to-pink-500"
                    },
                    {
                      icon: Clock,
                      value: stats.responseTime,
                      label: "Avg Response",
                      change: "+15.2% faster",
                      gradient: "from-cyan-500 to-blue-500"
                    },
                    {
                      icon: Target,
                      value: stats.successRate,
                      label: "Success Rate", 
                      change: "+2.1%",
                      gradient: "from-green-500 to-teal-500"
                    },
                    {
                      icon: Star,
                      value: `${stats.averageRating}/5`,
                      label: "Avg Rating",
                      change: "+1.8%",
                      gradient: "from-orange-500 to-red-500"
                    }
                  ].map((stat, index) => (
                    <Card key={index} className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-2xl">
                      <CardContent className="p-6 text-center">
                        <div className={`p-4 bg-gradient-to-r ${stat.gradient} rounded-2xl w-fit mx-auto mb-4`}>
                          <stat.icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
                          {stat.label}
                        </div>
                        <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          {stat.change}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Live Provider Status */}
                <Suspense fallback={
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-full max-w-md mx-auto animate-pulse"></div>
                }>
                  <LiveProviderStatus liveCount={stats.liveProviders} />
                </Suspense>
              </div>
            </section>

            {/* Value Proposition Section */}
            <section className="py-16 sm:py-20 md:py-24 bg-white/50 dark:bg-gray-800/20" role="region" aria-labelledby="value-prop-title">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <Zap className="w-4 h-4 mr-2" />
                    Why Choose Loconomy
                  </Badge>
                  <h2 id="value-prop-title" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
                    Your Gateway to Trusted Local Services
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                    Experience the future of local services with our AI-powered platform that connects you with verified professionals in your community.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                  {[
                    {
                      icon: Shield,
                      title: "Verified & Trusted",
                      description: "Every professional is thoroughly background-checked, licensed, and insured. Your safety and satisfaction are guaranteed.",
                      gradient: "from-blue-500 to-purple-500",
                      features: ["Background checks", "Insurance verified", "License validation", "24/7 monitoring"]
                    },
                    {
                      icon: Brain,
                      title: "AI-Powered Matching",
                      description: "Our intelligent algorithm learns your preferences and matches you with the perfect professionals for your specific needs.",
                      gradient: "from-purple-500 to-pink-500", 
                      features: ["Smart recommendations", "Preference learning", "Skill matching", "Real-time optimization"]
                    },
                    {
                      icon: Zap,
                      title: "Instant Connection",
                      description: "Connect with available professionals in real-time. Get quotes, schedule services, and track progress seamlessly.",
                      gradient: "from-green-500 to-teal-500",
                      features: ["Real-time matching", "Instant quotes", "Live tracking", "Secure messaging"]
                    }
                  ].map((feature, index) => (
                    <EnhancedCard key={index} variant="glass" className="group hover:scale-105 transition-all duration-500 h-full">
                      <EnhancedCardContent className="p-8">
                        <div className="mb-6">
                          <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            <feature.icon className="w-10 h-10 text-white" />
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-6">
                          {feature.description}
                        </p>

                        <ul className="space-y-2">
                          {feature.features.map((item, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </EnhancedCardContent>
                    </EnhancedCard>
                  ))}
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[
                    { metric: "98.7%", label: "Success Rate", icon: Target },
                    { metric: "< 2hrs", label: "Response Time", icon: Clock },
                    { metric: "24/7", label: "Live Support", icon: HeadphonesIcon },
                    { metric: "256-bit", label: "Encryption", icon: Lock }
                  ].map((item, index) => (
                    <div key={index} className="group">
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl mb-4 mx-auto w-fit shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                        <item.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {item.metric}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Smart Search Preview Section */}
            <Suspense fallback={<div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl mx-4"></div>}>
              <HomePageClient />
            </Suspense>

            {/* Service Categories Section */}
            <section className="py-16 sm:py-20 md:py-24" role="region" aria-labelledby="categories-title">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    <Layers3 className="w-4 h-4 mr-2" />
                    Service Categories
                  </Badge>
                  <h2 id="categories-title" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
                    Popular Service Categories
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Explore thousands of verified service providers across all major categories.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {categories.map((category, index) => {
                    const IconComponent = {
                      'home': HomeIcon,
                      'dumbbell': Dumbbell,
                      'graduation-cap': GraduationCap,
                      'monitor': Monitor,
                      'car': Car,
                      'party-popper': PartyPopper,
                      'briefcase': Briefcase,
                      'palette': Palette
                    }[category.icon_name] || HomeIcon;

                    const gradients = [
                      'from-blue-500 to-purple-500',
                      'from-purple-500 to-pink-500',
                      'from-green-500 to-teal-500',
                      'from-orange-500 to-red-500',
                      'from-cyan-500 to-blue-500',
                      'from-pink-500 to-rose-500',
                      'from-indigo-500 to-purple-500',
                      'from-emerald-500 to-green-500'
                    ];
                    const gradientClass = gradients[index % gradients.length];

                    return (
                      <Link key={category.id} href={`/category/${category.slug}`} className="group">
                        <EnhancedCard variant="interactive" className="h-full hover:scale-105 transition-all duration-500 group">
                          <EnhancedCardContent className="p-6 text-center">
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${gradientClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>
                            
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {category.name}
                            </h3>
                            
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                              {category.description}
                            </p>
                            
                            <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                              <span>Explore Services</span>
                              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </EnhancedCardContent>
                        </EnhancedCard>
                      </Link>
                    );
                  })}
                </div>

                {/* View All Categories */}
                <div className="text-center">
                  <Link href="/browse">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="px-8 py-4 text-lg font-semibold border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      View All Categories
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* Enhanced Testimonials Section */}
            <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50" role="region" aria-labelledby="testimonials-title">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                    <Heart className="w-4 h-4 mr-2" />
                    Customer Stories
                  </Badge>
                  <h2 id="testimonials-title" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
                    What Our Users Say
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Join millions of satisfied customers who trust Loconomy for their service needs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {[
                    {
                      name: "Sarah Johnson",
                      role: "Homeowner",
                      location: "San Francisco, CA",
                      avatar: "SJ",
                      rating: 5,
                      text: "Found an amazing house cleaner through Loconomy in minutes. The AI matching was incredibly accurate - they understood exactly what I needed!",
                      service: "House Cleaning",
                      gradient: "from-blue-500 to-purple-500"
                    },
                    {
                      name: "Mike Rodriguez", 
                      role: "Service Provider",
                      location: "Austin, TX",
                      avatar: "MR",
                      rating: 5,
                      text: "As a plumber, Loconomy has transformed my business. The AI brings me perfect clients and the platform handles everything seamlessly.",
                      service: "Plumbing Services",
                      gradient: "from-green-500 to-teal-500"
                    },
                    {
                      name: "Emma Thompson",
                      role: "Tech Professional", 
                      location: "New York, NY",
                      avatar: "ET",
                      rating: 5,
                      text: "The AI recommendations are phenomenal! Got my laptop fixed by a certified technician who arrived within 2 hours. Absolutely incredible!",
                      service: "Tech Repair",
                      gradient: "from-purple-500 to-pink-500"
                    }
                  ].map((testimonial, index) => (
                    <EnhancedCard key={index} variant="glass" className="hover:scale-105 transition-all duration-500 h-full">
                      <EnhancedCardContent className="p-8">
                        <div className="flex items-start mb-6">
                          <div className={`w-14 h-14 bg-gradient-to-r ${testimonial.gradient} rounded-2xl flex items-center justify-center mr-4 shadow-lg`}>
                            <span className="text-white font-bold text-lg">{testimonial.avatar}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white">{testimonial.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">{testimonial.location}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {testimonial.service}
                          </Badge>
                        </div>
                        
                        <div className="flex mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        
                        <blockquote className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
                          "{testimonial.text}"
                        </blockquote>
                      </EnhancedCardContent>
                    </EnhancedCard>
                  ))}
                </div>

                {/* Trust Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                      { value: stats.satisfactionRate, label: "Satisfaction Rate", icon: Heart },
                      { value: `${(stats.userCount / 1000000).toFixed(1)}M+`, label: "Happy Customers", icon: Users },
                      { value: stats.successRate, label: "Project Success", icon: Target },
                      { value: "4.9/5", label: "Average Rating", icon: Star }
                    ].map((stat, index) => (
                      <div key={index}>
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl w-fit mx-auto mb-4">
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 sm:py-20 md:py-24" id="how-it-works" role="region" aria-labelledby="how-it-works-title">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Simple Process
                  </Badge>
                  <h2 id="how-it-works-title" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
                    How Loconomy Works
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Finding your ideal service professional is as easy as 1-2-3.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 relative">
                  {/* Connection lines */}
                  <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800 to-transparent hidden lg:block"></div>

                  {[
                    {
                      step: "1",
                      title: "Post Your Need",
                      description: "Tell us what you need. Our AI understands your requirements and finds the perfect matches in your area.",
                      icon: MousePointer,
                      gradient: "from-blue-500 to-purple-500"
                    },
                    {
                      step: "2", 
                      title: "Get AI Matches",
                      description: "Our intelligent algorithm instantly matches you with qualified, vetted professionals who are available and ready to help.",
                      icon: Brain,
                      gradient: "from-purple-500 to-pink-500"
                    },
                    {
                      step: "3",
                      title: "Hire & Relax",
                      description: "Compare profiles, get instant quotes, and hire the best fit. Track progress and pay securely through our platform.",
                      icon: CheckCircle,
                      gradient: "from-green-500 to-teal-500"
                    }
                  ].map((step, index) => (
                    <div key={index} className="relative text-center z-10">
                      <div className="bg-white dark:bg-gray-800 rounded-full p-2 w-fit mx-auto mb-6 shadow-lg">
                        <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center shadow-lg`}>
                          <span className="text-3xl font-black text-white">{step.step}</span>
                        </div>
                      </div>
                      
                      <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${step.gradient} flex items-center justify-center shadow-lg`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                  <Link href="/post-job">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    >
                      <Rocket className="w-6 h-6 mr-3" />
                      Get Started Now
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
                  Ready to Experience the Future of Local Services?
                </h2>
                <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
                  Join millions of satisfied customers and providers who have transformed their service experience with Loconomy's AI-powered platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                  <Link href="/browse">
                    <Button 
                      size="lg" 
                      className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl hover:shadow-2xl px-10 py-6 text-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/20"
                    >
                      <Search className="w-6 h-6 mr-3" />
                      Find Services Now
                    </Button>
                  </Link>
                  <Link href="/become-provider">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="text-white border-white/50 hover:border-white hover:bg-white/10 px-10 py-6 text-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/20"
                    >
                      <UserPlus className="w-6 h-6 mr-3" />
                      Start Earning as Provider
                    </Button>
                  </Link>
                </div>

                {/* Mobile App Badges */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <span className="text-lg font-medium opacity-90">Download our app:</span>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="text-white border-white/50 hover:border-white hover:bg-white/10"
                      aria-label="Download Loconomy app from Apple App Store (coming soon)"
                      disabled
                    >
                      <Smartphone className="w-5 h-5 mr-2" aria-hidden="true" />
                      App Store
                    </Button>
                    <Button
                      variant="outline"
                      className="text-white border-white/50 hover:border-white hover:bg-white/10"
                      aria-label="Download Loconomy app from Google Play Store (coming soon)"
                      disabled
                    >
                      <Play className="w-5 h-5 mr-2" aria-hidden="true" />
                      Google Play
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <ModernFooter />

          {/* Mobile Bottom Spacing for Navigation */}
          <div className="h-20 md:h-0"></div>
        </div>
      </HomeClientComponents>
    </>
  );
}
