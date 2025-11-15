/**
 * Beta Authentication Module
 * Handles beta user access and permissions
 */

import { ganeshaContacts } from '../ganesha/contacts';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client for server-side operations when needed
function createSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('[BetaAuth] Supabase environment variables not available during build');
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export interface BetaUser {
  id: string;
  email: string;
  hasAccess: boolean;
}

export interface BetaVerificationResult {
  valid: boolean;
  explorerId?: string;
  name?: string;
  email?: string;
  referralCode?: string;
  referredBy?: string;
  totalReferrals?: number;
  isLegacyInvite?: boolean;
}

export async function checkBetaAccess(userId: string): Promise<boolean> {
  // Stub implementation - returns true for development
  return true;
}

export async function getBetaUser(userId: string): Promise<BetaUser | null> {
  // Stub implementation
  return {
    id: userId,
    email: 'user@example.com',
    hasAccess: true,
  };
}

export async function grantBetaAccess(userId: string): Promise<void> {
  // Stub implementation
  console.log(`Granted beta access to user: ${userId}`);
}

export async function revokeBetaAccess(userId: string): Promise<void> {
  // Stub implementation
  console.log(`Revoked beta access from user: ${userId}`);
}

export async function verifyBetaCode(code: string): Promise<BetaVerificationResult> {
  try {
    console.log('🔍 Verifying beta code:', code);

    // SPECIAL CASE: Nicole Casbarro approved for direct access
    if (code === 'NICOLE-DIRECT' || code === 'nicolecasbarro@gmail.com') {
      console.log('✅ Special approval: Nicole Casbarro direct access');
      return {
        valid: true,
        explorerId: 'nicole-casbarro-direct',
        name: 'Nicole Casbarro',
        email: 'nicolecasbarro@gmail.com'
      };
    }

    const supabaseAdmin = createSupabaseAdmin();
    if (!supabaseAdmin) {
      console.warn('[BetaAuth] Supabase not available, falling back to Ganesha contacts only');
      // Skip database checks, go directly to Ganesha fallback
    } else {
      // PRIORITY 1: Check for referral codes (FIRSTNAME-REF-##)
      const referralMatch = code.match(/^([A-Z]+)-REF-(\d{2})$/);
      if (referralMatch) {
        const [, referrerName, refNumber] = referralMatch;

        const { data: referralCode, error } = await supabaseAdmin
          .from('referral_codes')
          .select('*, owner:beta_testers!owner_user_id(username, email)')
          .eq('code', code)
          .eq('is_used', false)
          .single();

        if (referralCode && !error) {
          console.log('✅ Found valid referral code:', {
            code,
            owner: referralCode.owner.username,
            refNumber
          });

          return {
            valid: true,
            explorerId: `ref-${code.toLowerCase()}`,
            name: `Friend of ${referralCode.owner.username}`, // Will be updated when they complete signup
            email: '', // Will be captured during signup
            referralCode: code,
            referredBy: referralCode.owner_user_id
          };
        }
      }

      // PRIORITY 2: Check beta_testers table for direct signup betaAccessIds
      const { data: betaTester, error } = await supabaseAdmin
        .from('beta_testers')
        .select('user_id, username, email, onboarding_completed, referred_by, total_referrals')
        .eq('user_id', code)
        .single();

      if (betaTester && !error) {
        console.log('✅ Found beta tester in database:', {
          userId: betaTester.user_id,
          username: betaTester.username,
          email: betaTester.email,
          referrals: betaTester.total_referrals
        });

        return {
          valid: true,
          explorerId: betaTester.user_id,
          name: betaTester.username,
          email: betaTester.email,
          totalReferrals: betaTester.total_referrals
        };
      }
    }

    // PRIORITY 3: Check ganeshaContacts for SOULLAB-* codes (legacy/direct invites)
    const contact = ganeshaContacts.find(contact =>
      contact.metadata?.passcode === code
    );

    if (contact) {
      console.log('✅ Found SOULLAB contact in Ganesha:', {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        code
      });

      return {
        valid: true,
        explorerId: contact.id,
        name: contact.name,
        email: contact.email,
        isLegacyInvite: true
      };
    }

    console.warn('❌ Beta code not found in any system:', code);
    return { valid: false };

  } catch (error) {
    console.error('❌ Error verifying beta code:', error);

    // Fallback to Ganesha contacts only if database fails
    const contact = ganeshaContacts.find(contact =>
      contact.metadata?.passcode === code
    );

    if (contact) {
      console.log('✅ Fallback: Found in Ganesha contacts');
      return {
        valid: true,
        explorerId: contact.id,
        name: contact.name,
        email: contact.email,
        isLegacyInvite: true
      };
    }

    return { valid: false };
  }
}

/**
 * Generate referral codes for a beta tester
 */
export async function generateReferralCodes(userId: string, userName: string, count: number = 10): Promise<string[]> {
  try {
    const supabaseAdmin = createSupabaseAdmin();
    if (!supabaseAdmin) {
      console.warn('[BetaAuth] Supabase not available, cannot generate referral codes');
      return [];
    }

    const codes = [];
    const basePrefix = userName.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 8);

    for (let i = 1; i <= count; i++) {
      const code = `${basePrefix}-REF-${i.toString().padStart(2, '0')}`;
      codes.push(code);

      // Insert into referral_codes table
      await supabaseAdmin
        .from('referral_codes')
        .insert({
          id: `ref-${userId}-${i}`,
          owner_user_id: userId,
          code: code,
          is_used: false
        });
    }

    console.log(`✅ Generated ${count} referral codes for ${userName}:`, codes);
    return codes;
  } catch (error) {
    console.error('❌ Error generating referral codes:', error);
    return [];
  }
}

/**
 * Mark referral code as used and track conversion
 */
export async function useReferralCode(code: string, newUserId: string, newUserEmail: string): Promise<boolean> {
  try {
    const supabaseAdmin = createSupabaseAdmin();
    if (!supabaseAdmin) {
      console.warn('[BetaAuth] Supabase not available, cannot track referral code usage');
      return false;
    }

    // Mark code as used
    const { data: updatedCode, error } = await supabaseAdmin
      .from('referral_codes')
      .update({
        is_used: true,
        used_by_user_id: newUserId,
        used_at: new Date().toISOString()
      })
      .eq('code', code)
      .select('owner_user_id')
      .single();

    if (error || !updatedCode) {
      console.error('❌ Failed to mark referral code as used:', error);
      return false;
    }

    // Update referrer's total count
    await supabaseAdmin
      .from('beta_testers')
      .update({
        total_referrals: supabaseAdmin.sql`total_referrals + 1`,
        referral_codes_remaining: supabaseAdmin.sql`referral_codes_remaining - 1`
      })
      .eq('user_id', updatedCode.owner_user_id);

    // Track analytics
    await supabaseAdmin
      .from('referral_analytics')
      .insert({
        referrer_id: updatedCode.owner_user_id,
        referee_id: newUserId,
        referral_code: code,
        referrer_rewards: { type: 'new_referral', points: 1 }
      });

    console.log(`✅ Referral conversion tracked: ${code} → ${newUserEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error using referral code:', error);
    return false;
  }
}

/**
 * Get referral stats for a user
 */
export async function getReferralStats(userId: string) {
  try {
    const supabaseAdmin = createSupabaseAdmin();
    if (!supabaseAdmin) {
      console.warn('[BetaAuth] Supabase not available, cannot fetch referral stats');
      return { totalReferrals: 0, codesRemaining: 0, codes: [] };
    }

    const { data: stats } = await supabaseAdmin
      .from('beta_testers')
      .select('total_referrals, referral_codes_remaining')
      .eq('user_id', userId)
      .single();

    const { data: codes } = await supabaseAdmin
      .from('referral_codes')
      .select('code, is_used, used_at, used_by_user_id')
      .eq('owner_user_id', userId);

    return {
      totalReferrals: stats?.total_referrals || 0,
      codesRemaining: stats?.referral_codes_remaining || 0,
      codes: codes || []
    };
  } catch (error) {
    console.error('❌ Error fetching referral stats:', error);
    return { totalReferrals: 0, codesRemaining: 0, codes: [] };
  }
}

// Export a unified auth object for compatibility
export const betaAuth = {
  checkBetaAccess,
  getBetaUser,
  grantBetaAccess,
  revokeBetaAccess,
  verifyBetaCode,
  generateReferralCodes,
  useReferralCode,
  getReferralStats
};
