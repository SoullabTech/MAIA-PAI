import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Helper function to slugify name for invite code
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to format date for email
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

// Helper function to send email (using Resend or SendGrid)
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn('RESEND_API_KEY not configured - skipping email send');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Soullab Foundation <partnerships@soullab.life>',
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Email send failed: ${error}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: String(error) };
  }
}

// Helper function to send Slack notification
async function notifySlack({
  text,
  blocks,
}: {
  text: string;
  blocks?: any[];
}) {
  const webhookUrl = process.env.SLACK_WEBHOOK_PARTNERS;

  if (!webhookUrl) {
    console.warn('SLACK_WEBHOOK_PARTNERS not configured - skipping Slack notification');
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, blocks }),
    });
  } catch (error) {
    console.error('Slack notification error:', error);
  }
}

/**
 * POST /api/partners/send-invite
 *
 * Creates partner invite record and sends Prelude email
 *
 * Request body:
 * {
 *   name: string,
 *   email: string,
 *   project_name: string,
 *   element_mix: string,
 *   meeting_date: string (ISO 8601),
 *   sent_from: string,
 *   internal_notes?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Generate invite code from name
    const inviteCode = slugify(body.name);
    const nameParts = body.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || null;

    // Create invite record
    const { data: invite, error: insertError } = await supabase
      .from('partners_invites')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: body.email,
        invite_code: inviteCode,
        project_name: body.project_name || null,
        element_mix: body.element_mix || null,
        meeting_date: body.meeting_date || null,
        sent_from: body.sent_from || 'API',
        internal_notes: body.internal_notes || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create invite', details: insertError.message },
        { status: 500 }
      );
    }

    // Generate Prelude URL
    const preludeUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://soullab.life'}/partners/onboarding/prelude?invite=${inviteCode}`;

    // Send Prelude email
    const emailHtml = `
      <div style="font-family: 'Spectral', serif; color: #F8F3E9; background-color: #1B1F33; padding: 40px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #E3B778; text-align: center; font-size: 32px; margin-bottom: 10px;">Soullab Inside</h1>
        <p style="text-align: center; color: #B5A8C1; font-style: italic; margin-bottom: 30px;">We build digital spaces that listen.</p>

        <p>Hi ${firstName},</p>

        <p>We're honored to begin sensing your field together.</p>

        <p>Before our conversation, we invite you into a short reflection —
        the <strong>Soullab Inside Partner Prelude</strong>.</p>

        <p>It moves through the five elements — Fire, Water, Earth, Air, and Aether —
        to help us hear what your project most wants to become.</p>

        <ul style="list-style: none; padding: 0; margin: 20px 0;">
          <li style="margin: 8px 0;">🜂 Fire — what's calling to be built</li>
          <li style="margin: 8px 0;">🜄 Water — why this work matters</li>
          <li style="margin: 8px 0;">🜃 Earth — how it will take form</li>
          <li style="margin: 8px 0;">🜁 Air — what experience it offers</li>
          <li style="margin: 8px 0;">🜀 Aether — what it <em>is</em> when complete</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${preludeUrl}" style="display: inline-block; padding: 15px 30px; background-color: rgba(227, 183, 120, 0.2); border: 2px solid #E3B778; border-radius: 8px; color: #E3B778; text-decoration: none; font-weight: bold; font-size: 16px;">
            Open Your Prelude
          </a>
        </div>

        <p style="font-size: 14px; color: #B5A8C1; line-height: 1.6;">
          No rush, no right answers — fragments and feelings are perfect.<br/>
          Your reflections flow privately into your workspace so we can<br/>
          begin our design conversation with listening, not logistics.
        </p>

        <hr style="border: none; border-top: 1px solid rgba(227, 183, 120, 0.3); margin: 30px 0;" />

        ${body.project_name ? `<p style="font-size: 14px; color: #B5A8C1;"><strong>Your Project:</strong> ${body.project_name}</p>` : ''}
        ${body.element_mix ? `<p style="font-size: 14px; color: #B5A8C1;"><strong>Your Elemental Current:</strong> ${body.element_mix}</p>` : ''}
        ${body.meeting_date ? `<p style="font-size: 14px; color: #B5A8C1;"><strong>Meeting Date:</strong> ${formatDate(body.meeting_date)}</p>` : ''}

        <p style="font-size: 14px; font-style: italic; color: #B5A8C1; margin-top: 30px;">
          Thank you for stepping into this first circle of Soullab Inside.<br/>
          We're shaping technology that honors the work you already hold.
        </p>

        <p style="margin-top: 30px; font-size: 14px;">
          With care,<br/>
          <strong>The Soullab Foundation</strong><br/>
          <a href="https://soullab.life/partners" style="color: #E3B778; text-decoration: none;">soullab.life/partners</a>
        </p>
      </div>
    `;

    await sendEmail({
      to: body.email,
      subject: '✨ Your Soullab Inside Prelude — Preparing the Field',
      html: emailHtml,
    });

    // Update invite status to 'sent'
    await supabase
      .from('partners_invites')
      .update({
        invite_status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', invite.id);

    // Notify Slack
    await notifySlack({
      text: `🌱 Soullab Inside invite sent to *${body.name}*`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*🌱 New Soullab Inside Invite Sent*\n\n*Partner:* ${body.name}\n*Email:* ${body.email}\n*Project:* ${body.project_name || 'Not specified'}\n*Element:* ${body.element_mix || 'Not specified'}\n*Meeting:* ${body.meeting_date ? formatDate(body.meeting_date) : 'Not scheduled'}\n\n<${preludeUrl}|View Prelude Link>`,
          },
        },
      ],
    });

    return NextResponse.json({
      success: true,
      invite_id: invite.id,
      invite_code: inviteCode,
      prelude_url: preludeUrl,
      message: 'Invite sent successfully',
    });

  } catch (error) {
    console.error('Send invite error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
