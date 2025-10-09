#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface RecoveryCheck {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
  critical: boolean;
  fix?: string;
}

class PostCrashRecovery {
  private checks: RecoveryCheck[] = [];
  private corruptedFiles: string[] = [];
  private brokenFiles: string[] = [];

  async runRecovery(): Promise<void> {
    console.log('\n🛠️  MAIA POST-CRASH RECOVERY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await this.checkGitStatus();
    await this.checkFileCorruption();
    await this.checkCriticalFiles();
    await this.runLintCheck();
    await this.runTypeCheck();
    await this.checkEnvironment();
    await this.checkDevServer();

    this.displayResults();
    this.displayFixRecommendations();
    this.offerAutoFix();
  }

  private async checkGitStatus(): Promise<void> {
    console.log('🔍 Checking Git Status...\n');

    try {
      const status = execSync('git status --porcelain', { encoding: 'utf-8' });

      if (!status.trim()) {
        this.addCheck('Git Status', 'PASS', 'No uncommitted changes', false);
        return;
      }

      const lines = status.trim().split('\n');
      const modified = lines.filter(l => l.startsWith(' M')).length;
      const staged = lines.filter(l => l.startsWith('M ')).length;
      const untracked = lines.filter(l => l.startsWith('??')).length;

      const message = `${modified} modified, ${staged} staged, ${untracked} untracked`;
      this.addCheck('Git Status', 'WARN', message, false);

      const deletedFiles = lines.filter(l => l.includes(' D ')).map(l => l.split(' ').pop()!);
      if (deletedFiles.length > 0) {
        this.addCheck('Deleted Files', 'WARN', `${deletedFiles.length} files deleted (may be from crash)`, false, `git restore ${deletedFiles.join(' ')}`);
      }

    } catch (error) {
      this.addCheck('Git Status', 'FAIL', `Git check failed: ${error.message}`, false);
    }
  }

  private async checkFileCorruption(): Promise<void> {
    console.log('🔬 Scanning for File Corruption...\n');

    const criticalPaths = [
      'apps/web/app/oracle/page.tsx',
      'apps/web/components/voice/StreamingOracleVoicePlayer.tsx',
      'apps/web/components/voice/MicTorusIndicator.tsx',
      'apps/web/app/api/oracle/personal/route.ts',
      'lib/backend/MayaOrchestrator.ts',
      'lib/oracle/ActiveListeningCore.ts',
      '.env.local'
    ];

    for (const filePath of criticalPaths) {
      const fullPath = path.join(process.cwd(), filePath);

      if (!fs.existsSync(fullPath)) {
        this.corruptedFiles.push(filePath);
        this.addCheck(`File: ${filePath}`, 'FAIL', 'Missing (may have been deleted in crash)', true, `git restore ${filePath}`);
        continue;
      }

      try {
        const content = fs.readFileSync(fullPath, 'utf-8');

        if (content.length === 0) {
          this.corruptedFiles.push(filePath);
          this.addCheck(`File: ${filePath}`, 'FAIL', 'Empty file (likely corrupted)', true, `git restore ${filePath}`);
          continue;
        }

        if (content.includes('\0') || content.includes('�')) {
          this.corruptedFiles.push(filePath);
          this.addCheck(`File: ${filePath}`, 'FAIL', 'Contains null bytes or invalid chars', true, `git restore ${filePath}`);
          continue;
        }

        if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
          const hasUnmatchedBraces = this.checkBraceBalance(content);
          if (hasUnmatchedBraces) {
            this.brokenFiles.push(filePath);
            this.addCheck(`File: ${filePath}`, 'WARN', 'Potential unmatched braces (check manually)', false);
            continue;
          }
        }

        this.addCheck(`File: ${filePath}`, 'PASS', 'Integrity check passed', false);

      } catch (error) {
        this.corruptedFiles.push(filePath);
        this.addCheck(`File: ${filePath}`, 'FAIL', `Cannot read file: ${error.message}`, true, `git restore ${filePath}`);
      }
    }

    if (this.corruptedFiles.length === 0) {
      console.log('  ✅ All critical files intact\n');
    } else {
      console.log(`  ⚠️  ${this.corruptedFiles.length} file(s) may be corrupted\n`);
    }
  }

  private checkBraceBalance(content: string): boolean {
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;

    return Math.abs(openBraces - closeBraces) > 5 || Math.abs(openParens - closeParens) > 5;
  }

  private async checkCriticalFiles(): Promise<void> {
    console.log('📁 Checking Critical System Files...\n');

    const criticalConfigs = [
      'package.json',
      'tsconfig.json',
      'next.config.js',
      '.env.local'
    ];

    for (const file of criticalConfigs) {
      const fullPath = path.join(process.cwd(), file);

      if (!fs.existsSync(fullPath)) {
        this.addCheck(`Config: ${file}`, 'FAIL', 'Missing', true);
        continue;
      }

      try {
        const content = fs.readFileSync(fullPath, 'utf-8');

        if (file.endsWith('.json')) {
          JSON.parse(content);
          this.addCheck(`Config: ${file}`, 'PASS', 'Valid JSON', false);
        } else {
          this.addCheck(`Config: ${file}`, 'PASS', 'File exists', false);
        }
      } catch (error) {
        this.addCheck(`Config: ${file}`, 'FAIL', `Corrupted: ${error.message}`, true, `git restore ${file}`);
      }
    }
  }

  private async runLintCheck(): Promise<void> {
    console.log('🧠 Running Lint Check...\n');

    try {
      execSync('npm run lint', { encoding: 'utf-8', stdio: 'pipe' });
      this.addCheck('Lint', 'PASS', 'No linting errors', false);
    } catch (error) {
      const output = error.stdout || error.stderr || '';
      const errorCount = (output.match(/error/gi) || []).length;

      if (errorCount > 0) {
        this.addCheck('Lint', 'FAIL', `${errorCount} linting error(s) found`, true, 'npm run lint -- --fix');
      } else {
        this.addCheck('Lint', 'WARN', 'Lint exited with non-zero code', false);
      }
    }
  }

  private async runTypeCheck(): Promise<void> {
    console.log('📝 Running TypeScript Check...\n');

    try {
      execSync('npm run typecheck', { encoding: 'utf-8', stdio: 'pipe', timeout: 30000 });
      this.addCheck('TypeCheck', 'PASS', 'No type errors', false);
    } catch (error) {
      if (error.killed) {
        this.addCheck('TypeCheck', 'WARN', 'TypeCheck timed out (large codebase)', false, 'Run manually: npm run typecheck');
      } else {
        const output = error.stdout || error.stderr || '';
        const errorMatch = output.match(/Found (\d+) error/);
        const errorCount = errorMatch ? errorMatch[1] : 'unknown';

        this.addCheck('TypeCheck', 'WARN', `${errorCount} type error(s) found`, false, 'Check tsc output for details');
      }
    }
  }

  private async checkEnvironment(): Promise<void> {
    console.log('⚙️  Checking Environment...\n');

    const envPath = path.join(process.cwd(), '.env.local');

    if (!fs.existsSync(envPath)) {
      this.addCheck('Environment', 'FAIL', '.env.local file missing', true, 'Create .env.local file');
      return;
    }

    const envContent = fs.readFileSync(envPath, 'utf-8');
    const requiredEnv = [
      'ANTHROPIC_API_KEY',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    const missing = requiredEnv.filter(key => !envContent.includes(key + '='));

    if (missing.length === 0) {
      this.addCheck('Environment', 'PASS', 'All critical env vars defined in .env.local', false);
    } else {
      this.addCheck('Environment', 'FAIL', `Missing in .env.local: ${missing.join(', ')}`, true, 'Add missing vars to .env.local');
    }
  }

  private async checkDevServer(): Promise<void> {
    console.log('🚀 Checking Dev Server...\n');

    try {
      const response = await fetch('http://localhost:3000/api/health/maia', {
        signal: AbortSignal.timeout(3000)
      });

      if (response.ok) {
        this.addCheck('Dev Server', 'PASS', 'Server running on localhost:3000', false);
      } else {
        this.addCheck('Dev Server', 'WARN', `Server returned ${response.status}`, false, 'npm run dev');
      }
    } catch (error) {
      this.addCheck('Dev Server', 'WARN', 'Server not running', false, 'npm run dev');
    }
  }

  private addCheck(name: string, status: 'PASS' | 'FAIL' | 'WARN', message: string, critical: boolean, fix?: string): void {
    this.checks.push({ name, status, message, critical, fix });

    const icon = {
      'PASS': '✅',
      'FAIL': '❌',
      'WARN': '⚠️'
    }[status];

    const tag = critical ? ' [CRITICAL]' : '';
    console.log(`  ${icon} ${name}${tag}: ${message}`);
  }

  private displayResults(): void {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RECOVERY RESULTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const total = this.checks.length;
    const passed = this.checks.filter(c => c.status === 'PASS').length;
    const failed = this.checks.filter(c => c.status === 'FAIL').length;
    const warnings = this.checks.filter(c => c.status === 'WARN').length;

    console.log(`Total Checks: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`⚠️  Warnings: ${warnings}`);
    console.log(`❌ Failed: ${failed}`);

    const healthScore = (passed / total) * 100;
    console.log(`\n🏥 Recovery Health: ${healthScore.toFixed(0)}%`);

    const hasCriticalIssues = this.checks.some(c => c.critical && c.status === 'FAIL');

    if (healthScore >= 90 && !hasCriticalIssues) {
      console.log('🟢 Status: FULLY RECOVERED');
    } else if (healthScore >= 70 || !hasCriticalIssues) {
      console.log('🟡 Status: PARTIAL RECOVERY - Some issues found');
    } else {
      console.log('🔴 Status: CRITICAL - Manual intervention required');
    }
  }

  private displayFixRecommendations(): void {
    const issues = this.checks.filter(c => c.status === 'FAIL' || c.status === 'WARN');

    if (issues.length === 0) {
      console.log('\n✨ No issues found - system ready!');
      return;
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 RECOMMENDED FIXES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const critical = issues.filter(i => i.critical && i.status === 'FAIL');
    const nonCritical = issues.filter(i => !i.critical || i.status === 'WARN');

    if (critical.length > 0) {
      console.log('🔴 CRITICAL FIXES (must resolve):\n');
      critical.forEach((issue, idx) => {
        console.log(`   ${idx + 1}. ${issue.name}: ${issue.message}`);
        if (issue.fix) {
          console.log(`      → Run: ${issue.fix}`);
        }
      });
      console.log('');
    }

    if (nonCritical.length > 0) {
      console.log('⚡ RECOMMENDED FIXES:\n');
      nonCritical.forEach((issue, idx) => {
        console.log(`   ${idx + 1}. ${issue.name}: ${issue.message}`);
        if (issue.fix) {
          console.log(`      → Run: ${issue.fix}`);
        }
      });
    }
  }

  private offerAutoFix(): void {
    if (this.corruptedFiles.length === 0 && this.brokenFiles.length === 0) {
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📚 NEXT STEPS');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('   1. Reopen files: sh .maia-reopen.sh');
      console.log('   2. Restart dev: npm run dev');
      console.log('   3. Test system: npm run health');
      console.log('   4. Check console: Open http://localhost:3000 (Cmd+Option+I)');
      console.log('\n✅ System appears stable - safe to continue development\n');
      return;
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔧 AUTO-FIX AVAILABLE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (this.corruptedFiles.length > 0) {
      console.log('⚠️  Corrupted files detected. To restore from git:\n');
      console.log(`   git restore ${this.corruptedFiles.join(' ')}\n`);
    }

    if (this.brokenFiles.length > 0) {
      console.log('⚠️  Files with potential syntax issues:\n');
      this.brokenFiles.forEach(f => console.log(`   - ${f}`));
      console.log('\n   Review these files manually or run: git diff\n');
    }

    const args = process.argv.slice(2);
    if (args.includes('--auto-fix') || args.includes('-f')) {
      console.log('🔄 Auto-fixing corrupted files...\n');
      this.autoFix();
    } else {
      console.log('💡 To auto-restore corrupted files, run:\n');
      console.log('   npm run crash:recover -- --auto-fix\n');
    }
  }

  private autoFix(): void {
    if (this.corruptedFiles.length === 0) {
      console.log('   ✅ No files need restoration\n');
      return;
    }

    console.log(`   Restoring ${this.corruptedFiles.length} file(s)...\n`);

    for (const file of this.corruptedFiles) {
      try {
        execSync(`git restore ${file}`, { encoding: 'utf-8' });
        console.log(`   ✅ Restored: ${file}`);
      } catch (error) {
        console.log(`   ❌ Failed to restore ${file}: ${error.message}`);
      }
    }

    console.log('\n   🎯 Auto-fix complete. Run recovery again to verify.\n');
  }

}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🛠️  MAIA Post-Crash Recovery Tool

Usage:
  npm run crash:recover              Run full recovery scan
  npm run crash:recover -- --auto-fix    Auto-restore corrupted files from git
  npm run crash:recover -- --help        Show this help

What it checks:
  • Git status (uncommitted/deleted files)
  • File corruption (null bytes, empty files, missing files)
  • Critical file integrity (syntax, braces)
  • Lint errors
  • TypeScript errors
  • Environment variables
  • Dev server status

Recovery actions:
  • Identifies corrupted files
  • Suggests git restore commands
  • Can auto-restore with --auto-fix flag
  • Provides clear next steps
    `);
    return;
  }

  const recovery = new PostCrashRecovery();
  await recovery.runRecovery();
}

if (require.main === module) {
  main().catch(error => {
    console.error('\n❌ Recovery script failed:', error);
    process.exit(1);
  });
}

export { PostCrashRecovery };