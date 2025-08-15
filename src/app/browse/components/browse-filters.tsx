'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ResponsiveCard,
  ResponsiveCardContent,
  ResponsiveCardHeader,
  ResponsiveCardTitle,
} from '@/components/ui/responsive-card'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, Filter, X } from 'lucide-react'

interface BrowseFiltersProps {
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
  currentSearch: string
  currentLocation: string
  currentCategory: string
}

export function BrowseFilters({
  categories,
  currentSearch,
  currentLocation,
  currentCategory,
}: BrowseFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(currentSearch)
  const [locationQuery, setLocationQuery] = useState(currentLocation)
  const [selectedCategory, setSelectedCategory] = useState(currentCategory)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    if (locationQuery.trim()) params.set('location', locationQuery.trim())
    if (selectedCategory) params.set('category', selectedCategory)

    router.push(`/browse${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setLocationQuery('')
    setSelectedCategory('')
    setPriceRange([0, 200])
    router.push('/browse')
  }

  const hasActiveFilters = searchQuery || locationQuery || selectedCategory

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Search Filters */}
      <ResponsiveCard variant="elevated" padding="default">
        <ResponsiveCardHeader>
          <ResponsiveCardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Location
          </ResponsiveCardTitle>
        </ResponsiveCardHeader>
        <ResponsiveCardContent className="space-y-4">
          <div>
            <label className="text-responsive-sm font-medium mb-2 block">
              Service
            </label>
            <Input
              placeholder="What service do you need?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full touch-target"
            />
          </div>

          <div>
            <label className="text-responsive-sm font-medium mb-2 block">
              Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Your location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="pl-10 w-full touch-target"
              />
            </div>
          </div>

          <ResponsiveButton
            onClick={applyFilters}
            className="w-full btn-glow"
            touchOptimized
          >
            Apply Filters
          </ResponsiveButton>
        </ResponsiveCardContent>
      </ResponsiveCard>

      {/* Categories */}
      <ResponsiveCard variant="elevated" padding="default">
        <ResponsiveCardHeader>
          <ResponsiveCardTitle>Categories</ResponsiveCardTitle>
        </ResponsiveCardHeader>
        <ResponsiveCardContent>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`w-full text-left px-3 py-2 rounded-md text-responsive-sm transition-colors touch-target ${
                !selectedCategory
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted active:bg-muted/80'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`w-full text-left px-3 py-2 rounded-md text-responsive-sm transition-colors touch-target ${
                  selectedCategory === category.slug
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted active:bg-muted/80'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </ResponsiveCardContent>
      </ResponsiveCard>

      {/* Price Range */}
      <ResponsiveCard variant="elevated" padding="default">
        <ResponsiveCardHeader>
          <ResponsiveCardTitle>Price Range</ResponsiveCardTitle>
        </ResponsiveCardHeader>
        <ResponsiveCardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                }
                className="w-full touch-target"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    parseInt(e.target.value) || 200,
                  ])
                }
                className="w-full touch-target"
              />
            </div>
            <p className="text-responsive-sm text-muted-foreground">
              ${priceRange[0]} - ${priceRange[1]} per hour
            </p>
          </div>
        </ResponsiveCardContent>
      </ResponsiveCard>

      {/* Rating Filter */}
      <ResponsiveCard variant="elevated" padding="default">
        <ResponsiveCardHeader>
          <ResponsiveCardTitle>Minimum Rating</ResponsiveCardTitle>
        </ResponsiveCardHeader>
        <ResponsiveCardContent>
          <div className="space-y-2">
            {[4.5, 4.0, 3.5, 3.0].map((rating) => (
              <button
                key={rating}
                className="w-full text-left px-3 py-2 rounded-md text-responsive-sm hover:bg-muted active:bg-muted/80 transition-colors touch-target"
              >
                ⭐ {rating}+ stars
              </button>
            ))}
          </div>
        </ResponsiveCardContent>
      </ResponsiveCard>

      {/* Active Filters */}
      {hasActiveFilters && (
        <ResponsiveCard variant="elevated" padding="default">
          <ResponsiveCardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <ResponsiveCardTitle>Active Filters</ResponsiveCardTitle>
              <ResponsiveButton
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground self-start sm:self-auto"
                touchOptimized
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </ResponsiveButton>
            </div>
          </ResponsiveCardHeader>
          <ResponsiveCardContent>
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="text-responsive-sm">
                  Service: {searchQuery}
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 hover:text-foreground touch-target"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {locationQuery && (
                <Badge variant="secondary" className="text-responsive-sm">
                  Location: {locationQuery}
                  <button
                    onClick={() => setLocationQuery('')}
                    className="ml-1 hover:text-foreground touch-target"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="text-responsive-sm">
                  Category:{' '}
                  {categories.find((c) => c.slug === selectedCategory)?.name}
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="ml-1 hover:text-foreground touch-target"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          </ResponsiveCardContent>
        </ResponsiveCard>
      )}
    </div>
  )
}
