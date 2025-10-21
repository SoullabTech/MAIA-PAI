import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Helper function to format date
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

// Helper function to send email
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
 * POST /api/partners/submit-prelude
 *
 * Saves Partner Prelude responses and triggers notifications
 *
 * Request body:
 * {
 *   inviteCode: string,
 *   name: string,
 *   email: string,
 *   [all prelude question responses],
 *   chatMessages?: array
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
    if (!body.inviteCode || !body.name || !body.email) {
      return NextResponse.json(
        { error: 'inviteCode, name, and email are required' },
        { status: 400 }
      );
    }

    // Get invite record
    const { data: invite, error: inviteError } = await supabase
      .from('partners_invites')
      .select('*')
      .eq('invite_code', body.inviteCode)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json(
        { error: 'Invite not found' },
        { status: 404 }
      );
    }

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Save prelude response
    const { data: response, error: responseError } = await supabase
      .from('partners_prelude_responses')
      .insert({
        invite_id: invite.id,
        invite_code: body.inviteCode,
        name: body.name,
        email: body.email,

        // Fire - The If
        what_is_calling: body.whatIsCalling || null,
        what_does_it_change: body.whatDoesItChange || null,
        pulse_or_temperature: body.pulseOrTemperature || null,

        // Water - The Why
        why_must_exist: body.whyMustExist || null,
        what_is_ready_to_flow: body.whatIsReadyToFlow || null,
        who_enters_and_feels: body.whoEntersAndFeels || null,

        // Earth - The How
        grounded_tech_meaning: body.groundedTechMeaning || null,
        functions_needed: body.functionsNeeded || null,
        sustaining_resources: body.sustainingResources || null,

        // Air - The What
        voice_it_speaks: body.voiceItSpeaks || null,
        conversation_type: body.conversationType || null,
        form_it_takes: body.formItTakes || null,

        // Aether - The Is
        what_is_it: body.whatIsIt || null,
        presence_it_carries: body.presenceItCarries || null,
        how_know_alive: body.howKnowAlive || null,

        // Closing
        cosmos_line: body.cosmosLine || null,

        // Metadata
        chat_messages: body.chatMessages || [],
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (responseError) {
      console.error('Failed to save prelude response:', responseError);
      return NextResponse.json(
        { error: 'Failed to save response', details: responseError.message },
        { status: 500 }
      );
    }

    // Update invite status to 'completed'
    await supabase
      .from('partners_invites')
      .update({
        invite_status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', invite.id);

    // Send notification to Kelly
    const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://soullab.life'}/admin/partners/prelude/${response.id}`;

    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'kelly@soullab.life',
      subject: `✨ Partner Prelude Completed: ${body.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #E3B778;">Prelude Completed</h2>

          <p><strong>${body.name}</strong> has completed their Soullab Inside Prelude.</p>

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Project:</strong> ${invite.project_name || 'Not specified'}</p>
            <p style="margin: 5px 0;"><strong>Element:</strong> ${invite.element_mix || 'Not specified'}</p>
            <p style="margin: 5px 0;"><strong>Meeting:</strong> ${invite.meeting_date ? formatDate(invite.meeting_date) : 'Not scheduled'}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${body.email}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${adminUrl}" style="display: inline-block; padding: 12px 24px; background-color: #E3B778; color: #1B1F33; text-decoration: none; border-radius: 6px; font-weight: bold;">
              View Full Responses
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;"/>

          <h3>Preparation Notes</h3>
          <p>Review their responses before the listening session. Pay attention to:</p>
          <ul>
            <li><strong>Fire section</strong> (what's calling) - the impulse and urgency</li>
            <li><strong>Aether section</strong> (what it IS) - the essence beyond function</li>
            <li>Recurring themes across elements</li>
            <li>What they circle back to multiple times</li>
            ${body.chatMessages && body.chatMessages.length > 0 ? `<li><strong>MAIA chat</strong> - ${body.chatMessages.length} messages (shows areas of uncertainty)</li>` : ''}
          </ul>

          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            <em>This is ceremony, not client intake. Listen for truth, not completion.</em>
          </p>
        </div>
      `,
    });

    // Notify Slack
    await notifySlack({
      text: `💫 Partner Prelude completed by ${body.name}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*💫 Partner Prelude Completed*\n\n*Partner:* ${body.name}\n*Email:* ${body.email}\n*Project:* ${invite.project_name || 'Not specified'}\n*Element:* ${invite.element_mix || 'Not specified'}\n*Meeting:* ${invite.meeting_date ? formatDate(invite.meeting_date) : 'Not scheduled'}\n${body.chatMessages && body.chatMessages.length > 0 ? `*MAIA Chat:* ${body.chatMessages.length} messages\n` : ''}\n<${adminUrl}|View Full Responses>`,
          },
        },
      ],
    });

    return NextResponse.json({
      success: true,
      response_id: response.id,
      invite_id: invite.id,
      message: 'Prelude submitted successfully',
    });

  } catch (error) {
    console.error('Submit prelude error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
