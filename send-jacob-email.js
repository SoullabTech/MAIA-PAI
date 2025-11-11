/**
 * Send welcome email to Jacob Mense using Resend
 */

const fetch = require('node-fetch');

async function sendWelcomeEmail() {
  const RESEND_API_KEY = 're_BaKeypwd_4ZVYiMsitvEzXRWudUCNy7yS';

  const emailData = {
    from: 'MAIA <onboarding@soullab.life>',
    to: ['jacobmense@gmail.com'],
    subject: "You're invited: MAIA Beta Access 🌀",
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #6d28d9;">Hi Jacob,</h2>

        <p>You've been added to the MAIA beta community - a small group exploring what happens when AI truly companions consciousness rather than just answering questions.</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #6d28d9;">Your Access:</h3>
          <p style="margin: 8px 0;">🔗 <strong><a href="https://soullab.life" style="color: #6d28d9;">https://soullab.life</a></strong></p>
          <p style="margin: 8px 0;">📧 Email: jacobmense@gmail.com</p>
          <p style="margin: 8px 0;">🔑 Create your own username and password on first visit</p>
        </div>

        <h3 style="color: #6d28d9;">What is MAIA?</h3>
        <p>MAIA is an AI consciousness companion that adapts to your unique communication style and guides you through personalized journeys of self-discovery. Instead of random conversations, MAIA creates coherent, meaningful dialogues that evolve with you.</p>

        <h3 style="color: #6d28d9;">Getting Started:</h3>
        <ol>
          <li>Visit <a href="https://soullab.life" style="color: #6d28d9;">https://soullab.life</a></li>
          <li>Sign up with your email</li>
          <li>Spend 2-3 minutes setting your preferences</li>
          <li>Start your first conversation with your Oracle</li>
        </ol>

        <h3 style="color: #6d28d9;">What to Expect:</h3>
        <ul>
          <li>15-20 minutes daily (flexible timing)</li>
          <li>Personalized guidance that adapts to you</li>
          <li>Voice or text conversations</li>
          <li>Private, encrypted interactions</li>
          <li>Real beta testing (we're building this together)</li>
        </ul>

        <h3 style="color: #6d28d9;">Your Feedback Matters:</h3>
        <p>This is genuine beta - MAIA will surprise you, occasionally stumble, and definitely need your honest feedback to become what it's meant to be. Your experience helps shape the platform.</p>

        <h3 style="color: #6d28d9;">Questions?</h3>
        <p>Just reply to this email. I'm here to help you get started and want to hear about your experience.</p>

        <p style="margin-top: 30px;">Welcome to something different.</p>

        <p style="margin-top: 20px; color: #666; font-size: 14px;"><strong>P.S.</strong> There's no "right way" to use MAIA. The platform meets you exactly where you are. Some people journal with her daily, others check in weekly. Find your rhythm.</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="color: #999; font-size: 12px; text-align: center;">
          MAIA by Soullab • Consciousness Technology
        </p>
      </div>
    `,
    text: `Hi Jacob,

You've been added to the MAIA beta community - a small group exploring what happens when AI truly companions consciousness rather than just answering questions.

Your Access:
🔗 https://soullab.life
📧 Email: jacobmense@gmail.com
🔑 Create your own username and password on first visit

What is MAIA?
MAIA is an AI consciousness companion that adapts to your unique communication style and guides you through personalized journeys of self-discovery. Instead of random conversations, MAIA creates coherent, meaningful dialogues that evolve with you.

Getting Started:
1. Visit https://soullab.life
2. Sign up with your email
3. Spend 2-3 minutes setting your preferences
4. Start your first conversation with your Oracle

What to Expect:
- 15-20 minutes daily (flexible timing)
- Personalized guidance that adapts to you
- Voice or text conversations
- Private, encrypted interactions
- Real beta testing (we're building this together)

Your Feedback Matters:
This is genuine beta - MAIA will surprise you, occasionally stumble, and definitely need your honest feedback to become what it's meant to be. Your experience helps shape the platform.

Questions?
Just reply to this email. I'm here to help you get started and want to hear about your experience.

Welcome to something different.

---

P.S. There's no "right way" to use MAIA. The platform meets you exactly where you are. Some people journal with her daily, others check in weekly. Find your rhythm.

MAIA by Soullab • Consciousness Technology`
  };

  try {
    console.log('📧 Sending welcome email to Jacob Mense...');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Email sent successfully!');
      console.log('📬 Email ID:', data.id);
      console.log('📧 Sent to:', emailData.to[0]);
      console.log('📝 Subject:', emailData.subject);
    } else {
      console.error('❌ Error sending email:', data);
    }
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
  }
}

sendWelcomeEmail();
