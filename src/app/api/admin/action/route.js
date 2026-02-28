import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  try {
    const { action, table, id, token } = await req.json()

    // Verify session
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['endorsements', 'community_events'].includes(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
    }

    if (action === 'approve') {
      const { error } = await supabaseAdmin.from(table).update({ approved: true }).eq('id', id)
      if (error) throw error
    } else if (action === 'delete') {
      const { error } = await supabaseAdmin.from(table).delete().eq('id', id)
      if (error) throw error
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin action error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}






















