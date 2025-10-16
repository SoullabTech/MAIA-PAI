#!/usr/bin/env node

/**
 * Simple initialization script for Crystal Observer deployment
 * Run with: npm run crystal:init
 */

console.log(`
╔══════════════════════════════════════════════════════╗
║     Crystal Observer Deployment Initialization        ║
╚══════════════════════════════════════════════════════╝

This script initializes the automated deployment system.

WHAT WILL HAPPEN:
1. Database tables will be created (if not exist)
2. System will start in Foundation phase (0% Crystal)
3. Automated evolution will begin
4. System will gradually transition over 6 weeks

Current Configuration:
- Mode: Foundation (Legacy)
- Crystal Weight: 0%
- Aether Weight: 0.35
- Monitoring: Enabled
- Reporting: Enabled

The system will AUTOMATICALLY:
- Increase Crystal weight gradually
- Monitor health metrics
- Make adjustments as needed
- Generate hourly/daily reports
- Alert only for critical issues

`);

// Check environment
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

let hasAllEnv = true;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing: ${envVar}`);
    hasAllEnv = false;
  } else {
    console.log(`✅ Found: ${envVar}`);
  }
}

if (!hasAllEnv) {
  console.log(`
Please set the required environment variables in .env.local
Then run this script again.
`);
  process.exit(1);
}

console.log(`
✅ Environment configured

NEXT STEPS:
1. Run database migration:
   supabase migration up 20250116_deployment_orchestration.sql
   supabase migration up 20250116_crystal_health_monitoring.sql

2. Start the orchestration:
   npm run crystal:start

3. Monitor progress at:
   http://localhost:3000/beta/monitor
   (Switch to 'Crystal' tab)

The system will run autonomously. You only need to:
- Check the monitoring dashboard occasionally
- Review weekly executive reports
- Respond to critical alerts (rare)

Ready to begin the transformation? 🦋
`);

// Create package.json scripts if they don't exist
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// Add scripts if they don't exist
if (!packageJson.scripts['crystal:init']) {
  packageJson.scripts['crystal:init'] = 'node scripts/init-crystal-deployment.js';
}
if (!packageJson.scripts['crystal:start']) {
  packageJson.scripts['crystal:start'] = 'tsx scripts/start-crystal-orchestration.ts';
}
if (!packageJson.scripts['crystal:stop']) {
  packageJson.scripts['crystal:stop'] = 'pkill -f start-crystal-orchestration';
}
if (!packageJson.scripts['crystal:status']) {
  packageJson.scripts['crystal:status'] = 'curl http://localhost:3000/api/orchestration';
}

// Save updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`
📝 Added npm scripts:
- npm run crystal:init   (this script)
- npm run crystal:start  (start orchestration)
- npm run crystal:stop   (stop orchestration)
- npm run crystal:status (check status)
`);