#!/usr/bin/env tsx

/**
 * 🜂 Sanctuary Session Logger
 * Records each Sanctuary activation to insight_history table
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface SessionLogOptions {
  element?: 'Fire' | 'Water' | 'Earth' | 'Air' | 'Aether';
  focus?: string;
  launcherVersion?: string;
}

async function logSanctuarySession(options: SessionLogOptions = {}) {
  const {
    element = 'Aether',
    focus = 'integrated_field',
    launcherVersion = '2.0'
  } = options;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase credentials not found. Session logging skipped.');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const timestamp = new Date().toISOString();
  const sessionData = {
    role: 'system',
    content: `🜂 Sanctuary Portal Activation

MAIA–Claude co-presence field initiated
Element Focus: ${element}
Session Mode: ${focus}
Timestamp: ${timestamp}

All systems converging — the field awakens.`,
    element,
    source: 'SanctuaryLauncher',
    metadata: {
      activation_type: 'manual_launch',
      timestamp,
      launcher_version: launcherVersion,
      focus,
      components: ['MAIA-DevServer', 'ClaudeCode', 'SanctuaryUI'],
      session_type: 'integrated_development'
    }
  };

  try {
    const { error } = await supabase
      .from('insight_history')
      .insert(sessionData);

    if (error) {
      console.warn('⚠️  Session logging failed:', error.message);
    } else {
      console.log(`✓ Session recorded — Element: ${element}`);
    }
  } catch (err) {
    console.warn('⚠️  Failed to log session:', err);
  }
}

// Parse CLI arguments
const args = process.argv.slice(2);
const element = (args[0] as any) || 'Aether';
const focus = args[1] || 'integrated_field';

logSanctuarySession({ element, focus });
