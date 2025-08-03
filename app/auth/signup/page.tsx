"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth/auth-utils";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Sparkles, Eye, EyeOff, User, Mail, Lock, ArrowRight, 
  Shield, Star, Users, Zap, CheckCircle 
} from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "customer" as "customer" | "provider",
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate form
    if (!formData.firstName.trim()) {
      setError("First name is required");
      setIsLoading(false);
      return;
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required");
      setIsLoading(false);
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      setIsLoading(false);
      return;
    }

    try {
      const { error: authError, needsVerification } = await authService.signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        userType: formData.userType,
        agreeToTerms: formData.agreeToTerms,
        agreeToMarketing: formData.agreeToMarketing,
      });

      if (authError) {
        setError(authError.message);
        toast({
          title: "Sign Up Failed",
          description: authError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Created Successfully!",
          description: needsVerification
            ? "Please check your email to verify your account before signing in."
            : "Welcome to Loconomy! You are now signed in.",
          variant: "default",
        });

        if (needsVerification) {
          router.push("/auth/verify-email");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Sign Up Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "All service providers are background-checked and verified"
    },
    {
      icon: Zap,
      title: "Instant Matching",
      description: "AI-powered matching finds perfect providers in seconds"
    },
    {
      icon: Star,
      title: "Quality Guarantee",
      description: "5-star average rating with satisfaction guarantee"
    },
    {
      icon: Users,
      title: "Trusted Community",
      description: "Join 2.4M+ satisfied customers and providers"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stratosphere via-cirrus to-white dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300">
      {/* Neural Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, hsl(var(--neural-500)) 2px, transparent 0),
                           radial-gradient(circle at 75px 75px, hsl(var(--quantum-500)) 1px, transparent 0)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-neural rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient-neural">Loconomy</span>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-neural-600 transition-colors">
              Already have an account?
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Features */}
            <div className="order-2 lg:order-1">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gradient-neural mb-4">
                  Join the Future of
                  <br />
                  <span className="text-gradient-quantum">Local Services</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Connect with trusted professionals or start earning as a verified service provider.
                  Join thousands who trust Loconomy for their service needs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="glass rounded-2xl p-6 hover:shadow-glass-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-neural rounded-2xl flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gradient-neural mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 glass rounded-2xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 bg-gradient-quantum rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{String.fromCharCode(65 + i - 1)}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-bold text-gradient-neural">2.4M+ Happy Users</p>
                    <p className="text-sm text-muted-foreground">Join our growing community</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="order-1 lg:order-2">
              <Card variant="glass-strong" className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                  <CardTitle variant="gradient-neural" className="text-2xl">Create Your Account</CardTitle>
                  <CardDescription className="text-base">
                    Get started with your free Loconomy account
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User Type Selection */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, userType: "customer"})}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                        formData.userType === "customer" 
                          ? "border-neural-500 bg-neural-50 dark:bg-neural-900/20" 
                          : "border-border hover:border-neural-300"
                      }`}
                    >
                      <User className="w-6 h-6 mx-auto mb-2 text-neural-600" />
                      <div className="text-sm font-medium">Customer</div>
                      <div className="text-xs text-muted-foreground">Find services</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, userType: "provider"})}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                        formData.userType === "provider" 
                          ? "border-quantum-500 bg-quantum-50 dark:bg-quantum-900/20" 
                          : "border-border hover:border-quantum-300"
                      }`}
                    >
                      <Shield className="w-6 h-6 mx-auto mb-2 text-quantum-600" />
                      <div className="text-sm font-medium">Provider</div>
                      <div className="text-xs text-muted-foreground">Offer services</div>
                    </button>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        variant="glass"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        variant="glass"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neural-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        variant="glass"
                        placeholder="john@example.com"
                        className="pl-12"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neural-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        variant="glass"
                        placeholder="••••••••"
                        className="pl-12 pr-12"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neural-400 hover:text-neural-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neural-400 w-5 h-5" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        variant="glass"
                        placeholder="••••••••"
                        className="pl-12 pr-12"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neural-400 hover:text-neural-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: checked as boolean})}
                        disabled={isLoading}
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        I agree to the{" "}
                        <Link href="/terms" className="text-neural-600 hover:text-neural-700 underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-neural-600 hover:text-neural-700 underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="marketing"
                        checked={formData.agreeToMarketing}
                        onCheckedChange={(checked) => setFormData({...formData, agreeToMarketing: checked as boolean})}
                        disabled={isLoading}
                      />
                      <Label htmlFor="marketing" className="text-sm">
                        I want to receive updates about new features and special offers
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-neural text-white hover:shadow-glow-neural transition-all duration-300 text-lg py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  </form>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link href="/auth/login" className="text-neural-600 hover:text-neural-700 font-medium">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
