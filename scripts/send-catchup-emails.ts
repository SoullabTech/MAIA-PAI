#!/usr/bin/env tsx
/**
 * Send catch-up email sequence to new beta testers (Jude & Matt)
 * Sends: beta-invitation, beta-welcome, beta-day2-update, chapter-two-memory
 *
 * Run with: npx tsx scripts/send-catchup-emails.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local file explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { sendBetaInvite } from '../lib/email/sendBetaInvite';

interface BetaTester {
  name: string;
  email: string;
}

const NEW_TESTERS: BetaTester[] = [
  { name: 'Jude', email: 'jude_epstein@sbcglobal.net' },
  { name: 'Matt', email: 'matthew.oconnor@quinnipiac.edu' }
];

// Email sequence in order
const EMAIL_SEQUENCE = [
  'beta-invitation',      // Day 0: Initial invitation
  'beta-welcome',         // Day 1: Welcome
  'beta-day2-update',     // Day 2: The Space Between Words
  'chapter-two-memory'    // Day 3: Memory launch
];

async function sendCatchupEmails() {
  console.log('📧 Sending catch-up email sequence to new beta testers\n');
  console.log(`👥 Recipients: ${NEW_TESTERS.length} testers`);
  console.log(`📬 Emails per person: ${EMAIL_SEQUENCE.length}\n`);

  // Check for Resend API key
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ Error: RESEND_API_KEY not found in environment variables');
    console.log('💡 Add RESEND_API_KEY=your_key to .env.local file');
    process.exit(1);
  }

  const results = {
    sent: 0,
    failed: 0,
    details: [] as Array<{ tester: string; email: string; template: string; success: boolean; error?: string }>
  };

  // Send emails to each tester
  for (const tester of NEW_TESTERS) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`👤 ${tester.name} (${tester.email})`);
    console.log('='.repeat(70));

    // Send each email in the sequence
    for (const template of EMAIL_SEQUENCE) {
      try {
        console.log(`   📤 Sending: ${template}...`);

        const result = await sendBetaInvite(tester, template);

        if (result.success) {
          console.log(`      ✅ Sent successfully (ID: ${result.id})`);
          results.sent++;
          results.details.push({
            tester: tester.name,
            email: tester.email,
            template,
            success: true
          });
        } else {
          console.log(`      ❌ Failed: ${result.error}`);
          results.failed++;
          results.details.push({
            tester: tester.name,
            email: tester.email,
            template,
            success: false,
            error: result.error
          });
        }

        // Wait 3 seconds between each email
        if (template !== EMAIL_SEQUENCE[EMAIL_SEQUENCE.length - 1]) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }

      } catch (error: any) {
        console.error(`      💥 Exception: ${error.message}`);
        results.failed++;
        results.details.push({
          tester: tester.name,
          email: tester.email,
          template,
          success: false,
          error: error.message
        });
      }
    }

    // Wait 5 seconds before next tester
    if (tester !== NEW_TESTERS[NEW_TESTERS.length - 1]) {
      console.log(`\n   ⏳ Waiting 5 seconds before next tester...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 CATCH-UP EMAIL SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Successfully sent: ${results.sent}/${NEW_TESTERS.length * EMAIL_SEQUENCE.length}`);
  console.log(`❌ Failed: ${results.failed}/${NEW_TESTERS.length * EMAIL_SEQUENCE.length}`);
  console.log('='.repeat(70));

  // Show per-tester breakdown
  console.log('\n📋 Per-Tester Breakdown:\n');
  for (const tester of NEW_TESTERS) {
    const testerEmails = results.details.filter(d => d.tester === tester.name);
    const testerSent = testerEmails.filter(e => e.success).length;
    const testerFailed = testerEmails.filter(e => !e.success).length;

    console.log(`${tester.name} (${tester.email}):`);
    console.log(`  ✅ Sent: ${testerSent}/${EMAIL_SEQUENCE.length}`);
    console.log(`  ❌ Failed: ${testerFailed}/${EMAIL_SEQUENCE.length}`);

    if (testerFailed > 0) {
      const failures = testerEmails.filter(e => !e.success);
      failures.forEach(f => {
        console.log(`     ❌ ${f.template}: ${f.error}`);
      });
    }
    console.log('');
  }

  if (results.failed === 0) {
    console.log('🎉 SUCCESS! All catch-up emails sent.');
    console.log(`📧 Jude and Matt are now caught up with the beta cohort!\n`);
  } else if (results.sent > 0) {
    console.log('⚠️  PARTIAL SUCCESS: Some emails failed.');
    console.log('Check the breakdown above for details.\n');
  } else {
    console.log('❌ FAILED: No emails were sent successfully.\n');
    process.exit(1);
  }
}

// Run it
sendCatchupEmails().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
