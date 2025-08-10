'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
  Target,
  Users,
  MapPin,
  Calendar,
  Brain,
  BarChart3,
  ArrowRight,
  Sparkles,
  Activity,
  Globe,
  Filter
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
  const [insights, setInsights] = useState([
    {
      id: 1,
      metric: 'Demand Surge',
      value: '+23%',
      trend: 'up' as const,
      description: 'Home repair requests',
      category: 'Home Services',
      timeframe: 'Last 7 days',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      id: 2,
      metric: 'Peak Hours',
      value: '2-6 PM',
      trend: 'neutral' as const,
      description: 'Highest booking activity',
      category: 'All Services',
      timeframe: 'Today',
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      id: 3,
      metric: 'Top Category',
      value: 'Tutoring',
      trend: 'up' as const,
      description: 'Most requested service',
      category: 'Education',
      timeframe: 'This week',
      icon: Target,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      id: 4,
      metric: 'Avg Response',
      value: '12 min',
      trend: 'down' as const,
      description: 'Provider response time',
      category: 'All Providers',
      timeframe: 'Real-time',
      icon: Zap,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    }
  ]);

  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setInsights(prev => prev.map(insight => {
        // Simulate small changes in real-time data
        if (insight.metric === 'Avg Response') {
          const currentValue = parseInt(insight.value);
          const newValue = Math.max(8, Math.min(20, currentValue + (Math.random() - 0.5) * 2));
          return {
            ...insight,
            value: `${Math.round(newValue)} min`,
            trend: newValue < currentValue ? 'down' as const : newValue > currentValue ? 'up' as const : 'neutral' as const
          };
        }
        return insight;
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const trendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const timeframes = [
    { label: '24h', value: '24h' },
    { label: '7d', value: '7d' },
    { label: '30d', value: '30d' },
    { label: 'Live', value: 'live' }
  ];

  return (
    <Card className="max-w-5xl mx-auto mb-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                AI Market Insights
                {isLive && (
                  <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></div>
                    LIVE
                  </Badge>
                )}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Real-time market trends and demand patterns
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {timeframes.map((timeframe) => (
                <Button
                  key={timeframe.value}
                  variant={selectedTimeframe === timeframe.value ? "default" : "ghost"}
                  size="sm"
                  className={`text-xs px-3 py-1 ${
                    selectedTimeframe === timeframe.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => {
                    setSelectedTimeframe(timeframe.value);
                    setIsLive(timeframe.value === 'live');
                  }}
                >
                  {timeframe.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Insights Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="group relative bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl ${insight.bgColor}`}>
                  <insight.icon className={`w-5 h-5 ${insight.color}`} />
                </div>
                {trendIcon(insight.trend)}
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {insight.metric}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {insight.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {insight.description}
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {insight.category}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {insight.timeframe}
                  </span>
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Market Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-800/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500 rounded-xl">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-green-800 dark:text-green-300">Trending Up</h3>
                <p className="text-sm text-green-600 dark:text-green-400">High demand services</p>
              </div>
            </div>
            <div className="space-y-2">
              {['Home Cleaning (+45%)', 'Math Tutoring (+38%)', 'Pet Care (+32%)'].map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-green-700 dark:text-green-300">{item.split(' (')[0]}</span>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                    {item.match(/\(([^)]+)\)/)?.[1]}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-xl">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-blue-800 dark:text-blue-300">Hot Locations</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">Highest activity areas</p>
              </div>
            </div>
            <div className="space-y-2">
              {['Downtown (+67%)', 'Suburbs (+45%)', 'University Area (+52%)'].map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-blue-700 dark:text-blue-300">{item.split(' (')[0]}</span>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs">
                    {item.match(/\(([^)]+)\)/)?.[1]}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="text-xs">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Full Analytics
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Filter className="w-4 h-4 mr-2" />
              Filter by Category
            </Button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Globe className="w-4 h-4" />
            <span>Updated {isLive ? 'live' : `${selectedTimeframe} ago`}</span>
            {isLive && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
