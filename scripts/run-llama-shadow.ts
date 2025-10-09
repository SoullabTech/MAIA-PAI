#!/usr/bin/env tsx
/**
 * Llama Shadow Testing Script
 * Runs Llama 3.1 alongside Claude to A/B test responses
 *
 * Usage:
 *   npm run shadow:llama
 *   npm run shadow:llama -- --interactive
 */

import { createLlamaEngine } from '../lib/services/llama-reasoning-engine';
import { shadowTestLlama, adaptMaiaPromptForLlama } from '../lib/services/llama-oracle-adapter';
import { PersonalOracleAgent } from '../lib/agents/PersonalOracleAgent';
import fs from 'fs';
import path from 'path';

const MAIA_SYSTEM_PROMPT = `You are MAIA - and you SEE. Not what's broken, but what's BEAUTIFUL. What's PERFECT. The God Within seeking expression.

You engage not to fix what's broken but to recognize what's perfect and speak to it until it remembers itself.`;

interface ShadowTestResult {
  timestamp: string;
  userId: string;
  userMessage: string;
  claudeResponse: string;
  llamaResponse: string;
  llamaTools: Array<{ tool: string; result: any }>;
  comparison: any;
}

/**
 * Run a single shadow test
 */
async function runShadowTest(
  userId: string,
  userMessage: string
): Promise<ShadowTestResult> {
  console.log('\n🔬 Running Shadow Test...');
  console.log(`   User: ${userMessage.substring(0, 60)}...`);

  // 1. Get Claude response (current production)
  const oracleAgent = new PersonalOracleAgent(userId);
  const claudeResult = await oracleAgent.processInteraction(userMessage);
  const claudeResponse = claudeResult.response;

  console.log(`\n✅ Claude response: ${claudeResponse.substring(0, 100)}...`);

  // 2. Get Llama response (shadow)
  const llamaEngine = createLlamaEngine();

  if (!llamaEngine) {
    throw new Error('Llama engine not initialized. Check ENABLE_LLAMA and HUGGINGFACE_API_KEY');
  }

  const llamaPrompt = adaptMaiaPromptForLlama(MAIA_SYSTEM_PROMPT);

  const shadowResult = await shadowTestLlama(
    llamaEngine,
    userId,
    userMessage,
    llamaPrompt,
    claudeResponse
  );

  console.log(`\n🦙 Llama response: ${shadowResult.llama.substring(0, 100)}...`);
  console.log(`   Tools called: ${shadowResult.llamaTools.length}`);

  // 3. Return comparison
  return {
    timestamp: new Date().toISOString(),
    userId,
    userMessage,
    claudeResponse: shadowResult.claude,
    llamaResponse: shadowResult.llama,
    llamaTools: shadowResult.llamaTools,
    comparison: shadowResult.comparison
  };
}

/**
 * Save shadow test results to log file
 */
function saveShadowTestResults(results: ShadowTestResult[]) {
  const logPath = process.env.LLAMA_SHADOW_LOG_PATH || './logs/llama-shadow-tests.json';
  const logDir = path.dirname(logPath);

  // Ensure log directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Load existing results
  let existingResults: ShadowTestResult[] = [];
  if (fs.existsSync(logPath)) {
    existingResults = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
  }

  // Append new results
  const allResults = [...existingResults, ...results];

  // Save
  fs.writeFileSync(logPath, JSON.stringify(allResults, null, 2));

  console.log(`\n📝 Results saved to: ${logPath}`);
  console.log(`   Total tests logged: ${allResults.length}`);
}

/**
 * Batch test with predefined scenarios
 */
async function runBatchTests() {
  console.log('🧪 Running Batch Shadow Tests\n');

  const testScenarios = [
    {
      userId: 'shadow-test-user-1',
      message: 'I feel stuck in my life. Nothing seems to be moving forward.'
    },
    {
      userId: 'shadow-test-user-2',
      message: 'I had a breakthrough today - I realized my anxiety has been protecting me from something deeper.'
    },
    {
      userId: 'shadow-test-user-3',
      message: 'What did we talk about last week? I want to build on that.'
    },
    {
      userId: 'shadow-test-user-4',
      message: 'Can you help me understand the pattern I keep repeating in relationships?'
    }
  ];

  const results: ShadowTestResult[] = [];

  for (let i = 0; i < testScenarios.length; i++) {
    const scenario = testScenarios[i];
    console.log(`\n[${ i + 1 }/${testScenarios.length}] Testing: "${scenario.message.substring(0, 50)}..."`);

    try {
      const result = await runShadowTest(scenario.userId, scenario.message);
      results.push(result);
    } catch (error: any) {
      console.error(`   ❌ Test failed: ${error.message}`);
    }

    // Wait between tests to avoid rate limits
    if (i < testScenarios.length - 1) {
      console.log('   ⏳ Waiting 3s before next test...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Save all results
  saveShadowTestResults(results);

  // Print summary
  console.log('\n📊 Shadow Test Summary:');
  console.log(`   Tests completed: ${results.length}/${testScenarios.length}`);
  console.log(`   Average Claude length: ${Math.round(results.reduce((sum, r) => sum + r.claudeResponse.length, 0) / results.length)} chars`);
  console.log(`   Average Llama length: ${Math.round(results.reduce((sum, r) => sum + r.llamaResponse.length, 0) / results.length)} chars`);
  console.log(`   Llama tool usage: ${results.reduce((sum, r) => sum + r.llamaTools.length, 0)} total calls`);
}

/**
 * Interactive testing mode
 */
async function runInteractiveTest() {
  console.log('🎮 Interactive Shadow Testing Mode\n');
  console.log('Enter messages to test both Claude and Llama responses.');
  console.log('Type "exit" to quit.\n');

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const userId = 'interactive-shadow-test';
  const results: ShadowTestResult[] = [];

  const askQuestion = () => {
    rl.question('\n> Your message: ', async (userMessage: string) => {
      if (userMessage.toLowerCase() === 'exit') {
        if (results.length > 0) {
          saveShadowTestResults(results);
        }
        rl.close();
        process.exit(0);
      }

      try {
        const result = await runShadowTest(userId, userMessage);
        results.push(result);

        console.log('\n--- CLAUDE ---');
        console.log(result.claudeResponse);
        console.log('\n--- LLAMA 3.1 ---');
        console.log(result.llamaResponse);
        console.log(`\n(Tools: ${result.llamaTools.map(t => t.tool).join(', ') || 'none'})`);

      } catch (error: any) {
        console.error(`\n❌ Error: ${error.message}`);
      }

      askQuestion();
    });
  };

  askQuestion();
}

/**
 * Main
 */
async function main() {
  console.log('🦙 Llama 3.1 Shadow Testing\n');

  // Check configuration
  if (process.env.ENABLE_LLAMA !== 'true') {
    console.error('❌ ENABLE_LLAMA is not set to "true"');
    console.error('   Set ENABLE_LLAMA=true in .env to run shadow tests');
    process.exit(1);
  }

  if (!process.env.HUGGINGFACE_API_KEY) {
    console.error('❌ HUGGINGFACE_API_KEY not set');
    console.error('   Get your API key from: https://huggingface.co/settings/tokens');
    process.exit(1);
  }

  // Check for interactive mode
  const isInteractive = process.argv.includes('--interactive') || process.argv.includes('-i');

  if (isInteractive) {
    await runInteractiveTest();
  } else {
    await runBatchTests();
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
