import { Suspense } from "react";
import type { Metadata } from "next";
import { SignUpPageContent } from "./components/signup-page-content";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";

// Enhanced metadata for SEO and sharing
export const metadata: Metadata = {
  title: "Sign Up | Loconomy - Join the AI-Powered Local Services Revolution",
  description: "Create your free Loconomy account in seconds. Join millions of users discovering trusted local service professionals through intelligent AI matching and premium features.",
  keywords: [
    "Loconomy sign up", "create account", "join platform", "local services",
    "AI matching", "service providers", "free registration", "smart recommendations"
  ],
  openGraph: {
    title: "Join Loconomy - AI-Powered Local Services",
    description: "Create your free account and unlock the future of service discovery",
    images: ["/og-signup.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Loconomy - AI-Powered Local Services",
    description: "Create your free account and unlock the future of service discovery",
  },
  robots: {
    index: false, // Don't index auth pages
    follow: false,
  },
};

// Loading skeleton for the signup page
function SignUpPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left column skeleton */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-4">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto lg:mx-0 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
          </div>
        </div>

        {/* Right column skeleton */}
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 space-y-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpPageSkeleton />}>
      <SignUpPageContent />
    </Suspense>
  );
}
