import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRegisteredUsers() {
  console.log('\n🔍 Checking registered users...\n');

  // Check explorers table
  const { data: explorers, error: explorerError } = await supabase
    .from('explorers')
    .select('*')
    .order('signup_date', { ascending: false });

  console.log('📊 Explorers table:');
  if (explorerError) {
    console.error('Error:', explorerError);
  } else {
    console.log(`Found ${explorers?.length || 0} registered explorers`);
    explorers?.forEach((e, i) => {
      console.log(`  ${i + 1}. ${e.explorer_name} (${e.email}) - Status: ${e.status} - Signed up: ${e.signup_date || 'N/A'}`);
    });
  }

  // Check beta_users table
  const { data: betaUsers, error: betaError } = await supabase
    .from('beta_users')
    .select('*')
    .order('created_at', { ascending: false });

  console.log('\n📊 Beta Users table:');
  if (betaError) {
    console.error('Error:', betaError);
  } else {
    console.log(`Found ${betaUsers?.length || 0} beta users`);
    betaUsers?.forEach((u, i) => {
      console.log(`  ${i + 1}. ${u.email} - Sessions: ${u.session_count || 0}`);
    });
  }

  // Check users table (main users table) - query all fields we might need
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*');

  console.log('\n📊 Users table (all users):');
  if (usersError) {
    console.error('Error:', usersError);
  } else {
    console.log(`Found ${users?.length || 0} users`);
    const betaOnboarded = users?.filter(u => u.beta_onboarded_at) || [];
    console.log(`Beta onboarded: ${betaOnboarded.length}`);

    users?.slice(0, 10).forEach((u, i) => {
      const onboarded = u.beta_onboarded_at ? '✅' : '❌';
      console.log(`  ${i + 1}. ${onboarded} ${u.name} (${u.email}) - Last login: ${u.last_login || 'Never'}`);
    });
    if (users && users.length > 10) {
      console.log(`  ... and ${users.length - 10} more`);
    }
  }

  console.log('\n✅ Done!\n');
}

checkRegisteredUsers().catch(console.error);
