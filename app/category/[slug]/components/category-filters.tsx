'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, Star, DollarSign, Clock, X } from 'lucide-react';

interface CategoryFiltersProps {
  currentSort: string;
  currentPriceMin: number;
  currentPriceMax: number;
  currentRating: number;
}

export function CategoryFilters({ 
  currentSort, 
  currentPriceMin, 
  currentPriceMax, 
  currentRating 
}: CategoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [sortBy, setSortBy] = useState(currentSort);
  const [priceRange, setPriceRange] = useState<[number, number]>([currentPriceMin, currentPriceMax]);
  const [minRating, setMinRating] = useState(currentRating);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    if (sortBy !== 'rating') params.set('sort', sortBy);
    else params.delete('sort');
    
    if (priceRange[0] > 0) params.set('price_min', priceRange[0].toString());
    else params.delete('price_min');
    
    if (priceRange[1] < 200) params.set('price_max', priceRange[1].toString());
    else params.delete('price_max');
    
    if (minRating > 0) params.set('rating', minRating.toString());
    else params.delete('rating');
    
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const clearFilters = () => {
    setSortBy('rating');
    setPriceRange([0, 200]);
    setMinRating(0);
    router.push(pathname);
  };

  const hasActiveFilters = sortBy !== 'rating' || priceRange[0] > 0 || priceRange[1] < 200 || minRating > 0;

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Sort & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Sort by</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="response_time">Fastest Response</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={applyFilters} className="w-full btn-glow">
            Apply Filters
          </Button>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Price Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              max={200}
              min={0}
              step={10}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}/hr</span>
            <span>${priceRange[1]}/hr</span>
          </div>
        </CardContent>
      </Card>

      {/* Rating Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5" />
            Minimum Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[4.5, 4.0, 3.5, 3.0, 0].map((rating) => (
              <button
                key={rating}
                onClick={() => setMinRating(rating)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  minRating === rating 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                {rating === 0 ? 'Any Rating' : (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{rating}+ stars</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Response Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Response Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { label: 'Within 1 hour', value: '1h' },
              { label: 'Within 2 hours', value: '2h' },
              { label: 'Within 4 hours', value: '4h' },
              { label: 'Same day', value: '24h' },
              { label: 'Any time', value: 'any' }
            ].map((option) => (
              <button
                key={option.value}
                className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              'Available now',
              'Available today',
              'Available this week',
              'Available this month'
            ].map((option) => (
              <button
                key={option}
                className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              'Verified provider',
              'Licensed & insured',
              'Background checked',
              'Same-day service',
              'Emergency service',
              'Free estimates'
            ].map((feature) => (
              <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">{feature}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Active Filters
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sortBy !== 'rating' && (
                <Badge variant="secondary">
                  Sort: {sortBy === 'price_low' ? 'Price Low' : 
                        sortBy === 'price_high' ? 'Price High' : 
                        sortBy === 'response_time' ? 'Fast Response' : sortBy}
                </Badge>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 200) && (
                <Badge variant="secondary">
                  Price: ${priceRange[0]}-${priceRange[1]}
                </Badge>
              )}
              {minRating > 0 && (
                <Badge variant="secondary">
                  Rating: {minRating}+ stars
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
