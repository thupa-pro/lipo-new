import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModernNavigation } from "@/components/modern-navigation";
import { ModernFooter } from "@/components/modern-footer";
import {
  Search,
  MapPin,
  Star,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  Shield,
  Clock,
  Award,
  Sparkles,
  Heart,
  ChevronRight,
  Zap,
  Target,
  Eye,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const providers = [
  {
    id: 1,
    name: "Sarah Mitchell",
    profession: "House Cleaning Specialist",
    location: "2.3 miles away",
    rating: 4.9,
    reviews: 127,
    hourlyRate: 35,
    tags: ["Eco-Friendly", "Pet-Safe", "Same-Day"],
    verified: true,
    responseTime: "2 hours",
    completedJobs: 245,
    avatar: "SM",
    specialty: "Deep Cleaning",
    badge: "Elite Provider"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    profession: "Handyman & Repairs",
    location: "1.8 miles away",
    rating: 4.8,
    reviews: 89,
    hourlyRate: 65,
    tags: ["Licensed", "Insured", "Emergency"],
    verified: true,
    responseTime: "1 hour",
    completedJobs: 156,
    avatar: "MR",
    specialty: "Electrical & Plumbing",
    badge: "Trusted Pro"
  },
  {
    id: 3,
    name: "Emma Chen",
    profession: "Personal Trainer",
    location: "0.9 miles away",
    rating: 5.0,
    reviews: 92,
    hourlyRate: 75,
    tags: ["Certified", "Nutrition", "Home-Visits"],
    verified: true,
    responseTime: "30 min",
    completedJobs: 189,
    avatar: "EC",
    specialty: "Strength & Conditioning",
    badge: "Top Rated"
  },
  {
    id: 4,
    name: "David Thompson",
    profession: "Math Tutor",
    location: "3.1 miles away",
    rating: 4.9,
    reviews: 156,
    hourlyRate: 45,
    tags: ["PhD", "Online/In-Person", "All Ages"],
    verified: true,
    responseTime: "45 min",
    completedJobs: 298,
    avatar: "DT",
    specialty: "Calculus & Statistics",
    badge: "Expert"
  }
];

export default function BrowsePage() {
  const user = {
    name: "John Doe",
    email: "john@example.com"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stratosphere via-cirrus to-white dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300">
      {/* Neural Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, hsl(var(--neural-500)) 2px, transparent 0),
                           radial-gradient(circle at 75px 75px, hsl(var(--quantum-500)) 1px, transparent 0)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <ModernNavigation currentPath="/browse" user={user} />
      
      <div className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass mb-6 group hover:bg-white/10 transition-all duration-500">
              <div className="w-2 h-2 bg-trust-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-trust-700 dark:text-trust-300">
                2.4K+ Verified Professionals Available
              </span>
              <Sparkles className="w-4 h-4 text-trust-500 dark:text-trust-400" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-none">
              <span className="text-gradient-neural">
                Find Exceptional
              </span>
              <br />
              <span className="text-gradient-quantum">
                Local Professionals
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover AI-matched, verified professionals who deliver
              <span className="text-gradient-trust font-semibold">
                {" "}outstanding results{" "}
              </span>
              right in your neighborhood.
            </p>
          </div>

          {/* Search & Filter Section */}
          <div className="glass-strong rounded-4xl p-8 mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-neural-400 w-5 h-5" />
                <Input 
                  placeholder="Search for services, professionals, or skills..."
                  variant="glass"
                  className="pl-14 py-4 text-lg"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="glass">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </Button>
                <Button variant="outline" className="glass">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button className="bg-gradient-neural text-white hover:shadow-glow-neural">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card variant="glass" className="sticky top-6">
                <CardHeader>
                  <CardTitle variant="gradient-neural">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Service Type</h4>
                    <div className="space-y-2">
                      {["Home Services", "Tech Support", "Tutoring", "Fitness", "Automotive"].map((service) => (
                        <label key={service} className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Price Range</h4>
                    <div className="space-y-2">
                      {["$20-40/hr", "$40-60/hr", "$60-80/hr", "$80+/hr"].map((range) => (
                        <label key={range} className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Distance</h4>
                    <div className="space-y-2">
                      {["Within 1 mile", "Within 5 miles", "Within 10 miles", "Within 25 miles"].map((distance) => (
                        <label key={distance} className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{distance}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-quantum text-white hover:shadow-glow-quantum">
                    Apply Filters
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Provider Cards */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gradient-neural">Available Professionals</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="glass">
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="glass">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {providers.map((provider) => (
                  <Card key={provider.id} variant="glass" className="group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-neural rounded-2xl flex items-center justify-center">
                              <span className="text-xl font-bold text-white">{provider.avatar}</span>
                            </div>
                            {provider.verified && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-trust rounded-full flex items-center justify-center">
                                <Shield className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg">{provider.name}</h3>
                              <Badge variant="outline" className="text-xs bg-gradient-plasma text-white border-0">
                                {provider.badge}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground font-medium">{provider.profession}</p>
                            <p className="text-sm text-neural-600">{provider.specialty}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-bold">{provider.rating}</span>
                          <span className="text-muted-foreground text-sm">({provider.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="w-3 h-3 mr-1" />
                          {provider.location}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {provider.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-quantum-500" />
                          <span>Responds in {provider.responseTime}</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="w-4 h-4 mr-2 text-trust-500" />
                          <span>{provider.completedJobs} jobs completed</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <span className="text-2xl font-bold text-gradient-plasma">${provider.hourlyRate}</span>
                          <span className="text-muted-foreground">/hr</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="glass">
                            Message
                          </Button>
                          <Button size="sm" className="bg-gradient-neural text-white hover:shadow-glow-neural">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="glass">
                  Load More Professionals
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModernFooter />
    </div>
  );
}
