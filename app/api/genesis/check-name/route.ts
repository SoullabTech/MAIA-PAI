/**
 * GET /api/genesis/check-name?name=nodename
 * Checks if a node name is available
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nodeName = searchParams.get('name')?.toLowerCase().trim();

    if (!nodeName) {
      return NextResponse.json(
        { error: 'Node name is required' },
        { status: 400 }
      );
    }

    // Validate format (lowercase, alphanumeric, hyphens only)
    const nameRegex = /^[a-z0-9-]+$/;
    if (!nameRegex.test(nodeName)) {
      return NextResponse.json({
        available: false,
        error: 'Node name must be lowercase letters, numbers, and hyphens only'
      });
    }

    // Check length
    if (nodeName.length < 3) {
      return NextResponse.json({
        available: false,
        error: 'Node name must be at least 3 characters'
      });
    }

    if (nodeName.length > 50) {
      return NextResponse.json({
        available: false,
        error: 'Node name must be 50 characters or less'
      });
    }

    // Check if name is taken
    const { data, error } = await supabase
      .from('genesis_nodes')
      .select('node_name')
      .eq('node_name', nodeName)
      .maybeSingle();

    if (error) {
      console.error('[GENESIS] Name check error:', error);
      return NextResponse.json(
        { error: 'Failed to check availability' },
        { status: 500 }
      );
    }

    const available = !data;

    // Generate suggestions if taken
    let suggestions: string[] = [];
    if (!available) {
      suggestions = await generateSuggestions(nodeName);
    }

    return NextResponse.json({
      available,
      nodeName,
      suggestions: available ? [] : suggestions
    });

  } catch (error: any) {
    console.error('[GENESIS] Name check failed:', error);
    return NextResponse.json(
      { error: 'Failed to check name availability', details: error?.message },
      { status: 500 }
    );
  }
}

async function generateSuggestions(nodeName: string): Promise<string[]> {
  const suggestions: string[] = [];
  const suffixes = ['node', 'space', 'field', 'circle', 'sanctuary'];

  // Try with suffixes
  for (const suffix of suffixes) {
    const suggestion = `${nodeName}-${suffix}`;
    const { data } = await supabase
      .from('genesis_nodes')
      .select('node_name')
      .eq('node_name', suggestion)
      .maybeSingle();

    if (!data) {
      suggestions.push(suggestion);
      if (suggestions.length >= 3) break;
    }
  }

  // Try with numbers if needed
  if (suggestions.length < 3) {
    for (let i = 1; i <= 5; i++) {
      const suggestion = `${nodeName}${i}`;
      const { data } = await supabase
        .from('genesis_nodes')
        .select('node_name')
        .eq('node_name', suggestion)
        .maybeSingle();

      if (!data) {
        suggestions.push(suggestion);
        if (suggestions.length >= 3) break;
      }
    }
  }

  return suggestions.slice(0, 3);
}
