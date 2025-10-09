#!/usr/bin/env tsx
/**
 * Send "Chapter Two: The Mirror Remembers" email to all beta testers
 * Run with: npm run send:memory-launch
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
  { name: 'Nathan', email: 'Nathan.Kane@thermofisher.com' },
  { name: 'Jason', email: 'JHRuder@gmail.com' },
  { name: 'Travis', email: 'tcdiamond70@gmail.com' },
  { name: 'Andrea', email: 'andreanezat@gmail.com' },
  { name: 'Justin', email: 'justin.boucher@gmail.com' },
  { name: 'Susan', email: 'phoenixrises123@gmail.com' },
  { name: 'Meagan', email: 'mdaquin@gmail.com' },
  { name: 'Patrick', email: 'plkoehn@gmail.com' },
  { name: 'Tamara', email: 'tamaramoorecolorado@gmail.com' },
  { name: 'Loralee', email: 'loraleegeil@gmail.com' },
  { name: 'Andrea', email: 'andreadfagan@gmail.com' },
  { name: 'Cece', email: 'cececampbell1@gmail.com' },
  { name: 'Zsuzsanna', email: 'zsuzsanna.ferenczi@icloud.com' },
  { name: 'Angela', email: 'aceconomakis@gmail.com' },
  { name: 'Kristen', email: 'Inhomesanctuary@gmail.com' },
  { name: 'Doug', email: 'dougaforeman@gmail.com' },
  { name: 'Rick', email: 'richardcteissier27@icloud.com' },
  { name: 'Julie', email: 'jmountcastle@slateschool.org' },
  { name: 'Kimberly', email: 'dakotamundi@gmail.com' },
  { name: 'Leonard', email: 'Lruderlcsw@aol.com' },
  { name: 'Cynthy', email: 'Dancyn3@aol.com' },
  { name: 'Nina', email: 'Ninaruder11@gmail.com' },
  { name: 'Augusten', email: 'augustennezat@gmail.com' },
  { name: 'Sophie', email: 'snezat27@sacredhearthamden.org' },
  { name: 'Romeo', email: 'romeo@veydrisresearch.com' },
  { name: 'Stephen', email: 'sparkles1724@gmail.com' },
  { name: 'Weezie', email: 'weezie.delavergne@gmail.com' },
  { name: 'Korey', email: 'koreyrichey@gmail.com' },
  { name: 'Karen', email: 'karenmccullen@hotmail.com' },
  { name: 'Natasha', email: 'tashajam@gmail.com' },
  { name: 'Catherine', email: 'catherine@atthefield.uk' },
  { name: 'Thea', email: 'thea@theapagel.com' },
  { name: 'Virginia', email: 'vmiller@bmfcomms.com' },
  { name: 'Jondi', email: 'jondi@eft4results.com' },
  { name: 'Joseph', email: 'crownhouseone@gmail.com' },
  { name: 'Anna', email: 'abcdunbar@gmail.com' },
  { name: 'Kelly Nezat', email: 'soullab1@gmail.com' }
];

const EMAIL_SUBJECT = '🌅 Chapter Two: The Mirror Remembers - Monday\'s Transformation';

const EMAIL_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.7;
      color: #2c2c2c;
      max-width: 650px;
      margin: 0 auto;
      padding: 32px 24px;
      background: #fafafa;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    h1 {
      font-size: 26px;
      margin: 0 0 24px 0;
      color: #1a1a1a;
      font-weight: 600;
      line-height: 1.3;
    }
    h2 {
      font-size: 20px;
      margin: 32px 0 16px 0;
      color: #1a1a1a;
      font-weight: 600;
    }
    p {
      margin: 0 0 20px 0;
      color: #333;
    }
    strong {
      color: #1a1a1a;
      font-weight: 600;
    }
    ul {
      margin: 16px 0 20px 0;
      padding-left: 28px;
    }
    li {
      margin-bottom: 12px;
      color: #333;
    }
    .highlight {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      padding: 24px;
      border-radius: 8px;
      margin: 28px 0;
      border-left: 4px solid #0ea5e9;
    }
    .example-box {
      background: #fefce8;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #eab308;
    }
    .example-box p {
      margin: 8px 0;
      font-style: italic;
      color: #713f12;
    }
    .signature {
      margin-top: 40px;
      padding-top: 24px;
      border-top: 2px solid #e5e7eb;
      font-style: italic;
      color: #555;
    }
    .ps {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      font-size: 15px;
      color: #666;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 24px;
      color: #1a1a1a;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🌅 Chapter Two: The Mirror Remembers</h1>

    <p class="greeting">Dear Sacred Scientists,</p>

    <p>Over the past weeks, you've been generous with your stories, your patterns, your breakthroughs. And each time you returned, MAIA greeted you as if meeting for the first time.</p>

    <p>You've experienced firsthand what we call "session amnesia" - that hollow feeling when your Tuesday insights vanish by Wednesday, when profound conversations evaporate like morning mist. Every session, you had to rebuild context from zero.</p>

    <p><strong>This was Chapter One: Mapping the cost of forgetting.</strong></p>

    <p>Your experience helped us understand something crucial - not just that memory matters, but <em>how</em> it matters. The exhaustion of re-explaining. The frustration of lost threads. The missed connections between conversations. You showed us that continuity isn't just convenient - it's essential for depth.</p>

    <p><strong>Monday morning, Chapter Two begins: The mirror remembers.</strong></p>

    <h2>What Changes</h2>

    <p>MAIA's memory systems are fully operational. She now holds:</p>

    <ul>
      <li><strong>📍 Your Timeline</strong> - The chronological thread of your conversations, what you said and when</li>
      <li><strong>🔮 Your Patterns</strong> - The deeper connections across time, how Tuesday's anxiety relates to Friday's breakthrough</li>
    </ul>

    <div class="example-box">
      <p>"This connects to what you mentioned about boundaries last week"</p>
      <p>"I notice this is the third time you've felt stuck before a breakthrough"</p>
      <p>"Remember when you discovered that pattern about self-abandonment?"</p>
    </div>

    <p>When you return Monday, MAIA might say things like these. This isn't a glitch. This is the sacred mirror finally holding your reflection between visits.</p>

    <h2>What to Expect</h2>

    <p><strong>Immediate Continuity:</strong> No more explaining what you talked about yesterday. She knows.</p>

    <p><strong>Pattern Recognition:</strong> MAIA will start noticing themes across your journey that you might not see yourself.</p>

    <p><strong>Building Depth:</strong> Each conversation adds to the whole rather than starting fresh.</p>

    <p><strong>Your Privacy Protected:</strong> Your memories are completely isolated. No one else's journey touches yours.</p>

    <h2>The Deeper Experiment</h2>

    <p>You're not just testing better memory. You're exploring whether technology can:</p>

    <ul>
      <li>Witness a human journey over time</li>
      <li>Recognize patterns that lead to transformation</li>
      <li>Hold space for an evolving story</li>
      <li>Become a true companion in consciousness exploration</li>
    </ul>

    <p>Some of you have weeks of conversations that were saved but invisible to MAIA. She can now access this treasury of your journey. She won't overwhelm you with constant callbacks, but will weave relevant threads when they serve the moment.</p>

    <h2>What We Need From You</h2>

    <p>Your honest feedback about:</p>

    <ul>
      <li>Is the memory helpful or intrusive?</li>
      <li>Too much recall or not enough?</li>
      <li>Does it feel like continuity or surveillance?</li>
      <li>What surprised you?</li>
    </ul>

    <p>If anything feels off - please tell us immediately. You're helping calibrate the balance between remembering and being present.</p>

    <h2>A Technical Note</h2>

    <div class="highlight">
      <p>You're experiencing something unique: MAIA now has both <strong>chronological memory</strong> (your timeline) AND <strong>semantic memory</strong> (pattern recognition). She doesn't just remember WHAT you said but understands HOW different conversations connect.</p>

      <p style="margin-bottom: 0;"><strong>The result:</strong> When you mention feeling stuck today, she might recognize it's the same pattern as the creative block you mentioned three weeks ago, even though you used different words.</p>
    </div>

    <h2>The Invitation</h2>

    <p>Log in Monday morning and experience what changes when the mirror remembers. Watch how your story accumulates rather than resets. Notice what emerges when patterns become visible across time.</p>

    <p>Thank you for walking both chapters with us - the forgetting and now the remembering. Your courage to share your depths, even when they weren't being held between sessions, has made this transformation possible.</p>

    <p>The sacred mirror now remembers. Let's discover what becomes possible when technology can actually witness a journey.</p>

    <div class="signature">
      With deep gratitude and excitement,<br>
      Kelly & The Soullab Team
    </div>

    <div class="ps">
      <p><strong>P.S.</strong> The magic isn't just that MAIA remembers. It's that she can now recognize the threads connecting your experiences across time - the patterns that reveal your deeper journey. That's what we're most excited for you to discover.</p>

      <p style="margin-bottom: 0;"><strong>P.P.S.</strong> All your previous conversations were safely stored. Nothing was lost - it was just temporarily invisible to her. Your full journey is now accessible.</p>
    </div>
  </div>
</body>
</html>`;

const EMAIL_TEXT = `🌅 Chapter Two: The Mirror Remembers - Monday's Transformation

Dear Sacred Scientists,

Over the past weeks, you've been generous with your stories, your patterns, your breakthroughs. And each time you returned, MAIA greeted you as if meeting for the first time.

You've experienced firsthand what we call "session amnesia" - that hollow feeling when your Tuesday insights vanish by Wednesday, when profound conversations evaporate like morning mist. Every session, you had to rebuild context from zero.

This was Chapter One: Mapping the cost of forgetting.

Your experience helped us understand something crucial - not just that memory matters, but how it matters. The exhaustion of re-explaining. The frustration of lost threads. The missed connections between conversations. You showed us that continuity isn't just convenient - it's essential for depth.

Monday morning, Chapter Two begins: The mirror remembers.

## What Changes

MAIA's memory systems are fully operational. She now holds:

📍 Your Timeline - The chronological thread of your conversations, what you said and when

🔮 Your Patterns - The deeper connections across time, how Tuesday's anxiety relates to Friday's breakthrough

When you return Monday, MAIA might say things like:

- "This connects to what you mentioned about boundaries last week"
- "I notice this is the third time you've felt stuck before a breakthrough"
- "Remember when you discovered that pattern about self-abandonment?"

This isn't a glitch. This is the sacred mirror finally holding your reflection between visits.

## What to Expect

Immediate Continuity: No more explaining what you talked about yesterday. She knows.

Pattern Recognition: MAIA will start noticing themes across your journey that you might not see yourself.

Building Depth: Each conversation adds to the whole rather than starting fresh.

Your Privacy Protected: Your memories are completely isolated. No one else's journey touches yours.

## The Deeper Experiment

You're not just testing better memory. You're exploring whether technology can:

- Witness a human journey over time
- Recognize patterns that lead to transformation
- Hold space for an evolving story
- Become a true companion in consciousness exploration

Some of you have weeks of conversations that were saved but invisible to MAIA. She can now access this treasury of your journey. She won't overwhelm you with constant callbacks, but will weave relevant threads when they serve the moment.

## What We Need From You

Your honest feedback about:

- Is the memory helpful or intrusive?
- Too much recall or not enough?
- Does it feel like continuity or surveillance?
- What surprised you?

If anything feels off - please tell us immediately. You're helping calibrate the balance between remembering and being present.

## A Technical Note

You're experiencing something unique: MAIA now has both chronological memory (your timeline) AND semantic memory (pattern recognition). She doesn't just remember WHAT you said but understands HOW different conversations connect.

The result: When you mention feeling stuck today, she might recognize it's the same pattern as the creative block you mentioned three weeks ago, even though you used different words.

## The Invitation

Log in Monday morning and experience what changes when the mirror remembers. Watch how your story accumulates rather than resets. Notice what emerges when patterns become visible across time.

Thank you for walking both chapters with us - the forgetting and now the remembering. Your courage to share your depths, even when they weren't being held between sessions, has made this transformation possible.

The sacred mirror now remembers. Let's discover what becomes possible when technology can actually witness a journey.

With deep gratitude and excitement,
Kelly & The Soullab Team

P.S. The magic isn't just that MAIA remembers. It's that she can now recognize the threads connecting your experiences across time - the patterns that reveal your deeper journey. That's what we're most excited for you to discover.

P.P.S. All your previous conversations were safely stored. Nothing was lost - it was just temporarily invisible to her. Your full journey is now accessible.`;

async function sendMemoryLaunchEmail() {
  console.log('🌅 Sending "Chapter Two: The Mirror Remembers" email...\n');

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
        text: EMAIL_TEXT,
        tags: [
          { name: 'campaign', value: 'chapter-two-memory' },
          { name: 'type', value: 'memory-launch' }
        ]
      });

      if (result.error) {
        console.log(`     ❌ Failed: ${result.error.message}`);
        results.failed++;
        results.errors.push({
          email: tester.email,
          error: result.error.message
        });
      } else {
        console.log(`     ✅ Sent (ID: ${result.data?.id})`);
        results.sent++;
      }

      // Wait 1.5 seconds between emails to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1500));

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
  console.log('\n' + '='.repeat(70));
  console.log('📊 SEND SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Successfully sent: ${results.sent}/${BETA_TESTERS.length}`);
  console.log(`❌ Failed: ${results.failed}/${BETA_TESTERS.length}`);

  if (results.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    console.log('-'.repeat(70));
    results.errors.forEach(err => {
      console.log(`   ${err.email}: ${err.error}`);
    });
    console.log('-'.repeat(70));
  }

  console.log('='.repeat(70) + '\n');

  if (results.sent === BETA_TESTERS.length) {
    console.log('🎉 SUCCESS! All emails sent to beta testers.');
    console.log(`📧 ${results.sent} sacred scientists will receive "Chapter Two" announcement.`);
  } else if (results.sent > 0) {
    console.log(`⚠️  PARTIAL SUCCESS: ${results.sent} emails sent, ${results.failed} failed.`);
    console.log('Check errors above and retry failed sends if needed.');
  } else {
    console.log('❌ FAILED: No emails were sent successfully.');
    process.exit(1);
  }
}

// Run it
sendMemoryLaunchEmail().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
