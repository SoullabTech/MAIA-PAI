/**
 * MAIA Mobile App Configuration
 */

export const AppConfig = {
  // API Configuration
  api: {
    baseUrl: __DEV__
      ? 'http://localhost:3000'
      : 'https://your-production-url.vercel.app',
    endpoints: {
      chat: '/api/maia/chat',
      auth: '/api/auth',
    },
  },

  // Supabase Configuration
  supabase: {
    url: 'https://jkbetmadzcpoinjogkli.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprYmV0bWFkemNwb2luam9na2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NjIyNDUsImV4cCI6MjA1ODEzODI0NX0.K5nuL4m8sP1bC21TmsfpakY5cSfh_5pSLJ83G9Iu_-I',
  },

  // Voice Configuration
  voice: {
    defaultMode: 'walking', // Brief responses for mobile
    language: 'en-US',
    pitch: 1.0,
    rate: 0.95,
  },

  // App Info
  app: {
    name: 'MAIA',
    displayName: 'MAIA - Soul Companion',
    version: '1.0.0',
  },
};
