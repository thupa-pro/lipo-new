'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MarketplaceDashboard } from '@/components/marketplace/marketplace-dashboard'
import { PriceOptimizer } from '@/components/features/ai/price-optimizer'
import { SmartRecommendations } from '@/components/features/ai/smart-recommendations'
import AIChat from '@/components/features/ai/AIChat'
import { 
  Gavel, 
  TrendingUp, 
  Shield, 
  Brain, 
  Zap, 
  Users,
  DollarSign,
  Activity,
  Target,
  Star,
  Crown,
  Award,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Play,
  BarChart3,
  LineChart,
  PieChart,
  Clock,
  Globe,
  Heart,
  Lock,
  Unlock,
  RefreshCw,
  Eye,
  Settings,
  Filter,
  Calendar,
  MapPin,
  MessageCircle,
  Bell
} from 'lucide-react'

interface MarketplaceFeature {
  id: string
  title: string
  description: string
  icon: React.ElementType
  gradient: string
  status: 'live' | 'beta' | 'coming-soon'
  benefits: string[]
  metrics?: {
    label: string
    value: string
    improvement: string
  }[]
}

interface MarketplaceTestimonial {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  text: string
  rating: number
  metrics: {
    revenue: string
    efficiency: string
    satisfaction: string
  }
}

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [userType, setUserType] = useState<'admin' | 'provider' | 'client'>('admin')
  const [marketplaceStats, setMarketplaceStats] = useState({
    totalVolume: 12400000,
    activeUsers: 45000,
    successRate: 97.2,
    averageEarnings: 3200,
    contractsExecuted: 18500,
    disputeResolution: 99.1
  })

  const marketplaceFeatures: MarketplaceFeature[] = [
    {
      id: 'dynamic-pricing',
      title: 'AI-Powered Dynamic Pricing',
      description: 'Advanced machine learning algorithms optimize pricing in real-time based on market demand, competition, and quality metrics.',
      icon: Brain,
      gradient: 'from-purple-500 to-pink-500',
      status: 'live',
      benefits: [
        'Increase revenue by up to 35%',
        'Optimize pricing automatically',
        'Real-time market intelligence',
        'Competitive advantage insights'
      ],
      metrics: [
        { label: 'Revenue Increase', value: '35%', improvement: 'vs manual pricing' },
        { label: 'Price Accuracy', value: '94%', improvement: 'ML confidence' },
        { label: 'Market Response', value: '<500ms', improvement: 'real-time' }
      ]
    },
    {
      id: 'smart-bidding',
      title: 'Advanced Bidding System',
      description: 'Sophisticated auction mechanisms with reverse bidding, sealed bids, and Dutch auctions for optimal price discovery.',
      icon: Gavel,
      gradient: 'from-blue-500 to-cyan-500',
      status: 'live',
      benefits: [
        'Multiple auction types',
        'Real-time bid tracking',
        'Automated bid optimization',
        'Anti-bid sniping protection'
      ],
      metrics: [
        { label: 'Bid Efficiency', value: '89%', improvement: 'optimal pricing' },
        { label: 'Time to Match', value: '12min', improvement: 'average' },
        { label: 'Provider Satisfaction', value: '96%', improvement: 'rating' }
      ]
    },
    {
      id: 'smart-contracts',
      title: 'Blockchain Smart Contracts',
      description: 'Automated contract execution with escrow, milestone payments, and dispute resolution built into the blockchain.',
      icon: Shield,
      gradient: 'from-green-500 to-teal-500',
      status: 'live',
      benefits: [
        'Automated escrow management',
        'Milestone-based payments',
        'Dispute resolution automation',
        'Zero-trust transactions'
      ],
      metrics: [
        { label: 'Payment Security', value: '99.9%', improvement: 'uptime' },
        { label: 'Dispute Resolution', value: '2.3 days', improvement: 'average' },
        { label: 'Contract Success', value: '98.1%', improvement: 'rate' }
      ]
    },
    {
      id: 'market-intelligence',
      title: 'Real-Time Market Intelligence',
      description: 'Comprehensive analytics dashboard with predictive insights, trend analysis, and competitive intelligence.',
      icon: BarChart3,
      gradient: 'from-orange-500 to-red-500',
      status: 'live',
      benefits: [
        'Predictive market analysis',
        'Competitive intelligence',
        'Demand forecasting',
        'Revenue optimization'
      ],
      metrics: [
        { label: 'Prediction Accuracy', value: '91%', improvement: 'ML models' },
        { label: 'Market Coverage', value: '100%', improvement: 'categories' },
        { label: 'Update Frequency', value: '5sec', improvement: 'real-time' }
      ]
    },
    {
      id: 'quality-assurance',
      title: 'AI Quality Assurance',
      description: 'Automated quality monitoring with predictive scoring, reputation management, and performance optimization.',
      icon: Star,
      gradient: 'from-yellow-500 to-orange-500',
      status: 'beta',
      benefits: [
        'Predictive quality scoring',
        'Automated performance monitoring',
        'Reputation management',
        'Quality improvement insights'
      ],
      metrics: [
        { label: 'Quality Score', value: '4.8/5', improvement: 'average' },
        { label: 'Issue Detection', value: '94%', improvement: 'accuracy' },
        { label: 'Resolution Time', value: '4.2hrs', improvement: 'average' }
      ]
    },
    {
      id: 'network-effects',
      title: 'Network Effect Optimization',
      description: 'Advanced algorithms that leverage network effects to improve matching, reduce costs, and increase value for all participants.',
      icon: Globe,
      gradient: 'from-indigo-500 to-purple-500',
      status: 'beta',
      benefits: [
        'Enhanced matching algorithms',
        'Network effect amplification',
        'Reduced transaction costs',
        'Increased market liquidity'
      ],
      metrics: [
        { label: 'Match Quality', value: '92%', improvement: 'satisfaction' },
        { label: 'Network Growth', value: '45%', improvement: 'monthly' },
        { label: 'Cost Reduction', value: '23%', improvement: 'vs traditional' }
      ]
    }
  ]

  const testimonials: MarketplaceTestimonial[] = [
    {
      id: '1',
      name: 'Sarah Martinez',
      role: 'Service Provider',
      company: 'Elite Cleaning Services',
      avatar: 'SM',
      text: 'The AI pricing engine increased my revenue by 40% while the smart contracts eliminated payment delays. The marketplace intelligence helps me stay ahead of competition.',
      rating: 5,
      metrics: {
        revenue: '+40%',
        efficiency: '+65%',
        satisfaction: '4.9/5'
      }
    },
    {
      id: '2',
      name: 'Marcus Chen',
      role: 'Platform Administrator',
      company: 'TechCorp Solutions',
      avatar: 'MC',
      text: 'Implementing Loconomy\'s advanced marketplace features reduced our operational costs by 35% and improved user satisfaction significantly. The automation is incredible.',
      rating: 5,
      metrics: {
        revenue: '+28%',
        efficiency: '+78%',
        satisfaction: '4.8/5'
      }
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Business Owner',
      company: 'HomeServices Plus',
      avatar: 'ER',
      text: 'The real-time bidding system and quality assurance features have transformed how we operate. We\'re seeing better matches and faster completions.',
      rating: 5,
      metrics: {
        revenue: '+52%',
        efficiency: '+71%',
        satisfaction: '4.9/5'
      }
    }
  ]

  useEffect(() => {
    // Simulate real-time stats updates
    const interval = setInterval(() => {
      setMarketplaceStats(prev => ({
        ...prev,
        totalVolume: prev.totalVolume + Math.floor(Math.random() * 10000),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10),
        contractsExecuted: prev.contractsExecuted + Math.floor(Math.random() * 5)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-lg">
              <Gavel className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Advanced Marketplace
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Platform
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Revolutionary marketplace technology with AI-powered dynamic pricing, smart contracts, 
              real-time bidding, and advanced analytics for the next generation of service platforms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold">
                <Play className="h-5 w-5 mr-2" />
                Explore Dashboard
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-purple-300 hover:border-purple-500 px-8 py-4 text-lg font-semibold">
                <Eye className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            {[
              { label: 'Total Volume', value: `$${(marketplaceStats.totalVolume / 1000000).toFixed(1)}M`, icon: DollarSign },
              { label: 'Active Users', value: `${(marketplaceStats.activeUsers / 1000).toFixed(0)}K`, icon: Users },
              { label: 'Success Rate', value: `${marketplaceStats.successRate}%`, icon: CheckCircle },
              { label: 'Avg Earnings', value: `$${marketplaceStats.averageEarnings}`, icon: TrendingUp },
              { label: 'Smart Contracts', value: `${(marketplaceStats.contractsExecuted / 1000).toFixed(1)}K`, icon: Shield },
              { label: 'Resolution Rate', value: `${marketplaceStats.disputeResolution}%`, icon: Star }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl w-fit mx-auto mb-3">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="dashboard" className="text-lg py-3">
                <BarChart3 className="h-5 w-5 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="features" className="text-lg py-3">
                <Sparkles className="h-5 w-5 mr-2" />
                Features
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="text-lg py-3">
                <Heart className="h-5 w-5 mr-2" />
                Success Stories
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-lg py-3">
                <TrendingUp className="h-5 w-5 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Live Marketplace Dashboard
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Real-time analytics and control center for marketplace operations
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="animate-pulse">
                    <Activity className="h-3 w-3 mr-1" />
                    Live Data
                  </Badge>
                  <select 
                    value={userType} 
                    onChange={(e) => setUserType(e.target.value as typeof userType)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="admin">Platform Admin</option>
                    <option value="provider">Service Provider</option>
                    <option value="client">Client</option>
                  </select>
                </div>
              </div>
              
              <MarketplaceDashboard userId="demo-user" userType={userType} />
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Revolutionary Marketplace Features
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Advanced technology stack designed for the future of marketplace platforms
                </p>
              </div>

              <div className="grid gap-8">
                {marketplaceFeatures.map((feature, index) => (
                  <Card key={feature.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 hover:border-blue-300 dark:hover:border-blue-600">
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Feature Info */}
                        <div className="lg:col-span-2">
                          <div className="flex items-start gap-6 mb-6">
                            <div className={`p-4 bg-gradient-to-r ${feature.gradient} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                              <feature.icon className="h-8 w-8 text-white" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                  {feature.title}
                                </h3>
                                <Badge variant={
                                  feature.status === 'live' ? 'default' :
                                  feature.status === 'beta' ? 'secondary' : 'outline'
                                } className="text-sm">
                                  {feature.status}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                                {feature.description}
                              </p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {feature.benefits.map((benefit, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                      {benefit}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Metrics */}
                        {feature.metrics && (
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                              Performance Metrics
                            </h4>
                            {feature.metrics.map((metric, i) => (
                              <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {metric.label}
                                  </span>
                                  <span className="text-lg font-bold text-blue-600">
                                    {metric.value}
                                  </span>
                                </div>
                                <div className="text-xs text-green-600">
                                  {metric.improvement}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Success Stories
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Real results from businesses using our advanced marketplace platform
                </p>
              </div>

              <div className="grid gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={testimonial.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        
                        {/* Testimonial Content */}
                        <div className="lg:col-span-3">
                          <div className="flex items-start gap-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {testimonial.avatar}
                            </div>
                            
                            <div className="flex-1">
                              <div className="mb-4">
                                <h4 className="font-bold text-xl text-gray-900 dark:text-white">
                                  {testimonial.name}
                                </h4>
                                <div className="text-gray-600 dark:text-gray-400">
                                  {testimonial.role} • {testimonial.company}
                                </div>
                                <div className="flex items-center gap-1 mt-2">
                                  {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                              </div>
                              
                              <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic leading-relaxed">
                                "{testimonial.text}"
                              </blockquote>
                            </div>
                          </div>
                        </div>
                        
                        {/* Metrics */}
                        <div className="space-y-4">
                          <h5 className="font-semibold text-gray-900 dark:text-white">
                            Results Achieved
                          </h5>
                          <div className="space-y-3">
                            <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3">
                              <div className="text-2xl font-bold text-green-600">
                                {testimonial.metrics.revenue}
                              </div>
                              <div className="text-sm text-green-700 dark:text-green-300">
                                Revenue Growth
                              </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
                              <div className="text-2xl font-bold text-blue-600">
                                {testimonial.metrics.efficiency}
                              </div>
                              <div className="text-sm text-blue-700 dark:text-blue-300">
                                Efficiency Gain
                              </div>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3">
                              <div className="text-2xl font-bold text-purple-600">
                                {testimonial.metrics.satisfaction}
                              </div>
                              <div className="text-sm text-purple-700 dark:text-purple-300">
                                User Satisfaction
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Platform Analytics
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Deep insights into marketplace performance and growth metrics
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Revenue Analytics',
                    description: 'Track revenue streams, growth patterns, and optimization opportunities',
                    icon: DollarSign,
                    color: 'from-green-500 to-emerald-500',
                    value: '$12.4M',
                    change: '+35.2%'
                  },
                  {
                    title: 'User Engagement',
                    description: 'Monitor user activity, retention, and satisfaction metrics',
                    icon: Users,
                    color: 'from-blue-500 to-cyan-500',
                    value: '45K',
                    change: '+28.7%'
                  },
                  {
                    title: 'Transaction Volume',
                    description: 'Analyze transaction patterns, completion rates, and trends',
                    icon: Activity,
                    color: 'from-purple-500 to-pink-500',
                    value: '18.5K',
                    change: '+42.1%'
                  },
                  {
                    title: 'Quality Metrics',
                    description: 'Track service quality, ratings, and customer satisfaction',
                    icon: Star,
                    color: 'from-yellow-500 to-orange-500',
                    value: '4.8/5',
                    change: '+12.3%'
                  },
                  {
                    title: 'Market Efficiency',
                    description: 'Measure matching efficiency, time to completion, and optimization',
                    icon: Target,
                    color: 'from-indigo-500 to-purple-500',
                    value: '97.2%',
                    change: '+8.4%'
                  },
                  {
                    title: 'Growth Rate',
                    description: 'Monitor platform growth, expansion metrics, and projections',
                    icon: TrendingUp,
                    color: 'from-pink-500 to-rose-500',
                    value: '45%',
                    change: '+156.7%'
                  }
                ].map((analytic, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 bg-gradient-to-r ${analytic.color} rounded-xl flex items-center justify-center mb-4`}>
                        <analytic.icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                        {analytic.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {analytic.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {analytic.value}
                        </div>
                        <div className="text-sm font-medium text-green-600">
                          {analytic.change}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* AI Intelligence Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              AI-Powered Marketplace Intelligence
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Advanced AI algorithms optimize pricing, matching, and marketplace efficiency
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* AI Price Optimization */}
            <Card className="p-6">
              <CardHeader>
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <CardTitle className="text-xl">Smart Pricing Engine</CardTitle>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  AI analyzes market data, demand patterns, and competitive pricing to optimize revenue.
                </p>
              </CardHeader>
              <CardContent>
                <PriceOptimizer
                  serviceType="Professional Services"
                  location="Global Marketplace"
                  flexibility="high"
                  onOptimizationComplete={(insight) => {
                    console.log('Marketplace price optimization:', insight);
                  }}
                />
              </CardContent>
            </Card>

            {/* AI Provider Matching */}
            <Card className="p-6">
              <CardHeader>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                  <CardTitle className="text-xl">Intelligent Matching</CardTitle>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Machine learning matches customers with optimal service providers based on complex criteria.
                </p>
              </CardHeader>
              <CardContent>
                <SmartRecommendations
                  userId="marketplace-demo"
                  query="marketplace services"
                  context={{
                    location: { lat: 40.7128, lng: -74.0060 },
                    urgency: "medium",
                    budget: { min: 100, max: 1000 },
                    timeframe: "this quarter"
                  }}
                  onProviderSelect={(providerId) => {
                    console.log('Marketplace provider selected:', providerId);
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Marketplace?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of businesses leveraging our advanced marketplace technology 
            to increase revenue, improve efficiency, and deliver exceptional user experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              <Zap className="h-5 w-5 mr-2" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold">
              <MessageCircle className="h-5 w-5 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* AI Chat Assistant for Marketplace */}
      <AIChat
        agentId="market-ai"
        context={{
          currentPage: "marketplace",
          features: "bidding, pricing, analytics",
          userType: "marketplace-operator"
        }}
        position="floating"
        theme="brand"
        autoOpen={false}
        proactiveMessage={false}
      />
    </div>
  )
}
