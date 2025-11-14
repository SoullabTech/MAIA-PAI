import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

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

/**
 * Stripe Checkout Session Creator
 *
 * Accepts tier and billing period, creates Stripe checkout session,
 * returns URL to redirect user to Stripe hosted checkout.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Handle session booking vs subscription based on request type
    if (body.sessionType) {
      return handleSessionBooking(body);
    } else {
      return handleSubscriptionCheckout(body);
    }
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

/**
 * Handle session booking checkout
 */
async function handleSessionBooking(body: any) {
  const { sessionType, timeSlot, clientInfo, amount, successUrl, cancelUrl } = body;

  // Validate inputs
  if (!sessionType || !timeSlot || !clientInfo || !amount) {
    return NextResponse.json(
      { error: 'Missing required session booking data' },
      { status: 400 }
    );
  }

  if (!clientInfo.email) {
    return NextResponse.json(
      { error: 'Client email required for booking' },
      { status: 400 }
    );
  }

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: clientInfo.email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${getSessionTypeName(sessionType)} Session`,
            description: `${timeSlot.startTime ? new Date(timeSlot.startTime).toLocaleDateString() : ''} - ${getSessionTypeDescription(sessionType)}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: 'session_booking',
      sessionType,
      date: timeSlot.startTime ? new Date(timeSlot.startTime).toISOString().split('T')[0] : '',
      time: timeSlot.startTime ? new Date(timeSlot.startTime).toLocaleTimeString() : '',
      duration: getDurationForSessionType(sessionType).toString(),
      clientName: clientInfo.name || '',
      clientEmail: clientInfo.email,
      clientPhone: clientInfo.phone || '',
      clientNotes: clientInfo.notes || '',
      timeSlotId: timeSlot.id || '',
    },
    success_url: successUrl || `${process.env.NEXT_PUBLIC_URL}/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_URL}/book`,
  });

  return NextResponse.json({ url: session.url });
}

/**
 * Handle subscription checkout (existing functionality)
 */
async function handleSubscriptionCheckout(body: any) {
  const { tier, billingPeriod, userId, userEmail } = body;

  // Validate inputs
  if (!tier || !billingPeriod) {
    return NextResponse.json(
      { error: 'Missing tier or billing period' },
      { status: 400 }
    );
  }

  if (!userEmail) {
    return NextResponse.json(
      { error: 'User email required for checkout' },
      { status: 400 }
    );
  }

  // Get price ID from environment variables
  const priceId = getPriceId(tier, billingPeriod);

  if (!priceId) {
    return NextResponse.json(
      { error: 'Invalid tier or billing period' },
      { status: 400 }
    );
  }

  // Create Stripe checkout session
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: userEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId: userId || '',
      tier,
      billingPeriod,
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    allow_promotion_codes: true, // Enable founder discount codes
  });

  return NextResponse.json({ url: session.url });
}

/**
 * Get Stripe Price ID based on tier and billing period
 *
 * Maps to environment variables set up in Stripe dashboard
 */
function getPriceId(tier: string, billingPeriod: 'monthly' | 'annual'): string | null {
  const priceMap: Record<string, Record<string, string | undefined>> = {
    explorer: {
      monthly: process.env.STRIPE_PRICE_EXPLORER_MONTHLY,
      annual: process.env.STRIPE_PRICE_EXPLORER_ANNUAL,
    },
    practitioner: {
      monthly: process.env.STRIPE_PRICE_PRACTITIONER_MONTHLY,
      annual: process.env.STRIPE_PRICE_PRACTITIONER_ANNUAL,
    },
    studio: {
      monthly: process.env.STRIPE_PRICE_STUDIO_MONTHLY,
      annual: process.env.STRIPE_PRICE_STUDIO_ANNUAL,
    },
  };

  return priceMap[tier.toLowerCase()]?.[billingPeriod] || null;
}

/**
 * Get session type display name
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
 * Get session type description
 */
function getSessionTypeDescription(sessionType: string): string {
  const descriptions: Record<string, string> = {
    consultation: 'A deep dive into your current life situation and elemental alignment',
    session: 'A full archetypal exploration using the MAIA oracle system',
    intensive: 'Extended deep work for major life transitions and breakthrough moments',
  };
  return descriptions[sessionType] || 'Spiritual guidance session';
}

/**
 * Get session duration in minutes
 */
function getDurationForSessionType(sessionType: string): number {
  const durations: Record<string, number> = {
    consultation: 90,
    session: 60,
    intensive: 120,
  };
  return durations[sessionType] || 60;
}
