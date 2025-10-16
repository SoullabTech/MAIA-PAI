"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function CheckInPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Allow returning users to check in
  // (Week 2 welcome is only for NEW users now, handled in app/page.tsx)

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!username.trim()) {
        throw new Error('Please enter your username');
      }

      console.log('🔍 [checkin] Looking for username:', username);

      // Check if user exists in beta_users
      let users = JSON.parse(localStorage.getItem('beta_users') || '{}');
      console.log('🔍 [checkin] Available users:', Object.keys(users));

      // Check if there's already a beta_user stored
      const existingUser = localStorage.getItem('beta_user');
      if (existingUser) {
        const userData = JSON.parse(existingUser);
        console.log('🔍 [checkin] Found existing beta_user:', userData.username);

        // If the username matches, use that user
        if (userData.username.toLowerCase() === username.toLowerCase()) {
          console.log('✅ [checkin] Matched existing user, redirecting');

          // Restore to beta_users if missing
          if (!users[userData.username]) {
            console.log('🔧 [checkin] Restoring user to beta_users');
            users[userData.username] = {
              ...userData,
              password: 'restored', // Placeholder - they can reset via /auth
              onboarded: true
            };
            localStorage.setItem('beta_users', JSON.stringify(users));
          }

          router.push('/maia'); // Updated to dreamweaver-enhanced MAIA
          return;
        }
      }

      // Case-insensitive username check
      const normalizedUsername = username.toLowerCase();
      const matchingUser = Object.keys(users).find(
        key => key.toLowerCase() === normalizedUsername
      );

      if (!matchingUser) {
        console.error('❌ [checkin] Username not found in beta_users');
        console.log('💡 [checkin] Available usernames:', Object.keys(users));
        throw new Error(`Username "${username}" not found. Please sign up first.`);
      }

      const userWithPassword = users[matchingUser];
      console.log('🔍 [checkin] Found user:', { username, onboarded: userWithPassword.onboarded });

      // Check if user has completed onboarding
      if (userWithPassword.onboarded !== true) {
        console.error('❌ [checkin] User not onboarded');
        throw new Error('Please complete onboarding first');
      }

      // Set current user (without password)
      const { password: _, ...userData } = userWithPassword;
      localStorage.setItem('beta_user', JSON.stringify(userData));

      console.log('✅ [checkin] Quick check-in successful, redirecting to Maya');

      // Go straight to Maya
      router.push('/maia'); // Updated to dreamweaver-enhanced MAIA
    } catch (err: any) {
      console.error('❌ [checkin] Error:', err);
      setError(err.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1f3a] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extralight text-amber-50 tracking-wide mb-2">
            Welcome Back
          </h1>
          <p className="text-amber-200/60 text-sm">
            Enter your username to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleCheckIn} className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 bg-[#0A0D16] border border-amber-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              autoFocus
            />
            <p className="text-amber-200/40 text-xs mt-2">Just your username, not your email</p>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white rounded-lg font-medium hover:from-amber-500 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Checking in...</span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Continue
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        <button
          onClick={() => router.push('/auth')}
          className="w-full mt-4 text-sm text-amber-500/70 hover:text-amber-500/90 transition-colors"
        >
          Need to sign up or use password?
        </button>

        <div className="mt-8 space-y-2 text-center">
          <p className="text-xs text-amber-200/20">
            Quick check-in for returning explorers
          </p>
          <p className="text-xs text-amber-200/30">
            💡 Tip: Logout button is in the top-right Maia Voice/Chat menu
          </p>
        </div>
      </div>
    </div>
  );
}
