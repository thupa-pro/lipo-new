import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    service: "House Cleaning",
    rating: 4.9,
    reviews: 247,
    price: "$35/hr",
    location: "Downtown",
    distance: "1.2 miles",
    verified: true,
    responseTime: "Usually responds in 2 hours",
    completedJobs: 892,
    aiOptimized: true,
    specialty: "Eco-Friendly Cleaning",
    trustScore: 98,
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    service: "Handyman Services",
    rating: 4.8,
    reviews: 189,
    price: "$45/hr",
    location: "Midtown",
    distance: "2.1 miles",
    verified: true,
    responseTime: "Usually responds in 1 hour",
    completedJobs: 654,
    aiOptimized: true,
    specialty: "Smart Home Setup",
    trustScore: 96,
  },
  {
    id: 3,
    name: "Emma Thompson",
    service: "Pet Grooming",
    rating: 5.0,
    reviews: 312,
    price: "$60/session",
    location: "Uptown",
    distance: "3.4 miles",
    verified: true,
    responseTime: "Usually responds in 3 hours",
    completedJobs: 1205,
    aiOptimized: false,
    specialty: "Premium Pet Care",
    trustScore: 99,
  },
  {
    id: 4,
    name: "David Chen",
    service: "Personal Training",
    rating: 4.9,
    reviews: 428,
    price: "$75/session",
    location: "Central",
    distance: "1.8 miles",
    verified: true,
    responseTime: "Usually responds in 1 hour",
    completedJobs: 890,
    aiOptimized: true,
    specialty: "Strength & Conditioning",
    trustScore: 97,
  },
];

const categories = [
  { name: "Home Cleaning", count: "2.4K", trend: "+12%", popular: true },
  { name: "Handyman", count: "1.8K", trend: "+8%", popular: true },
  { name: "Pet Care", count: "0.9K", trend: "+15%", popular: false },
  { name: "Fitness", count: "1.2K", trend: "+22%", popular: true },
  { name: "Tutoring", count: "0.7K", trend: "+18%", popular: false },
  { name: "Tech Support", count: "0.5K", trend: "+25%", popular: false },
];

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden relative">
      {/* Animated Background - Same as Homepage */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(139,92,246,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_40%_60%,rgba(16,185,129,0.08),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 dark:bg-violet-400 rounded-full animate-pulse opacity-30 dark:opacity-40" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-emerald-400 dark:bg-blue-400 rounded-full animate-ping opacity-20 dark:opacity-30" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-purple-400 dark:bg-emerald-400 rounded-full animate-bounce opacity-15 dark:opacity-20" />
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-cyan-400 dark:bg-pink-400 rounded-full animate-pulse opacity-20 dark:opacity-30" />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-indigo-400 dark:bg-cyan-400 rounded-full animate-ping opacity-15 dark:opacity-25" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-6 group hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              2.4K+ Verified Professionals Available
            </span>
            <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none">
            <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
              Find Exceptional
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Local Talent
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover AI-matched, verified professionals who deliver
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
              {" "}
              outstanding results{" "}
            </span>
            right in your neighborhood.
          </p>
        </div>

        {/* Enhanced Search Interface */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur opacity-20 dark:opacity-30 group-hover:opacity-30 dark:group-hover:opacity-50 transition duration-1000" />
            <Card className="relative bg-white/90 dark:bg-white/10 backdrop-blur-xl border-blue-200/50 dark:border-white/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 dark:from-violet-500 dark:to-purple-500 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Search className="w-4 h-4 text-white" />
                    </div>
                    <Input
                      placeholder="What service do you need?"
                      className="pl-12 h-12 bg-transparent border-none outline-none text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 text-lg"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Enter your location"
                      className="pl-12 h-12 bg-transparent border-none outline-none text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 text-lg"
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl px-8 h-12 font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25">
                    Search Services
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Popular Categories
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-2xl p-4 hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <CardContent className="p-0 relative z-10 text-center">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">
                    {category.count} professionals
                  </p>
                  {category.popular && (
                    <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs">
                      Popular
                    </Badge>
                  )}
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {category.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Sort & Order
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
            >
              <Target className="w-4 h-4 mr-2" />
              AI Match
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl">
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl">
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Enhanced Provider Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {providers.map((provider) => (
            <Card
              key={provider.id}
              className="group relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-700 hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <CardContent className="p-8 relative z-10">
                <div className="flex items-start gap-6">
                  {/* Enhanced Avatar */}
                  <div className="relative">
                    <Avatar className="w-20 h-20 border-4 border-white dark:border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <AvatarImage
                        src={`/placeholder.svg?height=80&width=80`}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-emerald-600 dark:from-violet-600 dark:to-purple-600 text-white font-bold text-xl">
                        {provider.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {provider.verified && (
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-3 border-white dark:border-gray-800 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {provider.aiOptimized && (
                      <div className="absolute -top-1 -left-1 w-7 h-7 bg-blue-500 rounded-full border-3 border-white dark:border-gray-800 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-xl text-slate-800 dark:text-white">
                            {provider.name}
                          </h3>
                          {provider.verified && (
                            <Badge className="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-gray-300 font-medium mb-1">
                          {provider.service}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-gray-400">
                          {provider.specialty}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                          {provider.price}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-500 dark:text-gray-400">
                            Trust Score: {provider.trustScore}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                          <span className="font-semibold text-slate-800 dark:text-white">
                            {provider.rating}
                          </span>
                        </div>
                        <span className="text-slate-500 dark:text-gray-400 text-sm">
                          ({provider.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {provider.location} • {provider.distance}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-slate-600 dark:text-gray-300">
                          {provider.responseTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm text-slate-600 dark:text-gray-300">
                          {provider.completedJobs} completed jobs
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25">
                        Contact Provider
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Load More */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="rounded-2xl px-12 py-4 font-bold text-lg border-2 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 hover:border-blue-400 dark:hover:border-white/40 transition-all duration-500"
          >
            Load More Exceptional Providers
            <Zap className="w-5 h-5 ml-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
