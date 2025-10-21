/**
 * Send catch-up email to Leah Emmerich (late join)
 * Includes: Welcome, Beta Handbook, key resources
 * Run with: npx tsx scripts/send-catchup-leah.ts
 */

const invite = {
  name: 'Leah Emmerich',
  firstName: 'Leah',
  email: 'LeachEmmerich@gmail.com',
  betaCode: 'SOULLAB-LEAH'
};

async function sendCatchup() {
  console.log('📚 Sending catch-up email to Leah Emmerich...\n');

  console.log(`📧 Sending to ${invite.name} (${invite.email})...`);

  try {
    // Send welcome email first
    const welcomeResponse = await fetch('http://localhost:3000/api/email/send-beta-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'single',
        template: 'beta-welcome',
        name: invite.name,
        email: invite.email,
        betaCode: invite.betaCode
      })
    });

    const welcomeResult = await welcomeResponse.json();

    if (welcomeResult.success) {
      console.log(`✅ Welcome email sent successfully\n`);
    } else {
      console.log(`❌ Failed to send welcome email: ${welcomeResult.error}\n`);
    }

    // Wait a bit, then send Monday announcement
    console.log('⏱️  Waiting 5 seconds before sending Monday announcement...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));

    const mondayResponse = await fetch('http://localhost:3000/api/email/send-beta-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'single',
        template: 'monday-oct21-modes-announcement',
        name: invite.name,
        email: invite.email,
        betaCode: invite.betaCode
      })
    });

    const mondayResult = await mondayResponse.json();

    if (mondayResult.success) {
      console.log(`✅ Monday announcement sent successfully\n`);
    } else {
      console.log(`❌ Failed to send Monday announcement: ${mondayResult.error}\n`);
    }

  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  console.log('✨ Done! Leah should now have:');
  console.log('   1. Beta welcome email with onboarding info');
  console.log('   2. Monday announcement (Beta Handbook + Conversation Modes)');
  console.log('   3. Access code: SOULLAB-LEAH\n');
}

sendCatchup();
