import { sendBetaInviteWithPasscode, BetaInviteWithPasscode } from '../lib/email/sendBetaInviteWithPasscode';

/**
 * Send welcome email to Nicole Casbarro
 */

const nicole: BetaInviteWithPasscode = {
  name: 'Nicole',
  email: 'nicolecasbarro@gmail.com',
  passcode: 'SOULLAB-NICOLE'
};

async function sendWelcomeEmail() {
  console.log('Sending welcome email to Nicole Casbarro...\n');

  const result = await sendBetaInviteWithPasscode(nicole, 'beta-passcode');

  if (result.success) {
    console.log('\n✅ Welcome email sent successfully!');
    console.log(`Email ID: ${result.id}`);
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
