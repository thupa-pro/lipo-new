"use client";

import { useState, useEffect } from 'react';
import {
  Search, Sparkles, Brain, Zap, Shield, Star, TrendingUp, Users, Award, ChevronRight,
  Sun, Moon, Menu, X, Home, Wrench, Car, GraduationCap, Heart, Gamepad2,
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Github,
  Play, Check, ArrowRight, MessageCircle, Clock, DollarSign, CheckCircle,
  Quote, ChevronDown, Plus, Minus, Send
} from 'lucide-react';

// Add live chat widget component
function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-neural rounded-full flex items-center justify-center shadow-glass-xl hover:shadow-glow-neural transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 glass-strong rounded-3xl p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gradient-neural">AI Assistant</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <div className="text-sm text-muted-foreground">
            👋 Hi! I'm your AI assistant. How can I help you find the perfect service provider today?
          </div>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ label, value, trend, icon, color }: MetricCardProps) {
  return (
    <div className={`glass rounded-4xl p-6 hover:shadow-glass-xl transition-all duration-500 hover:scale-[1.02] border-${color}-200/30`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-gradient-${color} rounded-2xl shadow-glow-neural`}>
          {icon}
        </div>
        <span className={`text-${color}-600 text-sm font-medium`}>{trend}</span>
      </div>
      <div className="text-display-l text-gradient-neural mb-2">{value}</div>
      <div className="text-heading-m text-muted-foreground">{label}</div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
}

function FeatureCard({ title, description, icon, gradient, delay }: FeatureCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), delay);
  }, [delay]);

  return (
    <div className={`glass-strong rounded-4xl p-8 transition-all duration-700 hover:scale-[1.05] hover:shadow-glass-xl ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className={`w-16 h-16 bg-gradient-${gradient} rounded-2xl flex items-center justify-center mb-6 shadow-glass-lg`}>
        {icon}
      </div>
      <h3 className="text-display-l text-gradient-neural mb-4">{title}</h3>
      <p className="text-body-l text-muted-foreground leading-relaxed">{description}</p>
      <div className="mt-6 flex items-center text-neural-600 hover:text-neural-700 transition-colors cursor-pointer">
        <span className="text-sm font-medium">Learn more</span>
        <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </div>
  );
}

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  providerCount: string;
  gradient: string;
}

function CategoryCard({ title, description, icon, providerCount, gradient }: CategoryCardProps) {
  return (
    <div className="glass rounded-3xl p-6 hover:shadow-glass-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
      <div className={`w-14 h-14 bg-gradient-${gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gradient-neural">{title}</h3>
      <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-neural-600 font-medium">{providerCount} providers</span>
        <ArrowRight className="w-4 h-4 text-neural-500 group-hover:text-neural-700 group-hover:translate-x-1 transition-all duration-300" />
      </div>
    </div>
  );
}

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

function TestimonialCard({ name, role, content, rating, avatar }: TestimonialCardProps) {
  return (
    <div className="glass rounded-3xl p-8">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <Quote className="w-8 h-8 text-neural-400 mb-4" />
      <p className="text-muted-foreground mb-6 leading-relaxed">"{content}"</p>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-neural rounded-full flex items-center justify-center text-white font-bold mr-4">
          {avatar}
        </div>
        <div>
          <h4 className="font-semibold text-gradient-neural">{name}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
}

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  gradient: string;
}

function PricingCard({ title, price, period, features, isPopular, gradient }: PricingCardProps) {
  return (
    <div className={`glass rounded-4xl p-8 transition-all duration-300 hover:scale-[1.02] relative ${
      isPopular ? 'border-2 border-neural-500 shadow-neural' : ''
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-neural text-white px-6 py-2 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      <h3 className="text-2xl font-bold text-gradient-neural mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-gradient-quantum">{price}</span>
        <span className="text-muted-foreground">/{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className="w-5 h-5 text-trust-500 mr-3 flex-shrink-0" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-2xl font-medium transition-all duration-300 ${
        isPopular
          ? 'bg-gradient-neural text-white hover:shadow-glow-neural'
          : 'glass hover:bg-neural-50'
      }`}>
        Get Started
      </button>
    </div>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass rounded-2xl p-6">
      <button
        className="w-full flex items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold text-gradient-neural pr-4">{question}</h3>
        {isOpen ? <Minus className="w-5 h-5 text-neural-600" /> : <Plus className="w-5 h-5 text-neural-600" />}
      </button>
      {isOpen && (
        <p className="mt-4 text-muted-foreground leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setIsLoaded(true);
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  const categories = [
    {
      title: "Home Services",
      description: "Cleaning, maintenance, repairs, and home improvement services",
      icon: <Home className="w-8 h-8 text-white" />,
      providerCount: "12,500+",
      gradient: "neural"
    },
    {
      title: "Tech & IT",
      description: "Computer repair, software development, and tech support",
      icon: <Wrench className="w-8 h-8 text-white" />,
      providerCount: "8,200+",
      gradient: "quantum"
    },
    {
      title: "Automotive",
      description: "Car repair, maintenance, detailing, and automotive services",
      icon: <Car className="w-8 h-8 text-white" />,
      providerCount: "5,400+",
      gradient: "trust"
    },
    {
      title: "Education",
      description: "Tutoring, training, courses, and educational services",
      icon: <GraduationCap className="w-8 h-8 text-white" />,
      providerCount: "15,600+",
      gradient: "plasma"
    },
    {
      title: "Health & Wellness",
      description: "Fitness, nutrition, therapy, and wellness services",
      icon: <Heart className="w-8 h-8 text-white" />,
      providerCount: "9,800+",
      gradient: "neural"
    },
    {
      title: "Entertainment",
      description: "Events, photography, music, and entertainment services",
      icon: <Gamepad2 className="w-8 h-8 text-white" />,
      providerCount: "6,700+",
      gradient: "quantum"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      content: "The AI matching was incredible! Found the perfect contractor for my kitchen renovation within minutes. The quality exceeded my expectations.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Mike Chen",
      role: "Business Owner",
      content: "As a service provider, this platform has transformed my business. The quantum processing ensures I get matched with the right clients instantly.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Freelancer",
      content: "The trust verification system gives me confidence in every transaction. I've built a thriving business thanks to this platform.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const pricingPlans = [
    {
      title: "Starter",
      price: "Free",
      period: "forever",
      features: [
        "Up to 5 service requests",
        "Basic AI matching",
        "Standard support",
        "Mobile app access"
      ],
      gradient: "neural"
    },
    {
      title: "Professional",
      price: "$29",
      period: "month",
      features: [
        "Unlimited service requests",
        "Advanced AI matching",
        "Priority support",
        "Analytics dashboard",
        "Custom branding",
        "API access"
      ],
      isPopular: true,
      gradient: "quantum"
    },
    {
      title: "Enterprise",
      price: "$99",
      period: "month",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced analytics",
        "White-label solution",
        "24/7 phone support"
      ],
      gradient: "trust"
    }
  ];

  const faqItems = [
    {
      question: "How does the AI matching work?",
      answer: "Our neural network analyzes millions of data points including skills, location, availability, ratings, and past performance to create perfect matches between service providers and customers in under 50ms."
    },
    {
      question: "Is the platform secure?",
      answer: "Yes, we use blockchain-based verification and end-to-end encryption. All transactions are protected by our Trust Network with 99.7% security rating."
    },
    {
      question: "How do I become a service provider?",
      answer: "Simply sign up, complete our AI-powered verification process, showcase your skills, and start receiving matched requests. Most providers get their first client within 24 hours."
    },
    {
      question: "What are the fees?",
      answer: "We charge a small commission only when you successfully complete a job. No hidden fees, no monthly charges for basic usage. Transparent pricing for all users."
    },
    {
      question: "Can I use this on mobile?",
      answer: "Absolutely! Our mobile app provides full functionality with biometric authentication, real-time notifications, and offline capabilities. Available on iOS and Android."
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' : 'bg-gradient-to-br from-stratosphere via-cirrus to-white'
    }`}>
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
              <span className="text-xl font-bold text-gradient-neural">Elite 2025</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#categories" className="text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">Categories</a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">Reviews</a>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl glass hover:bg-neural-50 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-neural-600" /> : <Moon className="w-5 h-5 text-neural-600" />}
              </button>

              <button className="bg-gradient-neural text-white px-6 py-3 rounded-2xl font-medium hover:shadow-glow-neural transition-all duration-300">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-4 lg:hidden">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl glass hover:bg-neural-50 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-neural-600" /> : <Moon className="w-5 h-5 text-neural-600" />}
              </button>
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
                <a href="#categories" className="block text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">Categories</a>
                <a href="#how-it-works" className="block text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">How It Works</a>
                <a href="#pricing" className="block text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">Pricing</a>
                <a href="#testimonials" className="block text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">Reviews</a>
                <button className="w-full bg-gradient-neural text-white px-6 py-3 rounded-2xl font-medium hover:shadow-glow-neural transition-all duration-300">
                  Get Started
                </button>
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
              <span className="text-sm font-medium text-neural-700">Now with AI-Powered Quantum Matching</span>
            </div>
            <h1 className="text-display-xl text-gradient-neural mb-8 leading-none">
              Connect with Perfect
              <br />
              <span className="text-gradient-quantum">Service Providers</span>
              <br />
              <span className="text-gradient-trust">in Seconds</span>
            </h1>
            <p className="text-body-l text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Revolutionary AI matching engine connects you with verified professionals instantly.
              From home repairs to personal training - find exactly what you need with our neural network technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="bg-gradient-neural text-white px-8 py-4 rounded-2xl font-medium hover:shadow-glow-neural transition-all duration-300 text-lg flex items-center justify-center">
                <Search className="w-5 h-5 mr-2" />
                Find Services
              </button>
              <button className="glass px-8 py-4 rounded-2xl font-medium text-neural-600 hover:bg-neural-50 transition-all duration-300 text-lg flex items-center justify-center">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Neural Search Interface */}
          <div className={`glass-strong rounded-4xl p-8 max-w-4xl mx-auto mb-16 transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <h2 className="text-2xl font-bold text-gradient-trust mb-6">AI-Powered Search</h2>
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-neural-400 w-6 h-6" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe what you need... AI understands natural language"
                className="w-full pl-16 pr-32 py-6 bg-background/50 backdrop-blur-sm border border-border rounded-3xl text-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neural-500/50 focus:border-neural-500/50 transition-all duration-300"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-neural text-white px-8 py-3 rounded-2xl font-medium hover:shadow-glow-neural transition-all duration-300">
                Search
              </button>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {['House Cleaning', 'Laptop Repair', 'Personal Trainer', 'Math Tutor', 'Pet Walking', 'Plumbing', 'Web Design'].map((tag) => (
                <span key={tag} className="glass px-4 py-2 rounded-xl text-sm text-neural-600 hover:bg-neural-50 transition-colors cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quantum Metrics Dashboard */}
          <div className={`transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <h2 className="text-3xl font-bold text-gradient-plasma mb-12">Platform Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              <MetricCard
                label="Active Service Providers"
                value="2.4M+"
                trend="↗ +23.5%"
                icon={<Users className="w-6 h-6 text-white" />}
                color="neural"
              />
              <MetricCard
                label="Average Match Time"
                value="<30sec"
                trend="↗ +15.2%"
                icon={<Clock className="w-6 h-6 text-white" />}
                color="quantum"
              />
              <MetricCard
                label="Success Rate"
                value="98.7%"
                trend="↗ +2.1%"
                icon={<CheckCircle className="w-6 h-6 text-white" />}
                color="trust"
              />
              <MetricCard
                label="Customer Satisfaction"
                value="4.9/5"
                trend="↗ +1.8%"
                icon={<Star className="w-6 h-6 text-white" />}
                color="plasma"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section id="categories" className="relative z-10 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient-neural mb-6">Popular Service Categories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore thousands of verified service providers across all major categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {categories.map((category, index) => (
              <CategoryCard key={index} {...category} />
            ))}
          </div>

          <div className="text-center">
            <button className="glass px-8 py-3 rounded-2xl font-medium text-neural-600 hover:bg-neural-50 transition-all duration-300">
              View All Categories
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient-quantum mb-6">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get connected with perfect service providers in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-neural rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gradient-neural mb-4">Describe Your Need</h3>
              <p className="text-muted-foreground">
                Tell our AI what service you need using natural language. Our neural network understands context and requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-quantum rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gradient-quantum mb-4">Get Instant Matches</h3>
              <p className="text-muted-foreground">
                Our quantum processing engine analyzes millions of provider profiles and finds perfect matches in under 30 seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-trust rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gradient-trust mb-4">Connect & Complete</h3>
              <p className="text-muted-foreground">
                Message providers directly, schedule services, and pay securely through our blockchain-protected payment system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Grid */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient-neural mb-6">AI-Powered Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Revolutionary technology stack designed for the next generation of service platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Neural Matching"
              description="Advanced AI algorithms analyze millions of data points to create perfect service provider matches with unprecedented accuracy and relevance."
              icon={<Brain className="w-8 h-8 text-white" />}
              gradient="neural"
              delay={100}
            />
            <FeatureCard
              title="Quantum Processing"
              description="Lightning-fast computation engine processes complex matching algorithms in under 30 seconds for instant, high-quality results."
              icon={<Zap className="w-8 h-8 text-white" />}
              gradient="quantum"
              delay={200}
            />
            <FeatureCard
              title="Trust Network"
              description="Blockchain-secured verification system ensures every interaction is protected by cryptographic trust protocols and smart contracts."
              icon={<Shield className="w-8 h-8 text-white" />}
              gradient="trust"
              delay={300}
            />
            <FeatureCard
              title="Smart Analytics"
              description="Real-time analytics dashboard provides deep insights into platform performance, user behavior patterns, and market trends."
              icon={<TrendingUp className="w-8 h-8 text-white" />}
              gradient="plasma"
              delay={400}
            />
            <FeatureCard
              title="Global Community"
              description="Connect with millions of verified service providers and customers in our thriving ecosystem spanning 50+ countries worldwide."
              icon={<Users className="w-8 h-8 text-white" />}
              gradient="neural"
              delay={500}
            />
            <FeatureCard
              title="Elite Certification"
              description="Premium certification program recognizes top-tier service providers with advanced AI-verified credentials and performance metrics."
              icon={<Award className="w-8 h-8 text-white" />}
              gradient="trust"
              delay={600}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient-plasma mb-6">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who found their perfect service providers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient-neural mb-6">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient-quantum mb-6">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our AI-powered platform
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <FAQItem key={index} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="glass-strong rounded-4xl p-12 text-center">
            <h2 className="text-3xl font-bold text-gradient-plasma mb-6">
              Stay Updated with Elite 2025
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get the latest updates on new features, AI improvements, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-background/50 backdrop-blur-sm border border-border rounded-2xl placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neural-500/50 focus:border-neural-500/50 transition-all duration-300"
              />
              <button className="bg-gradient-neural text-white px-8 py-3 rounded-2xl font-medium hover:shadow-glow-neural transition-all duration-300 flex items-center">
                <Send className="w-4 h-4 mr-2" />
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-16 mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-4xl p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-neural rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gradient-neural">Elite 2025</span>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  The world's most advanced AI-powered service marketplace.
                  Connecting millions of customers with verified professionals through revolutionary neural network technology.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-neural-50 transition-colors">
                    <Facebook className="w-5 h-5 text-neural-600" />
                  </a>
                  <a href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-neural-50 transition-colors">
                    <Twitter className="w-5 h-5 text-neural-600" />
                  </a>
                  <a href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-neural-50 transition-colors">
                    <Instagram className="w-5 h-5 text-neural-600" />
                  </a>
                  <a href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-neural-50 transition-colors">
                    <Linkedin className="w-5 h-5 text-neural-600" />
                  </a>
                  <a href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-neural-50 transition-colors">
                    <Github className="w-5 h-5 text-neural-600" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-bold text-gradient-neural mb-4">Platform</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-muted-foreground hover:text-neural-600 transition-colors">How It Works</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-neural-600 transition-colors">Find Services</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-neural-600 transition-colors">Become a Provider</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-neural-600 transition-colors">Mobile Apps</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-neural-600 transition-colors">Enterprise</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="font-bold text-gradient-quantum mb-4">Support</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-muted-foreground hover:text-neural-600 transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-neural-600 transition-colors">Safety Guide</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-neural-600 transition-colors">Community</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-neural-600 transition-colors">Contact Us</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-neural-600 transition-colors">Trust & Safety</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-bold text-gradient-trust mb-4">Contact</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-muted-foreground">
                    <Phone className="w-4 h-4 mr-3 text-neural-500" />
                    <span>+1 (555) 123-4567</span>
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <Mail className="w-4 h-4 mr-3 text-neural-500" />
                    <span>hello@elite2025.com</span>
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-3 text-neural-500" />
                    <span>San Francisco, CA</span>
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <MessageCircle className="w-4 h-4 mr-3 text-neural-500" />
                    <span>24/7 Live Chat</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-muted-foreground mb-4 md:mb-0">
                © 2025 Elite 2025. All rights reserved. Powered by Neural Network Technology.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-muted-foreground hover:text-neural-600 transition-colors">Privacy Policy</a>
                <a href="#" className="text-muted-foreground hover:text-neural-600 transition-colors">Terms of Service</a>
                <a href="#" className="text-muted-foreground hover:text-neural-600 transition-colors">Cookie Policy</a>
                <a href="#" className="text-muted-foreground hover:text-neural-600 transition-colors">Accessibility</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Live Chat Widget */}
      <LiveChatWidget />
    </div>
  );
}
