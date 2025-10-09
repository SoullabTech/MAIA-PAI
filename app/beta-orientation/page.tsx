'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ElementalOrientation } from '@/components/beta/ElementalOrientation';
import { createClient } from '@supabase/supabase-js';

export default function BetaOrientationPage() {
  const router = useRouter();
  const [explorerName, setExplorerName] = useState('');

  useEffect(() => {
    const checkStatus = async () => {
      const name = sessionStorage.getItem('explorerName') ||
                   localStorage.getItem('explorerName');
      const explorerId = localStorage.getItem('explorerId');
      const localOnboarded = localStorage.getItem('betaOnboardingComplete') === 'true';

      // Check Supabase for onboarding status
      if (explorerId && localOnboarded) {
        try {
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );

          const { data: user } = await supabase
            .from('users')
            .select('beta_onboarded_at')
            .eq('id', explorerId)
            .single();

          if (user?.beta_onboarded_at) {
            router.replace('/maya');
            return;
          }
        } catch (error) {
          console.log('Supabase check failed, continuing with orientation');
        }
      }

      if (!name) {
        router.replace('/beta-entry');
        return;
      }

      setExplorerName(name);
    };

    checkStatus();
  }, [router]);

  if (!explorerName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1f3a]">
        <div className="text-amber-400">Preparing your journey...</div>
      </div>
    );
  }

  return <ElementalOrientation explorerName={explorerName} />;
}