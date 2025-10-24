import { NextRequest } from 'next/server'
import { db } from './db'

interface User {
  id: string
  email: string
}

/**
 * Extract and verify the Supabase JWT from request cookies or Authorization header
 * Returns user object or null if unauthorized
 */
export async function getUser(req: NextRequest): Promise<User | null> {
  try {
    // Try Authorization header first
    const authHeader = req.headers.get('Authorization')
    let token: string | undefined

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      // Fall back to cookie
      const cookieToken = req.cookies.get('sb-access-token')?.value
      token = cookieToken
    }

    if (!token) return null

    // Verify token with Supabase
    const { data, error } = await db.auth.getUser(token)

    if (error || !data?.user) return null

    return {
      id: data.user.id,
      email: data.user.email!,
    }
  } catch (err) {
    console.error('getUser error:', err)
    return null
  }
}
