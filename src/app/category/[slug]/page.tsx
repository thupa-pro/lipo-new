import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { createSupabaseServerComponent } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModernFooter } from "@/components/modern-footer";
import { CommandPaletteHint } from "@/components/ui/command-palette-hint";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import { 
  Star, 
  Clock, 
  MapPin, 
  Users, 
  TrendingUp,
  CheckCircle,
  Award,
  Verified
} from "lucide-react";

// Client components
import { CategoryFilters } from "./components/category-filters";

// Configure ISR - revalidate every 30 minutes for category pages
export const revalidate = 1800;

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    sort?: string;
    price_min?: string;
    price_max?: string;
    rating?: string;
  };
}

// Generate static params for known categories
export async function generateStaticParams() {
  // Return common category slugs without database call to avoid cookies issue
  return [
    { slug: 'home-services' },
    { slug: 'wellness-fitness' },
    { slug: 'education-tutoring' },
    { slug: 'tech-repair' },
    { slug: 'automotive' },
    { slug: 'entertainment' },
    { slug: 'business-services' },
    { slug: 'pet-care' },
  ];
}

// Generate metadata for each category
export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  
  if (!category) {
    return {
      title: "Category Not Found | Loconomy",
      description: "The requested category could not be found."
    };
  }

  return {
    title: `${category.name} Services | Loconomy - Find Local ${category.name} Professionals`,
    description: `Find trusted ${category.name.toLowerCase()} professionals in your area. ${category.description || `Book verified ${category.name.toLowerCase()} services with instant quotes and real reviews.`}`,
    keywords: [category.name.toLowerCase(), "local services", "professional services", "booking", "reviews"],
    openGraph: {
      title: `${category.name} Services | Loconomy`,
      description: `Find trusted ${category.name.toLowerCase()} professionals in your area`,
      url: `https://loconomy.com/category/${category.slug}`,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://loconomy.com/category/${category.slug}`,
    },
  };
}

// Server-side data fetching functions
async function getCategoryBySlug(slug: string) {
  const supabase = createSupabaseServerComponent();
  
  try {
    const { data: category } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

async function getProvidersByCategory(categorySlug: string, searchParams: any) {
  const supabase = createSupabaseServerComponent();
  
  try {
    let query = supabase
      .from('providers')
      .select(`
        *,
        users (display_name, avatar_url),
        categories!inner (name, slug),
        services (name, price)
      `)
      .eq('categories.slug', categorySlug)
      .eq('is_active', true);

    // Apply sorting
    switch (searchParams.sort) {
      case 'rating':
        query = query.order('rating_average', { ascending: false });
        break;
      case 'price_low':
        query = query.order('services.price', { ascending: true });
        break;
      case 'price_high':
        query = query.order('services.price', { ascending: false });
        break;
      case 'response_time':
        query = query.order('response_time_minutes', { ascending: true });
        break;
      default:
        query = query.order('rating_average', { ascending: false });
    }

    const { data: providers, error } = await query.limit(20);

    if (error) {
      console.error('Error fetching providers:', error);
      return getMockProviders(categorySlug);
    }

    return providers || getMockProviders(categorySlug);
  } catch (error) {
    console.error('Error in getProvidersByCategory:', error);
    return getMockProviders(categorySlug);
  }
}

async function getCategoryStats(categorySlug: string) {
  const supabase = createSupabaseServerComponent();
  
  try {
    const [providersResult, avgRatingResult] = await Promise.all([
      supabase
        .from('providers')
        .select('id', { count: 'exact', head: true })
        .eq('categories.slug', categorySlug)
        .eq('is_active', true),
      supabase
        .from('providers')
        .select('rating_average')
        .eq('categories.slug', categorySlug)
        .eq('is_active', true)
    ]);

    const avgRating = avgRatingResult.data?.reduce((acc, p) => acc + p.rating_average, 0) / (avgRatingResult.data?.length || 1);

    return {
      totalProviders: providersResult.count || 0,
      averageRating: Number(avgRating?.toFixed(1)) || 4.8,
      totalReviews: Math.floor((providersResult.count || 0) * 15), // Estimated
      avgResponseTime: '2 hours'
    };
  } catch (error) {
    return {
      totalProviders: 25,
      averageRating: 4.8,
      totalReviews: 375,
      avgResponseTime: '2 hours'
    };
  }
}

// Mock data for fallback
function getMockProviders(categorySlug: string) {
  const baseProviders = [
    {
      id: '1',
      business_name: "Professional Service Co.",
      bio: "Experienced professional providing quality services",
      rating_average: 4.9,
      rating_count: 127,
      response_time_minutes: 120,
      users: { display_name: "Alex Johnson", avatar_url: null },
      services: [{ name: "Standard Service", price: 50 }],
      verified: true,
      location: "2.3 miles away"
    },
    {
      id: '2',
      business_name: "Expert Solutions",
      bio: "Licensed expert with years of experience",
      rating_average: 4.8,
      rating_count: 89,
      response_time_minutes: 60,
      users: { display_name: "Sarah Wilson", avatar_url: null },
      services: [{ name: "Premium Service", price: 75 }],
      verified: true,
      location: "1.8 miles away"
    }
  ];

  return baseProviders;
}

// Structured data for category pages
function generateStructuredData(category: any, providers: any[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${category.name} Services`,
    "description": category.description,
    "url": `https://loconomy.com/category/${category.slug}`,
    "numberOfItems": providers.length,
    "itemListElement": providers.slice(0, 5).map((provider, index) => ({
      "@type": "LocalBusiness",
      "position": index + 1,
      "name": provider.business_name,
      "description": provider.bio,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": provider.rating_average,
        "reviewCount": provider.rating_count
      }
    }))
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Server-side data fetching
  const [category, providers, stats] = await Promise.all([
    getCategoryBySlug(params.slug),
    getProvidersByCategory(params.slug, searchParams),
    getCategoryStats(params.slug)
  ]);

  // Return 404 if category doesn't exist
  if (!category) {
    notFound();
  }

  const structuredData = generateStructuredData(category, providers);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold gradient-text">Loconomy</span>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground">Home</Link></li>
              <li>/</li>
              <li><Link href="/browse" className="hover:text-foreground">Browse</Link></li>
              <li>/</li>
              <li className="text-foreground font-medium">{category.name}</li>
            </ol>
          </nav>

          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{category.name} Services</h1>
            <p className="text-lg text-muted-foreground mb-6">
              {category.description || `Find trusted ${category.name.toLowerCase()} professionals in your area`}
            </p>

            {/* Category Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-2xl font-bold">{stats.totalProviders}+</p>
                    <p className="text-sm text-muted-foreground">Providers</p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-2xl font-bold">{stats.averageRating}</p>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-400 fill-current" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-2xl font-bold">{stats.totalReviews}+</p>
                    <p className="text-sm text-muted-foreground">Reviews</p>
                  </div>
                  <Award className="h-8 w-8 text-muted-foreground" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                  </div>
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar - Client Component */}
            <div className="lg:col-span-1">
              <Suspense fallback={<div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"></div>}>
                <CategoryFilters 
                  currentSort={searchParams.sort || 'rating'}
                  currentPriceMin={parseInt(searchParams.price_min || '0')}
                  currentPriceMax={parseInt(searchParams.price_max || '200')}
                  currentRating={parseFloat(searchParams.rating || '0')}
                />
              </Suspense>
            </div>

            {/* Providers Grid - Server Rendered */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                  {providers.length} {category.name} Professionals
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {providers.map((provider) => (
                  <Card key={provider.id} className="card-glow hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={provider.users?.avatar_url || undefined} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                              {provider.users?.display_name?.split(' ').map(n => n[0]).join('') || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{provider.users?.display_name || provider.business_name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{category.name}</p>
                          </div>
                        </div>
                        {provider.verified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {provider.bio}
                      </p>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{provider.rating_average}</span>
                          <span className="text-muted-foreground">({provider.rating_count})</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{provider.response_time_minutes ? `${Math.floor(provider.response_time_minutes / 60)}h` : '2h'} response</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.location || 'Local area'}</span>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <span className="text-lg font-bold">
                            ${provider.services?.[0]?.price || 50}
                          </span>
                          <span className="text-sm text-muted-foreground">/hour</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                          <Button size="sm" className="btn-glow">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {providers.length === 0 && (
                <div className="text-center py-16">
                  <h3 className="text-lg font-medium mb-2">No providers found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or browse other categories
                  </p>
                  <Link href="/browse">
                    <Button>Browse All Categories</Button>
                  </Link>
                </div>
              )}

              {/* Load More */}
              {providers.length > 0 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Load More Providers
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>

        <ModernFooter />
        <CommandPaletteHint />
      </div>
    </>
  );
}
