/**
 * Broadcast Notifications API
 *
 * Multi-channel notification sender
 * Supports Discord webhooks, Telegram bot, and email
 */

import { NextRequest, NextResponse } from 'next/server';

interface BroadcastRequest {
  message: string;
  channels: {
    discord: boolean;
    telegram: boolean;
    email: boolean;
  };
}

interface SendResult {
  channel: string;
  success: boolean;
  count?: number;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BroadcastRequest = await request.json();
    const { message, channels } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const results: SendResult[] = [];

    // Send to Discord
    if (channels.discord) {
      const discordResult = await sendToDiscord(message);
      results.push(discordResult);
    }

    // Send to Telegram
    if (channels.telegram) {
      const telegramResult = await sendToTelegram(message);
      results.push(telegramResult);
    }

    // Send to Email
    if (channels.email) {
      const emailResult = await sendToEmail(message);
      results.push(emailResult);
    }

    // Log broadcast for history
    await logBroadcast({
      message,
      channels,
      results,
      timestamp: new Date(),
    });

    const allSuccessful = results.every((r) => r.success);

    return NextResponse.json({
      success: allSuccessful,
      results,
      message: allSuccessful
        ? 'Broadcast sent successfully'
        : 'Some channels failed to send',
    });
  } catch (error) {
    console.error('Broadcast error:', error);
    return NextResponse.json(
      { error: 'Failed to send broadcast' },
      { status: 500 }
    );
  }
}

/**
 * Send message to Discord via webhook
 */
async function sendToDiscord(message: string): Promise<SendResult> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      channel: 'discord',
      success: false,
      error: 'Discord webhook URL not configured',
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message,
        username: 'Soullab Announcements',
        avatar_url: 'https://soullab.com/icons/icon-192x192.png', // Optional
        embeds: [
          {
            color: 0x667eea, // Purple color
            description: message,
            footer: {
              text: 'The field is holding you 🌀',
            },
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Discord API returned ${response.status}`);
    }

    return {
      channel: 'discord',
      success: true,
      count: 1, // Discord doesn't return member count
    };
  } catch (error) {
    console.error('Discord send error:', error);
    return {
      channel: 'discord',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send message to Telegram via Bot API
 */
async function sendToTelegram(message: string): Promise<SendResult> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return {
      channel: 'telegram',
      success: false,
      error: 'Telegram bot credentials not configured',
    };
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.description || 'Telegram API error');
    }

    return {
      channel: 'telegram',
      success: true,
      count: 1, // Could fetch member count separately if needed
    };
  } catch (error) {
    console.error('Telegram send error:', error);
    return {
      channel: 'telegram',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send message to email list
 */
async function sendToEmail(message: string): Promise<SendResult> {
  // This would integrate with your existing email system
  // For now, return a placeholder

  // TODO: Integrate with your email service (Mailchimp, SendGrid, etc.)
  // Example:
  // - Fetch beta tester email list from database
  // - Format message as HTML email
  // - Send via SMTP or email API

  try {
    // Placeholder - replace with actual email sending logic
    console.log('Email broadcast:', message);

    // Simulate success for now
    return {
      channel: 'email',
      success: true,
      count: 35, // Mock recipient count
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      channel: 'email',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Log broadcast to history
 */
async function logBroadcast(data: {
  message: string;
  channels: any;
  results: SendResult[];
  timestamp: Date;
}): Promise<void> {
  // TODO: Store in database or file system
  // For now, just log to console
  console.log('Broadcast log:', {
    ...data,
    timestamp: data.timestamp.toISOString(),
  });

  // Could save to:
  // - Database table (broadcasts table)
  // - JSON file (/data/broadcast-history.json)
  // - Cloud storage (S3, etc.)
}
