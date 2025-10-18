import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function addKaraToBeta() {
  console.log('🌸 Adding Kara Lynn Pylant to beta testers...');

  const email = 'karapylant@outlook.com';
  const betaAccessCode = 'MAIA-BETA-KARA-' + Date.now();

  try {
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser && !checkError) {
      console.log('✅ User already exists in the system!');
      console.log('User ID:', existingUser.id);
      console.log('Email:', existingUser.email);
      console.log('Existing Beta Code:', existingUser.beta_access_code);

      // Update beta access code if needed
      if (!existingUser.beta_access_code) {
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            beta_access_code: betaAccessCode,
            sacred_name: existingUser.sacred_name || 'Kara',
            user_intention: existingUser.user_intention || 'Beta tester',
            updated_at: new Date().toISOString()
          })
          .eq('email', email)
          .select();

        if (updateError) {
          console.error('❌ Error updating user:', updateError);
        } else {
          console.log('✅ Updated user with beta access code:', betaAccessCode);
        }
      }
    } else {
      // Create new user with beta access
      const { data, error } = await supabase
        .from('users')
        .insert({
          email,
          sacred_name: 'Kara',
          beta_access_code: betaAccessCode,
          user_intention: 'Beta tester',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('❌ Error adding user:', error);
        throw error;
      }

      console.log('✅ Kara Lynn Pylant added to beta testers!');
      console.log('User ID:', data[0].id);
      console.log('Beta Access Code:', betaAccessCode);
      console.log('📧 Send Kara this invite link:');
      console.log(`https://soullab.life/welcome?code=${betaAccessCode}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the function
addKaraToBeta()
  .then(() => {
    console.log('✨ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
