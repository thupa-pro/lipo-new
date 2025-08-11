"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetPasswordForm } from "./reset-password-form";
import { AIAuthAssistant } from "../../signin/components/ai-auth-assistant";
import { SecurityIndicator } from "../../signin/components/security-indicator";
import { 
  Sparkles, 
  Shield, 
  Zap, 
  CheckCircle,
  Brain,
  Lock,
  Clock,
  Star,
  KeyRound,
  RefreshCw,
  ChevronRight,
  ArrowLeft,
  Fingerprint,
  Eye,
  AlertTriangle,
  UserCheck,
  Smartphone
} from "lucide-react";
import { authService } from "@/lib/auth/auth-utils";

export function ResetPasswordPageContent() {
  const searchParams = useSearchParams();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [error, setError] = useState("");

  // Update time every minute for personalization
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Check session validity
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await authService.getCurrentUser();
        setIsValidSession(!!user);
        
        if (!user) {
          setError('Invalid or expired reset link. Please request a new password reset.');
        }
      } catch (error) {
        console.error('Session check error:', error);
        setError('Unable to verify reset session. Please try again.');
        setIsValidSession(false);
      } finally {
        setSessionLoading(false);
      }
    };

    checkSession();
  }, []);

  // AI-powered greeting based on time and context
  const getPersonalizedGreeting = () => {
    const hour = currentTime.getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    return `Good ${timeOfDay}! Let's secure your account with a new password.`;
  };

  // Security strength indicators
  const securityFeatures = [
    { 
      icon: Shield, 
      label: "Military-Grade", 
      value: "AES-256",
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    { 
      icon: Clock, 
      label: "Session Valid", 
      value: "1 hour",
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      icon: Fingerprint, 
      label: "Identity Verified", 
      value: "Secure",
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    }
  ];

  // Password security tips
  const securityTips = [
    {
      icon: Lock,
      title: "Use Strong Passwords",
      description: "Combine uppercase, lowercase, numbers, and symbols",
      priority: "high"
    },
    {
      icon: Eye,
      title: "Keep It Private",
      description: "Never share your password with anyone",
      priority: "high"
    },
    {
      icon: RefreshCw,
      title: "Regular Updates",
      description: "Change passwords every 90 days for maximum security",
      priority: "medium"
    },
    {
      icon: UserCheck,
      title: "Enable 2FA",
      description: "Add an extra layer of protection to your account",
      priority: "high"
    }
  ];

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-2xl rounded-3xl">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">Verifying Reset Session</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Please wait while we validate your reset link...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 relative overflow-hidden">
      
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
        
        {/* Dynamic floating shapes */}
        <div className="absolute top-[15%] left-[15%] w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-[20%] right-[10%] w-48 h-48 bg-gradient-to-r from-green-400/15 to-emerald-400/15 rounded-full blur-2xl animate-float animation-delay-2000"></div>
        <div className="absolute top-[40%] right-[25%] w-56 h-56 bg-gradient-to-r from-blue-400/15 to-cyan-400/15 rounded-full blur-3xl animate-float animation-delay-4000"></div>
        
        {/* Neural network pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, hsl(280 70% 50%) 2px, transparent 0),
                radial-gradient(circle at 75% 75%, hsl(220 65% 60%) 1px, transparent 0),
                radial-gradient(circle at 50% 50%, hsl(260 80% 55%) 1.5px, transparent 0)
              `,
              backgroundSize: '100px 100px, 150px 150px, 80px 80px'
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Security & Tips */}
          <div className="space-y-8 text-center lg:text-left">
            
            {/* Enhanced Branding */}
            <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl">
                    <KeyRound className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 animate-pulse opacity-20"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent">
                    Loconomy
                  </h1>
                  <Badge className="mt-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                    <Lock className="w-3 h-3 mr-1" />
                    Password Reset
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  {getPersonalizedGreeting()}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Your identity has been verified! Create a strong new password to secure your account 
                  and unlock all the AI-powered features Loconomy has to offer.
                </p>
              </div>
            </div>

            {/* Security Tips */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-600" />
                Password Security Tips
              </h3>
              
              <div className="grid gap-4">
                {securityTips.map((tip, index) => (
                  <Card key={index} className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/20 dark:border-gray-700/20 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300 group">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                          <tip.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {tip.title}
                            </h4>
                            <Badge variant="secondary" className={`text-xs ${
                              tip.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                              {tip.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {tip.description}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
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

            {/* Security Badge */}
            <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="font-medium">Trusted by millions</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-1 font-medium">Bank-level security</span>
              </div>
            </div>
          </div>

          {/* Right Column - Reset Form */}
          <div className="w-full max-w-md mx-auto space-y-6">
            
            {/* Security Indicator */}
            <SecurityIndicator />

            {/* Main Reset Card */}
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-6 relative">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-8 h-8 text-white" />
                </div>
                
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Create New Password
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Enter a strong password to secure your account
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                
                {/* Reset Form or Error State */}
                {isValidSession ? (
                  <ResetPasswordForm />
                ) : (
                  <div className="space-y-6">
                    <div className="bg-red-50 dark:bg-red-950/50 p-4 rounded-xl border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <div>
                          <h4 className="font-semibold text-red-900 dark:text-red-100">Invalid Reset Link</h4>
                          <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Button asChild className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <Link href="/auth/forgot-password">Request New Reset Link</Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full h-12">
                        <Link href="/auth/signin">Back to Sign In</Link>
                      </Button>
                    </div>
                  </div>
                )}

                {/* AI Assistant Toggle */}
                {isValidSession && (
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAIAssistant(!showAIAssistant)}
                      className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      {showAIAssistant ? 'Hide' : 'Need'} Password Help?
                    </Button>
                  </div>
                )}

                {/* AI Assistant */}
                {showAIAssistant && isValidSession && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <AIAuthAssistant />
                  </div>
                )}

                {/* Security Notice */}
                {isValidSession && (
                  <div className="bg-purple-50 dark:bg-purple-950/50 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Security Notice
                    </h4>
                    <div className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>This reset link expires in 1 hour</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Your new password will be encrypted immediately</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>You'll be signed in automatically after reset</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">Need Additional Help?</h3>
                    <p className="text-purple-100 text-sm">Contact our security team for assistance</p>
                  </div>
                  <Button size="sm" className="bg-white text-purple-600 hover:bg-gray-100">
                    <Shield className="w-4 h-4" />
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
