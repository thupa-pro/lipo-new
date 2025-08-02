"use client";

import { useState, useEffect } from 'react';
import { Search, Sparkles, Brain, Zap, Shield, Star, TrendingUp, Users, Award, ChevronRight } from 'lucide-react';

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

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stratosphere via-cirrus to-white">
      {/* Neural Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, hsl(var(--neural-500)) 2px, transparent 0),
                           radial-gradient(circle at 75px 75px, hsl(var(--quantum-500)) 1px, transparent 0)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-neural rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-display-l text-gradient-neural">Elite 2025</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-heading-m text-muted-foreground hover:text-neural-600 transition-colors">Platform</a>
              <a href="#" className="text-heading-m text-muted-foreground hover:text-neural-600 transition-colors">Solutions</a>
              <a href="#" className="text-heading-m text-muted-foreground hover:text-neural-600 transition-colors">Enterprise</a>
              <button className="bg-gradient-neural text-white px-6 py-3 rounded-2xl font-medium hover:shadow-glow-neural transition-all duration-300">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-16 pb-24">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <h1 className="text-display-xl text-gradient-neural mb-8 leading-none">
              AI-Native Service Platform
              <br />
              <span className="text-gradient-quantum">Built for 2025</span>
            </h1>
            <p className="text-body-l text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Experience the future of service connections with our revolutionary neural network-powered matching engine.
              Quantum-speed processing meets human-centric design.
            </p>
          </div>

          {/* Neural Search Interface */}
          <div className={`glass-strong rounded-4xl p-8 max-w-4xl mx-auto mb-16 transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <h2 className="text-display-l text-gradient-trust mb-6">Neural Search Interface</h2>
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-neural-400 w-6 h-6" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe your service needs... AI will understand"
                className="w-full pl-16 pr-6 py-6 bg-white/50 backdrop-blur-sm border border-white/30 rounded-3xl text-lg placeholder-neural-400 focus:outline-none focus:ring-2 focus:ring-neural-500/50 focus:border-neural-500/50 transition-all duration-300"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-neural text-white px-8 py-3 rounded-2xl font-medium hover:shadow-glow-neural transition-all duration-300">
                AI Search
              </button>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {['Home Cleaning', 'Tech Repair', 'Personal Training', 'Tutoring', 'Pet Care'].map((tag) => (
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
            <h2 className="text-display-l text-gradient-plasma mb-12">Quantum Metrics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              <MetricCard
                label="Active Neural Connections"
                value="2.4M+"
                trend="↗ +23.5%"
                icon={<Brain className="w-6 h-6 text-white" />}
                color="neural"
              />
              <MetricCard
                label="Quantum Processing Speed"
                value="<50ms"
                trend="↗ +15.2%"
                icon={<Zap className="w-6 h-6 text-white" />}
                color="quantum"
              />
              <MetricCard
                label="Trust Score Average"
                value="98.7%"
                trend="↗ +2.1%"
                icon={<Shield className="w-6 h-6 text-white" />}
                color="trust"
              />
              <MetricCard
                label="User Satisfaction"
                value="99.2%"
                trend="↗ +1.8%"
                icon={<Star className="w-6 h-6 text-white" />}
                color="plasma"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Grid */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-display-l text-gradient-neural mb-6">AI-Powered Features</h2>
            <p className="text-body-l text-muted-foreground max-w-2xl mx-auto">
              Revolutionary technology stack designed for the next generation of service platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Neural Matching"
              description="Advanced AI algorithms analyze millions of data points to create perfect service provider matches with unprecedented accuracy."
              icon={<Brain className="w-8 h-8 text-white" />}
              gradient="neural"
              delay={100}
            />
            <FeatureCard
              title="Quantum Processing"
              description="Lightning-fast computation engine processes complex matching algorithms in under 50ms for instant results."
              icon={<Zap className="w-8 h-8 text-white" />}
              gradient="quantum"
              delay={200}
            />
            <FeatureCard
              title="Trust Network"
              description="Blockchain-secured verification system ensures every interaction is protected by cryptographic trust protocols."
              icon={<Shield className="w-8 h-8 text-white" />}
              gradient="trust"
              delay={300}
            />
            <FeatureCard
              title="Plasma Analytics"
              description="Real-time analytics dashboard provides deep insights into platform performance and user behavior patterns."
              icon={<TrendingUp className="w-8 h-8 text-white" />}
              gradient="plasma"
              delay={400}
            />
            <FeatureCard
              title="Community Hub"
              description="Connect with millions of verified service providers and customers in our thriving ecosystem."
              icon={<Users className="w-8 h-8 text-white" />}
              gradient="neural"
              delay={500}
            />
            <FeatureCard
              title="Elite Certification"
              description="Premium certification program recognizes top-tier service providers with advanced AI-verified credentials."
              icon={<Award className="w-8 h-8 text-white" />}
              gradient="trust"
              delay={600}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="glass-strong rounded-4xl p-12 text-center">
            <h2 className="text-display-l text-gradient-plasma mb-6">
              Ready to Experience the Future?
            </h2>
            <p className="text-body-l text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join millions of users who have already upgraded to the Elite 2025 AI-native platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-neural text-white px-8 py-4 rounded-2xl font-medium hover:shadow-glow-neural transition-all duration-300 text-lg">
                Start Free Trial
              </button>
              <button className="glass px-8 py-4 rounded-2xl font-medium text-neural-600 hover:bg-neural-50 transition-all duration-300 text-lg">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
