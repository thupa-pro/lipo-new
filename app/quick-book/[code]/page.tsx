"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Check,
  Loader2,
  Phone,
  Mail,
  User,
  QrCode,
  Shield,
  Zap
} from "lucide-react";

interface ProviderInfo {
  name: string;
  rating: number;
  responseTime: number;
  avatar?: string;
  business_name?: string;
  location?: string;
}

export default function QuickBookingPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [minDateTime, setMinDateTime] = useState('');

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    preferredTime: "",
    notes: ""
  });

  const code = params.code as string;

  useEffect(() => {
    // Set minimum datetime for booking (client-side only to avoid hydration mismatch)
    setMinDateTime(new Date().toISOString().slice(0, 16));

    if (code) {
      // In a real implementation, you would validate the QR code and get provider info
      setProviderInfo({
        name: "Alex Chen",
        rating: 4.9,
        responseTime: 15,
        avatar: "",
        business_name: "Premium House Cleaning",
        location: "San Francisco, CA"
      });
      setEstimatedCost(75);
    }
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.preferredTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    // Create abort controller for booking request
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, 60000); // 60 second timeout for booking submission

    try {
      const response = await fetch('/api/offline/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          action: 'process_qr_booking',
          quickBookingCode: code,
          customerData: formData
        }),
        signal: abortController.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Booking request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Booking Confirmed! 🎉",
          description: "The provider will contact you shortly. Check your phone for updates.",
        });

        // Redirect to a success page or booking tracking
        setTimeout(() => {
          router.push(`/booking-confirmation/${result.bookingId}`);
        }, 2000);
      } else {
        throw new Error(result.error || 'Booking failed');
      }
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          toast({
            title: "Request Timeout",
            description: "Your booking request timed out. Please check your connection and try again.",
            variant: "destructive"
          });
        } else {
          console.error('Booking error:', error.message);
          toast({
            title: "Booking Failed",
            description: error.message.includes('fetch')
              ? "Network error. Please check your connection and try again."
              : "There was an error processing your booking. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        console.error('Unknown booking error:', error);
        toast({
          title: "Booking Failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:bg-[var(--dark-navy)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-gray-600 dark:text-gray-300">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:bg-[var(--dark-navy)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 dark:from-[var(--purple-glow)] dark:to-[var(--cyan-glow)] rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quick Booking
          </h1>
          <p className="text-gray-600 dark:text-[var(--mid-gray)]">
            Complete your booking in seconds with our QR code system
          </p>
        </div>

        {/* Provider Info Card */}
        {providerInfo && (
          <Card className="card-premium border-gray-200 dark:border-white/10 mb-8">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-purple-500/50 dark:border-[var(--purple-glow)]/50">
                  <AvatarImage src={providerInfo.avatar} alt={providerInfo.name} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-fuchsia-500 dark:from-[var(--purple-glow)] dark:to-[var(--magenta-glow)] text-white text-lg font-bold">
                    {providerInfo.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {providerInfo.name}
                  </h2>
                  <p className="text-gray-600 dark:text-[var(--mid-gray)]">
                    {providerInfo.business_name}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {providerInfo.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">
                        {providerInfo.responseTime} min response
                      </span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">
                    {providerInfo.location}
                  </span>
                </div>
                {estimatedCost && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Estimated cost</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      ${estimatedCost}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Form */}
        <Card className="card-premium border-gray-200 dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Book Your Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-900 dark:text-white">
                    Full Name *
                  </Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-900 dark:text-white">
                    Phone Number *
                  </Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-900 dark:text-white">
                  Email Address
                </Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="preferredTime" className="text-gray-900 dark:text-white">
                  Preferred Date & Time *
                </Label>
                <div className="relative mt-2">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="preferredTime"
                    type="datetime-local"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="pl-10"
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-gray-900 dark:text-white">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-2"
                  rows={3}
                  placeholder="Any special requirements or details..."
                />
              </div>

              {/* Quick Benefits */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  Quick Booking Benefits
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Instant confirmation via SMS
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Provider contacts you within 15 minutes
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Secure payment processing
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    100% satisfaction guarantee
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500 dark:from-[var(--purple-glow)] dark:via-[var(--magenta-glow)] dark:to-[var(--cyan-glow)] text-white py-6 text-lg font-bold rounded-2xl btn-glow hover:scale-105 transition-all duration-300"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Confirming Booking...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                By booking, you agree to our{" "}
                <a href="/terms" className="text-purple-500 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-purple-500 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
