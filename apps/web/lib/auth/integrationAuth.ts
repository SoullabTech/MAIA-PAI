"use client";

// STUB: IntegrationAuth completely disabled for build stability
// This is a placeholder to prevent import errors while transitioning to API-only approach

import { User } from "@supabase/supabase-js";
import { HolisticDomain, DevelopmentStage, UserState } from "../types/holistic";

export interface IntegrationUserMetadata {
  developmentStage: DevelopmentStage;
  primaryDomains: HolisticDomain[];
  currentState: UserState;
  onboardingCompleted: boolean;
  professionalSupport: boolean;
  communityParticipation: boolean;
  integrationLevel: number;
  lastAssessment?: string;
}

export interface OnboardingData {
  personalInfo: {
    displayName: string;
    bio?: string;
    professionalBackground?: string;
  };
  developmentAssessment: {
    currentChallenges: string[];
    supportSought: string[];
    experienceLevel: string;
    professionalSupportHistory: boolean;
  };
  privacySettings: {
    communityVisibility: "private" | "supportive" | "open";
    professionalSupportConsent: boolean;
    researchParticipation: boolean;
    dataRetentionPreference: number; // years
  };
  integrationCommitment: {
    reflectionPeriodConsent: boolean;
    realityCheckingConsent: boolean;
    communityAccountabilityConsent: boolean;
    professionalReferralConsent: boolean;
  };
}

// Type for profile creation/update with camelCase keys
type ProfileUpsertInput = {
  displayName: string;
  bio?: string;
  professionalBackground?: string;
  currentChallenges?: string[];
  supportSought?: string[];
  experienceLevel?: string;
  professionalSupportHistory?: boolean;
  communityVisibility?: "private" | "supportive" | "open";
  professionalSupportConsent?: boolean;
  researchParticipation?: boolean;
  dataRetentionPreference?: number;
  onboardingCompleted?: boolean;
};

export class IntegrationAuthService {
  constructor() {
    console.warn('IntegrationAuthService: Completely disabled for build stability - use API routes instead');
  }

  private throwDisabledError(): never {
    throw new Error('IntegrationAuthService disabled. Use API routes for authentication instead.');
  }

  private isSupabaseAvailable(): boolean {
    return false; // Always return false since service is disabled
  }

  async signUp(email: string, password: string, onboardingData: OnboardingData) {
    this.throwDisabledError();
  }

  async signIn(email: string, password: string) {
    this.throwDisabledError();
  }

  private async createUserProfile(userId: string, profile: ProfileUpsertInput) {
    this.throwDisabledError();
  }

  private async initializeDomainAssessments(userId: string) {
    this.throwDisabledError();
  }

  private async initializeIntegrationArchitecture(userId: string) {
    this.throwDisabledError();
  }

  private assessInitialState(onboardingData: OnboardingData): UserState {
    return UserState.BALANCED; // Default fallback
  }

  async updateUserMetadata(userId: string, metadata: Partial<IntegrationUserMetadata>) {
    this.throwDisabledError();
  }

  async getUserProfile(userId: string) {
    this.throwDisabledError();
  }

  async updateUserProfile(userId: string, updates: any) {
    this.throwDisabledError();
  }

  private async updateLastActive(userId: string) {
    this.throwDisabledError();
  }

  async completeOnboarding(onboardingData: OnboardingData) {
    this.throwDisabledError();
  }

  async getCurrentUser(): Promise<User | null> {
    // Return null for demo mode - user appears logged out
    return null;
  }

  async signInWithEmail(email: string, redirectPath?: string) {
    this.throwDisabledError();
  }

  async handleAuthCallback() {
    this.throwDisabledError();
  }

  async signOut() {
    return { error: null }; // Safe stub that doesn't throw
  }

  async getSession() {
    return null; // Safe stub that doesn't throw
  }

  async requestProfessionalVerification(userId: string, credentials: any) {
    this.throwDisabledError();
  }

  async createProfessionalConnection(userId: string, professionalId: string, connectionType: string, reason?: string) {
    this.throwDisabledError();
  }

  async updatePrivacySettings(userId: string, settings: any) {
    this.throwDisabledError();
  }

  async withdrawConsent(userId: string, consentType: string) {
    this.throwDisabledError();
  }

  async checkIntegrationReadiness(userId: string): Promise<{
    ready: boolean;
    blockers: string[];
    recommendations: string[];
  }> {
    this.throwDisabledError();
  }

  private async calculateIntegrationQuality(userId: string): Promise<number> {
    this.throwDisabledError();
  }

  async exportUserData(userId: string) {
    this.throwDisabledError();
  }

  async deleteAccount(userId: string, reason?: string) {
    this.throwDisabledError();
  }

  private async hashUserId(userId: string): Promise<string> {
    this.throwDisabledError();
  }
}