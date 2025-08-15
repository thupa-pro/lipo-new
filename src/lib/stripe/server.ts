import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18',
  typescript: true,
});

export { stripe };

export const createPaymentIntent = async (
  amount: number,
  currency = 'usd',
  metadata: Record<string, string> = {}
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
};

export const retrievePaymentIntent = async (paymentIntentId: string) => {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw new Error('Failed to retrieve payment intent');
  }
};

export const createCustomer = async (email: string, name?: string) => {
  try {
    return await stripe.customers.create({
      email,
      name,
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    throw new Error('Failed to create customer');
  }
};

export const createEphemeralKey = async (customerId: string) => {
  try {
    return await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: '2024-12-18' }
    );
  } catch (error) {
    console.error('Error creating ephemeral key:', error);
    throw new Error('Failed to create ephemeral key');
  }
};

export const constructWebhookEvent = (
  body: string | Buffer,
  signature: string
) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('Stripe webhook secret not configured');
  }

  try {
    return stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Error constructing webhook event:', error);
    throw new Error('Invalid webhook signature');
  }
};
