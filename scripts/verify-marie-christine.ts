import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyMarieChristine() {
  console.log('🔍 Verifying Marie-Christine in beta system...\n');

  const email = 'dreyfus@dfpartners.swiss';

  // Check explorers table
  const { data: explorer, error: explorerError } = await supabase
    .from('explorers')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (explorer) {
    console.log('✅ Found in explorers table:');
    console.log('   Explorer ID:', explorer.explorer_id);
    console.log('   Explorer Name:', explorer.explorer_name);
    console.log('   Email:', explorer.email);
    console.log('   Invitation Code:', explorer.invitation_code);
    console.log('   Status:', explorer.status);
    console.log('   Signup Date:', explorer.signup_date);
  } else {
    console.log('❌ Not found in explorers table');
    if (explorerError) console.error('   Error:', explorerError);
  }

  console.log('');

  // Check beta_users table
  const { data: betaUser, error: betaError } = await supabase
    .from('beta_users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (betaUser) {
    console.log('✅ Found in beta_users table:');
    console.log('   Beta User ID:', betaUser.id);
    console.log('   Email:', betaUser.email);
    console.log('   Timezone:', betaUser.timezone);
    console.log('   Privacy Mode:', betaUser.privacy_mode);
    console.log('   Created At:', betaUser.created_at);
  } else {
    console.log('❌ Not found in beta_users table');
    if (betaError) console.error('   Error:', betaError);
  }

  console.log('\n📋 Summary:');
  console.log('   Marie-Christine can sign up at: https://soullab.life/beta-signup');
  console.log('   Passcode: SOULLAB-MARIECHRISTINE');
  console.log('   Email: dreyfus@dfpartners.swiss');
}

verifyMarieChristine()
  .then(() => {
    console.log('\n✅ Verification complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  });
