/**
 * Send Consciousness Revolution Email to Beta Testers
 * Sends the complete consciousness revolution announcement to all 47 beta testers
 */

import { Resend } from 'resend';
import { readFileSync } from 'fs';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Beta tester list - 47 consciousness pioneers
const betaTesters = [
  { email: 'kelly@soullab.life', name: 'Kelly Nezat' },
  { email: 'Nathan.Kane@thermofisher.com', name: 'Nathan Kane' },
  { email: 'JHRuder@gmail.com', name: 'Jason Ruder' },
  { email: 'tcdiamond70@gmail.com', name: 'Travis Diamond' },
  { email: 'andreanezat@gmail.com', name: 'Andrea Nezat' },
  { email: 'justin.boucher@gmail.com', name: 'Justin Boucher' },
  { email: 'phoenixrises123@gmail.com', name: 'Susan Bragg' },
  { email: 'mdaquin@gmail.com', name: 'Meagan d\'Aquin' },
  { email: 'plkoehn@gmail.com', name: 'Patrick Koehn' },
  { email: 'tamaramoorecolorado@gmail.com', name: 'Tamara Moore' },
  { email: 'loraleegeil@gmail.com', name: 'Loralee Geil' },
  { email: 'andreadfagan@gmail.com', name: 'Andrea Fagan' },
  { email: 'cececampbell1@gmail.com', name: 'Cece Campbell' },
  { email: 'zsuzsanna.ferenczi@icloud.com', name: 'Zsuzsanna Ferenczi' },
  { email: 'aceconomakis@gmail.com', name: 'Angela Economakis' },
  { email: 'Inhomesanctuary@gmail.com', name: 'Kristen Nezat' },
  { email: 'dougaforeman@gmail.com', name: 'Doug Foreman' },
  { email: 'richardcteissier27@icloud.com', name: 'Rick Tessier' },
  { email: 'jmountcastle@slateschool.org', name: 'Julie Mountcastle' },
  { email: 'dakotamundi@gmail.com', name: 'Kimberly Daugherty' },
  { email: 'Lruderlcsw@aol.com', name: 'Leonard Ruder' },
  { email: 'Dancyn3@aol.com', name: 'Cynthy Ruder' },
  { email: 'Ninaruder11@gmail.com', name: 'Nina Ruder' },
  { email: 'augustennezat@gmail.com', name: 'Augusten Nezat' },
  { email: 'snezat27@sacredhearthamden.org', name: 'Sophie Nezat' },
  { email: 'romeo@veydrisresearch.com', name: 'Romeo' },
  { email: 'sparkles1724@gmail.com', name: 'Stephen' },
  { email: 'weezie.delavergne@gmail.com', name: 'Weezie' },
  { email: 'koreyrichey@gmail.com', name: 'Korey' },
  { email: 'karenmccullen@hotmail.com', name: 'Karen' },
  { email: 'tashajam@gmail.com', name: 'Natasha' },
  { email: 'catherine@atthefield.uk', name: 'Catherine' },
  { email: 'thea@theapagel.com', name: 'Thea' },
  { email: 'vmiller@bmfcomms.com', name: 'Virginia' },
  { email: 'jondi@eft4results.com', name: 'Jondi' },
  { email: 'crownhouseone@gmail.com', name: 'Joseph' },
  { email: 'soullab1@gmail.com', name: 'Kelly Soullab' },
  { email: 'karapylant@outlook.com', name: 'Kara' },
  { email: 'cl@spiraldynamik.com', name: 'Christian' },
  { email: 'claudia.bayuelo@studiolabs.com', name: 'Claudia' },
  { email: 'nicolecasbarro@gmail.com', name: 'Nicole' },
  { email: 'dreyfus@dfpartners.swiss', name: 'Marie-Christine' },
  { email: 'cookielbl1146@gmail.com', name: 'Lorna Lamoureux' },
  { email: 'Yvonneland@gmail.com', name: 'Yvonne Landry' },
  { email: 'abcdunbar@gmail.com', name: 'Anna' },
  { email: 'Risako.stepetic@gmail.com', name: 'Risako' },
  { email: 'Whiteysart.katheline@icloud.com', name: 'Whitey Whitehurst' }
];

async function sendConsciousnessRevolution() {
  console.log('🧠 Sending Consciousness Revolution Announcement\n');
  console.log(`📧 Recipients: ${betaTesters.length} consciousness pioneers\n`);

  // Load the email HTML
  const htmlContent = readFileSync('/Users/soullab/MAIA-FRESH/beta-tester-email.html', 'utf8');

  let successCount = 0;
  let failCount = 0;
  const results: Array<{ email: string; status: 'success' | 'failed'; messageId?: string; error?: string }> = [];

  for (const tester of betaTesters) {
    try {
      console.log(`   Sending to ${tester.name} (${tester.email})...`);

      const { data, error } = await resend.emails.send({
        from: 'Soullab <hello@soullab.life>',
        to: [tester.email],
        subject: '🧠 The Consciousness Revolution Has Begun',
        html: htmlContent,
      });

      if (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        failCount++;
        results.push({ email: tester.email, status: 'failed', error: error.message });
      } else {
        console.log(`   ✅ Sent (ID: ${data?.id})`);
        successCount++;
        results.push({ email: tester.email, status: 'success', messageId: data?.id });
      }

      // Rate limiting - wait 100ms between emails to avoid hitting API limits
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
      failCount++;
      results.push({ email: tester.email, status: 'failed', error: error.message });
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SENDING COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📧 Total: ${betaTesters.length}`);

  if (failCount > 0) {
    console.log('\n❌ Failed recipients:');
    results.filter(r => r.status === 'failed').forEach(r => {
      console.log(`   • ${r.email}: ${r.error}`);
    });
  }

  console.log('\n🎉 The Consciousness Revolution announcement has been sent!');
}

// Run the send
sendConsciousnessRevolution().catch(error => {
  console.error('❌ Send script failed:', error);
  process.exit(1);
});
