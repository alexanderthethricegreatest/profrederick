'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from '@/styles/sign-order.module.css'

const DISTRICTS = [
  'Back Creek',
  'Gainesboro',
  'Opequon',
  'Red Bud',
  'Shawnee',
  'Stonewall',
  'Not sure',
]


const EMPTY = {
  name: '', email: '', phone: '',
  address: '', city: '', zip: '',
  district: '', quantity: '1', sponsorQty: '0', message: '',
}

export default function SignOrderPage() {
  const [form, setForm]     = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit() {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/sign-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setErrorMsg(data.error || 'Something went wrong.'); setStatus('error'); return }
      setStatus('success')
    } catch {
      setErrorMsg('Something went wrong. Please email us directly at info@protectfrederick.org.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <main className={styles.page}>
        <div className={styles.successWrap}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Order received.</h1>
          <p className={styles.successBody}>
            Thanks, {form.name.split(' ')[0]}. Our signs coordinator will follow up at{' '}
            <strong>{form.email}</strong> with pricing and delivery details. We appreciate
            your support.
          </p>
          <a href="/" className="btn-primary">Back to home</a>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Get Involved</div>
          <h1 className={styles.heroTitle}>Request a Yard Sign</h1>
          <p className={styles.heroDeck}>
            Put a sign in your yard. Let your neighbors know where you stand.
            Fill out this form and our signs coordinator will follow up with you
            directly to arrange payment and delivery.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className={styles.formSection}>
        <div className={styles.formWrap}>

          {/* Sign preview */}
          <div className={styles.signPreview}>
            <Image
              src="/images/yard-sign.jpg"
              alt="No Data Centers — protectfrederick.org yard sign"
              width={600}
              height={480}
              className={styles.signPhoto}
              priority
            />
            <p className={styles.previewNote}>
              18" × 24" corrugated plastic yard sign with metal H-stake.
              Our signs coordinator will follow up with pricing and delivery details.
            </p>
          </div>

          {/* Form fields */}
          <div className={styles.form}>
            <div className={styles.formSection2}>
              <div className={styles.formSectionLabel}>Your Information</div>

              <div className={styles.fieldGroup}>
                <div className={styles.field}>
                  <label className={styles.label}>Full Name <span className={styles.req}>*</span></label>
                  <input
                    className={styles.input}
                    type="text" placeholder="Jane Smith"
                    value={form.name} onChange={set('name')}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email Address <span className={styles.req}>*</span></label>
                  <input
                    className={styles.input}
                    type="email" placeholder="jane@example.com"
                    value={form.email} onChange={set('email')}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.field}>
                  <label className={styles.label}>Phone Number <span className={styles.req}>*</span></label>
                  <input
                    className={styles.input}
                    type="tel" placeholder="(540) 555-0100"
                    value={form.phone} onChange={set('phone')}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>District <span className={styles.req}>*</span></label>
                  <select className={styles.input} value={form.district} onChange={set('district')}>
                    <option value="">Select your district…</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.formSection2}>
              <div className={styles.formSectionLabel}>Delivery Address</div>
              <p className={styles.fieldHint}>
                Please provide a valid Frederick County street address. Our coordinator
                will be in touch to confirm delivery details and payment.
              </p>

              <div className={styles.field}>
                <label className={styles.label}>Street Address <span className={styles.req}>*</span></label>
                <input
                  className={styles.input}
                  type="text" placeholder="123 Apple Blossom Ln"
                  value={form.address} onChange={set('address')}
                />
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.field}>
                  <label className={styles.label}>City / Town <span className={styles.req}>*</span></label>
                  <input
                    className={styles.input}
                    type="text" placeholder="Stephens City"
                    value={form.city} onChange={set('city')}
                  />
                </div>
                <div className={styles.field} style={{maxWidth: '140px'}}>
                  <label className={styles.label}>ZIP <span className={styles.req}>*</span></label>
                  <input
                    className={styles.input}
                    type="text" placeholder="22655"
                    value={form.zip} onChange={set('zip')}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formSection2}>
              <div className={styles.formSectionLabel}>Order Details</div>

              <div className={styles.field}>
                <label className={styles.label}>How many signs? <span className={styles.req}>*</span></label>
                <select className={styles.input} value={form.quantity} onChange={set('quantity')}>
                  {Array.from({ length: 100 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={String(n)}>{n}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Pay it forward — sponsor signs for neighbors <span className={styles.optional}>(optional)</span></label>
                <select className={styles.input} value={form.sponsorQty} onChange={set('sponsorQty')}>
                  <option value="0">None</option>
                  {Array.from({ length: 100 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={String(n)}>{n} sign{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <p className={styles.fieldHint}>
                  Want to sponsor a sign for a neighbor? Our coordinator will reach out about the details.
                </p>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Anything else we should know? <span className={styles.optional}>(optional)</span></label>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Gate code, best time to deliver, accessibility notes…"
                  value={form.message} onChange={set('message')}
                  rows={3}
                />
              </div>
            </div>

            {status === 'error' && (
              <div className={styles.errorBox}>{errorMsg}</div>
            )}

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending…' : 'Submit Request →'}
            </button>

            <p className={styles.formFooter}>
              Your information is shared only with our signs coordinator and will never be sold
              or shared with third parties. By submitting this form you agree to receive a
              follow-up from Protect Frederick regarding your request.
            </p>
          </div>

        </div>
      </section>

    </main>
  )
}