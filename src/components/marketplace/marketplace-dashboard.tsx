'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Activity, 
  Gavel,
  Shield,
  Brain,
  Zap,
  Clock,
  Target,
  Trophy,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  MapPin,
  Star,
  Eye,
  Settings,
  Filter,
  Download,
  RefreshCw,
  Sparkles,
  Crown,
  Award,
  Heart,
  MessageCircle,
  Bell,
  ChevronRight,
  Plus,
  Minus,
  Play,
  Pause
} from 'lucide-react'
import { AdvancedBiddingSystem } from './advanced-bidding-system'
import { dynamicPricingEngine, type PricingRecommendation } from '@/lib/marketplace/dynamic-pricing-engine'
import { smartContractEngine, type SmartContract } from '@/lib/marketplace/smart-contracts'

interface MarketplaceMetrics {
  totalVolume: number
  activeJobs: number
  totalProviders: number
  avgCompletionTime: number
  successRate: number
  revenueGrowth: number
  demandIndex: number
  supplyIndex: number
  priceIndex: number
  qualityScore: number
}

interface MarketplaceTrend {
  period: string
  volume: number
  jobs: number
  avgPrice: number
  satisfaction: number
}

interface LiveUpdate {
  id: string
  type: 'new_job' | 'bid_placed' | 'job_completed' | 'dispute_resolved' | 'payment_released'
  title: string
  description: string
  amount?: number
  timestamp: Date
  priority: 'low' | 'medium' | 'high'
}

interface MarketOpportunity {
  id: string
  category: string
  demandIncrease: number
  avgPricing: number
  competition: 'low' | 'medium' | 'high'
  growthPotential: number
  recommendedAction: string
}

export function MarketplaceDashboard({ userId, userType }: { userId: string; userType: 'admin' | 'provider' | 'client' }) {
  const [metrics, setMetrics] = useState<MarketplaceMetrics>({
    totalVolume: 2400000,
    activeJobs: 1250,
    totalProviders: 8500,
    avgCompletionTime: 4.2,
    successRate: 94.8,
    revenueGrowth: 23.5,
    demandIndex: 0.78,
    supplyIndex: 0.65,
    priceIndex: 1.12,
    qualityScore: 4.7
  })

  const [trends, setTrends] = useState<MarketplaceTrend[]>([])
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>([])
  const [opportunities, setOpportunities] = useState<MarketOpportunity[]>([])
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')
  const [pricingRecommendation, setPricingRecommendation] = useState<PricingRecommendation | null>(null)
  const [activeContracts, setActiveContracts] = useState<SmartContract[]>([])
  const [showBiddingInterface, setShowBiddingInterface] = useState(false)

  useEffect(() => {
    // Initialize dashboard data
    initializeDashboard()
    
    // Set up real-time updates
    const interval = setInterval(() => {
      updateLiveMetrics()
      generateLiveUpdates()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const initializeDashboard = async () => {
    // Generate trend data
    const trendData: MarketplaceTrend[] = []
    for (let i = 30; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      trendData.push({
        period: date.toISOString().split('T')[0],
        volume: 50000 + Math.random() * 100000,
        jobs: 40 + Math.random() * 60,
        avgPrice: 150 + Math.random() * 100,
        satisfaction: 4.2 + Math.random() * 0.8
      })
    }
    setTrends(trendData)

    // Generate market opportunities
    const marketOpportunities: MarketOpportunity[] = [
      {
        id: '1',
        category: 'Home Cleaning',
        demandIncrease: 34.5,
        avgPricing: 120,
        competition: 'medium',
        growthPotential: 78,
        recommendedAction: 'Increase pricing by 15% and expand service area'
      },
      {
        id: '2',
        category: 'Tech Support',
        demandIncrease: 67.2,
        avgPricing: 85,
        competition: 'low',
        growthPotential: 92,
        recommendedAction: 'Premium positioning opportunity - 25% price increase potential'
      },
      {
        id: '3',
        category: 'Personal Training',
        demandIncrease: 12.3,
        avgPricing: 65,
        competition: 'high',
        growthPotential: 45,
        recommendedAction: 'Focus on specialization and value-added services'
      }
    ]
    setOpportunities(marketOpportunities)

    // Load smart contracts
    const contracts = smartContractEngine.getContractsForParty(userId)
    setActiveContracts(contracts)
  }

  const updateLiveMetrics = () => {
    setMetrics(prev => ({
      ...prev,
      activeJobs: prev.activeJobs + Math.floor((Math.random() - 0.5) * 10),
      demandIndex: Math.max(0, Math.min(1, prev.demandIndex + (Math.random() - 0.5) * 0.1)),
      supplyIndex: Math.max(0, Math.min(1, prev.supplyIndex + (Math.random() - 0.5) * 0.1)),
      priceIndex: Math.max(0.5, Math.min(2, prev.priceIndex + (Math.random() - 0.5) * 0.05))
    }))
  }

  const generateLiveUpdates = () => {
    const updateTypes = ['new_job', 'bid_placed', 'job_completed', 'payment_released']
    const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)] as LiveUpdate['type']
    
    const updates = {
      new_job: {
        title: 'New High-Value Job Posted',
        description: 'Premium home renovation project in downtown area',
        amount: 2500 + Math.random() * 5000
      },
      bid_placed: {
        title: 'Competitive Bid Received',
        description: 'New bid on electrical installation project',
        amount: 150 + Math.random() * 500
      },
      job_completed: {
        title: 'Job Successfully Completed',
        description: 'House cleaning service completed with 5-star rating',
        amount: 80 + Math.random() * 200
      },
      payment_released: {
        title: 'Payment Released',
        description: 'Automated payment release for tutoring services',
        amount: 45 + Math.random() * 150
      }
    }

    const newUpdate: LiveUpdate = {
      id: `update-${Date.now()}`,
      type: randomType,
      ...updates[randomType],
      timestamp: new Date(),
      priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
    }

    setLiveUpdates(prev => [newUpdate, ...prev.slice(0, 9)])
  }

  const marketHealthScore = useMemo(() => {
    const demandSupplyBalance = 1 - Math.abs(metrics.demandIndex - metrics.supplyIndex)
    const successRateScore = metrics.successRate / 100
    const qualityScore = metrics.qualityScore / 5
    const priceStability = 1 - Math.abs(metrics.priceIndex - 1) * 0.5
    
    return Math.round((demandSupplyBalance + successRateScore + qualityScore + priceStability) * 25)
  }, [metrics])

  const getHealthColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Marketplace Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Advanced analytics and marketplace intelligence
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`px-4 py-2 rounded-lg border ${getHealthColor(marketHealthScore)}`}>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Market Health: {marketHealthScore}/100</span>
            </div>
          </div>
          
          <Dialog open={showBiddingInterface} onOpenChange={setShowBiddingInterface}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Gavel className="h-4 w-4 mr-2" />
                Live Bidding
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl h-[90vh] p-0">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle>Advanced Bidding Interface</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-auto p-6">
                <AdvancedBiddingSystem 
                  job={{
                    id: 'demo-job',
                    title: 'Premium Home Renovation Project',
                    description: 'Complete kitchen and bathroom renovation for luxury home',
                    category: 'Home Improvement',
                    location: 'San Francisco, CA',
                    budget: { min: 15000, max: 25000, currency: 'USD' },
                    timeline: {
                      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                      duration: '3-4 weeks'
                    },
                    requirements: ['Licensed contractor', '10+ years experience', 'Insurance required'],
                    preferredSkills: ['Kitchen renovation', 'Bathroom remodeling', 'Tile work', 'Plumbing', 'Electrical'],
                    auctionSettings: {
                      type: 'reverse',
                      bidIncrement: 500,
                      autoExtend: true,
                      buyNowPrice: 18000
                    },
                    currentStatus: 'active',
                    metrics: {
                      totalBids: 12,
                      uniqueBidders: 8,
                      averageBid: 19500,
                      currentWinningBid: 16800,
                      priceReduction: 15
                    },
                    timeRemaining: 25200, // 7 hours
                    urgency: 'medium',
                    clientRating: 4.8,
                    isSponsored: true,
                    featuredLevel: 'premium'
                  }}
                  userId={userId}
                  userType={userType as 'client' | 'provider'}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Volume',
            value: formatCurrency(metrics.totalVolume),
            change: formatPercentage(metrics.revenueGrowth),
            icon: DollarSign,
            color: 'text-green-600 bg-green-100',
            trend: 'up'
          },
          {
            title: 'Active Jobs',
            value: metrics.activeJobs.toLocaleString(),
            change: '+12.3%',
            icon: Activity,
            color: 'text-blue-600 bg-blue-100',
            trend: 'up'
          },
          {
            title: 'Success Rate',
            value: `${metrics.successRate}%`,
            change: '+2.1%',
            icon: Trophy,
            color: 'text-purple-600 bg-purple-100',
            trend: 'up'
          },
          {
            title: 'Avg Completion',
            value: `${metrics.avgCompletionTime} days`,
            change: '-8.7%',
            icon: Clock,
            color: 'text-orange-600 bg-orange-100',
            trend: 'down'
          }
        ].map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${metric.color}`}>
                  <metric.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                  {metric.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {metric.title}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Market Intelligence */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Market Trends */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Market Trends & Analytics
                </CardTitle>
                <div className="flex items-center gap-2">
                  {['7d', '30d', '90d'].map((range) => (
                    <Button
                      key={range}
                      variant={selectedTimeRange === range ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTimeRange(range)}
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="volume" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="volume">Volume</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="demand">Demand</TabsTrigger>
                  <TabsTrigger value="quality">Quality</TabsTrigger>
                </TabsList>
                
                <TabsContent value="volume" className="mt-6">
                  <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                      <p className="text-gray-600 dark:text-gray-300">Volume trending up 23.5% this month</p>
                      <div className="mt-4 flex items-center justify-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{formatCurrency(156000)}</div>
                          <div className="text-sm text-gray-500">This Week</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{formatCurrency(198000)}</div>
                          <div className="text-sm text-gray-500">Projected</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="pricing" className="mt-6">
                  <div className="h-64 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="h-16 w-16 mx-auto mb-4 text-green-600" />
                      <p className="text-gray-600 dark:text-gray-300">Average pricing index: {metrics.priceIndex.toFixed(2)}</p>
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">$164</div>
                          <div className="text-sm text-gray-500">Avg Price</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">12%</div>
                          <div className="text-sm text-gray-500">Price Growth</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">0.78</div>
                          <div className="text-sm text-gray-500">Elasticity</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="demand" className="mt-6">
                  <div className="h-64 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg p-6">
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Demand vs Supply Balance</h4>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Demand Index</span>
                          <span className="font-medium">{Math.round(metrics.demandIndex * 100)}%</span>
                        </div>
                        <Progress value={metrics.demandIndex * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Supply Index</span>
                          <span className="font-medium">{Math.round(metrics.supplyIndex * 100)}%</span>
                        </div>
                        <Progress value={metrics.supplyIndex * 100} className="h-2" />
                      </div>
                      <div className="mt-4 text-center">
                        <div className="text-lg font-bold text-purple-600">
                          {metrics.demandIndex > metrics.supplyIndex ? 'Seller\'s Market' : 'Buyer\'s Market'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {Math.abs(metrics.demandIndex - metrics.supplyIndex) > 0.2 ? 'Strong' : 'Moderate'} imbalance
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="quality" className="mt-6">
                  <div className="h-64 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Star className="h-16 w-16 mx-auto mb-4 text-yellow-600" />
                      <p className="text-gray-600 dark:text-gray-300">Service quality consistently high</p>
                      <div className="mt-4 flex items-center justify-center gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">{metrics.qualityScore}/5</div>
                          <div className="text-sm text-gray-500">Avg Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{metrics.successRate}%</div>
                          <div className="text-sm text-gray-500">Success Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Market Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Market Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{opportunity.category}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mt-1">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span>+{opportunity.demandIncrease}% demand</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-blue-600" />
                            <span>${opportunity.avgPricing} avg</span>
                          </div>
                          <Badge variant={
                            opportunity.competition === 'low' ? 'default' :
                            opportunity.competition === 'medium' ? 'secondary' : 'destructive'
                          } className="text-xs">
                            {opportunity.competition} competition
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {opportunity.growthPotential}%
                        </div>
                        <div className="text-xs text-gray-500">Growth Potential</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-950/30 p-2 rounded">
                      💡 {opportunity.recommendedAction}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Live Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Live Market Activity
                <Badge variant="secondary" className="animate-pulse">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {liveUpdates.map((update) => (
                  <div key={update.id} className={`p-3 rounded-lg border-l-4 ${
                    update.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-950/30' :
                    update.priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30' :
                    'border-green-500 bg-green-50 dark:bg-green-950/30'
                  }`}>
                    <div className="flex items-start justify-between mb-1">
                      <h5 className="font-medium text-sm">{update.title}</h5>
                      <span className="text-xs text-gray-500">
                        {update.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                      {update.description}
                    </p>
                    {update.amount && (
                      <div className="text-sm font-bold text-green-600">
                        {formatCurrency(update.amount)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Smart Contract Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Smart Contracts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeContracts.length > 0 ? (
                  activeContracts.slice(0, 5).map((contract) => (
                    <div key={contract.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">Contract #{contract.id.slice(-6)}</span>
                        <Badge variant={
                          contract.status === 'active' ? 'default' :
                          contract.status === 'completed' ? 'secondary' :
                          contract.status === 'disputed' ? 'destructive' : 'outline'
                        } className="text-xs">
                          {contract.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                        {contract.terms.serviceDescription.slice(0, 50)}...
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-green-600">
                          {formatCurrency(contract.terms.totalAmount)}
                        </span>
                        <span className="text-gray-500">
                          {contract.terms.milestones.length} milestones
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No active contracts</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Market Alert:</strong> Tech support demand is surging. Consider raising prices by 15% for optimal revenue.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Trend Detected:</strong> Weekend bookings are 34% higher than weekdays. Implement weekend premium pricing.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Trophy className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Quality Boost:</strong> Your rating increased to 4.9. You can now charge premium rates.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
