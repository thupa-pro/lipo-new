import { NextRequest, NextResponse } from 'next/server';
import { stripeConnect } from '@/lib/stripe/connect';
import { createSupabaseServerComponent } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerComponent();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create_account':
        const { email, businessType, businessName, country } = body;
        
        if (!email || !businessType || !country) {
          return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
          );
        }

        const setupResult = await stripeConnect.createConnectAccount({
          userId: user.id,
          email,
          businessType,
          businessName,
          country,
          capabilities: ['card_payments', 'transfers']
        });

        return NextResponse.json(setupResult);

      case 'get_status':
        const { accountId } = body;
        
        if (!accountId) {
          return NextResponse.json(
            { error: 'Account ID required' },
            { status: 400 }
          );
        }

        const status = await stripeConnect.getAccountStatus(accountId);
        return NextResponse.json(status);

      case 'create_payment':
        const { bookingId, customerId, providerId, amount, currency, applicationFeeAmount, metadata } = body;
        
        if (!bookingId || !customerId || !providerId || !amount) {
          return NextResponse.json(
            { error: 'Missing payment fields' },
            { status: 400 }
          );
        }

        const paymentResult = await stripeConnect.createEscrowPayment({
          bookingId,
          customerId,
          providerId,
          amount,
          currency: currency || 'usd',
          applicationFeeAmount,
          metadata
        });

        return NextResponse.json(paymentResult);

      case 'release_escrow':
        const { paymentIntentId, releaseAmount, reason } = body;
        
        if (!paymentIntentId || !releaseAmount || !reason) {
          return NextResponse.json(
            { error: 'Missing escrow release fields' },
            { status: 400 }
          );
        }

        const releaseResult = await stripeConnect.releaseEscrowFunds({
          paymentIntentId,
          bookingId: body.bookingId,
          releaseAmount,
          reason
        });

        return NextResponse.json(releaseResult);

      case 'process_refund':
        const { refundAmount, refundReason } = body;
        
        if (!body.paymentIntentId || !refundAmount) {
          return NextResponse.json(
            { error: 'Missing refund fields' },
            { status: 400 }
          );
        }

        const refundResult = await stripeConnect.processEscrowRefund(
          body.paymentIntentId,
          refundAmount,
          refundReason || 'Customer requested refund'
        );

        return NextResponse.json(refundResult);

      case 'get_financials':
        const { connectAccountId } = body;
        
        if (!connectAccountId) {
          return NextResponse.json(
            { error: 'Connect account ID required' },
            { status: 400 }
          );
        }

        const financials = await stripeConnect.getProviderFinancials(connectAccountId);
        return NextResponse.json(financials);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Stripe Connect API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerComponent();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (accountId) {
      const status = await stripeConnect.getAccountStatus(accountId);
      return NextResponse.json(status);
    }

    // Get user's provider data including Stripe Connect info
    const { data: provider } = await supabase
      .from('providers')
      .select('stripe_connect_id, verification_status')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({ 
      hasConnectAccount: !!provider?.stripe_connect_id,
      accountId: provider?.stripe_connect_id,
      verificationStatus: provider?.verification_status || 'pending'
    });
  } catch (error) {
    console.error('Stripe Connect GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
