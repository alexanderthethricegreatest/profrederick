import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/ratelimit'

const resend = new Resend(process.env.RESEND_API_KEY)

const ACTIVITIES = [
  'Door-to-door canvassing',
  'Phone banking',
  'Attending meetings & forums',
  'Social media / sharing',
  'Legal or technical research',
  'Event organizing',
]

const DISTRICTS = ['Back Creek', 'Gainesboro', 'Opequon', 'Red Bud', 'Shawnee', 'Stonewall']

export async function POST(req) {
  if (!rateLimit(req).ok)
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })

  try {
    const body = await req.json()
    const { name, email, phone, district, activities, message } = body

    if (!name?.trim())     return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
    if (name.length > 100) return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                           return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 })
    if (!district?.trim() || !DISTRICTS.includes(district))
                           return NextResponse.json({ error: 'Please select a valid district.' }, { status: 400 })
    if (!activities?.length) return NextResponse.json({ error: 'Please select at least one activity.' }, { status: 400 })
    if (phone && !/^\+?[\d\s\-().]{7,20}$/.test(phone.trim()))
                           return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 })
    if (message && message.length > 1000)
                           return NextResponse.json({ error: 'Message must be 1000 characters or fewer.' }, { status: 400 })

    // Whitelist activities against allowed values — reject any unknown entries
    const safeActivities = activities.filter(a => ACTIVITIES.includes(a))
    if (!safeActivities.length) return NextResponse.json({ error: 'Please select at least one valid activity.' }, { status: 400 })

    const activityList = safeActivities.map(a => `• ${a}`).join('\n')

    await resend.emails.send({
      from: 'Protect Frederick <noreply@protectfrederick.org>',
      to:   'info@protectfrederick.org',
      replyTo: email,
      subject: `New Volunteer: ${name} — ${district} District`,
      text: `
New volunteer signup from protectfrederick.org

Name:     ${name}
Email:    ${email}
Phone:    ${phone || 'Not provided'}
District: ${district}

Activities they want to help with:
${activityList}

${message ? `Message:\n${message}` : ''}

---
Reply directly to this email to contact the volunteer.
      `.trim(),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Volunteer email error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please email us directly at info@protectfrederick.org.' }, { status: 500 })
  }
}