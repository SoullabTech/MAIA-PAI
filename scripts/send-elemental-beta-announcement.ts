/**
 * SEND ELEMENTAL INTEGRATION BETA ANNOUNCEMENT
 *
 * Sends the Monday morning announcement to beta testers about
 * the new Elemental Alchemy integration (v0.9.0-alpha)
 *
 * Usage:
 *   npx tsx scripts/send-elemental-beta-announcement.ts
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

async function sendElementalBetaAnnouncement() {
  console.log('🔥💧🌍 ELEMENTAL INTEGRATION BETA ANNOUNCEMENT 🌬️✨\n');
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
  console.log('   Subject: 🔥💧 New: Elemental Alchemy Integration in Maia');
  console.log('   Template: elemental-beta-announcement');
  console.log('   Campaign: elemental-integration-beta\n');

  // Confirm before sending
  console.log('⚠️  READY TO SEND?');
  console.log('   This will send real emails to real beta testers.');
  console.log('   Press Ctrl+C to cancel, or wait 10 seconds to proceed...\n');

  // Wait 10 seconds for user to cancel
  await new Promise(resolve => setTimeout(resolve, 10000));

  console.log('🚀 SENDING...\n');

  // Send batch (uses Resend batch API for efficiency)
  const result = await sendBatchInvites(invites, 'elemental-beta-announcement');

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
  console.log('   1. Monitor responses for first reactions');
  console.log('   2. Be available for questions/support');
  console.log('   3. Watch for bug reports');
  console.log('   4. Collect feedback throughout testing\n');
}

// Execute
if (require.main === module) {
  sendElementalBetaAnnouncement()
    .then(() => {
      console.log('🎉 Script complete');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Script error:', error);
      process.exit(1);
    });
}

export { sendElementalBetaAnnouncement };
