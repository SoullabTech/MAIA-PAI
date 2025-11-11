/**
 * Send to Remaining Beta Testers (Rate-Limited)
 * Sends with 600ms delay to respect Resend's 2 requests/second limit
 */

import { Resend } from 'resend';
import { readFileSync } from 'fs';

const resend = new Resend(process.env.RESEND_API_KEY);

// Failed recipients from first batch
const remainingTesters = [
  { email: 'JHRuder@gmail.com', name: 'Jason Ruder' },
  { email: 'tcdiamond70@gmail.com', name: 'Travis Diamond' },
  { email: 'phoenixrises123@gmail.com', name: 'Susan Bragg' },
  { email: 'mdaquin@gmail.com', name: 'Meagan d\'Aquin' },
  { email: 'loraleegeil@gmail.com', name: 'Loralee Geil' },
  { email: 'andreadfagan@gmail.com', name: 'Andrea Fagan' },
  { email: 'cececampbell1@gmail.com', name: 'Cece Campbell' },
  { email: 'Inhomesanctuary@gmail.com', name: 'Kristen Nezat' },
  { email: 'dougaforeman@gmail.com', name: 'Doug Foreman' },
  { email: 'dakotamundi@gmail.com', name: 'Kimberly Daugherty' },
  { email: 'Lruderlcsw@aol.com', name: 'Leonard Ruder' },
  { email: 'augustennezat@gmail.com', name: 'Augusten Nezat' },
  { email: 'snezat27@sacredhearthamden.org', name: 'Sophie Nezat' },
  { email: 'weezie.delavergne@gmail.com', name: 'Weezie' },
  { email: 'koreyrichey@gmail.com', name: 'Korey' },
  { email: 'catherine@atthefield.uk', name: 'Catherine' },
  { email: 'thea@theapagel.com', name: 'Thea' },
  { email: 'vmiller@bmfcomms.com', name: 'Virginia' },
  { email: 'soullab1@gmail.com', name: 'Kelly Soullab' },
  { email: 'karapylant@outlook.com', name: 'Kara' },
  { email: 'nicolecasbarro@gmail.com', name: 'Nicole' },
  { email: 'dreyfus@dfpartners.swiss', name: 'Marie-Christine' },
  { email: 'abcdunbar@gmail.com', name: 'Anna' },
  { email: 'Risako.stepetic@gmail.com', name: 'Risako' }
];

async function sendRemainingEmails() {
  console.log('🧠 Sending to Remaining Beta Testers\n');
  console.log(`📧 Remaining: ${remainingTesters.length} consciousness pioneers`);
  console.log('⏱️  Rate limited: 600ms delay between sends\n');

  const htmlContent = readFileSync('/Users/soullab/MAIA-FRESH/beta-tester-email.html', 'utf8');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < remainingTesters.length; i++) {
    const tester = remainingTesters[i];

    try {
      console.log(`[${i + 1}/${remainingTesters.length}] Sending to ${tester.name} (${tester.email})...`);

      const { data, error } = await resend.emails.send({
        from: 'Soullab <hello@soullab.life>',
        to: [tester.email],
        subject: '🧠 The Consciousness Revolution Has Begun',
        html: htmlContent,
      });

      if (error) {
        console.log(`         ❌ Failed: ${error.message}`);
        failCount++;
      } else {
        console.log(`         ✅ Sent (ID: ${data?.id})`);
        successCount++;
      }

      // Wait 600ms to respect 2 req/second limit (with buffer)
      if (i < remainingTesters.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 600));
      }

    } catch (error: any) {
      console.log(`         ❌ Error: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 REMAINING BATCH COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📧 Total attempted: ${remainingTesters.length}`);
  console.log('\n🎉 Combined total: ' + (23 + successCount) + '/47 emails sent!');
}

sendRemainingEmails().catch(error => {
  console.error('❌ Send script failed:', error);
  process.exit(1);
});
