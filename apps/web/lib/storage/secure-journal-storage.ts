/**
 * Secure Journal Storage with Encryption and Persistence
 * Replaces the in-memory storage with encrypted Supabase persistence
 */

'use client';

import { getBrowserSupabaseClient } from '@/lib/supabaseBrowserClient';
import { MAIAEncryption, UserEncryptionContext, SecureLocalStorage } from '@/lib/security/encryption';
import { JournalingMode, JournalingResponse } from '@/lib/journaling/JournalingPrompts';

export interface SecureJournalEntry {
  id: string;
  userId: string;
  mode: JournalingMode;
  content: string;
  reflection: JournalingResponse;
  timestamp: Date;
  wordCount: number;
  isVoice: boolean;
  voiceDuration?: number;
  metadata?: any;
}

export interface StoredEncryptedEntry {
  id: string;
  user_id: string;
  encrypted_content: any;
  encrypted_mode: any;
  encrypted_reflection?: any;
  encrypted_symbols?: any;
  encrypted_archetypes?: any;
  encrypted_emotional_tone?: any;
  encrypted_metadata?: any;
  entry_date: string;
  word_count: number;
  is_voice: boolean;
  voice_duration?: number;
  created_at: string;
  updated_at: string;
}

export class SecureJournalStorage {
  private supabase = getBrowserSupabaseClient();
  private encryptionContext: UserEncryptionContext | null = null;
  private localCache: Map<string, SecureJournalEntry> = new Map();
  private initialized = false;

  constructor() {
    // Initialize secure localStorage
    this.initializeLocalCache();
  }

  /**
   * Initialize with user encryption context
   */
  async initialize(encryptionContext: UserEncryptionContext): Promise<boolean> {
    try {
      this.encryptionContext = encryptionContext;
      SecureLocalStorage.initialize(encryptionContext);

      // Load local cache from encrypted storage
      await this.loadLocalCache();

      this.initialized = true;
      console.log('✅ Secure journal storage initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize secure storage:', error);
      return false;
    }
  }

  /**
   * Add a new journal entry with encryption and persistence
   */
  async addEntry(entry: Omit<SecureJournalEntry, 'id'>): Promise<string | null> {
    if (!this.initialized || !this.encryptionContext) {
      console.error('Secure storage not initialized');
      return null;
    }

    try {
      const entryId = crypto.randomUUID();
      const fullEntry: SecureJournalEntry = {
        ...entry,
        id: entryId,
        timestamp: new Date()
      };

      // Encrypt the entry data
      const encryptedData = MAIAEncryption.encryptJournalEntry({
        content: entry.content,
        mode: entry.mode,
        reflection: entry.reflection,
        symbols: entry.reflection?.symbols,
        archetypes: entry.reflection?.archetypes,
        emotionalTone: entry.reflection?.emotionalTone,
        metadata: entry.metadata
      }, this.encryptionContext);

      // Store in Supabase
      const { data, error } = await this.supabase
        .from('journal_entries')
        .insert({
          id: entryId,
          user_id: entry.userId,
          ...encryptedData,
          entry_date: fullEntry.timestamp.toISOString().split('T')[0],
          is_voice: entry.isVoice || false,
          voice_duration: entry.voiceDuration
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to save to database:', error);
        // Fall back to local storage
        await this.saveToLocalCache(fullEntry);
        return entryId;
      }

      // Update local cache
      this.localCache.set(entryId, fullEntry);

      // Also backup to encrypted localStorage
      await this.saveToLocalCache(fullEntry);

      // Log audit event
      await this.logAuditEvent(entry.userId, 'create', 'journal_entry', entryId);

      console.log('✅ Journal entry saved securely');
      return entryId;

    } catch (error) {
      console.error('Failed to add journal entry:', error);
      return null;
    }
  }

  /**
   * Retrieve journal entries with decryption
   */
  async getEntries(
    userId: string,
    filters?: {
      mode?: JournalingMode;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    }
  ): Promise<SecureJournalEntry[]> {
    if (!this.initialized || !this.encryptionContext) {
      console.error('Secure storage not initialized');
      return [];
    }

    try {
      let query = this.supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.startDate) {
        query = query.gte('entry_date', filters.startDate.toISOString().split('T')[0]);
      }
      if (filters?.endDate) {
        query = query.lte('entry_date', filters.endDate.toISOString().split('T')[0]);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to retrieve from database:', error);
        // Fall back to local cache
        return this.getFromLocalCache(userId, filters);
      }

      // Decrypt entries
      const decryptedEntries: SecureJournalEntry[] = [];

      for (const encryptedEntry of data || []) {
        const decrypted = this.decryptStoredEntry(encryptedEntry);
        if (decrypted) {
          decryptedEntries.push(decrypted);
        }
      }

      // Filter by mode if specified (can't filter encrypted data in query)
      let filteredEntries = decryptedEntries;
      if (filters?.mode) {
        filteredEntries = decryptedEntries.filter(e => e.mode === filters.mode);
      }

      // Log audit event
      await this.logAuditEvent(userId, 'read', 'journal_entry');

      return filteredEntries;

    } catch (error) {
      console.error('Failed to retrieve journal entries:', error);
      return this.getFromLocalCache(userId, filters);
    }
  }

  /**
   * Get a single journal entry by ID
   */
  async getEntry(userId: string, entryId: string): Promise<SecureJournalEntry | null> {
    if (!this.initialized || !this.encryptionContext) {
      return null;
    }

    try {
      // Check local cache first
      if (this.localCache.has(entryId)) {
        const cached = this.localCache.get(entryId)!;
        if (cached.userId === userId) {
          return cached;
        }
      }

      // Fetch from database
      const { data, error } = await this.supabase
        .from('journal_entries')
        .select('*')
        .eq('id', entryId)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      const decrypted = this.decryptStoredEntry(data);
      if (decrypted) {
        this.localCache.set(entryId, decrypted);
      }

      await this.logAuditEvent(userId, 'read', 'journal_entry', entryId);
      return decrypted;

    } catch (error) {
      console.error('Failed to retrieve journal entry:', error);
      return null;
    }
  }

  /**
   * Update an existing journal entry
   */
  async updateEntry(
    userId: string,
    entryId: string,
    updates: Partial<SecureJournalEntry>
  ): Promise<boolean> {
    if (!this.initialized || !this.encryptionContext) {
      return false;
    }

    try {
      // Get current entry
      const currentEntry = await this.getEntry(userId, entryId);
      if (!currentEntry) {
        return false;
      }

      // Merge updates
      const updatedEntry = { ...currentEntry, ...updates };

      // Encrypt updated data
      const encryptedData = MAIAEncryption.encryptJournalEntry({
        content: updatedEntry.content,
        mode: updatedEntry.mode,
        reflection: updatedEntry.reflection,
        symbols: updatedEntry.reflection?.symbols,
        archetypes: updatedEntry.reflection?.archetypes,
        emotionalTone: updatedEntry.reflection?.emotionalTone,
        metadata: updatedEntry.metadata
      }, this.encryptionContext);

      // Update in database
      const { error } = await this.supabase
        .from('journal_entries')
        .update({
          ...encryptedData,
          word_count: updatedEntry.content.split(/\s+/).length,
          updated_at: new Date().toISOString()
        })
        .eq('id', entryId)
        .eq('user_id', userId);

      if (error) {
        console.error('Failed to update in database:', error);
        return false;
      }

      // Update local cache
      this.localCache.set(entryId, updatedEntry);
      await this.saveToLocalCache(updatedEntry);

      await this.logAuditEvent(userId, 'update', 'journal_entry', entryId);
      return true;

    } catch (error) {
      console.error('Failed to update journal entry:', error);
      return false;
    }
  }

  /**
   * Delete a journal entry
   */
  async deleteEntry(userId: string, entryId: string): Promise<boolean> {
    if (!this.initialized || !this.encryptionContext) {
      return false;
    }

    try {
      // Delete from database
      const { error } = await this.supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', userId);

      if (error) {
        console.error('Failed to delete from database:', error);
        return false;
      }

      // Remove from local cache
      this.localCache.delete(entryId);
      await this.removeFromLocalCache(entryId);

      await this.logAuditEvent(userId, 'delete', 'journal_entry', entryId);
      return true;

    } catch (error) {
      console.error('Failed to delete journal entry:', error);
      return false;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<{
    totalEntries: number;
    modeDistribution: Record<JournalingMode, number>;
    last7Days: number;
    last30Days: number;
  }> {
    const entries = await this.getEntries(userId);
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const modeDistribution: Record<JournalingMode, number> = {
      free: 0,
      dream: 0,
      emotional: 0,
      shadow: 0,
      direction: 0
    };

    let last7Days = 0;
    let last30Days = 0;

    entries.forEach(entry => {
      modeDistribution[entry.mode]++;
      if (entry.timestamp >= sevenDaysAgo) last7Days++;
      if (entry.timestamp >= thirtyDaysAgo) last30Days++;
    });

    return {
      totalEntries: entries.length,
      modeDistribution,
      last7Days,
      last30Days
    };
  }

  /**
   * Export user data with encryption
   */
  async exportUserData(userId: string): Promise<string | null> {
    if (!this.initialized || !this.encryptionContext) {
      return null;
    }

    try {
      const entries = await this.getEntries(userId);
      const stats = await this.getUserStats(userId);

      const exportData = {
        exportedAt: new Date().toISOString(),
        userId,
        stats,
        entries: entries.map(entry => ({
          ...entry,
          timestamp: entry.timestamp.toISOString()
        })),
        encryption: {
          note: 'This data was exported with client-side encryption',
          version: 1
        }
      };

      await this.logAuditEvent(userId, 'export', 'journal_entry');
      return JSON.stringify(exportData, null, 2);

    } catch (error) {
      console.error('Failed to export user data:', error);
      return null;
    }
  }

  /**
   * Sync local cache with database
   */
  async syncWithDatabase(userId: string): Promise<void> {
    if (!this.initialized) return;

    try {
      console.log('🔄 Syncing local cache with database...');

      // Get latest from database
      const dbEntries = await this.getEntries(userId);

      // Update local cache
      for (const entry of dbEntries) {
        this.localCache.set(entry.id, entry);
        await this.saveToLocalCache(entry);
      }

      console.log('✅ Sync completed');

    } catch (error) {
      console.error('Failed to sync with database:', error);
    }
  }

  // Private methods for local cache management

  private async initializeLocalCache(): Promise<void> {
    this.localCache = new Map();
  }

  private async loadLocalCache(): Promise<void> {
    try {
      const cached = SecureLocalStorage.getItem<SecureJournalEntry[]>('journal_entries') || [];
      for (const entry of cached) {
        this.localCache.set(entry.id, {
          ...entry,
          timestamp: new Date(entry.timestamp)
        });
      }
    } catch (error) {
      console.error('Failed to load local cache:', error);
    }
  }

  private async saveToLocalCache(entry: SecureJournalEntry): Promise<void> {
    try {
      const allEntries = Array.from(this.localCache.values());
      // Keep only last 100 entries in cache to manage storage
      const recentEntries = allEntries
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 100);

      SecureLocalStorage.setItem('journal_entries', recentEntries);
    } catch (error) {
      console.error('Failed to save to local cache:', error);
    }
  }

  private async removeFromLocalCache(entryId: string): Promise<void> {
    try {
      const allEntries = Array.from(this.localCache.values());
      const filteredEntries = allEntries.filter(e => e.id !== entryId);
      SecureLocalStorage.setItem('journal_entries', filteredEntries);
    } catch (error) {
      console.error('Failed to remove from local cache:', error);
    }
  }

  private getFromLocalCache(
    userId: string,
    filters?: {
      mode?: JournalingMode;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ): SecureJournalEntry[] {
    let entries = Array.from(this.localCache.values()).filter(e => e.userId === userId);

    if (filters) {
      if (filters.mode) {
        entries = entries.filter(e => e.mode === filters.mode);
      }
      if (filters.startDate) {
        entries = entries.filter(e => e.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        entries = entries.filter(e => e.timestamp <= filters.endDate!);
      }
    }

    entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filters?.limit) {
      entries = entries.slice(0, filters.limit);
    }

    return entries;
  }

  private decryptStoredEntry(stored: StoredEncryptedEntry): SecureJournalEntry | null {
    if (!this.encryptionContext) return null;

    try {
      const decrypted = MAIAEncryption.decryptJournalEntry(stored, this.encryptionContext);

      if (!decrypted.content || !decrypted.mode) {
        console.error('Failed to decrypt entry content');
        return null;
      }

      return {
        id: stored.id,
        userId: stored.user_id,
        content: decrypted.content,
        mode: decrypted.mode as JournalingMode,
        reflection: decrypted.reflection || {},
        timestamp: new Date(stored.created_at),
        wordCount: stored.word_count,
        isVoice: stored.is_voice,
        voiceDuration: stored.voice_duration,
        metadata: decrypted.metadata
      };
    } catch (error) {
      console.error('Failed to decrypt stored entry:', error);
      return null;
    }
  }

  private async logAuditEvent(
    userId: string,
    action: string,
    resourceType: string,
    resourceId?: string
  ): Promise<void> {
    try {
      await this.supabase.rpc('log_audit_event', {
        p_user_id: userId,
        p_action: action,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_accessor_type: 'user'
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }
}

// Export singleton instance
export const secureJournalStorage = new SecureJournalStorage();