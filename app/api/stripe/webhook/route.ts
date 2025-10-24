import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors when env vars aren't set
function getStripeClient() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
  return new Stripe(apiKey, {
    apiVersion: '2024-11-20.acacia',
  });
}

function getWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set');
  }
  return secret;
}

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
}

/**
 * Stripe Webhook Handler
 *
 * Processes Stripe events to grant/revoke access based on subscription status.
 *
 * Key events:
 * - checkout.session.completed: Grant initial access
 * - customer.subscription.created: Track subscription
 * - customer.subscription.updated: Update access level
 * - customer.subscription.deleted: Revoke access
 * - invoice.payment_succeeded: Maintain access
 * - invoice.payment_failed: Warning, potential revocation
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripeClient();
    const webhookSecret = getWebhookSecret();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Process the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

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
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get tier from Stripe price ID
 */
function getTierFromPriceId(priceId: string): 'explorer' | 'practitioner' | 'studio' | 'free' {
  const priceMap: Record<string, 'explorer' | 'practitioner' | 'studio'> = {
    [process.env.STRIPE_PRICE_EXPLORER_MONTHLY || '']: 'explorer',
    [process.env.STRIPE_PRICE_EXPLORER_ANNUAL || '']: 'explorer',
    [process.env.STRIPE_PRICE_PRACTITIONER_MONTHLY || '']: 'practitioner',
    [process.env.STRIPE_PRICE_PRACTITIONER_ANNUAL || '']: 'practitioner',
    [process.env.STRIPE_PRICE_STUDIO_MONTHLY || '']: 'studio',
    [process.env.STRIPE_PRICE_STUDIO_ANNUAL || '']: 'studio',
  };

  return priceMap[priceId] || 'free';
}

/**
 * Check if promotion code was applied (founder discount detection)
 */
function checkFounderDiscount(session: Stripe.Checkout.Session): {
  isFounder: boolean;
  discountPercent: number;
} {
  if (session.total_details?.amount_discount && session.total_details.amount_discount > 0) {
    // Check if it's approximately 35% discount (founder pricing)
    const originalAmount = session.amount_total! + session.total_details.amount_discount;
    const discountPercent = Math.round((session.total_details.amount_discount / originalAmount) * 100);

    return {
      isFounder: discountPercent >= 30 && discountPercent <= 40, // 35% +/- 5%
      discountPercent: discountPercent
    };
  }

  return { isFounder: false, discountPercent: 0 };
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Handle successful checkout
 * Grant initial access to the user
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('🎉 Checkout completed:', session.id);

  const userId = session.metadata?.userId;
  const tier = session.metadata?.tier as 'explorer' | 'practitioner' | 'studio';
  const customerEmail = session.customer_email;
  const { customer, subscription } = session;

  if (!userId && !customerEmail) {
    console.error('❌ No user identifier in checkout session');
    return;
  }

  // Get subscription details from Stripe
  const stripe = getStripeClient();
  const stripeSubscription = await stripe.subscriptions.retrieve(subscription as string);

  // Check if founder discount was applied
  const { isFounder, discountPercent } = checkFounderDiscount(session);

  // Update Supabase
  const supabase = getSupabaseClient();

  const updateData: any = {
    subscription_status: 'active',
    subscription_tier: tier,
    stripe_customer_id: customer,
    stripe_subscription_id: subscription,
    subscription_start_date: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
    subscription_current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
  };

  // Add founder data if applicable
  if (isFounder) {
    updateData.is_founder = true;
    updateData.founder_discount_percent = discountPercent;
    updateData.founder_badge_earned = new Date().toISOString();
  }

  // If they were on trial, mark as converted
  const { data: userData } = await supabase
    .from('explorers')
    .select('trial_end_date')
    .eq('explorer_id', userId)
    .single();

  if (userData?.trial_end_date) {
    updateData.trial_converted = true;
  }

  const { error } = await supabase
    .from('explorers')
    .update(updateData)
    .eq('explorer_id', userId);

  if (error) {
    console.error('❌ Failed to update user subscription:', error);
    throw error;
  }

  console.log('✅ Access granted:', {
    userId,
    tier,
    isFounder,
    customerEmail,
    customerId: customer,
    subscriptionId: subscription,
  });

  // TODO: Send welcome email via Resend
  // await sendWelcomeEmail(userId, tier, isFounder);
}

/**
 * Handle subscription creation
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('🆕 Subscription created:', subscription.id);

  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0].price.id;
  const tier = getTierFromPriceId(priceId);

  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('explorers')
    .update({
      subscription_status: subscription.status,
      subscription_tier: tier,
      subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('❌ Failed to update subscription:', error);
    throw error;
  }

  console.log('✅ Subscription activated:', {
    customerId,
    tier,
    status: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  });
}

/**
 * Handle subscription updates
 * (tier changes, renewals, cancellations scheduled)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('🔄 Subscription updated:', subscription.id);

  const customerId = subscription.customer as string;
  const status = subscription.status;
  const priceId = subscription.items.data[0].price.id;
  const tier = getTierFromPriceId(priceId);

  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('explorers')
    .update({
      subscription_status: status,
      subscription_tier: tier,
      subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('❌ Failed to update subscription:', error);
    throw error;
  }

  console.log('✅ Subscription status updated:', {
    customerId,
    tier,
    status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  });

  // If subscription was canceled (but still active until period end)
  if (subscription.cancel_at_period_end) {
    console.log('📅 Subscription will cancel at:', new Date(subscription.current_period_end * 1000));
    // TODO: Send email notification about upcoming cancellation
    // await sendCancellationWarningEmail(customerId, subscription.current_period_end);
  }
}

/**
 * Handle subscription deletion
 * Revoke access when subscription ends
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('🗑️  Subscription deleted:', subscription.id);

  const customerId = subscription.customer as string;

  const supabase = getSupabaseClient();

  // Revert to free tier but keep all user data
  const { error } = await supabase
    .from('explorers')
    .update({
      subscription_status: 'canceled',
      subscription_tier: 'free',
      subscription_current_period_end: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('❌ Failed to revoke subscription:', error);
    throw error;
  }

  console.log('✅ Access reverted to free tier:', {
    customerId,
    endedAt: subscription.ended_at ? new Date(subscription.ended_at * 1000) : new Date(),
  });

  // TODO: Send email
  // await sendCancellationConfirmationEmail(customerId);
}

/**
 * Handle successful payment
 * Maintain access, ensure status is active
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('💳 Payment succeeded:', invoice.id);

  const customerId = invoice.customer as string;
  const amountPaid = invoice.amount_paid / 100; // Convert cents to dollars

  const supabase = getSupabaseClient();

  // Ensure subscription is marked active (in case recovering from past_due)
  const { error } = await supabase
    .from('explorers')
    .update({
      subscription_status: 'active',
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('❌ Failed to update payment status:', error);
    throw error;
  }

  console.log('✅ Payment recorded:', {
    customerId,
    amount: amountPaid,
    currency: invoice.currency,
    paidAt: invoice.status_transitions.paid_at
      ? new Date(invoice.status_transitions.paid_at * 1000)
      : new Date(),
  });

  // TODO: Log payment in revenue tracking table (if needed for analytics)
}

/**
 * Handle failed payment
 * Set past_due status, send urgent email
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('⚠️  Payment failed:', invoice.id);

  const customerId = invoice.customer as string;
  const attemptCount = invoice.attempt_count || 0;

  const supabase = getSupabaseClient();

  // Grace period: 3 attempts before full suspension
  if (attemptCount >= 3) {
    // Set to past_due after 3 attempts
    const { error } = await supabase
      .from('explorers')
      .update({
        subscription_status: 'past_due',
      })
      .eq('stripe_customer_id', customerId);

    if (error) {
      console.error('❌ Failed to update payment status:', error);
      throw error;
    }

    console.log('🚨 Subscription set to past_due after 3 failed attempts');
    // TODO: Send urgent email to update payment method
    // await sendPaymentFailureEmail(customerId, { urgent: true });
  } else {
    console.log(`⚠️  Payment attempt ${attemptCount}/3 failed - grace period active`);
    // TODO: Send gentle reminder email
    // await sendPaymentFailureEmail(customerId, { urgent: false, attemptsRemaining: 3 - attemptCount });
  }

  console.log('Payment failure details:', {
    customerId,
    attemptCount,
    nextAttempt: invoice.next_payment_attempt
      ? new Date(invoice.next_payment_attempt * 1000)
      : null,
  });
}
