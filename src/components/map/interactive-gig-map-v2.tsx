"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
  Eye,
  EyeOff,
  RefreshCw,
  Phone,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LeafletMapWrapper } from './leaflet-map-wrapper';
import { getUserAvatar, getServiceImage } from '@/lib/assets/image-service';

interface GigJob {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  price: number;
  urgency: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  provider: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    responseTime: number;
    completionRate: number;
    verified: boolean;
  };
  duration: number;
  requirements: string[];
  distance?: number;
  postedAt: Date;
  isBookmarked?: boolean;
}

interface InteractiveGigMapProps {
  className?: string;
  onJobSelect?: (job: GigJob) => void;
  selectedJob?: GigJob | null;
  height?: number;
}

// Mock data with realistic provider information
const MOCK_JOBS: GigJob[] = [
  {
    id: 'job_1',
    title: 'House Deep Cleaning',
    description: 'Complete deep cleaning of 3-bedroom house including bathrooms, kitchen, and living areas.',
    location: { lat: 40.7589, lng: -73.9851, address: '123 Park Ave, New York, NY' },
    price: 150,
    urgency: 'high',
    category: 'house_cleaning',
    provider: {
      id: 'provider_1',
      name: 'Sarah Johnson',
      avatar: getUserAvatar('provider_1').url,
      rating: 4.9,
      reviewCount: 127,
      responseTime: 15,
      completionRate: 98,
      verified: true
    },
    duration: 180,
    requirements: ['Bring own supplies', 'Pet-friendly'],
    postedAt: new Date(Date.now() - 3600000)
  },
  {
    id: 'job_2',
    title: 'Garden Landscaping',
    description: 'Design and implement new garden layout with native plants and irrigation system.',
    location: { lat: 40.7505, lng: -73.9934, address: '456 Broadway, New York, NY' },
    price: 450,
    urgency: 'medium',
    category: 'landscaping',
    provider: {
      id: 'provider_2',
      name: 'Mike Rodriguez',
      avatar: getUserAvatar('provider_2').url,
      rating: 4.8,
      reviewCount: 89,
      responseTime: 30,
      completionRate: 95,
      verified: true
    },
    duration: 480,
    requirements: ['Property access required', 'Weekend availability'],
    postedAt: new Date(Date.now() - 7200000)
  },
  {
    id: 'job_3',
    title: 'Urgent Plumbing Repair',
    description: 'Emergency leak repair in bathroom. Water damage prevention required immediately.',
    location: { lat: 40.7614, lng: -73.9776, address: '789 Fifth Ave, New York, NY' },
    price: 200,
    urgency: 'urgent',
    category: 'plumbing',
    provider: {
      id: 'provider_3',
      name: 'David Chen',
      avatar: getUserAvatar('provider_3').url,
      rating: 4.7,
      reviewCount: 203,
      responseTime: 10,
      completionRate: 99,
      verified: true
    },
    duration: 120,
    requirements: ['24/7 availability', 'Emergency response'],
    postedAt: new Date(Date.now() - 1800000)
  },
  {
    id: 'job_4',
    title: 'Pet Grooming Service',
    description: 'Professional grooming for two Golden Retrievers including bath, trim, and nail care.',
    location: { lat: 40.7549, lng: -73.9840, address: '321 Madison Ave, New York, NY' },
    price: 120,
    urgency: 'low',
    category: 'pet_care',
    provider: {
      id: 'provider_4',
      name: 'Emily Davis',
      avatar: getUserAvatar('provider_4').url,
      rating: 4.9,
      reviewCount: 156,
      responseTime: 45,
      completionRate: 96,
      verified: true
    },
    duration: 150,
    requirements: ['Pet-friendly', 'Home visit'],
    postedAt: new Date(Date.now() - 10800000)
  }
];

export function InteractiveGigMapV2({ 
  className = '', 
  onJobSelect, 
  selectedJob,
  height = 400 
}: InteractiveGigMapProps) {
  const [jobs, setJobs] = useState<GigJob[]>(MOCK_JOBS);
  const [filteredJobs, setFilteredJobs] = useState<GigJob[]>(MOCK_JOBS);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: "all",
    maxPrice: 500,
    urgency: [] as string[],
    radius: 10,
    showVerifiedOnly: false,
    sortBy: 'distance' as 'distance' | 'price' | 'rating' | 'urgency'
  });
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [selectedJobLocal, setSelectedJobLocal] = useState<GigJob | null>(selectedJob || null);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.log("Location access denied, using default NYC location");
          setUserLocation([40.7589, -73.9851]); // Default to NYC
        }
      );
    } else {
      setUserLocation([40.7589, -73.9851]); // Default to NYC
    }
  }, []);

  // Calculate distance between two coordinates
  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...jobs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(job => job.category === filters.category);
    }

    // Price filter
    filtered = filtered.filter(job => job.price <= filters.maxPrice);

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
          userLocation[0], userLocation[1],
          job.location.lat, job.location.lng
        )
      }));

      // Radius filter
      filtered = filtered.filter(job => 
        !job.distance || job.distance <= filters.radius
      );

      // Sort by selected criteria
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'distance':
            return (a.distance || 0) - (b.distance || 0);
          case 'price':
            return a.price - b.price;
          case 'rating':
            return b.provider.rating - a.provider.rating;
          case 'urgency':
            const urgencyOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
            return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
          default:
            return 0;
        }
      });
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, filters, userLocation, calculateDistance]);

  const handleJobClick = useCallback((job: GigJob) => {
    setSelectedJobLocal(job);
    onJobSelect?.(job);
  }, [onJobSelect]);

  const toggleJobBookmark = useCallback((jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
    ));
  }, []);

  const mapCenter: [number, number] = useMemo(() => {
    if (userLocation) return userLocation;
    if (filteredJobs.length > 0) {
      const lat = filteredJobs.reduce((sum, job) => sum + job.location.lat, 0) / filteredJobs.length;
      const lng = filteredJobs.reduce((sum, job) => sum + job.location.lng, 0) / filteredJobs.length;
      return [lat, lng];
    }
    return [40.7589, -73.9851]; // Default NYC center
  }, [userLocation, filteredJobs]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              Interactive Service Map
              <Badge variant="outline">{filteredJobs.length} services</Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMapVisible(!isMapVisible)}
              >
                {isMapVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {isMapVisible ? 'Hide Map' : 'Show Map'}
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services, providers, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="house_cleaning">House Cleaning</SelectItem>
                <SelectItem value="landscaping">Landscaping</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="pet_care">Pet Care</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Price: ${filters.maxPrice}</label>
              <Slider
                value={[filters.maxPrice]}
                onValueChange={(value) => setFilters(prev => ({ ...prev, maxPrice: value[0] }))}
                max={1000}
                min={0}
                step={25}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Radius: {filters.radius} miles</label>
              <Slider
                value={[filters.radius]}
                onValueChange={(value) => setFilters(prev => ({ ...prev, radius: value[0] }))}
                max={50}
                min={1}
                step={1}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={filters.showVerifiedOnly}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showVerifiedOnly: checked }))}
              />
              <label className="text-sm font-medium">Verified Only</label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      {isMapVisible && (
        <Card>
          <CardContent className="p-0">
            <div style={{ height: `${height}px` }} className="relative">
              <LeafletMapWrapper
                center={mapCenter}
                zoom={13}
                jobs={filteredJobs.map(job => ({
                  id: job.id,
                  title: job.title,
                  location: {
                    lat: job.location.lat,
                    lng: job.location.lng,
                    address: job.location.address
                  },
                  urgency: job.urgency,
                  price: job.price,
                  provider: {
                    name: job.provider.name,
                    rating: job.provider.rating,
                    avatar: job.provider.avatar
                  }
                }))}
                onJobSelect={handleJobClick}
                userLocation={userLocation}
                searchRadius={filters.radius}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Job Details */}
      {selectedJobLocal && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl">{selectedJobLocal.title}</CardTitle>
                <p className="text-muted-foreground mt-1">{selectedJobLocal.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  className={cn(
                    selectedJobLocal.urgency === 'urgent' && "bg-red-500",
                    selectedJobLocal.urgency === 'high' && "bg-orange-500",
                    selectedJobLocal.urgency === 'medium' && "bg-yellow-500",
                    selectedJobLocal.urgency === 'low' && "bg-green-500"
                  )}
                >
                  {selectedJobLocal.urgency} priority
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedJobLocal(null)}
                >
                  ✕
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedJobLocal.provider.avatar} />
                    <AvatarFallback>{selectedJobLocal.provider.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{selectedJobLocal.provider.name}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{selectedJobLocal.provider.rating}</span>
                      <span>•</span>
                      <span>{selectedJobLocal.provider.reviewCount} reviews</span>
                      {selectedJobLocal.provider.verified && (
                        <>
                          <span>•</span>
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Response time:</span>
                    <span>{selectedJobLocal.provider.responseTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion rate:</span>
                    <span>{selectedJobLocal.provider.completionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{Math.floor(selectedJobLocal.duration / 60)}h {selectedJobLocal.duration % 60}m</span>
                  </div>
                  {selectedJobLocal.distance && (
                    <div className="flex justify-between">
                      <span>Distance:</span>
                      <span>{selectedJobLocal.distance.toFixed(1)} miles</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-3xl font-bold text-green-600">
                  ${selectedJobLocal.price}
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Provider
                  </Button>
                  <Button variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default InteractiveGigMapV2;
