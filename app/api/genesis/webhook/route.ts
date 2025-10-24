/**
 * POST /api/genesis/webhook
 * Stripe webhook handler for Genesis payments
 * Processes checkout.session.completed events
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { STRIPE_CONFIG } from '@/lib/stripe/config';

const stripe = new Stripe(STRIPE_CONFIG.secretKey, {
  apiVersion: '2024-11-20.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('[GENESIS WEBHOOK] Missing stripe-signature header');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_CONFIG.webhookSecret
    );
  } catch (err: any) {
    console.error('[GENESIS WEBHOOK] Signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  console.log('[GENESIS WEBHOOK] Event received:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`[GENESIS WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('[GENESIS WEBHOOK] Error processing event:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error?.message },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('[GENESIS WEBHOOK] Checkout completed:', session.id);

  const tier = session.metadata?.tier;
  const nodeId = session.metadata?.nodeId;
  const customerEmail = session.customer_email || session.customer_details?.email;
  const customerName = session.metadata?.customerName || session.customer_details?.name;

  if (!tier) {
    console.error('[GENESIS WEBHOOK] Missing tier in session metadata');
    return;
  }

  // Create payment record
  const { data: payment, error: paymentError } = await supabase
    .from('genesis_payments')
    .insert({
      node_id: nodeId || null,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      stripe_customer_id: session.customer as string,
      amount_cents: session.amount_total || 0,
      currency: session.currency || 'usd',
      tier,
      status: 'succeeded',
      payment_method_type: 'card',
      customer_email: customerEmail,
      customer_name: customerName,
      paid_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (paymentError) {
    console.error('[GENESIS WEBHOOK] Failed to create payment record:', paymentError);
    return;
  }

  console.log('[GENESIS WEBHOOK] Payment record created:', payment.id);

  // Update node tier if nodeId is provided
  if (nodeId) {
    const { error: nodeError } = await supabase
      .from('genesis_nodes')
      .update({ tier })
      .eq('id', nodeId);

    if (nodeError) {
      console.error('[GENESIS WEBHOOK] Failed to update node tier:', nodeError);
    } else {
      console.log(`[GENESIS WEBHOOK] Node ${nodeId} upgraded to tier: ${tier}`);

      // Log event
      await supabase.from('genesis_events').insert({
        node_id: nodeId,
        event_type: 'tier_upgraded',
        event_data: {
          tier,
          payment_id: payment.id,
          amount: session.amount_total,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  // TODO: Send payment confirmation email
  // TODO: Trigger node activation workflow if not already active
}

/**
 * Handle payment intent succeeded
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('[GENESIS WEBHOOK] Payment succeeded:', paymentIntent.id);

  // Update payment status if exists
  const { error } = await supabase
    .from('genesis_payments')
    .update({
      status: 'succeeded',
      paid_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  if (error) {
    console.error('[GENESIS WEBHOOK] Failed to update payment status:', error);
  }
}

/**
 * Handle payment intent failed
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('[GENESIS WEBHOOK] Payment failed:', paymentIntent.id);

  // Update payment status if exists
  const { error } = await supabase
    .from('genesis_payments')
    .update({ status: 'failed' })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  if (error) {
    console.error('[GENESIS WEBHOOK] Failed to update payment status:', error);
  }
}

// Disable body parsing for webhook signature verification
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
