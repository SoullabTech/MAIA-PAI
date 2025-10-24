/**
 * Verify Stripe Checkout Session
 *
 * Returns session details after successful checkout
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia'
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      session: {
        id: session.id,
        customer: session.customer,
        subscription: session.subscription,
        amount_total: session.amount_total,
        currency: session.currency
      }
    });

  } catch (error: any) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { error: 'Failed to verify session', details: error.message },
      { status: 500 }
    );
  }
}
