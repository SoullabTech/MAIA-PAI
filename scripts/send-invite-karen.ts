/**
 * Send beta invitation to Karen McCullen
 * Run with: npx tsx scripts/send-invite-karen.ts
 */

const invite = {
  name: 'Karen McCullen',
  email: 'karenmccullen@hotmail.com'
};

async function sendInvite() {
  console.log('🎯 Sending beta invitation to Karen McCullen...\n');

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