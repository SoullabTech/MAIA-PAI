import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req)
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const body = await req.json()
    const { stepId } = body

    if (!stepId) {
      return NextResponse.json({ error: 'missing stepId' }, { status: 400 })
    }

    // Mark step as completed
    const { error } = await db
      .from('reading_path_steps')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', stepId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
