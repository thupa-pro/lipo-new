"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  MapPin, 
  Star, 
  Filter, 
  SlidersHorizontal,
  Grid,
  List,
  Heart,
  Share2,
  Verified,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrowseFilters } from "@/components/browse/BrowseFilters";
import { ProviderCard } from "@/components/browse/ProviderCard";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_name: string;
  sort_order: number;
}

interface Provider {
  id: string;
  business_name: string;
  bio: string;
  cover_photo_url?: string;
  rating_average: number;
  rating_count: number;
  response_time_minutes: number;
  is_verified: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  services: {
    id: string;
    name: string;
    price: number;
    duration_minutes: number;
  }[];
  category: Category;
  distance?: number;
}

const MOCK_CATEGORIES: Record<string, Category> = {
  "home-services": {
    id: "1",
    name: "Home Services",
    slug: "home-services",
    description: "Professional home maintenance and repair services",
    icon_name: "home",
    sort_order: 1,
  },
  "personal-care": {
    id: "2", 
    name: "Personal Care",
    slug: "personal-care",
    description: "Beauty, wellness, and personal care services",
    icon_name: "user",
    sort_order: 2,
  },
  "transportation": {
    id: "3",
    name: "Transportation", 
    slug: "transportation",
    description: "Moving, delivery, and transportation services",
    icon_name: "truck",
    sort_order: 3,
  },
};

const MOCK_PROVIDERS: Provider[] = [
  {
    id: "1",
    business_name: "SparkleClean Pro",
    bio: "Professional house cleaning with eco-friendly products. 10+ years of experience serving the community.",
    cover_photo_url: "/placeholder.svg",
    rating_average: 4.9,
    rating_count: 127,
    response_time_minutes: 15,
    is_verified: true,
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: "San Francisco, CA"
    },
    services: [
      { id: "1", name: "Deep House Cleaning", price: 125, duration_minutes: 180 },
      { id: "2", name: "Regular Cleaning", price: 85, duration_minutes: 120 },
    ],
    category: MOCK_CATEGORIES["home-services"],
    distance: 0.8,
  },
  {
    id: "2", 
    business_name: "FreshCuts Studio",
    bio: "Modern barbershop with skilled stylists. Walk-ins welcome, appointments preferred.",
    cover_photo_url: "/placeholder.svg",
    rating_average: 4.7,
    rating_count: 89,
    response_time_minutes: 30,
    is_verified: true,
    location: {
      lat: 37.7849,
      lng: -122.4094,
      address: "San Francisco, CA"
    },
    services: [
      { id: "3", name: "Haircut & Style", price: 45, duration_minutes: 45 },
      { id: "4", name: "Beard Trim", price: 25, duration_minutes: 20 },
    ],
    category: MOCK_CATEGORIES["personal-care"],
    distance: 1.2,
  },
  {
    id: "3",
    business_name: "QuickMove Logistics", 
    bio: "Reliable moving and delivery services. Fully insured with professional equipment.",
    cover_photo_url: "/placeholder.svg",
    rating_average: 4.6,
    rating_count: 234,
    response_time_minutes: 45,
    is_verified: false,
    location: {
      lat: 37.7649,
      lng: -122.4294,
      address: "San Francisco, CA"
    },
    services: [
      { id: "5", name: "Local Moving", price: 200, duration_minutes: 240 },
      { id: "6", name: "Furniture Delivery", price: 75, duration_minutes: 60 },
    ],
    category: MOCK_CATEGORIES["transportation"],
    distance: 2.1,
  }
];

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState("25");

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);

      // Create abort controller for this request
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, 45000); // 45 second timeout for category data fetching

      try {
        // Get user location if available
        let lat = 0, lng = 0;
        if (navigator.geolocation) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            const locationTimeout = setTimeout(() => {
              reject(new Error('Geolocation timeout'));
            }, 10000); // 10 second timeout for geolocation

            navigator.geolocation.getCurrentPosition(
              (pos) => {
                clearTimeout(locationTimeout);
                resolve(pos);
              },
              (err) => {
                clearTimeout(locationTimeout);
                reject(err);
              },
              { timeout: 10000 }
            );
          }).catch(() => null);

          if (position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
          }
        }

        const params = new URLSearchParams({
          q: searchQuery,
          minPrice: priceRange[0].toString(),
          maxPrice: priceRange[1].toString(),
          distance: selectedDistance,
          sortBy,
          ...(lat && lng ? { lat: lat.toString(), lng: lng.toString() } : {}),
        });

        const response = await fetch(`/api/categories/${slug}?${params}`, {
          signal: abortController.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch category data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setCategory(data.category);
        setProviders(data.providers || []);
      } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.warn('Category data request was cancelled or timed out');
            // Don't show fallback data for user-initiated aborts, just keep loading state
            return;
          } else {
            console.error('Error fetching category data:', error.message);
          }
        } else {
          console.error('Unknown error fetching category data:', error);
        }

        // Fallback to mock data for real errors (not aborts)
        const foundCategory = MOCK_CATEGORIES[slug];
        setCategory(foundCategory || null);

        if (foundCategory) {
          const categoryProviders = MOCK_PROVIDERS.filter(
            p => p.category.slug === foundCategory.slug
          );
          setProviders(categoryProviders);
        }
      } finally {
        setLoading(false);
      }

      // Cleanup function
      return () => {
        clearTimeout(timeoutId);
        abortController.abort();
      };
    };

    const cleanup = fetchCategoryData();
    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then((cleanupFn) => {
          if (typeof cleanupFn === 'function') {
            cleanupFn();
          }
        });
      }
    };
  }, [slug, searchQuery, priceRange, selectedDistance, sortBy]);

  const filteredProviders = useMemo(() => {
    let filtered = [...providers];
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Price filter
    filtered = filtered.filter(p => {
      const minPrice = Math.min(...p.services.map(s => s.price));
      return minPrice >= priceRange[0] && minPrice <= priceRange[1];
    });
    
    // Distance filter
    const maxDistance = parseInt(selectedDistance);
    filtered = filtered.filter(p => (p.distance || 0) <= maxDistance);
    
    // Sort
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating_average - a.rating_average);
        break;
      case "price_low":
        filtered.sort((a, b) => 
          Math.min(...a.services.map(s => s.price)) - Math.min(...b.services.map(s => s.price))
        );
        break;
      case "price_high":
        filtered.sort((a, b) => 
          Math.min(...b.services.map(s => s.price)) - Math.min(...a.services.map(s => s.price))
        );
        break;
      case "distance":
        filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case "response_time":
        filtered.sort((a, b) => a.response_time_minutes - b.response_time_minutes);
        break;
    }
    
    return filtered;
  }, [providers, searchQuery, priceRange, selectedDistance, sortBy]);

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/category/${slug}?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The category you're looking for doesn't exist.
        </p>
        <Button onClick={() => router.push("/browse")}>
          Browse All Services
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {category.name}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {category.description}
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {filteredProviders.length} providers
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  San Francisco Bay Area
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Trending category
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save Search
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Search and Quick Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${category.name.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  updateSearchParams("q", e.target.value);
                }}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="distance">Nearest</SelectItem>
                  <SelectItem value="response_time">Fastest Response</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(showFilters && "bg-blue-50 dark:bg-blue-950/20")}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
              
              <div className="border rounded-lg p-1 flex">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-2"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-80">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Distance Filter */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Distance
                    </label>
                    <Select value={selectedDistance} onValueChange={setSelectedDistance}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">Within 5 miles</SelectItem>
                        <SelectItem value="10">Within 10 miles</SelectItem>
                        <SelectItem value="25">Within 25 miles</SelectItem>
                        <SelectItem value="50">Within 50 miles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Price Range
                    </label>
                    <div className="px-3">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={500}
                        min={0}
                        step={25}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}+</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Provider Features */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Provider Features
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <Verified className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Verified providers only</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Quick response (&lt;30 min)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Top-rated (4.5+ stars)</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {filteredProviders.length} {category.name} Providers
                </h2>
                <p className="text-sm text-muted-foreground">
                  Showing results in San Francisco Bay Area
                </p>
              </div>
              
              {filteredProviders.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Avg. price:</span>
                  <span className="font-medium text-foreground">
                    ${Math.round(
                      filteredProviders.reduce((acc, p) => 
                        acc + Math.min(...p.services.map(s => s.price)), 0
                      ) / filteredProviders.length
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Provider Grid/List */}
            {filteredProviders.length === 0 ? (
              <Card className="p-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No providers found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setPriceRange([0, 500]);
                    setSelectedDistance("25");
                    updateSearchParams("q", "");
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className={cn(
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              )}>
                {filteredProviders.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={{
                      id: provider.id,
                      business_name: provider.business_name,
                      bio: provider.bio,
                      cover_photo_url: provider.cover_photo_url,
                      rating_average: provider.rating_average,
                      rating_count: provider.rating_count,
                      response_time_minutes: provider.response_time_minutes,
                      is_verified: provider.is_verified,
                      location: provider.location.address,
                      starting_price: Math.min(...provider.services.map(s => s.price)),
                      service_count: provider.services.length,
                      distance: provider.distance
                    }}
                    className={cn(
                      viewMode === "list" && "max-w-none"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
