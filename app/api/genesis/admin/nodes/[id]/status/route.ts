/**
 * PATCH /api/genesis/admin/nodes/[id]/status
 * Updates node status (requires admin auth)
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

// Simple admin auth check
function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.GENESIS_ADMIN_PASSWORD || 'genesis2025';

  if (!authHeader) return false;

  const token = authHeader.replace('Bearer ', '');
  return token === adminPassword;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin auth
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['pending_setup', 'active', 'suspended'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: pending_setup, active, or suspended' },
        { status: 400 }
      );
    }

    // Update node status
    const { data: node, error: updateError } = await supabase
      .from('genesis_nodes')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('[GENESIS ADMIN] Failed to update status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update status', details: updateError.message },
        { status: 500 }
      );
    }

    // Log event
    await supabase
      .from('genesis_events')
      .insert({
        node_id: id,
        event_type: 'status_changed',
        event_data: {
          new_status: status,
          changed_by: 'admin',
          timestamp: new Date().toISOString()
        }
      });

    // TODO: Send email notification to steward if status changed to active
    // if (status === 'active') {
    //   await sendActivationEmail(node);
    // }

    console.log(`[GENESIS ADMIN] Node ${id} status updated to: ${status}`);

    return NextResponse.json({
      success: true,
      message: `Node status updated to: ${status}`,
      node: {
        id: node.id,
        node_name: node.node_name,
        status: node.status
      }
    });

  } catch (error: any) {
    console.error('[GENESIS ADMIN] Status update failed:', error);
    return NextResponse.json(
      { error: 'Failed to update status', details: error?.message },
      { status: 500 }
    );
  }
}
