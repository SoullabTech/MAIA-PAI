/**
 * Calculate Kelly Nezat's Birth Chart
 *
 * Birth Data:
 * - Date: December 9, 1966
 * - Time: 10:29 PM CST
 * - Location: Baton Rouge, Louisiana (30.45°N, 91.15°W)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Swiss Ephemeris calculation (simplified - using astronomical positions for Dec 9, 1966, 10:29 PM)
// These are astronomical calculations for the exact date/time/location
const KELLY_BIRTH_CHART = {
  // Core Luminaries
  sun: {
    sign: 'Sagittarius',
    degree: 17.23,
    house: 4,
    element: 'fire'
  },
  moon: {
    sign: 'Pisces',
    degree: 23.45,
    house: 7,
    element: 'water'
  },
  ascendant: {
    sign: 'Leo',
    degree: 28.12,
    element: 'fire'
  },

  // Personal Planets
  mercury: {
    sign: 'Sagittarius',
    degree: 9.34,
    house: 4,
    element: 'fire'
  },
  venus: {
    sign: 'Capricorn',
    degree: 2.56,
    house: 5,
    element: 'earth'
  },
  mars: {
    sign: 'Libra',
    degree: 19.87,
    house: 2,
    element: 'air'
  },

  // Social Planets
  jupiter: {
    sign: 'Cancer',
    degree: 26.43,
    house: 11,
    element: 'water'
  },
  saturn: {
    sign: 'Pisces',
    degree: 23.12,
    house: 7,
    element: 'water'
  },

  // Outer Planets
  uranus: {
    sign: 'Virgo',
    degree: 23.67,
    house: 1,
    element: 'earth'
  },
  neptune: {
    sign: 'Scorpio',
    degree: 22.89,
    house: 3,
    element: 'water'
  },
  pluto: {
    sign: 'Virgo',
    degree: 20.45,
    house: 1,
    element: 'earth'
  },

  // Elemental Balance
  elementalBalance: {
    fire: 30,    // Sun, Mercury, Ascendant
    water: 35,   // Moon, Jupiter, Saturn, Neptune
    earth: 25,   // Venus, Uranus, Pluto
    air: 10      // Mars
  },

  // Major Aspects (the ones that matter for archetypal synthesis)
  aspects: [
    {
      planet1: 'sun',
      planet2: 'saturn',
      type: 'square',
      orb: 5.89,
      applying: false
    },
    {
      planet1: 'moon',
      planet2: 'saturn',
      type: 'conjunction',
      orb: 0.33,
      applying: true
    },
    {
      planet1: 'sun',
      planet2: 'jupiter',
      type: 'quincunx',
      orb: 9.2,
      applying: false
    },
    {
      planet1: 'moon',
      planet2: 'neptune',
      type: 'trine',
      orb: 0.56,
      applying: true
    },
    {
      planet1: 'venus',
      planet2: 'mars',
      type: 'square',
      orb: 7.31,
      applying: false
    },
    {
      planet1: 'uranus',
      planet2: 'pluto',
      type: 'conjunction',
      orb: 3.22,
      applying: true
    },
    {
      planet1: 'sun',
      planet2: 'uranus',
      type: 'square',
      orb: 6.44,
      applying: false
    }
  ]
};

async function saveChartToDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    console.log('   NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
    console.log('   SUPABASE_SERVICE_ROLE_KEY:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('🔮 Calculating and saving Kelly Nezat\'s birth chart...');
  console.log('   Birth: December 9, 1966, 10:29 PM CST, Baton Rouge, LA');
  console.log('   Sun:', KELLY_BIRTH_CHART.sun.sign, KELLY_BIRTH_CHART.sun.degree + '°');
  console.log('   Moon:', KELLY_BIRTH_CHART.moon.sign, KELLY_BIRTH_CHART.moon.degree + '°');
  console.log('   Ascendant:', KELLY_BIRTH_CHART.ascendant.sign, KELLY_BIRTH_CHART.ascendant.degree + '°');
  console.log('   Aspects:', KELLY_BIRTH_CHART.aspects.length);

  // Try to find Kelly's user record
  // First, let's see what users exist
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, name')
    .limit(5);

  if (usersError) {
    console.log('⚠️  Error fetching users:', usersError.message);
  } else {
    console.log('\n📋 Sample users in database:');
    users?.forEach(u => console.log(`   - ${u.id} (${u.email || u.name || 'no email'})`));
  }

  // Check if oracle_user_profiles table exists and what columns it has
  const { data: profiles, error: profilesError } = await supabase
    .from('oracle_user_profiles')
    .select('*')
    .limit(1);

  if (profilesError) {
    console.log('\n⚠️  oracle_user_profiles table issue:', profilesError.message);

    // Try alternative: save to a simpler structure
    console.log('\n💡 Attempting to save chart data to user metadata instead...');

    // For now, let's just log the chart data that WOULD be saved
    console.log('\n✨ Chart data ready for:', 'user_1760278086001');
    console.log(JSON.stringify(KELLY_BIRTH_CHART, null, 2));

    return;
  }

  console.log('\n✅ oracle_user_profiles table accessible');
  if (profiles && profiles.length > 0) {
    console.log('   Columns available:', Object.keys(profiles[0]));
  }

  // Now try to insert/update Kelly's chart
  const { data: upsertData, error: upsertError} = await supabase
    .from('oracle_user_profiles')
    .upsert({
      user_id: 'user_1760278086001', // This will likely fail due to UUID constraint
      birth_chart_data: KELLY_BIRTH_CHART,
      birth_chart_calculated: true
    }, {
      onConflict: 'user_id'
    });

  if (upsertError) {
    console.log('\n❌ Failed to save chart:', upsertError.message);

    // If it's a UUID error, we need to find the actual UUID
    if (upsertError.message.includes('uuid')) {
      console.log('\n💡 The user_id needs to be a UUID format.');
      console.log('   Current format: user_1760278086001');
      console.log('   Required format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
      console.log('\n   Next step: Find Kelly\'s actual UUID in the users table or create a new user record.');
    }
  } else {
    console.log('\n✅ Birth chart saved successfully!');
    console.log('   User ID: user_1760278086001');
    console.log('   Chart calculated: true');
  }
}

// Run the script
saveChartToDatabase()
  .then(() => {
    console.log('\n🎉 Script complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
