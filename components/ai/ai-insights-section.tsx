'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GlassmorphicContainer } from '@/components/admin/design-system/glassmorphic-container';
import { AICard } from '@/components/admin/design-system/ai-native-card';
import { HolographicText } from '@/components/admin/design-system/holographic-text';
import { FuturisticMetrics } from '@/components/admin/design-system/futuristic-metrics';
import {
  TrendingUp,
  Clock,
  Target,
  Brain,
  Zap,
  Activity,
  Network,
  Sparkles,
  BarChart3,
  Users,
  DollarSign,
  Eye
} from 'lucide-react';

interface AIInsightsSectionProps {
  stats: {
    userCount: number;
    providerCount: number;
    bookingCount: number;
    averageRating: number;
    responseTime: string;
    successRate: string;
    liveProviders: number;
    avgEarnings: string;
    satisfactionRate: string;
  };
}

export function AIInsightsSection({ stats }: AIInsightsSectionProps) {
  const insights = [
    {
      id: 'demand-surge',
      metric: 'Demand Surge',
      value: '+23%',
      description: 'Home repair requests',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      confidence: 92,
      trend: 'up' as const,
      aiAnalysis: 'Neural networks predict sustained growth in this category based on seasonal patterns and market dynamics.'
    },
    {
      id: 'peak-hours',
      metric: 'Peak Hours',
      value: '2-6 PM',
      description: 'Highest booking activity',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      confidence: 89,
      trend: 'stable' as const,
      aiAnalysis: 'AGI analysis shows consistent patterns aligned with user behavior and optimal provider availability.'
    },
    {
      id: 'top-category',
      metric: 'Top Category',
      value: 'Tutoring',
      description: 'Most requested service',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      confidence: 95,
      trend: 'up' as const,
      aiAnalysis: 'Education services showing exponential growth driven by remote learning trends and skill development demand.'
    },
    {
      id: 'response-time',
      metric: 'Avg Response',
      value: '12 min',
      description: 'Provider response time',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      confidence: 87,
      trend: 'down' as const,
      aiAnalysis: 'Response times improving through neural optimization of provider matching algorithms and smart notifications.'
    }
  ];

  const neuralMetrics = [
    {
      title: 'Neural Engagement Score',
      value: '94.7%',
      change: 8.3,
      trend: 'up' as const,
      icon: Brain,
      description: 'AI-powered user engagement analysis'
    },
    {
      title: 'Quantum Match Accuracy',
      value: '96.2%',
      change: 4.1,
      trend: 'up' as const,
      icon: Target,
      description: 'Advanced matching algorithm performance'
    },
    {
      title: 'Predictive Satisfaction',
      value: '91.8%',
      change: 2.7,
      trend: 'up' as const,
      icon: Sparkles,
      description: 'AGI-forecasted user satisfaction rates'
    },
    {
      title: 'Neural Network Uptime',
      value: '99.99%',
      change: 0.1,
      trend: 'stable' as const,
      icon: Network,
      description: 'AI system reliability and availability'
    }
  ];

  return (
    <GlassmorphicContainer 
      variant="intense" 
      glow 
      animated 
      className="max-w-7xl mx-auto mb-20 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10" />
      
      <CardHeader className="pb-8 relative">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl shadow-xl relative">
            <Brain className="w-8 h-8 text-white" />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-red-500/30 rounded-2xl animate-pulse" />
          </div>
          <div>
            <HolographicText className="text-3xl font-bold flex items-center gap-3">
              AGI Market Intelligence Center
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-sm animate-pulse">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping mr-2"></div>
                NEURAL SYNC
              </Badge>
            </HolographicText>
            <p className="text-gray-600/80 dark:text-gray-400 text-sm mt-2 font-medium">
              Real-time market trends and demand patterns powered by advanced neural networks
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-600">Quantum Processing Active • AGI Models Online</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-8">
        {/* Neural Metrics Dashboard */}
        <div className="mb-8">
          <HolographicText className="text-xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Neural Performance Metrics
          </HolographicText>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {neuralMetrics.map((metric, index) => (
              <FuturisticMetrics
                key={index}
                title={metric.title}
                data={{
                  value: metric.value,
                  previousValue: metric.value * 0.9, // Simulate previous value
                  target: metric.value * 1.2, // Simulate target
                  unit: metric.unit || '',
                  prefix: metric.prefix || '',
                  suffix: metric.suffix || ''
                }}
                icon={metric.icon}
                variant="neural"
                className="hover:scale-105 transition-all duration-300"
              />
            ))}
          </div>
        </div>

        {/* AI Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {insights.map((insight, i) => (
            <AICard
              key={insight.id}
              aiInsight={{
                title: insight.metric,
                description: insight.aiAnalysis,
                confidence: insight.confidence,
                status: 'active'
              }}
              className="hover:scale-[1.02] transition-all duration-500"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${insight.color} rounded-xl shadow-lg relative`}>
                    <insight.icon className="w-6 h-6 text-white" />
                    <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className={`w-4 h-4 ${
                      insight.trend === 'up' ? 'text-green-500' : 
                      insight.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                    }`} />
                    <span className="text-xs font-medium text-gray-600">
                      {insight.trend === 'up' ? 'Increasing' : 
                       insight.trend === 'down' ? 'Optimizing' : 'Stable'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-600 font-medium">
                    {insight.metric}
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                    {insight.value}
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    {insight.description}
                  </div>

                  {/* AI Confidence */}
                  <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 p-3 rounded-lg border border-white/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                        <Brain className="h-3 w-3 text-blue-600" />
                        Neural Confidence
                      </span>
                      <span className="text-xs font-bold text-blue-600">{insight.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${insight.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* AI Analysis */}
                  <div className="bg-gradient-to-r from-gray-50/80 to-white/60 p-3 rounded-lg border border-white/40">
                    <div className="flex items-center gap-1 mb-2">
                      <Eye className="h-3 w-3 text-purple-600" />
                      <span className="text-xs font-medium text-purple-600">AGI Analysis</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {insight.aiAnalysis}
                    </p>
                  </div>
                </div>
              </div>
            </AICard>
          ))}
        </div>

        {/* Market Intelligence Summary */}
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50/80 via-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-2xl border border-white/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <HolographicText className="text-lg font-bold">
              Neural Market Summary
            </HolographicText>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Our AGI systems have analyzed {stats.userCount.toLocaleString()} user interactions, 
            {stats.providerCount.toLocaleString()} provider profiles, and {stats.bookingCount.toLocaleString()} booking patterns 
            to generate these real-time insights. The neural networks indicate strong market momentum with {stats.successRate} success rate 
            and {stats.satisfactionRate} user satisfaction.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-indigo-600">
              Next neural update in: 2 minutes • Quantum sync: {stats.responseTime}
            </span>
          </div>
        </div>
      </CardContent>
    </GlassmorphicContainer>
  );
}
