"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [userType, setUserType] = useState("customer");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    if (!acceptTerms) {
      setError("Please accept the terms and conditions");
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle sign up logic here
    }, 1000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center py-12">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
      
      {/* Animated Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-[200px] animate-pulse"></div>
      <div className="absolute bottom-[-30%] right-[-20%] w-[900px] h-[900px] bg-cyan-700/30 rounded-full blur-[200px] animate-pulse animation-delay-4000"></div>
      <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-fuchsia-700/20 rounded-full blur-[150px] animate-pulse animation-delay-2000"></div>

      {/* Back to Home */}
      <Link href="/" className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-[var(--mid-gray)] hover:text-white transition-colors">
        <span className="material-icons">arrow_back</span>
        <span>Back to Home</span>
      </Link>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <div className="bg-glass rounded-3xl p-8 card-glow">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="material-icons text-purple-400 text-4xl">hub</span>
              <span className="text-2xl font-bold text-white tracking-wider">Loconomy</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-[var(--mid-gray)]">Join thousands of users and providers</p>
          </div>

          {/* User Type Selection */}
          <div className="flex bg-black/20 rounded-full p-1 mb-6">
            <button
              onClick={() => setUserType("customer")}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                userType === "customer"
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white"
                  : "text-[var(--mid-gray)] hover:text-white"
              }`}
            >
              I need services
            </button>
            <button
              onClick={() => setUserType("provider")}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                userType === "provider"
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white"
                  : "text-[var(--mid-gray)] hover:text-white"
              }`}
            >
              I provide services
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 bg-red-500/10 border-red-500/50 text-red-400">
              <span className="material-icons text-sm">error</span>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Social Sign Up */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center space-x-3 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-full transition-colors border border-white/10 hover:border-white/30">
              <span className="material-icons text-xl">login</span>
              <span>Continue with Google</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-3 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-full transition-colors border border-white/10 hover:border-white/30">
              <span className="material-icons text-xl">facebook</span>
              <span>Continue with Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-[var(--mid-gray)] text-sm">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-white mb-2 block">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="John"
                  className="bg-black/20 border-white/10 text-white placeholder-[var(--mid-gray)] py-3 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-white mb-2 block">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Doe"
                  className="bg-black/20 border-white/10 text-white placeholder-[var(--mid-gray)] py-3 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-white mb-2 block">Email</Label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--mid-gray)]">mail</span>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john@example.com"
                  className="bg-black/20 border-white/10 text-white placeholder-[var(--mid-gray)] pl-12 py-3 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-white mb-2 block">Password</Label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--mid-gray)]">lock</span>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Create a strong password"
                  className="bg-black/20 border-white/10 text-white placeholder-[var(--mid-gray)] pl-12 pr-12 py-3 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--mid-gray)] hover:text-white transition-colors"
                >
                  <span className="material-icons">{showPassword ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-white mb-2 block">Confirm Password</Label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--mid-gray)]">lock</span>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                  className="bg-black/20 border-white/10 text-white placeholder-[var(--mid-gray)] pl-12 pr-12 py-3 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--mid-gray)] hover:text-white transition-colors"
                >
                  <span className="material-icons">{showConfirmPassword ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={setAcceptTerms}
                className="border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 mt-1"
              />
              <Label htmlFor="terms" className="text-[var(--mid-gray)] text-sm leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white py-3 rounded-full btn-glow transition-transform transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                `Create ${userType === "customer" ? "Customer" : "Provider"} Account`
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-[var(--mid-gray)]">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-2 mt-6 text-[var(--mid-gray)] text-xs">
            <span className="material-icons text-sm">security</span>
            <span>Your data is protected with end-to-end encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
