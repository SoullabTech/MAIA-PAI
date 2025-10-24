import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('email', normalizedEmail)
      .single();

    if (existing) {
      return NextResponse.json(
        { message: 'Already subscribed!', alreadySubscribed: true },
        { status: 200 }
      );
    }

    // Add to newsletter
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: normalizedEmail,
        source: source || 'publishing_page',
        subscribed_at: new Date().toISOString(),
        status: 'active'
      });

    if (insertError) {
      console.error('Newsletter signup error:', insertError);
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      );
    }

    // Send welcome email (optional - integrate with Resend if available)
    try {
      await sendWelcomeEmail(normalizedEmail);
    } catch (emailError) {
      console.error('Welcome email error:', emailError);
      // Don't fail the signup if email fails
    }

    return NextResponse.json({
      message: 'Successfully subscribed!',
      email: normalizedEmail
    });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

async function sendWelcomeEmail(email: string) {
  // Check if Resend is configured
  if (!process.env.RESEND_API_KEY) {
    console.log('Resend not configured, skipping welcome email');
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'Soullab Publishing <publishing@soullab.life>',
      to: email,
      subject: 'Welcome to Soullab Publishing',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Lato', system-ui, sans-serif;
                background: #0a0a0a;
                color: #ffffff;
                padding: 40px 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background: linear-gradient(135deg, #a9472415 0%, #cea22c15 100%);
                border: 1px solid #cea22c30;
                border-radius: 16px;
                padding: 40px;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .title {
                color: #cea22c;
                font-size: 32px;
                font-weight: 300;
                margin-bottom: 10px;
              }
              .content {
                color: #cccccc;
                line-height: 1.6;
                margin-bottom: 30px;
              }
              .cta {
                text-align: center;
                margin: 40px 0;
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #a94724, #cea22c);
                color: white;
                padding: 16px 32px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 500;
              }
              .footer {
                text-align: center;
                color: #777777;
                font-size: 12px;
                margin-top: 40px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 class="title">Welcome to Soullab Publishing</h1>
              </div>

              <div class="content">
                <p>Thank you for joining our community of consciousness explorers.</p>

                <p>You're now on the list to receive:</p>
                <ul>
                  <li>Early access to new book releases</li>
                  <li>Exclusive pre-order discounts</li>
                  <li>Bonus content and practices</li>
                  <li>Invitations to author events and workshops</li>
                </ul>

                <p>Our first title, <strong>Elemental Alchemy</strong>, is available for pre-order now.
                Pre-order customers receive exclusive benefits including a signed copy, early access content,
                and lifetime discounts on future titles.</p>
              </div>

              <div class="cta">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/publishing" class="button">
                  Explore Our Catalog
                </a>
              </div>

              <div class="footer">
                <p>Soullab Publishing | Awakening Consciousness Through Words</p>
                <p>You can unsubscribe at any time by clicking <a href="${process.env.NEXT_PUBLIC_APP_URL}/publishing/unsubscribe?email=${encodeURIComponent(email)}" style="color: #cea22c;">here</a>.</p>
              </div>
            </div>
          </body>
        </html>
      `
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }
}
