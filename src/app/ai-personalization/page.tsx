import { Metadata } from 'next';
import { HyperPersonalizedAI } from '@/components/features/ai/hyper-personalized-ai';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Users,
  Target,
  Zap,
  Eye,
  Heart,
  Settings,
  BarChart3,
  Lightbulb,
  Shield
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Personalization | Loconomy - Hyper-Personalized User Experience',
  description: 'Experience the power of our AI-driven personalization engine that learns and adapts to each user\'s unique preferences and behavior patterns.',
  keywords: 'AI personalization, machine learning, user experience, behavioral analytics, personalized recommendations',
};

export default function AIPersonalizationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full">
            <Brain className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-purple-700">AI-Powered Personalization</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Hyper-Personalized AI
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Our revolutionary AI engine learns from every interaction, adapting to each user's unique preferences 
            and behavior patterns to deliver truly personalized experiences.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">99.2%</div>
              <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Real-time</div>
              <div className="text-sm text-muted-foreground">Learning Speed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">847K+</div>
              <div className="text-sm text-muted-foreground">Data Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">∞</div>
              <div className="text-sm text-muted-foreground">Adaptability</div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-500" />
                Behavioral Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Continuously analyzes user interactions, preferences, and patterns to build comprehensive behavioral profiles.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>Real-time pattern recognition</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Predictive behavior modeling</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Adaptive recommendation engine</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Precision Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Delivers highly accurate service recommendations based on individual user preferences and context.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Contextual understanding</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                  <span>Multi-factor analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-teal-500 rounded-full" />
                  <span>Quality-price optimization</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-500" />
                Instant Adaptation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Adjusts recommendations and interface elements in real-time based on user feedback and behavior changes.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Sub-second response times</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span>Dynamic UI adjustments</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-lime-500 rounded-full" />
                  <span>Continuous optimization</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live AI Demo */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Brain className="h-6 w-6 text-purple-500" />
                  Live AI Personalization Engine
                  <Badge className="bg-green-500 text-white">ACTIVE</Badge>
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Experience real-time AI learning and adaptation in action
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-600">Live & Learning</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <HyperPersonalizedAI />
          </CardContent>
        </Card>

        {/* Technical Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                AI Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Deep Learning Models</span>
                  <Badge variant="outline">Neural Networks</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Natural Language Processing</span>
                  <Badge variant="outline">GPT-4 Integration</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Computer Vision</span>
                  <Badge variant="outline">Image Recognition</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Predictive Analytics</span>
                  <Badge variant="outline">Time Series</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Reinforcement Learning</span>
                  <Badge variant="outline">Q-Learning</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Data Encryption</span>
                  <Badge variant="outline" className="text-green-600">AES-256</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Privacy Controls</span>
                  <Badge variant="outline" className="text-green-600">GDPR Compliant</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Local Processing</span>
                  <Badge variant="outline" className="text-green-600">Edge Computing</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Anonymization</span>
                  <Badge variant="outline" className="text-green-600">Differential Privacy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">User Control</span>
                  <Badge variant="outline" className="text-green-600">Opt-out Anytime</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="space-y-6">
            <h2 className="text-3xl font-bold">Why AI Personalization Matters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">67% Higher Satisfaction</h3>
                <p className="text-sm text-muted-foreground">
                  Users report significantly higher satisfaction with personalized recommendations
                </p>
              </div>
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">3x Better Matches</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered matching delivers 3x more relevant service provider recommendations
                </p>
              </div>
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">85% User Retention</h3>
                <p className="text-sm text-muted-foreground">
                  Personalized experiences lead to much higher user engagement and retention
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Experience the Future of Personalization</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users already benefiting from our AI-powered personalization engine. 
            Start your personalized journey today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Sparkles className="h-4 w-4 mr-2" />
              Try AI Personalization
            </Button>
            <Button size="lg" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
