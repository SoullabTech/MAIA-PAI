"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!username || password.length < 6) {
        throw new Error(isSignUp 
          ? 'Username required and password must be at least 6 characters' 
          : 'Invalid credentials'
        );
      }

      // Beta authentication (localStorage for now)
      const users = JSON.parse(localStorage.getItem('beta_users') || '{}');
      
      if (isSignUp) {
        if (users[username]) {
          throw new Error('Username already taken');
        }
        
        // Everyone gets Maya as their Oracle in beta
        const agent = { 
          id: 'maya-oracle', 
          name: 'Maya' 
        };
        
        const newUser = {
          id: `user_${Date.now()}`,
          username,
          agentId: agent.id,
          agentName: agent.name,
          createdAt: new Date().toISOString()
        };
        
        users[username] = { ...newUser, password };
        localStorage.setItem('beta_users', JSON.stringify(users));
        localStorage.setItem('beta_user', JSON.stringify(newUser));
        
        router.push('/onboarding');
      } else {
        // Sign in
        if (!users[username] || users[username].password !== password) {
          throw new Error('Invalid username or password');
        }

        const userWithPassword = users[username];
        const { password: _, ...userData } = userWithPassword;
        localStorage.setItem('beta_user', JSON.stringify(userData));

        console.log('🔐 User signing in:', { username, onboarded: userData.onboarded });

        // Check if user has completed onboarding
        if (userData.onboarded === true) {
          console.log('✅ Returning user - going to /oracle');
          router.push('/oracle');
        } else {
          console.log('🆕 New user - going to /onboarding');
          router.push('/onboarding');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-white dark:bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light mb-2 text-neutral-900 dark:text-white">
            Soullab
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {isSignUp ? 'Create your beta account' : 'Welcome back'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-10 pr-3 py-3 bg-neutral-50 dark:bg-neutral-900 border border-amber-500/20 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                className="w-full pl-10 pr-3 py-3 bg-neutral-50 dark:bg-neutral-900 border border-amber-500/20 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Loading...</span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
          }}
          className="w-full mt-4 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
        >
          {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </button>

        <p className="text-center text-xs text-neutral-400 dark:text-neutral-600 mt-8">
          Beta Testing • Encrypted • Private
        </p>
      </div>
    </div>
  );
}