/**
 * Trial Expiration Cron Job
 *
 * Checks for expiring trials and sends notification emails
 * Run this daily via Vercel Cron or similar service
 *
 * Vercel Cron setup in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/check-trials",
 *     "schedule": "0 10 * * *"
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  sendTrialExpiringEmail,
  sendTrialEndedEmail
} from '@/lib/email/EmailService';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface TrialUser {
  explorer_id: string;
  explorer_name: string;
  email: string;
  trial_end_date: string;
  subscription_status: string;
}

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔍 Running trial expiration check...');

    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // ========================================================================
    // FIND TRIALS EXPIRING IN 3 DAYS (warning email)
    // ========================================================================

    const { data: expiringIn3Days, error: error1 } = await supabase
      .from('explorers')
      .select('explorer_id, explorer_name, email, trial_end_date, subscription_status')
      .eq('subscription_status', 'trialing')
      .gte('trial_end_date', threeDaysFromNow.toISOString())
      .lt('trial_end_date', new Date(threeDaysFromNow.getTime() + 24 * 60 * 60 * 1000).toISOString());

    if (error1) {
      console.error('Error fetching expiring trials:', error1);
    } else if (expiringIn3Days && expiringIn3Days.length > 0) {
      console.log(`📧 Found ${expiringIn3Days.length} trials expiring in 3 days`);

      for (const user of expiringIn3Days as TrialUser[]) {
        const trialEndDate = new Date(user.trial_end_date);
        const result = await sendTrialExpiringEmail(
          user.email,
          user.explorer_name,
          3,
          trialEndDate
        );

        if (result.success) {
          console.log(`  ✅ Sent warning email to ${user.explorer_name}`);
        } else {
          console.error(`  ❌ Failed to send email to ${user.explorer_name}:`, result.error);
        }
      }
    } else {
      console.log('No trials expiring in 3 days');
    }

    // ========================================================================
    // FIND TRIALS EXPIRING TODAY (final notice)
    // ========================================================================

    const { data: expiringToday, error: error2 } = await supabase
      .from('explorers')
      .select('explorer_id, explorer_name, email, trial_end_date, subscription_status')
      .eq('subscription_status', 'trialing')
      .gte('trial_end_date', today.toISOString())
      .lt('trial_end_date', tomorrow.toISOString());

    if (error2) {
      console.error('Error fetching trials expiring today:', error2);
    } else if (expiringToday && expiringToday.length > 0) {
      console.log(`📧 Found ${expiringToday.length} trials expiring today`);

      for (const user of expiringToday as TrialUser[]) {
        const result = await sendTrialEndedEmail(
          user.email,
          user.explorer_name
        );

        if (result.success) {
          console.log(`  ✅ Sent expiration email to ${user.explorer_name}`);

          // Update status to trial_ended
          await supabase
            .from('explorers')
            .update({
              subscription_status: 'trial_ended',
              subscription_tier: 'free'
            })
            .eq('explorer_id', user.explorer_id);

          console.log(`  ✅ Updated ${user.explorer_name} to trial_ended status`);
        } else {
          console.error(`  ❌ Failed to send email to ${user.explorer_name}:`, result.error);
        }
      }
    } else {
      console.log('No trials expiring today');
    }

    // ========================================================================
    // FIND TRIALS THAT EXPIRED YESTERDAY (cleanup)
    // ========================================================================

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: expiredYesterday, error: error3 } = await supabase
      .from('explorers')
      .select('explorer_id, explorer_name')
      .eq('subscription_status', 'trialing')
      .lt('trial_end_date', today.toISOString());

    if (error3) {
      console.error('Error fetching expired trials:', error3);
    } else if (expiredYesterday && expiredYesterday.length > 0) {
      console.log(`🧹 Cleaning up ${expiredYesterday.length} expired trials`);

      for (const user of expiredYesterday) {
        await supabase
          .from('explorers')
          .update({
            subscription_status: 'trial_ended',
            subscription_tier: 'free'
          })
          .eq('explorer_id', user.explorer_id);

        console.log(`  ✅ Cleaned up ${user.explorer_name}`);
      }
    }

    const summary = {
      expiringIn3Days: expiringIn3Days?.length || 0,
      expiringToday: expiringToday?.length || 0,
      cleaned: expiredYesterday?.length || 0,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Trial check complete:', summary);

    return NextResponse.json({
      success: true,
      summary
    });

  } catch (error: any) {
    console.error('Error in trial check cron:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error.message },
      { status: 500 }
    );
  }
}
