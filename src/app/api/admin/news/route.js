import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    // Verify the session token from the Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })
    }

    // Double-check it's the admin email
    if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase()) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 403 })
    }

    const { title, body, date } = await request.json()

    if (!title?.trim() || !body?.trim() || !date) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('news').insert({
      title: title.trim(),
      body: body.trim(),
      created_at: new Date(date).toISOString(),
    })

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: 'Failed to save update.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('News API error:', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}