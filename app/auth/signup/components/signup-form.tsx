"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Shield, Zap, Users, CheckCircle, AlertCircle, Brain, Fingerprint } from "lucide-react";
import Link from "next/link";
import { authService } from "@/lib/auth/auth-utils";

interface SignUpFormProps {
  redirectTo?: string;
}

export function SignUpForm({ redirectTo }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "customer" as "customer" | "provider",
    agreeToTerms: false,
    agreeToMarketing: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  
  const router = useRouter();
  const { toast } = useToast();

  // Real-time email validation
  useEffect(() => {
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(formData.email);
      setEmailValid(isValid);
    } else {
      setEmailValid(null);
    }
  }, [formData.email]);

  // Real-time password strength analysis
  useEffect(() => {
    const password = formData.password;
    
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    setPasswordCriteria(criteria);
    
    const strength = Object.values(criteria).filter(Boolean).length;
    setPasswordStrength((strength / 5) * 100);
  }, [formData.password]);

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return "No password";
    if (passwordStrength <= 20) return "Very weak";
    if (passwordStrength <= 40) return "Weak";
    if (passwordStrength <= 60) return "Fair";
    if (passwordStrength <= 80) return "Good";
    return "Excellent";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 20) return "bg-red-500";
    if (passwordStrength <= 40) return "bg-orange-500";
    if (passwordStrength <= 60) return "bg-yellow-500";
    if (passwordStrength <= 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    if (passwordStrength < 60) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password for better security.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authService.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            user_type: formData.userType,
            agree_to_terms: formData.agreeToTerms,
            agree_to_marketing: formData.agreeToMarketing,
          }
        }
      });

      if (error) {
        let errorMessage = "An unexpected error occurred. Please try again.";
        
        if (error.message.includes("already registered")) {
          errorMessage = "An account with this email already exists.";
        } else if (error.message.includes("password")) {
          errorMessage = "Password must be at least 6 characters long.";
        } else {
          errorMessage = error.message;
        }

        toast({
          title: "Sign Up Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome to Loconomy! 🎉",
          description: "Please check your email to verify your account.",
        });
        router.push("/auth/verify-email");
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      toast({
        title: "Sign Up Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = 
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    emailValid &&
    formData.password.trim() &&
    formData.confirmPassword.trim() &&
    formData.password === formData.confirmPassword &&
    formData.agreeToTerms &&
    passwordStrength >= 60;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-green-600" />
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-white/30 focus:border-green-500 transition-all duration-300 rounded-xl"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-green-600" />
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-white/30 focus:border-green-500 transition-all duration-300 rounded-xl"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Email with Real-time Validation */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
          <Mail className="w-4 h-4 text-green-600" />
          Email Address
          {emailValid === true && <CheckCircle className="w-4 h-4 text-green-500" />}
          {emailValid === false && <AlertCircle className="w-4 h-4 text-red-500" />}
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-white/30 transition-all duration-300 rounded-xl pl-4 pr-12 ${
              emailValid === true ? 'focus:border-green-500 border-green-200' : 
              emailValid === false ? 'focus:border-red-500 border-red-200' : 
              'focus:border-green-500'
            }`}
            required
            disabled={isLoading}
          />
          {emailValid !== null && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {emailValid ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Type Selection */}
      <div className="space-y-2">
        <Label htmlFor="userType" className="text-sm font-medium flex items-center gap-2">
          <Brain className="w-4 h-4 text-green-600" />
          I want to
        </Label>
        <Select 
          value={formData.userType} 
          onValueChange={(value: "customer" | "provider") => 
            setFormData({ ...formData, userType: value })
          }
          disabled={isLoading}
        >
          <SelectTrigger className="h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-white/30 focus:border-green-500 rounded-xl">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent className="backdrop-blur-md bg-white/95 dark:bg-gray-900/95">
            <SelectItem value="customer" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Find services (Customer)
              </div>
            </SelectItem>
            <SelectItem value="provider" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Offer services (Provider)
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Password with Strength Indicator */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
          <Lock className="w-4 h-4 text-green-600" />
          Password
          <Badge variant="secondary" className="text-xs">
            {getPasswordStrengthLabel()}
          </Badge>
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-white/30 focus:border-green-500 transition-all duration-300 rounded-xl pl-4 pr-12"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        
        {formData.password && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Progress 
                value={passwordStrength} 
                className="flex-1 h-2" 
                // @ts-ignore
                indicatorClassName={getPasswordStrengthColor()}
              />
              <span className="text-xs text-gray-500">{Math.round(passwordStrength)}%</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`flex items-center gap-1 ${passwordCriteria.length ? 'text-green-600' : 'text-gray-400'}`}>
                <CheckCircle className="w-3 h-3" />
                8+ characters
              </div>
              <div className={`flex items-center gap-1 ${passwordCriteria.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                <CheckCircle className="w-3 h-3" />
                Uppercase letter
              </div>
              <div className={`flex items-center gap-1 ${passwordCriteria.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                <CheckCircle className="w-3 h-3" />
                Lowercase letter
              </div>
              <div className={`flex items-center gap-1 ${passwordCriteria.number ? 'text-green-600' : 'text-gray-400'}`}>
                <CheckCircle className="w-3 h-3" />
                Number
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
          <Lock className="w-4 h-4 text-green-600" />
          Confirm Password
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className={`h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-white/30 transition-all duration-300 rounded-xl pl-4 pr-12 ${
              formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-200 focus:border-green-500' :
              formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-200 focus:border-red-500' :
              'focus:border-green-500'
            }`}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Enhanced Agreements */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, agreeToTerms: checked as boolean })
            }
            disabled={isLoading}
            className="mt-1 border-green-300 data-[state=checked]:bg-green-600"
          />
          <div className="flex-1">
            <Label htmlFor="agreeToTerms" className="text-sm font-medium text-gray-900 dark:text-white">
              I agree to the Terms of Service and Privacy Policy
            </Label>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-green-600 hover:text-green-500 underline">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-green-600 hover:text-green-500 underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="agreeToMarketing"
            checked={formData.agreeToMarketing}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, agreeToMarketing: checked as boolean })
            }
            disabled={isLoading}
            className="mt-1 border-green-300 data-[state=checked]:bg-green-600"
          />
          <Label htmlFor="agreeToMarketing" className="text-sm text-gray-600 dark:text-gray-400">
            I'd like to receive updates about new features and special offers
            <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
          </Label>
        </div>
      </div>

      {/* Enhanced Submit Button */}
      <Button
        type="submit"
        className={`w-full h-12 text-sm font-medium rounded-xl transition-all duration-300 ${
          isFormValid 
            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:shadow-green-500/25' 
            : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
        }`}
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating Account...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Create My Account
          </div>
        )}
      </Button>
    </form>
  );
}
