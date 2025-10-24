import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth'
import { scorePath } from '@/lib/reading/score'
import manifest from '@/content/elemental-alchemy.manifest.json'

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req)
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const body = await req.json()
    const { bookId, intent } = body

    if (!bookId || !intent) {
      return NextResponse.json({ error: 'missing bookId or intent' }, { status: 400 })
    }

    // Generate personalized path using scoring algorithm
    const { steps } = await scorePath({ manifest, intent, userId: user.id })

    // Create reading path record
    const { data: pathData, error: pathError } = await db
      .from('reading_paths')
      .insert({
        user_id: user.id,
        book_id: bookId,
        intent,
        model_version: 'v1',
      })
      .select()
      .single()

    if (pathError) throw pathError

    // Insert path steps
    const stepInserts = steps.map((step) => ({
      path_id: pathData.id,
      order_index: step.order_index,
      section_id: step.section_id,
      why: step.why,
    }))

    const { error: stepsError } = await db
      .from('reading_path_steps')
      .insert(stepInserts)

    if (stepsError) throw stepsError

    return NextResponse.json({
      path_id: pathData.id,
      intent,
      steps,
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
