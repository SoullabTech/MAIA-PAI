import { NextRequest, NextResponse } from 'next/server';
import { extractConversationEssence, ConversationMessage } from '@/lib/services/conversationEssenceExtractor';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { messages, userId, conversationId, sessionId } = await req.json();

    // Get auth token from header (optional for beta users)
    const authHeader = req.headers.get('authorization');
    let authenticatedUserId: string | null = null;

    // Try Supabase authentication first
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (user) {
        authenticatedUserId = user.id;
        console.log('✅ [API] Supabase user authenticated:', authenticatedUserId);
      } else {
        console.warn('⚠️ [API] Invalid Supabase token:', authError?.message);
      }
    }

    // Fall back to userId from request body for beta users
    if (!authenticatedUserId) {
      if (!userId) {
        console.error('❌ [API] No authentication and no userId provided');
        return NextResponse.json(
          { error: 'Authentication or userId required' },
          { status: 401 }
        );
      }
      authenticatedUserId = userId;
      console.log('📦 [API] Using beta localStorage userId:', authenticatedUserId);
    }

    console.log('📝 [API] save-conversation called', {
      messageCount: messages?.length,
      authenticatedUserId,
      conversationId: conversationId?.substring(0, 10) + '...',
      sessionId: sessionId?.substring(0, 10) + '...'
    });

    if (!messages || !Array.isArray(messages)) {
      console.error('❌ [API] Missing or invalid messages array');
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Extract the essence using MAIA
    console.log('🔮 [API] Extracting conversation essence...');
    const essence = await extractConversationEssence(messages, {
      conversationId,
      userId: authenticatedUserId,
      focusOnBreakthroughs: true
    });
    console.log('✅ [API] Essence extracted:', {
      title: essence.title,
      hasInsight: !!essence.coreInsight
    });

    // Check if user ID is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isUUID = uuidRegex.test(authenticatedUserId);

    // For UUID users, check if they exist in the database
    let isSupabaseUser = false;
    if (isUUID) {
      const { data: userExists } = await supabase
        .from('users')
        .select('id')
        .eq('id', authenticatedUserId)
        .single();

      isSupabaseUser = !!userExists;
      console.log(`🔍 [API] UUID user ${authenticatedUserId} exists in DB:`, isSupabaseUser);
    }

    if (isSupabaseUser) {
      // Store in the journal_entries table for authenticated Supabase users
      console.log('💾 [API] Saving to Supabase journal_entries...');

      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: authenticatedUserId,
          title: essence.title || 'Conversation Reflection',
          content: essence.synthesizedEntry,
          entry_type: 'reflection',
          elemental_focus: determineElement(essence.elementalSignature),
          ritual_practice: 'conversation',
          is_private: true
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [journal.save] insert failed', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          authenticatedUserId,
          hasContent: !!essence.synthesizedEntry,
        });
        return NextResponse.json(
          { ok: false, error: error.message, details: error.details },
          { status: 400 }
        );
      }

      console.log('✅ [journal.save] Entry saved successfully:', data.id);

      // Also return the entry for client-side localStorage backup
      return NextResponse.json({
        ok: true,
        success: true,
        entry: data,
        essence,
        storageType: 'supabase',
        localStorageBackup: true // Signal to client to also save locally
      });
    } else {
      // Return essence for client-side localStorage storage (beta users)
      console.log('📦 [API] Returning essence for localStorage storage (beta user)');
      return NextResponse.json({
        ok: true,
        success: true,
        essence,
        storageType: 'localStorage',
        entry: {
          id: `local_${Date.now()}`,
          user_id: authenticatedUserId,
          title: essence.title || 'Conversation Reflection',
          content: essence.synthesizedEntry,
          entry_type: 'reflection',
          elemental_focus: determineElement(essence.elementalSignature),
          ritual_practice: 'conversation',
          is_private: true,
          created_at: new Date().toISOString()
        }
      });
    }
  } catch (error: any) {
    console.error('Error in save-conversation endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Determine dominant element from signature
 */
function determineElement(signature: { fire?: number; water?: number; earth?: number; air?: number }): string {
  const elements = [
    { name: 'fire', value: signature.fire || 0 },
    { name: 'water', value: signature.water || 0 },
    { name: 'earth', value: signature.earth || 0 },
    { name: 'air', value: signature.air || 0 }
  ];

  elements.sort((a, b) => b.value - a.value);
  return elements[0].name;
}
