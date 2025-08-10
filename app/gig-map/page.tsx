"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  List, 
  Grid,
  Filter,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Zap
} from "lucide-react";
// import { InteractiveGigMap } from "@/components/map/interactive-gig-map";
import { ProviderCard } from "@/components/browse/ProviderCard";

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
  };
  pricing: {
    amount: number;
    currency: string;
    type: 'fixed' | 'hourly';
  };
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  distance?: number;
  tags: string[];
}

export default function GigMapPage() {
  const [selectedJob, setSelectedJob] = useState<GigJob | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const stats = {
    totalJobs: 247,
    nearbyJobs: 18,
    avgPrice: 85,
    urgentJobs: 5,
  };

  const handleJobSelect = (job: GigJob) => {
    setSelectedJob(job);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Local Gig Map
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover real-time service opportunities in your area
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                onClick={() => setViewMode('map')}
                className="flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Map View
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                List View
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Jobs</p>
                    <p className="text-2xl font-bold">{stats.totalJobs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nearby Jobs</p>
                    <p className="text-2xl font-bold">{stats.nearbyJobs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Price</p>
                    <p className="text-2xl font-bold">${stats.avgPrice}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Urgent Jobs</p>
                    <p className="text-2xl font-bold">{stats.urgentJobs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map/List View */}
          <div className="lg:col-span-3">
            {viewMode === 'map' ? (
              <InteractiveGigMap
                onJobSelect={handleJobSelect}
                height="700px"
                className="w-full"
                showFilters={true}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Available Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16 text-muted-foreground">
                    <List className="w-16 h-16 mx-auto mb-4" />
                    <p>List view coming soon...</p>
                    <p className="text-sm mt-2">Use the map view to explore available gigs</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Hot Gigs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-500" />
                  Hot Gigs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">Emergency Plumbing</h4>
                    <Badge className="bg-red-500 text-xs">Urgent</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Burst pipe needs immediate repair
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold">$120/hr</span>
                    <span className="text-muted-foreground">0.8 mi</span>
                  </div>
                </div>

                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">Same-Day Cleaning</h4>
                    <Badge className="bg-orange-500 text-xs">High</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Last-minute cleaning for event
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold">$150</span>
                    <span className="text-muted-foreground">1.2 mi</span>
                  </div>
                </div>

                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">Pet Sitting</h4>
                    <Badge className="bg-yellow-500 text-xs">Medium</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Weekend pet care needed
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold">$45/day</span>
                    <span className="text-muted-foreground">2.1 mi</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trending Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">House Cleaning</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-12 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">75%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Handyman Services</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-10 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">65%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Pet Care</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-8 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">50%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Tutoring</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-6 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">40%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Set Location Alerts
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Save Search Filters
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
