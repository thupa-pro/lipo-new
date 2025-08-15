'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  MapPin,
  Star,
  Clock,
  ArrowRight,
  Sparkles,
  Brain,
  Users,
  TrendingUp,
  Award,
  Target,
  Menu,
  Bell,
  User,
  Home,
  Briefcase,
  MessageCircle,
  Settings,
  Zap
} from 'lucide-react';

// Import mobile-optimized components
import { MobileBottomNav } from '@/components/ui/floating-fab';
import { useDeviceDetection } from '@/lib/utils/device-detection';

interface MobileStatsProps {
  stats: {
    liveUsers: number;
    completedToday: number;
    revenueToday: number;
    successRate: string;
  };
}

const MobileStats = ({ stats }: MobileStatsProps) => (
  <div className="grid grid-cols-2 gap-3 mb-6">
    {[
      { label: 'Live Users', value: stats.liveUsers.toLocaleString(), icon: Users, color: 'text-purple-400' },
      { label: 'Completed', value: stats.completedToday.toString(), icon: Target, color: 'text-green-400' },
      { label: 'Revenue', value: `$${(stats.revenueToday / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-blue-400' },
      { label: 'Success', value: stats.successRate, icon: Award, color: 'text-yellow-400' }
    ].map((stat, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20"
      >
        <stat.icon className={`w-4 h-4 ${stat.color} mb-1`} />
        <div className="text-lg font-bold text-white">{stat.value}</div>
        <div className="text-xs text-gray-300">{stat.label}</div>
      </motion.div>
    ))}
  </div>
);

const QuickActions = () => (
  <div className="grid grid-cols-2 gap-3 mb-6">
    {[
      { title: 'Find Services', href: '/browse', icon: Search, gradient: 'from-purple-500 to-pink-500' },
      { title: 'Post Job', href: '/post-job', icon: Briefcase, gradient: 'from-blue-500 to-cyan-500' },
      { title: 'Messages', href: '/messages', icon: MessageCircle, gradient: 'from-green-500 to-emerald-500' },
      { title: 'Settings', href: '/settings', icon: Settings, gradient: 'from-orange-500 to-red-500' }
    ].map((action, index) => (
      <motion.div
        key={index}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link href={action.href}>
          <Card className="bg-gradient-to-br ${action.gradient} border-0 text-white h-20">
            <CardContent className="p-3 flex flex-col items-center justify-center h-full">
              <action.icon className="w-6 h-6 mb-1" />
              <span className="text-sm font-medium text-center">{action.title}</span>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    ))}
  </div>
);

const PopularServices = () => {
  const services = [
    { name: 'House Cleaning', rating: 4.9, price: '$89', available: '2h', trend: '+15%' },
    { name: 'Handyman', rating: 4.8, price: '$124', available: '45m', trend: '+8%' },
    { name: 'Pet Care', rating: 4.9, price: '$67', available: '1h', trend: '+23%' }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-400" />
        Popular Now
      </h3>
      {services.map((service, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardContent className="p-3">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-white text-sm">{service.name}</h4>
                <Badge className="bg-green-500/20 text-green-400 text-xs">
                  {service.trend}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1 text-gray-300">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span>{service.rating}</span>
                </div>
                <div className="text-white font-semibold">{service.price}</div>
                <div className="flex items-center gap-1 text-green-400">
                  <Clock className="w-3 h-3" />
                  <span>{service.available}</span>
                </div>
              </div>
              <Button size="sm" className="w-full mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                Book Now
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default function MobilePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [stats, setStats] = useState({
    liveUsers: 12847,
    completedToday: 1847,
    revenueToday: 284750,
    successRate: "98.7%"
  });

  const deviceInfo = useDeviceDetection();

  useEffect(() => {
    setIsClient(true);
    // Simulate real-time stats
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        liveUsers: prev.liveUsers + Math.floor(Math.random() * 10 - 4),
        revenueToday: prev.revenueToday + Math.floor(Math.random() * 500)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Redirect non-mobile users to desktop version
  useEffect(() => {
    if (isClient && !deviceInfo.isMobile) {
      window.location.href = '/';
    }
  }, [isClient, deviceInfo.isMobile]);

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Mobile Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.3),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.2),transparent)]" />
      </div>

      {/* Mobile Header */}
      <header className="relative z-10 p-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold text-white">Loconomy</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* AI Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-lg p-2 mb-4 border border-white/20"
        >
          <div className="flex items-center justify-center gap-2 text-white text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <Brain className="w-4 h-4" />
            <span>AI-Powered • Live: {stats.liveUsers.toLocaleString()}</span>
            <Zap className="w-4 h-4 animate-pulse" />
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-black text-white mb-2 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Find Local
            </span>
            <br />
            <span className="text-white">Services Fast</span>
          </h1>
          <p className="text-gray-300 text-sm mb-4">
            AI-powered matching • Instant booking • Trusted pros
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What service do you need?"
                className="pl-10 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-gray-400 rounded-xl h-12"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Your location"
                className="pl-10 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-gray-400 rounded-xl h-12"
              />
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white h-12 rounded-xl font-semibold">
              <Sparkles className="w-4 h-4 mr-2" />
              Find Services
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MobileStats stats={stats} />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <QuickActions />
        </motion.div>

        {/* Popular Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <PopularServices />
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav currentPath="/mobile" />

      {/* Mobile FAB */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        className="fixed bottom-20 right-4 z-50"
      >
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
}
