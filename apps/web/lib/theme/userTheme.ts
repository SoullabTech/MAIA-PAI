// No direct Supabase import - using API routes and localStorage instead

export type ThemePreference = 'light' | 'dark' | 'system'

/**
 * Get user's saved theme preference via API route
 */
export async function getUserTheme(userId: string): Promise<ThemePreference> {
  try {
    // For now, fall back to localStorage since we don't have user auth context
    // In the future, this could call an API route to get user preferences
    return getLocalTheme()
  } catch (err) {
    console.error('Error fetching user theme:', err)
    return 'system'
  }
}

/**
 * Save user's theme preference via API route
 */
export async function saveUserTheme(userId: string, theme: ThemePreference): Promise<boolean> {
  try {
    // Save to localStorage immediately
    if (typeof window !== 'undefined') {
      localStorage.setItem('soullab-theme', theme)
    }

    // In the future, this could call an API route to save user preferences
    // For now, just use localStorage
    return true
  } catch (err) {
    console.error('Error saving user theme:', err)
    return false
  }
}

/**
 * Get theme from localStorage (for non-authenticated users)
 */
export function getLocalTheme(): ThemePreference {
  if (typeof window === 'undefined') return 'system'

  const stored = localStorage.getItem('soullab-theme')
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

/**
 * Initialize theme on app load
 */
export async function initializeTheme(userId?: string): Promise<ThemePreference> {
  if (userId) {
    // Authenticated user - fetch via API (currently falls back to localStorage)
    const dbTheme = await getUserTheme(userId)
    if (typeof window !== 'undefined') {
      localStorage.setItem('soullab-theme', dbTheme)
    }
    return dbTheme
  } else {
    // Anonymous user - use localStorage
    return getLocalTheme()
  }
}