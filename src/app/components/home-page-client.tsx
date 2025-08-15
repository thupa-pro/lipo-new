'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, Star, Clock, ArrowRight, Sparkles } from 'lucide-react'

export function HomePageClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const popularServices = [
    {
      name: 'House Cleaning',
      rating: 4.9,
      providers: 1247,
      avgPrice: '$89',
      nextAvailable: '2 hours',
      trend: '+15%',
    },
    {
      name: 'Plumbing Repair',
      rating: 4.8,
      providers: 892,
      avgPrice: '$124',
      nextAvailable: '45 min',
      trend: '+8%',
    },
    {
      name: 'Personal Training',
      rating: 4.9,
      providers: 634,
      avgPrice: '$67',
      nextAvailable: '1 hour',
      trend: '+23%',
    },
  ]

  const aiSuggestions = [
    'I need help with my leaky faucet',
    'Looking for a personal trainer near me',
    'Weekly house cleaning service',
    'Emergency plumber needed',
    'Dog walking service',
    'Home security installation',
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      {/* AI-Powered Search */}
      <div className="relative">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tell me what you need... (AI will understand)"
              className="pl-10 md:pl-12 h-12 md:h-14 text-base md:text-lg bg-white/90 backdrop-blur-sm border-white/40 focus:border-purple-400 focus:ring-purple-400/30 rounded-xl touch-target"
            />
          </div>
          <div className="relative md:w-48">
            <MapPin className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <Input
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              placeholder="Location"
              className="pl-10 md:pl-12 h-12 md:h-14 w-full bg-white/90 backdrop-blur-sm border-white/40 focus:border-purple-400 focus:ring-purple-400/30 rounded-xl touch-target"
            />
          </div>
          <Button
            size="lg"
            className="h-12 md:h-14 px-6 md:px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl group touch-target hover-touch"
          >
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:animate-pulse" />
            Search
          </Button>
        </div>

        {/* AI Suggestions */}
        {searchQuery.length === 0 && (
          <div className="mt-3 md:mt-4 flex flex-wrap gap-2">
            <span className="text-xs md:text-sm text-gray-600 font-medium">
              Try:
            </span>
            {aiSuggestions.slice(0, 3).map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery(suggestion)}
                className="text-xs bg-white/60 backdrop-blur-sm border-white/40 hover:bg-white/80 rounded-lg touch-target hover-touch"
              >
                "{suggestion}"
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Popular Services */}
      <div>
        <h3 className="fluid-text-lg font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
          Popular Right Now
        </h3>
        <div className="grid-responsive-1-2-3">
          {popularServices.map((service, index) => (
            <Card
              key={index}
              className="bg-white/90 backdrop-blur-sm border-white/40 hover:bg-white/95 transition-all duration-300 group hover-touch"
            >
              <CardContent className="p-3 md:p-4">
                <div className="flex justify-between items-start mb-2 md:mb-3">
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                    {service.name}
                  </h4>
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    {service.trend}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{service.rating}</span>
                    <span>•</span>
                    <span>{service.providers} providers</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">
                      {service.avgPrice}
                    </span>
                    <div className="flex items-center gap-1 text-green-600">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{service.nextAvailable}</span>
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full mt-2 md:mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 group-hover:scale-[1.02] transition-transform touch-target hover-touch text-xs md:text-sm"
                >
                  Book Now
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Assistance */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>AI Assistant is analyzing your needs...</span>
        </div>
      </div>
    </div>
  )
}
