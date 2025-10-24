'use client';

/**
 * Billing Portal Page
 *
 * Redirects to Stripe Customer Portal for subscription management
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BillingPortalPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    createPortalSession();
  }, []);

  const createPortalSession = async () => {
    try {
      // Get userId from session/auth (you'll need to implement this)
      const userId = getUserId(); // TODO: Implement based on your auth system

      const response = await fetch('/api/subscription/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe portal
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to create portal session');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  // Placeholder - implement based on your auth system
  const getUserId = (): string => {
    // TODO: Get from auth context/session
    return 'user-id-here';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-900 border border-red-900 rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Unable to Access Billing</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting to billing portal...</p>
      </div>
    </div>
  );
}
