import { NextRequest, NextResponse } from 'next/server'
import { communityStorage } from '@/lib/community/storage'
import { CreateCommentPayload } from '@/lib/community/types'

// Route segment config for dynamic behavior
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/community/posts/[postId]/comments
 * Fetch all comments for a post
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const comments = await communityStorage.getComments(params.postId)

    // For now, just return comments without replies as replies feature is not implemented yet
    const commentsWithReplies = comments.map(comment => ({
      ...comment,
      replies: [] // Empty replies for now, can be implemented later
    }))

    return NextResponse.json({
      success: true,
      comments: commentsWithReplies
    })
  } catch (error: any) {
    console.error('❌ Failed to fetch comments:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

/**
 * POST /api/community/posts/[postId]/comments
 * Add a comment to a post
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const body = await request.json()

    const payload: CreateCommentPayload = {
      postId: params.postId,
      userId: body.userId,
      userName: body.userName,
      content: body.content,
      parentCommentId: body.parentCommentId
    }

    // Validate
    if (!payload.userId || !payload.userName || !payload.content) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: userId, userName, content'
      }, { status: 400 })
    }

    // Create comment object compatible with storage
    const commentData = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      postId: payload.postId,
      userId: payload.userId,
      content: payload.content,
      timestamp: Date.now()
    }

    const comment = await communityStorage.createComment(commentData)

    if (!comment) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      comment
    })
  } catch (error: any) {
    console.error('❌ Failed to create comment:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}