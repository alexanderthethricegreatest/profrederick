import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/ratelimit'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ALLOWED_ORG_TYPES = [
  'Agricultural / Farm',
  'Conservation / Environmental',
  'Civic / Community',
  'Business',
  'Hunting / Fishing / Outdoor',
  'Faith Community',
  'Veterans Organization',
  'Other',
]

export async function POST(request) {
  if (!rateLimit(request).ok)
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })

  try {
    const { orgName, orgType, contactName, contactTitle, contactEmail, statement } = await request.json()

    // Server-side validation
    if (!orgName || !orgType || !contactName || !contactEmail || !statement) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }
    if (!ALLOWED_ORG_TYPES.includes(orgType)) {
      return NextResponse.json({ error: 'Invalid organization type.' }, { status: 400 })
    }
    if (statement.length < 20) {
      return NextResponse.json({ error: 'Statement must be at least 20 characters.' }, { status: 400 })
    }
    if (statement.length > 2000) {
      return NextResponse.json({ error: 'Statement must be 2000 characters or fewer.' }, { status: 400 })
    }
    if (orgName.length > 200) {
      return NextResponse.json({ error: 'Organization name is too long.' }, { status: 400 })
    }
    if (contactName.length > 100) {
      return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
    }
    if (contactTitle && contactTitle.length > 100) {
      return NextResponse.json({ error: 'Title is too long.' }, { status: 400 })
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
      console.error('Supabase insert error:', JSON.stringify(error))
      return NextResponse.json({ error: 'Failed to save endorsement.' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}