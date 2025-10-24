import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req)
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const emptyBias = { fire: 0, water: 0, air: 0, earth: 0, aether: 0 }

    const { error } = await db
      .from('reader_profiles')
      .update({ element_bias: emptyBias, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true, element_bias: emptyBias })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
