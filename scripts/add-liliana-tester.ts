/**
 * Add Liliana Turcan to beta testers
 * Email: Lillyanneportraits@gmail.com
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addLilianaToBeta() {
  console.log('🌸 Adding Liliana Turcan to beta testers...');

  const email = 'Lillyanneportraits@gmail.com';
  const betaAccessCode = 'MAIA-BETA-' + Date.now();

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('✅ Liliana is already in the system!');
      console.log('User ID:', existingUser.id);
      console.log('Beta Access Code:', existingUser.beta_access_code);

      // Update to ensure beta access
      if (!existingUser.beta_access_code) {
        const { data, error } = await supabase
          .from('users')
          .update({
            beta_access_code: betaAccessCode,
            updated_at: new Date().toISOString()
          })
          .eq('email', email)
          .select();

        if (error) throw error;
        console.log('🔑 Beta access code added:', betaAccessCode);
      }

      return;
    }

    // Create new user with beta access
    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        sacred_name: 'Liliana',
        beta_access_code: betaAccessCode,
        user_intention: 'Beta tester - Portrait artist and creative soul',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;

    console.log('✅ Liliana added to beta testers!');
    console.log('User ID:', data[0].id);
    console.log('Beta Access Code:', betaAccessCode);
    console.log('');
    console.log('📧 Send Liliana this invite link:');
    console.log(`https://soullab.life/welcome?code=${betaAccessCode}`);

  } catch (error) {
    console.error('❌ Error adding Liliana:', error);
    throw error;
  }
}

addLilianaToBeta()
  .then(() => {
    console.log('');
    console.log('🌟 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
