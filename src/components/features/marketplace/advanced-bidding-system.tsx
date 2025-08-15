'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  Zap, 
  Shield, 
  Trophy,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Gavel,
  Timer,
  Star,
  Eye,
  Heart,
  MessageCircle,
  Bell,
  Calendar,
  MapPin,
  Filter,
  BarChart3,
  TrendingDown,
  Sparkles,
  Crown,
  Award,
  Lock,
  Unlock,
  RefreshCw,
  ChevronRight,
  Play,
  Pause,
  Settings
} from 'lucide-react'

interface Bid {
  id: string
  providerId: string
  providerName: string
  providerRating: number
  providerImage?: string
  amount: number
  proposedStartDate: Date
  estimatedDuration: string
  message: string
  timestamp: Date
  status: 'active' | 'winning' | 'outbid' | 'accepted' | 'declined'
  confidence: number
  specialOffers?: string[]
  urgencyLevel: 'low' | 'medium' | 'high'
  professionalLevel: 'beginner' | 'intermediate' | 'expert' | 'master'
}

interface AuctionJob {
  id: string
  title: string
  description: string
  category: string
  location: string
  budget: {
    min: number
    max: number
    currency: string
  }
  timeline: {
    startDate: Date
    endDate: Date
    duration: string
  }
  requirements: string[]
  preferredSkills: string[]
  auctionSettings: {
    type: 'open' | 'reverse' | 'sealed' | 'dutch'
    startPrice?: number
    reservePrice?: number
    bidIncrement: number
    autoExtend: boolean
    buyNowPrice?: number
  }
  currentStatus: 'pending' | 'active' | 'ending_soon' | 'completed' | 'cancelled'
  metrics: {
    totalBids: number
    uniqueBidders: number
    averageBid: number
    currentWinningBid?: number
    priceReduction: number
  }
  timeRemaining: number
  urgency: 'low' | 'medium' | 'high' | 'critical'
  clientRating: number
  isSponsored: boolean
  featuredLevel?: 'standard' | 'premium' | 'enterprise'
}

interface MarketplaceBiddingProps {
  job: AuctionJob
  userId: string
  userType: 'client' | 'provider'
}

export function AdvancedBiddingSystem({ job, userId, userType }: MarketplaceBiddingProps) {
  const [bids, setBids] = useState<Bid[]>([])
  const [currentBid, setCurrentBid] = useState('')
  const [bidMessage, setBidMessage] = useState('')
  const [selectedDuration, setSelectedDuration] = useState('1-3 days')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [watchingJob, setWatchingJob] = useState(false)
  const [showBidHistory, setShowBidHistory] = useState(false)
  const [priceAlert, setPriceAlert] = useState<number | null>(null)
  const [autoResearch, setAutoResearch] = useState(false)
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([])

  // Real-time bid updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new bids arriving
      if (Math.random() < 0.3 && job.currentStatus === 'active') {
        const newBid: Bid = {
          id: `bid-${Date.now()}`,
          providerId: `provider-${Math.floor(Math.random() * 1000)}`,
          providerName: ['Sarah Chen', 'Marcus Rodriguez', 'Emily Watson', 'David Kim', 'Lisa Thompson'][Math.floor(Math.random() * 5)],
          providerRating: 4.0 + Math.random() * 1.0,
          amount: job.budget.min + Math.random() * (job.budget.max - job.budget.min),
          proposedStartDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
          estimatedDuration: ['1-2 days', '3-5 days', '1 week', '2 weeks'][Math.floor(Math.random() * 4)],
          message: 'Professional service with guaranteed satisfaction. I have extensive experience in this area.',
          timestamp: new Date(),
          status: 'active',
          confidence: 0.7 + Math.random() * 0.3,
          urgencyLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          professionalLevel: ['intermediate', 'expert', 'master'][Math.floor(Math.random() * 3)] as 'intermediate' | 'expert' | 'master'
        }
        setBids(prev => [newBid, ...prev].slice(0, 20))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [job])

  // Smart pricing suggestions
  useEffect(() => {
    const suggestions = [
      `Market average for ${job.category}: $${Math.round(job.metrics.averageBid * 0.9)}-$${Math.round(job.metrics.averageBid * 1.1)}`,
      `Competitive price range: $${Math.round(job.budget.min * 1.1)}-$${Math.round(job.budget.max * 0.9)}`,
      `Premium providers typically charge: $${Math.round(job.metrics.averageBid * 1.2)}-$${Math.round(job.metrics.averageBid * 1.4)}`,
      `Quick completion bonus: +15% for 48hr delivery`,
      `Bulk discount opportunity: -10% for multiple services`
    ]
    setSmartSuggestions(suggestions)
  }, [job])

  const handleSubmitBid = useCallback(async () => {
    if (!currentBid || isSubmitting) return

    setIsSubmitting(true)

    try {
      const newBid: Bid = {
        id: `bid-${Date.now()}`,
        providerId: userId,
        providerName: 'You',
        providerRating: 4.8,
        amount: parseFloat(currentBid),
        proposedStartDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        estimatedDuration: selectedDuration,
        message: bidMessage || 'Professional service with quality guarantee',
        timestamp: new Date(),
        status: 'active',
        confidence: 0.95,
        urgencyLevel: 'medium',
        professionalLevel: 'expert'
      }

      setBids(prev => [newBid, ...prev])
      setCurrentBid('')
      setBidMessage('')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      console.error('Failed to submit bid:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [currentBid, selectedDuration, bidMessage, userId])

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-green-600 bg-green-50 border-green-200'
    }
  }

  const getProfessionalBadge = (level: string) => {
    switch (level) {
      case 'master': return { icon: Crown, color: 'text-purple-600 bg-purple-100' }
      case 'expert': return { icon: Award, color: 'text-blue-600 bg-blue-100' }
      case 'intermediate': return { icon: Star, color: 'text-green-600 bg-green-100' }
      default: return { icon: Users, color: 'text-gray-600 bg-gray-100' }
    }
  }

  const winningBid = useMemo(() => {
    return bids.sort((a, b) => {
      if (job.auctionSettings.type === 'reverse') {
        return a.amount - b.amount // Lowest wins in reverse auction
      }
      return b.amount - a.amount // Highest wins in regular auction
    })[0]
  }, [bids, job.auctionSettings.type])

  const isWinning = winningBid?.providerId === userId

  return (
    <div className="space-y-6">
      {/* Auction Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-2 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {job.title}
                </h2>
                {job.isSponsored && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Sponsored
                  </Badge>
                )}
                {job.featuredLevel && (
                  <Badge variant="outline" className="border-purple-300 text-purple-700">
                    {job.featuredLevel}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {job.timeline.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {job.clientRating}/5 Client Rating
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">{job.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {job.preferredSkills.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-right space-y-2">
              <div className={`p-3 rounded-lg border ${getUrgencyColor(job.urgency)}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Timer className="h-4 w-4" />
                  <span className="font-semibold text-sm">Time Left</span>
                </div>
                <div className="text-2xl font-bold">
                  {formatTimeRemaining(job.timeRemaining)}
                </div>
                <div className="text-xs opacity-75">
                  {job.urgency} priority
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWatchingJob(!watchingJob)}
                className={watchingJob ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}
              >
                {watchingJob ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Watching
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-2" />
                    Watch
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Budget & Auction Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">Budget Range</div>
              <div className="text-lg font-bold text-green-600">
                ${job.budget.min.toLocaleString()} - ${job.budget.max.toLocaleString()}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Bids</div>
              <div className="text-lg font-bold text-blue-600">
                {job.metrics.totalBids}
              </div>
              <div className="text-xs text-gray-500">
                {job.metrics.uniqueBidders} bidders
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Bid</div>
              <div className="text-lg font-bold text-purple-600">
                ${job.metrics.averageBid.toLocaleString()}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {job.auctionSettings.type === 'reverse' ? 'Lowest Bid' : 'Highest Bid'}
              </div>
              <div className="text-lg font-bold text-orange-600">
                {winningBid ? `$${winningBid.amount.toLocaleString()}` : 'No bids yet'}
              </div>
              {job.metrics.priceReduction > 0 && (
                <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  {job.metrics.priceReduction}% saved
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bidding Interface */}
        <div className="lg:col-span-2 space-y-6">
          
          {userType === 'provider' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-blue-600" />
                  Place Your Bid
                  {isWinning && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <Trophy className="h-3 w-3 mr-1" />
                      Winning
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Smart Pricing Suggestions */}
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800 dark:text-blue-200">Smart Pricing Insights</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {smartSuggestions.slice(0, 3).map((suggestion, index) => (
                      <div key={index} className="text-blue-700 dark:text-blue-300">
                        • {suggestion}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bid Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Bid Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="Enter your bid"
                      value={currentBid}
                      onChange={(e) => setCurrentBid(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {currentBid && (
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {parseFloat(currentBid) > job.metrics.averageBid ? (
                        <span className="text-orange-600">Above market average</span>
                      ) : (
                        <span className="text-green-600">Competitive pricing</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Duration Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estimated Duration</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['1-2 days', '3-5 days', '1 week', '2 weeks'].map((duration) => (
                      <Button
                        key={duration}
                        variant={selectedDuration === duration ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedDuration(duration)}
                        className="text-xs"
                      >
                        {duration}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Bid Message */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message to Client</label>
                  <textarea
                    placeholder="Describe your approach and why you're the best choice..."
                    value={bidMessage}
                    onChange={(e) => setBidMessage(e.target.value)}
                    className="w-full p-3 border rounded-lg resize-none h-20 text-sm"
                  />
                </div>

                {/* Auto-bid Options */}
                <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoResearch}
                      onChange={(e) => setAutoResearch(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Auto-research competitors</span>
                  </label>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-sm">Price alert:</label>
                    <Input
                      type="number"
                      placeholder="Alert price"
                      value={priceAlert || ''}
                      onChange={(e) => setPriceAlert(parseFloat(e.target.value) || null)}
                      className="w-24 h-8 text-xs"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSubmitBid}
                  disabled={!currentBid || isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Gavel className="h-4 w-4 mr-2" />
                      Submit Bid
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Current Bids */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Live Bidding Activity
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="animate-pulse">
                    <Activity className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBidHistory(!showBidHistory)}
                  >
                    {showBidHistory ? 'Current' : 'History'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {bids.slice(0, showBidHistory ? 50 : 10).map((bid, index) => {
                  const isCurrentWinner = bid.id === winningBid?.id
                  const professionalBadge = getProfessionalBadge(bid.professionalLevel)
                  const ProfessionalIcon = professionalBadge.icon
                  
                  return (
                    <div key={bid.id} className={`p-4 rounded-lg border transition-all ${
                      isCurrentWinner 
                        ? 'bg-green-50 border-green-300 shadow-lg dark:bg-green-950/30 dark:border-green-800' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={bid.providerImage} />
                            <AvatarFallback>{bid.providerName.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{bid.providerName}</span>
                              <div className={`p-1 rounded-full ${professionalBadge.color}`}>
                                <ProfessionalIcon className="h-3 w-3" />
                              </div>
                              {isCurrentWinner && (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                  <Trophy className="h-3 w-3 mr-1" />
                                  Leading
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                {bid.providerRating.toFixed(1)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {bid.estimatedDuration}
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {Math.round(bid.confidence * 100)}% confidence
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            ${bid.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {bid.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      
                      {bid.message && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          {bid.message}
                        </p>
                      )}
                      
                      {bid.specialOffers && bid.specialOffers.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {bid.specialOffers.map((offer, i) => (
                            <Badge key={i} variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                              {offer}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
                
                {bids.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Gavel className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No bids yet. Be the first to bid!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Auction Details & Controls */}
        <div className="space-y-6">
          
          {/* Auction Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                Auction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Auction Type</span>
                  <Badge variant="outline" className="capitalize">
                    {job.auctionSettings.type}
                  </Badge>
                </div>
                
                {job.auctionSettings.reservePrice && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Reserve Price</span>
                    <span className="font-medium">${job.auctionSettings.reservePrice.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bid Increment</span>
                  <span className="font-medium">${job.auctionSettings.bidIncrement}</span>
                </div>
                
                {job.auctionSettings.buyNowPrice && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Buy Now Price</span>
                    <span className="font-medium text-green-600">${job.auctionSettings.buyNowPrice.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Auto Extend</span>
                  <div className="flex items-center gap-1">
                    {job.auctionSettings.autoExtend ? <Unlock className="h-4 w-4 text-green-600" /> : <Lock className="h-4 w-4 text-red-600" />}
                    <span className="font-medium">{job.auctionSettings.autoExtend ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
              
              {job.auctionSettings.buyNowPrice && userType === 'provider' && (
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Zap className="h-4 w-4 mr-2" />
                  Buy Now - ${job.auctionSettings.buyNowPrice.toLocaleString()}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Market Intelligence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Market Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Price Trend Analysis
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Prices dropping 12% vs last week</span>
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <div className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
                    Competition Level
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-purple-600">High - {job.metrics.uniqueBidders} active bidders</span>
                  </div>
                </div>
                
                <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                  <div className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                    Urgency Factor
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-orange-600 capitalize">{job.urgency} priority job</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Client
              </Button>
              
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Set Price Alert
              </Button>
              
              <Button variant="outline" className="w-full justify-start" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Trophy className="h-4 w-4 mr-2" />
                Similar Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
