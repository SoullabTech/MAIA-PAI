import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local', override: true });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkMarc() {
  console.log('🔍 Checking Marc Schlosser status...\n');

  // Check beta_invitations
  const { data: invitation, error: invError } = await supabase
    .from('beta_invitations')
    .select('*')
    .eq('email', 'marcschlosser@gmail.com')
    .single();

  console.log('📧 Beta Invitation:');
  if (invError) {
    console.log('❌ Not found in beta_invitations');
  } else {
    console.log('✅ Found:', JSON.stringify(invitation, null, 2));
  }

  // Check beta_users
  const { data: betaUser, error: betaError } = await supabase
    .from('beta_users')
    .select('*')
    .eq('email', 'marcschlosser@gmail.com')
    .single();

  console.log('\n👤 Beta User:');
  if (betaError) {
    console.log('❌ Not found in beta_users');
  } else {
    console.log('✅ Found:', JSON.stringify(betaUser, null, 2));
  }

  // Check explorers
  const { data: explorer, error: explError } = await supabase
    .from('explorers')
    .select('*')
    .eq('email', 'marcschlosser@gmail.com')
    .single();

  console.log('\n🧭 Explorer:');
  if (explError) {
    console.log('❌ Not found in explorers');
  } else {
    console.log('✅ Found:', JSON.stringify(explorer, null, 2));
  }
}

checkMarc();
