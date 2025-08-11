'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Bot,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Users,
  BarChart3,
  MessageSquare,
  MapPin,
  Eye,
  Smartphone,
  Globe,
  Rocket,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Sparkles,
  Crown,
  Lightning,
  Database,
  Cpu,
  Activity,
  Gauge,
  Lightbulb,
  Layers,
  Network,
  Fingerprint,
  Search,
  Filter,
  Bell,
  Calendar,
  DollarSign,
  PieChart,
  LineChart,
  MonitorSpeaker,
  Video,
  Mic,
  Camera,
  Settings,
  Lock,
  Unlock,
  Key,
  Wifi,
  Monitor,
  UserPlus,
  GraduationCap,
  Scale,
} from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  href: string;
  status: 'live' | 'beta' | 'coming-soon';
  category: string;
  isAdvanced?: boolean;
}

function FeatureCard({ title, description, icon: Icon, color, bgColor, href, status, category, isAdvanced }: FeatureCardProps) {
  return (
    <EnhancedCard variant="glass" className="group relative overflow-hidden hover:scale-105 transition-all duration-500">
      {isAdvanced && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-neural text-white text-xs">
            <Crown className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
      )}

      <EnhancedCardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-${isAdvanced ? 'neural' : status === 'live' ? 'quantum' : status === 'beta' ? 'trust' : 'plasma'} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <Badge
              variant={status === 'live' ? 'default' : status === 'beta' ? 'secondary' : 'outline'}
              className="text-xs"
            >
              {status === 'live' ? 'Live' : status === 'beta' ? 'Beta' : 'Coming Soon'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">{category}</p>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <EnhancedCardTitle className={`text-lg font-bold text-gradient-${isAdvanced ? 'neural' : status === 'live' ? 'quantum' : status === 'beta' ? 'trust' : 'plasma'} transition-colors`}>
            {title}
          </EnhancedCardTitle>
          <EnhancedCardDescription className="text-sm">
            {description}
          </EnhancedCardDescription>
        </div>
      </EnhancedCardHeader>

      <EnhancedCardContent className="pt-0 relative z-10">
        <Link href={href}>
          <EnhancedButton
            variant="outline"
            size="sm"
            className="w-full glass hover:bg-white/10 transition-all duration-300"
          >
            {status === 'live' ? 'Explore Feature' : status === 'beta' ? 'Try Beta' : 'Learn More'}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </EnhancedButton>
        </Link>
      </EnhancedCardContent>
    </EnhancedCard>
  );
}

export default function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const features = [
    // AI & Intelligence
    {
      title: "AI Job Discovery",
      description: "Smart recommendation engine that learns from your preferences to suggest the perfect service providers",
      icon: Brain,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/20 dark:to-fuchsia-900/20",
      href: "/ai-demo",
      status: "live" as const,
      category: "AI Intelligence",
      isAdvanced: true,
    },
    {
      title: "Smart Price Optimizer",
      description: "AI-driven dynamic pricing that optimizes costs for both customers and service providers",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20",
      href: "/ai/price-optimizer",
      status: "live" as const,
      category: "AI Intelligence",
      isAdvanced: true,
    },
    {
      title: "AI Chat Assistant",
      description: "Natural language processing for intelligent customer support and service recommendations",
      icon: Bot,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20",
      href: "/ai/chat",
      status: "beta" as const,
      category: "AI Intelligence",
      isAdvanced: true,
    },

    // Analytics & Insights
    {
      title: "Growth Analytics",
      description: "Comprehensive user acquisition metrics, retention analysis, and growth forecasting",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20",
      href: "/admin/growth-analytics",
      status: "live" as const,
      category: "Analytics",
    },
    {
      title: "Funnel Optimizer",
      description: "Advanced conversion tracking with bottleneck identification and A/B testing framework",
      icon: Gauge,
      color: "text-indigo-600",
      bgColor: "bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20",
      href: "/funnel-optimization",
      status: "live" as const,
      category: "Analytics",
    },
    {
      title: "A/B Testing Suite",
      description: "Complete testing framework with templates, statistical analysis, and insights",
      icon: Activity,
      color: "text-pink-600",
      bgColor: "bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20",
      href: "/ab-testing",
      status: "beta" as const,
      category: "Analytics",
    },

    // Mobile & Mobile-First
    {
      title: "Mobile Dashboard",
      description: "Native app-like mobile interface with gesture controls and offline capabilities",
      icon: Smartphone,
      color: "text-teal-600",
      bgColor: "bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/20",
      href: "/mobile-app",
      status: "live" as const,
      category: "Mobile Experience",
    },
    {
      title: "Biometric Authentication",
      description: "Fingerprint and face recognition login for secure, passwordless authentication",
      icon: Fingerprint,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20",
      href: "/auth/biometric",
      status: "beta" as const,
      category: "Mobile Experience",
      isAdvanced: true,
    },
    {
      title: "Mobile Payment Flow",
      description: "Streamlined mobile payment experience with one-tap payments and digital wallet integration",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-100 to-lime-100 dark:from-green-900/20 dark:to-lime-900/20",
      href: "/payments/mobile",
      status: "live" as const,
      category: "Mobile Experience",
    },

    // Real-time & Communication
    {
      title: "Real-time Chat",
      description: "Socket.io-powered messaging system with real-time notifications and file sharing",
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/20 dark:to-sky-900/20",
      href: "/messages",
      status: "live" as const,
      category: "Communication",
    },
    {
      title: "Interactive Gig Map",
      description: "Visual service provider mapping with real-time availability and location-based matching",
      icon: MapPin,
      color: "text-red-600",
      bgColor: "bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20",
      href: "/gig-map",
      status: "live" as const,
      category: "Discovery",
    },
    {
      title: "Push Notifications",
      description: "Smart notification system with personalized alerts and real-time updates",
      icon: Bell,
      color: "text-yellow-600",
      bgColor: "bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20",
      href: "/notifications",
      status: "live" as const,
      category: "Communication",
    },

    // Business Intelligence
    {
      title: "Monetization Engine",
      description: "Revenue optimization tools with smart bidding, tip boosting, and premium features",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20",
      href: "/monetization-engine",
      status: "live" as const,
      category: "Business Tools",
    },
    {
      title: "Provider Visibility Booster",
      description: "Advanced tools for service providers to increase profile visibility and booking rates",
      icon: Eye,
      color: "text-violet-600",
      bgColor: "bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20",
      href: "/provider/visibility-booster",
      status: "live" as const,
      category: "Business Tools",
    },
    {
      title: "Dynamic Wallet",
      description: "Advanced payment and earnings management with real-time transaction tracking",
      icon: Layers,
      color: "text-slate-600",
      bgColor: "bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-900/20 dark:to-gray-900/20",
      href: "/wallet",
      status: "beta" as const,
      category: "Business Tools",
    },

    // Advanced Admin
    {
      title: "Mission Control Dashboard",
      description: "AI-powered admin dashboard with real-time system monitoring and intelligent insights",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20",
      href: "/admin",
      status: "live" as const,
      category: "Administration",
      isAdvanced: true,
    },
    {
      title: "Content Moderation AI",
      description: "Automated content screening with machine learning-powered moderation tools",
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20",
      href: "/admin/content-moderation",
      status: "live" as const,
      category: "Administration",
      isAdvanced: true,
    },
    {
      title: "System Health Monitor",
      description: "Real-time system metrics, error tracking, and performance optimization tools",
      icon: Monitor,
      color: "text-cyan-600",
      bgColor: "bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20",
      href: "/admin/system-health-logs",
      status: "live" as const,
      category: "Administration",
    },

    // Specialized Features
    {
      title: "Multi-Region Support",
      description: "Geographic expansion tools with localized features and region-specific optimization",
      icon: Globe,
      color: "text-indigo-600",
      bgColor: "bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20",
      href: "/multi-region",
      status: "live" as const,
      category: "Platform",
    },
    {
      title: "Conflict Resolution AI",
      description: "Automated dispute resolution system with intelligent mediation and recommendation engine",
      icon: Scale,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20",
      href: "/disputes",
      status: "beta" as const,
      category: "Platform",
      isAdvanced: true,
    },
    {
      title: "Provider Training Hub",
      description: "Comprehensive certification and training system for service provider excellence",
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20",
      href: "/training-certification",
      status: "live" as const,
      category: "Education",
    },
  ];

  const categories = [
    { id: 'all', label: 'All Features', count: features.length },
    { id: 'AI Intelligence', label: 'AI Intelligence', count: features.filter(f => f.category === 'AI Intelligence').length },
    { id: 'Analytics', label: 'Analytics', count: features.filter(f => f.category === 'Analytics').length },
    { id: 'Mobile Experience', label: 'Mobile', count: features.filter(f => f.category === 'Mobile Experience').length },
    { id: 'Communication', label: 'Communication', count: features.filter(f => f.category === 'Communication').length },
    { id: 'Business Tools', label: 'Business', count: features.filter(f => f.category === 'Business Tools').length },
    { id: 'Administration', label: 'Admin', count: features.filter(f => f.category === 'Administration').length },
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === selectedCategory);

  const stats = {
    totalFeatures: features.length,
    liveFeatures: features.filter(f => f.status === 'live').length,
    betaFeatures: features.filter(f => f.status === 'beta').length,
    aiFeatures: features.filter(f => f.isAdvanced).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stratosphere via-cirrus to-white dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300">
      {/* Neural Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, hsl(var(--neural-500)) 2px, transparent 0),
                           radial-gradient(circle at 75px 75px, hsl(var(--quantum-500)) 1px, transparent 0)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <div className="relative z-10 responsive-container py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-neural">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gradient-neural tracking-tight">
                Intelligent Features
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Discover the hidden power of Loconomy's AI-driven platform
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <EnhancedCard variant="glass" className="text-center p-4">
              <p className="text-2xl font-bold text-gradient-neural">{stats.totalFeatures}</p>
              <p className="text-sm text-muted-foreground">Total Features</p>
            </EnhancedCard>
            <EnhancedCard variant="glass" className="text-center p-4">
              <p className="text-2xl font-bold text-gradient-quantum">{stats.liveFeatures}</p>
              <p className="text-sm text-muted-foreground">Live Now</p>
            </EnhancedCard>
            <EnhancedCard variant="glass" className="text-center p-4">
              <p className="text-2xl font-bold text-gradient-trust">{stats.betaFeatures}</p>
              <p className="text-sm text-muted-foreground">In Beta</p>
            </EnhancedCard>
            <EnhancedCard variant="glass" className="text-center p-4">
              <p className="text-2xl font-bold text-gradient-plasma">{stats.aiFeatures}</p>
              <p className="text-sm text-muted-foreground">AI-Powered</p>
            </EnhancedCard>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <EnhancedButton
                key={category.id}
                variant={selectedCategory === category.id ? 'premium' : 'glass'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="transition-all duration-300"
              >
                {category.label}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </EnhancedButton>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <EnhancedCard variant="premium" className="max-w-2xl mx-auto bg-gradient-ai text-white border-0">
            <EnhancedCardHeader>
              <EnhancedCardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6" />
                Ready to Experience the Future?
              </EnhancedCardTitle>
              <EnhancedCardDescription className="text-white/80">
                Join thousands of users already leveraging our intelligent platform features
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <EnhancedButton size="lg" className="bg-white text-purple-600 hover:bg-gray-100 hover:shadow-glow-neural">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Get Started Free
                  </EnhancedButton>
                </Link>
                <Link href="/demo">
                  <EnhancedButton variant="glass" size="lg" className="border-white text-white hover:bg-white/10">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </EnhancedButton>
                </Link>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </div>
      </div>
    </div>
  );
}
