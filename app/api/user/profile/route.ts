import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const maxDuration = 10;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const domain = searchParams.get('domain');

    console.log('🔍 [User Profile API] Fetching profile for:', { userId, domain });

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing userId parameter'
      }, { status: 400 });
    }

    // Handle guest users with non-UUID format
    if (userId.startsWith('guest_')) {
      console.log('👻 [User Profile API] Guest user detected, returning default profile');
      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          name: 'Explorer', // Default name for guest users
          email: null,
          domain: domain || 'localhost',
          is_guest: true,
          created_at: new Date().toISOString()
        }
      });
    }

    // For UUID-formatted user IDs, attempt Supabase lookup
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, created_at')
        .eq('id', userId)
        .single();

      if (error) {
        console.log('❌ [User Profile API] Error fetching user:', error);
        // Fall back to guest profile if user not found
        return NextResponse.json({
          success: true,
          user: {
            id: userId,
            name: 'Explorer',
            email: null,
            domain: domain || 'localhost',
            is_guest: true,
            created_at: new Date().toISOString()
          }
        });
      }

      console.log('✅ [User Profile API] User found:', user.name);
      return NextResponse.json({
        success: true,
        user: {
          ...user,
          domain: domain || 'localhost',
          is_guest: false
        }
      });

    } catch (dbError) {
      console.log('⚠️ [User Profile API] Database error, falling back to guest profile:', dbError);
      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          name: 'Explorer',
          email: null,
          domain: domain || 'localhost',
          is_guest: true,
          created_at: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('💥 [User Profile API] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
