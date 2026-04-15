import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/ratelimit'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  if (!rateLimit(req).ok)
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })

  try {
    const body = await req.json()
    const { name, email, phone, address, city, zip, district, quantity, sponsorQty, message } = body

    const DISTRICTS = ['Back Creek', 'Gainesboro', 'Opequon', 'Red Bud', 'Shawnee', 'Stonewall', 'Not sure']

    // Validation
    if (!name?.trim())
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
    if (name.length > 100)
      return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    if (!phone?.trim() || !/^\+?[\d\s\-().]{7,20}$/.test(phone.trim()))
      return NextResponse.json({ error: 'A valid phone number is required.' }, { status: 400 })
    if (!address?.trim() || address.length > 200)
      return NextResponse.json({ error: 'A valid delivery address is required.' }, { status: 400 })
    if (!city?.trim() || city.length > 100)
      return NextResponse.json({ error: 'A valid city is required.' }, { status: 400 })
    if (!zip?.trim() || !/^\d{5}(-\d{4})?$/.test(zip.trim()))
      return NextResponse.json({ error: 'A valid 5-digit ZIP code is required.' }, { status: 400 })
    if (!district?.trim() || !DISTRICTS.includes(district.trim()))
      return NextResponse.json({ error: 'Please select a valid district.' }, { status: 400 })
    if (message && message.length > 1000)
      return NextResponse.json({ error: 'Notes must be 1000 characters or fewer.' }, { status: 400 })

    const qty = parseInt(quantity, 10)
    const sponsorQtyInt = parseInt(sponsorQty, 10)
    if (isNaN(qty) || qty < 1 || qty > 20)
      return NextResponse.json({ error: 'Quantity must be between 1 and 20.' }, { status: 400 })
    if (isNaN(sponsorQtyInt) || sponsorQtyInt < 0 || sponsorQtyInt > 20)
      return NextResponse.json({ error: 'Sponsor quantity must be between 0 and 20.' }, { status: 400 })

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('sign_orders')
      .insert([{
        name:     name.trim(),
        email:    email.trim().toLowerCase(),
        phone:    phone.trim(),
        address:  address.trim(),
        city:     city.trim(),
        zip:      zip.trim(),
        district: district.trim(),
        quantity:    String(qty),
        sponsor_qty: String(sponsorQtyInt),
        message:  message?.trim() || null,
        status:   'pending',
      }])

    if (dbError) {
      console.error('Supabase sign order error:', dbError)
      // Don't block — still send the email
    }

    // Email to organizer
    await resend.emails.send({
      from:    'Protect Frederick <noreply@protectfrederick.org>',
      to:      'info@protectfrederick.org',
      replyTo: email,
      subject: `New Sign Request: ${name} — ${district} District (qty: ${qty})`,
      text: `
New yard sign request from protectfrederick.org

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:     ${name}
Email:    ${email}
Phone:    ${phone}
District: ${district}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELIVERY ADDRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${address}
${city}, VA ${zip}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Quantity:  ${qty}
Sponsoring: ${sponsorQtyInt > 0 ? `${sponsorQtyInt} additional sign(s) for neighbors` : 'None'}
${message ? `\nNotes: ${message}` : ''}

---
Reply directly to this email to contact the requester.
      `.trim(),
    })

    // Confirmation email to requester
    await resend.emails.send({
      from:    'Protect Frederick <noreply@protectfrederick.org>',
      to:      email,
      subject: 'We received your Protect Frederick sign request',
      text: `
Hi ${name.split(' ')[0]},

We received your sign request. Our signs coordinator will follow up with you shortly with pricing and delivery details.

Your order:
  Quantity:  ${qty}
Sponsoring: ${sponsorQtyInt > 0 ? `${sponsorQtyInt} additional sign(s) for neighbors` : 'None'}
  Delivery: ${address}, ${city}, VA ${zip}

In the meantime, if you haven't already — please sign and share our petition:
https://protectfrederick.org/petition

Thank you for standing up for Frederick County.

— Protect Frederick
protectfrederick.org
      `.trim(),
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Sign order error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please email us directly at info@protectfrederick.org.' },
      { status: 500 }
    )
  }
}