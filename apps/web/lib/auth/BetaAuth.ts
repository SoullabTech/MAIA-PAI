/**
 * Beta Authentication Module
 * Handles beta user access and permissions
 */

import { ganeshaContacts } from '../ganesha/contacts';

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
  // Look for the code in the contacts database
  const contact = ganeshaContacts.find(contact =>
    contact.metadata?.passcode === code
  );

  if (contact) {
    return {
      valid: true,
      explorerId: contact.id,
      name: contact.name,
      email: contact.email
    };
  }

  return { valid: false };
}

// Export a unified auth object for compatibility
export const betaAuth = {
  checkBetaAccess,
  getBetaUser,
  grantBetaAccess,
  revokeBetaAccess,
  verifyBetaCode
};
