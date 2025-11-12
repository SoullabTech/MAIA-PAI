'use client';

/**
 * INTELLIGENCE DASHBOARD PAGE
 *
 * User-facing page showing their personal transformation intelligence
 *
 * Route: /intelligence
 */

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import IntelligenceDashboard from '@/components/dashboard/IntelligenceDashboard';

export default function IntelligencePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sign In Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your transformation intelligence.
          </p>
          <a
            href="/auth/signin"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <IntelligenceDashboard
        userId={user.id}
        showComparative={true}
      />
    </div>
  );
}
