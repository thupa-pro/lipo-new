"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search, Sparkles, Home, Wrench, Car, GraduationCap, Heart, Gamepad2,
  Menu, X, Star, Shield, Users, TrendingUp, ChevronRight, Play, ArrowRight,
  Clock, CheckCircle, Brain, Zap
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ModernFooter } from '@/components/modern-footer';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const serviceCategories = [
    {
      title: "Home Services",
      description: "Cleaning, repairs, maintenance",
      icon: <Home className="w-8 h-8 text-white" />,
      providerCount: "2,400+",
      gradient: "neural"
    },
    {
      title: "Tech & Repair", 
      description: "Computer, phone, appliance repair",
      icon: <Wrench className="w-8 h-8 text-white" />,
      providerCount: "1,200+",
      gradient: "quantum"
    },
    {
      title: "Automotive",
      description: "Car repair, maintenance, detailing", 
      icon: <Car className="w-8 h-8 text-white" />,
      providerCount: "800+",
      gradient: "trust"
    },
    {
      title: "Education",
      description: "Tutoring, training, lessons",
      icon: <GraduationCap className="w-8 h-8 text-white" />,
      providerCount: "1,600+",
      gradient: "plasma"
    },
    {
      title: "Health & Wellness",
      description: "Fitness, therapy, wellness",
      icon: <Heart className="w-8 h-8 text-white" />,
      providerCount: "900+",
      gradient: "neural"
    },
    {
      title: "Entertainment",
      description: "Events, photography, music",
      icon: <Gamepad2 className="w-8 h-8 text-white" />,
      providerCount: "650+",
      gradient: "quantum"
    }
  ];

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

      {/* Navigation */}
      <nav className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-neural rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient-neural">Loconomy</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/browse" className="text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">Browse Services</Link>
              <Link href="/become-provider" className="text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">Become Provider</Link>
              <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">How It Works</Link>
              <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">Pricing</Link>
              
              <ThemeToggle />
              
              <div className="flex items-center space-x-3">
                <Link href="/auth/signin" className="text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">Sign In</Link>
                <Link href="/auth/signup" className="bg-gradient-neural text-white px-6 py-3 rounded-2xl font-medium hover:shadow-glow-neural transition-all duration-300">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-4 lg:hidden">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl glass hover:bg-neural-50 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6 text-neural-600" /> : <Menu className="w-6 h-6 text-neural-600" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 glass rounded-3xl p-6 animate-fade-in">
              <div className="space-y-4">
                <a href="/browse" className="block text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">Browse Services</a>
                <a href="/become-provider" className="block text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">Become Provider</a>
                <a href="/how-it-works" className="block text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">How It Works</a>
                <a href="/pricing" className="block text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">Pricing</a>
                <div className="flex space-x-3 pt-2">
                  <a href="/auth/login" className="flex-1 glass text-center px-6 py-3 rounded-2xl font-medium text-neural-600 hover:bg-neural-50 transition-all duration-300">
                    Sign In
                  </a>
                  <a href="/auth/signup" className="flex-1 bg-gradient-neural text-white px-6 py-3 rounded-2xl font-medium hover:shadow-glow-neural transition-all duration-300 text-center">
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-16 pb-24">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <div className="inline-flex items-center px-6 py-3 bg-gradient-neural/10 rounded-full mb-8">
              <Sparkles className="w-5 h-5 text-neural-600 mr-2" />
              <span className="text-sm font-medium text-neural-700">Trusted by 2.4M+ Users Worldwide</span>
            </div>
            
            <h1 className="text-display-xl text-gradient-neural mb-8 leading-none">
              Connect with Local
              <br />
              <span className="text-gradient-quantum">Service Professionals</span>
              <br />
              <span className="text-gradient-trust">You Can Trust</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Loconomy is the premium marketplace connecting you with verified local service providers. 
              From home repairs to personal training - find trusted professionals in your area with our AI-powered matching system.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a href="/browse" className="bg-gradient-neural text-white px-8 py-4 rounded-2xl font-medium hover:shadow-glow-neural transition-all duration-300 text-lg flex items-center justify-center">
                <Search className="w-5 h-5 mr-2" />
                Find Services
              </a>
              <a href="/become-provider" className="glass px-8 py-4 rounded-2xl font-medium text-neural-600 hover:bg-neural-50 transition-all duration-300 text-lg flex items-center justify-center">
                <Users className="w-5 h-5 mr-2" />
                Become a Provider
              </a>
            </div>
          </div>

          {/* Search Interface */}
          <div className={`glass-strong rounded-4xl p-8 max-w-4xl mx-auto mb-16 transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <h2 className="text-2xl font-bold text-gradient-trust mb-6">Find Your Perfect Service Provider</h2>
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-neural-400 w-6 h-6" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What service do you need? (e.g., house cleaning, plumber, tutor)"
                className="w-full pl-16 pr-32 py-6 bg-background/50 backdrop-blur-sm border border-border rounded-3xl text-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neural-500/50 focus:border-neural-500/50 transition-all duration-300"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-neural text-white px-8 py-3 rounded-2xl font-medium hover:shadow-glow-neural transition-all duration-300">
                Search
              </button>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {['House Cleaning', 'Plumber', 'Electrician', 'Personal Trainer', 'Math Tutor', 'Dog Walker', 'Handyman'].map((tag) => (
                <span key={tag} className="glass px-4 py-2 rounded-xl text-sm text-neural-600 hover:bg-neural-50 transition-colors cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Platform Stats */}
          <div className={`transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <h2 className="text-3xl font-bold text-gradient-plasma mb-12">Trusted Platform Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              <div className="glass rounded-4xl p-6 hover:shadow-glass-xl transition-all duration-500 hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-neural rounded-2xl shadow-glow-neural">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-neural-600 text-sm font-medium">↗ +23.5%</span>
                </div>
                <div className="text-3xl font-bold text-gradient-neural mb-2">2.4M+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              
              <div className="glass rounded-4xl p-6 hover:shadow-glass-xl transition-all duration-500 hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-quantum rounded-2xl shadow-glow-quantum">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-quantum-600 text-sm font-medium">↗ +15.2%</span>
                </div>
                <div className="text-3xl font-bold text-gradient-quantum mb-2">&lt; 2hrs</div>
                <div className="text-sm text-muted-foreground">Average Response</div>
              </div>
              
              <div className="glass rounded-4xl p-6 hover:shadow-glass-xl transition-all duration-500 hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-trust rounded-2xl shadow-glow-trust">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-trust-600 text-sm font-medium">↗ +2.1%</span>
                </div>
                <div className="text-3xl font-bold text-gradient-trust mb-2">98.7%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              
              <div className="glass rounded-4xl p-6 hover:shadow-glass-xl transition-all duration-500 hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-plasma rounded-2xl shadow-glow-plasma">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-plasma-600 text-sm font-medium">↗ +1.8%</span>
                </div>
                <div className="text-3xl font-bold text-gradient-plasma mb-2">4.9/5</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient-neural mb-6">Popular Service Categories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore thousands of verified service providers across all major categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {serviceCategories.map((category, index) => (
              <div key={index} className="glass rounded-3xl p-6 hover:shadow-glass-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                <div className={`w-14 h-14 bg-gradient-${category.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gradient-neural">{category.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neural-600 font-medium">{category.providerCount} providers</span>
                  <ArrowRight className="w-4 h-4 text-neural-500 group-hover:text-neural-700 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a href="/browse" className="glass px-8 py-3 rounded-2xl font-medium text-neural-600 hover:bg-neural-50 transition-all duration-300 inline-flex items-center">
              View All Categories
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="glass-strong rounded-4xl p-12 text-center">
            <h2 className="text-3xl font-bold text-gradient-plasma mb-6">
              Ready to Get Started with Loconomy?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join millions of satisfied customers who have found their perfect service providers through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/browse" className="bg-gradient-neural text-white px-8 py-4 rounded-2xl font-medium hover:shadow-glow-neural transition-all duration-300 text-lg flex items-center justify-center">
                Find Services Now
              </a>
              <a href="/become-provider" className="glass px-8 py-4 rounded-2xl font-medium text-neural-600 hover:bg-neural-50 transition-all duration-300 text-lg flex items-center justify-center">
                Start Earning as Provider
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-6 py-24 bg-gradient-to-r from-neural-50/50 to-quantum-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient-neural mb-6">How Loconomy Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting the perfect service provider has never been easier. Our AI-powered platform handles everything.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-neural rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">1. Describe Your Need</h3>
              <p className="text-muted-foreground">Tell us what service you need using natural language. Our AI understands exactly what you're looking for.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-quantum rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">2. Get Matched Instantly</h3>
              <p className="text-muted-foreground">Our neural network instantly matches you with the best verified providers in your area based on your specific needs.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-trust rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">3. Book & Relax</h3>
              <p className="text-muted-foreground">Book your preferred provider with one click. Enjoy protected payments and real-time updates throughout the service.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <a href="/how-it-works" className="glass px-8 py-3 rounded-2xl font-medium text-neural-600 hover:bg-neural-50 transition-all duration-300 inline-flex items-center">
              Learn More About Our Process
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient-plasma mb-6">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join millions of satisfied customers who trust Loconomy for their service needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass rounded-3xl p-8 hover:shadow-glass-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-neural rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">SJ</span>
                </div>
                <div>
                  <h4 className="font-bold text-gradient-neural">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">Homeowner</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground italic">
                "Found an amazing house cleaner through Loconomy in minutes. The booking process was seamless and the service quality exceeded my expectations!"
              </p>
            </div>

            <div className="glass rounded-3xl p-8 hover:shadow-glass-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-quantum rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">MR</span>
                </div>
                <div>
                  <h4 className="font-bold text-gradient-quantum">Mike Rodriguez</h4>
                  <p className="text-sm text-muted-foreground">Business Owner</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground italic">
                "As a provider, Loconomy has transformed my business. The AI matching brings me perfect clients and the platform handles everything seamlessly."
              </p>
            </div>

            <div className="glass rounded-3xl p-8 hover:shadow-glass-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-trust rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">ET</span>
                </div>
                <div>
                  <h4 className="font-bold text-gradient-trust">Emma Thompson</h4>
                  <p className="text-sm text-muted-foreground">Tech Professional</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground italic">
                "The AI recommendations are spot-on! Got my laptop fixed by a certified technician who arrived within 2 hours. Incredible service!"
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <a href="/success-stories" className="glass px-8 py-3 rounded-2xl font-medium text-neural-600 hover:bg-neural-50 transition-all duration-300 inline-flex items-center">
              Read More Success Stories
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24 bg-gradient-to-l from-plasma-50/50 to-trust-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient-trust mb-6">Why Choose Loconomy</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced technology meets personalized service for the ultimate experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-neural rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-gradient-neural">AI-Powered Matching</h3>
              <p className="text-muted-foreground text-sm">Our neural network learns your preferences and matches you with the perfect providers every time.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-quantum rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-gradient-quantum">Verified & Insured</h3>
              <p className="text-muted-foreground text-sm">Every provider is background-checked, verified, and fully insured for your peace of mind.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-trust rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-gradient-trust">Instant Booking</h3>
              <p className="text-muted-foreground text-sm">Book services instantly with real-time availability and immediate confirmation.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-plasma rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-gradient-plasma">24/7 Support</h3>
              <p className="text-muted-foreground text-sm">Round-the-clock customer support and live tracking for all your service needs.</p>
            </div>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}
