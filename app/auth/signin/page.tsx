"use client";

import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card";
import { EnhancedButton, IconButton } from "@/components/ui/enhanced-button";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { Badge } from "@/components/ui/badge";
import { SignInForm } from "./components/signin-form";
import { Sparkles, Shield, Zap, Users, Github, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInPageContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>

      {/* Modern floating shapes */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-300/20 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 animate-ping opacity-20"></div>
            </div>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
            Welcome Back
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300">
            Sign in to your Loconomy account
          </p>

          {/* Trust badge */}
          <div className="mt-4">
            <Badge variant="secondary" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200 dark:border-purple-800">
              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
              Trusted by 2.4M+ users
            </Badge>
          </div>
        </div>

        {/* Enhanced Sign In Card */}
        <div>
          <EnhancedCard
            variant="glass"
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-white/20 dark:border-gray-700/20 shadow-2xl"
          >
            <EnhancedCardHeader className="text-center pb-6">
              <EnhancedCardTitle className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Sign In
              </EnhancedCardTitle>
              <EnhancedCardDescription className="text-base">
                Enter your credentials to access your account
              </EnhancedCardDescription>
            </EnhancedCardHeader>

            <EnhancedCardContent className="space-y-6">
              <Suspense fallback={<SkeletonLoader variant="card" />}>
                <SignInForm redirectTo={redirectTo || undefined} />
              </Suspense>

              {/* Enhanced Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Enhanced Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <EnhancedButton
                  variant="glass"
                  className="h-12"
                  leftIcon={
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  }
                  onClick={() => console.log("Google signin")}
                >
                  Google
                </EnhancedButton>

                <IconButton
                  variant="glass"
                  className="h-12"
                  icon={<Github className="w-5 h-5" />}
                  onClick={() => console.log("GitHub signin")}
                >
                  GitHub
                </IconButton>
              </div>

              {/* Enhanced Sign Up Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="font-semibold text-purple-600 hover:text-purple-500 transition-colors inline-flex items-center group"
                  >
                    Sign up for free
                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </p>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </div>

        {/* Enhanced Trust Indicators */}
        <div className="mt-8 grid grid-cols-3 gap-6">
          {[
            { icon: Shield, label: "Bank-Level Security", color: "text-green-500" },
            { icon: Zap, label: "Lightning Fast", color: "text-yellow-500" },
            { icon: Users, label: "2.4M+ Users", color: "text-purple-500" }
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center group cursor-pointer hover:scale-105 hover:-translate-y-0.5 transition-transform duration-200"
            >
              <div className="p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 mb-2 group-hover:shadow-lg transition-shadow">
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <SkeletonLoader variant="card" />
      </div>
    }>
      <SignInPageContent />
    </Suspense>
  );
}
