"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  Zap,
  Shield,
  Users,
  Sparkles,
  Search,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight,
  Brain,
  Heart,
  Home,
  Briefcase,
  Car,
  Target,
  ChevronRight,
  Globe,
  Database,
  Cpu,
  MessageCircle,
  Activity,
  Play,
  Layers,
  Bot,
  Network,
  Atom,
  Workflow,
  Gauge,
  Radar,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const aiMetrics = [
    {
      label: "Neural Networks",
      value: "2.1M+",
      icon: Brain,
      description: "Active AI Models",
      trend: "+847%",
      gradient: "from-neural-500 to-quantum-500",
    },
    {
      label: "Quantum Processing",
      value: "50M+",
      icon: Atom,
      description: "Operations per Second",
      trend: "+312%",
      gradient: "from-quantum-500 to-trust-500",
    },
    {
      label: "Trust Score",
      value: "99.7%",
      icon: Shield,
      description: "Security Rating",
      trend: "Industry Leading",
      gradient: "from-trust-500 to-plasma-500",
    },
    {
      label: "Global Reach",
      value: "180",
      icon: Globe,
      description: "Countries Connected",
      trend: "Expanding",
      gradient: "from-plasma-500 to-neural-500",
    },
  ];

  const aiFeatures = [
    {
      title: "Neural Matching Engine",
      subtitle: "AI-Powered Service Discovery",
      description:
        "Our quantum-enhanced neural networks analyze millions of data points to create perfect matches between users and service providers in real-time.",
      icon: Brain,
      gradient: "bg-gradient-neural",
      stats: { accuracy: "96.8%", speed: "<100ms", learning: "24/7" },
      glow: "shadow-glow-neural",
    },
    {
      title: "Quantum Verification",
      subtitle: "Blockchain-Secured Trust",
      description:
        "Every professional undergoes quantum-encrypted verification using advanced biometric analysis, background checks, and continuous monitoring.",
      icon: Atom,
      gradient: "bg-gradient-quantum",
      stats: { verified: "100%", blockchain: "Secured", trust: "A+" },
      glow: "shadow-glow-quantum",
    },
    {
      title: "Plasma Pricing",
      subtitle: "Dynamic Fair Pricing",
      description:
        "Advanced plasma algorithms ensure transparent, competitive pricing while optimizing provider income through real-time market analysis.",
      icon: Workflow,
      gradient: "bg-gradient-plasma",
      stats: { savings: "25%", transparency: "100%", optimization: "Real-time" },
      glow: "shadow-glow-plasma",
    },
  ];

  const serviceCategories = [
    {
      name: "Neural Computing",
      icon: Cpu,
      count: "12.4K",
      gradient: "from-neural-400 to-neural-600",
      popular: true,
      description: "AI & Machine Learning",
    },
    {
      name: "Quantum Services",
      icon: Atom,
      count: "8.7K",
      gradient: "from-quantum-400 to-quantum-600",
      popular: false,
      description: "Advanced Computing",
    },
    {
      name: "Trust Systems",
      icon: Shield,
      count: "6.2K",
      gradient: "from-trust-400 to-trust-600",
      popular: true,
      description: "Security & Verification",
    },
    {
      name: "Plasma Networks",
      icon: Network,
      count: "4.8K",
      gradient: "from-plasma-400 to-plasma-600",
      popular: false,
      description: "Advanced Networking",
    },
    {
      name: "Home Automation",
      icon: Home,
      count: "3.1K",
      gradient: "from-neural-400 to-quantum-400",
      popular: false,
      description: "Smart Living",
    },
    {
      name: "Professional AI",
      icon: Briefcase,
      count: "9.3K",
      gradient: "from-quantum-400 to-trust-400",
      popular: true,
      description: "Business Intelligence",
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stratosphere dark:bg-eclipse text-eclipse dark:text-stratosphere overflow-hidden relative">
      {/* Advanced Neural Background */}
      <div className="absolute inset-0">
        {/* Primary Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-neural-50/80 via-quantum-50/60 to-trust-50/80 dark:from-neural-950/60 dark:via-quantum-950/40 dark:to-trust-950/60" />
        
        {/* Neural Network Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(var(--neural-500)/0.15),transparent_60%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(var(--neural-400)/0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(var(--quantum-500)/0.12),transparent_60%)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(var(--quantum-400)/0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_80%,rgba(var(--trust-500)/0.1),transparent_60%)] dark:bg-[radial-gradient(circle_at_60%_80%,rgba(var(--trust-400)/0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(var(--plasma-500)/0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_40%_60%,rgba(var(--plasma-400)/0.1),transparent_60%)]" />
        
        {/* Plasma Energy Grid */}
        <div className="absolute inset-0 opacity-20 dark:opacity-30"
             style={{
               backgroundImage: `
                 linear-gradient(90deg, rgba(var(--neural-500), 0.1) 1px, transparent 1px),
                 linear-gradient(180deg, rgba(var(--quantum-500), 0.1) 1px, transparent 1px)
               `,
               backgroundSize: '40px 40px'
             }} />
      </div>

      {/* Floating Neural Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-3 h-3 bg-neural-400 rounded-full animate-float opacity-60" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-[15%] w-2 h-2 bg-quantum-400 rounded-full animate-pulse-glow opacity-50" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-[20%] w-4 h-4 bg-trust-400 rounded-full animate-neural-pulse opacity-40" style={{ animationDelay: '2s' }} />
        <div className="absolute top-60 left-[30%] w-2.5 h-2.5 bg-plasma-400 rounded-full animate-float opacity-50" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-20 right-[25%] w-3 h-3 bg-neural-400 rounded-full animate-pulse-glow opacity-45" style={{ animationDelay: '4s' }} />
        <div className="absolute top-[30%] right-[10%] w-1.5 h-1.5 bg-quantum-400 rounded-full animate-neural-pulse opacity-60" style={{ animationDelay: '5s' }} />
      </div>

      {/* Hero Section - Neural Interface */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="container-wide text-center">
          {/* AI Status Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-strong border border-neural-200/50 dark:border-neural-700/50 mb-12 group hover-glass transition-all duration-500">
            <div className="w-3 h-3 bg-trust-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-neural-700 dark:text-neural-300">
              Neural Networks Active: 2.1M+ Global Users
            </span>
            <Bot className="w-5 h-5 text-neural-500 dark:text-neural-400 animate-ai-thinking" />
          </div>

          {/* Main Headline - Quantum Typography */}
          <h1 className="text-display-xl font-black mb-8 leading-none">
            <span className="text-gradient-neural">
              Local Services
            </span>
            <br />
            <span className="text-gradient-quantum">
              Redefined by AI
            </span>
          </h1>

          {/* Neural Subtitle */}
          <p className="text-body-l text-nimbus dark:text-cirrus mb-16 max-w-5xl mx-auto leading-relaxed">
            Experience the future of local services with our 
            <span className="text-gradient-plasma font-semibold">
              {" "}quantum-enhanced AI platform{" "}
            </span>
            that connects you with verified professionals through advanced neural matching algorithms.
          </p>

          {/* Quantum Search Interface */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-neural rounded-4xl blur-xl opacity-30 dark:opacity-40 group-hover:opacity-50 dark:group-hover:opacity-60 transition duration-1000" />
              <div className="relative glass-strong rounded-4xl p-3 border border-neural-200/30 dark:border-neural-700/30 shadow-glass-lg">
                <div className="flex items-center gap-6 px-8 py-6">
                  <div className="w-8 h-8 rounded-full bg-gradient-neural flex items-center justify-center shadow-glow-neural">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <input
                    type="text"
                    placeholder="Describe your perfect service match..."
                    className="flex-1 bg-transparent border-none outline-none text-eclipse dark:text-stratosphere placeholder-nimbus dark:placeholder-cirrus text-lg font-medium focus-neural"
                  />
                  <Button className="bg-gradient-neural hover:shadow-glow-neural text-white rounded-3xl px-10 py-4 font-bold text-lg transition-all duration-500 hover-lift">
                    Neural Search
                    <Radar className="w-5 h-5 ml-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quantum Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
            <Button
              size="lg"
              className="relative bg-gradient-neural hover:shadow-glow-neural text-white rounded-3xl px-16 py-6 font-bold text-xl shadow-glass hover-lift transition-all duration-500 group"
              asChild
            >
              <Link href="/browse">
                <Brain className="w-6 h-6 mr-4 group-hover:animate-neural-pulse" />
                Activate Neural Search
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-3xl px-16 py-6 font-bold text-xl border-2 border-neural-300 dark:border-neural-600 text-neural-700 dark:text-neural-300 hover:bg-neural-50 dark:hover:bg-neural-900/50 hover:border-neural-400 dark:hover:border-neural-500 hover-glass transition-all duration-500"
              asChild
            >
              <Link href="/become-provider">
                Join Neural Network
                <Network className="w-6 h-6 ml-4" />
              </Link>
            </Button>
          </div>

          {/* Trust Indicators - Quantum Enhanced */}
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-80 dark:opacity-70">
            {[
              { icon: Shield, text: "Quantum Verified", color: "text-trust-500" },
              { icon: Award, text: "Neural Rated", color: "text-neural-500" },
              { icon: Zap, text: "Instant Matching", color: "text-quantum-500" },
              { icon: Users, text: "AI Community", color: "text-plasma-500" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-base text-nimbus dark:text-cirrus hover-lift transition-all duration-300"
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Metrics Section - Neural Dashboard */}
      <section className="relative z-10 py-32 px-6">
        <div className="container-wide">
          <div className="text-center mb-24">
            <h2 className="text-display-l font-bold mb-8">
              <span className="text-gradient-quantum">Neural Analytics</span>
            </h2>
            <p className="text-body-l text-nimbus dark:text-cirrus max-w-4xl mx-auto">
              Real-time metrics from our quantum-enhanced AI platform that's revolutionizing
              how humans connect with local services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiMetrics.map((metric, index) => (
              <Card
                key={index}
                className="relative glass-strong border-0 rounded-3xl p-8 group hover-glass hover-lift transition-all duration-700 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-15 transition-opacity duration-700 rounded-3xl`} />
                
                <CardContent className="p-0 relative z-10">
                  <div
                    className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${metric.gradient} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-glow transition-all duration-500`}
                  >
                    <metric.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="text-5xl font-black mb-3 text-eclipse dark:text-stratosphere">
                    {metric.value}
                  </div>
                  
                  <div className="text-heading-m font-semibold text-storm dark:text-cirrus mb-2">
                    {metric.label}
                  </div>
                  
                  <div className="text-sm text-nimbus dark:text-cirrus mb-4">
                    {metric.description}
                  </div>
                  
                  <div className="text-sm text-trust-500 dark:text-trust-400 font-bold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {metric.trend}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section - Quantum Interface */}
      <section className="relative z-10 py-32 px-6">
        <div className="container-wide">
          <div className="text-center mb-24">
            <h2 className="text-display-l font-bold mb-8">
              <span className="text-gradient-neural">Why Choose</span>
              <br />
              <span className="text-gradient-plasma">Neural Loconomy</span>
            </h2>
            <p className="text-body-l text-nimbus dark:text-cirrus max-w-4xl mx-auto">
              Experience the next generation of local services with quantum-enhanced AI matching,
              blockchain verification, and plasma-optimized pricing algorithms
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {aiFeatures.map((feature, index) => (
              <Card
                key={index}
                className="relative glass-strong border-0 rounded-4xl p-10 group hover-glass hover-scale transition-all duration-700 overflow-hidden"
              >
                <div className={`absolute inset-0 ${feature.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-8 transition-opacity duration-700`} />
                
                <CardContent className="p-0 relative z-10">
                  <div
                    className={`w-24 h-24 rounded-4xl ${feature.gradient} flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 ${feature.glow}`}
                  >
                    <feature.icon className="w-12 h-12 text-white" />
                  </div>

                  <div className="text-sm text-nimbus dark:text-cirrus font-semibold uppercase tracking-widest mb-3">
                    {feature.subtitle}
                  </div>
                  
                  <h3 className="text-heading-l font-bold text-eclipse dark:text-stratosphere mb-6">
                    {feature.title}
                  </h3>
                  
                  <p className="text-body-m text-storm dark:text-cirrus mb-8 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {Object.entries(feature.stats).map(([key, value], i) => (
                      <div key={i} className="text-center">
                        <div className="text-xl font-bold text-eclipse dark:text-stratosphere mb-1">
                          {value}
                        </div>
                        <div className="text-xs text-nimbus dark:text-cirrus capitalize">
                          {key}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full rounded-3xl border-neural-300 dark:border-neural-600 text-neural-700 dark:text-neural-300 hover:bg-neural-50 dark:hover:bg-neural-900/50 hover-glass transition-all duration-500"
                  >
                    Explore Technology
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories - Neural Grid */}
      <section className="relative z-10 py-32 px-6">
        <div className="container-wide">
          <div className="text-center mb-24">
            <h2 className="text-display-l font-bold mb-8">
              <span className="text-gradient-trust">Service Categories</span>
            </h2>
            <p className="text-body-l text-nimbus dark:text-cirrus max-w-4xl mx-auto">
              Discover trusted professionals across all neural-enhanced service categories
              in your quantum-connected local area
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((category, index) => (
              <Card
                key={index}
                className="relative glass-strong border-0 rounded-3xl p-8 group hover-glass hover-lift transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-15 transition-opacity duration-500 rounded-3xl`} />
                
                <CardContent className="p-0 relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-16 h-16 rounded-3xl bg-gradient-to-r ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}
                    >
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    {category.popular && (
                      <Badge className="bg-trust-500/20 text-trust-300 border-trust-500/30 px-3 py-1">
                        Popular
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-heading-m font-bold text-eclipse dark:text-stratosphere mb-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-nimbus dark:text-cirrus mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-storm dark:text-cirrus">
                      {category.count} professionals
                    </span>
                    <ChevronRight className="w-5 h-5 text-nimbus dark:text-cirrus group-hover:text-neural-500 dark:group-hover:text-neural-400 group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Neural CTA Section */}
      <section className="relative z-10 py-40 px-6">
        <div className="container-narrow text-center">
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-neural rounded-4xl blur-3xl opacity-20 dark:opacity-30" />
            <div className="relative glass-strong rounded-4xl p-16 border border-neural-200/30 dark:border-neural-700/30 shadow-glass-xl">
              <h2 className="text-display-l font-bold mb-8">
                <span className="text-gradient-neural">Ready to Enter</span>
                <br />
                <span className="text-gradient-quantum">the Neural Future?</span>
              </h2>
              
              <p className="text-body-l text-nimbus dark:text-cirrus mb-16 max-w-3xl mx-auto">
                Join over 2 million users who trust our quantum-enhanced AI platform
                to connect them with verified local professionals
              </p>

              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Button
                  size="lg"
                  className="relative bg-gradient-neural hover:shadow-glow-neural text-white rounded-3xl px-16 py-6 font-bold text-xl transition-all duration-500 hover-lift"
                  asChild
                >
                  <Link href="/auth/signup">
                    <Radar className="w-6 h-6 mr-4" />
                    Activate Neural Search
                  </Link>
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-3xl px-16 py-6 font-bold text-xl border-2 border-neural-300 dark:border-neural-600 text-neural-700 dark:text-neural-300 hover:bg-neural-50 dark:hover:bg-neural-900/50 hover-glass transition-all duration-500"
                  asChild
                >
                  <Link href="/become-provider">
                    <Network className="w-6 h-6 mr-4" />
                    Join Neural Network
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
