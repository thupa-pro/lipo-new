"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IntelligentHeader } from '@/components/ui/intelligent-header';
import { PWAProvider } from '@/components/ui/pwa-features';
import { ModernFooter } from '@/components/modern-footer';
import { CommandPaletteHint } from '@/components/ui/command-palette-hint';
import { CommandPalette } from '@/components/ui/command-palette';
import { ScrollReveal, StaggeredReveal, ParallaxReveal } from '@/components/ui/scroll-reveal';
import { FloatingFAB, MobileBottomNav } from '@/components/ui/floating-fab';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Wrench,
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
} from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Command palette shortcut (Cmd/Ctrl + K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }

      // Slash command for search
      if (e.key === '/' && !isCommandPaletteOpen) {
        e.preventDefault();
        router.push('/browse');
      }

      // Question mark for help
      if (e.key === '?' && !isCommandPaletteOpen) {
        e.preventDefault();
        router.push('/help');
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [router, isCommandPaletteOpen]);

  const handleSearch = () => {
    if (searchQuery.trim() || locationQuery.trim()) {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (locationQuery.trim()) params.set('location', locationQuery.trim());
      router.push(`/browse?${params.toString()}`);
    } else {
      toast({
        title: "Search Query Required",
        description: "Please enter a service or location to search",
        variant: "destructive",
      });
    }
  };

  const handleQuickSearch = (tag: string) => {
    setSearchQuery(tag);
    const params = new URLSearchParams();
    params.set('q', tag);
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <PWAProvider>
      <div className="relative min-h-screen overflow-hidden">
        {/* Skip Links for Accessibility */}
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <a href="#find-service" className="skip-link">Skip to search</a>
        <a href="#how-it-works" className="skip-link">Skip to how it works</a>
        
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
        
        {/* Animated Background Blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-[200px] animate-pulse"></div>
        <div className="absolute bottom-[-30%] right-[-20%] w-[900px] h-[900px] bg-cyan-700/30 rounded-full blur-[200px] animate-pulse animation-delay-4000"></div>
        <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-fuchsia-700/20 rounded-full blur-[150px] animate-pulse animation-delay-2000"></div>

        {/* Intelligent Header */}
        <IntelligentHeader onCommandPaletteOpen={() => setIsCommandPaletteOpen(true)} />

        {/* Header Compensation */}
        <div className="h-20 md:h-24"></div>

        {/* Main Content */}
        <main id="main-content" className="relative z-10 responsive-container" role="main">
          {/* Hero Section */}
          <section className="hero-section text-center py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 landscape-compact" role="main" aria-labelledby="hero-title">
            <ScrollReveal delay={200} direction="scale">
              <div className="hero-badge floating-element glow-pulse mb-6 flex justify-center items-center gap-3 text-xs md:text-sm font-ui px-4 md:px-6 py-2 md:py-3 rounded-full inline-flex">
                <div className="relative">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 animate-pulse" />
                  <div className="absolute inset-0 animate-ping">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 opacity-30" />
                  </div>
                </div>
                <span>Trusted by 2.4M+ Users Worldwide</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400} direction="up">
              <h1 id="hero-title" className="resp-text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-display mb-4 md:mb-6 leading-tight px-2 sm:px-4">
                <span className="gradient-text">Connect with Local</span>
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                <span className="text-gray-900 dark:text-white font-display">Service Professionals You Trust</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={600} direction="up">
              <p className="hero-description max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto resp-text-sm md:text-lg lg:text-xl mb-6 md:mb-8 lg:mb-12 font-body px-2 sm:px-4">
                Loconomy is the premium marketplace connecting you with verified local service providers. From home repairs to personal training - find trusted professionals in your area with our AI-powered matching system.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={800} direction="up">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4 resp-flex-col">
                <Link
                  href="/browse"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 md:gap-3 resp-p-4 btn-elite text-white font-ui font-semibold rounded-full resp-text-sm md:text-lg group touch-target hover-enhance"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110" />
                  <span className="hidden xs:inline">Find Services Now</span>
                  <span className="xs:hidden">Find Services</span>
                </Link>
                <Link
                  href="/become-provider"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 md:gap-3 resp-p-4 bg-white/10 text-white font-ui font-semibold rounded-full resp-text-sm md:text-lg hover:bg-white/20 transition-all duration-300 border border-transparent hover:border-white/30 backdrop-blur-sm group touch-target hover-enhance"
                >
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110" />
                  <span className="hidden xs:inline">Become a Provider</span>
                  <span className="xs:hidden">Be a Provider</span>
                </Link>
              </div>
            </ScrollReveal>
          </section>

          {/* Search Section */}
          <section className="py-8 sm:py-12 md:py-16 lg:py-20 landscape-compact" id="find-service" role="search" aria-labelledby="search-title">
            <div className="search-card card-elite resp-p-6 hover-scale mx-2 sm:mx-4 md:mx-0 animate-elite-float">
              <h2 id="search-title" className="section-title resp-text-xl md:text-3xl lg:text-4xl font-heading text-center mb-2">Start Your Search</h2>
              <p className="section-subtitle text-center mb-4 sm:mb-6 md:mb-10 font-body resp-text-sm">Get matched with the perfect professional in seconds.</p>

              <div className="max-w-4xl mx-auto">
                <div className="search-input-container flex flex-col sm:flex-row items-center p-2 md:p-3 rounded-full">
                  <div className="flex-grow w-full flex items-center pl-2 sm:pl-3 md:pl-4 pr-2">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[var(--mid-gray)] mr-2 md:mr-3" />
                    <input
                      className="search-input w-full focus:outline-none py-2 md:py-3 resp-text-sm md:text-lg"
                      placeholder="What service do you need?"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Service type"
                      id="service-input"
                    />
                  </div>
                  <div className="w-full sm:w-auto flex items-center pl-2 sm:pl-3 md:pl-4 pr-2 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-white/10 mt-2 sm:mt-0 pt-2 sm:pt-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-500 dark:text-[var(--mid-gray)] mr-2 md:mr-3" />
                    <input
                      className="search-input w-full focus:outline-none py-2 md:py-3 resp-text-sm md:text-lg"
                      placeholder="Your Location"
                      type="text"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      aria-label="Service location"
                      id="location-input"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="w-full mt-3 sm:mt-0 sm:w-auto px-4 sm:px-6 md:px-10 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-ui font-semibold rounded-full btn-glow transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex-shrink-0 touch-target resp-text-sm"
                    aria-label="Search for services"
                  >
                    <span className="hidden sm:inline">Search</span>
                    <Search className="w-4 h-4 sm:hidden" />
                  </button>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4 sm:mt-6 md:mt-8 resp-text-xs">
                  {['House Cleaning', 'Plumber', 'Electrician', 'Personal Trainer', 'Math Tutor'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleQuickSearch(tag)}
                      className="search-tag interactive-element px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full transition-all duration-300 touch-target"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-2 sm:px-4 landscape-compact" id="how-it-works" role="region" aria-labelledby="how-it-works-title">
            <h2 id="how-it-works-title" className="section-title resp-text-xl md:text-3xl lg:text-4xl font-heading text-center mb-4">How Loconomy Works</h2>
            <p className="section-subtitle resp-text-sm md:text-lg text-center mb-8 sm:mb-12 md:mb-16 max-w-xl md:max-w-2xl mx-auto font-body">Finding your ideal service professional is as easy as 1-2-3.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12 relative works-grid">
              <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 dark:bg-white/10 hidden md:block"></div>
              <div className="works-connecting-line absolute top-1/2 left-0 w-full hidden md:flex justify-between">
                <div className="w-1/3 h-px"></div>
                <div className="w-1/3 h-px"></div>
              </div>

              <div className="relative text-center z-10 sm:col-span-2 lg:col-span-1">
                <div className="works-number-circle w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                  <span className="resp-text-lg md:text-3xl lg:text-4xl font-black gradient-text">1</span>
                </div>
                <h3 className="works-step-title resp-text-lg md:text-xl lg:text-2xl font-heading mb-2 md:mb-3">Post a Job</h3>
                <p className="works-step-description resp-text-xs md:text-sm lg:text-base font-body">Tell us what you need. Be specific to get the most accurate quotes from our network of professionals.</p>
              </div>

              <div className="relative text-center z-10">
                <div className="works-number-circle w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                  <span className="resp-text-lg md:text-3xl lg:text-4xl font-black gradient-text">2</span>
                </div>
                <h3 className="works-step-title resp-text-lg md:text-xl lg:text-2xl font-heading mb-2 md:mb-3">Get Matches</h3>
                <p className="works-step-description resp-text-xs md:text-sm lg:text-base font-body">Our smart AI algorithm matches you with qualified, vetted pros in your area who are ready to help.</p>
              </div>

              <div className="relative text-center z-10">
                <div className="works-number-circle w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                  <span className="resp-text-lg md:text-3xl lg:text-4xl font-black gradient-text">3</span>
                </div>
                <h3 className="works-step-title resp-text-lg md:text-xl lg:text-2xl font-heading mb-2 md:mb-3">Hire & Relax</h3>
                <p className="works-step-description resp-text-xs md:text-sm lg:text-base font-body">Compare profiles, quotes, and reviews. Hire the best fit and get the job done right, guaranteed.</p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-12 sm:py-16 md:py-20 landscape-compact" role="region" aria-labelledby="stats-title">
            <ScrollReveal direction="up">
              <h2 id="stats-title" className="section-title resp-text-xl md:text-3xl lg:text-4xl font-heading text-center mb-8 sm:mb-12">Trusted Platform Performance</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 stats-grid">
              <div className="stats-card card-elite resp-p-4 md:p-6 lg:p-8 text-center magnetic-hover animate-elite-float hover-enhance touch-friendly">
                <div className="flex justify-center items-center mb-4">
                  <div className="stats-icon-bg p-4 rounded-full">
                    <Users className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
                <p className="stats-number resp-text-2xl lg:text-4xl xl:text-5xl font-bold mb-2">2.4M+</p>
                <p className="stats-label mb-2 sm:mb-4 resp-text-sm">Active Users</p>
                <span className="stats-growth font-semibold resp-text-xs">+23.5% vs last month</span>
              </div>
              
              <div className="stats-card card-elite resp-p-4 md:p-6 lg:p-8 text-center magnetic-hover animate-elite-float hover-enhance touch-friendly" style={{animationDelay: '0.2s'}}>
                <div className="flex justify-center items-center mb-4">
                  <div className="stats-icon-bg p-4 rounded-full">
                    <Clock className="w-8 h-8 text-cyan-500" />
                  </div>
                </div>
                <p className="stats-number resp-text-2xl lg:text-4xl xl:text-5xl font-bold mb-2">&lt; 2hrs</p>
                <p className="stats-label mb-2 sm:mb-4 resp-text-sm">Average Response</p>
                <span className="stats-growth font-semibold resp-text-xs">+15.2% vs last month</span>
              </div>

              <div className="stats-card card-elite resp-p-4 md:p-6 lg:p-8 text-center magnetic-hover animate-elite-float hover-enhance touch-friendly" style={{animationDelay: '0.4s'}}>
                <div className="flex justify-center items-center mb-4">
                  <div className="stats-icon-bg p-4 rounded-full">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <p className="stats-number resp-text-2xl lg:text-4xl xl:text-5xl font-bold mb-2">98.7%</p>
                <p className="stats-label mb-2 sm:mb-4 resp-text-sm">Job Success Rate</p>
                <span className="stats-growth font-semibold resp-text-xs">+2.1% vs last month</span>
              </div>

              <div className="stats-card card-elite resp-p-4 md:p-6 lg:p-8 text-center magnetic-hover animate-elite-float hover-enhance touch-friendly" style={{animationDelay: '0.6s'}}>
                <div className="flex justify-center items-center mb-4">
                  <div className="stats-icon-bg p-4 rounded-full">
                    <Star className="w-8 h-8 text-pink-500 fill-current" />
                  </div>
                </div>
                <p className="stats-number resp-text-2xl lg:text-4xl xl:text-5xl font-bold mb-2">4.9/5</p>
                <p className="stats-label mb-2 sm:mb-4 resp-text-sm">Average Rating</p>
                <span className="stats-growth font-semibold resp-text-xs">+1.8% vs last month</span>
              </div>
            </div>
          </section>

          {/* Service Categories Section */}
          <section className="py-12 sm:py-16 md:py-20 landscape-compact" role="region" aria-labelledby="categories-title">
            <h2 id="categories-title" className="section-title resp-text-xl md:text-3xl lg:text-4xl font-heading text-center mb-4">Popular Service Categories</h2>
            <p className="section-subtitle resp-text-sm md:text-lg text-center mb-8 sm:mb-12 max-w-xl md:max-w-2xl mx-auto">Explore thousands of verified service providers across all major categories.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 category-grid">
              <div className="category-card card-elite resp-p-4 md:p-6 lg:p-8 overflow-hidden relative group magnetic-hover hover-enhance touch-friendly">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <HomeIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-500 mb-3 sm:mb-4" />
                  <h3 className="category-title resp-text-lg md:text-xl lg:text-2xl font-bold mb-2">Home Services</h3>
                  <p className="category-description resp-text-xs md:text-sm lg:text-base mb-4 sm:mb-6 flex-grow">Plumbing, electrical, cleaning, and more. All your home needs covered.</p>
                  <Link href="/category/home-services" className="category-link font-semibold flex items-center group-hover:text-purple-600 dark:group-hover:text-white transition-colors">
                    Explore
                    <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="card-elite resp-p-4 md:p-6 lg:p-8 overflow-hidden relative group magnetic-hover hover-enhance touch-friendly">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <Dumbbell className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-cyan-400 mb-3 sm:mb-4" />
                  <h3 className="resp-text-lg md:text-xl lg:text-2xl font-bold text-white mb-2">Wellness & Fitness</h3>
                  <p className="text-[var(--mid-gray)] resp-text-xs md:text-sm lg:text-base mb-4 sm:mb-6 flex-grow">Personal trainers, yoga instructors, and nutritionists to achieve your goals.</p>
                  <Link href="/category/wellness-fitness" className="font-semibold text-cyan-300 flex items-center group-hover:text-white transition-colors">
                    Explore
                    <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="card-elite resp-p-4 md:p-6 lg:p-8 overflow-hidden relative group magnetic-hover hover-enhance touch-friendly">
                <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-fuchsia-400 mb-3 sm:mb-4" />
                  <h3 className="resp-text-lg md:text-xl lg:text-2xl font-bold text-white mb-2">Education & Tutoring</h3>
                  <p className="text-[var(--mid-gray)] resp-text-xs md:text-sm lg:text-base mb-4 sm:mb-6 flex-grow">Find expert tutors for any subject, from math and science to music lessons.</p>
                  <Link href="/category/education-tutoring" className="font-semibold text-fuchsia-300 flex items-center group-hover:text-white transition-colors">
                    Explore
                    <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="card-elite resp-p-4 md:p-6 lg:p-8 overflow-hidden relative group magnetic-hover hover-enhance touch-friendly">
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <Monitor className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-400 mb-3 sm:mb-4" />
                  <h3 className="resp-text-lg md:text-xl lg:text-2xl font-bold text-white mb-2">Tech & Repair</h3>
                  <p className="text-[var(--mid-gray)] resp-text-xs md:text-sm lg:text-base mb-4 sm:mb-6 flex-grow">Computer, phone, appliance repair and technical support services.</p>
                  <Link href="/category/tech-repair" className="font-semibold text-green-300 flex items-center group-hover:text-white transition-colors">
                    Explore
                    <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="card-elite resp-p-4 md:p-6 lg:p-8 overflow-hidden relative group magnetic-hover hover-enhance touch-friendly">
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <Car className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-orange-400 mb-3 sm:mb-4" />
                  <h3 className="resp-text-lg md:text-xl lg:text-2xl font-bold text-white mb-2">Automotive</h3>
                  <p className="text-[var(--mid-gray)] resp-text-xs md:text-sm lg:text-base mb-4 sm:mb-6 flex-grow">Car repair, maintenance, detailing and automotive services.</p>
                  <Link href="/category/automotive" className="font-semibold text-orange-300 flex items-center group-hover:text-white transition-colors">
                    Explore
                    <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="card-elite resp-p-4 md:p-6 lg:p-8 overflow-hidden relative group magnetic-hover hover-enhance touch-friendly">
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <PartyPopper className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-pink-400 mb-3 sm:mb-4" />
                  <h3 className="resp-text-lg md:text-xl lg:text-2xl font-bold text-white mb-2">Entertainment</h3>
                  <p className="text-[var(--mid-gray)] resp-text-xs md:text-sm lg:text-base mb-4 sm:mb-6 flex-grow">Events, photography, music and entertainment services.</p>
                  <Link href="/category/entertainment" className="font-semibold text-pink-300 flex items-center group-hover:text-white transition-colors">
                    Explore
                    <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-24">
            <h2 className="text-4xl font-bold text-center text-white mb-4">What Our Users Say</h2>
            <p className="text-lg text-[var(--mid-gray)] text-center mb-16 max-w-2xl mx-auto">
              Join millions of satisfied customers who trust Loconomy for their service needs
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-glass rounded-3xl p-8 card-glow">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">SJ</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Sarah Johnson</h4>
                    <p className="text-sm text-[var(--mid-gray)]">Homeowner</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-[var(--mid-gray)] italic">
                  "Found an amazing house cleaner through Loconomy in minutes. The booking process was seamless and the service quality exceeded my expectations!"
                </p>
              </div>

              <div className="bg-glass rounded-3xl p-8 card-glow">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">MR</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Mike Rodriguez</h4>
                    <p className="text-sm text-[var(--mid-gray)]">Business Owner</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-[var(--mid-gray)] italic">
                  "As a provider, Loconomy has transformed my business. The AI matching brings me perfect clients and the platform handles everything seamlessly."
                </p>
              </div>

              <div className="bg-glass rounded-3xl p-8 card-glow">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">ET</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Emma Thompson</h4>
                    <p className="text-sm text-[var(--mid-gray)]">Tech Professional</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-[var(--mid-gray)] italic">
                  "The AI recommendations are spot-on! Got my laptop fixed by a certified technician who arrived within 2 hours. Incredible service!"
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-24 bg-gradient-to-l from-purple-900/20 to-cyan-900/20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">Why Choose Loconomy</h2>
              <p className="text-lg text-[var(--mid-gray)] max-w-2xl mx-auto">
                Advanced technology meets personalized service for the ultimate experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-white">AI-Powered Matching</h3>
                <p className="text-[var(--mid-gray)] text-sm">Our neural network learns your preferences and matches you with the perfect providers every time.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-white">Verified & Insured</h3>
                <p className="text-[var(--mid-gray)] text-sm">Every provider is background-checked, verified, and fully insured for your peace of mind.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-white">Instant Booking</h3>
                <p className="text-[var(--mid-gray)] text-sm">Book services instantly with real-time availability and immediate confirmation.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HeadphonesIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-white">24/7 Support</h3>
                <p className="text-[var(--mid-gray)] text-sm">Round-the-clock customer support and live tracking for all your service needs.</p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-24">
            <div className="max-w-4xl mx-auto">
              <div className="bg-glass rounded-3xl p-12 text-center card-glow">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Ready to Get Started with Loconomy?
                </h2>
                <p className="text-lg text-[var(--mid-gray)] mb-8 max-w-2xl mx-auto">
                  Join millions of satisfied customers who have found their perfect service providers through our platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/browse" className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-8 py-4 rounded-full font-semibold text-lg btn-glow transition-transform transform hover:scale-105 flex items-center justify-center">
                    Find Services Now
                  </Link>
                  <Link href="/become-provider" className="bg-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-transparent hover:border-white/30 flex items-center justify-center">
                    Start Earning as Provider
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <ModernFooter />
        <CommandPaletteHint />
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
        />
        <FloatingFAB />
        <MobileBottomNav currentPath="/" />

        {/* Mobile Bottom Spacing */}
        <div className="h-20 md:h-0 mobile-bottom-spacing"></div>
      </div>
    </PWAProvider>
  );
}
