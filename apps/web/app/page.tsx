"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check for existing onboarded user
    const storedUser = localStorage.getItem('beta_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);

        // Auto-redirect onboarded users directly to MAIA
        if (userData.onboarded) {
          router.push('/maia');
          return;
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('beta_user');
      }
    }

    // Redirect all new users to the existing sage/teal SacredSoulInduction (passcode process)
    router.push('/beta-entry');
  }, [router]);

  // Loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A0C4C7] to-[#7FB5B3] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 relative flex items-center justify-center">
          <div
            className="w-12 h-12 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212, 184, 150, 0.5) 0%, rgba(212, 184, 150, 0.2) 50%, transparent 80%)',
              filter: 'blur(8px)',
              animation: 'pulse 2s infinite'
            }}
          />
        </div>
        <p className="text-teal-900 font-light tracking-wider">Preparing your journey...</p>
      </div>
    </div>
  );
}