'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Search,
  UserPlus,
  Shield,
  Star,
  Clock,
  MapPin,
  Zap,
  TrendingUp,
  Users,
  Target,
  Globe,
  Award,
  Sparkles,
  ArrowRight,
  Bot,
  Heart,
  MessageCircle,
  Filter,
  Plus,
  Brain
} from 'lucide-react'

interface ModernHeroProps {
  stats: {
    userCount: number
    providerCount: number
    bookingCount: number
    averageRating: number
    responseTime: string
    successRate: string
  }
}

function ModernHero({ stats }: ModernHeroProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('Your Location')
  const [isLoading, setIsLoading] = useState(false)

  // AI Insights data similar to HyperLocalOS
  const aiInsights = [
    { metric: 'Demand Surge', value: '+23%', trend: 'up', desc: 'Home repair requests' },
    { metric: 'Peak Hours', value: '2-6 PM', trend: 'neutral', desc: 'Highest booking activity' },
    { metric: 'Top Category', value: 'Tutoring', trend: 'up', desc: 'This week' },
    { metric: 'Avg Response', value: '12 min', trend: 'down', desc: 'Provider response time' }
  ]

  const quickCategories = [
    { name: 'Urgent', color: 'bg-red-500', textColor: 'text-white' },
    { name: 'Home Repair', color: 'bg-blue-500', textColor: 'text-white' },
    { name: 'Tutoring', color: 'bg-green-500', textColor: 'text-white' },
    { name: 'Delivery', color: 'bg-purple-500', textColor: 'text-white' }
  ]

  const handleSearch = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      // Navigate to browse with search params
      window.location.href = `/browse?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(selectedLocation)}`
    }, 1000)
  }

  return (
    <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
      {/* Beautiful gradient background similar to HyperLocalOS */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-purple-900/30 dark:via-blue-900/30 dark:to-pink-900/30 rounded-3xl mx-4 opacity-5 dark:opacity-100"></div>
      
      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badge */}
        <div className="flex justify-center mb-6">
          <Badge className="hero-badge bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 text-white dark:text-emerald-400 px-6 py-3 text-sm font-medium rounded-full">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Shield className="w-5 h-5 animate-pulse" />
                <div className="absolute inset-0 animate-ping">
                  <Shield className="w-5 h-5 opacity-30" />
                </div>
              </div>
              <span>Trusted by {(stats.userCount / 1000000).toFixed(1)}M+ Users Worldwide</span>
            </div>
          </Badge>
        </div>

        {/* Hero Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Find Local Services
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              AI-powered matching
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Connect with verified local service professionals through our intelligent platform. 
            From home repairs to personal training - find trusted providers with AI-powered matching.
          </p>
        </div>

        {/* Enhanced Search Card - HyperLocalOS Style */}
        <Card className="max-w-4xl mx-auto mb-12 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="What service do you need?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none text-lg font-medium"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>

              {/* Location Selector */}
              <div className="lg:w-64">
                <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="flex-1 bg-transparent text-gray-900 dark:text-white outline-none font-medium"
                  >
                    <option value="Your Location">Your Location</option>
                    <option value="New York, NY">New York, NY</option>
                    <option value="Los Angeles, CA">Los Angeles, CA</option>
                    <option value="Chicago, IL">Chicago, IL</option>
                    <option value="Houston, TX">Houston, TX</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Search
                  </div>
                )}
              </Button>
            </div>

            {/* Quick Category Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {quickCategories.map((category) => (
                <button
                  key={category.name}
                  className={`${category.color} ${category.textColor} px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Section - HyperLocalOS Style */}
        <Card className="max-w-4xl mx-auto mb-12 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              AI Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {aiInsights.map((insight, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{insight.metric}</span>
                    <TrendingUp className={`w-4 h-4 ${insight.trend === 'up' ? 'text-green-500' : insight.trend === 'down' ? 'text-red-500' : 'text-gray-400'} ${insight.trend !== 'neutral' ? 'animate-pulse' : ''}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{insight.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{insight.desc}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - HyperLocalOS Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
          <Link href="/post-job">
            <Card className="group cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Plus className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Post a Job</h3>
                    <p className="text-blue-100 text-sm">Get matched instantly</p>
                  </div>
                  <ArrowRight className="w-6 h-6 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/browse">
            <Card className="group cursor-pointer bg-gradient-to-r from-green-600 to-teal-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Search className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Find Work</h3>
                    <p className="text-green-100 text-sm">Browse available jobs</p>
                  </div>
                  <ArrowRight className="w-6 h-6 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Grid - HyperLocalOS Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-lg rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl w-fit mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {(stats.userCount / 1000000).toFixed(1)}M+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Active Users</div>
              <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                +23.5% vs last month
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-lg rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl w-fit mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.responseTime}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Response</div>
              <Badge className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                +15.2% faster
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-lg rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl w-fit mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.successRate}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Success Rate</div>
              <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                +2.1% improvement
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-lg rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl w-fit mx-auto mb-4">
                <Star className="w-8 h-8 text-white fill-current" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.averageRating}/5
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Rating</div>
              <Badge className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                +1.8% higher
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Live Status Indicator */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-full px-6 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Live Support Available 24/7
              </span>
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stats.averageRating}/5 Average Rating
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Assistant Button - HyperLocalOS Style */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white w-14 h-14 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 group">
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </Button>
      </div>
    </section>
  )
}

export default ModernHero;
