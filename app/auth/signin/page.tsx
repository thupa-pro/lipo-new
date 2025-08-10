"use client";

import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card";
import { EnhancedButton, IconButton } from "@/components/ui/enhanced-button";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { Badge } from "@/components/ui/badge";
import { SignInForm } from "./components/signin-form";
import { Sparkles, Shield, Zap, Users, Github, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-purple-600 animate-pulse" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="w-12 h-12 text-purple-600 opacity-20" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to your Loconomy account
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <SignInForm redirectTo={redirectTo || undefined} />
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/60 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="bg-white/40 dark:bg-gray-700/40 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-colors"
                onClick={() => {
                  // Handle Google signin
                  console.log("Google signin");
                }}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              
              <Button
                variant="outline"
                className="bg-white/40 dark:bg-gray-700/40 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-colors"
                onClick={() => {
                  // Handle GitHub signin
                  console.log("GitHub signin");
                }}
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link 
                  href="/auth/signup" 
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <Shield className="w-6 h-6 text-green-500 mb-2" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Secure</span>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="w-6 h-6 text-yellow-500 mb-2" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Fast</span>
          </div>
          <div className="flex flex-col items-center">
            <Users className="w-6 h-6 text-purple-500 mb-2" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Trusted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
