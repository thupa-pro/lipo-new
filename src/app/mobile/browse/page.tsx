'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  Heart,
  MessageCircle,
  ArrowLeft,
  SlidersHorizontal,
  Grid3x3,
  List,
  Zap,
  CheckCircle,
  Users,
  TrendingUp,
} from 'lucide-react'

import { MobileBottomNav } from '@/components/ui/floating-fab'

interface Provider {
  id: string
  name: string
  category: string
  rating: number
  reviewCount: number
  distance: string
  price: string
  avatar: string
  isVerified: boolean
  isOnline: boolean
  responseTime: string
  completedJobs: number
}

const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'Maria Rodriguez',
    category: 'House Cleaning',
    rating: 4.9,
    reviewCount: 127,
    distance: '0.8 mi',
    price: '$25/hr',
    avatar: '/api/placeholder/avatar/female1',
    isVerified: true,
    isOnline: true,
    responseTime: '< 5 min',
    completedJobs: 89,
  },
  {
    id: '2',
    name: 'David Chen',
    category: 'Handyman',
    rating: 4.8,
    reviewCount: 94,
    distance: '1.2 mi',
    price: '$35/hr',
    avatar: '/api/placeholder/avatar/male1',
    isVerified: true,
    isOnline: false,
    responseTime: '< 15 min',
    completedJobs: 156,
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    category: 'Pet Care',
    rating: 5.0,
    reviewCount: 73,
    distance: '0.5 mi',
    price: '$20/hr',
    avatar: '/api/placeholder/avatar/female2',
    isVerified: true,
    isOnline: true,
    responseTime: '< 2 min',
    completedJobs: 67,
  },
  {
    id: '4',
    name: 'Alex Thompson',
    category: 'Tutoring',
    rating: 4.7,
    reviewCount: 112,
    distance: '2.1 mi',
    price: '$40/hr',
    avatar: '/api/placeholder/avatar/male2',
    isVerified: false,
    isOnline: true,
    responseTime: '< 10 min',
    completedJobs: 201,
  },
]

export default function MobileBrowsePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])

  const categories = [
    'All',
    'House Cleaning',
    'Handyman',
    'Pet Care',
    'Tutoring',
    'Beauty',
    'Fitness',
  ]

  const toggleFavorite = (providerId: string) => {
    setFavorites((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId]
    )
  }

  const filteredProviders = mockProviders.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'All' || provider.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/mobile">
              <Button size="sm" variant="ghost" className="text-white p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold text-white">Find Services</h1>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="text-white p-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services or providers..."
              className="pl-10 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-gray-400 rounded-xl h-11"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full ${
                  selectedCategory === category
                    ? 'bg-white text-purple-900'
                    : 'border-white/40 text-white hover:bg-white/20'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Filters Overlay */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-20 z-40 bg-white/10 backdrop-blur-md border-b border-white/20 p-4"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">Sort by:</span>
              <select className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1 text-sm">
                <option>Nearest</option>
                <option>Highest Rated</option>
                <option>Lowest Price</option>
                <option>Most Reviews</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">View:</span>
              <div className="flex bg-white/10 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="rounded-md"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="rounded-md"
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Header */}
      <div className="p-4 pt-2">
        <div className="flex justify-between items-center text-white text-sm mb-3">
          <span>{filteredProviders.length} providers found</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Within 5 miles
          </span>
        </div>
      </div>

      {/* Provider List */}
      <div className="px-4 pb-24">
        <div
          className={
            viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'
          }
        >
          {filteredProviders.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden">
                <CardContent
                  className={`p-3 ${viewMode === 'grid' ? 'text-center' : ''}`}
                >
                  <div
                    className={`flex ${viewMode === 'grid' ? 'flex-col items-center' : 'items-start gap-3'}`}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar
                        className={`${viewMode === 'grid' ? 'w-12 h-12 mb-2' : 'w-16 h-16'} border-2 border-white/40`}
                      >
                        <AvatarImage
                          src={provider.avatar}
                          alt={provider.name}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {provider.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      {provider.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                      )}
                      {provider.isVerified && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Provider Info */}
                    <div
                      className={`flex-1 ${viewMode === 'grid' ? 'text-center' : ''}`}
                    >
                      <div
                        className={`flex ${viewMode === 'grid' ? 'flex-col items-center' : 'justify-between items-start'} mb-1`}
                      >
                        <h3 className="font-semibold text-white text-sm">
                          {provider.name}
                        </h3>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleFavorite(provider.id)}
                          className="p-1 text-white hover:bg-white/20"
                        >
                          <Heart
                            className={`w-4 h-4 ${favorites.includes(provider.id) ? 'fill-red-500 text-red-500' : ''}`}
                          />
                        </Button>
                      </div>

                      <p className="text-gray-300 text-xs mb-2">
                        {provider.category}
                      </p>

                      <div
                        className={`flex ${viewMode === 'grid' ? 'flex-col gap-1' : 'justify-between items-center'} text-xs mb-2`}
                      >
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{provider.rating}</span>
                          <span className="text-gray-400">
                            ({provider.reviewCount})
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-300">
                          <MapPin className="w-3 h-3" />
                          <span>{provider.distance}</span>
                        </div>
                      </div>

                      <div
                        className={`flex ${viewMode === 'grid' ? 'flex-col gap-1' : 'justify-between items-center'} text-xs mb-3`}
                      >
                        <span className="text-white font-semibold">
                          {provider.price}
                        </span>
                        <span className="text-green-400">
                          {provider.responseTime}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs h-8"
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Message
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/40 text-white hover:bg-white/20 text-xs h-8"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav currentPath="/mobile/browse" />

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="fixed bottom-20 right-4 z-50"
      >
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg"
        >
          <Filter className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  )
}
