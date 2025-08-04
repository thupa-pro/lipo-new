"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModernFooter } from "@/components/modern-footer";
import { CommandPaletteHint } from "@/components/ui/command-palette-hint";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
    hourlyRate: 45,
    tags: ["Licensed", "Insured", "Emergency"],
    verified: true,
    responseTime: "1 hour",
    completedJobs: 156,
    avatar: "MR",
    specialty: "Electrical Work",
    badge: "Top Rated"
  },
  {
    id: 3,
    name: "Jessica Chen",
    profession: "Personal Trainer",
    location: "0.9 miles away",
    rating: 5.0,
    reviews: 203,
    hourlyRate: 65,
    tags: ["Certified", "Nutrition", "Home Visits"],
    verified: true,
    responseTime: "30 mins",
    completedJobs: 320,
    avatar: "JC",
    specialty: "Weight Loss",
    badge: "Expert"
  }
];

const categories = [
  { name: "All Services", count: "2,400+", active: true },
  { name: "Home Services", count: "850+", active: false },
  { name: "Wellness", count: "320+", active: false },
  { name: "Education", count: "290+", active: false },
  { name: "Tech Support", count: "180+", active: false },
  { name: "Automotive", count: "140+", active: false },
];

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
      
      {/* Animated Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-[200px] animate-pulse"></div>
      <div className="absolute bottom-[-30%] right-[-20%] w-[900px] h-[900px] bg-cyan-700/30 rounded-full blur-[200px] animate-pulse animation-delay-4000"></div>
      <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-fuchsia-700/20 rounded-full blur-[150px] animate-pulse animation-delay-2000"></div>

      {/* Header */}
      <header className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 bg-glass/80 border-b border-white/10 sticky top-0">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <span className="material-icons text-purple-400 text-4xl">hub</span>
            <span className="text-3xl font-bold text-white tracking-wider">Loconomy</span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-300">
            <Link href="/browse" className="text-white font-semibold">Find Services</Link>
            <Link href="/how-it-works" className="hover:text-white transition-colors duration-300">How It Works</Link>
            <Link href="/become-provider" className="hover:text-white transition-colors duration-300">Become a Provider</Link>
            <Link href="/blog" className="hover:text-white transition-colors duration-300">Blog</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <span className="material-icons text-gray-300">notifications_none</span>
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <span className="material-icons text-gray-300">person_outline</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Search Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
              <span className="gradient-text">Find Local</span>
              <br />
              <span className="text-white">Service Professionals</span>
            </h1>
            <p className="text-lg text-[var(--mid-gray)] max-w-2xl mx-auto">
              Browse thousands of verified professionals in your area. From home repairs to personal training.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-glass rounded-3xl p-6 card-glow max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center bg-black/20 p-3 rounded-full shadow-inner shadow-black/30 border border-white/10">
              <div className="flex-grow w-full flex items-center pl-4 pr-2">
                <span className="material-icons text-[var(--mid-gray)] mr-3">work_outline</span>
                <input 
                  className="bg-transparent w-full text-white placeholder-[var(--mid-gray)] focus:outline-none py-3 text-lg" 
                  placeholder="What service do you need?" 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-auto flex items-center pl-4 pr-2 border-t md:border-t-0 md:border-l border-white/10 mt-3 md:mt-0 pt-3 md:pt-0">
                <span className="material-icons text-[var(--mid-gray)] mr-3">location_on</span>
                <input 
                  className="bg-transparent w-full text-white placeholder-[var(--mid-gray)] focus:outline-none py-3 text-lg" 
                  placeholder="Your Location" 
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
              </div>
              <button className="w-full mt-4 md:mt-0 md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-semibold rounded-full btn-glow transition-transform transform hover:scale-105 flex-shrink-0">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Filters and Categories */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex flex-wrap gap-3 mb-4 lg:mb-0">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category.active
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white btn-glow'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-transparent hover:border-purple-400/50'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 text-xs opacity-75">{category.count}</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-white/10 text-gray-300 px-4 py-2 rounded-full hover:bg-white/20 transition-colors">
                <span className="material-icons text-sm">tune</span>
                <span>Filters</span>
              </button>
              
              <div className="flex bg-white/10 rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="material-icons text-sm">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="material-icons text-sm">view_list</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              2,400+ Professionals Available
            </h2>
            <div className="flex items-center space-x-4">
              <select className="bg-glass border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Sort by: Best Match</option>
                <option>Highest Rated</option>
                <option>Lowest Price</option>
                <option>Nearest</option>
              </select>
            </div>
          </div>

          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {providers.map((provider) => (
              <div key={provider.id} className="bg-glass rounded-3xl p-6 card-glow overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Provider Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{provider.avatar}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{provider.name}</h3>
                        <p className="text-[var(--mid-gray)] text-sm">{provider.profession}</p>
                      </div>
                    </div>
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                      <span className="material-icons text-gray-300">favorite_border</span>
                    </button>
                  </div>

                  {/* Badge and Verification */}
                  <div className="flex items-center space-x-2 mb-3">
                    {provider.verified && (
                      <div className="flex items-center space-x-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                        <span className="material-icons text-xs">verified</span>
                        <span>Verified</span>
                      </div>
                    )}
                    <div className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">
                      {provider.badge}
                    </div>
                  </div>

                  {/* Rating and Stats */}
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <span className="material-icons text-yellow-400 text-sm">star</span>
                      <span className="text-white font-semibold">{provider.rating}</span>
                      <span className="text-[var(--mid-gray)] text-sm">({provider.reviews})</span>
                    </div>
                    <div className="text-[var(--mid-gray)] text-sm">
                      {provider.completedJobs} jobs completed
                    </div>
                  </div>

                  {/* Location and Response Time */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1 text-[var(--mid-gray)] text-sm">
                      <span className="material-icons text-xs">location_on</span>
                      <span>{provider.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[var(--mid-gray)] text-sm">
                      <span className="material-icons text-xs">schedule</span>
                      <span>Responds in {provider.responseTime}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {provider.tags.map((tag) => (
                      <span key={tag} className="bg-white/10 text-gray-300 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white">${provider.hourlyRate}</div>
                      <div className="text-[var(--mid-gray)] text-sm">per hour</div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors text-sm">
                        Message
                      </button>
                      <button className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-4 py-2 rounded-full btn-glow transition-transform transform hover:scale-105 text-sm">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-glass text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-purple-400/50">
              Load More Professionals
            </button>
          </div>
        </section>
      </main>

      <ModernFooter />
      <CommandPaletteHint />
    </div>
  );
}
