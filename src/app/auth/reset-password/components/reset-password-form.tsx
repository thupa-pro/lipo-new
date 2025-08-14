"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  KeyRound,
  Shield,
  Sparkles,
  UserCheck,
  ArrowRight
} from "lucide-react";
import { authService } from "@/lib/auth/auth-utils";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
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

  // Real-time password strength analysis
  useEffect(() => {
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
  }, [password]);

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
    setIsLoading(true);
    setError("");

    // Validate passwords
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 60) {
      setError("Please choose a stronger password for better security");
      setIsLoading(false);
      return;
    }

    try {
      const { error: updateError } = await authService.updatePassword(password);

      if (updateError) {
        setError(updateError.message);
        toast({
          title: "Password Update Failed",
          description: updateError.message,
          variant: "destructive",
        });
      } else {
        setSuccess(true);
        toast({
          title: "Password Updated Successfully! 🎉",
          description: "Your password has been changed. Redirecting to dashboard...",
          variant: "default",
        });
        
        // Redirect to dashboard after success
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      }
    } catch (error) {
      console.error("Password update error:", error);
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Password Update Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = 
    password.trim() && 
    confirmPassword.trim() && 
    password === confirmPassword && 
    passwordStrength >= 60;

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <UserCheck className="w-10 h-10 text-white" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Password Updated Successfully!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your account is now secure with your new password. You'll be redirected to your dashboard shortly.
          </p>
        </div>

        <Alert className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700 dark:text-green-300">
            Redirecting to dashboard in 3 seconds...
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>Password encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-blue-500" />
            <span>Account secured</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-500" />
            <span>Ready to use</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password with Strength Indicator */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-600" />
            New Password
            <Badge variant="secondary" className="text-xs">
              {getPasswordStrengthLabel()}
            </Badge>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-white/30 focus:border-purple-500 transition-all duration-300 rounded-xl pl-4 pr-12"
              disabled={isLoading}
              required
              minLength={8}
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
          
          {password && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Progress 
                  value={passwordStrength} 
                  className="flex-1 h-2" 
                  // @ts-ignore
                  indicatorClassName={getPasswordStrengthColor()}
                />
                <span className="text-xs text-gray-500 font-medium">{Math.round(passwordStrength)}%</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center gap-1 transition-colors ${passwordCriteria.length ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className="w-3 h-3" />
                  8+ characters
                </div>
                <div className={`flex items-center gap-1 transition-colors ${passwordCriteria.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className="w-3 h-3" />
                  Uppercase letter
                </div>
                <div className={`flex items-center gap-1 transition-colors ${passwordCriteria.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className="w-3 h-3" />
                  Lowercase letter
                </div>
                <div className={`flex items-center gap-1 transition-colors ${passwordCriteria.number ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className="w-3 h-3" />
                  Number
                </div>
                <div className={`flex items-center gap-1 transition-colors ${passwordCriteria.special ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className="w-3 h-3" />
                  Special character
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-600" />
            Confirm New Password
            {confirmPassword && password === confirmPassword && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            {confirmPassword && password !== confirmPassword && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-white/30 transition-all duration-300 rounded-xl pl-4 pr-12 ${
                confirmPassword && password === confirmPassword ? 'border-green-200 focus:border-green-500' :
                confirmPassword && password !== confirmPassword ? 'border-red-200 focus:border-red-500' :
                'focus:border-purple-500'
              }`}
              disabled={isLoading}
              required
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
          
          {confirmPassword && (
            <div className="text-xs mt-1">
              {password === confirmPassword ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  Passwords match
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  Passwords don't match
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Submit Button */}
        <Button
          type="submit"
          className={`w-full h-12 text-sm font-medium rounded-xl transition-all duration-300 ${
            isFormValid 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl hover:shadow-purple-500/25' 
              : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
          }`}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Updating Password...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              Update Password
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </form>

      {/* Password Strength Requirements */}
      <div className="bg-purple-50 dark:bg-purple-950/50 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Password Requirements
        </h4>
        <div className="grid grid-cols-1 gap-2 text-sm text-purple-700 dark:text-purple-300">
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${passwordStrength >= 60 ? 'text-green-500' : 'text-gray-400'}`} />
            <span>Password strength: Good or Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${password === confirmPassword && confirmPassword ? 'text-green-500' : 'text-gray-400'}`} />
            <span>Both passwords match exactly</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${passwordCriteria.length ? 'text-green-500' : 'text-gray-400'}`} />
            <span>Minimum 8 characters length</span>
          </div>
        </div>
      </div>
    </div>
  );
}
