import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/ratelimit'

// This runs server-side only — safe to use the service role key here
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  if (!rateLimit(request).ok)
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })

  try {
    const { name, email, district } = await request.json()

    // Server-side validation
    if (!name || !email || !district) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }
    if (name.length > 100) {
      return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
    }

    // Check for duplicate email
    const { data: existing } = await supabase
      .from('signatures')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'This email has already signed the petition.' },
        { status: 409 }
      )
    }

    // Insert signature
    const { error } = await supabase.from('signatures').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      district,
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to save signature.' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}