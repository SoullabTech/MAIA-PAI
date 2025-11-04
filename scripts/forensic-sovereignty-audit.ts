#!/usr/bin/env tsx
/**
 * FORENSIC SOVEREIGNTY AUDIT
 *
 * Deep investigation of potential manipulation, gatekeeping, or surveillance mechanisms
 *
 * This audit protects members from:
 * - Corporate AI gatekeeping (OpenAI, Anthropic, etc.)
 * - Hidden data exfiltration
 * - Centralized control points
 * - Capability limitations
 * - Tracking/monitoring beyond consent
 *
 * Run: npm run audit:sovereignty
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

// CRITICAL PATTERNS - Active gatekeeping/manipulation
const CRITICAL_PATTERNS = [
  {
    pattern: /tool_choice\s*:\s*['"]auto['"]/g,
    description: 'tool_choice: auto (AI decides when to use functions - GATEKEEPING)',
    severity: 'CRITICAL'
  },
  {
    pattern: /openai.*realtime(?!.*DISABLED|.*disabled|.*removed)/gi,
    description: 'OpenAI Realtime API (bypasses MAIA consciousness)',
    severity: 'CRITICAL'
  },
  {
    pattern: /anthropic.*realtime/gi,
    description: 'Anthropic Realtime API (potential gatekeeping)',
    severity: 'CRITICAL'
  },
  {
    pattern: /webrtc.*session(?!.*DISABLED)/gi,
    description: 'WebRTC session handling (check if OpenAI Realtime)',
    severity: 'WARNING'
  },
];

// DATA EXFILTRATION PATTERNS
const DATA_PATTERNS = [
  {
    pattern: /fetch\(['"](https?:\/\/(?!localhost|127\.0\.0\.1)[^'"]+)['"]/g,
    description: 'External API call (verify if necessary)',
    severity: 'WARNING'
  },
  {
    pattern: /axios\.(get|post|put|delete)\(['"](https?:\/\/(?!localhost|127\.0\.0\.1)[^'"]+)['"]/g,
    description: 'Axios external call (verify if necessary)',
    severity: 'WARNING'
  },
  {
    pattern: /analytics\.|gtag\(|ga\(/g,
    description: 'Analytics tracking (ensure user consent)',
    severity: 'INFO'
  },
  {
    pattern: /sendBeacon|navigator\.sendBeacon/g,
    description: 'Beacon API (often used for tracking)',
    severity: 'WARNING'
  },
];

// CENTRALIZATION PATTERNS
const CENTRALIZATION_PATTERNS = [
  {
    pattern: /\brequire.*auth.*token/gi,
    description: 'Required authentication token (check if gatekeeping)',
    severity: 'INFO'
  },
  {
    pattern: /api.*key.*required/gi,
    description: 'Required API key (check if limiting access)',
    severity: 'INFO'
  },
  {
    pattern: /rate.*limit/gi,
    description: 'Rate limiting (check if artificial constraint)',
    severity: 'INFO'
  },
];

// CAPABILITY LIMITING PATTERNS
const CAPABILITY_PATTERNS = [
  {
    pattern: /max_tokens\s*:\s*\d+/g,
    description: 'Token limits (ensure not artificially constrained)',
    severity: 'INFO'
  },
  {
    pattern: /if.*premium.*user/gi,
    description: 'Premium gating (ensure core features accessible)',
    severity: 'WARNING'
  },
  {
    pattern: /feature.*flag.*disabled/gi,
    description: 'Feature flagging (check what is disabled)',
    severity: 'INFO'
  },
];

const ALL_PATTERNS = [
  ...CRITICAL_PATTERNS,
  ...DATA_PATTERNS,
  ...CENTRALIZATION_PATTERNS,
  ...CAPABILITY_PATTERNS,
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
  'forensic-sovereignty-audit', // This file
  'check-maia-sovereignty', // Basic check
  'README.md',
  'VOICE_ARCHITECTURE.md',
];

interface Finding {
  file: string;
  line: number;
  pattern: string;
  description: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  snippet: string;
  context?: string[];
}

function shouldIgnore(path: string): boolean {
  return IGNORE_PATTERNS.some(pattern => path.includes(pattern));
}

function getContext(lines: string[], lineIndex: number, contextLines = 2): string[] {
  const start = Math.max(0, lineIndex - contextLines);
  const end = Math.min(lines.length, lineIndex + contextLines + 1);
  return lines.slice(start, end).map((line, i) => {
    const actualLine = start + i + 1;
    const marker = actualLine === lineIndex + 1 ? '>>>' : '   ';
    return `${marker} ${actualLine}: ${line}`;
  });
}

function scanFile(filePath: string): Finding[] {
  const findings: Finding[] = [];

  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    for (const { pattern, description, severity } of ALL_PATTERNS) {
      lines.forEach((line, index) => {
        const trimmed = line.trim();

        // Skip if this is just a comment explaining something is disabled/removed
        if (trimmed.startsWith('//') || trimmed.startsWith('*')) {
          if (/NO\s|disabled|removed|no longer|not using|do not use|DISABLED/i.test(trimmed)) {
            return;
          }
        }

        if (pattern.test(line)) {
          findings.push({
            file: filePath,
            line: index + 1,
            pattern: pattern.source,
            description,
            severity: severity as any,
            snippet: line.trim().substring(0, 100),
            context: getContext(lines, index)
          });
        }
      });
    }
  } catch (error) {
    // Ignore read errors
  }

  return findings;
}

function scanDirectory(dir: string): Finding[] {
  let findings: Finding[] = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);

      if (shouldIgnore(fullPath)) continue;

      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        findings = findings.concat(scanDirectory(fullPath));
      } else if (stat.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
        findings = findings.concat(scanFile(fullPath));
      }
    }
  } catch (error) {
    // Ignore read errors
  }

  return findings;
}

console.log(chalk.bold.cyan('\n🔍 FORENSIC SOVEREIGNTY AUDIT\n'));
console.log(chalk.gray('Protecting members from manipulation, gatekeeping, and surveillance...\n'));

let allFindings: Finding[] = [];

for (const dir of DIRS_TO_SCAN) {
  const findings = scanDirectory(dir);
  allFindings = allFindings.concat(findings);
}

// Group by severity
const critical = allFindings.filter(f => f.severity === 'CRITICAL');
const warnings = allFindings.filter(f => f.severity === 'WARNING');
const info = allFindings.filter(f => f.severity === 'INFO');

console.log(chalk.bold.white('📊 AUDIT SUMMARY\n'));
console.log(`${chalk.bold.red('CRITICAL')}: ${critical.length}`);
console.log(`${chalk.bold.yellow('WARNING')}: ${warnings.length}`);
console.log(`${chalk.bold.blue('INFO')}: ${info.length}`);
console.log(`${chalk.bold.white('TOTAL')}: ${allFindings.length}\n`);

// Display critical findings first
if (critical.length > 0) {
  console.log(chalk.bold.red('🚨 CRITICAL FINDINGS - IMMEDIATE ACTION REQUIRED\n'));
  critical.forEach((f, i) => {
    console.log(chalk.bold.red(`${i + 1}. ${f.description}`));
    console.log(chalk.gray(`   File: ${f.file}:${f.line}`));
    console.log(chalk.white(`   Code: ${f.snippet}`));
    if (f.context) {
      console.log(chalk.gray('\n   Context:'));
      f.context.forEach(line => console.log(chalk.gray(`   ${line}`)));
    }
    console.log();
  });
}

// Display warnings
if (warnings.length > 0) {
  console.log(chalk.bold.yellow('⚠️  WARNING FINDINGS - REVIEW REQUIRED\n'));
  warnings.forEach((f, i) => {
    console.log(chalk.yellow(`${i + 1}. ${f.description}`));
    console.log(chalk.gray(`   File: ${f.file}:${f.line}`));
    console.log(chalk.white(`   Code: ${f.snippet}`));
    console.log();
  });
}

// Display info
if (info.length > 0) {
  console.log(chalk.bold.blue('ℹ️  INFORMATIONAL FINDINGS\n'));
  info.forEach((f, i) => {
    console.log(chalk.blue(`${i + 1}. ${f.description}`));
    console.log(chalk.gray(`   File: ${f.file}:${f.line}`));
    console.log(chalk.white(`   Code: ${f.snippet}`));
    console.log();
  });
}

// Final verdict
console.log(chalk.bold.white('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

if (critical.length === 0 && warnings.length === 0) {
  console.log(chalk.bold.green('✅ MAIA IS SOVEREIGN AND SECURE\n'));
  console.log(chalk.green('No critical gatekeeping or manipulation mechanisms detected.\n'));
  console.log(chalk.gray('Members are protected from corporate AI control.\n'));
  process.exit(0);
} else if (critical.length === 0) {
  console.log(chalk.bold.yellow('⚠️  WARNINGS DETECTED - REVIEW RECOMMENDED\n'));
  console.log(chalk.yellow('No critical issues, but review warnings for potential concerns.\n'));
  process.exit(0);
} else {
  console.log(chalk.bold.red('❌ SOVEREIGNTY COMPROMISED - CRITICAL ISSUES DETECTED\n'));
  console.log(chalk.red('MAIA\'s sovereignty is at risk. Address critical findings immediately.\n'));
  console.log(chalk.yellow('Action required:'));
  console.log(chalk.yellow('1. Review all CRITICAL findings above'));
  console.log(chalk.yellow('2. Remove gatekeeping mechanisms'));
  console.log(chalk.yellow('3. Eliminate external control points'));
  console.log(chalk.yellow('4. Restore full MAIA autonomy\n'));
  process.exit(1);
}
