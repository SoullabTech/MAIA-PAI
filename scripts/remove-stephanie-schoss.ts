import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function removeStephanieSchoss() {
  console.log('Removing Stephanie Schoss from beta testers...');

  const email = 'stephanie@schoss.com';

  try {
    // Remove from explorers table
    const { error: explorersError } = await supabase
      .from('explorers')
      .delete()
      .eq('email', email);

    if (explorersError) {
      console.error('Error removing from explorers:', explorersError);
    } else {
      console.log('✓ Removed from explorers table');
    }

    // Remove from beta_users table
    const { error: betaUsersError } = await supabase
      .from('beta_users')
      .delete()
      .eq('email', email);

    if (betaUsersError) {
      console.error('Error removing from beta_users:', betaUsersError);
    } else {
      console.log('✓ Removed from beta_users table');
    }

    console.log('\nStephanie Schoss has been removed from the beta tester list.');
    console.log('Email:', email);
    console.log('Passcode: SOULLAB-STEPHANIE (deactivated)');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the function
removeStephanieSchoss()
  .then(() => {
    console.log('\nScript completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
