import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Server-side only — service role key never exposed to client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const { fullName, email, district, guestCount, questions } = await request.json()

    // Required field validation
    if (!fullName || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }
    if (fullName.length > 100) {
      return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
    }
    const count = typeof guestCount === 'number' ? guestCount : 1
    if (count < 1 || count > 10) {
      return NextResponse.json({ error: 'Guest count must be between 1 and 10.' }, { status: 400 })
    }

    // Check for duplicate email
    const { data: existing } = await supabase
      .from('forum_rsvps')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'An RSVP from this email address has already been recorded.' },
        { status: 409 }
      )
    }

    const { error } = await supabase.from('forum_rsvps').insert({
      full_name:   fullName.trim(),
      email:       email.trim().toLowerCase(),
      district:    district || null,
      guest_count: count,
      questions:   questions ? questions.trim() : null,
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to save your RSVP.' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
