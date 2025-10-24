/**
 * Create Stripe Checkout Session
 *
 * Handles subscription checkout for Explorer and Practitioner tiers
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia'
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const { tier, billingPeriod, userId } = await request.json();

    if (!tier || !billingPeriod) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get price ID based on tier and billing period
    const priceId = getPriceId(tier, billingPeriod);

    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid tier or billing period' },
        { status: 400 }
      );
    }

    // Get or create customer
    let customerId: string | undefined;
    let customerEmail: string | undefined;

    if (userId) {
      const { data: user } = await supabase
        .from('explorers')
        .select('stripe_customer_id, email')
        .eq('explorer_id', userId)
        .single();

      if (user) {
        customerId = user.stripe_customer_id;
        customerEmail = user.email;
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      customer: customerId,
      customer_email: !customerId ? customerEmail : undefined,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscription/pricing`,
      metadata: {
        userId: userId || '',
        tier,
        billingPeriod
      },
      subscription_data: {
        metadata: {
          userId: userId || '',
          tier
        },
        trial_period_days: tier === 'explorer' ? 14 : 0 // 14-day trial for Explorer
      }
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id
    });

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Get Stripe price ID based on tier and billing period
 */
function getPriceId(tier: string, billingPeriod: string): string | null {
  const priceMap: Record<string, string> = {
    // Monthly prices
    'explorer_monthly': process.env.STRIPE_PRICE_EXPLORER_MONTHLY || '',
    'practitioner_monthly': process.env.STRIPE_PRICE_PRACTITIONER_MONTHLY || '',
    'studio_monthly': process.env.STRIPE_PRICE_STUDIO_MONTHLY || '',

    // Annual prices
    'explorer_annual': process.env.STRIPE_PRICE_EXPLORER_ANNUAL || '',
    'practitioner_annual': process.env.STRIPE_PRICE_PRACTITIONER_ANNUAL || '',
    'studio_annual': process.env.STRIPE_PRICE_STUDIO_ANNUAL || ''
  };

  const key = `${tier}_${billingPeriod}`;
  return priceMap[key] || null;
}
