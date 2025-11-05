/**
 * Voice Quality Feedback API
 * Collects user feedback for voice quality improvement
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { messageId, text, rating, notes, timestamp } = await req.json();

    if (!messageId || !text || rating === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create feedback directory if it doesn't exist
    const feedbackDir = path.join(process.cwd(), 'voice_training/feedback');
    try {
      await fs.mkdir(feedbackDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Append feedback to JSONL file
    const feedbackFile = path.join(feedbackDir, 'voice_feedback.jsonl');
    const feedbackEntry = JSON.stringify({
      messageId,
      text,
      rating,
      notes,
      timestamp: timestamp || new Date().toISOString()
    }) + '\n';

    await fs.appendFile(feedbackFile, feedbackEntry);

    console.log(`💬 [VoiceFeedback] Rating: ${rating}/5 - "${text.substring(0, 50)}..."`);
    if (notes) {
      console.log(`   Notes: ${notes}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback recorded'
    });

  } catch (error) {
    console.error('Error recording voice feedback:', error);
    return NextResponse.json(
      { error: 'Failed to record feedback' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Return feedback statistics
    const feedbackFile = path.join(
      process.cwd(),
      'voice_training/feedback/voice_feedback.jsonl'
    );

    try {
      const content = await fs.readFile(feedbackFile, 'utf-8');
      const lines = content.trim().split('\n');
      const feedbackItems = lines.map(line => JSON.parse(line));

      // Calculate statistics
      const totalFeedback = feedbackItems.length;
      const averageRating = feedbackItems.reduce((sum, item) => sum + item.rating, 0) / totalFeedback;
      const ratingDistribution = feedbackItems.reduce((dist: any, item) => {
        dist[item.rating] = (dist[item.rating] || 0) + 1;
        return dist;
      }, {});

      return NextResponse.json({
        totalFeedback,
        averageRating: averageRating.toFixed(2),
        ratingDistribution,
        recentFeedback: feedbackItems.slice(-10).reverse()
      });

    } catch {
      return NextResponse.json({
        totalFeedback: 0,
        averageRating: 0,
        message: 'No feedback collected yet'
      });
    }

  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}
