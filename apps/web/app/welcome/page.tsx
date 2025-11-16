"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the beautiful DaimonWelcomeRitual
    router.replace('/auth/onboarding');
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-cyan-900 flex items-center justify-center">
      <div className="text-sky-300 text-center">
        <div className="w-8 h-8 border-2 border-sky-400/20 border-t-sky-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">Entering consciousness portal...</p>
      </div>
    </div>
  );
}