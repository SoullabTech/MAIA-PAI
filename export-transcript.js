#!/usr/bin/env node
/**
 * Export MAIA conversation transcript from database
 * Usage: node export-transcript.js [sessionId]
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportTranscript(sessionId = null) {
  try {
    console.log('📥 Fetching conversation history...\n');

    // Query memories table
    let query = supabase
      .from('memories')
      .select('*')
      .eq('memory_type', 'conversation')
      .order('created_at', { ascending: true });

    // Filter by session if provided
    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data: memories, error } = await query.limit(1000);

    if (error) throw error;

    if (!memories || memories.length === 0) {
      console.log('📭 No conversations found.');
      return;
    }

    console.log(`✅ Found ${memories.length} messages\n`);

    // Format transcript
    let transcript = `# MAIA Conversation Transcript\n`;
    transcript += `Generated: ${new Date().toISOString()}\n`;
    transcript += `Messages: ${memories.length}\n`;
    if (sessionId) transcript += `Session ID: ${sessionId}\n`;
    transcript += `\n${'='.repeat(80)}\n\n`;

    // Group by session
    const sessions = {};
    memories.forEach(msg => {
      const sid = msg.session_id || 'unknown';
      if (!sessions[sid]) sessions[sid] = [];
      sessions[sid].push(msg);
    });

    // Format each session
    Object.entries(sessions).forEach(([sid, msgs]) => {
      transcript += `## Session: ${sid}\n`;
      transcript += `Started: ${new Date(msgs[0].created_at).toLocaleString()}\n`;
      transcript += `Messages: ${msgs.length}\n\n`;

      msgs.forEach((msg, idx) => {
        const time = new Date(msg.created_at).toLocaleTimeString();
        const role = msg.role || 'unknown';
        const source = msg.source_type || '';

        transcript += `### [${time}] ${role.toUpperCase()} ${source ? `(${source})` : ''}\n`;
        transcript += `${msg.content}\n\n`;

        if (msg.emotional_tone) {
          transcript += `*Emotional Tone: ${msg.emotional_tone}*\n`;
        }
        if (msg.wisdom_themes && msg.wisdom_themes.length > 0) {
          transcript += `*Themes: ${msg.wisdom_themes.join(', ')}*\n`;
        }
        if (msg.elemental_resonance) {
          transcript += `*Element: ${msg.elemental_resonance}*\n`;
        }
        if (msg.emotional_tone || msg.wisdom_themes || msg.elemental_resonance) {
          transcript += `\n`;
        }

        transcript += `${'-'.repeat(80)}\n\n`;
      });

      transcript += `\n`;
    });

    // Save to file
    const filename = sessionId
      ? `transcript-${sessionId}-${Date.now()}.md`
      : `transcript-all-${Date.now()}.md`;
    const filepath = path.join(__dirname, filename);

    fs.writeFileSync(filepath, transcript, 'utf8');

    console.log(`✅ Transcript saved to: ${filename}`);
    console.log(`📍 Full path: ${filepath}\n`);

    // Also output to console
    console.log('📄 Transcript Preview:\n');
    console.log(transcript.substring(0, 1000));
    if (transcript.length > 1000) {
      console.log(`\n... (${transcript.length - 1000} more characters in file)`);
    }

  } catch (error) {
    console.error('❌ Error exporting transcript:', error);
    process.exit(1);
  }
}

// Get session ID from command line args
const sessionId = process.argv[2];

if (sessionId) {
  console.log(`🔍 Filtering by session: ${sessionId}\n`);
}

exportTranscript(sessionId);
