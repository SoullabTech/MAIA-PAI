/**
 * Bardic Memory - Episodes API
 *
 * Handles CRUD operations for memory episodes (rooms that can be re-entered)
 *
 * @module app/api/bardic/episodes
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  createEpisode,
  getEpisode,
  getUserEpisodes,
  updateEpisode,
  deleteEpisode,
  getEpisodesByPlace,
  getEpisodesByElement,
  getSacredEpisodes,
  getElementalDistribution,
  getEpisodeCount,
  createEpisodeVector,
  findSimilarEpisodes,
  type CreateEpisodeParams,
  type UpdateEpisodeParams,
} from '@/lib/services/episode-service';
import { checkQuota, logUsage } from '@/lib/services/quota-service';

// Disable caching - bardic memory should be fresh
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ============================================================================
// HELPER: Get User ID from Auth
// ============================================================================

async function getUserIdFromAuth(request: NextRequest): Promise<string | null> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user.id;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

// ============================================================================
// GET: Retrieve Episodes
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const episodeId = searchParams.get('id');
    const place = searchParams.get('place');
    const element = searchParams.get('element');
    const sacred = searchParams.get('sacred');
    const analytics = searchParams.get('analytics');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    // Single episode by ID
    if (episodeId) {
      const episode = await getEpisode(episodeId);

      if (!episode) {
        return NextResponse.json(
          { error: 'Episode not found' },
          { status: 404 }
        );
      }

      // Verify ownership
      if (episode.userId !== userId) {
        return NextResponse.json(
          { error: 'Forbidden - not your episode' },
          { status: 403 }
        );
      }

      return NextResponse.json({ episode });
    }

    // Analytics summary
    if (analytics === 'true') {
      const [totalCount, elementalDist, sacredCount] = await Promise.all([
        getEpisodeCount(userId),
        getElementalDistribution(userId),
        getEpisodeCount(userId, { sacredOnly: true }),
      ]);

      return NextResponse.json({
        analytics: {
          totalEpisodes: totalCount,
          sacredEpisodes: sacredCount,
          elementalDistribution: elementalDist,
        },
      });
    }

    // Filter by place
    if (place) {
      const episodes = await getEpisodesByPlace(userId, place);
      return NextResponse.json({ episodes });
    }

    // Filter by element
    if (element) {
      const episodes = await getEpisodesByElement(userId, element as any);
      return NextResponse.json({ episodes });
    }

    // Sacred episodes only
    if (sacred === 'true') {
      const episodes = await getSacredEpisodes(userId);
      return NextResponse.json({ episodes });
    }

    // All episodes for user (with pagination)
    const options: any = {};
    if (limit) options.limit = parseInt(limit);
    if (offset) options.offset = parseInt(offset);

    const episodes = await getUserEpisodes(userId, options);
    return NextResponse.json({ episodes });
  } catch (error: any) {
    console.error('GET /api/bardic/episodes error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve episodes' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST: Create Episode
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      );
    }

    // Check quota
    const quotaCheck = await checkQuota(userId);
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        { error: quotaCheck.reason, quota: quotaCheck.quota },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      datetime,
      sceneStanza,
      placeCue,
      affectValence,
      affectArousal,
      dominantElement,
      elementalState,
      isRecalibration,
      sacredFlag,
      metadata,
      embedding, // Optional: if client generated embedding
    } = body;

    // Validate required fields
    if (!datetime || !sceneStanza) {
      return NextResponse.json(
        { error: 'Missing required fields: datetime, sceneStanza' },
        { status: 400 }
      );
    }

    // Create episode
    const params: CreateEpisodeParams = {
      userId,
      datetime: new Date(datetime),
      sceneStanza,
      placeCue,
      affectValence,
      affectArousal,
      dominantElement,
      elementalState,
      isRecalibration,
      sacredFlag,
      metadata,
    };

    const episode = await createEpisode(params);

    // Create vector embedding (if provided and not sacred)
    if (embedding && !sacredFlag) {
      try {
        await createEpisodeVector({
          episodeId: episode.id!,
          embedding,
        });
      } catch (vectorError: any) {
        console.error('Vector creation error:', vectorError);
        // Don't fail the whole request - episode was created successfully
      }
    }

    // Log usage
    await logUsage({
      userId,
      operation: 'episode_create',
      inputTokens: Math.ceil(sceneStanza.length / 4), // Rough estimate
      outputTokens: 0,
      totalTokens: Math.ceil(sceneStanza.length / 4),
      metadata: { episodeId: episode.id },
    });

    return NextResponse.json({ episode }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/bardic/episodes error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create episode' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH: Update Episode
// ============================================================================

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { episodeId, ...updateFields } = body;

    if (!episodeId) {
      return NextResponse.json(
        { error: 'Missing required field: episodeId' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await getEpisode(episodeId);
    if (!existing) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      );
    }

    if (existing.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden - not your episode' },
        { status: 403 }
      );
    }

    // Update episode
    const params: UpdateEpisodeParams = updateFields;
    const updated = await updateEpisode(episodeId, params);

    return NextResponse.json({ episode: updated });
  } catch (error: any) {
    console.error('PATCH /api/bardic/episodes error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update episode' },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE: Delete Episode
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const episodeId = searchParams.get('id');

    if (!episodeId) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await getEpisode(episodeId);
    if (!existing) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      );
    }

    if (existing.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden - not your episode' },
        { status: 403 }
      );
    }

    // Delete episode (cascade will handle vectors, cues, etc.)
    await deleteEpisode(episodeId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/bardic/episodes error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete episode' },
      { status: 500 }
    );
  }
}
