/**
 * SEND MONDAY OCTOBER 21 BETA ANNOUNCEMENT
 *
 * Sends the Monday morning announcement to beta testers about:
 * - Beta Handbook consolidation
 * - New conversation modes (Voice Listening + Personality)
 * - Dune aesthetic system
 * - Field Protocol check-in
 *
 * Usage:
 *   npx tsx scripts/send-monday-oct21-announcement.ts
 */

import { sendBatchInvites, BetaInvite } from '../lib/email/sendBetaInvite';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface BetaTester {
  email: string;
  name: string;
  beta_code?: string;
}

async function getBetaTesters(): Promise<BetaTester[]> {
  const { data, error } = await supabase
    .from('users')
    .select('email, name, beta_code')
    .eq('role', 'beta_tester')
    .not('email', 'is', null);

  if (error) {
    console.error('Error fetching beta testers:', error);
    return [];
  }

  return data || [];
}

async function sendMondayOct21Announcement() {
  console.log('🏜️ MONDAY OCTOBER 21 BETA ANNOUNCEMENT\n');
  console.log('═══════════════════════════════════════════════════\n');

  // Get beta testers from database
  console.log('📋 Fetching beta tester list...');
  const betaTesters = await getBetaTesters();

  if (betaTesters.length === 0) {
    console.error('❌ No beta testers found in database');
    console.log('\n💡 TIP: Make sure users have role="beta_tester" in Supabase');
    return;
  }

  console.log(`✅ Found ${betaTesters.length} beta testers\n`);

  // Convert to BetaInvite format
  const invites: BetaInvite[] = betaTesters.map(tester => ({
    name: tester.name || tester.email.split('@')[0],
    email: tester.email,
    betaCode: tester.beta_code
  }));

  // Preview
  console.log('📧 PREVIEW - Will send to:');
  console.log('───────────────────────────────────────────────────');
  invites.forEach((invite, i) => {
    console.log(`${i + 1}. ${invite.name} <${invite.email}>`);
  });
  console.log('───────────────────────────────────────────────────\n');

  console.log('📝 Email details:');
  console.log('   From: Kelly @ Soullab <kelly@soullab.org>');
  console.log('   Subject: 🏜️ This Week in the Desert - The Handbook Has Arrived');
  console.log('   Template: monday-oct21-modes-announcement');
  console.log('   Campaign: monday-oct21-beta\n');

  console.log('📦 What\'s included:');
  console.log('   • Beta Handbook consolidation (148 → 1 doc)');
  console.log('   • New Voice Listening Modes (Dialogue/Patient/Scribe)');
  console.log('   • New Conversation Personality Modes (Walking/Classic/Adaptive)');
  console.log('   • Dune Aesthetic System overview');
  console.log('   • Field Protocol check-in question\n');

  // Confirm before sending
  console.log('⚠️  READY TO SEND?');
  console.log('   This will send real emails to real beta testers.');
  console.log('   Press Ctrl+C to cancel, or wait 10 seconds to proceed...\n');

  // Wait 10 seconds for user to cancel
  await new Promise(resolve => setTimeout(resolve, 10000));

  console.log('🚀 SENDING...\n');

  // Send batch (uses Resend batch API for efficiency)
  const result = await sendBatchInvites(invites, 'monday-oct21-modes-announcement');

  console.log('\n═══════════════════════════════════════════════════');
  console.log('📊 SEND COMPLETE');
  console.log('═══════════════════════════════════════════════════');
  console.log(`Total: ${result.total}`);
  console.log(`✅ Successful: ${result.successful}`);
  console.log(`❌ Failed: ${result.failed}`);

  if (result.failed > 0) {
    console.log('\n❌ Failed sends:');
    result.results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${r.name} <${r.email}>: ${r.error || 'Unknown error'}`);
      });
  }

  console.log('\n✅ Announcement sent successfully!');
  console.log('📁 Check Resend dashboard for delivery status:');
  console.log('   https://resend.com/emails\n');

  console.log('📋 NEXT STEPS:');
  console.log('   1. Monitor check-in page for announcement visibility');
  console.log('   2. Watch for beta tester questions about new modes');
  console.log('   3. Collect feedback on mode combinations');
  console.log('   4. Track Field Record creation responses\n');
}

// Execute
if (require.main === module) {
  sendMondayOct21Announcement()
    .then(() => {
      console.log('🎉 Script complete');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Script error:', error);
      process.exit(1);
    });
}

export { sendMondayOct21Announcement };
