import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { amount, currency = 'usd', bookingId, providerId } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create payment intent with metadata
    const paymentIntent = await createPaymentIntent(amount, currency, {
      userId: user.id,
      userEmail: user.email || '',
      bookingId: bookingId || '',
      providerId: providerId || '',
    });

    // Store payment intent in database
    await supabase.from('payments').insert({
      id: paymentIntent.id,
      user_id: user.id,
      booking_id: bookingId,
      provider_id: providerId,
      amount: amount,
      currency: currency.toUpperCase(),
      status: 'pending',
      stripe_payment_intent_id: paymentIntent.id,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
