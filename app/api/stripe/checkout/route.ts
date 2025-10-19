import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

/**
 * Stripe Checkout Session Creator
 *
 * Accepts tier and billing period, creates Stripe checkout session,
 * returns URL to redirect user to Stripe hosted checkout.
 */
export async function POST(req: NextRequest) {
  try {
    const { tier, billingPeriod, userId, userEmail } = await req.json();

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
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
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
