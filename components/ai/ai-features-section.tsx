'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Bot, 
  Brain, 
  Target, 
  Sparkles, 
  MessageSquare, 
  Zap, 
  Star, 
  TrendingUp, 
  Eye,
  Lightbulb,
  Gauge,
  ArrowRight,
  Play,
  Wand2
} from 'lucide-react'
import { AIChat } from './ai-chat'
import { SmartRecommendations } from './smart-recommendations'

export function AIFeaturesSection() {
  const [showChat, setShowChat] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered Features
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            Experience the Future of
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
              Service Discovery
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Our advanced AI assistant and smart recommendation engine help you find the perfect service providers instantly, 
            with personalized insights and intelligent matching powered by machine learning.
          </p>
        </div>

        {/* Main AI Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* AI Chat Assistant */}
          <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-2 hover:border-blue-300 dark:hover:border-blue-600 transform hover:scale-[1.02]">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    AI Chat Assistant
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Intelligent conversational AI that understands your needs
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Natural language understanding</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Voice input support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Real-time provider matching</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Booking assistance & quotes</span>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Gauge className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Confidence</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    94% Accuracy
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-[94%] transition-all duration-1000"></div>
                </div>
              </div>

              <Dialog open={showChat} onOpenChange={setShowChat}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Start AI Conversation
                    <Sparkles className="h-4 w-4 ml-2 group-hover:rotate-12 transition-transform" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[85vh] p-0 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
                  <DialogHeader className="p-6 pb-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <DialogTitle className="flex items-center text-xl">
                      <Bot className="h-6 w-6 mr-2 text-blue-600" />
                      AI Assistant - Powered by Advanced Machine Learning
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-hidden">
                    <AIChat />
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Smart Recommendations */}
          <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-2 hover:border-purple-300 dark:hover:border-purple-600 transform hover:scale-[1.02]">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Smart Recommendations
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    ML-powered provider matching with confidence scores
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Advanced matching algorithms</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Personalized provider suggestions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Real-time availability tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Detailed confidence metrics</span>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Match Quality</span>
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    96% Success Rate
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full w-[96%] transition-all duration-1000"></div>
                </div>
              </div>

              <Dialog open={showRecommendations} onOpenChange={setShowRecommendations}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <Wand2 className="h-5 w-5 mr-2" />
                    Get Smart Recommendations
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl h-[85vh] p-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                  <DialogHeader className="p-6 pb-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <DialogTitle className="flex items-center text-xl">
                      <Target className="h-6 w-6 mr-2 text-purple-600" />
                      Smart Recommendations - AI-Powered Provider Matching
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-auto p-6">
                    <SmartRecommendations />
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* AI Capabilities Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: Brain,
              title: "Neural Networks",
              description: "Advanced deep learning models analyze provider-customer compatibility",
              color: "from-blue-500 to-cyan-500",
              metric: "99.2% Uptime"
            },
            {
              icon: Eye,
              title: "Predictive Analytics", 
              description: "AI forecasts service quality and customer satisfaction outcomes",
              color: "from-purple-500 to-violet-500",
              metric: "94% Accuracy"
            },
            {
              icon: Lightbulb,
              title: "Smart Insights",
              description: "Real-time market intelligence and personalized recommendations",
              color: "from-green-500 to-teal-500",
              metric: "15M+ Insights"
            },
            {
              icon: Zap,
              title: "Instant Matching",
              description: "Sub-second provider matching with confidence scoring",
              color: "from-orange-500 to-red-500",
              metric: "< 500ms"
            }
          ].map((capability, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 transform hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${capability.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <capability.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {capability.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                  {capability.description}
                </p>
                
                <Badge variant="outline" className="text-xs">
                  {capability.metric}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Video Section */}
        <div className="text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-gray-900 to-blue-900 text-white border-0 shadow-2xl">
            <CardContent className="p-12">
              <div className="flex items-center justify-center mb-8">
                <div className="p-6 bg-white/20 rounded-full">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold mb-4">
                See AI in Action
              </h3>
              
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Watch how our AI assistant helps users find the perfect service providers 
                in under 30 seconds with 96% accuracy.
              </p>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white/50 hover:border-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo (2:30)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Ready to Experience AI-Powered Service Discovery?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have discovered the future of finding local services with our intelligent AI platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={showChat} onOpenChange={setShowChat}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Bot className="w-5 h-5 mr-2" />
                  Try AI Assistant
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[85vh] p-0">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="flex items-center text-xl">
                    <Bot className="h-6 w-6 mr-2 text-blue-600" />
                    AI Assistant
                  </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                  <AIChat />
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showRecommendations} onOpenChange={setShowRecommendations}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-purple-300 hover:border-purple-500 text-purple-700 hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Target className="w-5 h-5 mr-2" />
                  View Recommendations
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl h-[85vh] p-0">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="flex items-center text-xl">
                    <Target className="h-6 w-6 mr-2 text-purple-600" />
                    Smart Recommendations
                  </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-auto p-6">
                  <SmartRecommendations />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  )
}
