import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    const event = constructWebhookEvent(body, signature);
    const supabase = createClient();

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        
        // Update payment status in database
        await supabase
          .from('payments')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        // Update booking status if booking_id exists in metadata
        if (paymentIntent.metadata.bookingId) {
          await supabase
            .from('bookings')
            .update({ 
              status: 'confirmed',
              payment_status: 'paid'
            })
            .eq('id', paymentIntent.metadata.bookingId);
        }

        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        
        // Update payment status
        await supabase
          .from('payments')
          .update({ 
            status: 'failed',
            failure_reason: paymentIntent.last_payment_error?.message || 'Payment failed'
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        // Update booking status
        if (paymentIntent.metadata.bookingId) {
          await supabase
            .from('bookings')
            .update({ 
              status: 'payment_failed',
              payment_status: 'failed'
            })
            .eq('id', paymentIntent.metadata.bookingId);
        }

        console.log('Payment failed:', paymentIntent.id);
        break;
      }

      case 'payment_intent.processing': {
        const paymentIntent = event.data.object;
        
        await supabase
          .from('payments')
          .update({ status: 'processing' })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        console.log('Payment processing:', paymentIntent.id);
        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object;
        
        await supabase
          .from('payments')
          .update({ status: 'canceled' })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (paymentIntent.metadata.bookingId) {
          await supabase
            .from('bookings')
            .update({ 
              status: 'cancelled',
              payment_status: 'canceled'
            })
            .eq('id', paymentIntent.metadata.bookingId);
        }

        console.log('Payment canceled:', paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
