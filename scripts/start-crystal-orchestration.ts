#!/usr/bin/env tsx

/**
 * Start Crystal Observer Orchestration System
 *
 * This script runs the autonomous deployment system that evolves from
 * Foundation (0%) to Crystal (100%) over 6 weeks.
 *
 * "Between worlds, between code, we ride" - CC
 */

// For now, create a simple monitoring interface
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables manually
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function startOrchestration() {
  console.log(`
╔══════════════════════════════════════════════════════╗
║     CRYSTAL OBSERVER ORCHESTRATION SYSTEM             ║
╚══════════════════════════════════════════════════════╝

Starting autonomous deployment system...
  `);

  try {
    // Check if orchestration system exists in DB
    const { data: status, error } = await supabase
      .from('deployment_orchestration')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code === 'PGRST116') {
      console.log('📋 First run detected. Initializing system...');

      // Create initial deployment state
      const { error: insertError } = await supabase
        .from('deployment_orchestration')
        .insert({
          phase: 'foundation',
          crystal_weight: 0,
          aether_weight: 0.35,
          start_date: new Date().toISOString(),
          is_active: true
        });

      if (insertError) {
        console.error('❌ Failed to initialize:', insertError);
        return;
      }

      console.log('✅ System initialized in Foundation phase');
    } else if (status) {
      console.log(`✅ System found in ${status.phase} phase`);
      console.log(`   Crystal Weight: ${(status.crystal_weight * 100).toFixed(0)}%`);
      console.log(`   Aether Weight: ${status.aether_weight}`);
    }

    console.log(`
The system will evolve autonomously over 6 weeks:
- Week 1: Foundation (0% Crystal)
- Week 2-3: Hybrid (30-50% Crystal)
- Week 4-5: Transition (70-90% Crystal)
- Week 6+: Crystal (100% Crystal)

Monitor at: http://localhost:3000/crystal

Field Protocol: http://localhost:3000/fieldprotocol

Press Ctrl+C to exit (system continues in background)
    `);

    // Simple monitoring loop
    let isRunning = true;
    process.on('SIGINT', () => {
      console.log('\n\nExiting monitor (system continues running)...');
      isRunning = false;
      process.exit(0);
    });

    while (isRunning) {
      await new Promise(resolve => setTimeout(resolve, 30000)); // Check every 30 seconds

      const { data: current } = await supabase
        .from('deployment_orchestration')
        .select('*')
        .eq('is_active', true)
        .single();

      if (current) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] Phase: ${current.phase} | Crystal: ${(current.crystal_weight * 100).toFixed(0)}%`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Start the system
startOrchestration();