/**
 * Send beta invitations to Stephen Clayton and Weezie DeLavergne
 * Run with: npx tsx scripts/send-invites-stephen-weezie.ts
 */

const invites = [
  { name: 'Stephen Clayton', email: 'sparkles1724@gmail.com' },
  { name: 'Weezie DeLavergne', email: 'weezie.delavergne@gmail.com' }
];

async function sendInvites() {
  console.log('🎯 Sending beta invitations...\n');

  for (const invite of invites) {
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
  }

  console.log('✨ Done!');
}

sendInvites();