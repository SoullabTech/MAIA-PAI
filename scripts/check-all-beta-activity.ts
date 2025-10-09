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

async function checkAllActivity() {
  console.log('\n🔍 Checking ALL beta activity...\n');

  // Check explorers table
  const { data: explorers, error: explorerError } = await supabase
    .from('explorers')
    .select('*');

  console.log('📊 Explorers table:');
  if (explorerError) {
    console.error('Error:', explorerError);
  } else {
    console.log(`Found ${explorers?.length || 0} explorers`);
    explorers?.forEach((e, i) => {
      console.log(`  ${i + 1}. ${e.explorer_name} (${e.email}) - Status: ${e.status} - Signup: ${e.signup_date}`);
    });
  }

  // Check beta_users table
  const { data: betaUsers, error: betaError } = await supabase
    .from('beta_users')
    .select('*');

  console.log('\n📊 Beta Users table:');
  if (betaError) {
    console.error('Error:', betaError);
  } else {
    console.log(`Found ${betaUsers?.length || 0} beta users`);
    betaUsers?.forEach((u, i) => {
      console.log(`  ${i + 1}. ID: ${u.id} - Email: ${u.email} - Sessions: ${u.session_count || 0}`);
    });
  }

  // Check beta_access_sessions
  const { data: sessions, error: sessionsError } = await supabase
    .from('beta_access_sessions')
    .select('*');

  console.log('\n📊 Beta Access Sessions:');
  if (sessionsError) {
    console.error('Error:', sessionsError);
  } else {
    console.log(`Found ${sessions?.length || 0} sessions`);
    sessions?.forEach((s, i) => {
      console.log(`  ${i + 1}. Beta Access ID: ${s.beta_access_id} - Session: ${s.session_id} - Onboarding: ${s.onboarding_completed}`);
    });
  }

  // Check oracle_agents
  const { data: agents, error: agentsError} = await supabase
    .from('oracle_agents')
    .select('*');

  console.log('\n📊 Oracle Agents:');
  if (agentsError) {
    console.error('Error:', agentsError);
  } else {
    console.log(`Found ${agents?.length || 0} oracle agents`);
    agents?.forEach((a, i) => {
      console.log(`  ${i + 1}. User ID: ${a.user_id} - Name: ${a.name} - Archetype: ${a.archetype}`);
    });
  }

  // Check user_preferences
  const { data: prefs, error: prefsError } = await supabase
    .from('user_preferences')
    .select('*');

  console.log('\n📊 User Preferences:');
  if (prefsError) {
    console.error('Error:', prefsError);
  } else {
    console.log(`Found ${prefs?.length || 0} user preferences`);
    prefs?.forEach((p, i) => {
      console.log(`  ${i + 1}. User ID: ${p.user_id} - Voice enabled: ${p.voice_enabled} - Auto-play: ${p.auto_play_voice}`);
    });
  }

  console.log('\n✅ Done!\n');
}

checkAllActivity().catch(console.error);
