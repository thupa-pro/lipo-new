import { Suspense } from "react";
import type { Metadata } from "next";
import { SignInPageContent } from "./components/signin-page-content";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";

// Enhanced metadata for SEO and sharing
export const metadata: Metadata = {
  title: "Sign In | Loconomy - AI-Powered Local Services Platform",
  description: "Access your Loconomy account with our secure, AI-enhanced authentication. Join millions of users connecting with trusted local service professionals through intelligent matching.",
  keywords: [
    "Loconomy sign in", "login", "authentication", "local services", 
    "AI platform", "secure access", "user account", "service providers"
  ],
  openGraph: {
    title: "Sign In to Loconomy",
    description: "Access your AI-powered local services platform",
    images: ["/og-signin.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In to Loconomy",
    description: "Access your AI-powered local services platform",
  },
  robots: {
    index: false, // Don't index auth pages
    follow: false,
  },
};

// Loading skeleton for the signin page
function SignInPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header skeleton */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl mx-auto animate-pulse"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto animate-pulse"></div>
        </div>
        
        {/* Card skeleton */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 space-y-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInPageSkeleton />}>
      <SignInPageContent />
    </Suspense>
  );
}
