/**
 * POST /api/genesis/checkout
 * Creates Stripe Checkout Session for Genesis tier purchase
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { STRIPE_CONFIG, getTierConfig, TierName } from '@/lib/stripe/config';

const stripe = new Stripe(STRIPE_CONFIG.secretKey, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tier, nodeId, email, name } = body;

    // Validate tier
    if (!tier || !['seed', 'grove', 'forest'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be: seed, grove, or forest' },
        { status: 400 }
      );
    }

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const tierConfig = getTierConfig(tier as TierName);

    // Check if price ID is configured
    if (!tierConfig.priceId) {
      console.error(`[GENESIS CHECKOUT] Missing Stripe Price ID for tier: ${tier}`);
      return NextResponse.json(
        { error: 'Payment system not fully configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      client_reference_id: nodeId || undefined, // Link to node if provided
      line_items: [
        {
          price: tierConfig.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        tier,
        nodeId: nodeId || '',
        customerName: name || '',
      },
      success_url: `${request.nextUrl.origin}/genesis-soullab-life/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/genesis-soullab-life/checkout?tier=${tier}`,
      billing_address_collection: 'auto',
      allow_promotion_codes: true, // Enable promo codes
    });

    console.log('[GENESIS CHECKOUT] Session created:', {
      sessionId: session.id,
      tier,
      amount: tierConfig.price,
      email,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    console.error('[GENESIS CHECKOUT] Failed to create session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error?.message },
      { status: 500 }
    );
  }
}
