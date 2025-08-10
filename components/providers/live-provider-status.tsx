'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  Clock,
  MapPin,
  Zap,
  CheckCircle,
  Activity,
  Globe,
  Smartphone,
  Wifi,
  Star,
  TrendingUp,
  Eye
} from 'lucide-react';

interface LiveProviderStatusProps {
  liveCount: number;
}

export function LiveProviderStatus({ liveCount }: LiveProviderStatusProps) {
  const [currentCount, setCurrentCount] = useState(liveCount);
  const [recentJoined, setRecentJoined] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Simulate real-time provider status updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate provider count changes (±1-5)
      const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
      const newCount = Math.max(0, currentCount + change);
      
      if (newCount !== currentCount) {
        setIsUpdating(true);
        setCurrentCount(newCount);
        
        // Simulate recent provider joins
        if (change > 0) {
          const newProviders = Array.from({ length: Math.abs(change) }, (_, i) => {
            const names = ['Sarah M.', 'John D.', 'Maria L.', 'David W.', 'Emma T.', 'Mike R.'];
            const services = ['Plumber', 'Cleaner', 'Tutor', 'Trainer', 'Electrician', 'Gardener'];
            return `${names[Math.floor(Math.random() * names.length)]} (${services[Math.floor(Math.random() * services.length)]})`;
          });
          
          setRecentJoined(prev => [...newProviders, ...prev].slice(0, 3));
        }
        
        setTimeout(() => setIsUpdating(false), 500);
      }
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, [currentCount]);

  const categories = [
    { name: 'Home Services', count: Math.floor(currentCount * 0.35), color: 'bg-blue-500', online: Math.floor(currentCount * 0.35 * 0.8) },
    { name: 'Wellness', count: Math.floor(currentCount * 0.25), color: 'bg-green-500', online: Math.floor(currentCount * 0.25 * 0.75) },
    { name: 'Education', count: Math.floor(currentCount * 0.2), color: 'bg-purple-500', online: Math.floor(currentCount * 0.2 * 0.9) },
    { name: 'Tech Support', count: Math.floor(currentCount * 0.15), color: 'bg-orange-500', online: Math.floor(currentCount * 0.15 * 0.85) },
    { name: 'Other', count: Math.floor(currentCount * 0.05), color: 'bg-gray-500', online: Math.floor(currentCount * 0.05 * 0.7) }
  ];

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
      value: `${Math.floor(currentCount * 0.82)}`,
      icon: Activity,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Main Status Card */}
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-3xl overflow-hidden">
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
                <div className={`text-5xl md:text-6xl font-bold text-gray-900 dark:text-white transition-all duration-500 ${isUpdating ? 'scale-105 text-blue-600' : ''}`}>
                  {currentCount.toLocaleString()}+
                </div>
                <div className="text-xl text-gray-600 dark:text-gray-300 font-medium">
                  Professionals Available Now
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Globe className="w-4 h-4" />
                  <span>Updated in real-time</span>
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

          {/* Category Breakdown */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Live by Category
              </h3>
              <Button variant="outline" size="sm" className="text-xs">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {category.count}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {category.online} online now
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          {recentJoined.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Just Joined
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    New professionals in the last few minutes
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                {recentJoined.map((provider, index) => (
                  <div key={index} className="flex items-center gap-3 py-2 px-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200/50 dark:border-green-800/50">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>{provider.split(' (')[0]}</strong> just came online
                    </span>
                    <Badge variant="secondary" className="text-xs ml-auto">
                      {provider.match(/\(([^)]+)\)/)?.[1]}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile App Promotion */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Smartphone className="w-6 h-6" />
                <Badge className="bg-white/20 text-white border-white/30">
                  Mobile App
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Get Instant Notifications
              </h3>
              <p className="text-blue-100 mb-4">
                Be the first to know when your ideal service provider comes online
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-blue-200">
                <div className="flex items-center gap-1">
                  <Wifi className="w-4 h-4" />
                  <span>Real-time alerts</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>Priority matching</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button className="bg-white text-gray-900 hover:bg-gray-100">
                <Smartphone className="w-4 h-4 mr-2" />
                Download App
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
