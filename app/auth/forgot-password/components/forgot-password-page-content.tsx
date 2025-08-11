"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForgotPasswordForm } from "./forgot-password-form";
import { AIAuthAssistant } from "../../signin/components/ai-auth-assistant";
import { SecurityIndicator } from "../../signin/components/security-indicator";
import { 
  Sparkles, 
  Shield, 
  Zap, 
  Users, 
  ArrowRight, 
  CheckCircle,
  Brain,
  Mail,
  Clock,
  Star,
  Lock,
  RotateCcw,
  ChevronRight,
  ArrowLeft,
  KeyRound,
  RefreshCw,
  MessageCircle,
  Smartphone
} from "lucide-react";

export function ForgotPasswordPageContent() {
  const [currentTime, setCurrentTime] = useState(new Date());
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
    return `Good ${timeOfDay}! Let's get you back into your account.`;
  };

  // Dynamic security indicators
  const securityFeatures = [
    { 
      icon: Shield, 
      label: "Secure Reset", 
      value: "Bank-grade",
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    { 
      icon: Clock, 
      label: "Quick Process", 
      value: "< 2 min",
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      icon: Mail, 
      label: "Email Verified", 
      value: "Instant",
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    }
  ];

  // Reset process steps
  const resetSteps = [
    {
      icon: Mail,
      title: "Enter Your Email",
      description: "We'll send a secure reset link to your inbox",
      status: "active"
    },
    {
      icon: KeyRound,
      title: "Check Your Email",
      description: "Click the verification link we send you",
      status: "pending"
    },
    {
      icon: Lock,
      title: "Create New Password",
      description: "Set a strong, new password for your account",
      status: "pending"
    },
    {
      icon: CheckCircle,
      title: "Access Restored",
      description: "Sign in with your new credentials",
      status: "pending"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 relative overflow-hidden">
      
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
        
        {/* Dynamic floating shapes */}
        <div className="absolute top-[15%] left-[15%] w-64 h-64 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-[20%] right-[10%] w-48 h-48 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-2xl animate-float animation-delay-2000"></div>
        <div className="absolute top-[40%] right-[25%] w-56 h-56 bg-gradient-to-r from-indigo-400/15 to-blue-400/15 rounded-full blur-3xl animate-float animation-delay-4000"></div>
        
        {/* Neural network pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, hsl(220 70% 50%) 2px, transparent 0),
                radial-gradient(circle at 75% 75%, hsl(260 65% 60%) 1px, transparent 0),
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
          
          {/* Left Column - Process & Information */}
          <div className="space-y-8 text-center lg:text-left">
            
            {/* Enhanced Branding */}
            <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl">
                    <RotateCcw className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 animate-pulse opacity-20"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-500 bg-clip-text text-transparent">
                    Loconomy
                  </h1>
                  <Badge className="mt-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                    <KeyRound className="w-3 h-3 mr-1" />
                    Password Recovery
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  {getPersonalizedGreeting()}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Don't worry, it happens to everyone! Our secure AI-powered recovery system 
                  will help you regain access to your account safely and quickly.
                </p>
              </div>
            </div>

            {/* Reset Process Steps */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-blue-600" />
                Recovery Process
              </h3>
              
              <div className="space-y-4">
                {resetSteps.map((step, index) => (
                  <Card key={index} className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/20 dark:border-gray-700/20 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300 group">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${
                          index === 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 
                          'bg-gray-200 dark:bg-gray-700'
                        } transition-all duration-300`}>
                          <step.icon className={`w-5 h-5 ${
                            index === 0 ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            Step {index + 1}: {step.title}
                            {index === 0 && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                Current
                              </Badge>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {step.description}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                          <div className={`w-4 h-4 rounded-full ${
                            index === 0 ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Security Features */}
            <div className="grid grid-cols-3 gap-4">
              {securityFeatures.map((feature, index) => (
                <Card key={index} className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-700/20 hover:scale-105 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl ${feature.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {feature.value}
                    </div>
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {feature.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="font-medium">100k+ accounts recovered</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-1 font-medium">99% success rate</span>
              </div>
            </div>
          </div>

          {/* Right Column - Recovery Form */}
          <div className="w-full max-w-md mx-auto space-y-6">
            
            {/* Back Button */}
            <Button variant="ghost" className="mb-4" asChild>
              <Link href="/auth/signin" className="flex items-center gap-2 hover:gap-3 transition-all duration-300">
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </Button>

            {/* Security Indicator */}
            <SecurityIndicator />

            {/* Main Recovery Card */}
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-6 relative">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Secure Recovery
                  </Badge>
                </div>
                
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Forgot Your Password?
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Enter your email and we'll send you a secure reset link
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                
                {/* Password Recovery Form */}
                <ForgotPasswordForm />

                {/* AI Assistant Toggle */}
                <div className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAIAssistant(!showAIAssistant)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    {showAIAssistant ? 'Hide' : 'Need'} Recovery Help?
                  </Button>
                </div>

                {/* AI Assistant */}
                {showAIAssistant && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <AIAuthAssistant />
                  </div>
                )}

                {/* Help Options */}
                <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Can't access your email?
                  </h3>
                  <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Check your spam/junk folder
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Wait up to 5 minutes for delivery
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Try a different email address
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                    <Link 
                      href="/customer-support" 
                      className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm inline-flex items-center gap-1 group"
                    >
                      Contact support for help
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Enhanced Sign In Link */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Remember your password?{" "}
                    <Link
                      href="/auth/signin"
                      className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors inline-flex items-center group"
                    >
                      Sign in now
                      <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">Need Immediate Help?</h3>
                    <p className="text-blue-100 text-sm">Our AI support is available 24/7</p>
                  </div>
                  <Button size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
                    <MessageCircle className="w-4 h-4" />
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
