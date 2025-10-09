'use client';

/**
 * 🔧 Debug Auth Page
 *
 * Quick admin tool to check and fix localStorage auth state
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DebugAuthPage() {
  const [betaUsers, setBetaUsers] = useState<Record<string, any>>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newUsername, setNewUsername] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = () => {
    if (typeof window === 'undefined') return;

    const users = JSON.parse(localStorage.getItem('beta_users') || '{}');
    const user = JSON.parse(localStorage.getItem('beta_user') || 'null');

    setBetaUsers(users);
    setCurrentUser(user);

    console.log('📊 Auth state loaded:', {
      betaUsersCount: Object.keys(users).length,
      betaUsernames: Object.keys(users),
      currentUser: user?.username || 'None'
    });
  };

  const createUser = (username: string) => {
    if (!username.trim()) {
      setMessage('❌ Username required');
      return;
    }

    const users = { ...betaUsers };

    const newUser = {
      id: `user_${Date.now()}`,
      username: username.trim(),
      agentId: 'maya-oracle',
      agentName: 'Maya',
      createdAt: new Date().toISOString(),
      onboarded: true, // Skip onboarding for debug
      password: 'debug123' // Default password
    };

    users[newUser.username] = newUser;
    localStorage.setItem('beta_users', JSON.stringify(users));
    localStorage.setItem('beta_user', JSON.stringify(newUser));

    setBetaUsers(users);
    setCurrentUser(newUser);
    setMessage(`✅ Created user "${username}" with password "debug123"`);
    setNewUsername('');

    console.log('✅ User created:', newUser);
  };

  const setAsCurrentUser = (username: string) => {
    const user = betaUsers[username];
    if (!user) return;

    const { password, ...userData } = user;
    localStorage.setItem('beta_user', JSON.stringify(userData));
    setCurrentUser(userData);
    setMessage(`✅ Set ${username} as current user`);

    console.log('✅ Current user set:', userData);
  };

  const deleteUser = (username: string) => {
    const users = { ...betaUsers };
    delete users[username];
    localStorage.setItem('beta_users', JSON.stringify(users));
    setBetaUsers(users);

    if (currentUser?.username === username) {
      localStorage.removeItem('beta_user');
      setCurrentUser(null);
    }

    setMessage(`🗑️ Deleted user "${username}"`);
    console.log('🗑️ User deleted:', username);
  };

  const clearAll = () => {
    if (!confirm('Clear all auth data? This cannot be undone.')) return;

    localStorage.removeItem('beta_users');
    localStorage.removeItem('beta_user');
    setBetaUsers({});
    setCurrentUser(null);
    setMessage('🗑️ All auth data cleared');

    console.log('🗑️ All auth data cleared');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">🔧 Debug Auth</h1>
          <button
            onClick={() => router.push('/checkin')}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            ← Back to Check-in
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-gray-800 rounded border border-gray-700">
            {message}
          </div>
        )}

        {/* Current User */}
        <div className="mb-8 p-6 bg-gray-800 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Current User</h2>
          {currentUser ? (
            <div className="space-y-2">
              <p><span className="text-gray-400">Username:</span> <strong>{currentUser.username}</strong></p>
              <p><span className="text-gray-400">User ID:</span> {currentUser.id}</p>
              <p><span className="text-gray-400">Agent:</span> {currentUser.agentName}</p>
              <p><span className="text-gray-400">Onboarded:</span> {currentUser.onboarded ? '✅ Yes' : '❌ No'}</p>
              <p><span className="text-gray-400">Created:</span> {new Date(currentUser.createdAt).toLocaleString()}</p>

              <button
                onClick={() => router.push('/maya')}
                className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
              >
                Go to Maya →
              </button>
            </div>
          ) : (
            <p className="text-gray-400">No user logged in</p>
          )}
        </div>

        {/* All Users */}
        <div className="mb-8 p-6 bg-gray-800 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">All Users ({Object.keys(betaUsers).length})</h2>

          {Object.keys(betaUsers).length === 0 ? (
            <p className="text-gray-400">No users found in localStorage</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(betaUsers).map(([username, user]: [string, any]) => (
                <div key={username} className="p-4 bg-gray-900 rounded border border-gray-700 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{username}</p>
                    <p className="text-sm text-gray-400">
                      {user.onboarded ? '✅ Onboarded' : '⏳ Not onboarded'} •
                      Password: <code className="ml-1 text-xs bg-gray-800 px-2 py-1 rounded">{user.password || 'Not set'}</code>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAsCurrentUser(username)}
                      className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700"
                      disabled={currentUser?.username === username}
                    >
                      {currentUser?.username === username ? 'Current' : 'Set as Current'}
                    </button>
                    <button
                      onClick={() => deleteUser(username)}
                      className="px-3 py-1 bg-red-600 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create User */}
        <div className="mb-8 p-6 bg-gray-800 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Create New User</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter username (e.g. Kelly)"
              className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') createUser(newUsername);
              }}
            />
            <button
              onClick={() => createUser(newUsername)}
              className="px-6 py-2 bg-green-600 rounded hover:bg-green-700"
            >
              Create
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Will be created with password "debug123" and onboarded status set to true
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-800 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex gap-3">
            <button
              onClick={loadAuthState}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              🔄 Refresh
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
            >
              🗑️ Clear All Auth Data
            </button>
          </div>
        </div>

        {/* Raw Data */}
        <details className="mt-8 p-6 bg-gray-800 rounded border border-gray-700">
          <summary className="text-xl font-semibold cursor-pointer">Raw localStorage Data</summary>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-medium mb-2">beta_users</h3>
              <pre className="p-4 bg-gray-900 rounded text-xs overflow-x-auto">
                {JSON.stringify(betaUsers, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-medium mb-2">beta_user</h3>
              <pre className="p-4 bg-gray-900 rounded text-xs overflow-x-auto">
                {JSON.stringify(currentUser, null, 2)}
              </pre>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
