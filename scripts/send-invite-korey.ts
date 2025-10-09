/**
 * Send beta invitation to Korey Richey
 * Run with: npx tsx scripts/send-invite-korey.ts
 */

const invite = {
  name: 'Korey Richey',
  email: '[NEED EMAIL]' // TODO: Update with actual email
};

async function sendInvite() {
  console.log('🎯 Sending beta invitation to Korey Richey...\n');

  if (invite.email === '[NEED EMAIL]') {
    console.log('❌ Error: Please update Korey\'s email address before running this script');
    console.log('   Edit this file and replace [NEED EMAIL] with the actual email');
    process.exit(1);
  }

  console.log(`📧 Sending to ${invite.name} (${invite.email})...`);

  try {
    const response = await fetch('http://localhost:3000/api/email/send-beta-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'single',
        template: 'beta-invitation',
        name: invite.name,
        email: invite.email
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log(`✅ Sent successfully to ${invite.name}\n`);
    } else {
      console.log(`❌ Failed to send to ${invite.name}: ${result.error}\n`);
    }
  } catch (error) {
    console.log(`❌ Error sending to ${invite.name}: ${error.message}\n`);
  }

  console.log('✨ Done!');
}

sendInvite();