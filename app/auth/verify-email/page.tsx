import { Suspense } from "react";
import type { Metadata } from "next";
import { VerifyEmailPageContent } from "./components/verify-email-page-content";

// Enhanced metadata for SEO and sharing
export const metadata: Metadata = {
  title: "Verify Email | Loconomy - Account Activation",
  description: "Verify your email address to activate your Loconomy account. Quick one-click verification process with instant access to AI-powered local services.",
  keywords: [
    "Loconomy verify email", "email verification", "account activation", "confirm email",
    "email confirmation", "activate account", "verify identity", "email security"
  ],
  openGraph: {
    title: "Verify Your Email - Loconomy",
    description: "One click away from accessing your AI-powered local services platform",
    images: ["/og-verify-email.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verify Your Email - Loconomy",
    description: "One click away from accessing your AI-powered local services platform",
  },
  robots: {
    index: false, // Don't index auth pages
    follow: false,
  },
};

// Loading skeleton for the verify email page
function VerifyEmailPageSkeleton() {
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
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailPageSkeleton />}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
