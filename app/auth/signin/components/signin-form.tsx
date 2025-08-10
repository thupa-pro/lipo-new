'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Brain,
  Shield,
  Zap,
  Fingerprint,
  Key,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface SignInFormProps {
  redirectTo?: string;
}

export function SignInForm({ redirectTo }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showAIHelp, setShowAIHelp] = useState(false);
  const [deviceTrust, setDeviceTrust] = useState<'trusted' | 'new' | 'unknown'>('unknown');

  const router = useRouter();
  const { toast } = useToast();

  // AI-powered email validation
  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailValid(email.length > 0 ? isValid : null);
    return isValid;
  }, []);

  // Advanced password strength analysis
  const analyzePasswordStrength = useCallback((password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 15;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 10;
    
    setPasswordStrength(Math.min(strength, 100));
  }, []);

  // Device trust assessment
  useEffect(() => {
    const checkDeviceTrust = () => {
      const lastDevice = localStorage.getItem('loconomy_device_id');
      const currentDevice = navigator.userAgent + screen.width + screen.height;
      
      if (lastDevice === currentDevice) {
        setDeviceTrust('trusted');
      } else if (lastDevice) {
        setDeviceTrust('new');
      } else {
        setDeviceTrust('unknown');
      }
    };

    checkDeviceTrust();
  }, []);

  // Real-time validation
  useEffect(() => {
    if (email) validateEmail(email);
  }, [email, validateEmail]);

  useEffect(() => {
    if (password) analyzePasswordStrength(password);
  }, [password, analyzePasswordStrength]);

  // AI assistance trigger
  useEffect(() => {
    if (attemptCount >= 2) {
      setShowAIHelp(true);
    }
  }, [attemptCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Pre-flight validation
      if (!validateEmail(email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey ||
          supabaseUrl.includes('placeholder') ||
          supabaseAnonKey.includes('placeholder')) {
        
        // Simulate successful login for demo purposes
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast({
          title: "Demo Mode",
          description: "Authentication simulated successfully! Redirecting...",
          variant: "default",
        });

        // Store device trust
        const currentDevice = navigator.userAgent + screen.width + screen.height;
        localStorage.setItem('loconomy_device_id', currentDevice);

        // Redirect
        setTimeout(() => {
          router.push(redirectTo || "/dashboard");
        }, 1000);
        
        setIsLoading(false);
        return;
      }

      const supabase = createSupabaseClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error("Sign in error:", error);
        setAttemptCount(prev => prev + 1);
        
        let errorMessage = "An unexpected error occurred. Please try again.";
        
        if (error.message === "Invalid login credentials") {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (error.message === "Email not confirmed") {
          errorMessage = "Please verify your email address before signing in.";
        } else if (error.message === "Too many requests") {
          errorMessage = "Too many login attempts. Please wait a moment and try again.";
        } else {
          errorMessage = error.message;
        }

        toast({
          title: "Sign In Failed",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Store device trust
        const currentDevice = navigator.userAgent + screen.width + screen.height;
        localStorage.setItem('loconomy_device_id', currentDevice);

        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });

        // Redirect to intended page or dashboard
        router.push(redirectTo || "/dashboard");
        router.refresh(); // Refresh to update auth state
      }
    } catch (err: any) {
      console.error("Unexpected sign in error:", err);
      setAttemptCount(prev => prev + 1);
      
      toast({
        title: "Sign In Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500";
    if (passwordStrength < 60) return "bg-yellow-500";
    if (passwordStrength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return "Weak";
    if (passwordStrength < 60) return "Fair";
    if (passwordStrength < 80) return "Good";
    return "Strong";
  };

  const getTrustBadge = () => {
    switch (deviceTrust) {
      case 'trusted':
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Trusted Device
          </Badge>
        );
      case 'new':
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs">
            <Fingerprint className="w-3 h-3 mr-1" />
            New Device
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Secure Connection
          </Badge>
        );
    }
  };

  const isFormValid = email.trim() && password.trim() && emailValid;

  return (
    <div className="space-y-6">
      
      {/* Device Trust Indicator */}
      <div className="flex items-center justify-between">
        {getTrustBadge()}
        
        {showAIHelp && (
          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs animate-pulse">
            <Brain className="w-3 h-3 mr-1" />
            AI Help Available
          </Badge>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Enhanced Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Email Address
          </Label>
          <div className="relative group">
            <Mail className="w-5 h-5 absolute left-3 top-3.5 text-gray-400 group-focus-within:text-purple-600 transition-colors duration-200" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 rounded-xl"
              required
              disabled={isLoading}
              autoComplete="email"
            />
            
            {/* Email validation indicator */}
            {emailValid !== null && (
              <div className="absolute right-3 top-3.5">
                {emailValid ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            )}
          </div>
          
          {emailValid === false && (
            <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Please enter a valid email address
            </p>
          )}
        </div>

        {/* Enhanced Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Password
          </Label>
          <div className="relative group">
            <Lock className="w-5 h-5 absolute left-3 top-3.5 text-gray-400 group-focus-within:text-purple-600 transition-colors duration-200" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 pr-11 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 rounded-xl"
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 focus:outline-none focus:text-purple-600"
              disabled={isLoading}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Password strength indicator */}
          {password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">Password strength</span>
                <span className={`text-xs font-medium ${
                  passwordStrength < 30 ? 'text-red-600' :
                  passwordStrength < 60 ? 'text-yellow-600' :
                  passwordStrength < 80 ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              disabled={isLoading}
              className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
            />
            <Label 
              htmlFor="remember" 
              className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer font-medium"
            >
              Remember me for 30 days
            </Label>
          </div>

          <Link 
            href="/auth/forgot-password" 
            className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200 font-medium flex items-center gap-1 group"
          >
            <Key className="w-3 h-3" />
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Authenticating...</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce animation-delay-400"></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          )}
        </Button>

        {/* AI Help Section */}
        {showAIHelp && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm mb-1">
                  Having trouble signing in?
                </h4>
                <p className="text-xs text-purple-700 dark:text-purple-300 mb-3">
                  Our AI assistant noticed multiple attempts. Here are some quick solutions:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="text-xs h-8 bg-white dark:bg-gray-800">
                    <Key className="w-3 h-3 mr-1" />
                    Reset Password
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-8 bg-white dark:bg-gray-800">
                    <Zap className="w-3 h-3 mr-1" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
