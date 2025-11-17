'use client';

import React, { useState, useEffect } from 'react';
import { OracleConversation } from '@/components/OracleConversation';
import { betaTracker } from '@/lib/analytics/betaTracker';

export default function GoldenMAIA() {
  const [userName, setUserName] = useState<string>('Seeker');
  const [userId, setUserId] = useState<string>('');
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    // Generate or retrieve user session
    const sessionId = `maia-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setUserId(sessionId);

    // Check for existing user
    const storedUser = localStorage.getItem('maia_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserName(userData.name || 'Seeker');
        setIsReturningUser(true);
        console.log('🔥 Welcome back,', userData.name);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    } else {
      // New user - prompt for name
      const name = prompt('Welcome, Seeker. What shall I call you?') || 'Seeker';
      setUserName(name);
      localStorage.setItem('maia_user', JSON.stringify({ name, firstVisit: new Date().toISOString() }));
      console.log('🌟 Welcome,', name);
    }

    // Initialize analytics
    betaTracker.initBetaTester(sessionId, { username: userName });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-950 to-black">
      <OracleConversation
        userId={userId}
        userName={userName}
        sessionId={userId}
        isReturningUser={isReturningUser}
        initialMode="normal"
        onModeChange={(mode) => console.log('Mode changed to:', mode)}
      />
    </div>
  );
}