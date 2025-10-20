/**
 * Migrate Beta User to Supabase
 *
 * This script creates a Supabase user record for a beta localStorage user,
 * enabling them to use database storage while keeping their existing ID.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface BetaUser {
  id: string;
  username: string;
  birthDate?: string;
  intention?: string;
  createdAt: string;
}

/**
 * Migrate a beta user to Supabase
 */
async function migrateBetaUser(betaUser: BetaUser) {
  console.log('📦 Migrating beta user to Supabase:', betaUser.username);
  console.log('   User ID:', betaUser.id);

  try {
    // 1. Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, name')
      .eq('id', betaUser.id)
      .single();

    if (existingUser) {
      console.log('✅ User already exists in Supabase:', existingUser.name);
      return { success: true, alreadyExists: true, user: existingUser };
    }

    // 2. Create user in the users table
    console.log('💾 Creating user in Supabase users table...');
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        id: betaUser.id,
        name: betaUser.username,
        email: `${betaUser.id}@beta.soullab.local`, // Placeholder email for beta users
        created_at: betaUser.createdAt,
        last_login: new Date().toISOString()
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ Failed to create user:', userError.message);
      return { success: false, error: userError };
    }

    console.log('✅ User created in Supabase:', newUser.id);

    // 3. Create oracle_user_profile if birth data exists
    if (betaUser.birthDate) {
      console.log('🌟 Creating oracle user profile with birth data...');

      const { data: profile, error: profileError } = await supabase
        .from('oracle_user_profiles')
        .insert({
          user_id: betaUser.id,
          birth_date: betaUser.birthDate,
          intention: betaUser.intention,
          created_at: betaUser.createdAt
        })
        .select()
        .single();

      if (profileError) {
        console.warn('⚠️ Could not create oracle profile:', profileError.message);
      } else {
        console.log('✅ Oracle profile created');
      }
    }

    return { success: true, alreadyExists: false, user: newUser };

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    return { success: false, error };
  }
}

/**
 * Read beta user from localStorage JSON string
 */
async function migrateBetaUserFromJSON(jsonString: string) {
  try {
    const betaUser = JSON.parse(jsonString) as BetaUser;

    if (!betaUser.id || !betaUser.username) {
      console.error('❌ Invalid beta user data. Required: id, username');
      return;
    }

    console.log('\n🚀 Starting beta user migration...\n');
    const result = await migrateBetaUser(betaUser);

    if (result.success) {
      console.log('\n✅ Migration completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Your user is now in Supabase with ID:', betaUser.id);
      console.log('2. Journal entries will now save to the database');
      console.log('3. Your localStorage data is preserved');
      console.log('4. Refresh your browser to use the new setup\n');
    } else {
      console.log('\n❌ Migration failed. See errors above.\n');
    }

  } catch (error: any) {
    console.error('❌ Error parsing beta user JSON:', error.message);
    console.log('\nUsage:');
    console.log('  ts-node scripts/migrate-beta-user-to-supabase.ts \'{"id":"user_123","username":"YourName"}\'');
    console.log('\nOr read from localStorage:');
    console.log('  1. Open browser console on /maia page');
    console.log('  2. Run: localStorage.getItem("beta_user")');
    console.log('  3. Copy the output and pass it to this script');
  }
}

// Run migration
const betaUserJSON = process.argv[2];

if (!betaUserJSON) {
  console.log('❌ No beta user data provided\n');
  console.log('Usage:');
  console.log('  ts-node scripts/migrate-beta-user-to-supabase.ts \'{"id":"user_123","username":"YourName","createdAt":"2024-01-01T00:00:00.000Z"}\'');
  console.log('\nOr to get your beta_user data:');
  console.log('  1. Open browser console on /maia page');
  console.log('  2. Run: console.log(localStorage.getItem("beta_user"))');
  console.log('  3. Copy the output and pass it to this script\n');
  process.exit(1);
}

migrateBetaUserFromJSON(betaUserJSON);
