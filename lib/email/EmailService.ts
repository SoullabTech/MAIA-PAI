/**
 * Email Service
 *
 * Handles all transactional emails using Resend
 * Install: npm install resend
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates
const FROM_EMAIL = process.env.FROM_EMAIL || 'MAIA <hello@genesis.soullab.life>';

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

/**
 * Trial expiration warning email (sent 3 days before expiration)
 */
function getTrialExpiringTemplate(userName: string, daysLeft: number, trialEndDate: Date) {
  const formattedDate = trialEndDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return {
    subject: `Your MAIA trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              padding: 30px 0;
              border-bottom: 2px solid #f0f0f0;
            }
            .content {
              padding: 30px 0;
            }
            .cta-button {
              display: inline-block;
              background: #3b82f6;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
            }
            .benefits {
              background: #f9fafb;
              border-left: 4px solid #3b82f6;
              padding: 20px;
              margin: 20px 0;
            }
            .benefits li {
              margin: 10px 0;
            }
            .footer {
              text-align: center;
              padding-top: 30px;
              border-top: 2px solid #f0f0f0;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="color: #1f2937; margin: 0;">✨ MAIA</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0;">Personal Oracle & Transformation Guide</p>
          </div>

          <div class="content">
            <h2>Hi ${userName},</h2>

            <p>Your 14-day free trial of MAIA ends on <strong>${formattedDate}</strong> (${daysLeft} day${daysLeft === 1 ? '' : 's'} from now).</p>

            <p>We hope you've been enjoying the transformation journey! Here's what you'll keep with Explorer access:</p>

            <div class="benefits">
              <ul>
                <li>🗣️ <strong>Unlimited conversations</strong> with MAIA's wisdom</li>
                <li>🌟 <strong>Full birth chart integration</strong> for cosmic insights</li>
                <li>📝 <strong>Sacred Scribe+</strong> journal with AI insights</li>
                <li>🔮 <strong>Akashic Field</strong> access to collective wisdom</li>
                <li>🎯 <strong>Transformation tracking</strong> across all dimensions</li>
              </ul>
            </div>

            <p style="text-align: center;">
              <a href="https://genesis.soullab.life/subscription" class="cta-button">
                Continue with Explorer ($29/month)
              </a>
            </p>

            <p style="color: #6b7280; font-size: 14px;">
              Or downgrade to the free tier with 3 conversations per month. The choice is yours.
            </p>
          </div>

          <div class="footer">
            <p>Questions? Reply to this email or visit our help center.</p>
            <p style="margin-top: 10px;">
              <a href="https://genesis.soullab.life" style="color: #3b82f6; text-decoration: none;">genesis.soullab.life</a>
            </p>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${userName},\n\nYour 14-day free trial of MAIA ends on ${formattedDate} (${daysLeft} days from now).\n\nContinue with Explorer access for $29/month to keep:\n- Unlimited conversations\n- Full birth chart integration\n- Sacred Scribe+ insights\n- Akashic Field access\n- Transformation tracking\n\nVisit genesis.soullab.life/subscription to continue.\n\nOr downgrade to 3 free conversations per month.`
  };
}

/**
 * Trial ended email (sent on day of expiration)
 */
function getTrialEndedTemplate(userName: string) {
  return {
    subject: 'Your MAIA trial has ended',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              padding: 30px 0;
              border-bottom: 2px solid #f0f0f0;
            }
            .content {
              padding: 30px 0;
            }
            .cta-button {
              display: inline-block;
              background: #3b82f6;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding-top: 30px;
              border-top: 2px solid #f0f0f0;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="color: #1f2937; margin: 0;">✨ MAIA</h1>
          </div>

          <div class="content">
            <h2>Hi ${userName},</h2>

            <p>Your 14-day trial has ended, but your transformation journey doesn't have to stop here.</p>

            <p><strong>You now have 3 free conversations per month</strong> to continue connecting with MAIA's wisdom.</p>

            <p>Ready for unlimited access? Upgrade to Explorer for just $29/month:</p>

            <ul style="line-height: 2;">
              <li>Unlimited conversations</li>
              <li>Full feature access</li>
              <li>No commitment - cancel anytime</li>
            </ul>

            <p style="text-align: center;">
              <a href="https://genesis.soullab.life/subscription" class="cta-button">
                Upgrade to Explorer
              </a>
            </p>

            <p style="color: #6b7280; font-size: 14px;">
              Thank you for trying MAIA. We're here when you're ready to go deeper.
            </p>
          </div>

          <div class="footer">
            <p>Questions? Reply to this email.</p>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${userName},\n\nYour 14-day trial has ended. You now have 3 free conversations per month.\n\nUpgrade to Explorer for unlimited access:\n- $29/month\n- Cancel anytime\n- All premium features\n\nVisit genesis.soullab.life/subscription`
  };
}

/**
 * Payment failed email
 */
function getPaymentFailedTemplate(userName: string) {
  return {
    subject: 'Payment failed - Update your payment method',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              padding: 30px 0;
              border-bottom: 2px solid #f0f0f0;
            }
            .content {
              padding: 30px 0;
            }
            .warning {
              background: #fef2f2;
              border-left: 4px solid #ef4444;
              padding: 20px;
              margin: 20px 0;
            }
            .cta-button {
              display: inline-block;
              background: #ef4444;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding-top: 30px;
              border-top: 2px solid #f0f0f0;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="color: #1f2937; margin: 0;">✨ MAIA</h1>
          </div>

          <div class="content">
            <h2>Hi ${userName},</h2>

            <div class="warning">
              <p style="margin: 0;"><strong>⚠️ Your payment method failed</strong></p>
              <p style="margin: 10px 0 0 0;">We couldn't process your subscription payment. Please update your payment method to keep your access.</p>
            </div>

            <p>Your access is currently in a grace period, but will be restricted soon if we can't process payment.</p>

            <p style="text-align: center;">
              <a href="https://genesis.soullab.life/subscription/billing" class="cta-button">
                Update Payment Method
              </a>
            </p>

            <p style="color: #6b7280; font-size: 14px;">
              If you have questions about this charge, please reply to this email.
            </p>
          </div>

          <div class="footer">
            <p>Need help? We're here for you.</p>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${userName},\n\nYour payment method failed. Please update it to keep your MAIA subscription active.\n\nVisit genesis.soullab.life/subscription/billing to update your payment method.`
  };
}

// ============================================================================
// EMAIL SENDING FUNCTIONS
// ============================================================================

export async function sendTrialExpiringEmail(
  userEmail: string,
  userName: string,
  daysLeft: number,
  trialEndDate: Date
): Promise<{ success: boolean; error?: string }> {
  try {
    const template = getTrialExpiringTemplate(userName, daysLeft, trialEndDate);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });

    if (error) {
      console.error('Failed to send trial expiring email:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Trial expiring email sent to ${userEmail}`);
    return { success: true };

  } catch (error: any) {
    console.error('Error sending trial expiring email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendTrialEndedEmail(
  userEmail: string,
  userName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const template = getTrialEndedTemplate(userName);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });

    if (error) {
      console.error('Failed to send trial ended email:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Trial ended email sent to ${userEmail}`);
    return { success: true };

  } catch (error: any) {
    console.error('Error sending trial ended email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendPaymentFailedEmail(
  userEmail: string,
  userName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const template = getPaymentFailedTemplate(userName);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });

    if (error) {
      console.error('Failed to send payment failed email:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Payment failed email sent to ${userEmail}`);
    return { success: true };

  } catch (error: any) {
    console.error('Error sending payment failed email:', error);
    return { success: false, error: error.message };
  }
}
