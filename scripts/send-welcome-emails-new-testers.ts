import { sendBatchInvitesWithPasscodes, BetaInviteWithPasscode } from '../lib/email/sendBetaInviteWithPasscode';

/**
 * Send welcome emails to new beta testers:
 * - Dr. Christian Larsen
 * - Claudia Bayuelo
 * - Stephanie Schoss
 */

const newBetaTesters: BetaInviteWithPasscode[] = [
  {
    name: 'Christian',
    email: 'cl@spiraldynamik.com',
    passcode: 'SOULLAB-CHRISTIAN'
  },
  {
    name: 'Claudia',
    email: 'claudia.bayuelo@studiolabs.com',
    passcode: 'SOULLAB-CLAUDIA'
  },
  {
    name: 'Stephanie',
    email: 'stephanie@schoss.com',
    passcode: 'SOULLAB-STEPHANIE'
  }
];

async function sendWelcomeEmails() {
  console.log('Sending welcome emails to 3 new beta testers...\n');

  const result = await sendBatchInvitesWithPasscodes(
    newBetaTesters,
    'beta-passcode', // Use passcode template
    2000 // 2 second delay between emails
  );

  console.log('\nWelcome emails sent!');
  console.log('Summary:', result);

  if (result.failed > 0) {
    console.log('\nFailed emails:');
    result.results
      .filter(r => !r.success)
      .forEach(r => console.log(`  - ${r.name} (${r.email}): ${r.error}`));
  }
}

sendWelcomeEmails()
  .then(() => {
    console.log('\nScript completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nScript failed:', error);
    process.exit(1);
  });
