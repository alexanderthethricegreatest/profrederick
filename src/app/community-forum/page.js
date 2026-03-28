'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from '@/styles/community-forum.module.css'

const DISTRICTS = [
  'Back Creek',
  'Gainesboro',
  'Opequon',
  'Red Bud',
  'Shawnee',
  'Stonewall',
]

function RsvpForm() {
  const [form, setForm] = useState({ fullName: '', email: '', district: '', guestCount: 1, questions: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.fullName.trim()) return setError('Please enter your name.')
    if (!form.email.trim()) return setError('Please enter your email address.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Please enter a valid email address.')

    setLoading(true)
    try {
      const res = await fetch('/api/forum-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          district: form.district || null,
          guestCount: Number(form.guestCount),
          questions: form.questions || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error || 'Something went wrong. Please try again.')
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={styles.rsvpSuccess}>
        <div className={styles.rsvpSuccessIcon}>✓</div>
        <h3 className={styles.rsvpSuccessTitle}>You're on the list.</h3>
        <p className={styles.rsvpSuccessText}>We've recorded your RSVP for the April 15 community forum at Trumpet Vine Farm. We'll see you there.</p>
      </div>
    )
  }

  return (
    <form className={styles.rsvpForm} onSubmit={handleSubmit} noValidate>
      <div className={styles.rsvpRow}>
        <div className={styles.rsvpField}>
          <label className={styles.rsvpLabel} htmlFor="rsvp-name">Full Name <span className={styles.rsvpRequired}>*</span></label>
          <input
            id="rsvp-name"
            className={styles.rsvpInput}
            type="text"
            value={form.fullName}
            onChange={e => set('fullName', e.target.value)}
            placeholder="Jane Smith"
            maxLength={100}
            required
          />
        </div>
        <div className={styles.rsvpField}>
          <label className={styles.rsvpLabel} htmlFor="rsvp-email">Email Address <span className={styles.rsvpRequired}>*</span></label>
          <input
            id="rsvp-email"
            className={styles.rsvpInput}
            type="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="jane@example.com"
            required
          />
        </div>
      </div>

      <div className={styles.rsvpRow}>
        <div className={styles.rsvpField}>
          <label className={styles.rsvpLabel} htmlFor="rsvp-district">District <span className={styles.rsvpOptional}>(optional)</span></label>
          <select
            id="rsvp-district"
            className={styles.rsvpSelect}
            value={form.district}
            onChange={e => set('district', e.target.value)}
          >
            <option value="">Select your district</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className={styles.rsvpField}>
          <label className={styles.rsvpLabel} htmlFor="rsvp-guests">Number of Attendees</label>
          <input
            id="rsvp-guests"
            className={styles.rsvpInput}
            type="number"
            min={1}
            max={10}
            value={form.guestCount}
            onChange={e => set('guestCount', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.rsvpField}>
        <label className={styles.rsvpLabel} htmlFor="rsvp-questions">Questions for the Panel <span className={styles.rsvpOptional}>(optional)</span></label>
        <textarea
          id="rsvp-questions"
          className={styles.rsvpTextarea}
          value={form.questions}
          onChange={e => set('questions', e.target.value)}
          placeholder="Submit a question in advance for the panel discussion."
          maxLength={1000}
          rows={3}
        />
      </div>

      {error && <div className={styles.rsvpError}>{error}</div>}

      <button className={styles.rsvpBtn} type="submit" disabled={loading}>
        {loading ? 'Submitting…' : 'RSVP for the Forum →'}
      </button>
    </form>
  )
}

const panelists = [
  {
    credential: 'Industrial Hygienist',
    name: 'Tammy Clark',
    title: 'Industrial Hygienist & Occupational Environmental Health & Safety Professional',
    bio: [
      'With over 20 years of experience managing health, safety, and compliance programs across multiple industries, Tammy Clark brings expertise from both regulatory and litigation settings. Her work has informed employers, manufacturers, healthcare systems, and government agencies on occupational safety, regulatory compliance, and risk analysis.',
      'Her background spans a breadth of industrial contexts, giving her a grounded, evidence-based perspective on how large-scale industrial development affects surrounding communities, workers, and the environment.',
    ],
  },
  {
    credential: 'Senior Industrial Hygienist & Environmental Specialist',
    name: ' Kristen Meghan Kelly, MS-OSH',
    title: 'Senior Industrial Hygienist, Environmental Specialist & Nationally Recognized Expert',
    bio: [
      'Kristen Meghan Kelly holds a Master of Science in Occupational Safety and Health and brings 20+ years of experience as a senior industrial hygienist and environmental specialist. She is a consultant and nationally recognized expert, featured in media and documentary work for her advocacy and professional insight.',
      'Her expertise spans the human health and environmental impacts of industrial operations, an essential lens for evaluating what large-scale data center infrastructure means for Frederick County residents, water, and land.',
    ],
  },
  {
    credential: 'Geologist · Karst & Subsurface Systems',
    name: 'Martha Saddlick',
    title: 'Geologist (JMU) · Oil & Gas Geophysicist · Generational Farmer, Shenandoah Valley',
    bio: [
      'Martha Saddlick holds a geology degree from James Madison University and brings 45+ years of experience as an oil and gas geophysicist. Her deep expertise in subsurface analysis, including karst geology, aquifer systems, and land use, is directly relevant to the infrastructure and water risks posed by large-scale industrial development in the Valley.',
      'As a generational farmer in the Shenandoah Valley, Saddlick also brings the perspective of someone with roots in the land, someone who understands what is at stake beyond the spreadsheets and economic projections.',
    ],
    note: 'Much of Frederick County sits atop karst terrain, a landscape formed from soluble bedrock like limestone, characterized by caves, sinkholes, and underground aquifers that are particularly vulnerable to contamination from heavy industrial activity.',
  },
  {
    credential: 'Land Use & Smart Growth Advocate',
    name: 'Elena Schlossberg-Kunkel',
    title: 'Founder, Coalition to Protect Prince William County · Land Use Policy Advocate',
    bio: [
      'Elena Schlossberg-Kunkel holds a BA in Psychology and an MA in School Counseling from Marymount University. After moving to the Rural Crescent in Prince William County in 2002, she witnessed firsthand how land use decisions can shape and permanently alter the quality of life for entire communities.',
      'She established The Coalition to Protect Prince William County and has since become a leading voice on smart growth policy and conservation. Her work offers Frederick County residents a direct window into how similar fights have unfolded in neighboring jurisdictions—and what strategies have been most effective.',
    ],
  },
  { credential: 'Economist and Professor',
    name: 'Nathan Russell, MA',
    title: 'Assistant Professor of Economics at Patrick Henry College ',
    bio: [
      'His work focuses on public choice, public finance, and the practical application of economic ideas, particularly as they relate to policy and real-world decision-making.', 
      'Prior to his academic career, he worked with organizations including the Charles G. Koch Foundation, the Regulatory Economics Group, and the Mackinac Center for Public Policy, where his work included economic education methodology, corporate cost and profitability analysis, and assessment of state economic and educational policy.',
      ]
  }
]

function PanelistCard({ panelist }) {
  const [open, setOpen] = useState(false)
  const bodyRef = useRef(null)

  return (
    <div className={`${styles.card} ${open ? styles.cardOpen : ''}`}>
      <button className={styles.cardTrigger} onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <div className={styles.cardTop}>
          <span className={styles.cardCredential}>{panelist.credential}</span>
          <span className={`${styles.cardChevron} ${open ? styles.cardChevronOpen : ''}`}>▾</span>
        </div>
        <div className={styles.cardName}>{panelist.name}</div>
        <div className={styles.cardTitle}>{panelist.title}</div>
        <div className={styles.cardHint}>{open ? 'Close' : 'Read bio'}</div>
      </button>

      <div
        ref={bodyRef}
        className={styles.cardBody}
        style={{ maxHeight: open ? bodyRef.current?.scrollHeight + 'px' : '0px' }}
      >
        <div className={styles.cardBodyInner}>
          {panelist.bio.map((p, i) => <p key={i}>{p}</p>)}
          {panelist.note && (
            <div className={styles.cardNote}>
              <strong>Why karst geology matters: </strong>{panelist.note}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CommunityForum() {
  const fadeRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
      })
    }, { threshold: 0.08 })
    fadeRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const fadeRef = (el) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el) }

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderVol}>Community Forum · April 15, 2026</div>
        <h1>Fact vs. Fiction:<br /><em>A Community Forum</em></h1>
        <p className={styles.pageHeaderDeck}>
          What's being proposed for Frederick County? What's fact versus fiction, and what does it actually mean for our community?
        </p>
        <div className={styles.eventMeta}>
          <div className={styles.eventMetaItem}>
            <span className={styles.eventMetaLabel}>Date</span>
            <span className={styles.eventMetaValue}>Wednesday, April 15, 2026</span>
          </div>
          <div className={styles.eventMetaDivider} />
          <div className={styles.eventMetaItem}>
            <span className={styles.eventMetaLabel}>Time</span>
            <span className={styles.eventMetaValue}>6:30 PM – 9:00 PM</span>
          </div>
          <div className={styles.eventMetaDivider} />
          <div className={styles.eventMetaItem}>
            <span className={styles.eventMetaLabel}>Location</span>
            <span className={styles.eventMetaValue}>Trumpet Vine Farm</span>
          </div>
        </div>
      </div>

      <main className={styles.pageMain}>

        {/* ── Intro ── */}
        <div className={`${styles.sectionIntro} fade-up`} ref={fadeRef}>
          Join us for an in-depth community discussion featuring a panel of experienced professionals who will provide insight into the key issues facing Frederick County. A moderated Q&amp;A session will follow, offering attendees, including community members and local officials, the opportunity to ask questions and engage directly with the panel. All community members are encouraged to attend.
        </div>

        {/* ── Panelists ── */}
        <div className="fade-up" ref={fadeRef}>
          <span className={styles.sectionLabel}>Featured Panelists</span>
          <h2 className={styles.sectionTitle}>Experienced Professionals.<br />Independent Voices.</h2>
          <div className={styles.cardGrid}>
            {panelists.map(p => <PanelistCard key={p.name} panelist={p} />)}
          </div>
        </div>

        <hr className={styles.sectionDivider} />

        {/* ── Format ── */}
        <div className="fade-up" ref={fadeRef}>
          <span className={styles.sectionLabel}>Event Format</span>
          <h2 className={styles.sectionTitle}>An Evening of Informed Discussion</h2>
          <div className={styles.formatGrid}>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>6:00 PM</div>
              <div className={styles.formatLabel}>Doors Open</div>
              <div className={styles.formatDesc}>Guests arrive, sign in, find seating. Display materials, handouts, and resource table available.</div>
            </div>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>6:30 PM</div>
              <div className={styles.formatLabel}>Welcome &amp; Opening Remarks</div>
              <div className={styles.formatDesc}>Introduction of the purpose of the evening and brief overview. This is an informed, civil, community-first conversation. All are welcome, including Board of Supervisors members.</div>
            </div>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>6:35 PM</div>
              <div className={styles.formatLabel}>Introduction of Panel</div>
              <div className={styles.formatDesc}>Moderator introduces each panelist by name, title, and brief credential summary.</div>
            </div>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>6:40 PM</div>
              <div className={styles.formatLabel}>Block 1: Health &amp; Environmental Impact</div>
              <div className={styles.formatDesc}>What does large-scale data center development actually mean for the air, water, and people of Frederick County?
                <ul className={styles.formatSpeakerList}>
                  <li><strong>Tammy Clark</strong> — Occupational health, air quality, regulatory compliance and what it means for surrounding residents (15 min)</li>
                  <li><strong>Kristen Meghan Kelly</strong> — Environmental health impacts, what industrial hygiene data from similar developments shows (15 min)</li>
                  <li><strong>Martha Saddlick</strong> — Frederick County's karst geology and aquifer vulnerability, what subsurface development risk looks like here specifically (15 min)</li>
                </ul>
              </div>
            </div>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>7:25 PM</div>
              <div className={styles.formatLabel}>Block 2: What Are Communities Actually Being Promised?</div>
              <div className={styles.formatDesc}>A broader look at data center development across Virginia and the country — what the economic promises typically look like versus reality, what the fight looks like in other communities, and what winning actually means.
                <ul className={styles.formatSpeakerList}>
                  <li><strong>Elena Schlossberg-Kunkel</strong> — The Prince William County coalition model, how they organized, what worked, and what Frederick County can replicate</li>
                  <li><strong>Nathan Russell</strong> — Economic analysis, what counties are actually promised versus what they receive, and the public finance reality behind the data centers or higher taxes argument</li>
                </ul>
              </div>
            </div>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>7:45 PM</div>
              <div className={styles.formatLabel}>Moderated Q&amp;A — Community Open Mic</div>
              <div className={styles.formatDesc}>Frederick County residents ask questions — 1 minute each. Moderated to ensure all voices are heard. Open mic through 9:00 PM.</div>
            </div>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>9:00 PM</div>
              <div className={styles.formatLabel}>Adjourn</div>
              <div className={styles.formatDesc}>Panel available for informal conversation. Resource table remains open. Media availability if applicable.</div>
            </div>
          </div>
        </div>

        <hr className={styles.sectionDivider} />

        {/* ── Why this forum matters ── */}
        <div className="fade-up" ref={fadeRef}>
          <span className={styles.sectionLabel}>Why This Matters</span>
          <h2 className={styles.sectionTitle}>Get the Full Picture</h2>
          <p className={styles.sectionIntroText}>The county's own forums have featured presentations by organizations with a direct financial stake in data center expansion. This event is different: the panelists have no financial interest in the outcome. Their job is to give you the information you need to evaluate what is actually being proposed and what it would actually mean for the county's air, water, land, and future.</p>
          <div className={styles.topicGrid}>
            <div className={styles.topicItem}>
              <div className={styles.topicLabel}>Water & Aquifers</div>
              <div className={styles.topicDesc}>How does large-scale industrial development interact with karst geology and the underground water systems Frederick County depends on?</div>
            </div>
            <div className={styles.topicItem}>
              <div className={styles.topicLabel}>Air Quality & Health</div>
              <div className={styles.topicDesc}>What are the occupational and community health implications of diesel backup generators, cooling systems, and industrial emissions at scale?</div>
            </div>
            <div className={styles.topicItem}>
              <div className={styles.topicLabel}>Agricultural Land</div>
              <div className={styles.topicDesc}>What does losing prime farmland mean for the long-term sustainability and identity of the region and is it reversible?</div>
            </div>
            <div className={styles.topicItem}>
              <div className={styles.topicLabel}>Regulatory Reality</div>
              <div className={styles.topicDesc}>What protections actually exist? What has worked and failed in other communities that have faced similar proposals?</div>
            </div>
          </div>
        </div>

        {/* ── Location notice ── */}
        <div className={`${styles.locationNotice} fade-up`} ref={fadeRef}>
          <div className={styles.locationNoticeInner}>
            <div className={styles.locationNoticeLabel}>Location</div>
            <div className={styles.locationNoticeText}>Trumpet Vine Farm</div>
            <div className={styles.locationNoticeSub}> This event is free and open to all Frederick County community members. Address is 266 Vaucluse Rd, Stephens City, VA 22655 </div>
          </div>
        </div>

        <hr className={styles.sectionDivider} />

        {/* ── RSVP ── */}
        <div className="fade-up" ref={fadeRef}>
          <span className={styles.sectionLabel}>RSVP</span>
          <h2 className={styles.sectionTitle}>Reserve Your Spot</h2>
          <p className={styles.sectionIntroText}>The forum is free and open to all Frederick County community members. Submit an RSVP so we know to expect you, and submit a question for the panel in advance if you have one.</p>
          <RsvpForm />
        </div>

        {/* ── CTA ── */}
        <div className={`${styles.pageCta} fade-up`} ref={fadeRef}>
          <div className={styles.pageCtaText}><strong>Make your voice heard.</strong> Attend the forum, ask your questions, and sign the petition before the next Board of Supervisors vote.</div>
          <Link href="/petition" className={styles.pageCtaBtn}>Sign the Petition →</Link>
        </div>

      </main>
    </>
  )
}
