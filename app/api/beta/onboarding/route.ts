import { NextRequest, NextResponse } from 'next/server';
import { userStore } from '@/lib/storage/userStore';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log('Beta onboarding data received:', {
      explorerId: data.explorerId,
      name: data.name,
      hasAge: !!data.age,
      hasPronouns: !!data.pronouns,
      hasLocation: !!data.location,
      hasBiography: !!data.biography,
      hasFiles: !!data.uploadedFiles?.length,
      greetingStyle: data.greetingStyle,
      communicationPreference: data.communicationPreference,
      focusAreas: data.focusAreas,
      researchConsent: data.researchConsent
    });

    // Generate a proper UUID for database storage
    const userId = randomUUID();

    // Save to in-memory store (for server-side access)
    const savedUser = userStore.saveUser({
      userId,
      explorerId: data.explorerId,
      explorerName: data.explorerName,
      name: data.name,
      email: data.email,
      age: data.age,
      pronouns: data.pronouns,
      location: data.location,
      biography: data.biography,
      greetingStyle: data.greetingStyle,
      communicationPreference: data.communicationPreference,
      explorationLens: data.explorationLens,
      wisdomFacets: data.wisdomFacets,
      focusAreas: data.focusAreas,
      researchConsent: data.researchConsent,
    });

    console.log('✅ User data saved to server storage:', savedUser.userId, savedUser.name);

    // Save to Supabase (for cross-device persistence)
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // beta_users table requires UUID, not string
      // Skip beta_users for now - we'll use explorers as primary source
      console.log('ℹ️  Skipping beta_users (schema issues), using explorers instead');

      // Skip oracle_agents and user_preferences for now due to schema issues
      // These aren't critical for tracking beta users
      console.log('ℹ️  Skipping oracle_agents and user_preferences (schema issues)');

      // Update explorers table - change status from 'invited' to 'active' and mark onboarded
      const { error: explorerError } = await supabase
        .from('explorers')
        .update({
          explorer_name: data.explorerName || data.name,
          email: data.email,
          status: 'active',
          beta_onboarded: true
        })
        .eq('explorer_id', data.explorerId);

      // If update didn't work (user not found), insert new record
      if (explorerError) {
        console.log('⚠️ Update failed, creating new explorer record:', explorerError.message);
        const { error: insertError } = await supabase
          .from('explorers')
          .insert({
            explorer_id: userId,
            explorer_name: data.explorerName || data.name,
            email: data.email,
            status: 'active',
            signup_date: new Date().toISOString(),
            beta_onboarded: true,
            invitation_code: data.betaAccessCode
          });

        if (insertError) {
          throw new Error(`Failed to register in explorers table: ${insertError.message}`);
        }
      }

      console.log('✅ User onboarding complete in explorers table:', data.explorerId, data.explorerName || data.name);

    } catch (supabaseError) {
      console.error('❌ CRITICAL: Failed to save user to Supabase:', supabaseError);
      // This is a critical error - we should know about it
      return NextResponse.json(
        { success: false, error: 'Failed to save user data', details: supabaseError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding data saved successfully',
      userId: savedUser.userId,
      user: savedUser
    });
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save onboarding data' },
      { status: 500 }
    );
  }
}