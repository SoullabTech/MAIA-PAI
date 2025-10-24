import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth'
import { updateElementBias } from '@/lib/reading/bias'

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req)
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const body = await req.json()
    const { bookId, sectionId, kind, detail } = body

    if (!bookId || !kind) {
      return NextResponse.json({ error: 'missing bookId or kind' }, { status: 400 })
    }

    // Log the event
    const { error } = await db.from('reader_events').insert({
      user_id: user.id,
      book_id: bookId,
      section_id: sectionId || null,
      kind,
      detail: detail || {},
    })

    if (error) throw error

    // Adjust elemental bias based on event kind
    if (kind === 'completed_practice' && detail?.element) {
      await updateElementBias(user.id, detail.element, +0.1)
    }
    if (kind === 'skipped' && detail?.element) {
      await updateElementBias(user.id, detail.element, -0.1)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
