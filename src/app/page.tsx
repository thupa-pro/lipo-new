'use client';

import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useDeviceDetection, redirectToMobileIfNeeded } from '@/lib/utils/device-detection';

// Core UI Components
import { IntelligentHeader } from '@/components/ui/intelligent-header';
import { PWAProvider } from '@/components/ui/pwa-features';
import { ModernFooter } from '@/components/layout/modern-footer';
import { CommandPaletteHint } from '@/components/ui/command-palette-hint';
import { CommandPalette } from '@/components/ui/command-palette';
import { FloatingFAB, MobileBottomNav } from '@/components/ui/floating-fab';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Icons
import {
  Search,
  UserPlus,
  CheckCircle,
  MapPin,
  Sparkles,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Users,
  Clock,
  HomeIcon,
  GraduationCap,
  Car,
  Brain,
  HeadphonesIcon,
  Dumbbell,
  PartyPopper,
  Bot,
  Monitor,
  Briefcase,
  Mic,
  MessageCircle,
  TrendingUp,
  Globe,
  Rocket,
  Crown,
  Award,
  Target,
  Zap as Lightning,
  Eye,
  Layers,
  ChevronDown,
  Play,
  Palette,
  Code,
  Smartphone,
  Wifi,
} from 'lucide-react';

// Interactive components
import { HomePageClient } from './components/home-page-client';
import AIChat from '@/components/features/ai/AIChat';

// Enhanced stats with real-time simulation (client-only to prevent hydration issues)
const useRealTimeStats = () => {
  const [isClient, setIsClient] = useState(false);
  const [stats, setStats] = useState({
    userCount: 2400000,
    providerCount: 45000,
    bookingCount: 1200000,
    averageRating: 4.9,
    responseTime: "< 2hrs",
    successRate: "98.7%",
    liveUsers: 12847,
    revenueToday: 284750,
    completedToday: 1847
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        liveUsers: prev.liveUsers + Math.floor(Math.random() * 10 - 4),
        revenueToday: prev.revenueToday + Math.floor(Math.random() * 500),
        completedToday: prev.completedToday + Math.floor(Math.random() * 5)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [isClient]);

  return { stats, isClient };
};

// AI-Powered Personalization Hook (client-only)
const useAIPersonalization = () => {
  const [isClient, setIsClient] = useState(false);
  const [userIntent, setUserIntent] = useState('exploring');
  const [personalizedContent, setPersonalizedContent] = useState({
    heroText: "Connect with Local Service Professionals You Trust",
    ctaText: "Find Services Now",
    theme: 'default'
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Simulate AI-driven personalization based on time, location, behavior
    const hour = new Date().getHours();
    const isWeekend = [0, 6].includes(new Date().getDay());

    if (hour < 12) {
      setPersonalizedContent(prev => ({
        ...prev,
        heroText: "Start Your Day with Trusted Local Services",
        ctaText: "Book Morning Services"
      }));
    } else if (hour > 18) {
      setPersonalizedContent(prev => ({
        ...prev,
        heroText: "Evening Services at Your Fingertips",
        ctaText: "Book Evening Services"
      }));
    }

    if (isWeekend) {
      setPersonalizedContent(prev => ({
        ...prev,
        heroText: "Weekend Projects Made Easy",
        ctaText: "Find Weekend Experts"
      }));
    }
  }, [isClient]);

  return { userIntent, personalizedContent, isClient };
};

// Voice UI Hook
const useVoiceInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const startListening = useCallback(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        // AI-powered intent parsing would go here
      };
      
      recognition.start();
    }
  }, []);

  return { isListening, transcript, startListening };
};

// Advanced Categories with AI-enhanced data
const categories = [
  {
    id: '1',
    name: 'Smart Home Services',
    slug: 'smart-home',
    description: 'IoT installation, smart automation, and future-ready home upgrades.',
    icon_name: 'home',
    trend: '+127%',
    aiFeatures: ['Predictive Maintenance', 'Energy Optimization', 'Security Integration'],
    avgPrice: '$289',
    nextAvailable: '18 min'
  },
  {
    id: '2',
    name: 'AI Wellness & Fitness',
    slug: 'ai-wellness',
    description: 'Biometric trainers, VR fitness, and AI-powered wellness coaching.',
    icon_name: 'dumbbell',
    trend: '+89%',
    aiFeatures: ['Biometric Analysis', 'Custom Nutrition', 'Mental Health AI'],
    avgPrice: '$156',
    nextAvailable: '24 min'
  },
  {
    id: '3',
    name: 'Quantum Education',
    slug: 'quantum-education',
    description: 'AR/VR tutoring, AI mentorship, and immersive learning experiences.',
    icon_name: 'graduation-cap',
    trend: '+203%',
    aiFeatures: ['Adaptive Learning', 'Virtual Reality', 'AI Tutoring'],
    avgPrice: '$94',
    nextAvailable: '12 min'
  },
  {
    id: '4',
    name: 'Neural Tech Repair',
    slug: 'neural-tech',
    description: 'AI diagnostics, quantum computing, and next-gen device optimization.',
    icon_name: 'monitor',
    trend: '+156%',
    aiFeatures: ['Auto-Diagnosis', 'Predictive Fixes', 'Quantum Optimization'],
    avgPrice: '$247',
    nextAvailable: '31 min'
  },
  {
    id: '5',
    name: 'Autonomous Automotive',
    slug: 'autonomous-auto',
    description: 'EV optimization, self-driving upgrades, and smart vehicle services.',
    icon_name: 'car',
    trend: '+178%',
    aiFeatures: ['Self-Diagnosis', 'EV Optimization', 'Autonomous Upgrades'],
    avgPrice: '$412',
    nextAvailable: '45 min'
  },
  {
    id: '6',
    name: 'Metaverse Events',
    slug: 'metaverse-events',
    description: 'Virtual events, holographic entertainment, and immersive experiences.',
    icon_name: 'party-popper',
    trend: '+267%',
    aiFeatures: ['Virtual Reality', 'Holographic Display', 'AI Orchestration'],
    avgPrice: '$834',
    nextAvailable: '67 min'
  }
];

// Revenue Optimization Components
const PremiumUpgradeCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 2 }}
    className="fixed bottom-4 right-4 z-50 max-w-sm"
  >
    <Card className="bg-gradient-to-r from-indigo-600 to-sky-500 text-white border-0 shadow-2xl">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-yellow-300" />
          <div>
            <h4 className="font-bold">Upgrade to Loconomy Pro</h4>
            <p className="text-sm opacity-90">Skip the queue, premium support</p>
          </div>
          <Button size="sm" variant="secondary">
            $29/mo
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Main Homepage Component
export default function HomePage() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { stats, isClient: statsClient } = useRealTimeStats();
  const { personalizedContent, isClient: personalizationClient } = useAIPersonalization();
  const { isListening, startListening } = useVoiceInterface();
  const deviceInfo = useDeviceDetection();

  // Combined client flag
  const isClient = statsClient && personalizationClient;

  // Mobile redirect logic
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      // Optional: redirect mobile users to /mobile route
      // Uncomment the line below to enable automatic mobile redirect
      // redirectToMobileIfNeeded();
    }
  }, [isClient]);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Enhanced Glassmorphism Theme
  const glassTheme = {
    primary: 'backdrop-blur-xl bg-white/90 dark:bg-white/10 border border-slate-200/50 dark:border-white/20',
    secondary: 'backdrop-blur-lg bg-white/80 dark:bg-white/5 border border-slate-200/30 dark:border-white/10',
    accent: 'backdrop-blur-md bg-gradient-to-r from-indigo-50/80 to-sky-50/80 dark:from-purple-500/20 dark:to-pink-500/20 border border-indigo-200/40 dark:border-purple-300/30'
  };

  return (
    <PWAProvider>
      <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        {/* Dynamic Background with Floating Elements */}
        <div className="absolute inset-0">
          {/* Animated Gradient Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.03),transparent)] dark:bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.3),transparent)] animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(14,165,233,0.03),transparent)] dark:bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.2),transparent)]"></div>
          
          {/* Floating Geometric Shapes */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-indigo-200/40 dark:bg-white/20 rounded-full"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Intelligent Header */}
        <IntelligentHeader onCommandPaletteOpen={() => setIsCommandPaletteOpen(true)} />

        {/* Main Content */}
        <main className="relative z-10">
          {/* Revolutionary Hero Section */}
          <motion.section 
            ref={heroRef}
            style={{ y, opacity }}
            className="min-h-screen flex items-center justify-center px-4 py-20"
          >
            <div className="max-w-7xl mx-auto text-center">
              {/* AI Status Indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <Badge className={`${glassTheme.primary} text-slate-700 dark:text-white px-6 py-3 text-sm font-medium`}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <Brain className="w-4 h-4" />
                    <span>
                      {isClient
                        ? `AI-Powered • Live: ${stats.liveUsers.toLocaleString()} users`
                        : 'AI-Powered • Trusted by 2.4M+ Users'
                      }
                    </span>
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                </Badge>
              </motion.div>

              {/* Dynamic Hero Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight"
              >
                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 dark:from-blue-400 dark:via-purple-500 dark:to-pink-500 bg-clip-text text-transparent">
                  {personalizedContent.heroText.split(' ').slice(0, 3).join(' ')}
                </span>
                <br />
                <span className="text-slate-900 dark:text-white">
                  {personalizedContent.heroText.split(' ').slice(3).join(' ')}
                </span>
              </motion.h1>

              {/* Enhanced Value Proposition */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-slate-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
              >
                Experience the future of service discovery with AI-powered matching, 
                quantum-fast booking, and premium professionals in 200+ cities worldwide.
              </motion.p>

              {/* Revolutionary CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              >
                {/* Primary CTA with Micro-interactions */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/browse">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl border-0 group"
                    >
                      <Lightning className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                      {personalizedContent.ctaText}
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>

                {/* Voice Search CTA */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={startListening}
                    variant="outline" 
                    size="lg"
                    className={`${glassTheme.primary} text-slate-700 dark:text-white border-slate-200/50 dark:border-white/30 px-8 py-6 text-lg font-semibold rounded-full group`}
                  >
                    <Mic className={`w-5 h-5 mr-2 ${isListening ? 'text-red-400 animate-pulse' : ''}`} />
                    Voice Search
                    <span className="ml-2 text-xs opacity-75">Try: "Find a plumber"</span>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Real-time Stats Showcase */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              >
                {[
                  {
                    label: 'AI Matches Today',
                    value: isClient ? stats.completedToday : '1,847',
                    icon: Target,
                    color: 'text-green-400'
                  },
                  {
                    label: 'Revenue Generated',
                    value: isClient ? `$${(stats.revenueToday / 1000).toFixed(0)}K` : '$284K',
                    icon: TrendingUp,
                    color: 'text-blue-400'
                  },
                  {
                    label: 'Live Users',
                    value: isClient ? stats.liveUsers.toLocaleString() : '12,847',
                    icon: Users,
                    color: 'text-purple-400'
                  },
                  {
                    label: 'Success Rate',
                    value: stats.successRate,
                    icon: Award,
                    color: 'text-yellow-400'
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`${glassTheme.secondary} p-6 rounded-2xl text-center`}
                  >
                    <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                    <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-600 dark:text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* Enhanced Search Section */}
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`${glassTheme.primary} p-12 rounded-3xl shadow-2xl`}
              >
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
                    AI-Powered Service Discovery
                  </h2>
                  <p className="text-xl text-slate-600 dark:text-gray-300">
                    Describe what you need in natural language, our AI does the rest
                  </p>
                </div>
                
                <Suspense fallback={
                  <div className="h-96 animate-pulse bg-white/10 rounded-2xl"></div>
                }>
                  <HomePageClient />
                </Suspense>
              </motion.div>
            </div>
          </section>

          {/* Revolutionary Service Categories */}
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-5xl font-bold text-slate-800 dark:text-white mb-6">
                  Next-Generation Services
                </h2>
                <p className="text-xl text-slate-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Explore AI-enhanced services that blend cutting-edge technology with human expertise
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category, index) => {
                  const IconComponent = {
                    'home': HomeIcon,
                    'dumbbell': Dumbbell,
                    'graduation-cap': GraduationCap,
                    'monitor': Monitor,
                    'car': Car,
                    'party-popper': PartyPopper
                  }[category.icon_name] || HomeIcon;

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="group"
                    >
                      <Card className={`${glassTheme.primary} border-slate-200/50 dark:border-white/20 overflow-hidden h-full hover:border-indigo-300/80 dark:hover:border-purple-400/50 transition-all duration-500`}>
                        <CardHeader className="relative pb-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-4 bg-gradient-to-r from-indigo-500/20 to-sky-500/20 rounded-2xl">
                              <IconComponent className="w-8 h-8 text-indigo-600 dark:text-purple-400" />
                            </div>
                            <Badge className={`${category.trend.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} border-0`}>
                              {category.trend}
                            </Badge>
                          </div>
                          
                          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-purple-400 transition-colors">
                            {category.name}
                          </CardTitle>
                          
                          <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
                            {category.description}
                          </p>
                        </CardHeader>

                        <CardContent className="space-y-6">
                          {/* AI Features */}
                          <div>
                            <h4 className="text-sm font-semibold text-indigo-600 dark:text-purple-400 mb-3">AI FEATURES</h4>
                            <div className="flex flex-wrap gap-2">
                              {category.aiFeatures.map((feature, idx) => (
                                <Badge key={idx} className="bg-indigo-50 dark:bg-purple-500/10 text-indigo-700 dark:text-purple-300 border border-indigo-200 dark:border-purple-500/20 text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Pricing & Availability */}
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-2xl font-bold text-slate-800 dark:text-white">{category.avgPrice}</div>
                              <div className="text-xs text-slate-500 dark:text-gray-400">avg. starting price</div>
                            </div>
                            <div className="text-right">
                              <div className="text-green-600 dark:text-green-400 font-semibold">{category.nextAvailable}</div>
                              <div className="text-xs text-slate-500 dark:text-gray-400">next available</div>
                            </div>
                          </div>

                          {/* CTA */}
                          <Link href={`/category/${category.slug}`}>
                            <Button className="w-full bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white font-semibold group border-0">
                              Explore {category.name}
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Futuristic Trust Section */}
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className={`${glassTheme.accent} p-16 rounded-3xl text-center`}
              >
                <Shield className="w-16 h-16 text-indigo-600 dark:text-purple-400 mx-auto mb-8" />
                <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-6">
                  Quantum-Secured Trust Network
                </h2>
                <p className="text-xl text-slate-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
                  Every provider is verified through our AI-powered background screening, 
                  biometric authentication, and blockchain-secured reputation system.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { icon: Eye, label: 'AI Background Verification', desc: 'Quantum-level security checks' },
                    { icon: Shield, label: 'Blockchain Identity', desc: 'Immutable reputation scores' },
                    { icon: Zap, label: 'Real-time Monitoring', desc: 'Continuous quality assurance' },
                    { icon: Award, label: 'Performance Guaranteed', desc: '100% satisfaction promise' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="text-center"
                    >
                      <item.icon className="w-12 h-12 text-indigo-600 dark:text-purple-400 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{item.label}</h3>
                      <p className="text-sm text-slate-600 dark:text-gray-400">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        {/* Enhanced UI Elements */}
        <ModernFooter />
        <CommandPaletteHint />
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
        />
        <FloatingFAB />
        <MobileBottomNav currentPath="/" />
        <PremiumUpgradeCard />

        {/* AI Chat Assistant */}
        {isClient && (
          <AIChat
            agentId="loconomy"
            context={{
              currentPage: "home",
              userStats: stats,
              isAuthenticated: false
            }}
            position="floating"
            theme="brand"
            autoOpen={false}
            proactiveMessage={true}
          />
        )}

        {/* Mobile Bottom Spacing */}
        <div className="h-20 md:h-0"></div>

        {/* Enhanced Structured Data for AI/SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Loconomy",
              "description": "AI-Powered Local Services Platform",
              "url": "https://loconomy.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://loconomy.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "provider": {
                "@type": "Organization",
                "name": "Loconomy",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": stats.averageRating,
                  "reviewCount": stats.userCount
                }
              }
            })
          }}
        />
      </div>
    </PWAProvider>
  );
}
