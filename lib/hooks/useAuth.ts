'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface OracleAgent {
  id: string;
  name: string;
  archetype: string;
  personality_config: any;
  conversations_count: number;
  wisdom_level: number;
  last_conversation_at?: string;
  created_at: string;
}

interface AuthUser {
  id: string;
  email: string;
  sacredName?: string;
  lastLogin?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [oracleAgent, setOracleAgent] = useState<OracleAgent | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      // 🏛️ Sovereign mode: Skip Supabase operations
      if (!supabase) {
        console.log('🏛️ Sovereign mode: Creating Kelly\'s session');
        setUser({
          id: userId,
          email: 'kelly@soullab.local',
          sacredName: 'Kelly',
          lastLogin: new Date().toISOString()
        });

        setOracleAgent({
          id: `maia_${userId}`,
          name: 'MAIA',
          archetype: 'oracle',
          personality_config: { element: 'aether', voice: 'shimmer' },
          conversations_count: 0,
          wisdom_level: 1,
          last_conversation_at: null,
          created_at: new Date().toISOString()
        });
        return;
      }

      // Get user details
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, sacred_name, last_login')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Get oracle agent
      const { data: agentData, error: agentError } = await supabase
        .from('oracle_agents')
        .select(`
          id,
          name,
          archetype,
          personality_config,
          conversations_count,
          wisdom_level,
          last_conversation_at,
          created_at
        `)
        .eq('user_id', userId)
        .single();

      if (agentError && agentError.code !== 'PGRST116') {
        console.error('Error fetching oracle agent:', agentError);
      }

      setUser({
        id: userData.id,
        email: userData.email,
        sacredName: userData.sacred_name,
        lastLogin: userData.last_login
      });

      if (agentData) {
        setOracleAgent(agentData);
      }

    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    }
  }, [supabase]);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      // 🏛️ Sovereign mode: Local signout only
      if (!supabase) {
        console.log('🏛️ Sovereign mode: Local signout');
        setUser(null);
        setOracleAgent(null);
        setSession(null);
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setOracleAgent(null);
      setSession(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    }
  }, [supabase]);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign in failed');
      }

      // The API handles the Supabase auth session
      // The session change will be caught by our auth listener
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshOracleAgent = useCallback(async () => {
    if (!user) return null;

    try {
      // 🏛️ Sovereign mode: Return cached oracle agent
      if (!supabase) {
        console.log('🏛️ Sovereign mode: Returning cached oracle agent');
        return oracleAgent;
      }

      const { data: agentData, error } = await supabase
        .from('oracle_agents')
        .select(`
          id,
          name,
          archetype,
          personality_config,
          conversations_count,
          wisdom_level,
          last_conversation_at,
          created_at
        `)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setOracleAgent(agentData);
      return agentData;
    } catch (err) {
      console.error('Error refreshing oracle agent:', err);
      return null;
    }
  }, [user, supabase, oracleAgent]);

  // Initialize auth state and listen for changes
  useEffect(() => {
    // 🏛️ Sovereign mode: Skip Supabase auth entirely
    if (!supabase) {
      console.log('🏛️ Sovereign mode: Setting up guest session');
      const guestUserId = `sovereign_${Date.now()}`;

      fetchUserData(guestUserId);
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      if (initialSession?.user) {
        fetchUserData(initialSession.user.id);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);

        if (event === 'SIGNED_IN' && currentSession?.user) {
          await fetchUserData(currentSession.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setOracleAgent(null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchUserData]);

  return {
    user,
    oracleAgent,
    session,
    isAuthenticated: !!user,
    isLoading,
    error,
    signIn,
    signOut,
    refreshOracleAgent
  };
}