#!/usr/bin/env tsx
/**
 * MAIA Pre-Launch System Check
 * Comprehensive verification before beta launch
 */

// Load environment variables first
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local first (priority), then .env
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

import { createClient } from '@supabase/supabase-js';
import { runAllTests } from '../lib/maia/__tests__/pre-launch-test-suite';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

interface SystemCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: any;
}

async function checkEnvironment(): Promise<SystemCheck[]> {
  const checks: SystemCheck[] = [];

  // Check Supabase URL
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    checks.push({
      name: 'Supabase URL',
      status: 'pass',
      message: 'Configured'
    });
  } else {
    checks.push({
      name: 'Supabase URL',
      status: 'fail',
      message: 'Missing NEXT_PUBLIC_SUPABASE_URL'
    });
  }

  // Check Supabase Key
  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    checks.push({
      name: 'Supabase Anon Key',
      status: 'pass',
      message: 'Configured'
    });
  } else {
    checks.push({
      name: 'Supabase Anon Key',
      status: 'fail',
      message: 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY'
    });
  }

  // Check OpenAI Key (for MAIA)
  if (process.env.OPENAI_API_KEY) {
    checks.push({
      name: 'OpenAI API Key',
      status: 'pass',
      message: 'Configured'
    });
  } else {
    checks.push({
      name: 'OpenAI API Key',
      status: 'warn',
      message: 'Missing OPENAI_API_KEY (may use Anthropic instead)'
    });
  }

  return checks;
}

async function checkDatabase(): Promise<SystemCheck[]> {
  const checks: SystemCheck[] = [];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check semantic_memories table
    const { error: memoriesError } = await supabase
      .from('semantic_memories')
      .select('id')
      .limit(1);

    if (!memoriesError) {
      checks.push({
        name: 'semantic_memories table',
        status: 'pass',
        message: 'Accessible'
      });
    } else {
      checks.push({
        name: 'semantic_memories table',
        status: 'fail',
        message: memoriesError.message
      });
    }

    // Check maya_training_corpus table
    const { error: trainingError } = await supabase
      .from('maya_training_corpus')
      .select('id')
      .limit(1);

    if (!trainingError) {
      checks.push({
        name: 'maya_training_corpus table',
        status: 'pass',
        message: 'Accessible'
      });
    } else {
      checks.push({
        name: 'maya_training_corpus table',
        status: 'warn',
        message: 'Not accessible (may need creation)'
      });
    }

    // Check maya_training_metrics table
    const { error: metricsError } = await supabase
      .from('maya_training_metrics')
      .select('id')
      .limit(1);

    if (!metricsError) {
      checks.push({
        name: 'maya_training_metrics table',
        status: 'pass',
        message: 'Accessible'
      });
    } else {
      checks.push({
        name: 'maya_training_metrics table',
        status: 'warn',
        message: 'Not accessible (may need creation)'
      });
    }

  } catch (error) {
    checks.push({
      name: 'Database connection',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Connection failed'
    });
  }

  return checks;
}

async function checkAPIEndpoints(): Promise<SystemCheck[]> {
  const checks: SystemCheck[] = [];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    // Check MAIA endpoint
    const maiaResponse = await fetch(`${baseUrl}/api/oracle/maia`, {
      method: 'GET'
    });

    if (maiaResponse.ok) {
      checks.push({
        name: 'MAIA API endpoint',
        status: 'pass',
        message: 'Responding'
      });
    } else {
      checks.push({
        name: 'MAIA API endpoint',
        status: 'fail',
        message: `HTTP ${maiaResponse.status}`
      });
    }
  } catch (error) {
    checks.push({
      name: 'MAIA API endpoint',
      status: 'fail',
      message: 'Not accessible (server may be down)'
    });
  }

  return checks;
}

function printSection(title: string) {
  console.log(`\n${colors.cyan}${colors.bright}${'='.repeat(80)}${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}${title}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}\n`);
}

function printCheck(check: SystemCheck) {
  let icon = '';
  let color = colors.reset;

  switch (check.status) {
    case 'pass':
      icon = '✅';
      color = colors.green;
      break;
    case 'warn':
      icon = '⚠️ ';
      color = colors.yellow;
      break;
    case 'fail':
      icon = '❌';
      color = colors.red;
      break;
  }

  console.log(`${icon} ${color}${check.name}${colors.reset}: ${check.message}`);
}

function printSummary(
  envChecks: SystemCheck[],
  dbChecks: SystemCheck[],
  apiChecks: SystemCheck[]
) {
  const allChecks = [...envChecks, ...dbChecks, ...apiChecks];
  const passed = allChecks.filter(c => c.status === 'pass').length;
  const warned = allChecks.filter(c => c.status === 'warn').length;
  const failed = allChecks.filter(c => c.status === 'fail').length;
  const total = allChecks.length;

  printSection('SYSTEM CHECK SUMMARY');

  console.log(`Total Checks: ${total}`);
  console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Warnings: ${warned}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}\n`);

  if (failed > 0) {
    console.log(`${colors.red}${colors.bright}❌ SYSTEM NOT READY FOR LAUNCH${colors.reset}\n`);
    console.log('Fix critical failures before proceeding.\n');
    return false;
  } else if (warned > 0) {
    console.log(`${colors.yellow}${colors.bright}⚠️  SYSTEM READY WITH WARNINGS${colors.reset}\n`);
    console.log('Review warnings but safe to proceed.\n');
    return true;
  } else {
    console.log(`${colors.green}${colors.bright}✅ ALL SYSTEMS GO${colors.reset}\n`);
    return true;
  }
}

async function main() {
  console.log(`${colors.cyan}${colors.bright}`);
  console.log('╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                    MAIA PRE-LAUNCH SYSTEM CHECK                            ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  // Phase 1: Environment Checks
  printSection('PHASE 1: Environment Configuration');
  const envChecks = await checkEnvironment();
  envChecks.forEach(printCheck);

  // Phase 2: Database Checks
  printSection('PHASE 2: Database Tables');
  const dbChecks = await checkDatabase();
  dbChecks.forEach(printCheck);

  // Phase 3: API Endpoint Checks
  printSection('PHASE 3: API Endpoints');
  const apiChecks = await checkAPIEndpoints();
  apiChecks.forEach(printCheck);

  // Summary
  const systemReady = printSummary(envChecks, dbChecks, apiChecks);

  if (!systemReady) {
    process.exit(1);
  }

  // Phase 4: Run Test Suite
  printSection('PHASE 4: Functional Test Suite');

  console.log(`${colors.gray}Running comprehensive test suite...${colors.reset}\n`);

  const testConfig = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    userId: 'pre_launch_test',
    verbose: false
  };

  const testResults = await runAllTests(testConfig);

  // Print test results
  testResults.suites.forEach(suite => {
    const icon = suite.status === 'green' ? '✅' : suite.status === 'yellow' ? '⚠️ ' : '❌';
    const color = suite.status === 'green' ? colors.green : suite.status === 'yellow' ? colors.yellow : colors.red;

    console.log(`${icon} ${color}${suite.suite}${colors.reset}`);
    console.log(`   ${suite.passed}/${suite.totalTests} passed (${(suite.duration/1000).toFixed(2)}s)`);

    // Show failed tests
    const failed = suite.results.filter(r => !r.passed);
    if (failed.length > 0) {
      failed.forEach(test => {
        console.log(`   ${colors.red}✗ ${test.test}${colors.reset}`);
        console.log(`     Expected: ${test.expected}`);
        console.log(`     Actual: ${test.actual}`);
      });
    }
    console.log('');
  });

  // Final verdict
  printSection('FINAL LAUNCH VERDICT');

  const statusIcon = testResults.overallStatus === 'green' ? '✅' : testResults.overallStatus === 'yellow' ? '⚠️ ' : '❌';
  const statusColor = testResults.overallStatus === 'green' ? colors.green : testResults.overallStatus === 'yellow' ? colors.yellow : colors.red;

  console.log(`${statusIcon} ${statusColor}${colors.bright}Overall Status: ${testResults.overallStatus.toUpperCase()}${colors.reset}\n`);
  console.log(`Total Tests: ${testResults.summary.totalPassed}/${testResults.summary.totalTests} passed`);
  console.log(`Total Duration: ${(testResults.summary.totalDuration/1000).toFixed(2)}s\n`);

  if (testResults.overallStatus === 'green') {
    console.log(`${colors.green}${colors.bright}🚀 MAIA IS READY FOR BETA LAUNCH!${colors.reset}\n`);
    console.log(`${colors.gray}All systems operational. Memory, calibration, safety protocols verified.${colors.reset}\n`);
    process.exit(0);
  } else if (testResults.overallStatus === 'yellow') {
    console.log(`${colors.yellow}${colors.bright}⚠️  MAIA READY WITH MINOR ISSUES${colors.reset}\n`);
    console.log(`${colors.gray}Review warnings above. Safe to launch but monitor closely.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}${colors.bright}❌ DO NOT LAUNCH - CRITICAL ISSUES DETECTED${colors.reset}\n`);
    console.log(`${colors.gray}Fix failing tests before beta launch.${colors.reset}\n`);
    process.exit(1);
  }
}

// Run the check
main().catch(error => {
  console.error(`${colors.red}Fatal error during system check:${colors.reset}`, error);
  process.exit(1);
});
