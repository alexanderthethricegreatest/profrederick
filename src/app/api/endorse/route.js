import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const { orgName, orgType, contactName, contactTitle, contactEmail, statement } = await request.json()

    // Server-side validation
    if (!orgName || !orgType || !contactName || !contactEmail || !statement) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }
    if (statement.length < 20) {
      return NextResponse.json({ error: 'Statement must be at least 20 characters.' }, { status: 400 })
    }
    if (orgName.length > 200) {
      return NextResponse.json({ error: 'Organization name is too long.' }, { status: 400 })
    }

    // Check for duplicate email
    const { data: existing } = await supabase
      .from('endorsements')
      .select('id')
      .eq('contact_email', contactEmail)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'An endorsement from this email has already been submitted.' },
        { status: 409 }
      )
    }

    // Insert endorsement (approved: false — requires manual approval in Supabase dashboard)
    const { error } = await supabase.from('endorsements').insert({
      org_name: orgName.trim(),
      org_type: orgType,
      person_name: contactName.trim(),
      person_title: contactTitle?.trim() || null,
      contact_email: contactEmail.trim().toLowerCase(),
      comment: statement.trim(),
      approved: false,
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to save endorsement.' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}