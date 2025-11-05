import { sendBetaInviteWithPasscode, BetaInviteWithPasscode } from '../lib/email/sendBetaInviteWithPasscode';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

/**
 * Send welcome email to Marie-Christine Dreyfus
 */

const marieChristine: BetaInviteWithPasscode = {
  name: 'Marie-Christine',
  email: 'dreyfus@dfpartners.swiss',
  passcode: 'SOULLAB-MARIECHRISTINE'
};

async function sendWelcomeEmail() {
  console.log('Sending welcome email to Marie-Christine Dreyfus...\n');

  const result = await sendBetaInviteWithPasscode(marieChristine, 'beta-passcode');

  if (result.success) {
    console.log('\n✅ Welcome email sent successfully!');
    console.log(`Email ID: ${result.id}`);
    console.log(`\nMarie-Christine can now:`);
    console.log(`1. Visit https://soullab.life/beta-signup`);
    console.log(`2. Enter passcode: SOULLAB-MARIECHRISTINE`);
    console.log(`3. Create her account and begin exploring MAIA`);
  } else {
    console.error('\n❌ Failed to send email:', result.error);
  }
}

sendWelcomeEmail()
  .then(() => {
    console.log('\nScript completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nScript failed:', error);
    process.exit(1);
  });
