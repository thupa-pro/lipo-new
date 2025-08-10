import { Suspense } from 'react';
import { createSupabaseServerComponent } from '@/lib/supabase/server';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card";
import { EnhancedButton, IconButton } from "@/components/ui/enhanced-button";
import { SkeletonLoader, ListSkeleton } from "@/components/ui/skeleton-loader";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModernFooter } from "@/components/modern-footer";
import { CommandPaletteHint } from "@/components/ui/command-palette-hint";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import { Star, Clock, CheckCircle, MapPin, Filter, Search, Heart, MessageCircle, ArrowRight, TrendingUp, Users } from 'lucide-react';

// Client components for interactivity
import { BrowseFilters } from "./components/browse-filters";

// Enhanced metadata for SEO
export const metadata = {
  title: "Browse Local Service Providers | Loconomy - Find Trusted Professionals",
  description: "Discover and book trusted local service providers near you. From home services to personal training, find verified professionals with real reviews and instant booking.",
  keywords: ["local services", "service providers", "home repair", "personal training", "tutoring", "professional services"],
  openGraph: {
    title: "Browse Local Service Providers | Loconomy",
    description: "Discover and book trusted local service providers near you",
    url: "https://loconomy.com/browse",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Server-side data fetching for providers
async function getProviders(searchParams: { q?: string; location?: string; category?: string }) {
  const supabase = createSupabaseServerComponent();
  
  try {
    let query = supabase
      .from('providers')
      .select(`
        *,
        users (display_name, avatar_url),
        categories (name, slug),
        reviews (rating)
      `)
      .eq('is_active', true);

    // Apply filters if provided
    if (searchParams.category) {
      query = query.eq('categories.slug', searchParams.category);
    }

    // For now, limit results for performance
    const { data: providers, error } = await query
      .order('rating_average', { ascending: false })
      .limit(12);

    if (error) {
      console.error('Error fetching providers:', error);
      return mockProviders; // Fallback to mock data
    }

    return providers || mockProviders;
  } catch (error) {
    console.error('Error in getProviders:', error);
    return mockProviders;
  }
}

// Server-side category fetching
async function getCategories() {
  const supabase = createSupabaseServerComponent();
  
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('parent_id', null)
      .order('sort_order');

    return categories || mockCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return mockCategories;
  }
}

// Mock data fallback
const mockProviders = [
  {
    id: '1',
    business_name: "Sarah's Cleaning Service",
    bio: "Professional house cleaning with eco-friendly products",
    rating_average: 4.9,
    rating_count: 127,
    response_time_minutes: 120,
    users: {
      display_name: "Sarah Mitchell",
      avatar_url: null
    },
    categories: {
      name: "House Cleaning",
      slug: "house-cleaning"
    },
    location: "2.3 miles away",
    hourlyRate: 35,
    tags: ["Eco-Friendly", "Pet-Safe", "Same-Day"],
    verified: true,
    completedJobs: 245,
    specialty: "Deep Cleaning",
    badge: "Elite Provider"
  },
  {
    id: '2',
    business_name: "Rodriguez Handyman Services",
    bio: "Licensed handyman for all your home repair needs",
    rating_average: 4.8,
    rating_count: 89,
    response_time_minutes: 60,
    users: {
      display_name: "Michael Rodriguez",
      avatar_url: null
    },
    categories: {
      name: "Home Repair",
      slug: "home-repair"
    },
    location: "1.8 miles away",
    hourlyRate: 45,
    tags: ["Licensed", "Insured", "Emergency"],
    verified: true,
    completedJobs: 156,
    specialty: "Electrical Work",
    badge: "Top Rated"
  },
  {
    id: '3',
    business_name: "FitLife Personal Training",
    bio: "Certified personal trainer specializing in weight loss and strength training",
    rating_average: 4.9,
    rating_count: 203,
    response_time_minutes: 90,
    users: {
      display_name: "Jessica Chen",
      avatar_url: null
    },
    categories: {
      name: "Personal Training",
      slug: "personal-training"
    },
    location: "0.9 miles away",
    hourlyRate: 65,
    tags: ["Certified", "Nutrition", "Flexible"],
    verified: true,
    completedJobs: 312,
    specialty: "Weight Loss",
    badge: "Featured"
  }
];

const mockCategories = [
  { id: '1', name: 'Home Services', slug: 'home-services' },
  { id: '2', name: 'Fitness & Wellness', slug: 'fitness-wellness' },
  { id: '3', name: 'Education', slug: 'education' },
  { id: '4', name: 'Tech Support', slug: 'tech-support' }
];

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Loconomy Service Providers",
  "description": "Browse and book local service providers",
  "url": "https://loconomy.com/browse"
};

interface BrowsePageProps {
  searchParams: {
    q?: string;
    location?: string;
    category?: string;
  };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  // Server-side data fetching
  const [providers, categories] = await Promise.all([
    getProviders(searchParams),
    getCategories()
  ]);

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
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Find Local Service Providers</h1>
            <p className="text-muted-foreground mb-4">
              Browse {providers.length}+ verified professionals in your area
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar - Client Component */}
            <div className="lg:col-span-1">
              <Suspense fallback={<div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"></div>}>
                <BrowseFilters 
                  categories={categories}
                  currentSearch={searchParams.q || ''}
                  currentLocation={searchParams.location || ''}
                  currentCategory={searchParams.category || ''}
                />
              </Suspense>
            </div>

            {/* Results Grid - Server Rendered */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {providers.length} results
                  {searchParams.q && (
                    <span> for "{searchParams.q}"</span>
                  )}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Sort
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                            <p className="text-sm text-muted-foreground">{provider.categories?.name}</p>
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

                      <div className="flex flex-wrap gap-1">
                        {provider.tags?.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <span className="text-lg font-bold">${provider.hourlyRate || 50}</span>
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
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No providers found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or browse different categories
                  </p>
                  <Link href="/browse">
                    <Button>Browse All Categories</Button>
                  </Link>
                </div>
              )}

              {/* Load More - for future pagination */}
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
