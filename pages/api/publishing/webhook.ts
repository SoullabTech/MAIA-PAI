import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('[PUBLISHING WEBHOOK] Signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log('[PUBLISHING WEBHOOK] Received event:', event.type);

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
        console.log('[PUBLISHING WEBHOOK] Unhandled event type:', event.type);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('[PUBLISHING WEBHOOK] Error processing event:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('[PUBLISHING WEBHOOK] Checkout completed:', session.id);

  const metadata = session.metadata || {};
  const { format, workId, workName, customerName, isMember } = metadata;

  if (metadata.purchaseType !== 'publishing') {
    console.log('[PUBLISHING WEBHOOK] Not a publishing purchase, skipping');
    return;
  }

  const amountTotal = session.amount_total || 0;
  const customerEmail = session.customer_email || session.customer_details?.email || '';

  // Calculate royalty split
  // Platform fee: 5%, Production cost depends on format
  const platformFeePercent = 5;
  const platformFeeCents = Math.round(amountTotal * (platformFeePercent / 100));

  // Production costs (approximate)
  const productionCosts: Record<string, number> = {
    ebook: 0, // Digital has no production cost
    audiobook: 0,
    paperback: 600, // ~$6 printing + shipping
    hardcover: 800, // ~$8 printing + shipping
    bundle: 600, // Just print cost, digital is free
  };

  const productionCostCents = productionCosts[format] || 0;

  // Creator royalty = Total - Platform Fee - Production Cost
  const creatorRoyaltyCents = Math.max(
    0,
    amountTotal - platformFeeCents - productionCostCents
  );

  try {
    // Record sale in database
    const { data: sale, error: saleError } = await supabase
      .from('soullab_sales')
      .insert({
        // work_id will be null for now until we properly create works
        // We'll add this when we create the work record
        work_id: null, // TODO: Link to actual work when created
        format_id: null, // TODO: Link to format when created
        customer_email: customerEmail,
        customer_name: customerName,
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_checkout_session_id: session.id,
        list_price_cents: amountTotal,
        sale_price_cents: amountTotal,
        discount_cents: 0,
        platform_fee_cents: platformFeeCents,
        production_cost_cents: productionCostCents,
        creator_royalty_cents: creatorRoyaltyCents,
        tax_cents: 0,
        total_charged_cents: amountTotal,
        currency: 'usd',
        fulfillment_status: format === 'ebook' || format === 'audiobook' || format === 'bundle'
          ? 'access_granted' // Digital products
          : 'pending', // Physical products need POD fulfillment
        purchased_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (saleError) {
      console.error('[PUBLISHING WEBHOOK] Error recording sale:', saleError);
      throw saleError;
    }

    console.log('[PUBLISHING WEBHOOK] Sale recorded:', {
      saleId: sale.id,
      format,
      amount: amountTotal,
      platformFee: platformFeeCents,
      productionCost: productionCostCents,
      creatorRoyalty: creatorRoyaltyCents,
    });

    // TODO: Send purchase confirmation email
    // TODO: Generate download link for digital products
    // TODO: Submit print order to IngramSpark for physical products

    console.log('[PUBLISHING WEBHOOK] Checkout completed successfully');
  } catch (error) {
    console.error('[PUBLISHING WEBHOOK] Error processing checkout:', error);
    throw error;
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('[PUBLISHING WEBHOOK] Payment succeeded:', paymentIntent.id);

  // Update sale status if needed
  const { error } = await supabase
    .from('soullab_sales')
    .update({
      fulfillment_status: 'processing',
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .eq('fulfillment_status', 'pending');

  if (error) {
    console.error('[PUBLISHING WEBHOOK] Error updating sale status:', error);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('[PUBLISHING WEBHOOK] Payment failed:', paymentIntent.id);

  // Update sale status
  const { error } = await supabase
    .from('soullab_sales')
    .update({
      fulfillment_status: 'failed',
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  if (error) {
    console.error('[PUBLISHING WEBHOOK] Error updating failed payment:', error);
  }
}
