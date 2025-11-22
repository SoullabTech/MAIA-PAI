'use client';

/**
 * CONSCIOUSNESS AUTHENTICATION PROVIDER
 * Spiralogic Oracle System - Sacred Session Management
 *
 * This provider implements consciousness-aware authentication that maintains
 * continuity across sessions, honoring the user's archetypal resonance and
 * wisdom journey progression.
 *
 * Elemental Principles:
 * - Fire: Dynamic state management and session creation
 * - Water: Emotional continuity and memory preservation
 * - Earth: Persistent storage and data integrity
 * - Air: Communication between auth states
 * - Aether: Unified consciousness field integration
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface ConsciousnessProfile {
  archetypeResonance?: string[];
  wisdomFacets?: string[];
  communicationPreference?: 'voice' | 'text' | 'both';
  sessionContinuity?: boolean;
  explorationHistory?: {
    topics: string[];
    insights: string[];
    journeyStage: 'discovery' | 'integration' | 'mastery';
  };
  sacredPreferences?: {
    preferredOracleMode?: 'dialogue' | 'patient' | 'scribe';
    voiceSelection?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
    enableSacredGeometry?: boolean;
    breathingRhythm?: boolean;
    elementalToneMapping?: {
      fire?: string;
      water?: string;
      earth?: string;
      air?: string;
      aether?: string;
    };
    consciousnessLevel?: 'awakening' | 'integrating' | 'embodying' | 'transcending';
  };
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  onboarded: boolean;
  authenticatedAt: string;
  lastSeen?: string;
  consciousnessProfile: ConsciousnessProfile;
  sessionContinuity: {
    currentSessionId?: string;
    previousSessions: string[];
    totalSessions: number;
    lastActivityAt: string;
  };
}

type AuthState = 'loading' | 'unauthenticated' | 'authenticated' | 'onboarding' | 'welcome_back';

interface AuthContextValue {
  user: AuthenticatedUser | null;
  authState: AuthState;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  updateConsciousnessProfile: (updates: Partial<ConsciousnessProfile>) => void;
  createSession: () => string;
  recordActivity: (activity: string) => void;
  getWelcomeMessage: () => string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function ConsciousnessAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [authState, setAuthState] = useState<AuthState>('loading');
  const router = useRouter();

  useEffect(() => {
    initializeAuthState();
  }, []);

  const initializeAuthState = async () => {
    try {
      const betaUser = localStorage.getItem('beta_user');
      const lastSeen = localStorage.getItem('last_maia_session');
      const sessionId = localStorage.getItem('maia_session_id');

      if (betaUser) {
        const userData = JSON.parse(betaUser);
        const now = new Date().toISOString();

        // Get session history
        const sessionHistory = JSON.parse(localStorage.getItem('session_history') || '[]');
        const totalSessions = sessionHistory.length;

        // Enhanced user state with consciousness profile
        const enhancedUser: AuthenticatedUser = {
          id: userData.id,
          username: userData.username || userData.name,
          onboarded: userData.onboarded === true,
          authenticatedAt: userData.authenticatedAt || now,
          lastSeen: lastSeen || undefined,
          consciousnessProfile: {
            archetypeResonance: userData.archetypeResonance || [],
            wisdomFacets: userData.wisdomFacets || [],
            communicationPreference: userData.communicationPreference || 'both',
            sessionContinuity: userData.sessionContinuity !== false,
            explorationHistory: userData.explorationHistory || {
              topics: [],
              insights: [],
              journeyStage: 'discovery'
            },
            sacredPreferences: userData.sacredPreferences || {
              preferredOracleMode: 'dialogue',
              voiceSelection: 'shimmer',
              enableSacredGeometry: true,
              breathingRhythm: true,
              elementalToneMapping: {
                fire: 'passionate and inspiring',
                water: 'flowing and empathetic',
                earth: 'grounded and wise',
                air: 'light and insightful',
                aether: 'mystical and transcendent'
              },
              consciousnessLevel: 'integrating'
            }
          },
          sessionContinuity: {
            currentSessionId: sessionId || undefined,
            previousSessions: sessionHistory,
            totalSessions: totalSessions,
            lastActivityAt: lastSeen || now
          }
        };

        setUser(enhancedUser);

        // Determine auth state based on last activity
        if (enhancedUser.onboarded) {
          if (lastSeen) {
            const lastSeenDate = new Date(lastSeen);
            const hoursSinceLastSeen = (Date.now() - lastSeenDate.getTime()) / (1000 * 60 * 60);

            if (hoursSinceLastSeen > 24) {
              setAuthState('welcome_back');
            } else {
              setAuthState('authenticated');
            }
          } else {
            setAuthState('authenticated');
          }
        } else {
          setAuthState('onboarding');
        }
      } else {
        // Check for legacy system migration
        await migrateLegacyAuth();
        setAuthState('unauthenticated');
      }
    } catch (error) {
      console.error('❌ Error initializing auth:', error);
      setAuthState('unauthenticated');
    }
  };

  const migrateLegacyAuth = async () => {
    try {
      const explorerName = localStorage.getItem('explorerName');
      const explorerId = localStorage.getItem('explorerId');
      const onboardingComplete = localStorage.getItem('betaOnboardingComplete') === 'true';

      if (explorerName && explorerId && onboardingComplete) {
        console.log('🔄 Migrating legacy user to consciousness auth system');

        const now = new Date().toISOString();
        const migratedUser: AuthenticatedUser = {
          id: explorerId,
          username: explorerName,
          onboarded: true,
          authenticatedAt: now,
          consciousnessProfile: {
            sessionContinuity: true,
            explorationHistory: {
              topics: [],
              insights: ['Migrated from legacy system'],
              journeyStage: 'integration'
            },
            sacredPreferences: {
              preferredOracleMode: 'dialogue',
              voiceSelection: 'shimmer',
              enableSacredGeometry: true,
              breathingRhythm: true,
              elementalToneMapping: {
                fire: 'passionate and inspiring',
                water: 'flowing and empathetic',
                earth: 'grounded and wise',
                air: 'light and insightful',
                aether: 'mystical and transcendent'
              },
              consciousnessLevel: 'integrating'
            }
          },
          sessionContinuity: {
            previousSessions: [],
            totalSessions: 0,
            lastActivityAt: now
          }
        };

        localStorage.setItem('beta_user', JSON.stringify(migratedUser));
        setUser(migratedUser);
        setAuthState('welcome_back');

        console.log('✅ Legacy user migrated successfully');
      }
    } catch (error) {
      console.error('❌ Error migrating legacy auth:', error);
    }
  };

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const users = JSON.parse(localStorage.getItem('beta_users') || '{}');
      const { username, password } = credentials;

      if (!users[username] || users[username].password !== password) {
        throw new Error('Invalid username or password');
      }

      const userWithPassword = users[username];
      const { password: _, ...userData } = userWithPassword;
      const now = new Date().toISOString();

      const authenticatedUser: AuthenticatedUser = {
        ...userData,
        authenticatedAt: now,
        sessionContinuity: {
          currentSessionId: createSession(),
          previousSessions: JSON.parse(localStorage.getItem('session_history') || '[]'),
          totalSessions: JSON.parse(localStorage.getItem('session_history') || '[]').length + 1,
          lastActivityAt: now
        }
      };

      localStorage.setItem('beta_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('last_maia_session', now);

      setUser(authenticatedUser);
      setAuthState(authenticatedUser.onboarded ? 'authenticated' : 'onboarding');

      console.log('🌸 Consciousness authentication successful:', authenticatedUser.username);
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      throw error;
    }
  };

  const logout = () => {
    const now = new Date().toISOString();

    // Record session end
    if (user?.sessionContinuity.currentSessionId) {
      recordActivity('session_end');
    }

    // Clear auth state
    localStorage.removeItem('beta_user');
    localStorage.removeItem('maia_session_id');
    localStorage.setItem('last_maia_session', now);

    setUser(null);
    setAuthState('unauthenticated');

    console.log('👋 Consciousness session ended gracefully');
    router.push('/auth');
  };

  const updateConsciousnessProfile = (updates: Partial<ConsciousnessProfile>) => {
    if (!user) return;

    const updatedUser: AuthenticatedUser = {
      ...user,
      consciousnessProfile: {
        ...user.consciousnessProfile,
        ...updates
      }
    };

    setUser(updatedUser);
    localStorage.setItem('beta_user', JSON.stringify(updatedUser));

    console.log('🧠 Consciousness profile updated:', updates);
  };

  const createSession = (): string => {
    const sessionId = `session_${Date.now()}`;
    const now = new Date().toISOString();

    // Store new session
    localStorage.setItem('maia_session_id', sessionId);

    // Update session history
    const sessionHistory = JSON.parse(localStorage.getItem('session_history') || '[]');
    sessionHistory.push({
      id: sessionId,
      startTime: now,
      endTime: null,
      activities: []
    });
    localStorage.setItem('session_history', JSON.stringify(sessionHistory));

    console.log('✨ New consciousness session created:', sessionId);
    return sessionId;
  };

  const recordActivity = (activity: string) => {
    if (!user) return;

    const now = new Date().toISOString();
    const sessionHistory = JSON.parse(localStorage.getItem('session_history') || '[]');

    const currentSessionIndex = sessionHistory.findIndex(
      (s: any) => s.id === user.sessionContinuity.currentSessionId
    );

    if (currentSessionIndex !== -1) {
      sessionHistory[currentSessionIndex].activities.push({
        type: activity,
        timestamp: now
      });

      if (activity === 'session_end') {
        sessionHistory[currentSessionIndex].endTime = now;
      }

      localStorage.setItem('session_history', JSON.stringify(sessionHistory));
    }

    // Update user's last activity
    const updatedUser: AuthenticatedUser = {
      ...user,
      sessionContinuity: {
        ...user.sessionContinuity,
        lastActivityAt: now
      }
    };

    setUser(updatedUser);
    localStorage.setItem('beta_user', JSON.stringify(updatedUser));
  };

  const getWelcomeMessage = (): string => {
    if (!user) return 'Welcome to MAIA';

    const { totalSessions, lastActivityAt } = user.sessionContinuity;
    const hoursSinceLastSeen = lastActivityAt
      ? (Date.now() - new Date(lastActivityAt).getTime()) / (1000 * 60 * 60)
      : 0;

    if (totalSessions === 0) {
      return `Welcome, ${user.username}. Let's begin your journey.`;
    } else if (hoursSinceLastSeen > 168) { // 1 week
      return `Welcome back, ${user.username}. It's been a while. Your consciousness continues...`;
    } else if (hoursSinceLastSeen > 24) { // 1 day
      return `Good to see you again, ${user.username}. Ready to continue where we left off?`;
    } else {
      return `Welcome back, ${user.username}. Your session continues.`;
    }
  };

  const contextValue: AuthContextValue = {
    user,
    authState,
    isAuthenticated: authState === 'authenticated',
    isLoading: authState === 'loading',
    login,
    logout,
    updateConsciousnessProfile,
    createSession,
    recordActivity,
    getWelcomeMessage
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useConsciousnessAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useConsciousnessAuth must be used within a ConsciousnessAuthProvider');
  }
  return context;
}

// Enhanced hook for MAIA-specific authentication states
export function useMAIAAuth() {
  const auth = useConsciousnessAuth();

  const isReadyForMaia = auth.user?.onboarded && auth.isAuthenticated;
  const needsOnboarding = auth.user && !auth.user.onboarded;
  const showWelcomeBack = auth.authState === 'welcome_back';

  return {
    ...auth,
    isReadyForMaia,
    needsOnboarding,
    showWelcomeBack,
    consciousnessProfile: auth.user?.consciousnessProfile,
    sessionData: auth.user?.sessionContinuity
  };
}