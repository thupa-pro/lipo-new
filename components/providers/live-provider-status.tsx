'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  Clock,
  CheckCircle,
  Activity,
  Star
} from 'lucide-react';

interface LiveProviderStatusProps {
  liveCount: number;
}

export function LiveProviderStatus({ liveCount }: LiveProviderStatusProps) {
  const stats = [
    {
      label: 'Average Response',
      value: '< 2 min',
      icon: Clock,
      color: 'text-blue-500'
    },
    {
      label: 'Success Rate',
      value: '98.7%',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      label: 'Online Now',
      value: `${Math.floor(liveCount * 0.82)}`,
      icon: Activity,
      color: 'text-purple-500'
    }
  ];

  return (
    <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-3xl overflow-hidden max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Live Count Display */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <div className="relative">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping opacity-20"></div>
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-semibold">
                LIVE STATUS
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                {liveCount.toLocaleString()}+
              </div>
              <div className="text-xl text-gray-600 dark:text-gray-300 font-medium">
                Professionals Available Now
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
