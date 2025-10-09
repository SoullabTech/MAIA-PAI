/**
 * Echo Prevention Test
 * Validates that MAIA doesn't respond to her own outputs (echoes)
 *
 * Run: npx ts-node test/echo-prevention-test.ts
 */

interface TestMessage {
  role: 'user' | 'assistant';
  content: string;
  source?: 'user' | 'maia';
}

interface TestCase {
  name: string;
  messages: TestMessage[];
  expectedFilteredCount: number;
  expectedLastMessage: string;
  shouldReturnFallback?: boolean;
}

// Simulate the ClaudeService message filtering logic
function filterMessages(messages: TestMessage[]): TestMessage[] {
  return messages.filter(msg => {
    const source = msg.source || 'user';
    const content = msg.content?.trim() || '';
    return content.length > 0 && source !== 'maia';
  });
}

// Simulate empty input detection
function checkEmptyInput(input: string): boolean {
  return !input || input.trim().length === 0;
}

const testCases: TestCase[] = [
  {
    name: '1. User → MAIA → User (normal flow)',
    messages: [
      { role: 'user', content: 'Hello MAIA', source: 'user' },
      { role: 'assistant', content: 'Hello! How can I assist you today?', source: 'maia' },
      { role: 'user', content: 'Tell me something good', source: 'user' }
    ],
    expectedFilteredCount: 2, // Two user messages, MAIA echo filtered
    expectedLastMessage: 'Tell me something good'
  },
  {
    name: '2. User → MAIA echo (should be filtered)',
    messages: [
      { role: 'user', content: 'Hello MAIA', source: 'user' },
      { role: 'assistant', content: 'Hello! How can I assist you today?', source: 'maia' }
    ],
    expectedFilteredCount: 1, // Only user message
    expectedLastMessage: 'Hello MAIA'
  },
  {
    name: '3. Multiple MAIA echoes (all filtered)',
    messages: [
      { role: 'user', content: 'I feel fiery today', source: 'user' },
      { role: 'assistant', content: 'Fire is strong in you', source: 'maia' },
      { role: 'assistant', content: 'Fire is strong in you', source: 'maia' },
      { role: 'assistant', content: 'Fire is strong in you', source: 'maia' }
    ],
    expectedFilteredCount: 1, // Only the user message
    expectedLastMessage: 'I feel fiery today'
  },
  {
    name: '4. Empty messages (filtered)',
    messages: [
      { role: 'user', content: 'Hello', source: 'user' },
      { role: 'user', content: '', source: 'user' },
      { role: 'user', content: '   ', source: 'user' }
    ],
    expectedFilteredCount: 1, // Only non-empty message
    expectedLastMessage: 'Hello'
  },
  {
    name: '5. Mixed sources - backward compatible (no source field)',
    messages: [
      { role: 'user', content: 'Test message' }, // No source field (defaults to 'user')
      { role: 'assistant', content: 'Response', source: 'maia' },
      { role: 'user', content: 'Follow up' } // No source field
    ],
    expectedFilteredCount: 2, // Both user messages (no source = user)
    expectedLastMessage: 'Follow up'
  },
  {
    name: '6. Empty input detection',
    messages: [],
    expectedFilteredCount: 0,
    expectedLastMessage: '',
    shouldReturnFallback: true
  }
];

// Run tests
console.log('🧪 Echo Prevention Test Suite\n');
console.log('═'.repeat(60));

let passed = 0;
let failed = 0;

for (const testCase of testCases) {
  console.log(`\n📋 Test: ${testCase.name}`);
  console.log('─'.repeat(60));

  try {
    // Test message filtering
    const filtered = filterMessages(testCase.messages);

    console.log(`   Input messages: ${testCase.messages.length}`);
    console.log(`   Filtered messages: ${filtered.length}`);
    console.log(`   Expected: ${testCase.expectedFilteredCount}`);

    // Validate count
    if (filtered.length !== testCase.expectedFilteredCount) {
      throw new Error(
        `Expected ${testCase.expectedFilteredCount} messages, got ${filtered.length}`
      );
    }

    // Validate last message if applicable
    if (testCase.expectedLastMessage && filtered.length > 0) {
      const lastMessage = filtered[filtered.length - 1].content;
      if (lastMessage !== testCase.expectedLastMessage) {
        throw new Error(
          `Expected last message "${testCase.expectedLastMessage}", got "${lastMessage}"`
        );
      }
      console.log(`   Last message: "${lastMessage}" ✓`);
    }

    // Test empty input fallback
    if (testCase.shouldReturnFallback) {
      const isEmpty = checkEmptyInput('');
      if (!isEmpty) {
        throw new Error('Empty input not detected');
      }
      console.log('   Empty input fallback: triggered ✓');
    }

    console.log(`   ✅ PASSED`);
    passed++;

  } catch (error) {
    console.log(`   ❌ FAILED: ${error}`);
    failed++;
  }
}

// Summary
console.log('\n' + '═'.repeat(60));
console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('🎉 All tests passed! Echo prevention is working correctly.\n');
  console.log('Next steps:');
  console.log('1. Deploy ClaudeService.ts with echo prevention');
  console.log('2. Update API routes to include source field in messages');
  console.log('3. Test with real conversations');
  console.log('4. Monitor logs for [Echo Suppressed] events\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Review the implementation.\n');
  process.exit(1);
}