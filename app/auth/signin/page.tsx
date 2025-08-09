import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Shield, 
  Zap, 
  Users, 
  Eye, 
  EyeOff,
  Mail,
  Lock,
  Chrome,
  Github
} from "lucide-react";

// Client component for interactive form
import { SignInForm } from "./components/signin-form";

// Enhanced metadata for SEO
export const metadata = {
  title: "Sign In | Loconomy - Access Your Account",
  description: "Sign in to your Loconomy account to access local service providers, manage bookings, and more. Secure authentication with multiple options.",
  keywords: ["sign in", "login", "account access", "authentication", "local services"],
  robots: {
    index: false, // Don't index auth pages
    follow: false,
  },
};

interface SignInPageProps {
  searchParams: {
    redirectTo?: string;
    error?: string;
    message?: string;
  };
}

export default function SignInPage({ searchParams }: SignInPageProps) {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-purple-950/20 dark:via-background dark:to-cyan-950/20">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
      
      {/* Animated Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-[200px] animate-pulse"></div>
      <div className="absolute bottom-[-30%] right-[-20%] w-[900px] h-[900px] bg-cyan-700/30 rounded-full blur-[200px] animate-pulse animation-delay-4000"></div>
      <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-fuchsia-700/20 rounded-full blur-[150px] animate-pulse animation-delay-2000"></div>

      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        {/* Back to Home */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Main Card with Glassmorphism */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-base mt-2">
                Sign in to your Loconomy account to continue
              </CardDescription>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center gap-2">
              <Badge variant="outline" className="text-xs bg-white/60 dark:bg-gray-800/60">
                <Shield className="w-3 h-3 mr-1" />
                Secure
              </Badge>
              <Badge variant="outline" className="text-xs bg-white/60 dark:bg-gray-800/60">
                <Zap className="w-3 h-3 mr-1" />
                Fast
              </Badge>
              <Badge variant="outline" className="text-xs bg-white/60 dark:bg-gray-800/60">
                <Users className="w-3 h-3 mr-1" />
                2.4M+ Users
              </Badge>
            </div>

            {/* Server-side error/message display */}
            {searchParams.error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {searchParams.error === 'CredentialsSignin' 
                    ? 'Invalid email or password. Please try again.'
                    : 'An error occurred during sign in. Please try again.'
                  }
                </p>
              </div>
            )}

            {searchParams.message && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {searchParams.message}
                </p>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Sign In Options */}
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full h-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
              >
                <Chrome className="w-5 h-5 mr-3" />
                Continue with Google
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full h-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
              >
                <Github className="w-5 h-5 mr-3" />
                Continue with GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form - Client Component */}
            <SignInForm redirectTo={searchParams.redirectTo} />
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link 
              href="/auth/signup" 
              className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Additional Links */}
        <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/help" className="hover:text-foreground transition-colors">
            Get Help
          </Link>
        </div>
      </div>
    </div>
  );
}
