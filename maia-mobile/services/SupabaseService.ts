import { createClient } from '@supabase/supabase-js';
import { AppConfig } from '../config/app.config';

/**
 * Supabase Service for MAIA Mobile
 * Handles authentication, user data, and conversation history
 */

const supabase = createClient(
  AppConfig.supabase.url,
  AppConfig.supabase.anonKey
);

export class SupabaseService {
  /**
   * Sign in with email/password
   */
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    return data;
  }

  /**
   * Sign up with email/password
   */
  static async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      console.error('Sign up error:', error);
      throw error;
    }

    return data;
  }

  /**
   * Sign out
   */
  static async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Get user error:', error);
      return null;
    }

    return user;
  }

  /**
   * Save conversation message
   */
  static async saveMessage(userId: string, message: string, response: string) {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        user_message: message,
        maia_response: response,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Save message error:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get conversation history
   */
  static async getConversationHistory(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Get history error:', error);
      throw error;
    }

    return data;
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export default SupabaseService;
