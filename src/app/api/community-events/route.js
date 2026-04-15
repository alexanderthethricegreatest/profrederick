import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit } from '@/lib/ratelimit'

const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET — fetch approved community events
export async function GET() {
  const { data, error } = await supabasePublic
    .from('community_events')
    .select('id, title, description, date, time, location, organizer_name, external_link')
    .eq('approved', true)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })

  if (error) return NextResponse.json({ events: [] }, { status: 500 })
  return NextResponse.json({ events: data })
}

// POST — submit a new community event
export async function POST(req) {
  if (!rateLimit(req).ok)
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })

  try {
    const body = await req.json()
    const { title, description, date, time, location, organizer_name, organizer_email, external_link } = body

    // Validate required fields
    if (!title?.trim()) return NextResponse.json({ error: 'Event name is required.' }, { status: 400 })
    if (title.length > 200) return NextResponse.json({ error: 'Event name is too long.' }, { status: 400 })
    if (!description?.trim()) return NextResponse.json({ error: 'Description is required.' }, { status: 400 })
    if (description.length > 2000) return NextResponse.json({ error: 'Description must be 2000 characters or fewer.' }, { status: 400 })
    if (!date) return NextResponse.json({ error: 'Date is required.' }, { status: 400 })
    if (!location?.trim()) return NextResponse.json({ error: 'Location is required.' }, { status: 400 })
    if (location.length > 200) return NextResponse.json({ error: 'Location is too long.' }, { status: 400 })
    if (!organizer_name?.trim()) return NextResponse.json({ error: 'Organizer name is required.' }, { status: 400 })
    if (organizer_name.length > 100) return NextResponse.json({ error: 'Organizer name is too long.' }, { status: 400 })
    if (!organizer_email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organizer_email)) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 })
    }

    // Validate external_link is a safe http/https URL if provided
    let safeExternalLink = null
    if (external_link?.trim()) {
      try {
        const u = new URL(external_link.trim())
        if (!['https:', 'http:'].includes(u.protocol)) {
          return NextResponse.json({ error: 'External link must be a valid http or https URL.' }, { status: 400 })
        }
        safeExternalLink = u.toString()
      } catch {
        return NextResponse.json({ error: 'External link is not a valid URL.' }, { status: 400 })
      }
    }

    // Validate date is in the future
    if (new Date(date) < new Date(new Date().toDateString())) {
      return NextResponse.json({ error: 'Event date must be in the future.' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('community_events').insert({
      title: title.trim(),
      description: description.trim(),
      date,
      time: time?.trim() || null,
      location: location.trim(),
      organizer_name: organizer_name.trim(),
      organizer_email: organizer_email.trim().toLowerCase(),
      external_link: safeExternalLink,
      approved: false,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Community event submission error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}