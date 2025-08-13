"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AdvancedAnalyticsDashboard, 
  RealTimeAnalytics, 
  BusinessIntelligence 
} from '@/components/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, Activity, Brain, TrendingUp, DollarSign, 
  Users, Eye, Clock, Target, Zap, Award, Globe
} from 'lucide-react';

// Mock data for analytics demonstrations
const mockMetrics = [
  {
    id: 'revenue',
    title: 'Total Revenue',
    value: 285420,
    previousValue: 267380,
    change: 6.8,
    changeType: 'increase' as const,
    format: 'currency' as const,
    icon: DollarSign,
    color: 'bg-green-500',
    target: 300000
  },
  {
    id: 'users',
    title: 'Active Users',
    value: 12547,
    previousValue: 11832,
    change: 6.0,
    changeType: 'increase' as const,
    format: 'number' as const,
    icon: Users,
    color: 'bg-blue-500',
    target: 15000
  },
  {
    id: 'engagement',
    title: 'Engagement Rate',
    value: 78.5,
    previousValue: 74.2,
    change: 5.8,
    changeType: 'increase' as const,
    format: 'percentage' as const,
    icon: TrendingUp,
    color: 'bg-purple-500',
    target: 80
  },
  {
    id: 'response_time',
    title: 'Avg Response Time',
    value: 245,
    previousValue: 298,
    change: -17.8,
    changeType: 'increase' as const,
    format: 'time' as const,
    icon: Clock,
    color: 'bg-orange-500'
  }
];

const mockRevenueData = [
  { name: 'Jan', revenue: 45000, profit: 18000, expenses: 27000 },
  { name: 'Feb', revenue: 52000, profit: 22000, expenses: 30000 },
  { name: 'Mar', revenue: 48000, profit: 19000, expenses: 29000 },
  { name: 'Apr', revenue: 61000, profit: 28000, expenses: 33000 },
  { name: 'May', revenue: 58000, profit: 25000, expenses: 33000 },
  { name: 'Jun', revenue: 67000, profit: 32000, expenses: 35000 },
  { name: 'Jul', revenue: 72000, profit: 38000, expenses: 34000 },
  { name: 'Aug', revenue: 69000, profit: 35000, expenses: 34000 },
  { name: 'Sep', revenue: 75000, profit: 42000, expenses: 33000 },
  { name: 'Oct', revenue: 78000, profit: 45000, expenses: 33000 },
  { name: 'Nov', revenue: 82000, profit: 48000, expenses: 34000 },
  { name: 'Dec', revenue: 85000, profit: 52000, expenses: 33000 }
];

const mockUserEngagementData = [
  { name: 'Mon', active: 1250, sessions: 2100, newUsers: 89, returningUsers: 1161 },
  { name: 'Tue', active: 1320, sessions: 2250, newUsers: 95, returningUsers: 1225 },
  { name: 'Wed', active: 1180, sessions: 1980, newUsers: 78, returningUsers: 1102 },
  { name: 'Thu', active: 1420, sessions: 2380, newUsers: 112, returningUsers: 1308 },
  { name: 'Fri', active: 1380, sessions: 2320, newUsers: 98, returningUsers: 1282 },
  { name: 'Sat', active: 980, sessions: 1650, newUsers: 67, returningUsers: 913 },
  { name: 'Sun', active: 890, sessions: 1480, newUsers: 54, returningUsers: 836 }
];

const mockPerformanceData = [
  { name: '00:00', responseTime: 245, uptime: 99.8 },
  { name: '04:00', responseTime: 189, uptime: 99.9 },
  { name: '08:00', responseTime: 267, uptime: 99.7 },
  { name: '12:00', responseTime: 312, uptime: 99.6 },
  { name: '16:00', responseTime: 298, uptime: 99.8 },
  { name: '20:00', responseTime: 234, uptime: 99.9 }
];

const mockGeographicData = [
  { name: 'North America', value: 4500 },
  { name: 'Europe', value: 3200 },
  { name: 'Asia', value: 2800 },
  { name: 'South America', value: 1200 },
  { name: 'Africa', value: 800 },
  { name: 'Oceania', value: 500 }
];

const mockCategoryData = [
  { name: 'Web Development', revenue: 125000, orders: 245 },
  { name: 'Design', revenue: 98000, orders: 312 },
  { name: 'Marketing', revenue: 87000, orders: 189 },
  { name: 'Writing', revenue: 76000, orders: 398 },
  { name: 'Video', revenue: 65000, orders: 156 },
  { name: 'Translation', revenue: 54000, orders: 267 }
];

const mockInsights = [
  {
    id: '1',
    type: 'opportunity' as const,
    title: 'High-Value Customer Segment Identified',
    description: 'Premium users from tech companies show 40% higher lifetime value and 65% better retention rates.',
    impact: 'high' as const,
    confidence: 94,
    actionable: true,
    recommendation: 'Focus marketing efforts on tech companies and create premium onboarding flows.',
    confidence: 94
  },
  {
    id: '2',
    type: 'warning' as const,
    title: 'Churn Risk in Mobile Users',
    description: 'Mobile app users show 23% higher churn rate in their second month compared to web users.',
    impact: 'medium' as const,
    confidence: 87,
    actionable: true,
    recommendation: 'Improve mobile app onboarding and add push notifications for engagement.',
    confidence: 87
  },
  {
    id: '3',
    type: 'success' as const,
    title: 'Email Campaign Performance Exceeding Targets',
    description: 'Recent email campaigns show 34% open rate and 8.2% click-through rate, both above industry benchmarks.',
    impact: 'medium' as const,
    confidence: 96,
    actionable: false,
    recommendation: 'Scale successful email template to other customer segments.',
    confidence: 96
  }
];

const mockAIInsights = [
  {
    id: '1',
    type: 'recommendation' as const,
    category: 'revenue' as const,
    title: 'Optimize Pricing Strategy for Premium Services',
    description: 'Analysis shows premium services are underpriced by 15-20% compared to market value and customer willingness to pay.',
    impact: 'high' as const,
    confidence: 92,
    urgency: 'high' as const,
    actionItems: [
      'Conduct A/B test with 15% price increase on premium services',
      'Survey existing premium customers about price sensitivity',
      'Analyze competitor pricing for similar service tiers',
      'Implement dynamic pricing based on demand patterns'
    ],
    potentialValue: 125000,
    timeframe: '3-6 months',
    dataPoints: 15420,
    trend: 'increasing' as const,
    createdAt: new Date('2024-01-15'),
    isBookmarked: false
  },
  {
    id: '2',
    type: 'anomaly' as const,
    category: 'users' as const,
    title: 'Unusual Spike in User Acquisition from Social Media',
    description: 'Social media referrals increased by 340% in the last week, primarily from LinkedIn and Twitter.',
    impact: 'medium' as const,
    confidence: 88,
    urgency: 'medium' as const,
    actionItems: [
      'Investigate source of social media traffic spike',
      'Identify which content or campaigns drove the increase',
      'Optimize landing pages for social media traffic',
      'Scale successful social media strategies'
    ],
    potentialValue: 45000,
    timeframe: '2-4 weeks',
    dataPoints: 8740,
    trend: 'increasing' as const,
    createdAt: new Date('2024-01-14'),
    isBookmarked: true
  },
  {
    id: '3',
    type: 'prediction' as const,
    category: 'performance' as const,
    title: 'Expected Server Capacity Issues in Q2',
    description: 'Current growth trends suggest server capacity will reach 85% utilization by April, potentially causing performance issues.',
    impact: 'high' as const,
    confidence: 91,
    urgency: 'critical' as const,
    actionItems: [
      'Plan infrastructure scaling for Q2',
      'Optimize database queries and caching',
      'Implement load balancing improvements',
      'Consider CDN expansion for static assets'
    ],
    potentialValue: 0,
    timeframe: '6-8 weeks',
    dataPoints: 23150,
    trend: 'increasing' as const,
    createdAt: new Date('2024-01-13'),
    isBookmarked: false
  }
];

const mockBusinessMetrics = [
  {
    id: '1',
    name: 'Monthly Recurring Revenue',
    value: 485000,
    target: 500000,
    unit: '$',
    trend: 8.5,
    status: 'on_track' as const,
    category: 'Revenue',
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Customer Acquisition Cost',
    value: 125,
    target: 100,
    unit: '$',
    trend: -5.2,
    status: 'at_risk' as const,
    category: 'Marketing',
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: '3',
    name: 'Customer Lifetime Value',
    value: 2850,
    target: 2500,
    unit: '$',
    trend: 12.3,
    status: 'exceeding' as const,
    category: 'Revenue',
    lastUpdated: new Date('2024-01-14')
  }
];

const mockMarketTrends = [
  {
    id: '1',
    title: 'Remote Work Technology Adoption',
    description: 'Continued growth in remote work tools and collaboration platforms, with 67% of companies planning permanent remote options.',
    impact: 'positive' as const,
    relevance: 95,
    timeframe: '6-12 months',
    source: 'Industry Research'
  },
  {
    id: '2',
    title: 'AI Integration in Service Platforms',
    description: 'Increasing demand for AI-powered features in service marketplaces, with 78% of users expecting AI recommendations.',
    impact: 'positive' as const,
    relevance: 88,
    timeframe: '3-6 months',
    source: 'Market Analysis'
  },
  {
    id: '3',
    title: 'Economic Uncertainty Impact',
    description: 'Potential economic slowdown may affect discretionary spending on premium services in Q2-Q3.',
    impact: 'negative' as const,
    relevance: 72,
    timeframe: '3-9 months',
    source: 'Economic Forecast'
  }
];

export default function AnalyticsDemoPage() {
  const [activeDemo, setActiveDemo] = useState('dashboard');
  const [timeRange, setTimeRange] = useState('month');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">
              Advanced Analytics & Business Intelligence
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Comprehensive analytics platform with real-time monitoring, AI-powered insights, 
              and advanced business intelligence for data-driven decision making.
            </p>
            <div className="flex justify-center items-center space-x-8 text-lg">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6" />
                <span>Advanced Dashboards</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-6 h-6" />
                <span>Real-Time Analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-6 h-6" />
                <span>AI Insights</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Demo Navigation */}
        <Tabs value={activeDemo} onValueChange={setActiveDemo} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="realtime" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Real-Time Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Business Intelligence</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-8">
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                    <span>Advanced Analytics Dashboard</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Comprehensive analytics dashboard with interactive charts, key performance indicators, 
                    and detailed business metrics. Features multiple visualization types including area charts, 
                    bar charts, pie charts, and complex data compositions.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <DollarSign className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                      <div className="text-lg font-bold">$285K</div>
                      <div className="text-sm text-muted-foreground">Total Revenue</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <Users className="w-8 h-8 mx-auto text-green-600 mb-2" />
                      <div className="text-lg font-bold">12.5K</div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <TrendingUp className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                      <div className="text-lg font-bold">78.5%</div>
                      <div className="text-sm text-muted-foreground">Engagement</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <Clock className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                      <div className="text-lg font-bold">245ms</div>
                      <div className="text-sm text-muted-foreground">Response Time</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <AdvancedAnalyticsDashboard
                timeRange={timeRange as any}
                metrics={mockMetrics}
                revenueData={mockRevenueData}
                userEngagementData={mockUserEngagementData}
                performanceData={mockPerformanceData}
                geographicData={mockGeographicData}
                categoryData={mockCategoryData}
                insights={mockInsights}
                onTimeRangeChange={setTimeRange}
                onExportData={(format) => console.log('Export:', format)}
                onRefreshData={() => console.log('Refreshing data...')}
              />
            </div>
          </TabsContent>

          <TabsContent value="realtime" className="mt-8">
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-6 h-6 text-green-500" />
                    <span>Real-Time Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Live analytics with real-time data streaming, animated charts, and instant event feeds. 
                    Monitor your platform's performance as it happens with live metrics, user activity tracking, 
                    and system health monitoring.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mx-auto mb-2" />
                      <div className="font-bold">Live</div>
                      <div className="text-xs text-muted-foreground">Data Stream</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <Eye className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                      <div className="font-bold">1,247</div>
                      <div className="text-xs text-muted-foreground">Online Now</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <Activity className="w-6 h-6 mx-auto text-purple-600 mb-1" />
                      <div className="font-bold">89/sec</div>
                      <div className="text-xs text-muted-foreground">Events</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <Zap className="w-6 h-6 mx-auto text-orange-600 mb-1" />
                      <div className="font-bold">99.8%</div>
                      <div className="text-xs text-muted-foreground">Uptime</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <RealTimeAnalytics
                isLive={true}
                refreshInterval={3000}
                maxDataPoints={30}
                showEventFeed={true}
                onToggleLive={(isLive) => console.log('Toggle live:', isLive)}
                onMetricAlert={(metric) => console.log('Metric alert:', metric)}
              />
            </div>
          </TabsContent>

          <TabsContent value="intelligence" className="mt-8">
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-6 h-6 text-purple-500" />
                    <span>AI-Powered Business Intelligence</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Advanced AI-powered insights and recommendations system. Leverages machine learning 
                    to identify opportunities, predict trends, detect anomalies, and provide actionable 
                    business intelligence with confidence scoring and impact analysis.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
                      <Target className="w-6 h-6 mx-auto text-indigo-600 mb-1" />
                      <div className="font-bold">15</div>
                      <div className="text-xs text-muted-foreground">AI Insights</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <Award className="w-6 h-6 mx-auto text-red-600 mb-1" />
                      <div className="font-bold">3</div>
                      <div className="text-xs text-muted-foreground">Critical Issues</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <TrendingUp className="w-6 h-6 mx-auto text-green-600 mb-1" />
                      <div className="font-bold">7</div>
                      <div className="text-xs text-muted-foreground">Opportunities</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <DollarSign className="w-6 h-6 mx-auto text-purple-600 mb-1" />
                      <div className="font-bold">$315K</div>
                      <div className="text-xs text-muted-foreground">Potential Value</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <BusinessIntelligence
                insights={mockAIInsights}
                metrics={mockBusinessMetrics}
                marketTrends={mockMarketTrends}
                onInsightAction={(id, action) => console.log('Insight action:', id, action)}
                onInsightFeedback={(id, feedback) => console.log('Insight feedback:', id, feedback)}
                onBookmarkInsight={(id) => console.log('Bookmark insight:', id)}
                onRefreshInsights={() => console.log('Refreshing insights...')}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Feature Highlights */}
        <Card className="glass-card mt-12">
          <CardHeader>
            <CardTitle className="text-center">📊 Analytics & BI System Completed!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <BarChart3 className="w-12 h-12 mx-auto text-blue-500" />
                <h3 className="font-semibold">Advanced Dashboards</h3>
                <p className="text-sm text-muted-foreground">
                  Interactive charts with drill-down capabilities and comprehensive KPIs
                </p>
              </div>
              <div className="space-y-2">
                <Activity className="w-12 h-12 mx-auto text-green-500" />
                <h3 className="font-semibold">Real-Time Monitoring</h3>
                <p className="text-sm text-muted-foreground">
                  Live data streaming with instant alerts and event tracking
                </p>
              </div>
              <div className="space-y-2">
                <Brain className="w-12 h-12 mx-auto text-purple-500" />
                <h3 className="font-semibold">AI-Powered Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Machine learning recommendations with confidence scoring
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
