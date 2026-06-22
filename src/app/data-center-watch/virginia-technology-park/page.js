'use client'

import { useState, useContext, createContext, useEffect } from 'react'
import styles from '@/styles/data-center-watch.module.css'

// ── Citation registry ─────────────────────────────────────────────────────────
const CITATIONS = {
  'proffer-p1':       { label: 'Proffer Statement, p.1',       img: '', caption: 'Proffer Statement cover page identifying Executive Land Holdings IV, LLC as applicant and listing record owners.', source: 'Proffer Statement, p.1' },
  'proffer-1d':       { label: 'Proffer §1.D',                 img: '', caption: 'Section 1.D classifying three 300 MW substations as "accessory uses" customarily associated with technology industrial and manufacturing parks.', source: 'Proffer Statement, Section 1.D' },
  'proffer-1e':       { label: 'Proffer §1.E',                 img: '', caption: 'Section 1.E referencing traffic modeling limited to construction-phase and trip-generation only.', source: 'Proffer Statement, Section 1.E' },
  'proffer-2c':       { label: 'Proffer §2.C',                 img: '', caption: 'Section 2.C restricting generator testing to weekdays 8am–5pm, excluding major holidays.', source: 'Proffer Statement, Section 2.C' },
  'proffer-2d':       { label: 'Proffer §2.D',                 img: '', caption: 'Section 2.D permitting generator operation outside restricted hours during any "emergency."', source: 'Proffer Statement, Section 2.D' },
  'proffer-2e':       { label: 'Proffer §2.E',                 img: '', caption: 'Section 2.E listing equipment requirements: low noise emission fans, acoustical wraps for compressors and oil separators, acoustic perimeter for cooling equipment.', source: 'Proffer Statement, Section 2.E' },
  'proffer-2g':       { label: 'Proffer §2.G',                 img: '', caption: 'Section 2.G establishing a 70 dBA property line noise limit.', source: 'Proffer Statement, Section 2.G' },
  'proffer-6':        { label: 'Proffer §6',                   img: '', caption: 'Section 6 committing to a fire and rescue contribution of $150 per 1,000 gross square feet of constructed building, paid at certificate of occupancy.', source: 'Proffer Statement, Section 6' },
  'proffer-7d':       { label: 'Proffer §7.D',                 img: '', caption: 'Section 7.D listing water minimization strategies the applicant "may" employ: closed loop systems, air-cooled systems, direct liquid cooling, and immersion cooling.', source: 'Proffer Statement, Section 7.D' },
  'proffer-8':        { label: 'Proffer §8',                   img: '', caption: 'Section 8 committing to an Architectural Resources Study and Phase II interior study of both historic houses prior to first MDP approval.', source: 'Proffer Statement, Section 8' },
  'proffer-9':        { label: 'Proffer §9',                   img: '', caption: 'Section 9 addressing CPI adjustment for proffer contributions paid more than twelve months after approval.', source: 'Proffer Statement, Section 9' },
  'hrab-app-p2':      { label: 'HRAB Application, p.2',        img: '', caption: 'HRAB Application page 2 identifying J. Randall Minchew of Walsh, Colucci, Lubeley & Walsh as land use attorney of record.', source: 'HRAB Application, p.2' },
  'hrab-app-p2-3':    { label: 'HRAB Application, pp.2–3',     img: '', caption: 'HRAB Application pages 2–3 describing the rezoning from RA to TM across 238.57 acres.', source: 'HRAB Application, pp.2–3' },
  'hrab-app-sig':     { label: 'HRAB Application, pp.4–4A',    img: '', caption: 'HRAB Application signature pages showing John Knott signing as Vice President of Executive Land Holdings IV, LLC and simultaneously as Attorney-in-Fact for each record owner.', source: 'HRAB Application, pp.4–4A' },
  'hrab-memo-p1':     { label: 'HRAB Cover Memo, p.1',         img: '', caption: 'HRAB Item #2 Cover Memo page 1 noting that Proffer #8 incorporates language from the previous July 25, 2022 HRAB comment letter.', source: 'HRAB Item #2 Cover Memo, p.1' },
  'hrab-dhr':         { label: 'HRAB Cover Memo (DHR)',        img: '', caption: 'HRAB Cover Memo identifying DHR resources #034-1463 (Lewis-Solenberger House) and #034-1464 (Cather House) on the property.', source: 'HRAB Cover Memo, p.1' },
  'hrab-2022':        { label: 'HRAB Letter, July 25, 2022',   img: '', caption: 'Previous HRAB comment letter dated July 25, 2022 recommending a Phase II study of the interiors and building materials of both historic houses.', source: 'Previous HRAB Comment Letter, July 25, 2022' },
  'impact-soils':     { label: 'Impact Analysis, p.2: Soils', img: '', caption: 'Impact Analysis page 2 identifying Frederick Poplimento Loams, Oaklet Silt Loams, and Carbo-Oaklet Silt Loams on the parcels.', source: 'Impact Analysis Statement, p.2' },
  'impact-agmodel':   { label: 'Impact Analysis, p.2: Ag Map', img: '', caption: 'Impact Analysis page 2 referencing the Virginia Agricultural Model map designation of "prime farmland and farmland of statewide importance."', source: 'Impact Analysis Statement, p.2' },
  'impact-woods':     { label: 'Impact Analysis, p.2: Woodlands', img: '', caption: 'Impact Analysis page 2 noting approximately 54 acres of woodlands on the parcels.', source: 'Impact Analysis Statement, p.2' },
  'impact-water':     { label: 'Impact Analysis, p.3: Water', img: '', caption: 'Impact Analysis page 3 disclosing hydrant flow tests of 950 and 1,005 GPM described as "barely meeting Frederick Water\'s minimal flow requirements," and acknowledging water system expansion will be required.', source: 'Impact Analysis Statement, p.3' },
  'impact-users':     { label: 'Impact Analysis, p.3: End Users', img: '', caption: 'Impact Analysis page 3 stating that "the end users of the industrial development on the Property have not been identified."', source: 'Impact Analysis Statement, p.3' },
  'enia-summary':     { label: 'ENIA Summary, p.1',            img: '', caption: 'Environmental Noise Impact Assessment summary page concluding that with mitigation the property line noise level can be brought to 70 dBA.', source: 'ENIA Summary, p.1' },
  'enia-conclusions': { label: 'ENIA Conclusions, p.4',        img: '', caption: 'ENIA Conclusions page 4 stating that "since many assumptions about the site were made, an additional acoustical analysis of the final design will be necessary to demonstrate final compliance to local noise code."', source: 'ENIA Conclusions, p.4' },
  'enia-discussion':  { label: 'ENIA Discussion, p.1',         img: '', caption: 'ENIA Data and Discussion page 1 noting the noise modeling was run on a hypothetical building layout.', source: 'ENIA Data and Discussion, p.1' },
  'gdp-c3':           { label: 'GDP Sheet C-3',                img: '', caption: 'Generalized Development Plan Sheet C-3 showing eleven data center buildings and three 300 MW electrical substations.', source: 'GDP Sheet C-3' },
  'gdp-c4':           { label: 'GDP Overall Plan C-4',         img: '', caption: 'Overall Illustrative Plan C-4 showing the site layout including building footprints and substation locations.', source: 'Overall Illustrative Plan C-4' },
  'dhr-1463':         { label: 'DHR Survey #034-1463',         img: '', caption: 'DHR Survey Form for the Lewis-Solenberger House (034-1463) at 384 Ruebuck Lane, constructed circa 1800, assessed at reconnaissance level as "recommended not eligible" for the National Register.', source: 'DHR Survey Form 034-1463, p.1' },
  'dhr-1464':         { label: 'DHR Survey #034-1464',         img: '', caption: 'DHR Survey Form for the Cather House (034-1464) at 257 Ruebuck Lane, constructed circa 1800, assessed at reconnaissance level as "recommended not eligible" for the National Register.', source: 'DHR Survey Form 034-1464, p.1' },
  'ext-1':  { label: 'Source [1]', img: '', url: 'https://dailyprogress.com/news/state-regional/business/article_32da447d-6958-57c7-9821-2bd208b3ec25.html', caption: 'Biller, T.E. (2025). Virginia co-op proposes path to keep data centers from boosting electric bills. Reports REC\'s current peak system demand of ~948 MW and expectation of up to 17 GW of data center demand by 2040.', source: 'Richmond Times-Dispatch / Daily Progress, April 11, 2025' },
  'ext-2':  { label: 'Source [2]', img: '', url: 'https://virginiamercury.com/2025/04/25/will-special-rate-classes-protect-va-residents-from-the-costs-of-serving-data-centers/', caption: 'Main, I. (2025). Will special rate classes protect Va. residents from the costs of serving data centers? Reports that residential customers will pay 55% of Dominion\'s $7.6B in planned transmission infrastructure.', source: 'Virginia Mercury, April 25, 2025' },
  'ext-3':  { label: 'Source [3]', img: '', url: 'https://www.powwr.com/blog/how-data-centers-are-reshaping-pjms-energy-market', caption: 'POWWR (2025). How Data Centers Are Reshaping PJM\'s Energy Market. Reports PJM\'s 2025 Long-Term Load Forecast projecting 32 GW of peak load growth by 2030 with data centers responsible for 94%.', source: 'POWWR, November 10, 2025' },
  'ext-4':  { label: 'Source [4]', img: '', url: 'https://www.datacenterdynamics.com/en/news/dominion-to-build-new-high-voltage-lines-to-supply-proposed-900mw-data-center-in-chesterfield-county-virginia/', caption: 'Data Center Dynamics (2025). Dominion to build new high voltage lines to supply proposed 900MW data center in Chesterfield County, Virginia. Dominion filed to construct seven miles of new high-voltage transmission lines at an estimated cost of $121 million.', source: 'Data Center Dynamics, March 2025' },
  'ext-5':  { label: 'Source [5]', img: '', url: 'https://www.utilitydive.com/news/solving-pjms-data-center-problem/805600/', caption: 'Rutigliano & Lang-Ree (2025). Solving PJM\'s data center problem. Reports that the 67 million people served by PJM were hit with an extra $9.4 billion in electricity bills as proposed data centers drove up prices.', source: 'Utility Dive, December 2, 2025' },
  'ext-6':  { label: 'Source [6]', img: '', url: 'https://technical.ly/civics/pjm-data-center-electric-grid-ferc-proposal/', caption: 'Eberhart, M. (2025). States and residents push back on PJM data center decisions. Reports that PJM\'s capacity auction clearing price jumped to $329.17/MW-day for 2026–2027, more than ten times the $28.92 price for 2024–2025.', source: 'Technical.ly, December 5, 2025' },
  'ext-7':  { label: 'Source [7]', img: '', url: 'https://www.bakerbotts.com/thought-leadership/publications/2025/december/ferc-issues-order-providing-guidance-for-co-locating-power-plants-with-data-centers-within-pjm', caption: 'Baker Botts (2025). FERC Issues Order Providing Guidance for "Co-locating" Power Plants with Data Centers within PJM. Notes PJM\'s December 2025 capacity auction closed 6,600 MW short of its reserve margin.', source: 'Baker Botts, December 2025' },
  'ext-8':  { label: 'Source [8]', img: '', url: 'https://www.utilitydive.com/news/pjm-data-center-interconnection-market-monitor-ferc-complaint/806527/', caption: 'Howland, E. (2025). No more PJM data centers unless they can be reliably served: market monitor. PJM\'s independent market monitor filed a complaint with FERC in November 2025 stating PJM should not permit interconnection of large new data center loads if they cannot be reliably served.', source: 'Utility Dive, November 26, 2025' },
  'ext-9':  { label: 'Source [9]', img: '', url: 'https://www.eenews.net/articles/data-center-boom-sparks-sticker-shock-for-pjm-ratepayers/', caption: 'E&E News (2025). Data center boom sparks sticker shock for PJM ratepayers. An analysis by the Union of Concerned Scientists found $4.3 billion in transmission expansion costs were passed on to consumers in seven PJM states in a single year.', source: 'E&E News, October 3, 2025' },
  'ext-10': { label: 'Source [10]', img: '', url: 'https://www.aep.com/news/stories/view/10048/', caption: 'American Electric Power (2025). PJM selects regional transmission projects to be jointly developed by AEP, Dominion Energy, FirstEnergy. Includes ~260 miles of 765-kilovolt transmission line and two substations between Putnam County, WV and Frederick County, MD.', source: 'AEP, February 27, 2025' },
  'ext-11': { label: 'Source [11]', img: '', url: 'https://jlarc.virginia.gov/landing-2024-data-centers-in-virginia.asp', caption: 'Joint Legislative Audit and Review Commission (2024). Data Centers in Virginia. Recommended the General Assembly expressly authorize local governments to require water use estimates and sound modeling for proposed data center developments.', source: 'JLARC, December 9, 2024' },
}

// ── Context ───────────────────────────────────────────────────────────────────
const CiteCtx = createContext(() => {})

// ── Sub-components ────────────────────────────────────────────────────────────
function Cite({ id }) {
  const onCite = useContext(CiteCtx)
  const c = CITATIONS[id]
  if (!c) return null
  const isExt = id.startsWith('ext-')
  return (
    <button
      className={`${styles.cite}${isExt ? ` ${styles.citeExt}` : ''}`}
      onClick={() => onCite(id)}
    >
      {c.label}
    </button>
  )
}

function Accordion({ num, title, subtitle, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`${styles.accordion}${open ? ` ${styles.accordionOpen}` : ''}`}>
      <button
        className={styles.accordionTrigger}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className={styles.accNum}>{num}</span>
        <span className={styles.accTitle}>{title}</span>
        {subtitle && <span className={styles.accSubtitle}>{subtitle}</span>}
        <svg className={styles.accChevron} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="5 8 10 13 15 8" />
        </svg>
      </button>
      {open && <div className={styles.accordionBody}>{children}</div>}
    </div>
  )
}

function Callout({ label, children }) {
  return (
    <div className={styles.callout}>
      <div className={styles.calloutLabel}>{label}</div>
      <div className={styles.calloutBody}>{children}</div>
    </div>
  )
}

function Alert({ icon = '⚠', children }) {
  return (
    <div className={styles.alert}>
      <span className={styles.alertIcon}>{icon}</span>
      <div className={styles.alertBody}>{children}</div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function VirginiaTPPage() {
  const [lbKey, setLbKey] = useState(null)
  const lb = lbKey ? CITATIONS[lbKey] : null

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setLbKey(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <CiteCtx.Provider value={setLbKey}>
      <main className={styles.page}>

        {/* ── Lightbox ── */}
        {lb && (
          <div className={styles.lightboxOverlay} onClick={() => setLbKey(null)}>
            <div className={styles.lightboxBox} onClick={e => e.stopPropagation()}>
              <div className={styles.lightboxHeader}>
                <span className={styles.lightboxLabel}>{lb.label}</span>
                <button className={styles.lightboxClose} onClick={() => setLbKey(null)} aria-label="Close">✕</button>
              </div>
              <div className={styles.lightboxImgWrap}>
                {lb.img ? (
                  <img src={lb.img} alt={lb.label} />
                ) : lb.url ? (
                  <div className={styles.lightboxPlaceholder}>
                    <div style={{ fontSize: 36, opacity: .4 }}>🔗</div>
                    <div style={{ fontWeight: 600 }}>External Source</div>
                    <a href={lb.url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 13, color: 'var(--barn)', wordBreak: 'break-all', maxWidth: 480, textAlign: 'center', textDecoration: 'underline' }}>
                      {lb.url}
                    </a>
                    <a href={lb.url} target="_blank" rel="noopener noreferrer"
                      style={{ marginTop: 8, display: 'inline-block', fontSize: 12, fontWeight: 600, background: 'var(--ink)', color: 'var(--cream)', padding: '7px 18px', textDecoration: 'none' }}>
                      Open Article ↗
                    </a>
                  </div>
                ) : (
                  <div className={styles.lightboxPlaceholder}>
                    <div style={{ fontSize: 36, opacity: .4 }}>🖼</div>
                    <div>Screenshot not yet attached</div>
                    <code>{lbKey}.png</code>
                  </div>
                )}
              </div>
              <div className={styles.lightboxCaption}>
                <div className={styles.lightboxCaptionTitle}>{lb.caption}</div>
                <div className={styles.lightboxCaptionSource}>Source: {lb.source}</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroEyebrow}>Protect Frederick &nbsp;·&nbsp; Public Analysis</div>
            <h1 className={styles.heroTitle}>
              Virginia Technology Park:<br />
              What Frederick County Residents Need to Know
            </h1>
            <p className={styles.heroSub}>
              A 900 MW industrial data center campus is proposed for prime farmland in Clear Brook,
              Virginia. This is an analysis of what the application says, what it doesn't say, and
              what it permanently commits the county to before the Board of Supervisors votes.
            </p>
            <div className={styles.heroMeta}>
              <div className={styles.metaItem}><strong>Case</strong>Rezoning #04-26</div>
              <div className={styles.metaItem}><strong>Applicant</strong>Equus Capital Partners / Executive Land Holdings IV, LLC</div>
              <div className={styles.metaItem}><strong>Location</strong>S. of Rest Church Rd, W. of Zachary Ann Ln, E. of Ruebuck Ln (Stonewall District)</div>
              <div className={styles.metaItem}><strong>Parcels</strong>33-A-89 · 33-A-90 · 33-9-1A</div>
              <div className={styles.metaItem}><strong>Acreage</strong>~220 acres (RA → TM rezoning)</div>
              <div className={styles.metaItem}><strong>PC Vote</strong>June 3, 2026 — 10-0 recommending denial</div>
              <div className={styles.metaItem}><strong>BOS Hearing</strong>Postponed indefinitely (applicant withdrew)</div>
            </div>
          </div>
        </section>

        {/* ── Content ── */}
        <div className={styles.content}>

          {/* Lede */}
          <div className={styles.lede}>
            <p>
              Once the Board of Supervisors approves this rezoning, the proffers are recorded with
              the deed and become the permanent governing document for that land. The county cannot
              subsequently require additional commitments. This makes the adequacy of proffers at
              the time of approval the only meaningful point of public accountability in the entire
              development process.
            </p>
            <p>
              The Virginia Technology Park proffers fail that test on water, noise, historic
              resources, fiscal impact, and grid infrastructure.
            </p>
          </div>

          {/* Key facts */}
          <div className={styles.keyFacts}>
            <div className={styles.factItem}>
              <div className={styles.factNumber}>~220</div>
              <div className={styles.factLabel}>Acres of Prime Farmland</div>
            </div>
            <div className={styles.factItem}>
              <div className={styles.factNumber}>900<span>MW</span></div>
              <div className={styles.factLabel}>Proposed Electrical Load</div>
            </div>
            <div className={styles.factItem}>
              <div className={styles.factNumber}>11</div>
              <div className={styles.factLabel}>Data Center Buildings</div>
            </div>
            <div className={styles.factItem}>
              <div className={styles.factNumber}>3</div>
              <div className={styles.factLabel}>300 MW Substations</div>
            </div>
            <div className={styles.factItem}>
              <div className={styles.factNumber}>$356K</div>
              <div className={styles.factLabel}>One-Time Fire &amp; Rescue Payment</div>
            </div>
            <div className={styles.factItem}>
              <div className={styles.factNumber}>0</div>
              <div className={styles.factLabel}>Binding Water Use Limits</div>
            </div>
          </div>

          {/* ── Accordion sections ── */}
          <div className={styles.accordionGroup}>

            {/* 01 */}
            <Accordion num="01" title="What Is This Application?" subtitle="Rezonings, TM districts, by-right development, and why the BOS vote is final">
              <h3>What is a rezoning?</h3>
              <p>
                Every parcel of land in Frederick County has a zoning designation that determines
                what can be built on it. The four parcels at issue here are currently zoned{' '}
                <strong>Rural Areas (RA)</strong>, the county's most protective agricultural
                designation, intended to preserve farmland and limit industrial development.
              </p>
              <p>
                A rezoning is a request to change that designation permanently. The applicant is
                asking the county to change these parcels from RA to{' '}
                <strong>Technology Manufacturing Park (TM)</strong>. If approved, that change is
                recorded with the deed. It runs with the land. A future Board of Supervisors cannot
                simply undo it.
              </p>
              <h3>What is the Technology Manufacturing Park (TM) district?</h3>
              <p>
                The TM zone is Frederick County's purpose-built zoning category for data centers and
                related industrial technology uses, created and adopted in April 2025. It permits
                data centers, electrical substations, and associated industrial facilities as primary
                uses. Any commitments beyond those baseline standards (water use limits, fiscal
                impact analysis, grid impact review) can only be secured through proffers, which
                are entirely voluntary: the applicant decides what to offer.
              </p>
              <h3>What does "by-right" mean, and why does it matter?</h3>
              <p>
                Once a parcel is rezoned to TM, any permitted use becomes <strong>by-right</strong>:
                it can proceed without further Board or Planning Commission approval. The applicant
                submits a Master Development Plan (MDP) to the Planning Department, which reviews it
                for technical compliance only. There is no second public vote and no opportunity for
                the community to weigh in again on whether the development should happen.
              </p>
              <h3>What are proffers?</h3>
              <p>
                Proffers are written commitments that an applicant voluntarily offers as conditions
                of rezoning approval: noise limits, water targets, road improvements, fire
                contributions. Once the Board approves the rezoning, proffers are recorded with the
                deed and are legally enforceable, but only to the extent they are written clearly.
                Proffer language that is vague or aspirational is effectively unenforceable.
              </p>
              <Callout label="Why This Matters for Virginia Technology Park">
                <p>
                  The Board of Supervisors has already rejected this applicant's proposals twice.
                  If the BOS approves this rezoning, data center development on these ~220 acres
                  becomes by-right. The county's ability to shape, condition, or prevent that
                  development ends at the moment of the vote. The proffers offered in this
                  application are the only binding commitments the county will ever have.
                </p>
              </Callout>
            </Accordion>

            {/* 02 */}
            <Accordion num="02" title="Project Timeline" subtitle="2022 Fruit Hill withdrawal → current application → decisions ahead">
              <div className={styles.timeline}>
                {[
                  { v: 'completed', tag: '2022',     date: 'July 25, 2022',       title: '"Fruit Hill": HRAB Review',
                    body: <>Equus Capital Partners submits a rezoning for three parcels (220 acres) from RA to M1/B2/OM. HRAB issues a comment letter recommending Phase II interior studies of both historic houses. <Cite id="hrab-2022" /></> },
                  { v: 'completed', tag: '2023',     date: '2023',                title: '"Fruit Hill" Withdrawn',
                    body: 'The Fruit Hill application is withdrawn following HRAB review and public pressure. Parcels remain zoned Rural Areas (RA).' },
                  { v: 'completed', tag: '2024',     date: 'September 2024',      title: 'Second Attempt: Denied by BOS 4-3',
                    body: 'Equus reintroduces the proposal with updated zoning designations. The Board of Supervisors votes it down 4–3 after significant public opposition.' },
                  { v: 'completed', tag: '2024',     date: 'October 2024',        title: 'NextEra / Woodside Substation Approved',
                    body: 'The Planning Commission approves NextEra Energy\'s Woodside substation on 72 acres immediately south of the proposed site. Substations are a by-right use on RA-zoned land.' },
                  { v: 'completed', tag: '2025',     date: 'April 2025',          title: 'County Adopts TM-Zone Data Center Performance Standards',
                    body: 'Frederick County formally adopts Technology Manufacturing Park (TM) zoning standards for data centers. This is the regulatory change that enabled the current resubmission.' },
                  { v: 'completed', tag: 'Nov 2025', date: 'November 21, 2025',   title: 'Virginia Technology Park: HRAB Review',
                    body: <>HRAB reviews the new application (originally 238.57 acres) seeking rezoning from RA to TM for 11 data center buildings <Cite id="gdp-c3" /> and three 300 MW substations.</> },
                  { v: 'completed', tag: 'Nov 2025', date: 'November 21–24, 2025',title: 'HRAB Outcome: Parcel Removed, Minor Suggestions Only',
                    body: <>The applicant announces removal of the 18.51-acre Thistle Lane parcel, reducing the project to ~220 acres. HRAB supports the Phase II historic study commitment <Cite id="proffer-8" /> but imposes no blocking conditions. Application advances.</> },
                  { v: 'completed', tag: 'May 2026', date: 'Monday, May 5, 2026, 7:00 p.m.', title: 'Planning Commission Work Session: Rezoning #04-26',
                    body: 'The Planning Commission held a work session on Rezoning #04-26. 107 N. Kent Street, Winchester, VA. Work sessions are not formal public hearings; there is no public comment period. Commissioners reviewed the application with staff.' },
                  { v: 'completed', tag: 'Jun 2026', date: 'June 3, 2026', title: 'Planning Commission Votes 10-0 to Recommend Denial',
                    body: 'The Planning Commission voted unanimously, 10-0, to recommend denial of Rezoning #04-26 after a nearly four-hour meeting. Commissioners cited a lack of detail and enforceable proffers. Roughly 30 residents marched in opposition beforehand. The recommendation was set to go to the Board of Supervisors on July 8.' },
                  { v: 'pending',  tag: 'TBD', date: 'Postponed indefinitely', title: 'Board of Supervisors Hearing: Postponed',
                    body: 'Equus Capital Partners pulled its Virginia Technology Park rezoning from the July 8 Board of Supervisors agenda, postponing it indefinitely. No new hearing date has been set. Monitor fcva.us for updates.' },
                  { v: 'pending',  tag: 'If Approved', date: 'Post-Vote',         title: 'Master Development Plan (MDP) Submission',
                    body: 'If approved, the applicant moves to MDP where specific building configurations, generator placement, and noise mitigation are finalized within the bounds already set by the proffers. The county cannot impose new conditions at this stage.' },
                ].map(({ v, tag, date, title, body }, i) => {
                  const tagClass = v === 'completed' ? styles.tagDone : v === 'active' ? styles.tagActive : styles.tagPending
                  const itemClass = `${styles.tlItem} ${v === 'completed' ? styles.tlCompleted : v === 'active' ? styles.tlActive : v === 'decision' ? styles.tlDecision : styles.tlPending}`
                  return (
                    <div key={i} className={itemClass}>
                      <div className={styles.tlDot} />
                      <div className={`${styles.tlTag} ${tagClass}`}>{tag}</div>
                      <div className={styles.tlDate}>{date}</div>
                      <div className={styles.tlTitle}>{title}</div>
                      <div className={styles.tlBody}>{body}</div>
                    </div>
                  )
                })}
              </div>
              <Alert icon="📅">
                <p>
                  <strong>Status update:</strong> The Planning Commission voted 10-0 on June 3, 2026 to recommend denial of Rezoning #04-26. Equus Capital Partners subsequently pulled the application from the July 8 Board of Supervisors agenda. The BOS hearing is postponed indefinitely. Monitor <a href="https://www.fcva.us/government/meeting-portal">fcva.us</a> for updates.
                </p>
              </Alert>
            </Accordion>

            {/* 03 */}
            <Accordion num="03" title="The Shell Company Structure" subtitle="One private equity firm controlling both sides of the transaction">
              <p>
                The record owners of the four parcels are DTS, LC, William O. Minor, and David K.
                and Brenda S. Gray. The contract purchaser and applicant is{' '}
                <strong>Executive Land Holdings IV, LLC</strong>, a vehicle for Equus Capital
                Partners, Ltd. (Newtown Square, PA). <Cite id="proffer-p1" /> <Cite id="hrab-app-p2" />
              </p>
              <p>
                The application was signed by John Knott as Vice President of Executive Land
                Holdings IV, acting simultaneously as Attorney-in-Fact for each of the record
                owners. The same entity representing the buyer was also signing on behalf of the
                sellers. <Cite id="hrab-app-sig" />
              </p>
              <p>
                The land use attorney of record is J. Randall Minchew of Walsh, Colucci, Lubeley
                &amp; Walsh, PC, the same firm that represented the applicant in the prior "Fruit
                Hill" rezoning attempt withdrawn after HRAB review in 2022. <Cite id="hrab-app-p2" />{' '}
                <Cite id="hrab-2022" />
              </p>
              <Callout label="What This Means">
                <p>
                  A single private equity operator controls both sides of the transaction. The
                  actual end users are explicitly unnamed. The applicant states in their own
                  Impact Analysis that <em>"the end users of the industrial development on the
                  Property have not been identified."</em> <Cite id="impact-users" />
                </p>
                <p>
                  The county is being asked to permanently rezone ~220 acres of prime agricultural
                  land for an industrial use whose actual operators, water demands, electrical
                  loads, and traffic patterns are all unknown at the time of approval.
                </p>
              </Callout>
            </Accordion>

            {/* 04 */}
            <Accordion num="04" title='This Is "Fruit Hill" Rebranded' subtitle="Third attempt on the same parcels, now under a new zoning category">
              <p>
                The current application covers the same core parcels that were the subject of the
                withdrawn 2022 Fruit Hill rezoning (220.06 acres from RA to M1/B2/OM).{' '}
                <Cite id="hrab-2022" /> The new application repackages the request as a rezoning
                to TM, originally adding one additional parcel.{' '}
                <Cite id="hrab-app-p2-3" />
              </p>
              <p>
                The applicant acknowledges the prior HRAB history directly, noting that Proffer #8
                "incorporates the language from the previous HRAB comment letter from 2022."{' '}
                <Cite id="hrab-memo-p1" /> The historic preservation commitments are the minimum
                the applicant was already told to meet three years ago. These are not new concessions.
              </p>
              <Callout label="What This Means">
                <p>
                  This follows a pattern common in Virginia data center development: a private
                  equity land acquisition vehicle assembles rural parcels, submits a rezoning that
                  gets withdrawn or denied under public pressure, repackages with modest additions,
                  and resubmits. The three-year gap between the Fruit Hill withdrawal and the
                  Virginia Technology Park resubmission tracks the county's April 2025 adoption of
                  TM-zone performance standards, which gave the applicant a cleaner regulatory
                  pathway.
                </p>
              </Callout>
            </Accordion>

            {/* 05 */}
            <Accordion num="05" title="Prime Agricultural Land" subtitle="Irreversible conversion, no agricultural mitigation in the proffers">
              <p>
                The Impact Analysis acknowledges the parcels contain Frederick Poplimento Loams,
                Oaklet Silt Loams, and Carbo-Oaklet Silt Loams. <Cite id="impact-soils" /> The
                Virginia Agricultural Model map designates these as{' '}
                <strong>"prime farmland and farmland of statewide importance."</strong>{' '}
                <Cite id="impact-agmodel" /> The parcels also contain approximately 54 acres of
                woodlands. <Cite id="impact-woods" />
              </p>
              <div className={styles.statRow}>
                <div className={styles.statBlock}>
                  <div className={styles.statNum}>~220<span> ac</span></div>
                  <div className={styles.statDesc}>Prime farmland permanently converted to industrial use</div>
                </div>
                <div className={styles.statBlock}>
                  <div className={styles.statNum}>$0</div>
                  <div className={styles.statDesc}>Agricultural land bank contribution in the proffers</div>
                </div>
                <div className={styles.statBlock}>
                  <div className={styles.statNum}>$41.3<span>M</span></div>
                  <div className={styles.statDesc}>FY2027 structural county budget shortfall</div>
                </div>
              </div>
              <Callout label="What This Means">
                <p>
                  The conversion is irreversible. There is no agricultural land bank contribution,
                  no conservation easement on adjacent parcels, and no payment in lieu of
                  agricultural preservation in the proffers. Data centers in Virginia are largely
                  exempt from the retail sales tax on equipment under the state's data center tax
                  incentive program, meaning the county bears the full infrastructure cost while
                  primary tax benefits flow to the state.
                </p>
              </Callout>
            </Accordion>

            {/* 06 */}
            <Accordion num="06" title="Water Infrastructure Is Already Strained" subtitle="No binding consumption limits, existing system barely meets minimums now">
              <p>
                The applicant acknowledges the area is served by a single 12-inch water main under
                Interstate 81. Two hydrant pressure tests showed flows of only{' '}
                <strong>950 and 1,005 GPM</strong>, described in their own Impact Analysis as{' '}
                <em>"barely meeting Frederick Water's minimal flow requirements."</em>{' '}
                <Cite id="impact-water" />
              </p>
              <p>
                The applicant admits that "expansion of the existing sanitary public water systems
                will be required for full build-out," but that "the end users of the industrial
                development on the Property have not been identified."{' '}
                <Cite id="impact-users" />
              </p>
              <p>
                The proffers list four cooling strategies the applicant{' '}
                <strong>"may" employ</strong>. There are no binding water consumption targets, no
                gallons-per-day caps, and no enforceable efficiency metrics tied to occupancy
                permits. <Cite id="proffer-7d" />
              </p>
              <Alert>
                <p>
                  <strong>The word "may" has no legal force in a proffer.</strong> An applicant
                  who proffers that they "may" do something has committed to nothing. The county
                  has accepted language that creates the appearance of a water commitment while
                  guaranteeing nothing about actual water use.
                </p>
              </Alert>
              <Callout label="What This Means">
                <p>
                  Existing water infrastructure is already at minimum functional capacity before
                  a single data center comes online. A 900 MW campus will consume water at a
                  scale that has no analog in the county's current industrial base. The absence
                  of binding consumption commitments means this question will not be formally
                  resolved before ground is broken.
                </p>
              </Callout>
            </Accordion>

            {/* 07 */}
            <Accordion num="07" title="The Noise Assessment Is Conditional" subtitle="70 dBA modeled on a hypothetical layout, final design not yet confirmed">
              <p>
                The Environmental Noise Impact Assessment concludes that "with mitigation,
                including a barrier on the roof, the sound level at the property line can be
                brought to a level at or below 70 dBA." <Cite id="enia-summary" /> The same report
                explicitly states that{' '}
                <em>"since many assumptions about the site were made, an additional acoustical
                analysis of the final design will be necessary to demonstrate final compliance."</em>{' '}
                <Cite id="enia-conclusions" />
              </p>
              <p>
                The proffer locks in a 70 dBA property line limit. <Cite id="proffer-2g" />{' '}
                Generator testing is restricted to weekdays 8am–5pm,{' '}
                <Cite id="proffer-2c" /> but generators may operate outside those hours during any
                "emergency." <Cite id="proffer-2d" /> The noise modeling was run on a hypothetical
                layout subject to change through MDP. <Cite id="enia-discussion" />
              </p>
              <Alert>
                <p>
                  <strong>70 dBA sustained 24/7 is roughly equivalent to a vacuum cleaner at
                  close range or a busy restaurant, sustained continuously around the clock.</strong>{' '}
                  Adjacent neighborhoods include Carrollton Subdivision and Ridgeway Estates to the
                  north, and single-family RA parcels to the west and south.
                </p>
              </Alert>
              <Callout label="What This Means">
                <p>
                  The proffer establishes a standard without confirming the development can
                  actually meet it as designed. If the final acoustical analysis reveals compliance
                  problems after rezoning, the county's only remedy is litigation. The generator
                  testing restriction does not address continuous mechanical noise from chillers,
                  cooling towers, and mega-packs, which operate around the clock.
                </p>
              </Callout>
            </Accordion>

            {/* 08 */}
            <Accordion num="08" title="The Fire and Rescue Contribution Is Insufficient" subtitle="$356,000 one-time payment for a 900 MW industrial campus">
              <p>
                The applicant proffers <strong>$150 per 1,000 gross square feet</strong> at
                certificate of occupancy for each structure. <Cite id="proffer-6" /> With eleven
                buildings totaling ~2.375 million sq ft, the maximum one-time fire and rescue
                contribution is roughly <strong>$356,000</strong>, with no recurring component and
                no inflation mechanism beyond CPI. <Cite id="proffer-9" />
              </p>
              <div className={styles.statRow}>
                <div className={styles.statBlock}>
                  <div className={styles.statNum}>$356<span>K</span></div>
                  <div className={styles.statDesc}>Maximum one-time fire &amp; rescue contribution for a 900 MW campus</div>
                </div>
                <div className={styles.statBlock}>
                  <div className={styles.statNum}>$0</div>
                  <div className={styles.statDesc}>Recurring training or specialized equipment funding</div>
                </div>
              </div>
              <Callout label="What This Means">
                <p>
                  Frederick County's fire and rescue system will be first responder to any incident
                  at a 900 MW campus housing sensitive electrical infrastructure, diesel generator
                  fuel storage, and battery energy storage systems. The one-time contribution does
                  not fund recurring training, specialized equipment, or additional response
                  capacity. The county will bear those costs in perpetuity; the proffer addresses
                  them once.
                </p>
              </Callout>
            </Accordion>

            {/* 09 */}
            <Accordion num="09" title="The Substations Are Not Addressed in the Proffers" subtitle='Three 300 MW substations classified as "accessory uses" with no independent review'>
              <p>
                The Generalized Development Plan shows <strong>three 300 MW substations</strong>{' '}
                (~6 acres each). <Cite id="gdp-c3" /> <Cite id="gdp-c4" /> These are classified
                in the proffers as <em>"accessory uses"</em> customarily associated with technology
                industrial parks. <Cite id="proffer-1d" /> As accessories, they receive no
                independent noise, visual, or infrastructure commitments. The total 900 MW
                electrical draw is not analyzed for grid impact anywhere in the application package.
              </p>
              <Alert>
                <p>
                  <strong>The entire peak electrical demand of Frederick County is estimated at
                  200–300 MW.</strong> This development proposes to draw three times that load,
                  classified as an accessory use with no independent review required.
                </p>
              </Alert>
              <Callout label="What This Means">
                <p>
                  The county has no basis for evaluating what this development will require from
                  the regional transmission system, who will pay for transmission upgrades, or
                  what the reliability implications are for existing ratepayers. No analysis has
                  been provided, and none is required by the proffers.
                </p>
              </Callout>
            </Accordion>

            {/* 10 */}
            <Accordion num="10" title="Historic Resources on the Property" subtitle="Two circa 1800 farmhouses: studies required, preservation outcomes are not">
              <p>
                Two historic structures are on the property: the{' '}
                <strong>Lewis-Solenberger House</strong> (DHR #034-1463) at 384 Ruebuck Lane and
                the <strong>Cather House</strong> (DHR #034-1464) at 257 Ruebuck Lane, both
                constructed circa 1800. <Cite id="hrab-dhr" /> <Cite id="dhr-1463" />{' '}
                <Cite id="dhr-1464" />
              </p>
              <p>
                Both were assessed in 2022 at reconnaissance level as "recommended not eligible"
                for the National Register. The 2022 HRAB recommended Phase II interior studies.{' '}
                <Cite id="hrab-2022" /> The current Proffer #8 commits to an Architectural
                Resources Study and Phase II study before the first MDP. <Cite id="proffer-8" />{' '}
                <strong>Neither proffer commits to any specific outcome (preservation,
                recordation, or relocation) contingent on what the studies find.</strong>
              </p>
              <Callout label="What This Means">
                <p>
                  Both structures are circa 1800 vernacular farmhouses with stone foundations and
                  potentially intact interior log construction. If the Phase II study finds
                  significant interior fabric or previously undocumented historical associations,
                  the proffer imposes no obligation to preserve, document, or relocate either
                  structure. The study becomes a procedural requirement with no enforceable
                  consequence attached to its findings.
                </p>
              </Callout>
            </Accordion>

            {/* 11 */}
            <Accordion num="11" title="What the Proffers Do Not Require" subtitle="Six critical omissions from the only permanent governing document">
              <p>The proffer statement contains none of the following commitments:</p>
              <ul className={styles.missingList}>
                <li>Any binding cap on water consumption <Cite id="proffer-7d" /></li>
                <li>Any commitment to identify end users prior to rezoning approval <Cite id="impact-users" /></li>
                <li>Any grid impact analysis or utility coordination requirement <Cite id="proffer-1d" /></li>
                <li>Any preservation or recordation commitment for the Lewis-Solenberger or Cather Houses beyond conducting studies <Cite id="proffer-8" /></li>
                <li>Any traffic mitigation triggered by actual data center operational loads <Cite id="proffer-1e" /></li>
                <li>Any fiscal impact analysis of the county's long-term cost-to-revenue ratio for this land use conversion</li>
              </ul>
            </Accordion>

            {/* 12 */}
            <Accordion num="12" title="Why the Proffers Are Insufficient" subtitle="Four structural failures in the only binding public accountability document">
              <p>
                Proffers in Virginia rezonings are a one-time negotiation. Once the BOS approves
                the rezoning, the proffers are recorded with the deed permanently. The Virginia
                Technology Park proffers fail on four structural grounds:
              </p>
              <div className={styles.failuresGrid}>
                <div className={styles.failureCard}>
                  <div className={styles.failureNum}>Failure 01</div>
                  <h3>Aspirational Rather Than Enforceable</h3>
                  <p>
                    Water minimization commitments list strategies the applicant{' '}
                    <em>"may"</em> employ. <Cite id="proffer-7d" /> The word "may" has no legal force in
                    a proffer. Noise compliance was modeled on a hypothetical layout{' '}
                    <Cite id="enia-discussion" />; the applicant's own consultants state a final
                    analysis is still required after rezoning. <Cite id="enia-conclusions" />
                  </p>
                </div>
                <div className={styles.failureCard}>
                  <div className={styles.failureNum}>Failure 02</div>
                  <h3>Key Decisions Deferred Until After the County's Leverage Is Gone</h3>
                  <p>
                    Building configuration, generator placement, chiller arrangement, and road
                    alignments are all subject to MDP adjustment. <Cite id="proffer-1e" /> What
                    the BOS is approving is not a development plan; it is a framework within
                    which a plan will eventually be created, with the county's negotiating
                    position permanently weakened once the vote is taken.
                  </p>
                </div>
                <div className={styles.failureCard}>
                  <div className={styles.failureNum}>Failure 03</div>
                  <h3>One-Time Costs, Ongoing Obligations</h3>
                  <p>
                    The $356,000 fire and rescue contribution <Cite id="proffer-6" /> is one-time
                    with no recurring component. <Cite id="proffer-9" /> End users haven't been
                    identified, <Cite id="impact-users" /> so the county cannot evaluate actual
                    service demands. The county will bear infrastructure costs in perpetuity; the
                    proffer addresses them once.
                  </p>
                </div>
                <div className={styles.failureCard}>
                  <div className={styles.failureNum}>Failure 04</div>
                  <h3>The Largest Elements Are Classified as Accessories</h3>
                  <p>
                    Three 300 MW substations are classified as "accessory uses"{' '}
                    <Cite id="proffer-1d" />, receiving no independent noise, visual, or
                    infrastructure review. The single largest infrastructure impact of this
                    development receives no analysis and no mitigation commitment in the document
                    that will permanently govern this land.
                  </p>
                </div>
              </div>
            </Accordion>

            {/* 13 */}
            <Accordion num="13" title="Estimated Impact to the Regional Grid" subtitle="900 MW equals REC's entire current peak demand. No grid analysis provided.">
              <p>
                The Clear Brook area falls within the service territory of{' '}
                <strong>Rappahannock Electric Cooperative (REC)</strong>, with a current peak
                system demand of roughly <strong>948 megawatts</strong>.{' '}
                <Cite id="ext-1" /> The Virginia Technology Park proposes 900 MW of substation
                capacity <Cite id="gdp-c3" />, roughly equivalent to REC's entire current peak
                demand, proposed as a single development in a single county. REC now expects up
                to 17 GW of data center demand by 2040, up from near zero in 2023.{' '}
                <Cite id="ext-1" />
              </p>
              <div className={styles.statRow}>
                <div className={styles.statBlock}>
                  <div className={styles.statNum}>17<span>GW</span></div>
                  <div className={styles.statDesc}>Data center demand REC expects by 2040, up from near zero in 2023 <Cite id="ext-1" /></div>
                </div>
                <div className={styles.statBlock}>
                  <div className={styles.statNum}>$121<span>M</span></div>
                  <div className={styles.statDesc}>Cost of Dominion transmission lines for a comparable 900 MW project in Chesterfield County <Cite id="ext-4" /></div>
                </div>
                <div className={styles.statBlock}>
                  <div className={styles.statNum}>94<span>%</span></div>
                  <div className={styles.statDesc}>Share of PJM's 2024–2030 peak load growth attributed to data centers <Cite id="ext-3" /></div>
                </div>
              </div>
              <h3>The Regional Grid Is Already Under Strain</h3>
              <ul className={styles.missingList}>
                <li>PJM's 2025 Long-Term Load Forecast projects 32 GW of peak load growth by 2030. Data centers account for 94% of that increase. <Cite id="ext-3" /></li>
                <li>PJM's most recent capacity auction clearing price jumped to $329.17/MW-day for 2026–2027, more than ten times the $28.92 price for 2024–2025, with those costs flowing through to households and businesses. <Cite id="ext-6" /></li>
                <li>67 million people served by PJM were hit with an extra $9.4 billion in electricity bills as proposed data centers drove up prices. <Cite id="ext-5" /></li>
                <li>The PJM capacity auction closed 6,600 MW short of its reserve margin in December 2025. <Cite id="ext-7" /></li>
                <li>PJM's independent market monitor filed a complaint with FERC in November 2025 stating PJM should not permit the interconnection of large new data center loads if they cannot be served reliably. <Cite id="ext-8" /></li>
                <li>Of Dominion's $7.6 billion in planned new transmission infrastructure, residential customers will pay 55%. An analysis by the Union of Concerned Scientists found $4.3 billion in transmission costs passed on to consumers in seven PJM states in a single year. <Cite id="ext-2" /> <Cite id="ext-9" /></li>
                <li>In February 2025, PJM selected a major transmission project including ~260 miles of 765-kV lines between Putnam County, WV and Frederick County, MD, running through or adjacent to Frederick County, VA. The project was built specifically to address data center load growth. <Cite id="ext-10" /></li>
              </ul>
              <Callout label="What This Means">
                <p>
                  Frederick County residents will absorb a share of whatever transmission upgrade
                  costs result from this development through their utility bills, with no analysis
                  of those costs presented to the county at the time of approval. The proffer
                  statement contains no interconnection study, no grid impact analysis, and no
                  transmission upgrade commitment. <Cite id="proffer-1d" />
                </p>
                <p>
                  Virginia's JLARC recommended in December 2024 that the General Assembly
                  authorize local governments to require water use estimates and sound modeling for
                  data centers. <Cite id="ext-11" /> No equivalent mechanism exists for grid
                  impact analyses. The Board of Supervisors has no formal power to compel one, and
                  the applicant has provided none voluntarily.
                </p>
              </Callout>
              <div className={styles.bibliography}>
                <div className={styles.bibliographyTitle}>Sources</div>
                <ol className={styles.bibList}>
                  {[
                    { n: 1, text: <>Biller, T.E. (2025). Virginia co-op proposes path to keep data centers from boosting electric bills. <em>Richmond Times-Dispatch / Daily Progress</em>, April 11, 2025. <a href="https://dailyprogress.com/news/state-regional/business/article_32da447d-6958-57c7-9821-2bd208b3ec25.html" target="_blank" rel="noopener noreferrer">↗ dailyprogress.com</a></> },
                    { n: 2, text: <>Main, I. (2025). Will special rate classes protect Va. residents from the costs of serving data centers? <em>Virginia Mercury</em>, April 25, 2025. <a href="https://virginiamercury.com/2025/04/25/will-special-rate-classes-protect-va-residents-from-the-costs-of-serving-data-centers/" target="_blank" rel="noopener noreferrer">↗ virginiamercury.com</a></> },
                    { n: 3, text: <>POWWR. (2025). How Data Centers Are Reshaping PJM's Energy Market. November 10, 2025. <a href="https://www.powwr.com/blog/how-data-centers-are-reshaping-pjms-energy-market" target="_blank" rel="noopener noreferrer">↗ powwr.com</a></> },
                    { n: 4, text: <>Data Center Dynamics. (2025). Dominion to build new high voltage lines to supply proposed 900MW data center in Chesterfield County, Virginia. <a href="https://www.datacenterdynamics.com/en/news/dominion-to-build-new-high-voltage-lines-to-supply-proposed-900mw-data-center-in-chesterfield-county-virginia/" target="_blank" rel="noopener noreferrer">↗ datacenterdynamics.com</a></> },
                    { n: 5, text: <>Rutigliano, T. and Lang-Ree, C. (2025). Solving PJM's data center problem. <em>Utility Dive</em>, December 2, 2025. <a href="https://www.utilitydive.com/news/solving-pjms-data-center-problem/805600/" target="_blank" rel="noopener noreferrer">↗ utilitydive.com</a></> },
                    { n: 6, text: <>Eberhart, M. (2025). States and residents push back on PJM data center decisions. <em>Technical.ly</em>, December 5, 2025. <a href="https://technical.ly/civics/pjm-data-center-electric-grid-ferc-proposal/" target="_blank" rel="noopener noreferrer">↗ technical.ly</a></> },
                    { n: 7, text: <>Baker Botts. (2025). FERC Issues Order Providing Guidance for "Co-locating" Power Plants with Data Centers within PJM. December 2025. <a href="https://www.bakerbotts.com/thought-leadership/publications/2025/december/ferc-issues-order-providing-guidance-for-co-locating-power-plants-with-data-centers-within-pjm" target="_blank" rel="noopener noreferrer">↗ bakerbotts.com</a></> },
                    { n: 8, text: <>Howland, E. (2025). No more PJM data centers unless they can be reliably served: market monitor. <em>Utility Dive</em>, November 26, 2025. <a href="https://www.utilitydive.com/news/pjm-data-center-interconnection-market-monitor-ferc-complaint/806527/" target="_blank" rel="noopener noreferrer">↗ utilitydive.com</a></> },
                    { n: 9, text: <>E&amp;E News. (2025). Data center boom sparks sticker shock for PJM ratepayers. October 3, 2025. <a href="https://www.eenews.net/articles/data-center-boom-sparks-sticker-shock-for-pjm-ratepayers/" target="_blank" rel="noopener noreferrer">↗ eenews.net</a></> },
                    { n: 10, text: <>American Electric Power. (2025). PJM selects regional transmission projects to be jointly developed by AEP, Dominion Energy, FirstEnergy. February 27, 2025. <a href="https://www.aep.com/news/stories/view/10048/" target="_blank" rel="noopener noreferrer">↗ aep.com</a></> },
                    { n: 11, text: <>Joint Legislative Audit and Review Commission. (2024). Data Centers in Virginia. December 9, 2024. <a href="https://jlarc.virginia.gov/landing-2024-data-centers-in-virginia.asp" target="_blank" rel="noopener noreferrer">↗ jlarc.virginia.gov</a></> },
                  ].map(({ n, text }) => (
                    <li key={n} className={styles.bibItem}>
                      <span className={styles.bibNum}>[{n}]</span>
                      <span className={styles.bibText}>{text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Accordion>

            {/* 14 */}
            <Accordion num="14" title="What You Can Do" subtitle="How to make your voice part of the official public record">
              <p>
                The Planning Commission voted 10-0 on June 3, 2026 to recommend denial. Equus Capital Partners has since pulled the application from the July 8 Board of Supervisors agenda, postponing it indefinitely. When a new BOS hearing is scheduled, that will be the binding vote. Supervisors and written comments still matter.
              </p>
              <div className={styles.actionGrid}>
                <div className={`${styles.actionCard} ${styles.actionCardPrimary}`}>
                  <div className={styles.actionStep}>Do This Now</div>
                  <div className={styles.actionTitle}>Submit a Written Comment</div>
                  <div className={styles.actionDesc}>Written comments submitted via the county's e-Comment system become part of the official public record, even before a hearing date is set. Comments are provided to the Planning Commission and Board of Supervisors before they vote.</div>
                  <a className={styles.actionLink} href="https://www.fcva.us/government/meeting-portal" target="_blank" rel="noopener noreferrer">Submit via fcva.us Meeting Portal ↗</a>
                </div>
                <div className={`${styles.actionCard} ${styles.actionCardPrimary}`}>
                  <div className={styles.actionStep}>Do This Now</div>
                  <div className={styles.actionTitle}>Sign Up for Hearing Notifications</div>
                  <div className={styles.actionDesc}>The BOS hearing has been postponed indefinitely. Sign up for e-notifications so you know the moment a new date is posted.</div>
                  <a className={styles.actionLink} href="https://www.fcva.us/services/sign-up-for-e-notifications" target="_blank" rel="noopener noreferrer">Sign up at fcva.us ↗</a>
                </div>
                <div className={styles.actionCard}>
                  <div className={styles.actionStep}>Planning Commission: Voted 10-0, June 3, 2026</div>
                  <div className={styles.actionTitle}>Planning Commission Recommended Denial</div>
                  <div className={styles.actionDesc}>The Planning Commission voted unanimously 10-0 to recommend denial on June 3, 2026. The recommendation was advisory. The binding vote remains with the Board of Supervisors.</div>
                  <a className={styles.actionLink} href="https://www.fcva.us/departments/planning-development/boards-committees/planning-commission" target="_blank" rel="noopener noreferrer">Planning Commission info ↗</a>
                </div>
                <div className={styles.actionCard}>
                  <div className={styles.actionStep}>BOS Hearing: Postponed indefinitely</div>
                  <div className={styles.actionTitle}>Speak at the Board of Supervisors</div>
                  <div className={styles.actionDesc}>Equus pulled the application from the July 8 agenda. When a new date is set, this will be the binding vote. Six supervisors will decide; Gary Oates is recusing. The BOS meets at 107 N. Kent Street, Winchester, VA.</div>
                  <a className={styles.actionLink} href="https://www.fcva.us/departments/board-of-supervisors" target="_blank" rel="noopener noreferrer">Board of Supervisors info ↗</a>
                </div>
                <div className={styles.actionCard}>
                  <div className={styles.actionStep}>Anytime</div>
                  <div className={styles.actionTitle}>Contact Your Supervisor Directly</div>
                  <div className={styles.actionDesc}>Gary Oates (Stonewall District) is recusing due to business interests. The remaining <strong>six supervisors</strong> will cast the deciding votes. Every district matters. Phone calls and emails carry weight.</div>
                  <a className={styles.actionLink} href="https://www.fcva.us/services/contact-my-board-representative" target="_blank" rel="noopener noreferrer">Find your supervisor ↗</a>
                </div>
                <div className={styles.actionCard}>
                  <div className={styles.actionStep}>Anytime</div>
                  <div className={styles.actionTitle}>Share This Page</div>
                  <div className={styles.actionDesc}>The BOS hearing date is TBD. Share now so neighbors are ready when a new date is announced.</div>
                  <a className={styles.actionLink} href="/petition">Sign the petition while you're here ↗</a>
                </div>
              </div>
              <h3>Your Board of Supervisors</h3>
              <p>Six supervisors will vote on this rezoning. Gary Oates (Stonewall District) has announced he will recuse himself due to business interests. The remaining six votes determine the outcome. No single district controls the result.</p>
              <div className={styles.supervisorGrid}>
                {[
                  { name: 'John Jewell',     district: 'Chairman At-Large',  stonewall: false },
                  { name: 'Gary Oates',      district: 'Stonewall District, recusing (business interests)', stonewall: true },
                  { name: 'Jason Aikens',    district: 'Gainesboro District', stonewall: false },
                  { name: 'Mike Guevremont', district: 'Red Bud District',   stonewall: false },
                  { name: 'Albert Orndorff', district: 'Back Creek District', stonewall: false },
                  { name: 'Robert Wells',    district: 'Opequon District',   stonewall: false },
                  { name: 'Robert Liero',    district: 'Shawnee District',   stonewall: false },
                ].map(({ name, district, stonewall }) => (
                  <div key={name} className={styles.supervisorCard}>
                    <div className={styles.supName}>{name}</div>
                    <div className={`${styles.supDistrict}${stonewall ? ` ${styles.supStonewall}` : ''}`}>{district}</div>
                  </div>
                ))}
              </div>
              <Alert icon="📋">
                <p>
                  Not sure which district you're in? Use the{' '}
                  <a href="https://www.fcva.us/departments/board-of-supervisors/board-members-and-contact-info/find-your-magisterial-district" target="_blank" rel="noopener noreferrer">
                    county's district finder
                  </a>{' '}
                  to look up your magisterial district by address.
                </p>
              </Alert>
            </Accordion>

          </div>{/* end accordionGroup */}
        </div>{/* end content */}
      </main>
    </CiteCtx.Provider>
  )
}
