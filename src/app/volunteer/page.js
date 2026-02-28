'use client'

import { useState } from 'react'
import styles from '@/styles/volunteer.module.css'

const DISTRICTS = ['Back Creek', 'Gainesboro', 'Opequon', 'Red Bud', 'Shawnee', 'Stonewall']

const ACTIVITIES = [
  { id: 'canvassing',  label: 'Door-to-door canvassing',      desc: 'Talk to neighbors in your district' },
  { id: 'phone',       label: 'Phone banking',                 desc: 'Call residents to spread the word' },
  { id: 'meetings',    label: 'Attending meetings & forums',   desc: 'Show up, speak on the record' },
  { id: 'social',      label: 'Social media / sharing',        desc: 'Amplify the campaign online' },
  { id: 'research',    label: 'Legal or technical research',   desc: 'Dig into zoning law, permits, conflicts of interest' },
  { id: 'events',      label: 'Event organizing',              desc: 'Help plan and run community events' },
]

const EMPTY = { name: '', email: '', phone: '', district: '', activities: [], message: '' }

export default function VolunteerPage() {
  const [form, setForm]         = useState(EMPTY)
  const [error, setError]       = useState(null)
  const [success, setSuccess]   = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function toggleActivity(id) {
    setForm(f => ({
      ...f,
      activities: f.activities.includes(id)
        ? f.activities.filter(a => a !== id)
        : [...f.activities, id],
    }))
  }

  async function handleSubmit() {
    setError(null)
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        activities: form.activities.map(id => ACTIVITIES.find(a => a.id === id)?.label),
      }
      const res = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Something went wrong. Please email us directly at info@protectfrederick.org.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <main className={styles.page}>
        <section className={styles.successSection}>
          <div className={styles.successInner}>
            <div className={styles.successIcon}>✓</div>
            <h1 className={styles.successTitle}>You're in.</h1>
            <p className={styles.successDeck}>
              We'll be in touch at <strong>{form.email}</strong> with next steps.
              In the meantime, sign the petition if you haven't, and share this site
              with your neighbors.
            </p>
            <div className={styles.successActions}>
              <a href="/petition" className="btn-primary">Sign the Petition</a>
              <a href="/events" className="btn-outline">See Upcoming Events</a>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>Get Involved</div>
          <h1 className={styles.heroTitle}>
            This fight is won<br />
            <em>by showing up.</em>
          </h1>
          <p className={styles.heroDeck}>
            Signatures matter. But so do the people who knock on doors,
            attend meetings, and make sure their neighbors know what's at stake.
            Frederick County residents stopped this before. It takes organized community pressure.
          </p>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>400+</span>
            <span className={styles.heroStatLabel}>Signatures</span>
          </div>
          <div className={styles.heroStatDiv} />
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>6</span>
            <span className={styles.heroStatLabel}>Districts</span>
          </div>
          <div className={styles.heroStatDiv} />
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>250+</span>
            <span className={styles.heroStatLabel}>Forum attendees</span>
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <section className={styles.formSection}>
        <div className={styles.formInner}>

          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Sign Up to Volunteer</h2>
            <p className={styles.formSub}>We'll reach out with specific opportunities based on your interests.</p>
          </div>

          {error && <div className={styles.formError}>{error}</div>}

          {/* Name + Email */}
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Full Name *</label>
              <input className={styles.input} name="name" value={form.name}
                onChange={handleChange} placeholder="Your name" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email *</label>
              <input className={styles.input} name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="your@email.com" />
            </div>
          </div>

          {/* Phone + District */}
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Phone</label>
              <input className={styles.input} name="phone" type="tel" value={form.phone}
                onChange={handleChange} placeholder="(540) 000-0000" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Your District *</label>
              <select className={styles.input} name="district" value={form.district} onChange={handleChange}>
                <option value="">Select your district…</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Activities */}
          <div className={styles.fieldBlock}>
            <label className={styles.label}>How do you want to help? * <span className={styles.labelNote}>(select all that apply)</span></label>
            <div className={styles.activityGrid}>
              {ACTIVITIES.map(a => {
                const checked = form.activities.includes(a.id)
                return (
                  <button
                    key={a.id}
                    type="button"
                    className={`${styles.activityCard} ${checked ? styles.activityChecked : ''}`}
                    onClick={() => toggleActivity(a.id)}
                  >
                    <span className={styles.activityCheck}>{checked ? '✓' : '+'}</span>
                    <span className={styles.activityLabel}>{a.label}</span>
                    <span className={styles.activityDesc}>{a.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Message */}
          <div className={styles.fieldBlock}>
            <label className={styles.label}>Anything else? <span className={styles.labelNote}>(optional)</span></label>
            <textarea className={styles.input} name="message" value={form.message}
              onChange={handleChange} rows={3}
              placeholder="Skills, availability, questions, or anything you want us to know" />
          </div>

          <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Sending…' : 'Sign Up to Volunteer →'}
          </button>

        </div>
      </section>

      {/* ── Why it matters ── */}
      <section className={styles.whySection}>
        <div className={styles.whyInner}>
          <h2 className={styles.whyTitle}>Why volunteers win this</h2>
          <div className={styles.whyGrid}>
            {[
              { num: '01', title: 'Neighbors trust neighbors', body: 'A knock on the door from someone who lives on your street carries more weight than any ad or mailer.' },
              { num: '02', title: 'Board meetings require bodies', body: 'An empty room signals no opposition. A packed room with a sign-in sheet signals a political cost.' },
              { num: '03', title: 'November 2026 is coming', body: 'Every supervisor seat is on the ballot. Organized volunteers are the infrastructure for that fight.' },
            ].map(w => (
              <div key={w.num} className={styles.whyCard}>
                <div className={styles.whyNum}>{w.num}</div>
                <div className={styles.whyCardTitle}>{w.title}</div>
                <p className={styles.whyCardBody}>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}