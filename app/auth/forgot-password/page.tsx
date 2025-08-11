import { Suspense } from "react";
import type { Metadata } from "next";
import { ForgotPasswordPageContent } from "./components/forgot-password-page-content";

// Enhanced metadata for SEO and sharing
export const metadata: Metadata = {
  title: "Forgot Password | Loconomy - Secure Account Recovery",
  description: "Reset your Loconomy password securely with our AI-powered recovery system. Quick, safe, and reliable account access restoration in minutes.",
  keywords: [
    "Loconomy forgot password", "password reset", "account recovery", "secure reset",
    "AI recovery", "password help", "account access", "email verification"
  ],
  openGraph: {
    title: "Reset Your Loconomy Password",
    description: "Secure password recovery for your AI-powered local services account",
    images: ["/og-forgot-password.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reset Your Loconomy Password",
    description: "Secure password recovery for your AI-powered local services account",
  },
  robots: {
    index: false, // Don't index auth pages
    follow: false,
  },
};

// Loading skeleton for the forgot password page
function ForgotPasswordPageSkeleton() {
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
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordPageSkeleton />}>
      <ForgotPasswordPageContent />
    </Suspense>
  );
}
