import { createClient } from '@supabase/supabase-js';
import { sendBetaInviteWithPasscode } from '../lib/email/sendBetaInviteWithPasscode';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function addChrisWatkins() {
  console.log('Adding Chris Watkins to beta testers...');

  const email = 'Chris.Watkins@yale.edu';
  const explorerName = 'Chris';
  const invitationCode = 'SOULLAB-CHRIS';

  try {
    // Check if explorer already exists
    const { data: existingExplorer, error: checkError } = await supabase
      .from('explorers')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existingExplorer) {
      console.log('✅ Explorer already exists in the system!');
      console.log('Explorer ID:', existingExplorer.explorer_id);
      console.log('Explorer Name:', existingExplorer.explorer_name);
      console.log('Email:', existingExplorer.email);
      console.log('Invitation Code:', existingExplorer.invitation_code);
      console.log('Status:', existingExplorer.status);
    } else {
      // Create new explorer
      const { data, error } = await supabase
        .from('explorers')
        .insert({
          explorer_name: explorerName,
          email,
          invitation_code: invitationCode,
          agreement_accepted: false,
          signup_date: new Date().toISOString(),
          status: 'active',
          week_number: 1,
          arc_level: 1,
          session_count: 0
        })
        .select();

      if (error) {
        console.error('Error adding explorer:', error);
        throw error;
      }

      console.log('✅ Chris Watkins added to beta testers!');
      console.log('Explorer ID:', data[0].explorer_id);
      console.log('Explorer Name:', data[0].explorer_name);
      console.log('Invitation Code:', invitationCode);
      console.log('Passcode: SOULLAB-CHRIS');
    }

    // Also add to beta_users table for email tracking
    const { data: existingBetaUser } = await supabase
      .from('beta_users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!existingBetaUser) {
      const { data: betaUser, error: betaError } = await supabase
        .from('beta_users')
        .insert({
          email,
          timezone: 'America/New_York', // Default - Chris is at Yale
          privacy_mode: 'sanctuary',
          created_at: new Date().toISOString(),
          consent_date: new Date().toISOString(),
          evolution_level: 1.0,
          session_count: 0
        })
        .select();

      if (!betaError) {
        console.log('✅ Also added to beta_users table');
        console.log('Beta User ID:', betaUser[0].id);
      }
    }

    // Send welcome email with passcode
    console.log('\n📧 Sending welcome email...');
    const emailResult = await sendBetaInviteWithPasscode(
      {
        name: explorerName,
        email,
        passcode: invitationCode
      },
      'beta-welcome'
    );

    if (emailResult.success) {
      console.log('✅ Welcome email sent successfully!');
      console.log('Email ID:', emailResult.id);
    } else {
      console.log('⚠️  Database entry created but email failed:', emailResult.error);
      console.log('You can manually send the passcode: SOULLAB-CHRIS');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the function
addChrisWatkins()
  .then(() => {
    console.log('\n✨ Script completed successfully');
    console.log('\n📝 Summary:');
    console.log('- Chris Watkins added to beta testing group');
    console.log('- Email: Chris.Watkins@yale.edu');
    console.log('- Passcode: SOULLAB-CHRIS');
    console.log('- Welcome email sent with access instructions');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
