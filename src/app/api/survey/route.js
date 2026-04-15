import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/ratelimit'

// Server-side only — service role key never exposed to client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  if (!rateLimit(request).ok)
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })

  try {
    const {
      fullName,
      email,
      district,
      residenceLength,
      newsFollowing,
      overallStance,
      benefits,
      benefitsOther,
      concerns,
      concernsOther,
      zoningPreference,
      agImportance,
      taxIncreaseFavor,
      additionalComments,
    } = await request.json()

    // Required field validation
    if (!fullName || !email || !district || !residenceLength || !newsFollowing || !overallStance || !zoningPreference) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }
    if (fullName.length > 100) {
      return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
    }
    if (typeof agImportance !== 'number' || agImportance < 1 || agImportance > 10) {
      return NextResponse.json({ error: 'Invalid importance value.' }, { status: 400 })
    }
    if (Array.isArray(benefits) && benefits.length > 3) {
      return NextResponse.json({ error: 'Too many benefit selections.' }, { status: 400 })
    }
    if (Array.isArray(concerns) && concerns.length > 3) {
      return NextResponse.json({ error: 'Too many concern selections.' }, { status: 400 })
    }

    // Check for duplicate email
    const { data: existing } = await supabase
      .from('survey_responses')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'A response from this email address has already been recorded.' },
        { status: 409 }
      )
    }

    // Insert response
    const { error } = await supabase.from('survey_responses').insert({
      full_name:         fullName.trim(),
      email:             email.trim().toLowerCase(),
      district,
      residence_length:  residenceLength,
      news_following:    newsFollowing,
      overall_stance:    overallStance,
      benefits:          Array.isArray(benefits) ? benefits : [],
      benefits_other:    benefitsOther ? benefitsOther.trim() : null,
      concerns:          Array.isArray(concerns) ? concerns : [],
      concerns_other:    concernsOther ? concernsOther.trim() : null,
      zoning_preference:    zoningPreference,
      ag_importance:        agImportance,
      tax_increase_favor:   taxIncreaseFavor   || null,
      additional_comments:  additionalComments ? additionalComments.trim() : null,
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to save your response.' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
