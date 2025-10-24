import { db } from '@/lib/db'

/**
 * Adjusts a user's element bias based on what they complete or skip.
 * Fire, Water, Air, Earth, Aether.
 *
 * Example:
 *   updateElementBias(userId, 'fire', +0.1)
 */
export async function updateElementBias(
  userId: string,
  element: string,
  delta: number
) {
  try {
    const { data } = await db
      .from('reader_profiles')
      .select('element_bias')
      .eq('user_id', userId)
      .single()

    const current = (data?.element_bias || {}) as Record<string, number>
    const next = { ...current }

    next[element] = clamp((next[element] ?? 0) + delta, -1, 1)

    const { error } = await db
      .from('reader_profiles')
      .update({ element_bias: next, updated_at: new Date().toISOString() })
      .eq('user_id', userId)

    if (error) throw error
    return next
  } catch (err) {
    console.error('updateElementBias error', err)
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}
