/**
 * Send beta invitation to Jeremy Larson
 * Run with: npx tsx scripts/send-invite-jeremy.ts
 */

const invite = {
  name: 'Jeremy Larson',
  email: 'Jeremylarson76@gmail.com',
  passcode: 'SOULLAB-JEREMY'
};

async function sendInvite() {
  console.log('🎯 Sending beta invitation to Jeremy Larson...\n');

  console.log(`📧 Sending to ${invite.name} (${invite.email})...`);

  try {
    const response = await fetch('http://localhost:3000/api/email/send-beta-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'single',
        template: 'beta-welcome',
        name: invite.name,
        email: invite.email,
        passcode: invite.passcode
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log(`✅ Sent successfully to ${invite.name}\n`);
      console.log(`   Passcode: ${invite.passcode}`);
    } else {
      console.log(`❌ Failed to send to ${invite.name}: ${result.error}\n`);
    }
  } catch (error: any) {
    console.log(`❌ Error sending to ${invite.name}: ${error.message}\n`);
  }

  console.log('✨ Done!');
}

sendInvite();
