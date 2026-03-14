'use client'

import { useState } from 'react'
import styles from '@/styles/donate.module.css'

const PRESET_AMOUNTS = [10, 25, 50, 100, 250]
const VENMO_USERNAME = process.env.NEXT_PUBLIC_VENMO_USERNAME

export default function DonatePage() {
  const [selected, setSelected] = useState(25)
  const [custom, setCustom]     = useState('')
  const [customFocused, setCustomFocused] = useState(false)

  const effectiveAmount = customFocused || custom
    ? (parseFloat(custom) || null)
    : selected

  function handlePreset(amt) {
    setSelected(amt)
    setCustom('')
    setCustomFocused(false)
  }

  function handleCustomChange(e) {
    const val = e.target.value.replace(/[^0-9.]/g, '')
    setCustom(val)
    setSelected(null)
  }

  function handleCustomFocus() {
    setCustomFocused(true)
    setSelected(null)
  }

  function handleCustomBlur() {
    setCustomFocused(false)
    if (!custom) {
      setSelected(25)
    }
  }

  const venmoNote = 'Protect+Frederick+Campaign'
  const venmoUrl = effectiveAmount && effectiveAmount > 0
    ? `https://venmo.com/${VENMO_USERNAME}?txn=pay&amount=${effectiveAmount.toFixed(2)}&note=${venmoNote}`
    : `https://venmo.com/${VENMO_USERNAME}`

  const displayAmount = effectiveAmount && effectiveAmount > 0
    ? `$${effectiveAmount % 1 === 0 ? effectiveAmount : effectiveAmount.toFixed(2)}`
    : null

  return (
    <main className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>Support the Campaign</div>
          <h1 className={styles.heroTitle}>
            Grassroots campaigns<br />
            <em>run on neighbors.</em>
          </h1>
          <p className={styles.heroDeck}>
            Protect Frederick is entirely community-funded. No corporate donors,
            no PAC money. Just residents putting their own resources behind the fight.
            Your contribution helps keep this effort going.
          </p>
        </div>
      </section>

      {/* ── Main Section ── */}
      <section className={styles.mainSection}>
        <div className={styles.mainInner}>

          {/* Left: Widget */}
          <div className={styles.widgetCol}>
            <div className={styles.widget}>
              <h2 className={styles.widgetTitle}>Choose an amount</h2>

              <div className={styles.amountGrid}>
                {PRESET_AMOUNTS.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    className={`${styles.amountBtn} ${selected === amt ? styles.amountBtnActive : ''}`}
                    onClick={() => handlePreset(amt)}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <div className={styles.customRow}>
                <label className={styles.customLabel} htmlFor="custom-amount">
                  Or enter a custom amount
                </label>
                <div className={styles.customInputWrap}>
                  <span className={styles.customDollar}>$</span>
                  <input
                    id="custom-amount"
                    type="text"
                    inputMode="decimal"
                    className={`${styles.customInput} ${customFocused || custom ? styles.customInputActive : ''}`}
                    value={custom}
                    onChange={handleCustomChange}
                    onFocus={handleCustomFocus}
                    onBlur={handleCustomBlur}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <a
                href={venmoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.venmoBtn}
              >
                {displayAmount ? `Donate ${displayAmount} on Venmo →` : 'Donate on Venmo →'}
              </a>

              <p className={styles.venmoNote}>
                Opens the Venmo app or website.
                You&apos;ll confirm before any charge is made.
              </p>

              <div className={styles.widgetDivider} />

              <div className={styles.widgetMeta}>
                <div className={styles.widgetMetaItem}>
                
                </div>
                <div className={styles.widgetMetaItem}>
                  <span className={styles.widgetMetaIcon}>✦</span>
                  <span>100% goes to campaign operations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Where money goes */}
          <div className={styles.contextCol}>
            <h2 className={styles.contextTitle}>Where your money goes</h2>
            <p className={styles.contextIntro}>
              Every dollar raised directly funds the work of keeping this community
              organized and informed.
            </p>

            <div className={styles.useList}>
              {[
                {
                  icon: '◆',
                  title: 'Website & digital operations',
                  body: 'Hosting, domain, and ongoing maintenance of protectfrederick.org: the central hub for campaign updates, resources, and the petition.',
                },
                {
                  icon: '◆',
                  title: 'Campaign materials',
                  body: 'Printing flyers, yard signs, door hangers, and future merchandise like stickers that help spread the word across the county.',
                },
                {
                  icon: '◆',
                  title: 'Organizer time',
                  body: 'Allowing dedicated volunteers to devote more hours to canvassing, attending board meetings, coordinating with legal experts, and running events.',
                },
                {
                  icon: '◆',
                  title: 'Community events',
                  body: 'Venue costs, materials, and logistics for town halls, forums, and neighborhood meetings where residents can engage directly.',
                },
                {
                  icon: '◆',
                  title: 'Research & outreach',
                  body: 'Zoning analysis, document requests, legal consultations, and targeted outreach to bring more residents into the campaign.',
                },
              ].map((item, i) => (
                <div key={i} className={styles.useItem}>
                  <span className={styles.useIcon}>{item.icon}</span>
                  <div className={styles.useText}>
                    <div className={styles.useTitle}>{item.title}</div>
                    <p className={styles.useBody}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className={styles.disclaimerSection}>
        <div className={styles.disclaimerInner}>
          <div className={styles.disclaimerBox}>
            <div className={styles.disclaimerEyebrow}>Grassroots Disclosure</div>
            <p className={styles.disclaimerText}>
              Protect Frederick is an independent, volunteer-led community
              campaign. We are not a registered 501(c)(3) nonprofit or political committee.{' '}
              <strong>Contributions are not tax-deductible.</strong> We accept no
              corporate funding, no PAC money, and no donations from any entity with
              a financial interest in the data center project. All funds go directly
              to grassroots campaign activities as described above.
            </p>
          </div>
        </div>
      </section>

    </main>
  )
}
