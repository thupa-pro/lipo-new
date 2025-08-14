import { Metadata } from 'next';
import { InteractiveGigMapV2 } from '@/components/map/interactive-gig-map-v2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Zap, 
  Eye, 
  Users,
  Star,
  Clock,
  Shield
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Interactive Service Map | Loconomy - Find Local Services',
  description: 'Discover local services on our interactive map. Find nearby providers, compare prices, and book services with real-time location-based matching.',
  keywords: 'interactive map, local services, service providers, location-based, real-time matching',
};

export default function InteractiveMapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-full">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-700">Interactive Service Map</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
            Find Services Near You
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover local service providers on our interactive map. Filter by category, price, urgency, and distance 
            to find the perfect match for your needs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Real-time View</h3>
              <p className="text-sm text-muted-foreground">See available services and providers in real-time on the map</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Instant Matching</h3>
              <p className="text-sm text-muted-foreground">Get matched with nearby providers based on your location</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Verified Providers</h3>
              <p className="text-sm text-muted-foreground">All providers are verified with ratings and reviews</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Quick Response</h3>
              <p className="text-sm text-muted-foreground">Fast response times with instant messaging</p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center gap-3">
                <MapPin className="h-6 w-6 text-blue-500" />
                Interactive Service Map
                <Badge className="bg-green-500 text-white">Live</Badge>
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Urgent</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Low</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <InteractiveGigMapV2 height={600} />
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How the Interactive Map Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold">Search & Filter</h3>
                <p className="text-sm text-muted-foreground">
                  Use the search bar and filters to find exactly what you need. Filter by category, price range, urgency level, and distance.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold">Explore the Map</h3>
                <p className="text-sm text-muted-foreground">
                  View available services on the interactive map. Each marker shows the urgency level and clicking reveals detailed information.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold">Connect & Book</h3>
                <p className="text-sm text-muted-foreground">
                  Contact providers directly through the platform, view their profiles, ratings, and book services instantly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">15K+</div>
              <p className="text-sm text-muted-foreground">Active Services</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">4.9★</div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">Support</p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="text-center p-8 bg-gradient-to-br from-blue-50 to-green-50">
          <CardContent className="space-y-4">
            <h2 className="text-2xl font-bold">Ready to Find Local Services?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users who find and book local services through our interactive map. 
              Start exploring services in your area today.
            </p>
            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Verified Providers</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-600" />
                <span>Rated & Reviewed</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Quick Response</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
