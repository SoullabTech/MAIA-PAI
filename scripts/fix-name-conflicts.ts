/**
 * Fix Name Conflicts - Andrea and Kelly
 *
 * Add the two testers who had duplicate name conflicts with unique names
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixNameConflicts() {
  console.log('Fixing name conflicts for Andrea and Kelly...\n');

  // 1. Andrea Nezat - use "Andrea N" to distinguish from Andrea Fagan
  console.log('[1/2] Adding Andrea Nezat...');
  const { data: andrea, error: andreaError } = await supabase
    .from('explorers')
    .insert({
      explorer_name: 'Andrea N',  // Unique name
      email: 'andreanezat@gmail.com',
      invitation_code: 'SOULLAB-ANDREA',
      agreement_accepted: false,
      signup_date: new Date().toISOString(),
      status: 'active',
      week_number: 1,
      arc_level: 1,
      session_count: 0
    })
    .select()
    .single();

  if (andreaError) {
    console.log('❌ Error adding Andrea:', andreaError.message);
  } else {
    console.log('✅ Andrea Nezat added as "Andrea N"');
    console.log('   Explorer ID:', andrea.explorer_id);
    console.log('   Email:', andrea.email);
    console.log('   Passcode: SOULLAB-ANDREA\n');

    // Add to beta_users
    await supabase.from('beta_users').insert({
      email: 'andreanezat@gmail.com',
      timezone: 'America/New_York',
      privacy_mode: 'sanctuary',
      created_at: new Date().toISOString(),
      consent_date: new Date().toISOString(),
      evolution_level: 1.0,
      session_count: 0
    });
  }

  // 2. Kelly - Check if already exists, if not add
  console.log('[2/2] Checking Kelly (Founder)...');
  const { data: existingKelly } = await supabase
    .from('explorers')
    .select('*')
    .eq('email', 'soullab1@gmail.com')
    .maybeSingle();

  if (existingKelly) {
    console.log('✓ Kelly already exists in database');
    console.log('   Explorer ID:', existingKelly.explorer_id);
    console.log('   Name:', existingKelly.explorer_name);
    console.log('   Email:', existingKelly.email);
  } else {
    // Kelly doesn't exist - add her
    const { data: kelly, error: kellyError } = await supabase
      .from('explorers')
      .insert({
        explorer_name: 'Kelly (Founder)',  // Distinguishing name
        email: 'soullab1@gmail.com',
        invitation_code: 'SOULLAB-KELLY',
        agreement_accepted: true,  // Founder - already agreed
        signup_date: new Date().toISOString(),
        status: 'active',
        week_number: 1,
        arc_level: 1,
        session_count: 0
      })
      .select()
      .single();

    if (kellyError) {
      console.log('❌ Error adding Kelly:', kellyError.message);
    } else {
      console.log('✅ Kelly added as "Kelly (Founder)"');
      console.log('   Explorer ID:', kelly.explorer_id);
      console.log('   Passcode: SOULLAB-KELLY');

      // Add to beta_users
      await supabase.from('beta_users').insert({
        email: 'soullab1@gmail.com',
        timezone: 'America/New_York',
        privacy_mode: 'sanctuary',
        created_at: new Date().toISOString(),
        consent_date: new Date().toISOString(),
        evolution_level: 1.0,
        session_count: 0
      });
    }
  }

  console.log('\n✨ Name conflicts resolved!');
  console.log('\nBoth can now log in with:');
  console.log('  • Andrea Nezat: SOULLAB-ANDREA');
  console.log('  • Kelly: SOULLAB-KELLY\n');
}

fixNameConflicts()
  .then(() => {
    console.log('Script completed successfully\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
