import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { sessionId, messages, intakeData, recipientEmail } = await request.json();

    // Format the conversation for email
    const conversationHtml = messages
      .map((msg: any) => {
        const role = msg.role === 'assistant' ? 'MAIA' : intakeData.clientName || 'Client';
        const bgColor = msg.role === 'assistant' ? '#f3f4f6' : '#dbeafe';
        return `
          <div style="margin: 20px 0; padding: 15px; background: ${bgColor}; border-radius: 8px;">
            <strong style="color: #1f2937;">${role}:</strong>
            <p style="margin: 10px 0 0 0; color: #374151; white-space: pre-wrap;">${msg.content}</p>
            <small style="color: #6b7280;">${new Date(msg.timestamp).toLocaleString()}</small>
          </div>
        `;
      })
      .join('');

    // Format structured data
    const structuredDataHtml = `
      <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #78350f; margin-top: 0;">Structured Data Extracted</h2>

        <div style="margin: 15px 0;">
          <h3 style="color: #92400e;">Business Information</h3>
          <p><strong>Business Name:</strong> ${intakeData.businessName || 'Not provided'}</p>
          <p><strong>Client Name:</strong> ${intakeData.clientName || 'Not provided'}</p>
          <p><strong>Email:</strong> ${intakeData.email || 'Not provided'}</p>
          <p><strong>Website:</strong> ${intakeData.website || 'Not provided'}</p>
        </div>

        <div style="margin: 15px 0;">
          <h3 style="color: #92400e;">Business Model</h3>
          <p>${intakeData.businessModel?.join(', ') || 'Not provided'}</p>
        </div>

        <div style="margin: 15px 0;">
          <h3 style="color: #92400e;">Top Goals</h3>
          <ul>
            ${intakeData.topGoals?.map((goal: string) => `<li>${goal}</li>`).join('') || '<li>Not provided</li>'}
          </ul>
        </div>

        <div style="margin: 15px 0;">
          <h3 style="color: #92400e;">Unique Value Proposition</h3>
          <p>${intakeData.uniqueValue || 'Not provided'}</p>
        </div>

        <div style="margin: 15px 0;">
          <h3 style="color: #92400e;">Customer Personas</h3>
          <p><strong>Persona 1:</strong> ${intakeData.customers?.persona1 || 'Not provided'}</p>
          <p><strong>Persona 2:</strong> ${intakeData.customers?.persona2 || 'Not provided'}</p>
        </div>

        <div style="margin: 15px 0;">
          <h3 style="color: #92400e;">Products</h3>
          <p><strong>Total SKUs:</strong> ${intakeData.products?.totalSKUs || 'Not provided'}</p>
          <p><strong>Categories:</strong> ${intakeData.products?.categories?.join(', ') || 'Not provided'}</p>
          <p><strong>Price Range:</strong> $${intakeData.products?.priceRange?.low || '?'} - $${intakeData.products?.priceRange?.high || '?'} (avg: $${intakeData.products?.priceRange?.average || '?'})</p>
        </div>

        <div style="margin: 15px 0;">
          <h3 style="color: #92400e;">Desired Features</h3>
          <p><strong>Subscriptions:</strong> ${intakeData.features?.subscriptions || 'Not discussed'}</p>
          <p><strong>Personalization:</strong> ${intakeData.features?.personalization || 'Not discussed'}</p>
          <p><strong>Conversational AI:</strong> ${intakeData.features?.conversationalAI || 'Not discussed'}</p>
        </div>

        <div style="margin: 15px 0;">
          <h3 style="color: #92400e;">Budget & Timeline</h3>
          <p><strong>Budget:</strong> ${intakeData.budget || 'Not provided'}</p>
          <p><strong>Timeline:</strong> ${intakeData.timeline || 'Not provided'}</p>
        </div>

        <div style="margin: 15px 0;">
          <h3 style="color: #92400e;">Magic Wand Vision</h3>
          <p style="font-style: italic; color: #92400e;">"${intakeData.magicWand || 'Not provided'}"</p>
        </div>
      </div>
    `;

    // Send email to Kelly
    const { data, error } = await resend.emails.send({
      from: 'MAIA <noreply@soullab.org>',
      to: recipientEmail,
      subject: `New Soullab Inside Inquiry: ${intakeData.businessName || 'Unknown Business'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Soullab Inside Intake</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f9fafb;">
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h1 style="color: #6366f1; margin-top: 0;">New Soullab Inside Partnership Inquiry 🌿</h1>

            <p style="color: #374151; font-size: 16px;">
              MAIA just completed a discovery conversation with a new potential partner!
            </p>

            <div style="background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #3730a3;"><strong>Session ID:</strong> ${sessionId}</p>
              <p style="margin: 10px 0 0 0; color: #3730a3;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>

            ${structuredDataHtml}

            <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 30px 0;">

            <h2 style="color: #6366f1;">Full Conversation Transcript</h2>

            ${conversationHtml}

            <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 30px 0;">

            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
              <h3 style="color: #047857; margin-top: 0;">Next Steps</h3>
              <ol style="color: #065f46;">
                <li>Review the conversation and structured data above</li>
                <li>Create a custom proposal using the template</li>
                <li>Email the proposal to: <strong>${intakeData.email || '[email not provided]'}</strong></li>
                <li>Schedule a proposal review call within 3-5 days</li>
              </ol>
            </div>

            <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px; text-align: center;">
              <p style="color: #78350f; margin: 0;">
                <strong>💡 Proposal Tip:</strong> Reference their "magic wand" vision and weave it throughout the proposal. They shared something beautiful about their ideal experience—honor that.
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
            <p>Sent by MAIA, Soullab Inside Intake Agent</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    // Also send confirmation email to client
    if (intakeData.email) {
      await resend.emails.send({
        from: 'Kelly @ Soullab Inside <kelly@soullab.org>',
        to: intakeData.email,
        subject: 'Your Soullab Inside Discovery Conversation',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Thank You</title>
          </head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
            <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h1 style="color: #6366f1; margin-top: 0;">Thank you, ${intakeData.clientName || 'friend'}! 🌿</h1>

              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                I loved our conversation about ${intakeData.businessName}. ${intakeData.magicWand ? `Your vision of "${intakeData.magicWand.substring(0, 100)}..." is beautiful.` : ''}
              </p>

              <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h2 style="color: #3730a3; margin-top: 0; font-size: 18px;">What Happens Next</h2>
                <ol style="color: #4c1d95; line-height: 1.8;">
                  <li><strong>Review & Synthesis</strong> — I'll carefully review our entire conversation (1-2 days)</li>
                  <li><strong>Custom Proposal</strong> — I'll create a proposal specifically for ${intakeData.businessName} (2-3 days)</li>
                  <li><strong>Proposal Review Call</strong> — We'll walk through it together and refine (60 minutes)</li>
                </ol>
              </div>

              <p style="color: #374151; line-height: 1.6;">
                I'll be in touch within <strong>2-3 business days</strong> with your proposal.
              </p>

              <p style="color: #374151; line-height: 1.6;">
                Questions in the meantime? Just reply to this email. I read every message personally.
              </p>

              <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px;">
                <p style="color: #78350f; margin: 0; font-style: italic;">
                  "Your work is medicine. Technology should help you share it more deeply."
                </p>
              </div>

              <p style="color: #374151; margin-top: 30px;">
                Warmly,<br>
                <strong>Kelly</strong><br>
                <span style="color: #6b7280;">Soullab Inside</span>
              </p>
            </div>

            <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
              <p>kelly@soullab.org</p>
            </div>
          </body>
          </html>
        `,
      });
    }

    return NextResponse.json({ success: true, emailId: data?.id });

  } catch (error) {
    console.error('Error emailing intake:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
