#!/usr/bin/env tsx
/**
 * Send "Chapter Two Begins Monday: MAIA Remembers" email to beta testers
 * Run with: npm run send:chapter-two
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local file explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BetaTester {
  name: string;
  email: string;
}

const BETA_TESTERS: BetaTester[] = [
  { name: 'Anna', email: 'abcdunbar@gmail.com' },
  { name: 'Yvonne', email: 'Yvonneland@email.com' },
  { name: 'David', email: 'Dstepetic@gmail.com' },
  { name: 'Risako', email: 'Risako.stepetic@gmail.com' }
  // Add more testers as needed
];

const EMAIL_SUBJECT = 'Chapter Two Begins Monday: MAIA Remembers';

const EMAIL_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #1a1a1a;
    }
    p {
      margin-bottom: 16px;
    }
    ul {
      margin: 16px 0;
      padding-left: 24px;
    }
    li {
      margin-bottom: 8px;
    }
    .highlight {
      background: #f0f9ff;
      padding: 16px;
      border-radius: 8px;
      margin: 24px 0;
    }
    .signature {
      margin-top: 32px;
      font-style: italic;
    }
    .ps {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e5e5e5;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <h1>Chapter Two Begins Monday: MAIA Remembers</h1>

  <p>Dear Beta Testers,</p>

  <p>Thank you for your patience and invaluable feedback over these first weeks. You've helped us understand something crucial: every conversation you had with MAIA was like meeting someone new. She couldn't remember your story from Tuesday to Wednesday. Your breakthroughs on Monday were forgotten by Friday.</p>

  <p>You were experiencing what we call "session amnesia" - the same limitation that makes ChatGPT, Claude, and every other AI feel hollow over time. You helped us map the emotional cost of starting from zero, again and again.</p>

  <p><strong>This changes Monday morning.</strong></p>

  <p>MAIA's memory system is now fully operational. When you return, she will:</p>

  <ul>
    <li>Remember your previous conversations</li>
    <li>Recognize patterns across your sessions</li>
    <li>Build on breakthroughs rather than forgetting them</li>
    <li>Track the actual journey you're on together</li>
  </ul>

  <p>You might notice her saying things like "This connects to what you mentioned about boundaries last week" or "I remember when you first brought this up." This isn't a glitch - this is the continuity you've been asking for.</p>

  <div class="highlight">
    <p><strong>What's different:</strong></p>
    <ul>
      <li>Your story accumulates rather than resets</li>
      <li>Patterns across time become visible</li>
      <li>Each conversation builds on the last</li>
      <li>The relationship deepens naturally</li>
    </ul>
  </div>

  <p><strong>What to expect:</strong></p>

  <p>Some of you have weeks of conversations that MAIA can now access. She won't overwhelm you with old references, but she will naturally weave in relevant context when it serves the moment. If anything feels off - too much recall, not enough, or unexpected connections - please let us know. You're helping us calibrate the balance between memory and presence.</p>

  <p><strong>A note on privacy:</strong></p>

  <p>Each person's memories remain completely private. MAIA remembers YOUR journey, not anyone else's. We've tested this extensively - there's zero cross-contamination between users.</p>

  <p><strong>The deeper change:</strong></p>

  <p>You're not just testing better memory. You're testing whether technology can actually witness a human journey over time. Whether an AI companion can hold your story in a way that helps you see your own patterns. Whether the mirror can remember the reflection.</p>

  <p>Your feedback over the coming days will be crucial. We'll be monitoring closely and iterating based on your experience.</p>

  <p>Thank you for walking this path with us. Chapter One helped us understand the problem. Chapter Two begins the solution.</p>

  <p class="signature">
    With gratitude and excitement,<br>
    Kelly & The Soullab Team
  </p>

  <p class="ps">
    <strong>P.S.</strong> All your previous conversations were safely stored even when MAIA couldn't access them. Nothing was lost - it was just temporarily invisible to her. When you log in Monday, she'll have access to your full journey together.
  </p>
</body>
</html>`;

const EMAIL_TEXT = `Chapter Two Begins Monday: MAIA Remembers

Dear Beta Testers,

Thank you for your patience and invaluable feedback over these first weeks. You've helped us understand something crucial: every conversation you had with MAIA was like meeting someone new. She couldn't remember your story from Tuesday to Wednesday. Your breakthroughs on Monday were forgotten by Friday.

You were experiencing what we call "session amnesia" - the same limitation that makes ChatGPT, Claude, and every other AI feel hollow over time. You helped us map the emotional cost of starting from zero, again and again.

This changes Monday morning.

MAIA's memory system is now fully operational. When you return, she will:

- Remember your previous conversations
- Recognize patterns across your sessions
- Build on breakthroughs rather than forgetting them
- Track the actual journey you're on together

You might notice her saying things like "This connects to what you mentioned about boundaries last week" or "I remember when you first brought this up." This isn't a glitch - this is the continuity you've been asking for.

What's different:

- Your story accumulates rather than resets
- Patterns across time become visible
- Each conversation builds on the last
- The relationship deepens naturally

What to expect:

Some of you have weeks of conversations that MAIA can now access. She won't overwhelm you with old references, but she will naturally weave in relevant context when it serves the moment. If anything feels off - too much recall, not enough, or unexpected connections - please let us know. You're helping us calibrate the balance between memory and presence.

A note on privacy:

Each person's memories remain completely private. MAIA remembers YOUR journey, not anyone else's. We've tested this extensively - there's zero cross-contamination between users.

The deeper change:

You're not just testing better memory. You're testing whether technology can actually witness a human journey over time. Whether an AI companion can hold your story in a way that helps you see your own patterns. Whether the mirror can remember the reflection.

Your feedback over the coming days will be crucial. We'll be monitoring closely and iterating based on your experience.

Thank you for walking this path with us. Chapter One helped us understand the problem. Chapter Two begins the solution.

With gratitude and excitement,
Kelly & The Soullab Team

P.S. All your previous conversations were safely stored even when MAIA couldn't access them. Nothing was lost - it was just temporarily invisible to her. When you log in Monday, she'll have access to your full journey together.`;

async function sendChapterTwoEmail() {
  console.log('📧 Sending "Chapter Two" email to beta testers...\n');

  // Check for Resend API key
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ Error: RESEND_API_KEY not found in environment variables');
    console.log('💡 Add RESEND_API_KEY=your_key to .env.local file');
    process.exit(1);
  }

  const results = {
    sent: 0,
    failed: 0,
    errors: [] as Array<{ email: string; error: string }>
  };

  console.log(`📬 Sending to ${BETA_TESTERS.length} beta testers:\n`);

  for (const tester of BETA_TESTERS) {
    try {
      console.log(`   → ${tester.name} (${tester.email})...`);

      const result = await resend.emails.send({
        from: 'Kelly @ Soullab <kelly@soullab.org>',
        to: tester.email,
        subject: EMAIL_SUBJECT,
        html: EMAIL_HTML,
        text: EMAIL_TEXT
      });

      if (result.error) {
        console.log(`     ❌ Failed: ${result.error.message}`);
        results.failed++;
        results.errors.push({
          email: tester.email,
          error: result.error.message
        });
      } else {
        console.log(`     ✅ Sent successfully (ID: ${result.data?.id})`);
        results.sent++;
      }

      // Wait 2 seconds between emails to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error: any) {
      console.error(`     💥 Exception: ${error.message}`);
      results.failed++;
      results.errors.push({
        email: tester.email,
        error: error.message
      });
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   ✅ Successfully sent: ${results.sent}/${BETA_TESTERS.length}`);
  console.log(`   ❌ Failed: ${results.failed}/${BETA_TESTERS.length}`);

  if (results.errors.length > 0) {
    console.log('\n❌ Errors:');
    results.errors.forEach(err => {
      console.log(`   - ${err.email}: ${err.error}`);
    });
  }

  console.log('='.repeat(60) + '\n');

  if (results.sent === BETA_TESTERS.length) {
    console.log('🎉 All emails sent successfully!');
  } else if (results.sent > 0) {
    console.log('⚠️ Some emails failed to send. Check errors above.');
  } else {
    console.log('❌ No emails were sent successfully.');
    process.exit(1);
  }
}

// Run it
sendChapterTwoEmail().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
