import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

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

/**
 * Handle successful checkout
 * Handle both subscription and session booking payments
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id);

  // Check if this is a session booking or subscription
  const isSessionBooking = session.metadata?.type === 'session_booking';

  if (isSessionBooking) {
    await handleSessionBooking(session);
  } else {
    await handleSubscriptionSignup(session);
  }
}

/**
 * Handle session booking payment completion
 */
async function handleSessionBooking(session: Stripe.Checkout.Session) {
  console.log('Session booking completed:', session.id);

  const {
    sessionType,
    date,
    time,
    duration,
    clientName,
    clientEmail,
    clientPhone,
    clientNotes,
    timeSlotId
  } = session.metadata || {};

  if (!sessionType || !date || !time || !clientEmail) {
    console.error('Missing required session booking data');
    return;
  }

  try {
    // 1. Create session record in database
    // TODO: Insert into session_records table
    console.log('Creating session record:', {
      sessionType,
      date,
      time,
      duration,
      clientName,
      clientEmail,
      paymentId: session.payment_intent,
      amount: session.amount_total,
      status: 'confirmed'
    });

    // 2. Create Apple Calendar event
    const startDateTime = new Date(`${date} ${time}`);
    const endDateTime = new Date(startDateTime.getTime() + parseInt(duration || '60') * 60000);

    const calendarEventResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/calendar/apple`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `${getSessionTypeName(sessionType)} Session - ${clientName}`,
        description: `Session with ${clientName}\nEmail: ${clientEmail}\n${clientPhone ? `Phone: ${clientPhone}\n` : ''}${clientNotes ? `Notes: ${clientNotes}` : ''}`,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        location: 'Online Session',
        attendees: [clientEmail]
      })
    });

    if (!calendarEventResponse.ok) {
      console.error('Failed to create Apple Calendar event');
    }

    // 3. Send confirmation emails
    await sendSessionConfirmationEmails(session);

    // 4. Send practitioner notification
    await notifyPractitionerOfBooking(session);

    console.log('Session booking processed successfully');

  } catch (error) {
    console.error('Error processing session booking:', error);
  }
}

/**
 * Handle subscription signup (existing functionality)
 */
async function handleSubscriptionSignup(session: Stripe.Checkout.Session) {
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

/**
 * Helper functions for session booking
 */
function getSessionTypeName(sessionType: string): string {
  const names: Record<string, string> = {
    consultation: 'Initial Consultation',
    session: 'Spiralogic Session',
    intensive: 'Breakthrough Intensive',
  };
  return names[sessionType] || 'Session';
}

/**
 * Send confirmation emails for session booking
 */
async function sendSessionConfirmationEmails(session: Stripe.Checkout.Session) {
  // TODO: Implement with Resend
  // Send to client and practitioner with calendar invites
  console.log('Sending session confirmation emails for:', session.id);
}

/**
 * Notify practitioner of new booking
 */
async function notifyPractitionerOfBooking(session: Stripe.Checkout.Session) {
  // TODO: Send immediate notification to practitioner
  // Could be email, SMS, or in-app notification
  console.log('Notifying practitioner of booking:', session.id);
}
