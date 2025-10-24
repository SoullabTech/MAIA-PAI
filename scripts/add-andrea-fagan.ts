import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function addAndreaFagan() {
  console.log('Adding Andrea Fagan to beta testers...');

  const email = 'andreadfagan@gmail.com';
  const explorerName = 'Andrea';
  const invitationCode = 'SOULLAB-ANDREAFAGAN';

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
      console.log('\n✅ Andrea is already in the database - no need to add!');

      // Check if she has birth chart data
      if (existingExplorer.birth_chart_data) {
        console.log('\n🌟 Andrea has birth chart data saved:');
        console.log('  Birth Date:', existingExplorer.birth_date);
        console.log('  Birth Time:', existingExplorer.birth_time);
        console.log('  Location:', existingExplorer.birth_location_name);
        console.log('  Calculated:', existingExplorer.birth_chart_calculated_at);
      } else {
        console.log('\nℹ️ Andrea has not entered birth chart data yet');
      }

      return;
    }

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

    console.log('✅ Andrea Fagan added to beta testers!');
    console.log('Explorer ID:', data[0].explorer_id);
    console.log('Explorer Name:', data[0].explorer_name);
    console.log('Invitation Code:', invitationCode);
    console.log('Andrea can now sign up with passcode: SOULLAB-ANDREAFAGAN');

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
          timezone: 'America/New_York', // Default
          privacy_mode: 'sanctuary',
          created_at: new Date().toISOString(),
          consent_date: new Date().toISOString(),
          evolution_level: 1.0,
          session_count: 0
        })
        .select();

      if (!betaError) {
        console.log('\n✅ Also added to beta_users table');
        console.log('Beta User ID:', betaUser[0].id);
      }
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the function
addAndreaFagan()
  .then(() => {
    console.log('\n✨ Script completed successfully');
    console.log('\nNext steps:');
    console.log('1. Andrea can log in with passcode: SOULLAB-ANDREAFAGAN');
    console.log('2. She may need to clear browser cache if still stuck');
    console.log('3. Her data will now save to the database permanently\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
