"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { GlassmorphicContainer } from "@/components/admin/design-system/glassmorphic-container";
import { HolographicText } from "@/components/admin/design-system/holographic-text";
import { NeuralLoading } from "@/components/admin/design-system/neural-loading";
import AIChat from "@/components/ai/AIChat";
import {
  Play,
  Sparkles,
  Brain,
  Zap,
  Target,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Rocket,
  Globe,
  Search,
  MapPin,
  Clock,
  Shield,
  TrendingUp,
  Heart,
  Award,
  Smartphone,
  Monitor,
  Palette,
  Code,
  Database,
  Network
} from "lucide-react";

const demoSteps = [
  {
    id: 'search',
    title: 'Smart Search',
    description: 'Experience our AI-powered service discovery',
    icon: Search,
    gradient: 'from-blue-500 to-purple-500',
    features: ['Natural language search', 'Location-based results', 'Smart filtering']
  },
  {
    id: 'match',
    title: 'AI Matching',
    description: 'Watch our neural networks find perfect matches',
    icon: Brain,
    gradient: 'from-purple-500 to-pink-500',
    features: ['Behavioral analysis', 'Preference learning', 'Quality scoring']
  },
  {
    id: 'book',
    title: 'Instant Booking',
    description: 'Seamless booking with real-time availability',
    icon: Zap,
    gradient: 'from-green-500 to-teal-500',
    features: ['Real-time scheduling', 'Secure payments', 'Instant confirmation']
  }
];

const aiFeatures = [
  {
    title: 'Neural Recommendations',
    description: 'AI learns your preferences and suggests perfect matches',
    icon: Brain,
    stat: '96.2%',
    statLabel: 'Match Accuracy'
  },
  {
    title: 'Predictive Availability',
    description: 'Smart scheduling with intelligent time predictions',
    icon: Clock,
    stat: '< 2hrs',
    statLabel: 'Response Time'
  },
  {
    title: 'Dynamic Pricing',
    description: 'Fair, transparent pricing optimized in real-time',
    icon: TrendingUp,
    stat: '23%',
    statLabel: 'Cost Savings'
  },
  {
    title: 'Quality Assurance',
    description: 'Continuous monitoring and improvement of service quality',
    icon: Shield,
    stat: '98.7%',
    statLabel: 'Success Rate'
  }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Homeowner',
    avatar: 'SC',
    text: 'The AI found me a perfect cleaning service in minutes! The quality was exceptional.',
    rating: 5,
    service: 'House Cleaning'
  },
  {
    name: 'Mike Rodriguez',
    role: 'Service Provider',
    avatar: 'MR',
    text: 'Loconomy transformed my plumbing business. The AI brings me ideal customers daily.',
    rating: 5,
    service: 'Plumbing'
  },
  {
    name: 'Emily Johnson',
    role: 'Tech Professional',
    avatar: 'EJ',
    text: 'Found an amazing math tutor for my daughter. The matching was incredibly accurate!',
    rating: 5,
    service: 'Tutoring'
  }
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleDemoStep = async (stepIndex: number) => {
    setIsLoading(true);
    setCurrentStep(stepIndex);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (stepIndex === 0) {
      setSearchQuery('House cleaning service');
      setShowResults(true);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      {/* Header spacing */}
      <div className="h-20 md:h-24"></div>

      {/* Hero Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              <Sparkles className="w-4 h-4 mr-2" />
              Interactive Demo
            </Badge>
            
            <HolographicText className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
              Experience the Future of Local Services
            </HolographicText>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              See how our AI-powered platform revolutionizes the way people find and book local services. 
              This interactive demo showcases our quantum-enhanced matching algorithms in action.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <EnhancedButton 
                size="lg"
                onClick={() => handleDemoStep(0)}
                className="px-8 py-4 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Interactive Demo
              </EnhancedButton>
              
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-4 text-lg border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                asChild
              >
                <Link href="/browse">
                  <Search className="w-5 h-5 mr-2" />
                  Try Live Search
                </Link>
              </Button>
            </div>
          </div>

          {/* Demo Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {demoSteps.map((step, index) => (
              <EnhancedCard 
                key={step.id}
                variant={currentStep === index ? "interactive" : "glass"}
                className={`cursor-pointer transition-all duration-500 ${
                  currentStep === index ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-102'
                }`}
                onClick={() => handleDemoStep(index)}
              >
                <EnhancedCardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${step.gradient} flex items-center justify-center shadow-lg ${
                    currentStep === index ? 'animate-pulse' : ''
                  }`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{step.description}</p>
                  
                  <div className="space-y-2">
                    {step.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  {currentStep === index && (
                    <Badge className="mt-4 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      Active Demo Step
                    </Badge>
                  )}
                </EnhancedCardContent>
              </EnhancedCard>
            ))}
          </div>

          {/* Interactive Demo Area */}
          <GlassmorphicContainer variant="intense" glow animated className="mb-16">
            <div className="p-8">
              <div className="text-center mb-8">
                <HolographicText className="text-2xl font-bold mb-4">
                  Live Demo Interface
                </HolographicText>
                <p className="text-gray-600 dark:text-gray-300">
                  Watch our AI in action as it processes your request
                </p>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center py-12">
                  <NeuralLoading size="lg" />
                  <p className="mt-4 text-lg font-medium">Neural networks processing...</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Analyzing {demoSteps[currentStep]?.title.toLowerCase()} requirements
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Search Interface */}
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="What service do you need?"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Your location"
                        className="w-64 pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <EnhancedButton size="lg" className="px-8 py-4">
                      <Brain className="w-5 h-5 mr-2" />
                      AI Search
                    </EnhancedButton>
                  </div>

                  {/* Demo Results */}
                  {showResults && (
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      {[
                        { name: 'CleanPro Services', rating: 4.9, price: '$80-120', response: '< 1hr', image: '🏠' },
                        { name: 'Sparkle & Shine', rating: 4.8, price: '$90-130', response: '< 2hrs', image: '✨' }
                      ].map((provider, index) => (
                        <EnhancedCard key={index} variant="interactive" className="hover:scale-102">
                          <EnhancedCardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl">
                                {provider.image}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-lg mb-2">{provider.name}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                    {provider.rating}
                                  </div>
                                  <span>{provider.price}</span>
                                  <span>Response: {provider.response}</span>
                                </div>
                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 mb-3">
                                  AI Match: 96% compatibility
                                </Badge>
                                <EnhancedButton size="sm" className="w-full">
                                  Book Now
                                </EnhancedButton>
                              </div>
                            </div>
                          </EnhancedCardContent>
                        </EnhancedCard>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </GlassmorphicContainer>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              <Brain className="w-4 h-4 mr-2" />
              AI Capabilities
            </Badge>
            <HolographicText className="text-4xl md:text-5xl font-bold mb-6">
              Powered by Advanced AI
            </HolographicText>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our neural networks continuously learn and optimize to provide the best possible matches and experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiFeatures.map((feature, index) => (
              <EnhancedCard key={index} variant="glass" className="hover:scale-105 transition-all duration-500">
                <EnhancedCardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {feature.stat}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {feature.statLabel}
                  </div>
                  
                  <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </EnhancedCardContent>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              <Heart className="w-4 h-4 mr-2" />
              Real Results
            </Badge>
            <HolographicText className="text-4xl md:text-5xl font-bold mb-6">
              Loved by Users & Providers
            </HolographicText>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how our AI has transformed the local services experience for thousands of users.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <EnhancedCard key={index} variant="glass" className="hover:scale-102 transition-all duration-500">
                <EnhancedCardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                    <Badge className="ml-auto text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {testimonial.service}
                    </Badge>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
                    "{testimonial.text}"
                  </blockquote>
                </EnhancedCardContent>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
          <HolographicText className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Ready to Experience AI-Powered Services?
          </HolographicText>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Join millions who have discovered the future of local services. Get matched with perfect providers in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <EnhancedButton 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-6 text-xl shadow-xl"
              asChild
            >
              <Link href="/browse">
                <Search className="w-6 h-6 mr-3" />
                Start Searching Now
              </Link>
            </EnhancedButton>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-white border-white/50 hover:border-white hover:bg-white/10 px-10 py-6 text-xl"
              asChild
            >
              <Link href="/become-provider">
                <Rocket className="w-6 h-6 mr-3" />
                Become a Provider
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* AI Chat Assistant */}
      <AIChat 
        agentId="maya"
        context={{
          currentPage: 'demo',
          userIntent: 'exploring_platform',
          demoStep: currentStep
        }}
        position="floating"
        theme="brand"
        proactiveMessage={true}
      />
    </div>
  );
}
