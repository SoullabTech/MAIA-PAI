/**
 * Beta Authentication Module
 * Handles beta user access and permissions
 */

import { ganeshaContacts } from '../ganesha/contacts';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

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
    // PRIORITY 1: Check beta_testers table for new signups
    // Look for beta access ID that matches the code pattern
    const { data: betaTester, error } = await supabaseAdmin
      .from('beta_testers')
      .select('user_id, username, email, onboarding_completed')
      .eq('user_id', code)
      .single();

    if (betaTester && !error) {
      console.log('✅ Found beta tester in database:', {
        userId: betaTester.user_id,
        username: betaTester.username,
        email: betaTester.email
      });

      return {
        valid: true,
        explorerId: betaTester.user_id,
        name: betaTester.username, // This contains "FirstName LastName" from signup
        email: betaTester.email
      };
    }

    // PRIORITY 2: Check ganeshaContacts for imported testers (legacy)
    const contact = ganeshaContacts.find(contact =>
      contact.metadata?.passcode === code
    );

    if (contact) {
      console.log('✅ Found legacy contact in Ganesha:', {
        id: contact.id,
        name: contact.name,
        email: contact.email
      });

      return {
        valid: true,
        explorerId: contact.id,
        name: contact.name,
        email: contact.email
      };
    }

    console.warn('❌ Beta code not found in either database:', code);
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
        email: contact.email
      };
    }

    return { valid: false };
  }
}

// Export a unified auth object for compatibility
export const betaAuth = {
  checkBetaAccess,
  getBetaUser,
  grantBetaAccess,
  revokeBetaAccess,
  verifyBetaCode
};
