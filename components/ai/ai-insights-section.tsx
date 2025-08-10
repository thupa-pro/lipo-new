'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Clock,
  Target,
  Brain,
  Zap
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
      metric: 'Demand Surge',
      value: '+23%',
      description: 'Home repair requests',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      metric: 'Peak Hours',
      value: '2-6 PM',
      description: 'Highest booking activity',
      icon: Clock,
      color: 'text-blue-500'
    },
    {
      metric: 'Top Category',
      value: 'Tutoring',
      description: 'Most requested service',
      icon: Target,
      color: 'text-purple-500'
    },
    {
      metric: 'Avg Response',
      value: '12 min',
      description: 'Provider response time',
      icon: Zap,
      color: 'text-orange-500'
    }
  ];

  return (
    <Card className="max-w-5xl mx-auto mb-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              AI Market Insights
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></div>
                LIVE
              </Badge>
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Real-time market trends and demand patterns
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((insight, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <insight.icon className={`w-5 h-5 ${insight.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
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
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
