'use client'

import { useState } from 'react'
import styles from '@/styles/survey.module.css'

const DISTRICTS = [
  'Back Creek',
  'Gainesboro',
  'Opequon',
  'Red Bud',
  'Shawnee',
  'Stonewall',
  "I am not sure / I don't live in Frederick County",
]

const RESIDENCE_OPTIONS = [
  'Less than 1 year',
  '1–5 years',
  '6–10 years',
  '11–20 years',
  'More than 20 years',
]

const NEWS_OPTIONS = [
  'Very closely',
  'Somewhat closely',
  'I have heard a little bit about it',
  'Not at all',
]

const STANCE_OPTIONS = [
  'Strongly Support',
  'Somewhat Support',
  'Neutral / Undecided',
  'Somewhat Oppose',
  'Strongly Oppose',
]

const BENEFITS_OPTIONS = [
  { id: 'tax_revenue',        label: 'Increased local tax revenue' },
  { id: 'construction_jobs',  label: 'Creation of temporary construction jobs' },
  { id: 'tech_jobs',          label: 'Creation of long-term tech/maintenance jobs' },
  { id: 'infrastructure',     label: 'Funding for local infrastructure (schools, roads, emergency services)' },
  { id: 'no_benefits',        label: 'I do not believe there are significant benefits' },
  { id: 'other',              label: 'Other' },
]

const CONCERNS_OPTIONS = [
  { id: 'water',             label: 'Depletion or contamination of local water supplies/wells' },
  { id: 'power_grid',        label: 'Strain on the local electrical power grid and potential utility rate hikes' },
  { id: 'noise',             label: 'Noise pollution from cooling systems' },
  { id: 'ag_land',           label: 'Loss of agricultural land, open space, and rural character' },
  { id: 'property_values',   label: 'Negative impacts on nearby residential property values' },
  { id: 'visual',            label: 'Visual impact (size of the buildings and power lines)' },
  { id: 'no_concerns',       label: 'I do not have any major concerns' },
  { id: 'other',             label: 'Other' },
]

const ZONING_OPTIONS = [
  'Strictly in existing Industrial Zones: They should not be allowed to encroach on agricultural or residential land.',
  'Case-by-Case Basis: They should be allowed in Agricultural/Rural areas only if they meet strict environmental and aesthetic criteria.',
  'Anywhere: The free market and property owners should dictate land use.',
  'Nowhere: Frederick County should pause or ban all future data center development.',
]

const AG_LABELS = {
  1: 'Not important at all',
  2: 'Not very important',
  3: 'Slightly important',
  4: 'Somewhat important',
  5: 'Moderately important',
  6: 'Fairly important',
  7: 'Quite important',
  8: 'Very important',
  9: 'Highly important',
  10: 'Extremely important',
}

const EMPTY = {
  fullName: '',
  email: '',
  district: '',
  residenceLength: '',
  newsFollowing: '',
  overallStance: '',
  benefits: [],
  benefitsOther: '',
  concerns: [],
  concernsOther: '',
  zoningPreference: '',
  agImportance: 5,
  taxIncreaseFavor: '',
  additionalComments: '',
}

export default function SurveyPage() {
  const [form, setForm]             = useState(EMPTY)
  const [errors, setErrors]         = useState({})
  const [error, setError]           = useState(null)
  const [success, setSuccess]       = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: null }))
  }

  function toggleCheckbox(field, id, otherField) {
    setForm(f => {
      const current = f[field]
      if (current.includes(id)) {
        return {
          ...f,
          [field]: current.filter(v => v !== id),
          ...(id === 'other' ? { [otherField]: '' } : {}),
        }
      }
      if (current.length >= 3) return f // cap at 3
      return { ...f, [field]: [...current, id] }
    })
  }

  function validate() {
    const e = {}
    if (!form.fullName.trim())   e.fullName        = 'Please enter your full name.'
    if (!form.email.trim())      e.email           = 'Please enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                 e.email           = 'Please enter a valid email address.'
    if (!form.district)          e.district        = 'Please select your district.'
    if (!form.residenceLength)   e.residenceLength = 'Please select how long you have lived here.'
    if (!form.newsFollowing)     e.newsFollowing   = 'Please select an option.'
    if (!form.overallStance)     e.overallStance   = 'Please select your overall stance.'
    if (!form.zoningPreference)  e.zoningPreference = 'Please select a zoning preference.'
    return e
  }

  async function handleSubmit() {
    setError(null)
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      setError('Please fill in all required fields marked with *.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName:         form.fullName.trim(),
          email:            form.email.trim().toLowerCase(),
          district:         form.district,
          residenceLength:  form.residenceLength,
          newsFollowing:    form.newsFollowing,
          overallStance:    form.overallStance,
          benefits:         form.benefits,
          benefitsOther:    form.benefitsOther.trim(),
          concerns:         form.concerns,
          concernsOther:    form.concernsOther.trim(),
          zoningPreference:    form.zoningPreference,
          agImportance:        form.agImportance,
          taxIncreaseFavor:    form.taxIncreaseFavor,
          additionalComments:  form.additionalComments.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setSuccess(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch {
      setError('Something went wrong. Please email us directly at info@protectfrederick.org.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  const firstName = form.fullName.trim().split(' ')[0]

  if (success) {
    return (
      <main className={styles.page}>
        <section className={styles.successSection}>
          <div className={styles.successInner}>
            <div className={styles.successIcon}>✓</div>
            <h1 className={styles.successTitle}>Thank you, {firstName}.</h1>
            <p className={styles.successDeck}>
              Your response has been recorded. The community&rsquo;s voice shapes what
              happens next — we&rsquo;ll use this data to better understand where
              Frederick County residents stand on data center development.
            </p>
            <div className={styles.successActions}>
              <a href="/petition" className="btn-primary">Sign the Petition</a>
              <a href="/" className="btn-outline">Back to Home</a>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const sliderPct = ((form.agImportance - 1) / 9) * 100

  return (
    <main className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>Community Input</div>
          <h1 className={styles.heroTitle}>
            Frederick County Resident<br />
            <em>Feedback Survey</em>
          </h1>
          <p className={styles.heroDeck}>
            Frederick County is currently facing important decisions regarding the
            development of industrial-scale data centers. As a resident, your voice
            matters. This brief survey is designed to gather your thoughts, concerns,
            and hopes regarding how data centers might impact our local economy,
            infrastructure, and rural character. Responses are confidential and will
            be used to better understand the community&rsquo;s perspective.
          </p>
        </div>
      </section>

      {/* ── Form ── */}
      <section className={styles.formSection}>
        <div className={styles.formInner}>

          {error && <div className={styles.formError}>{error}</div>}

          {/* ── Contact Info ── */}
          <div className={styles.contactBlock}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="s-name">Full Name *</label>
                <input
                  className={`${styles.input}${errors.fullName ? ' ' + styles.inputError : ''}`}
                  id="s-name" name="fullName" value={form.fullName}
                  onChange={handleChange} placeholder="Your full name"
                />
                {errors.fullName && <span className={styles.fieldError}>{errors.fullName}</span>}
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="s-email">Email Address *</label>
                <input
                  className={`${styles.input}${errors.email ? ' ' + styles.inputError : ''}`}
                  id="s-email" name="email" type="email" value={form.email}
                  onChange={handleChange} placeholder="your@email.com"
                />
                {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
              </div>
            </div>
          </div>

          {/* ── Section 1: Residency & Demographics ── */}
          <div className={styles.surveySection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>01</span>
              <div className={styles.sectionTitle}>Residency &amp; Demographics</div>
            </div>

            {/* Q1 */}
            <div className={styles.question}>
              <label className={styles.questionLabel} id="q1-label">
                Q1. Which Frederick County magisterial district do you currently reside in? *
              </label>
              {errors.district && <span className={styles.fieldError}>{errors.district}</span>}
              <div className={styles.radioGroup} role="radiogroup" aria-labelledby="q1-label">
                {DISTRICTS.map(d => (
                  <label key={d} className={styles.radioItem}>
                    <input
                      type="radio" name="district" value={d}
                      checked={form.district === d}
                      onChange={handleChange}
                    />
                    <span className={styles.radioLabel}>{d}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div className={styles.question}>
              <label className={styles.questionLabel} id="q2-label">
                Q2. How long have you lived in Frederick County? *
              </label>
              {errors.residenceLength && <span className={styles.fieldError}>{errors.residenceLength}</span>}
              <div className={styles.radioGroup} role="radiogroup" aria-labelledby="q2-label">
                {RESIDENCE_OPTIONS.map(r => (
                  <label key={r} className={styles.radioItem}>
                    <input
                      type="radio" name="residenceLength" value={r}
                      checked={form.residenceLength === r}
                      onChange={handleChange}
                    />
                    <span className={styles.radioLabel}>{r}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── Section 2: Awareness & Overall Sentiment ── */}
          <div className={styles.surveySection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>02</span>
              <div className={styles.sectionTitle}>Awareness &amp; Overall Sentiment</div>
            </div>

            {/* Q3 */}
            <div className={styles.question}>
              <label className={styles.questionLabel} id="q3-label">
                Q3. How closely have you been following the recent news and zoning discussions regarding data centers in Frederick County? *
              </label>
              {errors.newsFollowing && <span className={styles.fieldError}>{errors.newsFollowing}</span>}
              <div className={styles.radioGroup} role="radiogroup" aria-labelledby="q3-label">
                {NEWS_OPTIONS.map(n => (
                  <label key={n} className={styles.radioItem}>
                    <input
                      type="radio" name="newsFollowing" value={n}
                      checked={form.newsFollowing === n}
                      onChange={handleChange}
                    />
                    <span className={styles.radioLabel}>{n}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q4 */}
            <div className={styles.question}>
              <label className={styles.questionLabel} id="q4-label">
                Q4. What is your overall stance on the development of new data centers in Frederick County? *
              </label>
              {errors.overallStance && <span className={styles.fieldError}>{errors.overallStance}</span>}
              <div className={styles.radioGroup} role="radiogroup" aria-labelledby="q4-label">
                {STANCE_OPTIONS.map(s => (
                  <label key={s} className={styles.radioItem}>
                    <input
                      type="radio" name="overallStance" value={s}
                      checked={form.overallStance === s}
                      onChange={handleChange}
                    />
                    <span className={styles.radioLabel}>{s}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── Section 3: Exploring the Impacts ── */}
          <div className={styles.surveySection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>03</span>
              <div className={styles.sectionTitle}>Exploring the Impacts</div>
            </div>

            {/* Q5 */}
            <div className={styles.question}>
              <label className={styles.questionLabel} id="q5-label">
                Q5. What do you see as the primary BENEFITS of data centers in our county?{' '}
                <span className={styles.capNote}>(Select up to 3)</span>
              </label>
              <div className={styles.checkGrid} role="group" aria-labelledby="q5-label">
                {BENEFITS_OPTIONS.map(opt => {
                  const checked = form.benefits.includes(opt.id)
                  const capped  = !checked && form.benefits.length >= 3
                  return (
                    <div key={opt.id} className={opt.id === 'other' ? styles.checkItemOther : ''}>
                      <label
                        className={[
                          styles.checkItem,
                          capped   ? styles.checkCapped  : '',
                          checked  ? styles.checkChecked : '',
                        ].join(' ')}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={capped}
                          onChange={() => toggleCheckbox('benefits', opt.id, 'benefitsOther')}
                        />
                        <span className={styles.checkBox}>{checked ? '✓' : ''}</span>
                        <span className={styles.checkLabel}>{opt.label}</span>
                      </label>
                      {opt.id === 'other' && checked && (
                        <input
                          className={styles.otherInput}
                          name="benefitsOther"
                          value={form.benefitsOther}
                          onChange={handleChange}
                          placeholder="Please specify…"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Q6 */}
            <div className={styles.question}>
              <label className={styles.questionLabel} id="q6-label">
                Q6. What are your primary CONCERNS regarding data center development?{' '}
                <span className={styles.capNote}>(Select up to 3)</span>
              </label>
              <div className={styles.checkGrid} role="group" aria-labelledby="q6-label">
                {CONCERNS_OPTIONS.map(opt => {
                  const checked = form.concerns.includes(opt.id)
                  const capped  = !checked && form.concerns.length >= 3
                  return (
                    <div key={opt.id} className={opt.id === 'other' ? styles.checkItemOther : ''}>
                      <label
                        className={[
                          styles.checkItem,
                          capped   ? styles.checkCapped  : '',
                          checked  ? styles.checkChecked : '',
                        ].join(' ')}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={capped}
                          onChange={() => toggleCheckbox('concerns', opt.id, 'concernsOther')}
                        />
                        <span className={styles.checkBox}>{checked ? '✓' : ''}</span>
                        <span className={styles.checkLabel}>{opt.label}</span>
                      </label>
                      {opt.id === 'other' && checked && (
                        <input
                          className={styles.otherInput}
                          name="concernsOther"
                          value={form.concernsOther}
                          onChange={handleChange}
                          placeholder="Please specify…"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Section 4: Zoning & Future Planning ── */}
          <div className={styles.surveySection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>04</span>
              <div className={styles.sectionTitle}>Zoning &amp; Future Planning</div>
            </div>

            {/* Q7 */}
            <div className={styles.question}>
              <label className={styles.questionLabel} id="q7-label">
                Q7. If data centers are to be built in Frederick County, where do you believe they should be permitted? *
              </label>
              {errors.zoningPreference && <span className={styles.fieldError}>{errors.zoningPreference}</span>}
              <div className={styles.radioGroup} role="radiogroup" aria-labelledby="q7-label">
                {ZONING_OPTIONS.map(z => (
                  <label key={z} className={styles.radioItem}>
                    <input
                      type="radio" name="zoningPreference" value={z}
                      checked={form.zoningPreference === z}
                      onChange={handleChange}
                    />
                    <span className={styles.radioLabel}>{z}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q8 */}
            <div className={styles.question}>
              <label className={styles.questionLabel} id="q8-label">
                Q8. How important is it to you that the county prioritizes agricultural preservation
                and agri-tourism over industrial tech development?
              </label>
              <div className={styles.sliderWrap}>
                <div className={styles.sliderNumRow}>
                  <span className={styles.sliderNum}>{form.agImportance}</span>
                  <span className={styles.sliderTextLabel}>{AG_LABELS[form.agImportance]}</span>
                </div>
                <input
                  type="range"
                  className={styles.slider}
                  min="1" max="10" step="1"
                  name="agImportance"
                  value={form.agImportance}
                  onChange={e => setForm(f => ({ ...f, agImportance: Number(e.target.value) }))}
                  aria-labelledby="q8-label"
                  style={{
                    background: `linear-gradient(to right, var(--barn) 0%, var(--barn) ${sliderPct}%, var(--cream-3) ${sliderPct}%, var(--cream-3) 100%)`,
                  }}
                />
                <div className={styles.sliderTicks}>
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            </div>

            {/* Q9 */}
            <div className={styles.question}>
              <label className={styles.questionLabel} id="q9-label">
                Q9. Would you be in favor of a modest tax increase to fund county services
                rather than relying on data center tax revenue?
              </label>
              <div className={styles.radioGroup} role="radiogroup" aria-labelledby="q9-label">
                {[
                  'Yes — I would support a modest tax increase as an alternative',
                  'No — I would not support a tax increase under any circumstances',
                  'Unsure — I need more information before deciding',
                ].map(opt => (
                  <label key={opt} className={styles.radioItem}>
                    <input
                      type="radio" name="taxIncreaseFavor" value={opt}
                      checked={form.taxIncreaseFavor === opt}
                      onChange={handleChange}
                    />
                    <span className={styles.radioLabel}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q10 */}
            <div className={styles.question}>
              <label className={styles.questionLabel} htmlFor="s-comments">
                Q10. Any other comments or thoughts you&rsquo;d like to share?{' '}
                <span className={styles.capNote}>(optional)</span>
              </label>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                id="s-comments" name="additionalComments"
                value={form.additionalComments}
                onChange={handleChange}
                rows={4}
                placeholder="Your thoughts, questions, or anything else you'd like us to know…"
              />
            </div>
          </div>

          <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Survey →'}
          </button>

        </div>
      </section>

    </main>
  )
}
