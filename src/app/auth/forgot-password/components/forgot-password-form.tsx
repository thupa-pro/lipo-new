"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Send,
  RefreshCw,
  Clock,
  Shield
} from "lucide-react";
import { authService } from "@/lib/auth/auth-utils";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);

  const { toast } = useToast();

  // Real-time email validation
  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);
      setEmailValid(isValid);
    } else {
      setEmailValid(null);
    }
  }, [email]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    // Validate email
    if (!email.trim() || !emailValid) {
      setError("Please enter a valid email address.");
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error: authError } = await authService.resetPassword(email);

      if (authError) {
        setError(authError.message);
        toast({
          title: "Reset Failed",
          description: authError.message,
          variant: "destructive",
        });
      } else {
        // For security, we give a generic message regardless of whether email exists
        setMessage("If an account with that email exists, a password reset link has been sent.");
        setLastSentTime(new Date());
        setCooldown(60); // 60 second cooldown
        toast({
          title: "Password Reset Email Sent! 📧",
          description: "Please check your inbox for instructions.",
          variant: "default",
        });
        setEmail(""); // Clear email field
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Reset Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canResend = cooldown === 0 && !isLoading;

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {error && (
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
        </Alert>
      )}
      
      {message && (
        <Alert className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700 dark:text-green-300">
            {message}
            {lastSentTime && (
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                Sent at {lastSentTime.toLocaleTimeString()}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input with Enhanced Validation */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" />
            Email Address
            {emailValid === true && <CheckCircle className="w-4 h-4 text-green-500" />}
            {emailValid === false && <AlertCircle className="w-4 h-4 text-red-500" />}
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-white/30 transition-all duration-300 rounded-xl pl-4 pr-12 ${
                emailValid === true ? 'focus:border-green-500 border-green-200' : 
                emailValid === false ? 'focus:border-red-500 border-red-200' : 
                'focus:border-blue-500'
              }`}
              disabled={isLoading}
              required
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
          
          {email && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {emailValid ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  Valid email format
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  Please enter a valid email address
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Submit Button */}
        <Button
          type="submit"
          className={`w-full h-12 text-sm font-medium rounded-xl transition-all duration-300 ${
            canResend && emailValid
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:shadow-blue-500/25' 
              : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
          }`}
          disabled={!canResend || !emailValid}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending Reset Link...
            </div>
          ) : cooldown > 0 ? (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Resend in {cooldown}s
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send Reset Link
            </div>
          )}
        </Button>

        {/* Cooldown Info */}
        {cooldown > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <Shield className="w-4 h-4" />
              <span>For security, please wait {cooldown} seconds before requesting another reset.</span>
            </div>
          </div>
        )}
      </form>

      {/* Security Notice */}
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          Security Notice
        </h4>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Reset links expire after 1 hour for security</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>We'll never ask for your password via email</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Links can only be used once for security</span>
          </div>
        </div>
      </div>

      {/* Last Sent Info */}
      {lastSentTime && (
        <div className="text-center">
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            <Clock className="w-3 h-3 mr-1" />
            Last sent: {lastSentTime.toLocaleTimeString()}
          </Badge>
        </div>
      )}
    </div>
  );
}
