'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
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

  const router = useRouter();
  const { toast } = useToast();
  const { isLoaded, signIn, setActive } = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        // Sync user data to Supabase
        await fetch('/api/users/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            firstName: result.createdUserId, // Will be updated with real data
            lastName: '',
            imageUrl: '',
          }),
        });

        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });

        // Redirect to intended page or dashboard
        router.push(redirectTo || "/dashboard");
      } else {
        console.error("Sign in incomplete", result);
        toast({
          title: "Sign In Failed",
          description: "Unable to complete sign in. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Sign in error:", err);

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (err.errors) {
        const clerkError = err.errors[0];
        if (clerkError.code === "form_identifier_not_found") {
          errorMessage = "No account found with this email address.";
        } else if (clerkError.code === "form_password_incorrect") {
          errorMessage = "Incorrect password. Please try again.";
        } else if (clerkError.code === "form_identifier_exists") {
          errorMessage = "Please verify your email address before signing in.";
        } else {
          errorMessage = clerkError.longMessage || clerkError.message || errorMessage;
        }
      }

      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email.trim() && password.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-white/20 focus:border-purple-500 transition-all duration-300"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 h-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-white/20 focus:border-purple-500 transition-all duration-300"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            disabled={isLoading}
          />
          <Label 
            htmlFor="remember" 
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Remember me
          </Label>
        </div>

        <Link 
          href="/auth/forgot-password" 
          className="text-sm text-purple-600 hover:text-purple-500 transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full h-12 btn-elite text-lg font-medium"
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
