import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function addChristianLarsen() {
  console.log('Adding Dr. Christian Larsen to beta testers...');

  const email = 'cl@spiraldynamik.com';
  const explorerName = 'Christian';
  const invitationCode = 'SOULLAB-CHRISTIAN';

  try {
    // Check if explorer already exists
    const { data: existingExplorer, error: checkError } = await supabase
      .from('explorers')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existingExplorer) {
      console.log('Explorer already exists in the system!');
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

      console.log('Dr. Christian Larsen added to beta testers!');
      console.log('Explorer ID:', data[0].explorer_id);
      console.log('Explorer Name:', data[0].explorer_name);
      console.log('Invitation Code:', invitationCode);
      console.log('Dr. Christian can now sign up with passcode: SOULLAB-CHRISTIAN');
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
          timezone: 'Europe/Zurich', // Default for Switzerland
          privacy_mode: 'sanctuary',
          created_at: new Date().toISOString(),
          consent_date: new Date().toISOString(),
          evolution_level: 1.0,
          session_count: 0
        })
        .select();

      if (!betaError) {
        console.log('Also added to beta_users table');
        console.log('Beta User ID:', betaUser[0].id);
      }
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the function
addChristianLarsen()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
