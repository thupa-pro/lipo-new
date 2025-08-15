"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerifyEmailForm } from "./verify-email-form";
import { AIAuthAssistant } from "../../signin/components/ai-auth-assistant";
import { SecurityIndicator } from "../../signin/components/security-indicator";
import { 
  Sparkles, 
  Shield, 
  Zap, 
  CheckCircle,
  Brain,
  Mail,
  Clock,
  Star,
  RefreshCw,
  ChevronRight,
  ArrowLeft,
  Inbox,
  MessageSquare,
  Smartphone,
  ArrowRight,
  UserCheck,
  AlertCircle,
  Search
} from "lucide-react";

export function VerifyEmailPageContent() {
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
    return `Good ${timeOfDay}! Just one step left to activate your account.`;
  };

  // Email verification features
  const verificationFeatures = [
    { 
      icon: Shield, 
      label: "Secure Delivery", 
      value: "Encrypted",
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    { 
      icon: Clock, 
      label: "Instant Send", 
      value: "< 30s",
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      icon: UserCheck, 
      label: "Auto Verify", 
      value: "One-Click",
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    }
  ];

  // Verification steps
  const verificationSteps = [
    {
      icon: Mail,
      title: "Email Sent",
      description: "We've sent a verification link to your inbox",
      status: "completed"
    },
    {
      icon: Inbox,
      title: "Check Your Email",
      description: "Look for our message in your inbox or spam folder",
      status: "active"
    },
    {
      icon: CheckCircle,
      title: "Click Verification Link",
      description: "One click will activate your account instantly",
      status: "pending"
    },
    {
      icon: Sparkles,
      title: "Account Activated",
      description: "Welcome to Loconomy! Start exploring features",
      status: "pending"
    }
  ];

  // Troubleshooting tips
  const troubleshootingTips = [
    {
      icon: Search,
      title: "Check Spam Folder",
      description: "Sometimes emails end up in spam or promotions",
      priority: "high"
    },
    {
      icon: Clock,
      title: "Wait a Few Minutes",
      description: "Email delivery can take up to 5 minutes",
      priority: "medium"
    },
    {
      icon: RefreshCw,
      title: "Try Different Email",
      description: "Use an alternative email address",
      priority: "medium"
    },
    {
      icon: MessageSquare,
      title: "Contact Support",
      description: "Our team is here to help 24/7",
      priority: "low"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 relative overflow-hidden">
      
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
        
        {/* Dynamic floating shapes */}
        <div className="absolute top-[15%] left-[15%] w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-[20%] right-[10%] w-48 h-48 bg-gradient-to-r from-indigo-400/15 to-purple-400/15 rounded-full blur-2xl animate-float animation-delay-2000"></div>
        <div className="absolute top-[40%] right-[25%] w-56 h-56 bg-gradient-to-r from-teal-400/15 to-cyan-400/15 rounded-full blur-3xl animate-float animation-delay-4000"></div>
        
        {/* Neural network pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, hsl(200 70% 50%) 2px, transparent 0),
                radial-gradient(circle at 75% 75%, hsl(240 65% 60%) 1px, transparent 0),
                radial-gradient(circle at 50% 50%, hsl(180 80% 55%) 1.5px, transparent 0)
              `,
              backgroundSize: '100px 100px, 150px 150px, 80px 80px'
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Process & Tips */}
          <div className="space-y-8 text-center lg:text-left">
            
            {/* Enhanced Branding */}
            <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Mail className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-600 animate-pulse opacity-20"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-500 bg-clip-text text-transparent">
                    Loconomy
                  </h1>
                  <Badge className="mt-2 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800">
                    <Mail className="w-3 h-3 mr-1" />
                    Email Verification
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  {getPersonalizedGreeting()}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  We've sent a verification email to your inbox. Simply click the link to activate 
                  your account and unlock all the amazing AI-powered features waiting for you!
                </p>
              </div>
            </div>

            {/* Verification Process Steps */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-cyan-600" />
                Verification Process
              </h3>
              
              <div className="space-y-4">
                {verificationSteps.map((step, index) => (
                  <Card key={index} className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/20 dark:border-gray-700/20 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300 group">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl transition-all duration-300 ${
                          step.status === 'completed' ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
                          step.status === 'active' ? 'bg-gradient-to-r from-cyan-600 to-blue-600' :
                          'bg-gray-200 dark:bg-gray-700'
                        }`}>
                          <step.icon className={`w-5 h-5 ${
                            step.status === 'pending' ? 'text-gray-500 dark:text-gray-400' : 'text-white'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {step.title}
                            </h4>
                            <Badge variant="secondary" className={`text-xs ${
                              step.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              step.status === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                              'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                              {step.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {step.description}
                          </p>
                        </div>
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          step.status === 'completed' ? 'border-green-500 bg-green-500' :
                          step.status === 'active' ? 'border-blue-500 bg-blue-500' :
                          'border-gray-300 dark:border-gray-600'
                        }`}>
                          {step.status === 'completed' && <CheckCircle className="w-4 h-4 text-white" />}
                          {step.status === 'active' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                          {step.status === 'pending' && <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Verification Features */}
            <div className="grid grid-cols-3 gap-4">
              {verificationFeatures.map((feature, index) => (
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
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="font-medium">2.4M+ verified accounts</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-1 font-medium">99.9% delivery rate</span>
              </div>
            </div>
          </div>

          {/* Right Column - Verification Actions */}
          <div className="w-full max-w-md mx-auto space-y-6">

            {/* Main Verification Card */}
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-6 relative">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                </div>
                
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <Mail className="w-10 h-10 text-white" />
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-300 animate-ping"></div>
                </div>
                
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Check Your Email
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  We've sent a verification link to your email address
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                
                {/* Email Verification Form */}
                <VerifyEmailForm />

                {/* AI Assistant Toggle */}
                <div className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAIAssistant(!showAIAssistant)}
                    className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    {showAIAssistant ? 'Hide' : 'Need'} Verification Help?
                  </Button>
                </div>

                {/* AI Assistant */}
                {showAIAssistant && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <AIAuthAssistant />
                  </div>
                )}

                {/* Troubleshooting Guide */}
                <div className="bg-cyan-50 dark:bg-cyan-950/50 p-4 rounded-xl border border-cyan-200 dark:border-cyan-800">
                  <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Email Not Received?
                  </h3>
                  <div className="space-y-2">
                    {troubleshootingTips.slice(0, 3).map((tip, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-cyan-700 dark:text-cyan-300">
                        <tip.icon className="w-4 h-4 flex-shrink-0" />
                        <span>{tip.description}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-cyan-200 dark:border-cyan-800">
                    <Link 
                      href="/customer-support" 
                      className="text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium text-sm inline-flex items-center gap-1 group"
                    >
                      Contact our support team
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already verified?{" "}
                    <Link
                      href="/auth/signin"
                      className="font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors inline-flex items-center group"
                    >
                      Sign in now
                      <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </p>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Wrong email?{" "}
                    <Link
                      href="/auth/signup"
                      className="font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
                    >
                      Try different email
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Support Card */}
            <Card className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">Download Our App</h3>
                    <p className="text-cyan-100 text-sm">Get instant notifications when verified</p>
                  </div>
                  <Button size="sm" className="bg-white text-cyan-600 hover:bg-gray-100">
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
