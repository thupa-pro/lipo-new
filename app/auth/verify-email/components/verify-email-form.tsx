"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Clock,
  Shield,
  Send,
  Loader2,
  Zap,
  UserCheck
} from "lucide-react";
import { authService } from "@/lib/auth/auth-utils";

export function VerifyEmailForm() {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);
  const [emailsSent, setEmailsSent] = useState(1); // Start with 1 since initial email was sent

  const { toast } = useToast();

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendMessage("");
    setResendError("");

    try {
      // Get current user
      const user = await authService.getCurrentUser();
      
      if (!user) {
        setResendError("No user session found. Please sign up again.");
        toast({
          title: "Session Error",
          description: "No user session found. Please sign up again.",
          variant: "destructive",
        });
        return;
      }

      if (user.email_confirmed_at) {
        setResendMessage("Your email is already verified! You can now sign in.");
        toast({
          title: "Already Verified! ✅",
          description: "Your email is already verified. You can sign in now.",
          variant: "default",
        });
        return;
      }

      // Resend verification email
      const { error } = await authService.resetPassword(user.email!);
      
      if (error) {
        setResendError(error.message);
        toast({
          title: "Resend Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setResendMessage("Verification email sent successfully! Please check your inbox.");
        setLastSentTime(new Date());
        setEmailsSent(prev => prev + 1);
        setCooldown(60); // 60 second cooldown
        toast({
          title: "Email Sent! 📧",
          description: "New verification email sent. Check your inbox!",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      setResendError("Failed to resend verification email. Please try again.");
      toast({
        title: "Resend Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const canResend = cooldown === 0 && !isResending;

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {resendError && (
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700 dark:text-red-300">{resendError}</AlertDescription>
        </Alert>
      )}

      {resendMessage && (
        <Alert className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700 dark:text-green-300">
            {resendMessage}
            {lastSentTime && (
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                Sent at {lastSentTime.toLocaleTimeString()}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Email Status Info */}
      <div className="bg-cyan-50 dark:bg-cyan-950/50 p-4 rounded-xl border border-cyan-200 dark:border-cyan-800">
        <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-3 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Verification Status
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-cyan-700 dark:text-cyan-300">Emails sent:</span>
            <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
              {emailsSent}
            </Badge>
          </div>
          {lastSentTime && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-cyan-700 dark:text-cyan-300">Last sent:</span>
              <span className="text-sm font-medium text-cyan-900 dark:text-cyan-100">
                {lastSentTime.toLocaleTimeString()}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-cyan-700 dark:text-cyan-300">Delivery time:</span>
            <span className="text-sm font-medium text-cyan-900 dark:text-cyan-100">
              Usually under 2 minutes
            </span>
          </div>
        </div>
      </div>

      {/* Resend Button */}
      <Button
        onClick={handleResendVerification}
        disabled={!canResend}
        className={`w-full h-12 text-sm font-medium rounded-xl transition-all duration-300 ${
          canResend 
            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg hover:shadow-xl hover:shadow-cyan-500/25' 
            : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
        }`}
      >
        {isResending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending Email...
          </div>
        ) : cooldown > 0 ? (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Resend in {cooldown}s
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Resend Verification Email
          </div>
        )}
      </Button>

      {/* Cooldown Notice */}
      {cooldown > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <Shield className="w-4 h-4" />
            <span>For security, please wait {cooldown} seconds before requesting another email.</span>
          </div>
        </div>
      )}

      {/* Instructions Card */}
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-blue-600" />
          What to Do Next
        </h4>
        <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">1</span>
            <span>Check your email inbox for a message from Loconomy</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">2</span>
            <span>If not found, check your spam or promotions folder</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">3</span>
            <span>Click the "Verify Email" button in the email</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">4</span>
            <span>You'll be automatically signed in to your account!</span>
          </li>
        </ol>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-700/20">
          <Shield className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Secure</div>
        </div>
        <div className="text-center p-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-700/20">
          <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Instant</div>
        </div>
        <div className="text-center p-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-700/20">
          <UserCheck className="w-6 h-6 text-purple-500 mx-auto mb-1" />
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Verified</div>
        </div>
      </div>

      {/* Email Statistics */}
      {lastSentTime && emailsSent > 1 && (
        <div className="text-center">
          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <Mail className="w-3 h-3 mr-1" />
            {emailsSent} emails sent • Latest: {lastSentTime.toLocaleTimeString()}
          </Badge>
        </div>
      )}
    </div>
  );
}
