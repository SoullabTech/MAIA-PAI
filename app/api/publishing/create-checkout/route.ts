import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
});

export async function POST(req: NextRequest) {
  try {
    const { bookId, format, quantity, amount } = await req.json();

    // Validate input
    if (!bookId || !format || !quantity || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Book details
    const bookDetails = {
      'elemental-alchemy': {
        name: 'Elemental Alchemy: A Journey Through Fire, Air, Water, and Earth',
        description: 'Transform your consciousness through ancient elemental wisdom',
        images: ['https://genesis.soullab.life/book-cover.jpg']
      }
    };

    const book = bookDetails[bookId as keyof typeof bookDetails];
    if (!book) {
      return NextResponse.json(
        { error: 'Invalid book ID' },
        { status: 400 }
      );
    }

    // Format labels
    const formatLabels = {
      digital: 'Digital Edition (PDF + ePub)',
      hardcover: 'Hardcover Premium Edition',
      both: 'Complete Bundle (Digital + Hardcover)'
    };

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: book.name,
              description: `${formatLabels[format as keyof typeof formatLabels]} - ${book.description}`,
              images: book.images
            },
            unit_amount: Math.round(amount / quantity * 100) // Convert to cents
          },
          quantity
        }
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/publishing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/publishing/purchase`,
      metadata: {
        bookId,
        format,
        quantity: quantity.toString()
      },
      // Collect customer info
      billing_address_collection: 'required',
      shipping_address_collection: format === 'hardcover' || format === 'both' ? {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'CH', 'AT', 'IE', 'NZ']
      } : undefined,
      phone_number_collection: {
        enabled: true
      },
      // Add pre-order note
      custom_text: {
        submit: {
          message: 'Pre-order - Expected delivery Spring 2026. You will not be charged until the book ships.'
        }
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
