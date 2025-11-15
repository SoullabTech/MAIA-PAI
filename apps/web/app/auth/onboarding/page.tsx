"use client";

import React, { useEffect, useState } from "react";
import { DaimonWelcomeRitual } from "../../../components/onboarding/DaimonWelcomeRitual";
import { workingAuthService } from "@/lib/auth/workingAuth";

export default function OnboardingPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data } = await workingAuthService.getCurrentUser();
        if (data.user) {
          setUserId(data.user.id);
        }
      } catch (error) {
        console.error('Failed to get current user:', error);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-cyan-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sky-400/20 border-t-sky-400 rounded-full animate-spin" />
      </div>
    );
  }

  return <DaimonWelcomeRitual userId={userId || undefined} />;
}
