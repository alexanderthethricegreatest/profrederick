'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import styles from '@/styles/petition.module.css'
import useCountUp from '@/hooks/useCountUp'

const DISTRICTS = ['Back Creek', 'Gainesboro', 'Opequon', 'Red Bud', 'Shawnee', 'Stonewall']

function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function Petition() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )

  const [signatures, setSignatures] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    district: '',
    consent: true,
  })

  useEffect(() => {
    async function fetchSignatures() {
      const { data, error } = await supabase
        .from('signatures')
        .select('name, district, created_at')
        .order('created_at', { ascending: false })

      if (!error) setSignatures(data)
      else setSignatures([])
    }
    fetchSignatures()
  }, [])

  function handleChange(e) {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(prev => ({ ...prev, [e.target.name]: val }))
  }

  async function handleSubmit() {
    setError('')

    if (!form.name)     { setError('Please enter your full name.'); return }
    if (!form.email || !form.email.includes('@')) { setError('Please enter a valid email address.'); return }
    if (!form.district) { setError('Please select your district.'); return }
    if (!form.consent)  { setError('Please check the consent box to sign.'); return }

    setSubmitting(true)

    const res = await fetch('/api/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, district: form.district }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong. Please try again.')
      setSubmitting(false)
      return
    }

    setSubmitted(true)

    // Refresh signatures after successful submission
    const { data: refreshed } = await supabase
      .from('signatures')
      .select('name, district, created_at')
      .order('created_at', { ascending: false })
    if (refreshed) setSignatures(refreshed)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  // Compute district counts
  const districtCounts = {}
  DISTRICTS.forEach(d => districtCounts[d] = 0)
  if (signatures) {
    signatures.forEach(s => { if (districtCounts[s.district] !== undefined) districtCounts[s.district]++ })
  }
  const maxCount = Math.max(...Object.values(districtCounts), 1)
  const knownDistricts = new Set(DISTRICTS)
  const uniqueDistricts = signatures
    ? new Set(signatures.map(s => s.district).filter(d => knownDistricts.has(d))).size
    : 0

  const [animatedCount, countRef] = useCountUp(signatures?.length ?? 0)
  const [animatedDistricts, districtRef] = useCountUp(uniqueDistricts)

  return (
    <>
      {/* ── Header ── */}
      <div className={styles.petitionHeader}>
        <svg className={styles.headerBgSvg} viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,120 L0,70 L100,45 L200,65 L320,20 L440,55 L540,10 L660,50 L760,25 L880,60 L980,35 L1100,58 L1200,40 L1200,120 Z" fill="#2D4A2D"/>
          <path d="M0,120 L0,90 L150,82 L300,78 L430,86 L560,74 L700,82 L840,76 L980,83 L1100,78 L1200,80 L1200,120 Z" fill="#2A2118"/>
        </svg>
        <div className={styles.headerInner}>
          <div className={styles.petitionEyebrow}>Official Community Petition</div>
          <h1 className={styles.petitionHeadline}>Protect Frederick County<br />from Data Center Development</h1>
          <p className={styles.petitionDeck}>
            We, the residents of Frederick County, call on our Board of Supervisors to{' '}
            <b>reject data center development</b> and ensure our water, our land, and our electric bills are protected by law.
          </p>
        </div>
      </div>

      {/* ── Counter Bar ── */}
      <div className={styles.counterBar}>
        <div className={styles.counterItem}>
          <span className={styles.counterNum} ref={countRef}>
            {signatures === null ? '—' : animatedCount.toLocaleString()}
          </span>
          <span className={styles.counterLabel}>Signatures</span>
        </div>
        <div className={styles.counterDivider}></div>
        <div className={styles.counterItem}>
          <span className={styles.counterNum} ref={districtRef}>
            {signatures === null ? '—' : animatedDistricts}
          </span>
          <span className={styles.counterLabel}>Districts Represented</span>
        </div>
        <div className={styles.counterDivider}></div>
        <div className={styles.counterItem}>
          <span className={styles.counterNum}>Postponed</span>
          <span className={styles.counterLabel}>Public Forum</span>
        </div>
      </div>

      {/* ── Main ── */}
      <div className={`${styles.main} fade-up`}>

        {/* ── Petition Text ── */}
        <div>
          <div className={styles.petitionTo}>Addressed To</div>
          <div className={styles.petitionAddressed}>
            Frederick County Board of Supervisors<br />
            <span className={styles.petitionAddressedSub}>107 North Kent Street · Winchester, VA 22601</span>
          </div>
          <p className={styles.petitionBody}>
            We, the undersigned residents and landowners of Frederick County, Virginia, respectfully petition the Board of Supervisors to protect our community from the unchecked expansion of large-scale data centers.
          </p>
          <p className={styles.petitionBody}>
            Frederick County is served by Rappahannock Electric Cooperative (REC), a member-owned utility we are all part of. Every major county in Virginia that has approved large data centers now faces <b>skyrocketing water consumption, rising electric bills, and industrial blight on agricultural land.</b> The facts are documented:
          </p>
          <p className={styles.petitionBody}>
            REC's own regulatory filings project <b>17 gigawatts of data center demand by 2040</b>, up from near zero in 2023, exceeding the co-op's entire current peak load of 948 MW. REC is legally obligated to serve any data center that arrives in its territory, meaning <b>we bear the cost unless our local government acts first.</b> Loudoun County data centers increased drinking water use by <b>250% in four years,</b> revealed only through a public records request. Governor Youngkin vetoed <b>HB 1601</b>, which would have required water impact assessments before approval.
          </p>
          <p className={styles.petitionBody}>
            Frederick County sits in a drought-prone valley. <b>Our wells, our farms, and our families cannot absorb the consequences that Loudoun, Prince William, and other counties are now living with.</b>
          </p>
          <ul className={styles.petitionDemands}>
            <li><b>Reject all data center rezoning and special use permits</b> until Virginia law requires comprehensive water and environmental impact assessments</li>
            <li><b>Protect agricultural and rural land</b> from industrial data center development incompatible with Frederick County's character</li>
            <li><b>Demand full transparency</b> on water consumption, electricity demand, and infrastructure costs before any application is considered</li>
            <li><b>Follow Warren County's lead.</b> Your neighbors voted 5–0 in January 2023 to block data centers, calling them "monstrosities" and citing water supply risks. Make the same choice for Frederick County.</li>
          </ul>
          <p className={styles.petitionClosing}>
            We recognize that state-level protections are inadequate. In the absence of those protections, we call on our local Board of Supervisors to exercise every available authority to protect the residents of Frederick County. Our valley's water, land, and quality of life are not for sale.
          </p>
        </div>

        {/* ── Form ── */}
        <div className={styles.formCol}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <div className={styles.formTitle}>Add Your Name</div>
              <div className={styles.formSub}>Your signature will be presented to the Board of Supervisors at the rescheduled public forum.</div>
            </div>

            {submitted ? (
              <div className={styles.formSuccess}>
                <span className={styles.successIcon}>✦</span>
                <div className={styles.successTitle}>Thank you for signing.</div>
                <p className={styles.successBody}>Your name has been added to the petition. Please share this page so more Frederick County residents can sign before the February forums.</p>
                <div className={styles.successShare}>
                  <a className={styles.ssFb} href="https://www.facebook.com/sharer/sharer.php?u=https://protectfrederick.org/petition" target="_blank" rel="noopener">
                    <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </a>
                  <a className={styles.ssTw} href="https://twitter.com/intent/tweet?text=I+just+signed+the+Frederick+County+petition+against+unchecked+data+center+development.+Add+your+name.&url=https://protectfrederick.org/petition" target="_blank" rel="noopener">
                    <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Share on X
                  </a>
                  <button className={styles.ssCopy} onClick={copyLink}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    {copied ? '✓ Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.formBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="name">Full Name *</label>
                  <input type="text" className={styles.formInput} id="name" name="name"
                    placeholder="Jane Smith" value={form.name} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="email">Email Address *</label>
                  <input type="email" className={styles.formInput} id="email" name="email"
                    placeholder="jane@example.com" value={form.email} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="district">Your District *</label>
                  <div className={styles.selectWrap}>
                    <select className={styles.formSelect} id="district" name="district"
                      value={form.district} onChange={handleChange}>
                      <option value="" disabled>Select your district…</option>
                      {DISTRICTS.map(d => <option key={d} value={d}>{d} District</option>)}
                      <option value="Unknown">Not sure / Outside Frederick County</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formCheckboxRow}>
                  <input type="checkbox" className={styles.formCheckbox} id="consent" name="consent"
                    checked={form.consent} onChange={handleChange} />
                  <label className={styles.formCheckboxLabel} htmlFor="consent">
                    I am a resident, landowner, or stakeholder in Frederick County, Virginia, and I support this petition. I consent to my name and district being displayed publicly.
                  </label>
                </div>
                {error && <div className={styles.formError}>{error}</div>}
                <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Signing…' : 'Sign the Petition →'}
                </button>
                <p className={styles.formPrivacy}>Your email will not be displayed publicly and will only be used for petition-related updates.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Signers Section ── */}
      <section className={styles.signersSection}>
        <div className={styles.signersInner}>
          <div className={styles.signersHeader}>
            <div className={styles.signersTitle}>Signatures by District</div>
            <div className={styles.signersCount}>
              {signatures === null ? 'Loading signatures…' : `${signatures.length.toLocaleString()} signature${signatures.length !== 1 ? 's' : ''}`}
            </div>
          </div>

          <div className={styles.districtBreakdown}>
            {DISTRICTS.map(d => (
              <div key={d} className={styles.districtRow}>
                <div className={styles.districtName}>{d}</div>
                <div className={styles.districtBarWrap}>
                  <div
                    className={styles.districtBar}
                    style={{ width: `${Math.round((districtCounts[d] / maxCount) * 100)}%` }}
                  />
                </div>
                <div className={styles.districtBarCount}>{districtCounts[d]}</div>
              </div>
            ))}
          </div>

          <div className={styles.signersHeader} style={{ marginTop: '8px' }}>
            <div className={styles.signersTitle}>Who Has Signed</div>
          </div>

          {signatures === null && <div className={styles.signersLoading}>Loading…</div>}
          {signatures !== null && signatures.length === 0 && (
            <div className={styles.signersEmpty}>Be the first to sign this petition.</div>
          )}
          {signatures && signatures.length > 0 && (
            <div className={styles.signersGrid}>
              {signatures.map((s, i) => (
                <div key={i} className={styles.signerItem}>
                  <div className={styles.signerName}>{s.name}</div>
                  <div className={styles.signerDistrict}>{s.district}</div>
                  <div className={styles.signerDate}>{formatShortDate(s.created_at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}