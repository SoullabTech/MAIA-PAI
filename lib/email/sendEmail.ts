import { Resend } from 'resend';

function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

export interface EmailData {
  to: string | string[];  // Single email or array of emails
  subject: string;
  body: string;
  fromName?: string;
  tags?: { name: string; value: string }[];
}

/**
 * Send email via Resend
 * Used by GANESHA for automated email sending
 */
export async function sendEmail(emailData: EmailData) {
  try {
    const resend = getResendClient();

    // Convert single email to array for consistent handling
    const recipients = Array.isArray(emailData.to) ? emailData.to : [emailData.to];

    // Create HTML version with basic formatting
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .signature {
            margin-top: 30px;
            border-top: 1px solid #eee;
            padding-top: 15px;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${emailData.body.split('\n').map(line => `<p>${line}</p>`).join('')}
          <div class="signature">
            <p>Sent via GANESHA 🐘<br/>
            ${emailData.fromName || 'Soullab'}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text version
    const textBody = `${emailData.body}\n\n---\nSent via GANESHA 🐘\n${emailData.fromName || 'Soullab'}`;

    const result = await resend.emails.send({
      from: `${emailData.fromName || 'Soullab'} <onboarding@resend.dev>`,
      to: recipients,
      subject: emailData.subject,
      html: htmlBody,
      text: textBody,
      tags: emailData.tags || [
        { name: 'source', value: 'ganesha' },
        { name: 'automated', value: 'true' }
      ]
    });

    console.log(`✅ Email sent to ${recipients.join(', ')}:`, result.id);
    return {
      success: true,
      id: result.id,
      recipients,
      subject: emailData.subject
    };

  } catch (error: any) {
    console.error(`❌ Failed to send email:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send batch emails with delay between sends
 */
export async function sendBatchEmails(
  emails: EmailData[],
  delayMs: number = 2000
) {
  const results = [];

  for (const emailData of emails) {
    const result = await sendEmail(emailData);
    results.push({ ...emailData, ...result });

    // Delay between sends to respect rate limits
    if (delayMs > 0 && emails.indexOf(emailData) < emails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`\n📊 Batch complete: ${successful} sent, ${failed} failed`);

  return {
    total: emails.length,
    successful,
    failed,
    results
  };
}
