"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "./signup-form";
import { AIAuthAssistant } from "../../signin/components/ai-auth-assistant";
import { SecurityIndicator } from "../../signin/components/security-indicator";
import { 
  Sparkles, 
  Shield, 
  Zap, 
  Users, 
  Github, 
  ArrowRight, 
  CheckCircle,
  Brain,
  Fingerprint,
  Globe,
  Smartphone,
  Monitor,
  Award,
  TrendingUp,
  Clock,
  Star,
  Lock,
  Eye,
  MousePointer,
  Lightbulb,
  ChevronRight,
  UserPlus,
  Rocket,
  Target,
  Briefcase
} from "lucide-react";

export function SignUpPageContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userIntent, setUserIntent] = useState<'business' | 'personal' | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Update time every minute for personalization
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // AI-powered greeting based on time and context
  const getPersonalizedGreeting = () => {
    const hour = currentTime.getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    const greeting = `Good ${timeOfDay}`;
    
    if (redirectTo) {
      return `${greeting}! Ready to unlock premium features?`;
    }
    
    return `${greeting}! Let's create your AI-powered profile.`;
  };

  // Dynamic trust indicators based on current metrics
  const trustMetrics = [
    { 
      icon: Shield, 
      label: "Bank-Level Security", 
      value: "256-bit SSL",
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    { 
      icon: Zap, 
      label: "Instant Setup", 
      value: "< 30s",
      color: "text-yellow-500",
      bg: "bg-yellow-100 dark:bg-yellow-900/30"
    },
    { 
      icon: Users, 
      label: "Join Community", 
      value: "2.4M+",
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    }
  ];

  // AI-powered benefit highlights
  const signupBenefits = [
    {
      icon: Brain,
      title: "AI Personal Assistant",
      description: "Get 24/7 intelligent support for all your service needs",
      tag: "Premium"
    },
    {
      icon: Target,
      title: "Smart Recommendations",
      description: "Machine learning finds the perfect match every time",
      tag: "AI-Powered"
    },
    {
      icon: Rocket,
      title: "Instant Onboarding",
      description: "Set up your profile in seconds with AI guidance",
      tag: "Fast"
    },
    {
      icon: Award,
      title: "Priority Access",
      description: "Early access to new features and premium providers",
      tag: "Exclusive"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 relative overflow-hidden">
      
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
        
        {/* Dynamic floating shapes with improved animations */}
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-[15%] right-[15%] w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-[40%] right-[20%] w-48 h-48 bg-gradient-to-r from-blue-400/15 to-cyan-400/15 rounded-full blur-2xl animate-float animation-delay-4000"></div>
        
        {/* Neural network pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, hsl(120 70% 50%) 2px, transparent 0),
                radial-gradient(circle at 75% 75%, hsl(280 65% 60%) 1px, transparent 0),
                radial-gradient(circle at 50% 50%, hsl(200 80% 55%) 1.5px, transparent 0)
              `,
              backgroundSize: '100px 100px, 150px 150px, 80px 80px'
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Branding & Benefits */}
          <div className="space-y-8 text-center lg:text-left">
            
            {/* Enhanced Branding */}
            <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-600 via-emerald-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl">
                    <UserPlus className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 animate-pulse opacity-20"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-cyan-500 bg-clip-text text-transparent">
                    Loconomy
                  </h1>
                  <Badge className="mt-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                    <UserPlus className="w-3 h-3 mr-1" />
                    Join the Revolution
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  {getPersonalizedGreeting()}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Join millions of users who've discovered the future of local services. 
                  Create your free account in 30 seconds and unlock AI-powered benefits.
                </p>
              </div>
            </div>

            {/* Signup Benefits Showcase */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Rocket className="w-6 h-6 text-green-600" />
                What You'll Get Instantly
              </h3>
              
              <div className="grid gap-4">
                {signupBenefits.map((benefit, index) => (
                  <Card key={index} className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/20 dark:border-gray-700/20 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                          <benefit.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {benefit.title}
                            </h4>
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              {benefit.tag}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {benefit.description}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Real-time Trust Metrics */}
            <div className="grid grid-cols-3 gap-4">
              {trustMetrics.map((metric, index) => (
                <Card key={index} className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-700/20 hover:scale-105 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl ${metric.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <metric.icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </div>
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {metric.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="font-medium">2.4M+ members joined</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-1 font-medium">4.9/5 satisfaction</span>
              </div>
            </div>
          </div>

          {/* Right Column - Authentication */}
          <div className="w-full max-w-md mx-auto space-y-6">
            
            {/* Security Indicator */}
            <SecurityIndicator />

            {/* Main Auth Card */}
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-6 relative">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Free Forever
                  </Badge>
                </div>
                
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Create Your Account
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Join the AI-powered service revolution
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                
                {/* Main Sign Up Form */}
                <SignUpForm redirectTo={redirectTo || undefined} />

                {/* AI Assistant Toggle */}
                <div className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAIAssistant(!showAIAssistant)}
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    {showAIAssistant ? 'Hide' : 'Need'} AI Setup Helper?
                  </Button>
                </div>

                {/* AI Assistant */}
                {showAIAssistant && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <AIAuthAssistant />
                  </div>
                )}

                {/* Enhanced Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/95 dark:bg-gray-900/95 text-gray-500 dark:text-gray-400 font-medium">
                      Or sign up with
                    </span>
                  </div>
                </div>

                {/* Enhanced Social Login */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>

                  <Button
                    variant="outline"
                    className="h-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    GitHub
                  </Button>
                </div>

                {/* Enhanced Sign In Link */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link
                      href="/auth/signin"
                      className="font-semibold text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors inline-flex items-center group"
                    >
                      Sign in now
                      <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </p>
                  
                  <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>No credit card</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      <span>30-second setup</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Brain className="w-3 h-3 text-purple-500" />
                      <span>AI-powered</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced CTA Card */}
            <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">Are You a Service Provider?</h3>
                    <p className="text-green-100 text-sm">Start earning with our premium provider tools</p>
                  </div>
                  <Button size="sm" className="bg-white text-green-600 hover:bg-gray-100">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
