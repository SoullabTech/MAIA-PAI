'use client';

import { ScribeModeWithVoice } from '@/components/oracle/ScribeModeWithVoice';
import { useEffect, useState } from 'react';

export default function ScribePage() {
  const [userId, setUserId] = useState('guest');
  const [userName, setUserName] = useState('Guest');

  useEffect(() => {
    // Get user ID from localStorage or auth
    const betaUser = localStorage.getItem('beta_user');
    if (betaUser) {
      try {
        const userData = JSON.parse(betaUser);
        setUserId(userData.id || 'guest');
        setUserName(userData.name || userData.email || 'Guest');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0D16]">
      <ScribeModeWithVoice userId={userId} userName={userName} />
    </div>
  );
}
