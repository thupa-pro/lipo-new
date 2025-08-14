"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Search, 
  Filter, 
  Layers,
  Navigation,
  Clock,
  DollarSign,
  Star,
  Zap,
  Flame,
  Eye,
  EyeOff,
  RefreshCw,
  MoreVertical,
  ExternalLink,
  Phone,
  MessageSquare,
  Bookmark,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamic import for Leaflet and components (client-side only)
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then(mod => mod.Circle), { ssr: false });

interface GigJob {
  id: string;
  title: string;
  description: string;
  category: string;
  provider: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    verified: boolean;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
    name?: string;
  };
  pricing: {
    amount: number;
    currency: string;
    type: 'fixed' | 'hourly';
  };
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: string;
  created_at: string;
  updated_at: string;
  status: 'available' | 'in_progress' | 'completed';
  distance?: number;
  tags: string[];
}

interface MapFilters {
  category: string;
  maxPrice: number;
  urgency: string[];
  radius: number;
  showVerifiedOnly: boolean;
  sortBy: 'distance' | 'price' | 'rating' | 'newest' | 'urgent';
}

interface InteractiveGigMapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  className?: string;
  onJobSelect?: (job: GigJob) => void;
  showFilters?: boolean;
  height?: string;
}

// Mock data for demonstration
const MOCK_JOBS: GigJob[] = [
  {
    id: "1",
    title: "House Cleaning Service",
    description: "Deep cleaning for 3-bedroom apartment. All supplies included.",
    category: "home-services",
    provider: {
      id: "p1",
      name: "Sarah Mitchell",
      avatar: "/placeholder.svg",
      rating: 4.9,
      verified: true,
    },
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: "123 Main St, San Francisco, CA",
      name: "Downtown Area"
    },
    pricing: {
      amount: 125,
      currency: "USD",
      type: "fixed"
    },
    urgency: "medium",
    deadline: "2024-01-15T14:00:00Z",
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z",
    status: "available",
    tags: ["eco-friendly", "insured", "same-day"]
  },
  {
    id: "2",
    title: "Urgent Plumbing Repair",
    description: "Leaking pipe in kitchen needs immediate attention.",
    category: "home-services",
    provider: {
      id: "p2",
      name: "Mike Rodriguez",
      avatar: "/placeholder.svg",
      rating: 4.8,
      verified: true,
    },
    location: {
      lat: 37.7849,
      lng: -122.4094,
      address: "456 Oak Ave, San Francisco, CA",
    },
    pricing: {
      amount: 85,
      currency: "USD",
      type: "hourly"
    },
    urgency: "urgent",
    created_at: "2024-01-10T12:00:00Z",
    updated_at: "2024-01-10T12:00:00Z",
    status: "available",
    tags: ["24/7", "emergency", "licensed"]
  },
  {
    id: "3",
    title: "Personal Training Session",
    description: "1-hour fitness training session at local park.",
    category: "health-fitness",
    provider: {
      id: "p3",
      name: "Emma Thompson",
      avatar: "/placeholder.svg",
      rating: 5.0,
      verified: true,
    },
    location: {
      lat: 37.7649,
      lng: -122.4294,
      address: "789 Park Blvd, San Francisco, CA",
      name: "Golden Gate Park"
    },
    pricing: {
      amount: 60,
      currency: "USD",
      type: "hourly"
    },
    urgency: "low",
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-10T08:00:00Z",
    status: "available",
    tags: ["outdoor", "certified", "flexible"]
  }
];

export function InteractiveGigMap({
  initialCenter = [37.7749, -122.4194], // San Francisco
  initialZoom = 13,
  className,
  onJobSelect,
  showFilters = true,
  height = "500px"
}: InteractiveGigMapProps) {
  const [jobs, setJobs] = useState<GigJob[]>(MOCK_JOBS);
  const [filteredJobs, setFilteredJobs] = useState<GigJob[]>(MOCK_JOBS);
  const [selectedJob, setSelectedJob] = useState<GigJob | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  const [filters, setFilters] = useState<MapFilters>({
    category: "all",
    maxPrice: 500,
    urgency: [],
    radius: 25,
    showVerifiedOnly: false,
    sortBy: 'distance'
  });

  const mapRef = useRef<any>(null);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.log("Location access denied:", error);
        }
      );
    }
  }, []);

  // Filter jobs based on current filters
  useEffect(() => {
    let filtered = [...jobs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(job => job.category === filters.category);
    }

    // Price filter
    filtered = filtered.filter(job => job.pricing.amount <= filters.maxPrice);

    // Urgency filter
    if (filters.urgency.length > 0) {
      filtered = filtered.filter(job => filters.urgency.includes(job.urgency));
    }

    // Verified only filter
    if (filters.showVerifiedOnly) {
      filtered = filtered.filter(job => job.provider.verified);
    }

    // Calculate distances if user location is available
    if (userLocation) {
      filtered = filtered.map(job => ({
        ...job,
        distance: calculateDistance(
          userLocation[0],
          userLocation[1],
          job.location.lat,
          job.location.lng
        )
      }));

      // Filter by radius
      filtered = filtered.filter(job => (job.distance || 0) <= filters.radius);
    }

    // Sort jobs
    switch (filters.sortBy) {
      case 'distance':
        filtered.sort((a, b) => (a.distance || 999) - (b.distance || 999));
        break;
      case 'price':
        filtered.sort((a, b) => a.pricing.amount - b.pricing.amount);
        break;
      case 'rating':
        filtered.sort((a, b) => b.provider.rating - a.provider.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'urgent':
        const urgencyOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        filtered.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
        break;
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, filters, userLocation]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getMarkerIcon = (job: GigJob) => {
    const urgencyColors = {
      urgent: '#ef4444', // red
      high: '#f97316',   // orange
      medium: '#eab308', // yellow
      low: '#10b981'     // green
    };

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${urgencyColors[job.urgency]};
          border: 3px solid white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
        ">
          <div style="
            background-color: white;
            border-radius: 50%;
            width: 12px;
            height: 12px;
          "></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const handleJobClick = useCallback((job: GigJob) => {
    setSelectedJob(job);
    onJobSelect?.(job);
  }, [onJobSelect]);

  const refreshJobs = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Add some randomness to simulate real-time updates
      const updatedJobs = MOCK_JOBS.map(job => ({
        ...job,
        updated_at: new Date().toISOString(),
        // Randomly update some job statuses
        status: Math.random() > 0.8 ? 'in_progress' : job.status
      }));
      setJobs(updatedJobs);
      setIsLoading(false);
    }, 1000);
  }, []);

  const centerOnUser = useCallback(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView(userLocation, 15);
    }
  }, [userLocation]);

  if (typeof window === 'undefined') {
    return (
      <div className={cn("bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center", className)} style={{ height }}>
        <div className="text-center">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Card className="overflow-hidden">
        {showFilters && (
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Local Gigs Near You
                <Badge variant="secondary">{filteredJobs.length}</Badge>
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshJobs}
                  disabled={isLoading}
                >
                  <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={centerOnUser}
                  disabled={!userLocation}
                >
                  <Navigation className="w-4 h-4" />
                </Button>
                
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search gigs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="home-services">Home Services</SelectItem>
                  <SelectItem value="health-fitness">Health & Fitness</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.sortBy} onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Nearest</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="urgent">Most Urgent</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Switch
                  checked={showHeatmap}
                  onCheckedChange={setShowHeatmap}
                />
                <label className="text-sm">Heatmap</label>
              </div>
            </div>

            {/* Price Range */}
            <div className="mt-4">
              <label className="text-sm font-medium mb-2 block">
                Max Price: ${filters.maxPrice}
              </label>
              <Slider
                value={[filters.maxPrice]}
                onValueChange={([value]) => setFilters(prev => ({ ...prev, maxPrice: value }))}
                max={500}
                min={0}
                step={25}
                className="mb-2"
              />
            </div>
          </CardHeader>
        )}

        <CardContent className="p-0">
          <div style={{ height }} className="relative">
            <MapContainer
              center={initialCenter}
              zoom={initialZoom}
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* User location marker */}
              {userLocation && (
                <>
                  <Marker position={userLocation}>
                    <Popup>
                      <div className="text-center">
                        <strong>Your Location</strong>
                      </div>
                    </Popup>
                  </Marker>
                  
                  {/* Radius circle */}
                  <Circle
                    center={userLocation}
                    radius={filters.radius * 1609.34} // Convert miles to meters
                    pathOptions={{
                      fillColor: '#3b82f6',
                      fillOpacity: 0.1,
                      color: '#3b82f6',
                      weight: 2,
                      opacity: 0.3
                    }}
                  />
                </>
              )}

              {/* Job markers */}
              {filteredJobs.map((job) => (
                <Marker
                  key={job.id}
                  position={[job.location.lat, job.location.lng]}
                  icon={getMarkerIcon(job)}
                  eventHandlers={{
                    click: () => handleJobClick(job),
                  }}
                >
                  <Popup maxWidth={300}>
                    <div className="space-y-3 p-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{job.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {job.description}
                          </p>
                        </div>
                        <Badge 
                          className={cn(
                            "ml-2",
                            job.urgency === 'urgent' && "bg-red-500",
                            job.urgency === 'high' && "bg-orange-500",
                            job.urgency === 'medium' && "bg-yellow-500",
                            job.urgency === 'low' && "bg-green-500"
                          )}
                        >
                          {job.urgency}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={job.provider.avatar} />
                          <AvatarFallback className="text-xs">
                            {job.provider.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">{job.provider.name}</span>
                            {job.provider.verified && (
                              <Badge variant="secondary" className="text-xs px-1">
                                ✓
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{job.provider.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">
                          ${job.pricing.amount}{job.pricing.type === 'hourly' && '/hr'}
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {job.distance && (
                        <div className="text-xs text-muted-foreground">
                          {job.distance.toFixed(1)} miles away
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Selected Job Details Panel */}
      {selectedJob && (
        <Card className="absolute top-4 right-4 w-80 max-h-96 overflow-y-auto z-[1000] shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{selectedJob.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedJob.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedJob(null)}
              >
                ×
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedJob.provider.avatar} />
                <AvatarFallback>
                  {selectedJob.provider.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedJob.provider.name}</span>
                  {selectedJob.provider.verified && (
                    <Badge variant="secondary">Verified</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{selectedJob.provider.rating}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Price</div>
                <div className="font-semibold">
                  ${selectedJob.pricing.amount}
                  {selectedJob.pricing.type === 'hourly' && '/hr'}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Urgency</div>
                <Badge 
                  className={cn(
                    selectedJob.urgency === 'urgent' && "bg-red-500",
                    selectedJob.urgency === 'high' && "bg-orange-500",
                    selectedJob.urgency === 'medium' && "bg-yellow-500",
                    selectedJob.urgency === 'low' && "bg-green-500"
                  )}
                >
                  {selectedJob.urgency}
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Location</div>
              <div className="text-sm">{selectedJob.location.address}</div>
              {selectedJob.distance && (
                <div className="text-xs text-muted-foreground">
                  {selectedJob.distance.toFixed(1)} miles away
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button variant="outline">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
