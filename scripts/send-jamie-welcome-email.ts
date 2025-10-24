import { sendBatchInvitesWithPasscodes, BetaInviteWithPasscode } from '../lib/email/sendBetaInviteWithPasscode';

/**
 * Send welcome email to Jamie Cordero
 */

const newBetaTester: BetaInviteWithPasscode[] = [
  {
    name: 'Jamie',
    email: 'jcordero@sacredhearthamden.org',
    passcode: 'SOULLAB-JAMIE'
  }
];

async function sendJamieWelcomeEmail() {
  console.log('Sending welcome email to Jamie Cordero...\n');

  const result = await sendBatchInvitesWithPasscodes(
    newBetaTester,
    'beta-passcode', // Use passcode template
    2000 // 2 second delay between emails
  );

  console.log('\nWelcome email sent!');
  console.log('Summary:', result);

  if (result.failed > 0) {
    console.log('\nFailed emails:');
    result.results
      .filter(r => !r.success)
      .forEach(r => console.log(`  - ${r.name} (${r.email}): ${r.error}`));
  }
}

sendJamieWelcomeEmail()
  .then(() => {
    console.log('\nScript completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nScript failed:', error);
    process.exit(1);
  });
