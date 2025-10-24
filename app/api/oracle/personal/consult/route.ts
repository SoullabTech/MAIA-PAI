import { NextRequest, NextResponse } from 'next/server';
import { personalOracleAgent } from '@/lib/oracle/PersonalOracleAgent';
import {
  getUserSubscription,
  canStartConversation,
  incrementConversationCount
} from '@/lib/subscription/FeatureGating';
import { createClient } from '@supabase/supabase-js';

/**
 * Ensure user exists in database (auto-create if needed)
 */
async function ensureUserExists(userId: string): Promise<void> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  // Check if user exists
  const { data: existing } = await supabase
    .from('explorers')
    .select('explorer_id')
    .eq('explorer_id', userId)
    .single();

  // Create if doesn't exist
  if (!existing) {
    console.log(`🆕 Creating new user: ${userId}`);
    await supabase.from('explorers').insert({
      explorer_id: userId,
      explorer_name: `explorer_${userId.slice(0, 8)}`,  // Friendly name from UUID prefix
      email: `${userId}@placeholder.local`,  // Placeholder email (will be updated on auth)
      subscription_status: 'free',
      subscription_tier: 'free',
      conversation_count_this_month: 0,
      conversation_count_last_reset: new Date().toISOString()
    });
  }
}

/**
 * Personal Oracle Consult API Route
 * Full Maya functionality with zen brevity + subscription gating
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, userId = 'anonymous', sessionId, context } = body;

    if (!input) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    console.log('Personal Oracle Consult:', input);

    // ============================================================================
    // SUBSCRIPTION & RATE LIMIT CHECK
    // ============================================================================
    // Ensure user exists in database (auto-create if needed)
    await ensureUserExists(userId);

    const subscription = await getUserSubscription(userId);
    console.log(`📊 User ${userId} subscription:`, {
      tier: subscription.tier,
      status: subscription.status,
      conversationsThisMonth: subscription.conversationsThisMonth
    });

    const accessCheck = canStartConversation(subscription);
    console.log(`🔐 Access check result:`, {
      allowed: accessCheck.allowed,
      reason: accessCheck.reason
    });

    if (!accessCheck.allowed) {
      console.log(`❌ Conversation blocked for ${userId}: ${accessCheck.reason}`);

      return NextResponse.json({
        success: false,
        error: accessCheck.reason || 'limit_reached',
        message: accessCheck.message || 'Conversation limit reached',
        upgradePrompt: accessCheck.upgradePrompt,
        data: {
          subscription: {
            tier: subscription.tier,
            status: subscription.status,
            conversationsThisMonth: subscription.conversationsThisMonth
          }
        }
      }, { status: 403 });
    }

    // ============================================================================
    // PROCESS CONSULTATION
    // ============================================================================
    const result = await personalOracleAgent.consult({
      userId,
      input,
      sessionId,
      context
    });

    // ============================================================================
    // INCREMENT USAGE COUNTER (for free tier tracking)
    // ============================================================================
    if (result.success) {
      console.log(`⬆️  Incrementing conversation count for ${userId}`);
      await incrementConversationCount(userId);
      console.log(`✅ Conversation count incremented`);
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Oracle consult error:', error);

    return NextResponse.json({
      success: false,
      error: 'Oracle consultation failed',
      data: {
        message: "Tell me your truth.",
        element: 'earth',
        confidence: 0.5,
        metadata: {
          wordCount: 4,
          zenMode: true
        }
      }
    });
  }
}