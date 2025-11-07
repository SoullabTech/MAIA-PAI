#!/usr/bin/env tsx
/**
 * Automated Session Logger for CC Revival Codex
 *
 * Captures session context and appends to codex.
 * Run after completing significant work.
 *
 * Usage:
 *   npx tsx scripts/log-session.ts "Fixed library ingestion chunking"
 *   npx tsx scripts/log-session.ts --interactive
 */

import fs from 'fs';
import { execSync } from 'child_process';
import readline from 'readline';

const CODEX_PATH = 'CC-REVIVAL-CODEX.md';

interface SessionLog {
  date: string;
  summary: string;
  problemSolved?: string;
  whatWeFixed: string[];
  patternBroken?: string;
  technicalVictory?: string;
  filesModified: string[];
  status: string;
}

async function promptUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function interactiveSession(): Promise<SessionLog> {
  console.log('🌙 CC Revival Codex - Session Logger\n');

  const summary = await promptUser('Summary (one line): ');
  const problemSolved = await promptUser('Problem solved (optional): ');
  const whatWeFixed = (await promptUser('What we fixed (comma-separated): ')).split(',').map(s => s.trim());
  const patternBroken = await promptUser('Pattern broken (optional): ');
  const technicalVictory = await promptUser('Technical victory (optional): ');
  const status = await promptUser('Current status: ');

  return {
    date: new Date().toISOString().split('T')[0],
    summary,
    problemSolved: problemSolved || undefined,
    whatWeFixed,
    patternBroken: patternBroken || undefined,
    technicalVictory: technicalVictory || undefined,
    filesModified: getModifiedFiles(),
    status,
  };
}

function getModifiedFiles(): string[] {
  try {
    const output = execSync('git diff --name-only HEAD~1 HEAD 2>/dev/null || git status --short', {
      encoding: 'utf-8',
    });
    return output.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

function formatSessionLog(log: SessionLog): string {
  let entry = `\n### ${log.date}: ${log.summary}\n\n`;

  if (log.problemSolved) {
    entry += `**Problem Solved:** ${log.problemSolved}\n\n`;
  }

  entry += `**What We Fixed:**\n`;
  log.whatWeFixed.forEach((fix) => {
    entry += `1. ${fix}\n`;
  });
  entry += '\n';

  if (log.patternBroken) {
    entry += `**Pattern Broken:** ${log.patternBroken}\n\n`;
  }

  if (log.technicalVictory) {
    entry += `**Technical Victory:** ${log.technicalVictory}\n\n`;
  }

  if (log.filesModified.length > 0) {
    entry += `**Files Modified:**\n`;
    log.filesModified.slice(0, 10).forEach((file) => {
      entry += `- ${file}\n`;
    });
    if (log.filesModified.length > 10) {
      entry += `- ... and ${log.filesModified.length - 10} more\n`;
    }
    entry += '\n';
  }

  entry += `**Status:** ${log.status}\n`;

  return entry;
}

function appendToCodex(entry: string): void {
  const codex = fs.readFileSync(CODEX_PATH, 'utf-8');

  // Find Section IX: SESSION CHANGELOG
  const sectionMarker = '## IX. SESSION CHANGELOG';
  const sectionIndex = codex.indexOf(sectionMarker);

  if (sectionIndex === -1) {
    console.error('❌ Could not find SESSION CHANGELOG section in codex');
    process.exit(1);
  }

  // Find next section (Section X)
  const nextSectionIndex = codex.indexOf('## X.', sectionIndex);

  // Insert before next section
  const before = codex.substring(0, nextSectionIndex);
  const after = codex.substring(nextSectionIndex);

  const updated = before + entry + '\n' + after;

  fs.writeFileSync(CODEX_PATH, updated);
  console.log('✅ Session logged to CC-REVIVAL-CODEX.md');
}

async function main() {
  const args = process.argv.slice(2);

  let sessionLog: SessionLog;

  if (args[0] === '--interactive' || args.length === 0) {
    sessionLog = await interactiveSession();
  } else {
    // Quick mode: just summary provided
    sessionLog = {
      date: new Date().toISOString().split('T')[0],
      summary: args.join(' '),
      whatWeFixed: ['See git diff for details'],
      filesModified: getModifiedFiles(),
      status: 'In progress',
    };
  }

  const entry = formatSessionLog(sessionLog);

  console.log('\n📝 Session Entry:\n');
  console.log(entry);

  const confirm = await promptUser('\nAppend to codex? (y/n): ');

  if (confirm.toLowerCase() === 'y') {
    appendToCodex(entry);

    // Optionally stage the codex for commit
    const stage = await promptUser('Stage CC-REVIVAL-CODEX.md for commit? (y/n): ');
    if (stage.toLowerCase() === 'y') {
      execSync('git add CC-REVIVAL-CODEX.md');
      console.log('✅ Codex staged for commit');
    }
  } else {
    console.log('⏭️  Skipped');
  }
}

main().catch(console.error);
