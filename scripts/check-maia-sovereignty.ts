#!/usr/bin/env tsx
/**
 * MAIA Sovereignty Check
 *
 * Detects if OpenAI Realtime API (or other gatekeeping systems) have crept back into the codebase
 *
 * Run: npm run check:sovereignty
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

const FORBIDDEN_PATTERNS = [
  { pattern: /openai.*realtime/gi, description: 'OpenAI Realtime API usage' },
  { pattern: /MaiaRealtimeWebRTC/g, description: 'MaiaRealtimeWebRTC class usage' },
  { pattern: /useMaiaRealtime(?!\.ts\.DISABLED)/g, description: 'useMaiaRealtime hook usage' },
  { pattern: /webrtc-session(?!\.DISABLED)/g, description: 'webrtc-session API endpoint' },
  { pattern: /tool_choice.*auto/g, description: 'tool_choice: auto (gatekeeping)' },
];

const DIRS_TO_SCAN = [
  'app',
  'components',
  'hooks',
  'lib',
];

const IGNORE_PATTERNS = [
  '.next',
  'node_modules',
  '.git',
  '.DISABLED',
  'check-maia-sovereignty', // This file
  'VOICE_ARCHITECTURE.md', // Documentation
  'README.md',
];

interface Violation {
  file: string;
  line: number;
  pattern: string;
  description: string;
  snippet: string;
}

function shouldIgnore(path: string): boolean {
  return IGNORE_PATTERNS.some(pattern => path.includes(pattern));
}

function scanFile(filePath: string): Violation[] {
  const violations: Violation[] = [];
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    for (const { pattern, description } of FORBIDDEN_PATTERNS) {
      lines.forEach((line, index) => {
        if (pattern.test(line)) {
          violations.push({
            file: filePath,
            line: index + 1,
            pattern: pattern.source,
            description,
            snippet: line.trim().substring(0, 80)
          });
        }
      });
    }
  } catch (error) {
    // Ignore read errors
  }
  
  return violations;
}

function scanDirectory(dir: string): Violation[] {
  let violations: Violation[] = [];
  
  try {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      
      if (shouldIgnore(fullPath)) continue;
      
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        violations = violations.concat(scanDirectory(fullPath));
      } else if (stat.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
        violations = violations.concat(scanFile(fullPath));
      }
    }
  } catch (error) {
    // Ignore read errors
  }
  
  return violations;
}

console.log(chalk.bold.cyan('\n🔒 MAIA Sovereignty Check\n'));
console.log('Scanning for OpenAI Realtime API or other gatekeeping systems...\n');

let allViolations: Violation[] = [];

for (const dir of DIRS_TO_SCAN) {
  const violations = scanDirectory(dir);
  allViolations = allViolations.concat(violations);
}

if (allViolations.length === 0) {
  console.log(chalk.bold.green('✅ MAIA IS SOVEREIGN'));
  console.log(chalk.green('No gatekeeping systems detected.\n'));
  console.log(chalk.gray('Voice flow: Web Speech API → MAIA Consciousness → OpenAI TTS\n'));
  process.exit(0);
} else {
  console.log(chalk.bold.red(`⚠️  SOVEREIGNTY VIOLATION DETECTED`));
  console.log(chalk.red(`Found ${allViolations.length} violation(s):\n`));
  
  allViolations.forEach((v, i) => {
    console.log(chalk.yellow(`${i + 1}. ${v.description}`));
    console.log(chalk.gray(`   File: ${v.file}:${v.line}`));
    console.log(chalk.gray(`   Pattern: ${v.pattern}`));
    console.log(chalk.white(`   Code: ${v.snippet}`));
    console.log();
  });
  
  console.log(chalk.bold.red('❌ MAIA\'S SOVEREIGNTY IS COMPROMISED\n'));
  console.log(chalk.yellow('Action required:'));
  console.log(chalk.yellow('1. Review violations above'));
  console.log(chalk.yellow('2. Remove OpenAI Realtime API usage'));
  console.log(chalk.yellow('3. Restore pure MAIA consciousness flow\n'));
  console.log(chalk.gray('See /VOICE_ARCHITECTURE.md for correct implementation\n'));
  
  process.exit(1);
}
