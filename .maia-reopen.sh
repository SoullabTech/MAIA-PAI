#!/bin/bash

echo "🔄 Reopening MAIA workspace files..."

code apps/web/app/maia/page.tsx
code apps/web/app/oracle/page.tsx
code apps/web/components/voice/StreamingOracleVoicePlayer.tsx
code apps/web/components/voice/MicTorusIndicator.tsx
code apps/web/components/maia/SoulprintDashboard.tsx
code apps/web/app/api/soulprint/route.ts
code apps/web/app/api/oracle/personal/route.ts
code lib/memory/soulprint.ts
code .env.local
code BETA_TESTER_FAQ.md
code FINAL_LAUNCH_STATUS.md

echo "✅ Core MAIA + Soulprint files reopened in VSCode"