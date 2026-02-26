'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import styles from '@/styles/endorsements.module.css'

const ORG_TYPES = [
  'Agricultural / Farm',
  'Conservation / Environmental',
  'Civic / Community',
  'Business',
  'Hunting / Fishing / Outdoor',
  'Faith Community',
  'Veterans Organization',
  'Other',
]

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })
}

export default function Endorsements() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )

  const [endorsements, setEndorsements] = useState(null) // null = loading
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    orgName: '',
    orgType: '',
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    statement: '',
  })

  // Fetch approved endorsements on mount
  useEffect(() => {
    async function fetchEndorsements() {
      const { data, error } = await supabase
        .from('endorsements')
        .select('org_name, org_type, person_name, person_title, comment, created_at')
        .eq('approved', true)
        .order('created_at', { ascending: false })

      if (!error) setEndorsements(data)
      else setEndorsements([])
    }
    fetchEndorsements()
  }, [])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit() {
    setError('')

    // Validation
    if (!form.orgName || !form.orgType || !form.contactName || !form.contactEmail || !form.statement) {
      setError('Please fill in all required fields.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      setError('Please enter a valid email address.')
      return
    }
    if (form.statement.length < 20) {
      setError('Please enter a statement of at least 20 characters.')
      return
    }

    setSubmitting(true)

    const { error: insertError } = await supabase.from('endorsements').insert({
      org_name: form.orgName,
      org_type: form.orgType,
      person_name: form.contactName,
      person_title: form.contactTitle || null,
      contact_email: form.contactEmail,
      comment: form.statement,
      approved: false, // requires manual approval in Supabase dashboard
    })

    if (insertError) {
      setError('Something went wrong. Please try again or email info@protectfrederick.org.')
      setSubmitting(false)
      return
    }

    setSubmitted(true)
  }

  return (
    <>
      {/* ── Hero ── */}
      <div className={styles.hero}>
        <span className={styles.heroLabel}>Organizations Standing With Frederick County</span>
        <h1>Who's <em>Standing Up</em><br />for This Community</h1>
        <p className={styles.heroDeck}>
          Individual residents have spoken. Now we're asking the organizations, businesses,
          and civic groups of Frederick County to stand with their neighbors.{' '}
          <strong>Residents have signed.</strong> Add your organization's voice before the next public forum.
        </p>
        <div className={styles.forumBanner}>
          <span className={styles.forumBannerLabel}>Rescheduled Public Forum · TBD</span>
          <p>
            <strong>James Wood High School</strong> &mdash;{' '}
            161 Apple Pie Ridge Road, Winchester, VA 22603.
            The February 26 forum was postponed after residents demanded a better format and direct answers on noise and health risks. Every endorsement received before the rescheduled forum strengthens the community's position going into that room.
          </p>
        </div>
      </div>

      {/* ── Main ── */}
      <div className={styles.main}>

        {/* ── Endorsement Wall ── */}
        <div className={styles.wallCol}>
          <div className={styles.sectionRule}>
            <span className={styles.sectionRuleLabel}>Endorsing Organizations</span>
            <div className={styles.sectionRuleLine}></div>
          </div>

          <div className={styles.countDisplay}>
            {endorsements === null ? '—' : endorsements.length}
          </div>
          <span className={styles.countLabel}>Organizations on Record</span>

          <div className={styles.endorsementsList}>
            {endorsements === null && (
              <div className={styles.loadingState}>Loading endorsements...</div>
            )}
            {endorsements !== null && endorsements.length === 0 && (
              <div className={styles.emptyState}>
                <p>No endorsements yet. Be the first organization to stand with Frederick County.</p>
              </div>
            )}
            {endorsements && endorsements.map((e, i) => (
              <div key={i} className={styles.endorsementCard}>
                <div className={styles.endorsementOrg}>{e.org_name}</div>
                <div className={styles.endorsementMeta}>
                  {e.org_type}
                  {e.person_title && (
                    <><span>&middot;</span> {e.person_name}, {e.person_title}</>
                  )}
                </div>
                <div className={styles.endorsementStatement}>{e.comment}</div>
                <span className={styles.endorsementDate}>{formatDate(e.created_at)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Form ── */}
        <div className={styles.formCol}>
          <div className={styles.formCard}>
            <span className={styles.formCardLabel}>Add Your Organization</span>
            <h2>Stand With<br /><em>Frederick County</em></h2>
            <p className={styles.formCardDeck}>
              No financial commitment required. Your organization's name and statement
              will appear publicly on this page after review. Takes two minutes.
            </p>

            {submitted ? (
              <div className={styles.formSuccess}>
                <span className={styles.formSuccessIcon}>✦</span>
                <h3>Endorsement Received</h3>
                <p>Thank you. Your organization's endorsement will appear on this page shortly. We may follow up at the email provided to coordinate next steps.</p>
              </div>
            ) : (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="orgName">
                    Organization Name <span>*</span>
                  </label>
                  <input
                    className={styles.formInput} id="orgName" name="orgName" type="text"
                    placeholder="e.g. Frederick County Farm Bureau"
                    value={form.orgName} onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="orgType">
                    Organization Type <span>*</span>
                  </label>
                  <select
                    className={styles.formSelect} id="orgType" name="orgType"
                    value={form.orgType} onChange={handleChange}
                  >
                    <option value="" disabled>Select type...</option>
                    {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="contactName">
                    Your Name <span>*</span>
                  </label>
                  <input
                    className={styles.formInput} id="contactName" name="contactName" type="text"
                    placeholder="Name of person submitting"
                    value={form.contactName} onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="contactTitle">Your Title</label>
                  <input
                    className={styles.formInput} id="contactTitle" name="contactTitle" type="text"
                    placeholder="e.g. President, Executive Director"
                    value={form.contactTitle} onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="contactEmail">
                    Email <span>*</span>
                  </label>
                  <input
                    className={styles.formInput} id="contactEmail" name="contactEmail" type="email"
                    placeholder="For our records only — not published"
                    value={form.contactEmail} onChange={handleChange}
                  />
                  <p className={styles.formNote}>Not displayed publicly.</p>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="statement">
                    Public Statement <span>*</span>
                  </label>
                  <textarea
                    className={styles.formTextarea} id="statement" name="statement"
                    placeholder="In 1-3 sentences, why does your organization endorse Protect Frederick? This will appear publicly."
                    value={form.statement} onChange={handleChange}
                  />
                  <p className={styles.formNote}>Will be displayed on this page alongside your organization's name.</p>
                </div>

                {error && <div className={styles.formError}>{error}</div>}

                <button
                  className={styles.formSubmit}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Add Our Endorsement'}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </>
  )
}