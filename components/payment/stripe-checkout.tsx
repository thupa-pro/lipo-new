"use client";

import { useState, useEffect } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Shield,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StripeCheckoutProps {
  amount: number;
  currency?: string;
  description: string;
  recipientName: string;
  bookingId?: string;
  providerId?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  className?: string;
}

const CheckoutForm = ({
  amount,
  currency = "USD",
  description,
  recipientName,
  bookingId,
  providerId,
  onSuccess,
  onError,
  onCancel,
}: Omit<StripeCheckoutProps, "className">) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/stripe/payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency: currency.toLowerCase(),
            bookingId,
            providerId,
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment intent');
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize payment');
        onError?.(err instanceof Error ? err.message : 'Failed to initialize payment');
      }
    };

    createPaymentIntent();
  }, [amount, currency, bookingId, providerId, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError('Payment system not ready');
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Payment validation failed');
      setIsLoading(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
      redirect: 'if_required',
    });

    setIsLoading(false);

    if (confirmError) {
      setError(confirmError.message || 'Payment failed');
      onError?.(confirmError.message || 'Payment failed');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess?.(paymentIntent.id);
    }
  };

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Initializing payment...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-semibold">{recipientName}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${amount.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">{currency}</p>
          </div>
        </div>
      </div>

      {/* Payment Element */}
      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-card">
          <PaymentElement 
            options={{
              layout: "tabs",
              paymentMethodOrder: ["card", "apple_pay", "google_pay"]
            }}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isLoading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <CreditCard className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </Button>
      </div>

      {/* Security Footer */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Lock className="w-3 h-3" />
        <span>Secured by Stripe • SSL encrypted</span>
      </div>
    </form>
  );
};

export function StripeCheckout({
  amount,
  currency = "USD",
  description,
  recipientName,
  bookingId,
  providerId,
  onSuccess,
  onError,
  onCancel,
  className,
}: StripeCheckoutProps) {
  const [stripePromise] = useState(() => getStripe());

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: '#ffffff',
      colorText: '#0f172a',
      colorDanger: '#ef4444',
      borderRadius: '8px',
    },
  };

  return (
    <Card className={cn("w-full max-w-lg mx-auto", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Elements 
          stripe={stripePromise} 
          options={{ 
            appearance,
            clientSecret: undefined // Will be set in CheckoutForm
          }}
        >
          <CheckoutForm
            amount={amount}
            currency={currency}
            description={description}
            recipientName={recipientName}
            bookingId={bookingId}
            providerId={providerId}
            onSuccess={onSuccess}
            onError={onError}
            onCancel={onCancel}
          />
        </Elements>
      </CardContent>
    </Card>
  );
}

// Success Component
export function PaymentSuccess({ 
  paymentIntentId,
  amount,
  currency = "USD",
  recipientName 
}: {
  paymentIntentId: string;
  amount: number;
  currency?: string;
  recipientName: string;
}) {
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="text-center space-y-6 p-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2 text-emerald-600">
            Payment Successful!
          </h3>
          <p className="text-muted-foreground">
            Your payment to {recipientName} has been processed
          </p>
        </div>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono text-sm">{paymentIntentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold">${amount.toFixed(2)} {currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                Completed
              </Badge>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
