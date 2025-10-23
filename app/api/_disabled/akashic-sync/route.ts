// backend
// app/api/cron/akashic-sync/route.ts
import { NextResponse } from "next/server";
import { exec } from "child_process";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Promise((resolve) => {
    exec("npx tsx scripts/akashic-sync.ts", { env: process.env }, (err, stdout, stderr) => {
      resolve(
        NextResponse.json({
          ok: !err,
          stdout,
          stderr: stderr || undefined,
          error: err ? String(err) : undefined,
        })
      );
    });
  });
}
