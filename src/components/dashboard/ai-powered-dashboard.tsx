"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { enhancedRecommendationEngine } from '@/lib/ai/enhanced-recommendations';
import { enhancedNotificationEngine } from '@/lib/notifications/enhanced-notifications';
import { geolocationService } from '@/lib/location/geolocation-service';
import { Activity, TrendingUp, Clock, Target, Bell, MapPin, DollarSign, Users, Star, Zap } from 'lucide-react';

interface DashboardInsight {
  id: string;
  type: 'opportunity' | 'performance' | 'recommendation' | 'alert' | 'trend';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  actionText?: string;
  actionUrl?: string;
  value?: number;
  change?: number;
  confidence: number;
  metadata: {
    category?: string;
    timeframe?: string;
    impact?: 'positive' | 'negative' | 'neutral';
    source?: string;
  };
}

interface PersonalizedWidget {
  id: string;
  type: 'metric' | 'chart' | 'list' | 'map' | 'recommendation' | 'action';
  title: string;
  priority: number;
  data: any;
  refreshInterval?: number;
  adaptive: boolean;
}

interface UserGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  deadline: Date;
  category: string;
  progress: number;
  predictions: {
    likelihood: number;
    estimatedCompletion: Date;
    recommendations: string[];
  };
}

interface SmartAlert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  actionable: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    primary?: boolean;
  }>;
  aiGenerated: boolean;
  importance: number;
}

export default function AIPoweredDashboard({ userId }: { userId: string }) {
  const [insights, setInsights] = useState<DashboardInsight[]>([]);
  const [widgets, setWidgets] = useState<PersonalizedWidget[]>([]);
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month' | 'quarter'>('week');
  const [dashboardMode, setDashboardMode] = useState<'overview' | 'analytics' | 'goals' | 'recommendations'>('overview');

  // Personalized dashboard configuration
  const [dashboardConfig, setDashboardConfig] = useState({
    layout: 'smart', // 'smart' | 'compact' | 'detailed'
    autoRefresh: true,
    aiSuggestions: true,
    predictiveInsights: true,
    learningMode: true
  });

  // Initialize dashboard with AI-powered personalization
  useEffect(() => {
    initializeAIDashboard();
  }, [userId, selectedTimeframe]);

  // Auto-refresh intelligent insights
  useEffect(() => {
    if (dashboardConfig.autoRefresh) {
      const interval = setInterval(() => {
        refreshIntelligentInsights();
      }, 300000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [dashboardConfig.autoRefresh]);

  const initializeAIDashboard = async () => {
    setLoading(true);
    
    try {
      // Generate personalized insights using AI
      const [
        personalizedInsights,
        adaptiveWidgets,
        intelligentGoals,
        smartAlerts
      ] = await Promise.all([
        generatePersonalizedInsights(),
        createAdaptiveWidgets(),
        analyzeUserGoals(),
        generateSmartAlerts()
      ]);

      setInsights(personalizedInsights);
      setWidgets(adaptiveWidgets);
      setGoals(intelligentGoals);
      setAlerts(smartAlerts);

      // Learn from user interaction patterns
      if (dashboardConfig.learningMode) {
        await learnFromUserBehavior();
      }
    } catch (error) {
      console.error('Dashboard initialization failed:', error);
      setAlerts([{
        id: 'init-error',
        type: 'error',
        title: 'Dashboard Loading Issue',
        message: 'Some features may not be available. Please refresh.',
        actionable: true,
        actions: [{ label: 'Refresh', action: () => window.location.reload() }],
        aiGenerated: false,
        importance: 0.8
      }]);
    } finally {
      setLoading(false);
    }
  };

  const generatePersonalizedInsights = async (): Promise<DashboardInsight[]> => {
    const insights: DashboardInsight[] = [];

    try {
      // Get AI recommendations for business insights
      const recommendations = await enhancedRecommendationEngine.generatePersonalizedRecommendations(
        userId,
        { timeframe: selectedTimeframe },
        { limit: 5, explainability: true }
      );

      // Convert recommendations to insights
      recommendations.recommendations.forEach((rec, index) => {
        insights.push({
          id: `rec-${rec.id}`,
          type: 'recommendation',
          priority: index === 0 ? 'high' : 'medium',
          title: `Optimization Opportunity: ${rec.title}`,
          description: rec.personalizedReasons.join('. ') || rec.description,
          actionText: 'Explore',
          actionUrl: `/services/${rec.id}`,
          confidence: rec.confidence,
          metadata: {
            category: rec.metadata.category,
            impact: 'positive',
            source: 'ai_recommendations'
          }
        });
      });

      // Generate performance insights
      const performanceInsights = await generatePerformanceInsights();
      insights.push(...performanceInsights);

      // Generate trend insights
      const trendInsights = await generateTrendInsights();
      insights.push(...trendInsights);

      // Generate opportunity insights
      const opportunityInsights = await generateOpportunityInsights();
      insights.push(...opportunityInsights);

    } catch (error) {
      console.error('Failed to generate insights:', error);
    }

    return insights.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const createAdaptiveWidgets = async (): Promise<PersonalizedWidget[]> => {
    const widgets: PersonalizedWidget[] = [];

    // Core performance metrics widget
    widgets.push({
      id: 'performance-metrics',
      type: 'metric',
      title: 'Key Performance Indicators',
      priority: 1,
      data: await generatePerformanceMetrics(),
      refreshInterval: 300000, // 5 minutes
      adaptive: true
    });

    // AI-powered recommendations widget
    widgets.push({
      id: 'ai-recommendations',
      type: 'recommendation',
      title: 'Smart Recommendations',
      priority: 2,
      data: await generateSmartRecommendations(),
      refreshInterval: 600000, // 10 minutes
      adaptive: true
    });

    // Predictive analytics widget
    widgets.push({
      id: 'predictive-analytics',
      type: 'chart',
      title: 'Predictive Insights',
      priority: 3,
      data: await generatePredictiveAnalytics(),
      refreshInterval: 900000, // 15 minutes
      adaptive: true
    });

    // Location-based opportunities
    const location = await geolocationService.getCurrentLocation();
    if (location) {
      widgets.push({
        id: 'location-opportunities',
        type: 'map',
        title: 'Location-Based Opportunities',
        priority: 4,
        data: await generateLocationInsights(location),
        refreshInterval: 600000,
        adaptive: true
      });
    }

    // Real-time activity feed
    widgets.push({
      id: 'activity-feed',
      type: 'list',
      title: 'Recent Activity & Trends',
      priority: 5,
      data: await generateActivityFeed(),
      refreshInterval: 180000, // 3 minutes
      adaptive: true
    });

    return widgets.sort((a, b) => a.priority - b.priority);
  };

  const analyzeUserGoals = async (): Promise<UserGoal[]> => {
    // AI-powered goal analysis and predictions
    const goals: UserGoal[] = [
      {
        id: 'revenue-goal',
        title: 'Monthly Revenue Target',
        description: 'Increase monthly service revenue',
        target: 10000,
        current: 7500,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        category: 'financial',
        progress: 75,
        predictions: {
          likelihood: 0.85,
          estimatedCompletion: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          recommendations: [
            'Focus on premium service offerings',
            'Increase marketing in high-demand areas',
            'Optimize pricing for peak hours'
          ]
        }
      },
      {
        id: 'customer-satisfaction',
        title: 'Customer Satisfaction Score',
        description: 'Maintain 4.5+ star rating',
        target: 4.5,
        current: 4.3,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        category: 'quality',
        progress: 95.6,
        predictions: {
          likelihood: 0.92,
          estimatedCompletion: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          recommendations: [
            'Follow up with recent customers',
            'Address common feedback themes',
            'Enhance service delivery process'
          ]
        }
      }
    ];

    return goals;
  };

  const generateSmartAlerts = async (): Promise<SmartAlert[]> => {
    const alerts: SmartAlert[] = [];

    try {
      // AI-generated performance alerts
      const performanceAlerts = await analyzePerformanceAnomalies();
      alerts.push(...performanceAlerts);

      // Opportunity alerts
      const opportunityAlerts = await generateOpportunityAlerts();
      alerts.push(...opportunityAlerts);

      // System health alerts
      const systemAlerts = await generateSystemAlerts();
      alerts.push(...systemAlerts);

    } catch (error) {
      console.error('Failed to generate alerts:', error);
    }

    return alerts.sort((a, b) => b.importance - a.importance);
  };

  const refreshIntelligentInsights = async () => {
    const newInsights = await generatePersonalizedInsights();
    setInsights(prev => {
      // Merge new insights with existing ones, avoiding duplicates
      const existingIds = new Set(prev.map(i => i.id));
      const uniqueNewInsights = newInsights.filter(i => !existingIds.has(i.id));
      return [...prev, ...uniqueNewInsights].slice(0, 20); // Keep latest 20
    });
  };

  const learnFromUserBehavior = async () => {
    // Track user interactions with dashboard elements
    // This would integrate with the recommendation engine's feedback system
    console.log('Learning from user behavior patterns...');
  };

  const renderInsightCard = (insight: DashboardInsight) => (
    <Card key={insight.id} className={`transition-all hover:shadow-md ${
      insight.priority === 'urgent' ? 'border-red-200 bg-red-50' :
      insight.priority === 'high' ? 'border-orange-200 bg-orange-50' :
      insight.priority === 'medium' ? 'border-blue-200 bg-blue-50' :
      'border-gray-200'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={
              insight.priority === 'urgent' ? 'destructive' :
              insight.priority === 'high' ? 'default' :
              'secondary'
            }>
              {insight.priority}
            </Badge>
            {insight.confidence && (
              <Badge variant="outline" className="text-xs">
                {Math.round(insight.confidence * 100)}% confident
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-3">{insight.description}</CardDescription>
        {insight.value !== undefined && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold">{insight.value}</span>
            {insight.change && (
              <span className={`text-sm flex items-center ${
                insight.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {insight.change > 0 ? '+' : ''}{insight.change}%
              </span>
            )}
          </div>
        )}
        {insight.actionText && (
          <Button size="sm" variant="outline" className="mt-2">
            {insight.actionText}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const renderGoalCard = (goal: UserGoal) => (
    <Card key={goal.id} className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{goal.title}</CardTitle>
        <CardDescription>{goal.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{goal.current} / {goal.target}</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Likelihood: {Math.round(goal.predictions.likelihood * 100)}%</span>
            <span>Due: {goal.deadline.toLocaleDateString()}</span>
          </div>
          {goal.predictions.recommendations.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium mb-1">AI Recommendations:</p>
              <ul className="text-xs space-y-1">
                {goal.predictions.recommendations.slice(0, 2).map((rec, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <Zap className="w-3 h-3 mt-0.5 text-blue-500 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderWidget = (widget: PersonalizedWidget) => {
    switch (widget.type) {
      case 'metric':
        return (
          <Card key={widget.id} className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {widget.data?.metrics?.map((metric: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                    {metric.change && (
                      <div className={`text-xs flex items-center justify-center mt-1 ${
                        metric.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'recommendation':
        return (
          <Card key={widget.id} className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                {widget.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {widget.data?.recommendations?.slice(0, 3).map((rec: any, index: number) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-sm">{rec.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{rec.description}</div>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">
                        {Math.round(rec.confidence * 100)}% match
                      </Badge>
                      <Button size="sm" variant="ghost" className="text-xs">
                        Apply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card key={widget.id} className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Widget content loading...</p>
            </CardContent>
          </Card>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with AI Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI-Powered Dashboard</h1>
          <p className="text-gray-600">Personalized insights and recommendations for your business</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            AI Active
          </Badge>
          <Button variant="outline" size="sm" onClick={() => refreshIntelligentInsights()}>
            Refresh Insights
          </Button>
        </div>
      </div>

      {/* Smart Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.slice(0, 2).map(alert => (
            <Alert key={alert.id} className={
              alert.type === 'error' ? 'border-red-200 bg-red-50' :
              alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
              alert.type === 'success' ? 'border-green-200 bg-green-50' :
              'border-blue-200 bg-blue-50'
            }>
              <Bell className="h-4 w-4" />
              <AlertTitle className="flex items-center gap-2">
                {alert.title}
                {alert.aiGenerated && <Badge variant="outline" className="text-xs">AI Generated</Badge>}
              </AlertTitle>
              <AlertDescription className="mt-1">
                {alert.message}
                {alert.actions && (
                  <div className="flex gap-2 mt-2">
                    {alert.actions.map((action, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant={action.primary ? "default" : "outline"}
                        onClick={action.action}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs value={dashboardMode} onValueChange={(value: any) => setDashboardMode(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Adaptive Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {widgets.map(renderWidget)}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Performance Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.filter(i => i.type === 'performance').map(renderInsightCard)}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* AI-Analyzed Goals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map(renderGoalCard)}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {/* AI Insights and Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.filter(i => ['recommendation', 'opportunity'].includes(i.type)).map(renderInsightCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper functions for generating dashboard data
async function generatePerformanceInsights(): Promise<DashboardInsight[]> {
  return [
    {
      id: 'perf-1',
      type: 'performance',
      priority: 'medium',
      title: 'Booking Rate Increase',
      description: 'Your booking rate has increased by 15% this week compared to last week.',
      value: 85,
      change: 15,
      confidence: 0.92,
      metadata: {
        category: 'bookings',
        timeframe: 'week',
        impact: 'positive',
        source: 'analytics'
      }
    }
  ];
}

async function generateTrendInsights(): Promise<DashboardInsight[]> {
  return [
    {
      id: 'trend-1',
      type: 'trend',
      priority: 'medium',
      title: 'Seasonal Demand Shift',
      description: 'Indoor services are trending up 25% as weather patterns change.',
      value: 125,
      change: 25,
      confidence: 0.88,
      metadata: {
        category: 'demand',
        timeframe: 'season',
        impact: 'positive',
        source: 'trend_analysis'
      }
    }
  ];
}

async function generateOpportunityInsights(): Promise<DashboardInsight[]> {
  return [
    {
      id: 'opp-1',
      type: 'opportunity',
      priority: 'high',
      title: 'Premium Service Opportunity',
      description: 'High demand for premium services in your area with 40% higher rates.',
      actionText: 'Explore Premium',
      confidence: 0.85,
      metadata: {
        category: 'pricing',
        impact: 'positive',
        source: 'market_analysis'
      }
    }
  ];
}

async function generatePerformanceMetrics(): Promise<{ metrics: Array<{ label: string; value: string; change?: number }> }> {
  return {
    metrics: [
      { label: 'Revenue', value: '$12.5K', change: 18 },
      { label: 'Bookings', value: '147', change: 12 },
      { label: 'Rating', value: '4.8', change: 5 },
      { label: 'Response Rate', value: '95%', change: 3 }
    ]
  };
}

async function generateSmartRecommendations(): Promise<{ recommendations: Array<{ title: string; description: string; confidence: number }> }> {
  return {
    recommendations: [
      {
        title: 'Optimize Peak Hours',
        description: 'Increase rates by 20% during 6-8 PM for maximum revenue',
        confidence: 0.87
      },
      {
        title: 'Expand Service Area',
        description: 'Add coverage to downtown area with high demand',
        confidence: 0.82
      },
      {
        title: 'Add Premium Package',
        description: 'Bundle services for 30% higher average booking value',
        confidence: 0.79
      }
    ]
  };
}

async function generatePredictiveAnalytics(): Promise<any> {
  return {
    predictions: [
      { metric: 'Revenue', prediction: '$15.2K', confidence: 0.85 },
      { metric: 'Bookings', prediction: '180', confidence: 0.82 }
    ]
  };
}

async function generateLocationInsights(location: any): Promise<any> {
  return {
    opportunities: [
      { area: 'Downtown', demand: 'High', competition: 'Medium' },
      { area: 'Suburbs', demand: 'Growing', competition: 'Low' }
    ]
  };
}

async function generateActivityFeed(): Promise<any> {
  return {
    activities: [
      { type: 'booking', text: 'New booking from Sarah M.', time: '2 mins ago' },
      { type: 'review', text: '5-star review received', time: '1 hour ago' },
      { type: 'opportunity', text: 'New service area trending', time: '3 hours ago' }
    ]
  };
}

async function analyzePerformanceAnomalies(): Promise<SmartAlert[]> {
  return [
    {
      id: 'perf-anomaly-1',
      type: 'info',
      title: 'Unusual Activity Detected',
      message: 'Your booking rate is 40% higher than usual today. Consider adjusting availability.',
      actionable: true,
      actions: [
        { label: 'Adjust Schedule', action: () => console.log('Navigate to schedule') }
      ],
      aiGenerated: true,
      importance: 0.7
    }
  ];
}

async function generateOpportunityAlerts(): Promise<SmartAlert[]> {
  return [
    {
      id: 'opp-alert-1',
      type: 'success',
      title: 'Revenue Opportunity',
      message: 'Premium services in your area are booking 60% faster this week.',
      actionable: true,
      actions: [
        { label: 'Enable Premium', action: () => console.log('Enable premium services'), primary: true }
      ],
      aiGenerated: true,
      importance: 0.8
    }
  ];
}

async function generateSystemAlerts(): Promise<SmartAlert[]> {
  return [
    {
      id: 'system-alert-1',
      type: 'warning',
      title: 'Profile Optimization Needed',
      message: 'Your profile could attract 25% more bookings with better photos and descriptions.',
      actionable: true,
      actions: [
        { label: 'Optimize Profile', action: () => console.log('Navigate to profile') }
      ],
      aiGenerated: true,
      importance: 0.6
    }
  ];
}
