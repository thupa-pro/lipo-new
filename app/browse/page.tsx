'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card";
import { EnhancedButton, IconButton } from "@/components/ui/enhanced-button";
import { SkeletonLoader, ListSkeleton } from "@/components/ui/skeleton-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModernFooter } from "@/components/modern-footer";
import { CommandPaletteHint } from "@/components/ui/command-palette-hint";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SmartRecommendations } from "@/components/ai/smart-recommendations";
import AIChat from "@/components/ai/AIChat";
import Link from "next/link";
import { Star, Clock, CheckCircle, MapPin, Filter, Search, Heart, MessageCircle, ArrowRight, TrendingUp, Users, Brain, Sparkles } from 'lucide-react';

// Client components for interactivity
import { BrowseFilters } from "./components/browse-filters";

// Types
interface Provider {
  id: string;
  business_name: string;
  bio: string;
  rating_average: number;
  rating_count: number;
  response_time_minutes?: number;
  users?: {
    display_name: string;
    avatar_url?: string;
  };
  categories?: {
    name: string;
    slug: string;
  };
  location?: string;
  hourlyRate?: number;
  tags?: string[];
  verified?: boolean;
  completedJobs?: number;
  specialty?: string;
  badge?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BrowseData {
  providers: Provider[];
  categories: Category[];
}

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Loconomy Service Providers",
  "description": "Browse and book local service providers",
  "url": "https://loconomy.com/browse"
};

// Loading skeleton component
function BrowsePageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-14 items-center justify-between">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <main className="container py-8">
        {/* Page Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters skeleton */}
          <div className="lg:col-span-1">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>

          {/* Results skeleton */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

interface BrowsePageProps {
  searchParams?: {
    q?: string;
    location?: string;
    category?: string;
  };
}

function BrowsePageContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<BrowseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract search parameters
  const q = searchParams.get('q') || '';
  const location = searchParams.get('location') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    async function fetchBrowseData() {
      try {
        setIsLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();
        if (q) params.append('q', q);
        if (location) params.append('location', location);
        if (category) params.append('category', category);

        const response = await fetch(`/api/providers-browse?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch browse data');
        }

        const browseData = await response.json();
        setData(browseData);
      } catch (err) {
        console.error('Error fetching browse data:', err);
        setError('Failed to load browse data');
        
        // Fallback data
        setData({
          providers: [],
          categories: [
            { id: '1', name: 'Home Services', slug: 'home-services' },
            { id: '2', name: 'Fitness & Wellness', slug: 'fitness-wellness' },
            { id: '3', name: 'Education', slug: 'education' },
            { id: '4', name: 'Tech Support', slug: 'tech-support' }
          ]
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchBrowseData();
  }, [q, location, category]);

  if (isLoading) {
    return <BrowsePageSkeleton />;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unable to load browse page</h1>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
              Browse {data.providers.length}+ verified professionals in your area
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar - Client Component */}
            <div className="lg:col-span-1">
              <Suspense fallback={<div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"></div>}>
                <BrowseFilters 
                  categories={data.categories}
                  currentSearch={q}
                  currentLocation={location}
                  currentCategory={category}
                />
              </Suspense>
            </div>

            {/* Results Grid - Client Rendered */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {data.providers.length} results
                  {q && (
                    <span> for "{q}"</span>
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
                {data.providers.map((provider) => (
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

              {data.providers.length === 0 && (
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
              {data.providers.length > 0 && (
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

export default function BrowsePage() {
  return (
    <Suspense fallback={<BrowsePageSkeleton />}>
      <BrowsePageContent />
    </Suspense>
  );
}
