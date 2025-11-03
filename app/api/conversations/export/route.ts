import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Export user's conversation history
 * Fetches all conversations for a user and formats them for download
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const format = searchParams.get('format') || 'markdown'; // markdown, json, txt
    const sessionId = searchParams.get('sessionId'); // Optional: single session only

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    console.log('📥 [Export] Fetching conversations:', { userId, format, sessionId });

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch conversations from Supabase
    let query = supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data: conversations, error } = await query;

    if (error) {
      console.error('❌ [Export] Database error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!conversations || conversations.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No conversations found' },
        { status: 404 }
      );
    }

    console.log(`✅ [Export] Found ${conversations.length} conversation pairs`);

    // Format the data based on requested format
    let content: string;
    let contentType: string;
    let filename: string;

    switch (format) {
      case 'json':
        content = JSON.stringify(conversations, null, 2);
        contentType = 'application/json';
        filename = `maia-conversations-${userId}-${Date.now()}.json`;
        break;

      case 'txt':
        content = formatAsPlainText(conversations);
        contentType = 'text/plain';
        filename = `maia-conversations-${userId}-${Date.now()}.txt`;
        break;

      case 'markdown':
      default:
        content = formatAsMarkdown(conversations);
        contentType = 'text/markdown';
        filename = `maia-conversations-${userId}-${Date.now()}.md`;
        break;
    }

    // Return the formatted content with download headers
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error: any) {
    console.error('❌ [Export] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Format conversations as Markdown
 */
function formatAsMarkdown(conversations: any[]): string {
  const sessions = groupBySession(conversations);

  let markdown = '# MAIA Conversations\n\n';
  markdown += `*Exported on ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}*\n\n`;
  markdown += '---\n\n';

  for (const [sessionId, convos] of Object.entries(sessions)) {
    const firstConvo = convos[0];
    const sessionDate = new Date(firstConvo.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    markdown += `## Session: ${sessionDate}\n\n`;

    for (const convo of convos) {
      const timestamp = new Date(convo.created_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });

      // User message
      if (convo.user_message) {
        markdown += `### You (${timestamp})\n\n`;
        markdown += `${convo.user_message}\n\n`;
      }

      // MAIA response
      if (convo.maia_response) {
        markdown += `### MAIA (${timestamp})`;

        // Add element/phase info if available
        if (convo.element || convo.phase) {
          markdown += ` *[${convo.element || 'Aether'} · ${convo.phase || 'Invocation'}]*`;
        }

        markdown += '\n\n';
        markdown += `${convo.maia_response}\n\n`;
      }

      markdown += '---\n\n';
    }
  }

  return markdown;
}

/**
 * Format conversations as plain text
 */
function formatAsPlainText(conversations: any[]): string {
  const sessions = groupBySession(conversations);

  let text = 'MAIA CONVERSATIONS\n';
  text += `Exported on ${new Date().toLocaleString()}\n`;
  text += '=' .repeat(60) + '\n\n';

  for (const [sessionId, convos] of Object.entries(sessions)) {
    const firstConvo = convos[0];
    const sessionDate = new Date(firstConvo.created_at).toLocaleDateString();

    text += `SESSION: ${sessionDate}\n`;
    text += '-'.repeat(60) + '\n\n';

    for (const convo of convos) {
      const timestamp = new Date(convo.created_at).toLocaleTimeString();

      // User message
      if (convo.user_message) {
        text += `[${timestamp}] YOU:\n${convo.user_message}\n\n`;
      }

      // MAIA response
      if (convo.maia_response) {
        text += `[${timestamp}] MAIA`;
        if (convo.element) {
          text += ` (${convo.element})`;
        }
        text += `:\n${convo.maia_response}\n\n`;
      }

      text += '\n';
    }
  }

  return text;
}

/**
 * Group conversations by session
 */
function groupBySession(conversations: any[]): Record<string, any[]> {
  const sessions: Record<string, any[]> = {};

  for (const convo of conversations) {
    const sessionId = convo.session_id || 'unknown';
    if (!sessions[sessionId]) {
      sessions[sessionId] = [];
    }
    sessions[sessionId].push(convo);
  }

  return sessions;
}
