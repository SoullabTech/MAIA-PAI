/**
 * Stripe Webhook Handler
 *
 * Handles subscription lifecycle events from Stripe:
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.payment_succeeded
 * - invoice.payment_failed
 * - checkout.session.completed
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia'
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// ============================================================================
// SUBSCRIPTION EVENT HANDLERS
// ============================================================================

/**
 * Handle subscription created
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('🎉 Subscription created:', subscription.id);

  const customerId = subscription.customer as string;
  const status = subscription.status;
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

  // Determine tier from price ID
  const priceId = subscription.items.data[0]?.price.id;
  const tier = getTierFromPriceId(priceId);

  // Update user in database (match by stripe_customer_id)
  const { error } = await supabase
    .from('explorers')
    .update({
      subscription_status: mapStripeStatus(status),
      subscription_tier: tier,
      stripe_subscription_id: subscription.id,
      subscription_start_date: new Date(subscription.start_date * 1000).toISOString(),
      subscription_current_period_end: currentPeriodEnd.toISOString(),
      trial_converted: subscription.trial_end ? true : false
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('Failed to update subscription:', error);
    throw error;
  }

  console.log('✅ User subscription updated in database');
}

/**
 * Handle subscription updated
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('📝 Subscription updated:', subscription.id);

  const status = subscription.status;
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

  // Determine tier from price ID
  const priceId = subscription.items.data[0]?.price.id;
  const tier = getTierFromPriceId(priceId);

  const updates: any = {
    subscription_status: mapStripeStatus(status),
    subscription_tier: tier,
    subscription_current_period_end: currentPeriodEnd.toISOString()
  };

  // If subscription was canceled
  if (subscription.canceled_at) {
    updates.subscription_status = 'canceled';
  }

  const { error } = await supabase
    .from('explorers')
    .update(updates)
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Failed to update subscription:', error);
    throw error;
  }

  console.log('✅ Subscription updated in database');
}

/**
 * Handle subscription deleted
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('❌ Subscription deleted:', subscription.id);

  const { error } = await supabase
    .from('explorers')
    .update({
      subscription_status: 'canceled',
      subscription_tier: 'free',
      stripe_subscription_id: null,
      subscription_current_period_end: null
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Failed to cancel subscription:', error);
    throw error;
  }

  console.log('✅ Subscription canceled in database');
}

/**
 * Handle successful payment
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('💰 Payment succeeded:', invoice.id);

  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    console.log('No subscription associated with invoice');
    return;
  }

  // Ensure subscription is active
  const { error } = await supabase
    .from('explorers')
    .update({
      subscription_status: 'active'
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('Failed to update payment status:', error);
    throw error;
  }

  console.log('✅ Payment recorded in database');
}

/**
 * Handle failed payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('⚠️  Payment failed:', invoice.id);

  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    console.log('No subscription associated with invoice');
    return;
  }

  // Mark subscription as past_due
  const { error } = await supabase
    .from('explorers')
    .update({
      subscription_status: 'past_due'
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('Failed to update payment status:', error);
    throw error;
  }

  console.log('✅ Payment failure recorded in database');

  // TODO: Trigger email notification for failed payment
}

/**
 * Handle checkout session completed
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('🛒 Checkout completed:', session.id);

  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!customerId) {
    console.error('No customer ID in checkout session');
    return;
  }

  // Get user email from session
  const email = session.customer_email || session.customer_details?.email;

  // Update user with Stripe customer ID
  const { error } = await supabase
    .from('explorers')
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId
    })
    .eq('email', email);

  if (error) {
    console.error('Failed to link customer:', error);
    throw error;
  }

  console.log('✅ Customer linked in database');
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Map Stripe subscription status to our internal status
 */
function mapStripeStatus(stripeStatus: string): string {
  const statusMap: Record<string, string> = {
    'active': 'active',
    'trialing': 'trialing',
    'past_due': 'past_due',
    'canceled': 'canceled',
    'unpaid': 'canceled',
    'incomplete': 'free',
    'incomplete_expired': 'free'
  };

  return statusMap[stripeStatus] || 'free';
}

/**
 * Get subscription tier from Stripe price ID
 */
function getTierFromPriceId(priceId?: string): string {
  if (!priceId) return 'free';

  // Map your Stripe price IDs to tiers
  const tierMap: Record<string, string> = {
    // Monthly prices
    'price_explorer_monthly': 'explorer',
    'price_practitioner_monthly': 'practitioner',
    'price_studio_monthly': 'studio',
    // Annual prices
    'price_explorer_annual': 'explorer',
    'price_practitioner_annual': 'practitioner',
    'price_studio_annual': 'studio'
  };

  return tierMap[priceId] || 'explorer'; // Default to explorer
}

// ============================================================================
// WEBHOOK ROUTE HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    console.error('No Stripe signature found');
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  console.log(`📨 Webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}
