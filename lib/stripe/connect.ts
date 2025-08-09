import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export interface CreateConnectAccountParams {
  userId: string;
  email: string;
  businessType: 'individual' | 'company';
  businessName?: string;
  country: string;
  capabilities: string[];
}

export interface CreateEscrowPaymentParams {
  bookingId: string;
  customerId: string;
  providerId: string;
  amount: number;
  currency: string;
  applicationFeeAmount?: number;
  metadata?: Record<string, string>;
}

export interface ReleaseEscrowFundsParams {
  paymentIntentId: string;
  bookingId: string;
  releaseAmount: number;
  reason: string;
}

export class StripeConnect {
  /**
   * Create a Stripe Connect account for a provider
   */
  async createConnectAccount(params: CreateConnectAccountParams) {
    try {
      const account = await stripe.accounts.create({
        type: 'express',
        country: params.country,
        email: params.email,
        business_type: params.businessType,
        company: params.businessName ? {
          name: params.businessName,
        } : undefined,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          userId: params.userId,
        },
      });

      // Create an account link for onboarding
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/provider-onboarding?refresh=true`,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/provider-onboarding?success=true`,
        type: 'account_onboarding',
      });

      return {
        accountId: account.id,
        onboardingUrl: accountLink.url,
      };
    } catch (error) {
      console.error('Stripe Connect account creation error:', error);
      throw new Error('Failed to create Connect account');
    }
  }

  /**
   * Get account status and verification details
   */
  async getAccountStatus(accountId: string) {
    try {
      const account = await stripe.accounts.retrieve(accountId);
      
      return {
        id: account.id,
        detailsSubmitted: account.details_submitted,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        requirements: account.requirements,
      };
    } catch (error) {
      console.error('Stripe account status error:', error);
      throw new Error('Failed to get account status');
    }
  }

  /**
   * Create an escrow payment for a booking
   */
  async createEscrowPayment(params: CreateEscrowPaymentParams) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: params.amount,
        currency: params.currency,
        customer: params.customerId,
        application_fee_amount: params.applicationFeeAmount || Math.round(params.amount * 0.05), // 5% fee
        transfer_data: {
          destination: params.providerId,
        },
        metadata: {
          bookingId: params.bookingId,
          type: 'escrow_payment',
          ...params.metadata,
        },
        capture_method: 'manual', // Hold funds in escrow
      });

      return {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status,
      };
    } catch (error) {
      console.error('Stripe escrow payment error:', error);
      throw new Error('Failed to create escrow payment');
    }
  }

  /**
   * Release escrow funds to provider
   */
  async releaseEscrowFunds(params: ReleaseEscrowFundsParams) {
    try {
      // Capture the payment to release funds
      const paymentIntent = await stripe.paymentIntents.capture(params.paymentIntentId, {
        amount_to_capture: params.releaseAmount,
      });

      return {
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amountReleased: params.releaseAmount,
      };
    } catch (error) {
      console.error('Stripe escrow release error:', error);
      throw new Error('Failed to release escrow funds');
    }
  }

  /**
   * Process refund from escrow
   */
  async processEscrowRefund(paymentIntentId: string, refundAmount: number, reason: string) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: refundAmount,
        reason: 'requested_by_customer',
        metadata: {
          refund_reason: reason,
        },
      });

      return {
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount,
      };
    } catch (error) {
      console.error('Stripe refund error:', error);
      throw new Error('Failed to process refund');
    }
  }

  /**
   * Get provider financial data
   */
  async getProviderFinancials(connectAccountId: string) {
    try {
      const account = await stripe.accounts.retrieve(connectAccountId);
      
      // Get balance
      const balance = await stripe.balance.retrieve({
        stripeAccount: connectAccountId,
      });

      // Get recent transfers
      const transfers = await stripe.transfers.list({
        destination: connectAccountId,
        limit: 10,
      });

      return {
        accountId: connectAccountId,
        balance,
        transfers: transfers.data,
        accountStatus: {
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled,
          detailsSubmitted: account.details_submitted,
        },
      };
    } catch (error) {
      console.error('Stripe financials error:', error);
      throw new Error('Failed to get provider financials');
    }
  }

  /**
   * Handle webhook events
   */
  async handleWebhook(body: string, signature: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!endpointSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    try {
      const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

      switch (event.type) {
        case 'account.updated':
          // Handle account verification updates
          console.log('Account updated:', event.data.object);
          break;
        
        case 'payment_intent.succeeded':
          // Handle successful payments
          console.log('Payment succeeded:', event.data.object);
          break;
        
        case 'transfer.created':
          // Handle transfers to connected accounts
          console.log('Transfer created:', event.data.object);
          break;
        
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      throw error;
    }
  }
}

export const stripeConnect = new StripeConnect();
