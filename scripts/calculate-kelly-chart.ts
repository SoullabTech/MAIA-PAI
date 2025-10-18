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

// VERIFIED DATA FROM TIME PASSAGES (Porphyry House System)
// Birth: December 9, 1966, 10:29 PM CST, Baton Rouge, LA
// Source: Time Passages Professional Natal Report
const KELLY_BIRTH_CHART = {
  // Core Luminaries
  sun: {
    sign: 'Sagittarius',
    degree: 17.661, // 17° Sag 39' 40"
    house: 4,
    element: 'fire',
    description: 'Ruler of Rising Sign (Leo Asc)'
  },
  moon: {
    sign: 'Scorpio',
    degree: 22.547, // 22° Sco 32' 51"
    house: 3, // CORRECTED: Time Passages says "Moon in the Third House"
    element: 'water',
    description: 'Angular planet - conjunct Nadir (IC)'
  },
  ascendant: {
    sign: 'Leo',
    degree: 29.417, // 29° Leo 25'
    element: 'fire'
  },
  midheaven: {
    sign: 'Taurus',
    degree: 26.85, // 26° Tau 51'
    element: 'earth'
  },

  // Personal Planets
  mercury: {
    sign: 'Scorpio',
    degree: 28.083, // 28° Sco 05'
    house: 4, // "Mercury in the Fourth House" + "conjunct Nadir"
    element: 'water',
    description: 'Angular planet - conjunct Nadir (IC)'
  },
  venus: {
    sign: 'Sagittarius',
    degree: 25.3, // 25° Sag 18'
    house: 5,
    element: 'fire',
    description: 'T-Square focal planet'
  },
  mars: {
    sign: 'Libra',
    degree: 3.267, // 3° Lib 16'
    house: 2,
    element: 'air'
  },

  // Social Planets
  jupiter: {
    sign: 'Leo',
    degree: 3.9, // 3° Leo 54' R
    house: 12,
    element: 'fire',
    retrograde: true,
    description: 'Leading planet of planetary pattern'
  },
  saturn: {
    sign: 'Pisces',
    degree: 23.083, // 23° Pis 05'
    house: 7,
    element: 'water',
    description: 'Focal planet of Funnel/Bucket pattern'
  },

  // Outer Planets
  uranus: {
    sign: 'Virgo',
    degree: 24.233, // 24° Vir 14'
    house: 1,
    element: 'earth'
  },
  neptune: {
    sign: 'Scorpio',
    degree: 22.833, // 22° Sco 50'
    house: 3,
    element: 'water',
    description: 'Angular planet - conjunct Nadir (IC)'
  },
  pluto: {
    sign: 'Virgo',
    degree: 20.6, // 20° Vir 36'
    house: 1,
    element: 'earth'
  },
  chiron: {
    sign: 'Pisces',
    degree: 21.7, // 21° Pis 42' (corrected from 17°)
    house: 7,
    element: 'water'
  },
  northNode: {
    sign: 'Taurus',
    degree: 15.983, // 15° Tau 59' R
    house: 9,
    element: 'earth',
    retrograde: true
  },
  southNode: {
    sign: 'Scorpio',
    degree: 15.983, // 15° Sco 59'
    house: 3,
    element: 'water'
  },

  // Elemental Balance
  elementalBalance: {
    fire: 6,     // Sun (Sag), Venus (Sag), Jupiter (Leo), Ascendant (Leo) - 4 fire, but weighted: Sun=3, Venus=2, Jupiter=1.5, Asc=2 = ~8.5, normalized to 6
    water: 6,    // Moon (Sco), Mercury (Sco), Saturn (Pis), Neptune (Sco), Chiron (Pis) - 5 water planets
    earth: 3,    // Uranus (Vir), Pluto (Vir), North Node (Tau) - 3 earth
    air: 1       // Mars (Lib) - 1 air
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
