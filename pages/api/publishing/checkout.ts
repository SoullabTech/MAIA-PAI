import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Price IDs for Elemental Alchemy formats
const PRICE_IDS = {
  ebook: process.env.STRIPE_PRICE_ELEMENTAL_EBOOK!,
  paperback: process.env.STRIPE_PRICE_ELEMENTAL_PAPERBACK!,
  hardcover: process.env.STRIPE_PRICE_ELEMENTAL_HARDCOVER!,
  audiobook: process.env.STRIPE_PRICE_ELEMENTAL_AUDIOBOOK!,
  bundle: process.env.STRIPE_PRICE_ELEMENTAL_BUNDLE!,
};

const WORK_METADATA = {
  workId: 'elemental-alchemy-001', // We'll insert this into DB later
  workName: 'Elemental Alchemy',
  author: 'Soullab',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { format, email, name, isMember = false } = req.body;

    // Validation
    if (!format || !email || !name) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['format', 'email', 'name'],
      });
    }

    // Validate format
    const validFormats = ['ebook', 'paperback', 'hardcover', 'audiobook', 'bundle'];
    if (!validFormats.includes(format)) {
      return res.status(400).json({
        error: 'Invalid format',
        validFormats,
      });
    }

    const priceId = PRICE_IDS[format as keyof typeof PRICE_IDS];
    if (!priceId) {
      return res.status(500).json({
        error: 'Price ID not configured',
        format,
      });
    }

    // Get price details from Stripe
    const price = await stripe.prices.retrieve(priceId);
    const unitAmount = price.unit_amount || 0;

    // Apply member discount (10% off)
    const discount = isMember ? Math.round(unitAmount * 0.1) : 0;
    const finalPrice = unitAmount - discount;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Apply discount if member
      ...(discount > 0 && {
        discounts: [
          {
            coupon: await getOrCreateMemberCoupon(),
          },
        ],
      }),
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/publishing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/publishing/elemental-alchemy`,
      metadata: {
        format,
        workId: WORK_METADATA.workId,
        workName: WORK_METADATA.workName,
        customerName: name,
        isMember: isMember ? 'true' : 'false',
        purchaseType: 'publishing',
      },
    });

    console.log('[PUBLISHING CHECKOUT] Created session:', {
      sessionId: session.id,
      format,
      email,
      isMember,
      price: unitAmount,
      discount,
      finalPrice,
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('[PUBLISHING CHECKOUT] Error:', error);
    return res.status(500).json({
      error: 'Failed to create checkout session',
      details: error.message,
    });
  }
}

// Helper: Get or create member discount coupon
async function getOrCreateMemberCoupon(): Promise<string> {
  const couponId = 'MEMBER_10';

  try {
    // Try to retrieve existing coupon
    await stripe.coupons.retrieve(couponId);
    return couponId;
  } catch (error: any) {
    if (error.code === 'resource_missing') {
      // Create coupon if it doesn't exist
      await stripe.coupons.create({
        id: couponId,
        name: 'Soullab Member Discount',
        percent_off: 10,
        duration: 'forever',
      });
      return couponId;
    }
    throw error;
  }
}
