"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// AI-Native Design System Components
import {
  AICard,
  GlassmorphicContainer,
  FuturisticMetrics,
  HolographicText
} from "@/components/admin/design-system"

import {
  TrendingUp, TrendingDown, DollarSign, Target, Users, Zap,
  BarChart3, PieChart, LineChart, Activity, Brain, Sparkles,
  ArrowUpRight, ArrowDownRight, Plus, Minus, Star, Award,
  Gift, CreditCard, ShoppingBag, Heart, Share2, Bookmark,
  ThumbsUp, MessageCircle, Eye, Clock, Calendar, Timer,
  Lightbulb, Rocket, Globe, Network, Layers, Workflow,
  CheckCircle, AlertTriangle, Info, RefreshCw, Download,
  Upload, Settings, MoreHorizontal, Filter, Search,
  Play, Pause, Square, SkipForward, SkipBack, Volume2,
  Maximize2, Minimize2, CornerDownRight, CornerUpLeft
} from "lucide-react"

interface RevenueMetric {
  id: string
  name: string
  value: number
  previousValue: number
  target: number
  unit: string
  prefix?: string
  suffix?: string
  trend: 'up' | 'down' | 'stable'
  changePercent: number
  category: 'revenue' | 'conversion' | 'retention' | 'acquisition'
  priority: 'low' | 'medium' | 'high' | 'critical'
  recommendations: string[]
  potentialIncrease: number
}

interface EngagementFunnel {
  id: string
  name: string
  stages: {
    name: string
    users: number
    conversionRate: number
    dropoffReasons: string[]
    optimizations: string[]
  }[]
  totalValue: number
  improvementPotential: number
}

interface RevenueOpportunity {
  id: string
  title: string
  description: string
  potentialRevenue: number
  effort: 'low' | 'medium' | 'high'
  timeline: string
  confidence: number
  category: 'pricing' | 'features' | 'retention' | 'acquisition' | 'upsell'
  actionItems: string[]
  roi: number
}

interface A_BTest {
  id: string
  name: string
  status: 'running' | 'completed' | 'draft' | 'paused'
  variants: {
    name: string
    traffic: number
    conversionRate: number
    revenue: number
  }[]
  winner?: string
  significance: number
  startDate: string
  endDate?: string
  impact: number
}

export function RevenueAcceleratorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetric[]>([])
  const [engagementFunnels, setEngagementFunnels] = useState<EngagementFunnel[]>([])
  const [revenueOpportunities, setRevenueOpportunities] = useState<RevenueOpportunity[]>([])
  const [abTests, setABTests] = useState<A_BTest[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')

  useEffect(() => {
    initializeRevenueData()
  }, [])

  const initializeRevenueData = useCallback(() => {
    // Initialize revenue metrics
    const metrics: RevenueMetric[] = [
      {
        id: 'monthly-revenue',
        name: 'Monthly Recurring Revenue',
        value: 285600,
        previousValue: 267400,
        target: 320000,
        unit: '',
        prefix: '$',
        trend: 'up',
        changePercent: 6.8,
        category: 'revenue',
        priority: 'critical',
        recommendations: [
          'Implement tiered pricing strategy',
          'Launch premium feature upsells',
          'Improve onboarding conversion'
        ],
        potentialIncrease: 42000
      },
      {
        id: 'conversion-rate',
        name: 'Trial to Paid Conversion',
        value: 23.4,
        previousValue: 19.8,
        target: 28.0,
        unit: '%',
        trend: 'up',
        changePercent: 18.2,
        category: 'conversion',
        priority: 'high',
        recommendations: [
          'Optimize trial experience',
          'Add social proof to pricing page',
          'Implement exit-intent offers'
        ],
        potentialIncrease: 4.6
      },
      {
        id: 'customer-ltv',
        name: 'Customer Lifetime Value',
        value: 1847,
        previousValue: 1692,
        target: 2100,
        unit: '',
        prefix: '$',
        trend: 'up',
        changePercent: 9.2,
        category: 'retention',
        priority: 'high',
        recommendations: [
          'Launch loyalty program',
          'Implement cross-selling campaigns',
          'Improve customer success touchpoints'
        ],
        potentialIncrease: 253
      },
      {
        id: 'churn-rate',
        name: 'Monthly Churn Rate',
        value: 4.2,
        previousValue: 5.8,
        target: 3.0,
        unit: '%',
        trend: 'down',
        changePercent: -27.6,
        category: 'retention',
        priority: 'critical',
        recommendations: [
          'Implement predictive churn prevention',
          'Enhance customer support',
          'Create retention campaigns'
        ],
        potentialIncrease: -1.2
      }
    ]

    // Initialize engagement funnels
    const funnels: EngagementFunnel[] = [
      {
        id: 'signup-funnel',
        name: 'User Acquisition Funnel',
        stages: [
          {
            name: 'Website Visitors',
            users: 45000,
            conversionRate: 100,
            dropoffReasons: [],
            optimizations: ['Improve page load speed', 'Add social proof']
          },
          {
            name: 'Sign-up Started',
            users: 4500,
            conversionRate: 10.0,
            dropoffReasons: ['Complex form', 'Too many fields', 'No social login'],
            optimizations: ['Simplify form', 'Add progress indicator', 'Enable social login']
          },
          {
            name: 'Email Verified',
            users: 3600,
            conversionRate: 80.0,
            dropoffReasons: ['Email in spam', 'Delayed verification', 'Unclear instructions'],
            optimizations: ['Improve email deliverability', 'Add inline verification']
          },
          {
            name: 'Onboarding Completed',
            users: 2880,
            conversionRate: 80.0,
            dropoffReasons: ['Overwhelming UI', 'Unclear value prop', 'Technical issues'],
            optimizations: ['Progressive disclosure', 'Add guided tour', 'Fix UX issues']
          },
          {
            name: 'First Transaction',
            users: 1728,
            conversionRate: 60.0,
            dropoffReasons: ['Payment friction', 'High prices', 'Trust concerns'],
            optimizations: ['Streamline payment', 'Add security badges', 'Offer guarantees']
          }
        ],
        totalValue: 125000,
        improvementPotential: 45000
      }
    ]

    // Initialize revenue opportunities
    const opportunities: RevenueOpportunity[] = [
      {
        id: 'premium-features',
        title: 'Launch Premium Feature Tier',
        description: 'Add advanced AI analytics and automation features as premium tier',
        potentialRevenue: 180000,
        effort: 'high',
        timeline: '3-4 months',
        confidence: 87,
        category: 'features',
        actionItems: [
          'Market research for premium features',
          'Develop advanced AI analytics',
          'Create tiered pricing structure',
          'Build upgrade flow and billing'
        ],
        roi: 320
      },
      {
        id: 'referral-program',
        title: 'Implement Referral Program',
        description: 'Launch customer referral program with incentives for both referrer and referee',
        potentialRevenue: 95000,
        effort: 'medium',
        timeline: '6-8 weeks',
        confidence: 92,
        category: 'acquisition',
        actionItems: [
          'Design referral program structure',
          'Build referral tracking system',
          'Create marketing materials',
          'Launch beta with select customers'
        ],
        roi: 180
      },
      {
        id: 'annual-plans',
        title: 'Introduce Annual Subscription Plans',
        description: 'Offer annual plans with 2-month discount to improve cash flow and retention',
        potentialRevenue: 156000,
        effort: 'low',
        timeline: '2-3 weeks',
        confidence: 95,
        category: 'pricing',
        actionItems: [
          'Update billing system for annual plans',
          'Design pricing page updates',
          'Create annual plan marketing campaign',
          'Implement upgrade prompts'
        ],
        roi: 520
      },
      {
        id: 'enterprise-sales',
        title: 'Enterprise Sales Program',
        description: 'Develop enterprise sales process for large organization deals',
        potentialRevenue: 420000,
        effort: 'high',
        timeline: '4-6 months',
        confidence: 78,
        category: 'acquisition',
        actionItems: [
          'Hire enterprise sales team',
          'Develop enterprise feature set',
          'Create sales collateral and demos',
          'Build enterprise onboarding process'
        ],
        roi: 280
      }
    ]

    // Initialize A/B tests
    const tests: A_BTest[] = [
      {
        id: 'pricing-page-test',
        name: 'Pricing Page Layout Optimization',
        status: 'running',
        variants: [
          { name: 'Control', traffic: 50, conversionRate: 12.4, revenue: 45600 },
          { name: 'Variant A', traffic: 50, conversionRate: 14.8, revenue: 54400 }
        ],
        significance: 85,
        startDate: '2024-01-15',
        impact: 8800
      },
      {
        id: 'onboarding-flow-test',
        name: 'Simplified Onboarding Flow',
        status: 'completed',
        variants: [
          { name: 'Control', traffic: 50, conversionRate: 68.2, revenue: 123400 },
          { name: 'Simplified', traffic: 50, conversionRate: 74.6, revenue: 135200 }
        ],
        winner: 'Simplified',
        significance: 96,
        startDate: '2024-01-01',
        endDate: '2024-01-14',
        impact: 11800
      }
    ]

    setRevenueMetrics(metrics)
    setEngagementFunnels(funnels)
    setRevenueOpportunities(opportunities)
    setABTests(tests)
  }, [])

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />
      default: return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-green-500/20 text-green-400 border-green-500/30'
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'bg-red-500/20 text-red-400'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-green-500/20 text-green-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Revenue Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueMetrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <FuturisticMetrics
              title={metric.name}
              data={{
                value: metric.value,
                previousValue: metric.previousValue,
                target: metric.target,
                unit: metric.unit,
                prefix: metric.prefix,
                suffix: metric.suffix
              }}
              icon={
                metric.category === 'revenue' ? DollarSign :
                metric.category === 'conversion' ? Target :
                metric.category === 'retention' ? Heart :
                Users
              }
              variant={
                metric.category === 'revenue' ? 'quantum' :
                metric.category === 'conversion' ? 'neural' :
                metric.category === 'retention' ? 'holographic' :
                'biometric'
              }
              size="md"
              animated={true}
              showTrend={true}
              showProgress={true}
              glowEffect={true}
            />
          </motion.div>
        ))}
      </div>

      {/* Main Revenue Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <GlassmorphicContainer variant="subtle" className="p-1 mb-6">
          <TabsList className="grid w-full grid-cols-4 bg-transparent h-12">
            {[
              { value: "overview", label: "Overview", icon: BarChart3 },
              { value: "funnels", label: "Funnels", icon: TrendingUp },
              { value: "opportunities", label: "Opportunities", icon: Target },
              { value: "testing", label: "A/B Testing", icon: Activity }
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl transition-all duration-300"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </GlassmorphicContainer>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trends */}
            <AICard
              title="Revenue Performance"
              subtitle="Monthly revenue trends and projections"
              status="active"
              variant="quantum"
              className="h-96"
            >
              <div className="p-6">
                <div className="space-y-4">
                  {revenueMetrics.map((metric, index) => (
                    <div key={metric.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getTrendIcon(metric.trend)}
                          <span className="text-sm font-medium text-white/90">{metric.name}</span>
                        </div>
                        <Badge className={getPriorityColor(metric.priority)}>
                          {metric.priority}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          {metric.prefix}{metric.value.toLocaleString()}{metric.unit}{metric.suffix}
                        </div>
                        <div className={`text-sm ${metric.trend === 'up' ? 'text-green-400' : metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                          {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '' : ''}{metric.changePercent.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AICard>

            {/* Quick Actions */}
            <AICard
              title="Revenue Boosters"
              subtitle="Quick actions to increase revenue"
              status="predicting"
              variant="neural"
              className="h-96"
            >
              <div className="p-6 space-y-4">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white justify-between">
                  <span>Launch Premium Features</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-between">
                  <span>Start Referral Program</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
                
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-between">
                  <span>Optimize Pricing Page</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
                
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white justify-between">
                  <span>Improve Onboarding</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">+$420K</div>
                    <div className="text-sm text-white/60">Potential Monthly Increase</div>
                  </div>
                </div>
              </div>
            </AICard>
          </div>
        </TabsContent>

        <TabsContent value="funnels" className="space-y-6">
          {engagementFunnels.map((funnel, funnelIndex) => (
            <AICard
              key={funnel.id}
              title={funnel.name}
              subtitle={`Total value: $${funnel.totalValue.toLocaleString()}`}
              aiInsight={`${funnel.improvementPotential.toLocaleString()} potential increase identified`}
              confidence={85}
              status="active"
              variant="holographic"
            >
              <div className="p-6">
                <div className="space-y-4">
                  {funnel.stages.map((stage, stageIndex) => (
                    <motion.div
                      key={stageIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: stageIndex * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white/90">{stage.name}</h4>
                          <div className="text-right">
                            <div className="text-lg font-bold text-white">
                              {stage.users.toLocaleString()}
                            </div>
                            <div className="text-sm text-white/60">
                              {stage.conversionRate.toFixed(1)}% conversion
                            </div>
                          </div>
                        </div>
                        
                        <Progress value={stage.conversionRate} className="h-2 mb-2" />
                        
                        {stage.dropoffReasons.length > 0 && (
                          <div className="text-xs text-red-400 mb-2">
                            Drop-off reasons: {stage.dropoffReasons.join(', ')}
                          </div>
                        )}
                        
                        {stage.optimizations.length > 0 && (
                          <div className="text-xs text-green-400">
                            Optimizations: {stage.optimizations.join(', ')}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        {stageIndex < funnel.stages.length - 1 && (
                          <ArrowDownRight className="w-5 h-5 text-white/40" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AICard>
          ))}
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {revenueOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AICard
                  title={opportunity.title}
                  subtitle={`${opportunity.timeline} • ROI: ${opportunity.roi}%`}
                  status="predicting"
                  variant="neural"
                  className="h-full"
                >
                  <div className="p-6 space-y-4">
                    <p className="text-white/70 text-sm">
                      {opportunity.description}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge className={getEffortColor(opportunity.effort)}>
                          {opportunity.effort} effort
                        </Badge>
                        <Badge className="bg-green-500/20 text-green-400">
                          {opportunity.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-center py-4 border-y border-white/10">
                      <div className="text-3xl font-bold text-green-400">
                        +${opportunity.potentialRevenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-white/60">Monthly Revenue Potential</div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-white/90 text-sm">Action Items:</h5>
                      {opportunity.actionItems.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-2 text-xs text-white/70">
                          <CheckCircle className="w-3 h-3" />
                          {item}
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Start Implementation
                    </Button>
                  </div>
                </AICard>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {abTests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AICard
                  title={test.name}
                  subtitle={`${test.status} • ${test.significance}% significance`}
                  status={test.status as any}
                  variant="biometric"
                  className="h-full"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className={
                        test.status === 'running' ? 'bg-green-500/20 text-green-400' :
                        test.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                        test.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }>
                        {test.status}
                      </Badge>
                      
                      {test.winner && (
                        <Badge className="bg-purple-500/20 text-purple-400">
                          Winner: {test.winner}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {test.variants.map((variant, variantIndex) => (
                        <div key={variantIndex} className="p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white/90">{variant.name}</span>
                            <span className="text-sm text-white/60">{variant.traffic}% traffic</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-white/60">Conversion</div>
                              <div className="font-medium text-white">{variant.conversionRate}%</div>
                            </div>
                            <div>
                              <div className="text-white/60">Revenue</div>
                              <div className="font-medium text-white">${variant.revenue.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center py-3 border-y border-white/10">
                      <div className="text-2xl font-bold text-green-400">
                        +${test.impact.toLocaleString()}
                      </div>
                      <div className="text-sm text-white/60">Monthly Impact</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                        {test.status === 'running' ? 'Monitor' : test.status === 'completed' ? 'Implement' : 'Start Test'}
                      </Button>
                    </div>
                  </div>
                </AICard>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
