import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Uses service role to create the admin user if they don't exist yet
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const { email } = await request.json()

    // Only allow the designated admin email
    if (email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase()) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 401 })
    }

    // Create the user if they don't exist — Supabase won't send an OTP
    // to an unknown user when shouldCreateUser is false
    const { error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    })

    // Ignore "already exists" errors
    if (error && !error.message.includes('already been registered')) {
      console.error('User creation error:', error)
      return NextResponse.json({ error: 'Failed to initialize user.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Init error:', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}