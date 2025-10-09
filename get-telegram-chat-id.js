#!/usr/bin/env node

/**
 * Get Telegram Chat ID Helper Script
 *
 * This script fetches your Telegram group chat ID automatically
 */

const TOKEN = '8049866309:AAGxkqlMwOY5yyu1COzA8TC-hja76t7qyew';

async function getChatId() {
  console.log('🔍 Fetching chat ID from Telegram...\n');

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TOKEN}/getUpdates`
    );

    const data = await response.json();

    if (!data.ok) {
      console.error('❌ Error:', data.description);
      return;
    }

    if (data.result.length === 0) {
      console.log('⚠️  No messages found yet.');
      console.log('\n📝 To fix this:');
      console.log('1. Go to your Telegram group');
      console.log('2. Send any message (like "hello")');
      console.log('3. Run this script again\n');
      return;
    }

    console.log('✅ Found messages!\n');

    // Find all unique chat IDs
    const chats = new Set();

    data.result.forEach((update) => {
      if (update.message && update.message.chat) {
        const chat = update.message.chat;
        chats.add(JSON.stringify({
          id: chat.id,
          title: chat.title || `${chat.first_name || ''} ${chat.last_name || ''}`.trim(),
          type: chat.type
        }));
      }
    });

    console.log('📱 Your Chats:\n');

    chats.forEach((chatStr) => {
      const chat = JSON.parse(chatStr);
      console.log(`   Title: ${chat.title}`);
      console.log(`   Type: ${chat.type}`);
      console.log(`   🎯 Chat ID: ${chat.id}\n`);
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📋 Add to your .env.local:\n');

    const firstChat = JSON.parse([...chats][0]);
    console.log(`TELEGRAM_BOT_TOKEN=${TOKEN}`);
    console.log(`TELEGRAM_CHAT_ID=${firstChat.id}\n`);

  } catch (error) {
    console.error('❌ Failed to fetch:', error.message);
  }
}

getChatId();
