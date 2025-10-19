import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Stripe Webhook Handler
 *
 * Processes Stripe events to grant/revoke access based on subscription status.
 *
 * Key events:
 * - checkout.session.completed: Grant initial access
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

/**
 * Handle successful checkout
 * Grant initial access to the user
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id);

  const userId = session.metadata?.userId;
  const tier = session.metadata?.tier;
  const customerEmail = session.customer_email;

  if (!userId && !customerEmail) {
    console.error('No user identifier in checkout session');
    return;
  }

  // TODO: Update user in Supabase database
  // - Set subscription_status = 'active'
  // - Set subscription_tier = tier (explorer/practitioner/studio)
  // - Set stripe_customer_id = session.customer
  // - Set stripe_subscription_id = session.subscription
  // - Grant access to features based on tier

  console.log('Access granted:', {
    userId,
    tier,
    customerEmail,
    customerId: session.customer,
    subscriptionId: session.subscription,
  });

  // TODO: Send welcome email via Resend
  // - Thank them for joining
  // - Link to getting started guide
  // - Link to MAIA conversation
  // - Link to chart exploration
}

/**
 * Handle subscription creation
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);

  const customerId = subscription.customer as string;

  // TODO: Update user in database
  // - Find user by stripe_customer_id
  // - Set subscription_status = 'active'
  // - Set subscription_tier from price ID
  // - Set current_period_end = subscription.current_period_end

  console.log('Subscription activated:', {
    customerId,
    status: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  });
}

/**
 * Handle subscription updates
 * (tier changes, renewals, cancellations scheduled)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);

  const customerId = subscription.customer as string;
  const status = subscription.status;

  // TODO: Update user in database
  // - Find user by stripe_customer_id
  // - Update subscription_status
  // - Update subscription_tier if price changed
  // - Update current_period_end
  // - If cancel_at_period_end, notify user

  console.log('Subscription status:', {
    customerId,
    status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  });

  // If subscription was canceled (but still active until period end)
  if (subscription.cancel_at_period_end) {
    // TODO: Send email notification
    console.log('Subscription will cancel at:', new Date(subscription.current_period_end * 1000));
  }
}

/**
 * Handle subscription deletion
 * Revoke access when subscription ends
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);

  const customerId = subscription.customer as string;

  // TODO: Update user in database
  // - Find user by stripe_customer_id
  // - Set subscription_status = 'canceled'
  // - Set subscription_tier = 'free'
  // - Revoke premium features
  // - Keep their data (Sacred Scribe, chart, etc.)

  console.log('Access revoked (subscription ended):', {
    customerId,
    endedAt: new Date(subscription.ended_at! * 1000),
  });

  // TODO: Send email
  // - Thank them for their time as member
  // - Offer to resubscribe
  // - Assure data is safe (not deleted)
}

/**
 * Handle successful payment
 * Maintain access, log revenue
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Payment succeeded:', invoice.id);

  const customerId = invoice.customer as string;
  const amountPaid = invoice.amount_paid / 100; // Convert cents to dollars

  // TODO: Update user in database
  // - Find user by stripe_customer_id
  // - Extend current_period_end
  // - Log payment in revenue tracking table

  console.log('Payment recorded:', {
    customerId,
    amount: amountPaid,
    currency: invoice.currency,
    paidAt: new Date(invoice.status_transitions.paid_at! * 1000),
  });
}

/**
 * Handle failed payment
 * Warning to user, potential access revocation
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed:', invoice.id);

  const customerId = invoice.customer as string;

  // TODO: Update user in database
  // - Find user by stripe_customer_id
  // - Set payment_status = 'past_due'
  // - Send urgent email to update payment method
  // - Grace period: Keep access for 3 days

  console.log('Payment failure:', {
    customerId,
    attemptCount: invoice.attempt_count,
    nextAttempt: invoice.next_payment_attempt
      ? new Date(invoice.next_payment_attempt * 1000)
      : null,
  });

  // TODO: Send urgent email
  // - Payment failed notification
  // - Update payment method link
  // - Grace period explanation
}
