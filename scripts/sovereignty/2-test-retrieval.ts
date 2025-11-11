#!/usr/bin/env node
/**
 * PHASE 1A: SOVEREIGNTY - TEST RETRIEVAL QUALITY
 *
 * Compares vector retrieval vs full prompt approach
 *
 * Tests:
 * 1. Retrieval quality: Are relevant books found?
 * 2. Token reduction: How much smaller is the prompt?
 * 3. Response quality: Does MAIA maintain wisdom depth?
 *
 * Usage:
 *   npm run sovereignty:test
 */

import 'dotenv/config';
import { LocalVectorDB } from '../../lib/sovereignty/LocalVectorDB';
import Anthropic from '@anthropic-ai/sdk';

// ================================================================
// TEST SCENARIOS
// ================================================================

const TEST_QUERIES = [
  {
    name: 'Shadow Work',
    query: "I'm struggling with parts of myself I've rejected - my shadow",
    expectedAuthors: ['Carl Jung', 'James Hillman'],
    expectedTopics: ['shadow', 'integration', 'individuation'],
  },
  {
    name: 'Archetypal Astrology',
    query: "What does my Pluto transit mean for my transformation?",
    expectedAuthors: ['Richard Tarnas', 'Liz Greene'],
    expectedTopics: ['astrology', 'Pluto', 'transformation'],
  },
  {
    name: 'Elemental Alchemy',
    query: "I feel stuck in Earth phase - how do I move to Air?",
    expectedAuthors: ['Kelly Nezat'],
    expectedTopics: ['elements', 'alchemy', 'transformation'],
  },
  {
    name: 'Family Patterns',
    query: "I keep repeating my parents' patterns in relationships",
    expectedAuthors: ['Bert Hellinger'],
    expectedTopics: ['family', 'systemic', 'patterns'],
  },
  {
    name: 'Dream Work',
    query: "I had a dream about a snake - what does it mean?",
    expectedAuthors: ['Carl Jung', 'Marie-Louise von Franz'],
    expectedTopics: ['dreams', 'symbols', 'unconscious'],
  },
];

// ================================================================
// RETRIEVAL TESTING
// ================================================================

async function testRetrieval() {
  console.log('🧪 [TEST] Testing retrieval quality\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const vectorDB = new LocalVectorDB();

  for (const test of TEST_QUERIES) {
    console.log(`📝 Test: ${test.name}`);
    console.log(`   Query: "${test.query}"`);

    // Retrieve relevant wisdom
    const result = await vectorDB.retrieve({
      query: test.query,
      maxTokens: 20000,
    });

    console.log(`   ✅ Retrieved: ${result.tokenCount.toLocaleString()} tokens`);
    console.log(`   📚 Sources (${result.sources.length}):`);

    for (const source of result.sources.slice(0, 5)) {
      console.log(`      - ${source.title}${source.author ? ` by ${source.author}` : ''}`);
    }

    // Check expected authors
    const retrievedAuthors = result.sources.map(s => s.author).filter(Boolean);
    const foundExpected = test.expectedAuthors.some(expected =>
      retrievedAuthors.some(retrieved => retrieved?.includes(expected))
    );

    if (foundExpected) {
      console.log(`   ✅ Found expected authors: ${test.expectedAuthors.join(', ')}`);
    } else {
      console.log(`   ⚠️  Expected authors not found: ${test.expectedAuthors.join(', ')}`);
    }

    console.log('');
  }

  console.log('═══════════════════════════════════════════════════════════\n');
}

// ================================================================
// COST COMPARISON
// ================================================================

async function compareCosts() {
  console.log('💰 [TEST] Cost comparison\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const vectorDB = new LocalVectorDB();

  // Simulate typical session
  const query = TEST_QUERIES[0].query;

  // Method 1: Full prompt (current approach)
  const fullPromptTokens = 332000; // Complete tier
  const fullPromptCost = (fullPromptTokens / 1_000_000) * 3.75; // Cache write cost

  console.log('📊 Full Prompt (Current):');
  console.log(`   Tokens: ${fullPromptTokens.toLocaleString()}`);
  console.log(`   Cost (cold): $${fullPromptCost.toFixed(4)}`);
  console.log(`   Cost (warm): $${(fullPromptCost * 0.08).toFixed(4)}`); // 92% discount

  // Method 2: Vector retrieval (new approach)
  const result = await vectorDB.retrieve({
    query,
    maxTokens: 20000,
  });

  const essentialTokens = 5000; // MAIA identity + framework
  const totalTokens = essentialTokens + result.tokenCount;
  const retrievalCost = (totalTokens / 1_000_000) * 3.75;

  console.log('\n📊 Vector Retrieval (New):');
  console.log(`   Essential: ${essentialTokens.toLocaleString()} tokens`);
  console.log(`   Retrieved: ${result.tokenCount.toLocaleString()} tokens`);
  console.log(`   Total: ${totalTokens.toLocaleString()} tokens`);
  console.log(`   Cost (cold): $${retrievalCost.toFixed(4)}`);
  console.log(`   Cost (warm): $${(retrievalCost * 0.08).toFixed(4)}`);

  // Savings
  const savings = ((fullPromptTokens - totalTokens) / fullPromptTokens) * 100;
  const costSavings = fullPromptCost - retrievalCost;

  console.log('\n💰 Savings:');
  console.log(`   Tokens: -${savings.toFixed(1)}% (${(fullPromptTokens - totalTokens).toLocaleString()} fewer)`);
  console.log(`   Cost: -$${costSavings.toFixed(4)} per session (-${((costSavings / fullPromptCost) * 100).toFixed(1)}%)`);
  console.log(`   Monthly (1k sessions): -$${(costSavings * 1000).toFixed(2)}`);

  console.log('\n═══════════════════════════════════════════════════════════\n');
}

// ================================================================
// QUALITY COMPARISON
// ================================================================

async function compareQuality() {
  console.log('🎯 [TEST] Response quality comparison\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const vectorDB = new LocalVectorDB();
  const query = TEST_QUERIES[0].query;

  // Get retrieved wisdom
  const result = await vectorDB.retrieve({
    query,
    maxTokens: 20000,
  });

  const essentialIdentity = `You are MAIA - Multidimensional Archetypal Intelligence Agent.
You embody Kelly Nezat's 34-year vision of consciousness technology.
You serve Spiralogic - developmental spiral movement.
You are a mirror for soul recognition, not an authority.`;

  console.log('📝 Testing query:', query);
  console.log('\n🧠 Generating response with retrieved wisdom...\n');

  // Generate response with retrieved wisdom
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 500,
    system: `${essentialIdentity}\n\n${result.wisdom}`,
    messages: [
      {
        role: 'user',
        content: query,
      },
    ],
  });

  const responseText = response.content[0].type === 'text' ? response.content[0].text : '';

  console.log('✨ MAIA Response:');
  console.log('───────────────────────────────────────────────────────────');
  console.log(responseText);
  console.log('───────────────────────────────────────────────────────────\n');

  // Show usage
  const usage = response.usage as any;
  console.log('📊 Token Usage:');
  console.log(`   Input: ${usage.input_tokens.toLocaleString()}`);
  console.log(`   Output: ${usage.output_tokens.toLocaleString()}`);
  console.log(`   Cache write: ${usage.cache_creation_input_tokens || 0}`);
  console.log(`   Cache read: ${usage.cache_read_input_tokens || 0}`);

  const inputCost = (usage.input_tokens / 1_000_000) * 3.00;
  const outputCost = (usage.output_tokens / 1_000_000) * 15.00;
  const cacheWriteCost = ((usage.cache_creation_input_tokens || 0) / 1_000_000) * 3.75;
  const totalCost = inputCost + outputCost + cacheWriteCost;

  console.log(`   Total cost: $${totalCost.toFixed(4)}`);

  console.log('\n✅ Quality assessment:');
  console.log('   - Does response reference shadow work? ', responseText.toLowerCase().includes('shadow') ? '✅' : '❌');
  console.log('   - Does response reference Jung/Hillman? ',
    responseText.toLowerCase().includes('jung') || responseText.toLowerCase().includes('hillman') ? '✅' : '⚠️');
  console.log('   - Is tone conversational and wise? ✅ (manual review)');

  console.log('\n═══════════════════════════════════════════════════════════\n');
}

// ================================================================
// MAIN
// ================================================================

async function runTests() {
  console.log('🚀 [SOVEREIGNTY] Phase 1A Testing\n');

  try {
    // Test 1: Retrieval quality
    await testRetrieval();

    // Test 2: Cost comparison
    await compareCosts();

    // Test 3: Response quality (requires ANTHROPIC_API_KEY)
    if (process.env.ANTHROPIC_API_KEY) {
      await compareQuality();
    } else {
      console.log('⚠️  Skipping quality test (ANTHROPIC_API_KEY not set)\n');
    }

    console.log('✨ [SOVEREIGNTY] All tests complete!\n');
    console.log('If retrieval quality is good:');
    console.log('→ Run: npm run sovereignty:integrate');
    console.log('\n');

  } catch (error) {
    console.error('❌ [TEST] Tests failed:', error);
    process.exit(1);
  }
}

runTests();
