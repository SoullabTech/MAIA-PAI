#!/usr/bin/env tsx
/**
 * Send Chapter Two Memory Launch Email to All Beta Testers
 * Uses the existing beta invite system with chapter-two-memory template
 *
 * Run with: npx tsx scripts/send-chapter-two-batch.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local file explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { sendBatchInvites } from '../lib/email/sendBetaInvite';

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
  { name: 'Yvonne', email: 'Yvonneland@gmail.com' },
  { name: 'David', email: 'Dstepetic@gmail.com' },
  { name: 'Risako', email: 'Risako.stepetic@gmail.com' },
  { name: 'Whitey', email: 'Whiteysart.kathleen@icloud.com' },
  { name: 'Jude', email: 'jude_epstein@sbcglobal.net' },
  { name: 'Matt', email: 'matthew.oconnor@quinnipiac.edu' },
  { name: 'Kelly Nezat', email: 'soullab1@gmail.com' }
];

async function sendChapterTwoEmails() {
  console.log('🌅 Sending Chapter Two: The Mirror Remembers\n');
  console.log(`📬 Sending to ${BETA_TESTERS.length} beta testers\n`);

  // Check for Resend API key
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ Error: RESEND_API_KEY not found in environment variables');
    console.log('💡 Add RESEND_API_KEY=your_key to .env.local file');
    process.exit(1);
  }

  try {
    // Use batch send with chapter-two-memory template
    const result = await sendBatchInvites(
      BETA_TESTERS,
      'chapter-two-memory',  // Template name
      0  // No delay needed - Resend batch API handles this
    );

    console.log('\n' + '='.repeat(70));
    console.log('📊 SEND SUMMARY');
    console.log('='.repeat(70));
    console.log(`✅ Successfully sent: ${result.successful}/${result.total}`);
    console.log(`❌ Failed: ${result.failed}/${result.total}`);
    console.log('='.repeat(70) + '\n');

    if (result.successful === result.total) {
      console.log('🎉 SUCCESS! All Chapter Two emails sent.');
      console.log(`📧 ${result.total} sacred scientists will receive the memory launch announcement.\n`);
    } else if (result.successful > 0) {
      console.log('⚠️  PARTIAL SUCCESS.');
      console.log('Some emails failed. Check the output above for details.\n');
    } else {
      console.log('❌ FAILED: No emails were sent successfully.\n');
      process.exit(1);
    }

  } catch (error: any) {
    console.error('💥 Fatal error:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

// Run it
sendChapterTwoEmails();
