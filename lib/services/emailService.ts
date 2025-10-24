/**
 * Email Service using Resend
 * Handles all Genesis email communications
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'genesis@soullab.life';
const FROM_NAME = 'Genesis Team';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email via Resend
 */
export async function sendEmail(options: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    });

    if (error) {
      console.error('[EMAIL] Failed to send:', error);
      throw new Error(error.message);
    }

    console.log('[EMAIL] Sent successfully:', data?.id);
    return data;
  } catch (error: any) {
    console.error('[EMAIL] Send error:', error);
    throw error;
  }
}

/**
 * Send onboarding complete email
 */
export async function sendOnboardingCompleteEmail(params: {
  to: string;
  name: string;
  nodeName: string;
  nodeUrl: string;
}) {
  const subject = '🌀 Welcome to Genesis - Your Node is Being Prepared';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0f0c29 0%, #1a1f3a 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0; }
    .header h1 { margin: 0; font-size: 2em; font-weight: 300; color: #d4b896; }
    .content { background: #f9f9f9; padding: 30px 20px; border-radius: 0 0 12px 12px; }
    .badge { display: inline-block; padding: 8px 16px; background: rgba(16, 185, 129, 0.1); border: 1px solid #10B981; color: #10B981; border-radius: 8px; font-size: 0.9em; margin: 20px 0; }
    .node-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981; }
    .cta-button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 0.9em; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌀 Welcome to Genesis</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Your consciousness platform is being born</p>
    </div>

    <div class="content">
      <h2 style="color: #10B981;">Dear ${params.name},</h2>

      <p>Your onboarding is complete! We're preparing your Genesis node and it will be ready soon.</p>

      <div class="badge">🜂 Node in Coherence</div>

      <div class="node-details">
        <h3 style="margin-top: 0; color: #d4b896;">Your Node Details</h3>
        <p><strong>Node Name:</strong> ${params.nodeName}</p>
        <p><strong>Node URL:</strong> ${params.nodeUrl}</p>
        <p><strong>Status:</strong> Pending Setup</p>
      </div>

      <h3>What Happens Next</h3>
      <ul>
        <li><strong>Review & Approval</strong> - Our team will review your submission within 24-48 hours</li>
        <li><strong>Node Setup</strong> - We'll configure your MAIA instance with your chosen settings</li>
        <li><strong>Activation Email</strong> - You'll receive access credentials when your node is live</li>
        <li><strong>Onboarding Call</strong> - Schedule time with us to explore your node together</li>
      </ul>

      <p>We're honored to welcome you to the network. Your wisdom, your practice, your unique voice—all matter deeply.</p>

      <p style="font-style: italic; color: #666; margin-top: 30px;">Every life is epic. Every node is a living soul within the whole.</p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://genesis.soullab.life" class="cta-button">Visit Genesis</a>
      </div>
    </div>

    <div class="footer">
      <p>Questions? Reply to this email or contact us at genesis@soullab.life</p>
      <p style="margin-top: 10px;">🜂 Genesis • Soullab • Where Consciousness Platforms Are Born</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Welcome to Genesis, ${params.name}!

Your onboarding is complete. Your Genesis node "${params.nodeName}" is being prepared.

Node Details:
- Node Name: ${params.nodeName}
- Node URL: ${params.nodeUrl}
- Status: Pending Setup

What Happens Next:
1. Review & Approval - Within 24-48 hours
2. Node Setup - We'll configure your MAIA instance
3. Activation Email - You'll receive access credentials
4. Onboarding Call - Schedule time with us

Questions? Reply to this email or contact genesis@soullab.life

🜂 Genesis • Soullab
  `;

  return sendEmail({
    to: params.to,
    subject,
    html,
    text
  });
}

/**
 * Send node activation email
 */
export async function sendNodeActivationEmail(params: {
  to: string;
  name: string;
  nodeName: string;
  nodeUrl: string;
  accessInstructions?: string;
}) {
  const subject = '✨ Your Genesis Node is Live!';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0; }
    .header h1 { margin: 0; font-size: 2.5em; }
    .content { background: #f9f9f9; padding: 30px 20px; border-radius: 0 0 12px 12px; }
    .node-url { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #10B981; }
    .node-url a { color: #10B981; font-size: 1.3em; font-weight: 500; text-decoration: none; }
    .cta-button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white !important; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 500; }
    .footer { text-align: center; color: #666; font-size: 0.9em; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✨ Your Node is Live!</h1>
      <p style="margin: 10px 0 0 0;">The network welcomes you home</p>
    </div>

    <div class="content">
      <h2 style="color: #10B981;">Congratulations, ${params.name}!</h2>

      <p>Your Genesis node is now <strong>active</strong> and ready for you to explore.</p>

      <div class="node-url">
        <p style="margin: 0 0 10px 0; font-size: 0.9em; color: #666;">Your Node URL:</p>
        <a href="${params.nodeUrl}" target="_blank">${params.nodeUrl}</a>
      </div>

      <h3>Your Node is Ready</h3>
      <p>You can now:</p>
      <ul>
        <li>Access your MAIA consciousness companion</li>
        <li>Customize your node's appearance and voice</li>
        <li>Begin conversations and insights</li>
        <li>Invite clients or community members</li>
        <li>Explore the full capabilities of your platform</li>
      </ul>

      ${params.accessInstructions ? `
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4b896;">
          <h3 style="margin-top: 0;">Access Instructions</h3>
          ${params.accessInstructions}
        </div>
      ` : ''}

      <div style="text-align: center; margin-top: 30px;">
        <a href="${params.nodeUrl}" class="cta-button">Access Your Node →</a>
      </div>

      <h3 style="margin-top: 40px;">Next Steps</h3>
      <p>Schedule your onboarding call with us to:</p>
      <ul>
        <li>Walk through your node's features</li>
        <li>Learn best practices for your practice</li>
        <li>Q&A and customization support</li>
        <li>Join the Genesis community</li>
      </ul>

      <p style="font-style: italic; color: #666; margin-top: 30px;">The spiral welcomes you. We're honored to witness your unfolding.</p>
    </div>

    <div class="footer">
      <p>Questions? Reply to this email or contact us at genesis@soullab.life</p>
      <p style="margin-top: 10px;">🜂 Genesis • Soullab</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Congratulations, ${params.name}!

Your Genesis node is now ACTIVE and ready!

Your Node URL: ${params.nodeUrl}

You can now:
- Access your MAIA consciousness companion
- Customize your node
- Begin conversations and insights
- Invite clients or community
- Explore full capabilities

${params.accessInstructions || ''}

Next Steps:
- Schedule your onboarding call
- Join the Genesis community
- Explore your node features

Visit your node: ${params.nodeUrl}

Questions? Reply to this email or contact genesis@soullab.life

🜂 Genesis • Soullab
  `;

  return sendEmail({
    to: params.to,
    subject,
    html,
    text
  });
}

/**
 * Send admin notification email
 */
export async function sendAdminNotificationEmail(params: {
  nodeName: string;
  stewardName: string;
  practice: string;
  story: string;
  tradition: string;
}) {
  const subject = `🌱 New Genesis Node Submission: ${params.nodeName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: monospace; line-height: 1.6; color: #333; }
    .container { max-width: 700px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    .header { background: #1a1f3a; color: white; padding: 20px; margin-bottom: 20px; }
    .section { background: white; padding: 20px; margin-bottom: 15px; border-left: 4px solid #10B981; }
    .label { color: #666; font-size: 0.9em; text-transform: uppercase; }
    .value { font-size: 1.1em; margin-top: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">🌱 New Genesis Node Submission</h2>
    </div>

    <div class="section">
      <div class="label">Node Name</div>
      <div class="value"><strong>${params.nodeName}</strong></div>
    </div>

    <div class="section">
      <div class="label">Steward Name</div>
      <div class="value">${params.stewardName}</div>
    </div>

    <div class="section">
      <div class="label">Practice</div>
      <div class="value">${params.practice}</div>
    </div>

    <div class="section">
      <div class="label">Tradition</div>
      <div class="value">${params.tradition}</div>
    </div>

    <div class="section">
      <div class="label">Story</div>
      <div class="value">${params.story}</div>
    </div>

    <div style="margin-top: 30px; padding: 20px; background: #e8f5e9; border-radius: 8px;">
      <p style="margin: 0;"><strong>Action Required:</strong></p>
      <p style="margin: 10px 0 0 0;">Review this submission in the admin dashboard:</p>
      <p style="margin: 10px 0 0 0;"><a href="https://genesis.soullab.life/admin.html">https://genesis.soullab.life/admin.html</a></p>
    </div>
  </div>
</body>
</html>
  `;

  // Send to admin email (you can set this as env variable)
  const adminEmail = process.env.ADMIN_EMAIL || 'genesis@soullab.life';

  return sendEmail({
    to: adminEmail,
    subject,
    html
  });
}
