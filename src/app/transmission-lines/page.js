'use client'

import { useState, useContext, createContext, useEffect } from 'react'
import styles from '@/styles/data-center-watch.module.css'

// ── Citation registry ─────────────────────────────────────────────────────────
const CITATIONS = {
  'src-vlt-jfy':    { label: 'Valley Link: Joshua Falls–Yeat',  url: 'https://vltransmission.com/joshua-falls-to-yeat/', caption: 'Valley Link Transmission project page for the Joshua Falls to Yeat segment.', source: 'Valley Link Transmission' },
  'src-vlt-home':   { label: 'Valley Link Transmission',        url: 'https://vltransmission.com/', caption: 'Valley Link Transmission homepage and project overview.', source: 'Valley Link Transmission' },
  'src-transource':  { label: 'Transource: Valley Link',        url: 'https://www.transourceenergy.com/projects/ValleyLink/', caption: 'Transource Energy Valley Link portfolio page (consortium and mileage).', source: 'Transource Energy' },
  'src-marl-home':  { label: 'NextEra: MARL Overview',          url: 'https://www.nexteraenergytransmission.com/midatlantic-resiliency-link.html', caption: 'NextEra Energy Transmission, Mid-Atlantic Resiliency Link (MARL) overview.', source: 'NextEra Energy Transmission' },
  'src-marl-faq':   { label: 'NextEra: MARL FAQ',               url: 'https://www.nexteraenergytransmission.com/midatlantic-resiliency-link/faq.html', caption: 'NextEra Energy Transmission, MARL FAQ (route and Woodside substation).', source: 'NextEra Energy Transmission' },
  'src-marl-detail':{ label: 'NextEra: MARL Project Details',   url: 'https://www.nexteraenergytransmission.com/midatlantic-resiliency-link/project-details.html', caption: 'NextEra Energy Transmission, MARL project details and proposed route.', source: 'NextEra Energy Transmission' },
  'src-scc':        { label: 'VA SCC Docket Search',            url: 'https://www.scc.virginia.gov/', caption: 'Virginia State Corporation Commission case information and docket search. MARL is Case PUR-2026-00018.', source: 'Virginia SCC' },
  'src-loudoun':    { label: 'Loudoun County: Trans. Lines',     url: 'https://www.loudoun.gov/transmissionlines', caption: 'Loudoun County, VA, Transmission Lines in Loudoun County (project list and case status).', source: 'Loudoun County, VA' },
  'src-goochland':  { label: 'Goochland: Valley Link',          url: 'https://www.goochlandva.us/1454/Valley-Link-Transmission-Project', caption: 'Goochland County, VA, Valley Link Transmission Project (FERC intervention and SCC process).', source: 'Goochland County, VA' },
  'src-lovettsville':{ label: 'Lovettsville: Valley North',     url: 'https://www.lovettsvilleva.gov/capital-infrastructure/page/valley-north-electrical-transmission-line-project', caption: 'Town of Lovettsville, VA, Valley North Electrical Transmission Line Project (PJM rationale and mileage).', source: 'Town of Lovettsville, VA' },
  'src-wvleg':      { label: 'WV Legislature: Joint Committee', url: 'https://blog.wvlegislature.gov/interim-report-2/2026/01/13/interim-report-joint-committee-on-energy-and-public-works/', caption: 'West Virginia Legislature, Joint Committee on Energy and Public Works interim report, Jan. 13, 2026 (Valley North mileage by state).', source: 'WV Legislature, Jan. 13, 2026' },
  'src-ws-marl':    { label: 'Winchester Star: MARL Route',     url: 'https://www.winchesterstar.com/winchester_star/proposed-route-announced-for-transmission-line-running-through-frederick-county/article_d8bd76b1-3292-5acc-a96b-6eed87acc60a.html', caption: 'The Winchester Star, "Proposed route announced for transmission line running through Frederick County," Sept. 2025.', source: 'Winchester Star, Sept. 2025' },
  'src-ws-vn':      { label: 'Winchester Star: Valley North',   url: 'https://www.winchesterstar.com/winchester_star/proposed-transmission-line-would-run-through-frederick-clarke/article_f0001234-42a9-5e61-9d34-52f2ca8fe38b.html', caption: 'The Winchester Star, "Proposed transmission line would run through Frederick, Clarke," 2026.', source: 'Winchester Star, 2026' },
  'src-nvd-marl':   { label: 'NV Daily: MARL SCC Filing',       url: 'https://www.nvdaily.com/nvdaily/application-filed-in-virginia-for-marl-transmission-line/article_d800080a-73e7-5aa9-8bff-47b00c63246c.html', caption: 'Northern Virginia Daily, "Application filed in Virginia for MARL transmission line," March 2026.', source: 'NV Daily, March 2026' },
  'src-nvd-vn':     { label: 'NV Daily: Valley North',          url: 'https://www.nvdaily.com/nvdaily/proposed-transmission-line-would-run-through-frederick-clarke/article_c4084941-8a82-581b-9da2-8d8b66001967.html', caption: 'Northern Virginia Daily, "Proposed transmission line would run through Frederick, Clarke" (Valley North study area and open-house dates).', source: 'NV Daily, 2026' },
  'src-cardinal':   { label: 'Cardinal News: Valley Link',       url: 'https://cardinalnews.org/2026/03/26/valley-link-power-transmission-proposal-meets-a-growing-organized-resistance/', caption: 'Cardinal News, "Valley Link power transmission proposal meets a growing, organized resistance," March 2026.', source: 'Cardinal News, March 2026' },
  'src-vamercury1': { label: 'VA Mercury: Reworked Routes',      url: 'https://virginiamercury.com/briefs/valley-link-unveils-reworked-routes-for-high-voltage-transmission-line/', caption: 'Virginia Mercury, "Valley Link unveils reworked routes for high-voltage transmission line," May 2026.', source: 'Virginia Mercury, May 2026' },
  'src-vamercury2': { label: 'VA Mercury: Rural Resistance',     url: 'https://virginiamercury.com/2026/05/27/residents-wrangle-over-transmission-line-proposal-for-rural-virginia/', caption: 'Virginia Mercury, "Residents wrangle over transmission line proposal for rural Virginia," May 2026.', source: 'Virginia Mercury, May 2026' },
  'src-cville':     { label: 'Cville Tomorrow: Valley Link',     url: 'https://www.cvilletomorrow.org/valley-link-seeks-community-input-on-proposed-transmission-line-route-through-central-virginia/', caption: 'Charlottesville Tomorrow, "Valley Link seeks community input on proposed transmission line route," March 2026.', source: 'Cville Tomorrow, March 2026' },
  'src-pec':        { label: 'PEC: Electric Super-Highway',      url: 'https://www.pecva.org/work/energy-work/transmission/an-electric-super-highway-through-the-piedmont/', caption: 'Piedmont Environmental Council, "An Electric Super-Highway Through the Piedmont" (765 kV scale, PJM RTEP cost growth, and data-center demand).', source: 'Piedmont Environmental Council' },
  'src-stopmarlva': { label: 'Stop MARL Virginia: FAQs',         url: 'https://stopmarlvirginia.com/faqs', caption: 'Stop MARL Virginia, FAQs (MARL and Gore-Doubs as one line, Woodside in Clear Brook, and corridor stacking).', source: 'Stop MARL Virginia' },
  'src-stopmarlhome':{ label: 'Stop MARL Virginia',             url: 'https://stopmarlvirginia.com/', caption: 'Stop MARL Virginia, home and Maryland pages (Gore-Doubs-Goose Creek structures, the Ridgeway Estates injunction, and SCC pro-se intervention).', source: 'Stop MARL Virginia' },
}

// ── Context ───────────────────────────────────────────────────────────────────
const CiteCtx = createContext(() => {})

// ── Sub-components ────────────────────────────────────────────────────────────
function Cite({ id }) {
  const onCite = useContext(CiteCtx)
  const c = CITATIONS[id]
  if (!c) return null
  return (
    <button
      className={`${styles.cite} ${styles.citeExt}`}
      onClick={() => onCite(id)}
    >
      {c.label}
    </button>
  )
}

function Accordion({ num, title, subtitle, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
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
export default function TransmissionLinesPage() {
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
              The Transmission Lines Coming<br />
              Through Frederick County
            </h1>
            <p className={styles.heroSub}>
              Three separate high-voltage transmission projects are being routed through Frederick County.
              They are owned by different companies and carry different names, but they share one purpose:
              moving electricity from West Virginia power plants to the data centers of Loudoun County's
              "Data Center Alley." Most of the power does not stay here.
            </p>
            <div className={styles.heroMeta}>
              <div className={styles.metaItem}><strong>Projects</strong>Valley North · MARL · Gore-Doubs-Goose Creek</div>
              <div className={styles.metaItem}><strong>Voltages</strong>765 kV + 500 kV + 500 kV</div>
              <div className={styles.metaItem}><strong>Active SCC Case</strong>PUR-2026-00018 (MARL)</div>
              <div className={styles.metaItem}><strong>Open House</strong>June 29, James Wood High School</div>
              <div className={styles.metaItem}><strong>Last verified</strong>June 26, 2026</div>
            </div>
          </div>
        </section>

        {/* ── Content ── */}
        <div className={styles.content}>

          {/* Key facts */}
          <div className={styles.keyFacts}>
            <div className={styles.factItem}>
              <div className={styles.factNumber}>3</div>
              <div className={styles.factLabel}>Separate Projects</div>
            </div>
            <div className={styles.factItem}>
              <div className={styles.factNumber}>765<span>kV</span></div>
              <div className={styles.factLabel}>Highest-voltage AC line in the U.S.</div>
            </div>
            <div className={styles.factItem}>
              <div className={styles.factNumber}>260<span>mi</span></div>
              <div className={styles.factLabel}>Valley North total length</div>
            </div>
            <div className={styles.factItem}>
              <div className={styles.factNumber}>200<span>ft</span></div>
              <div className={styles.factLabel}>New cleared easement width</div>
            </div>
            <div className={styles.factItem}>
              <div className={styles.factNumber}>72<span>ac</span></div>
              <div className={styles.factLabel}>Woodside Substation site (Clear Brook)</div>
            </div>
            <div className={styles.factItem}>
              <div className={styles.factNumber}>$12<span>B</span></div>
              <div className={styles.factLabel}>PJM regional transmission plan, 2025</div>
            </div>
          </div>

          {/* Lede */}
          <div className={styles.lede}>
            <p>
              It's important for residents to understand that most of the power these lines would carry
              does not stay in Frederick County. It passes through on the way east to Loudoun. Frederick
              County absorbs the cleared land, the new easements, and the lost views, for power that
              serves another county's tax base.
            </p>
          </div>

          {/* ── Accordion sections ── */}
          <div className={styles.accordionGroup}>

            {/* 01 */}
            <Accordion num="01" title="At a Glance: The Three Projects" subtitle="Side-by-side comparison of owner, voltage, route, and status" defaultOpen>
              <div className={styles.compTableWrap}>
                <table className={styles.compTable}>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Valley North</th>
                      <th>MARL</th>
                      <th>Gore-Doubs-Goose Creek</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={styles.rowLabel}>Type</td>
                      <td><strong>765 kV</strong> (highest-voltage AC line in the U.S.)</td>
                      <td>500 kV</td>
                      <td>500 kV</td>
                    </tr>
                    <tr>
                      <td className={styles.rowLabel}>Owner</td>
                      <td>Valley Link Transmission Co. LLC (Dominion Energy, FirstEnergy Transmission, Transource/AEP)</td>
                      <td>NextEra Energy Transmission LLC</td>
                      <td>FirstEnergy / Potomac Edison</td>
                    </tr>
                    <tr>
                      <td className={styles.rowLabel}>Length</td>
                      <td>~260 miles total (~31 in Virginia)</td>
                      <td>~107.5 miles</td>
                      <td>Continuation segment (Gore to Loudoun)</td>
                    </tr>
                    <tr>
                      <td className={styles.rowLabel}>Route</td>
                      <td>Amos substation, Putnam County WV → Rocky Point substation, Frederick County MD</td>
                      <td>Dunkard Township, PA → Gore substation, Frederick County VA</td>
                      <td>Gore substation → Woodside substation → Loudoun (Goose Creek)</td>
                    </tr>
                    <tr>
                      <td className={styles.rowLabel}>Frederick County impact</td>
                      <td>New 200-ft easement through Frederick and Clarke; route not yet chosen</td>
                      <td>New easements north of existing lines; ends at Gore</td>
                      <td>Rebuilds and expands corridor across Frederick into Clarke</td>
                    </tr>
                    <tr>
                      <td className={styles.rowLabel}>Key new substation</td>
                      <td>Rocky Point (MD); Welton Springs (pass-through)</td>
                      <td>Woodside, Clear Brook (72 acres)</td>
                      <td>Uses same Woodside substation</td>
                    </tr>
                    <tr>
                      <td className={styles.rowLabel}>VA SCC case</td>
                      <td><span className={styles.stageTag}>Not yet filed (June 2026)</span></td>
                      <td><span className={styles.sccTag}>PUR-2026-00018</span> (filed March 2026)</td>
                      <td>Application filed at VA SCC</td>
                    </tr>
                    <tr>
                      <td className={styles.rowLabel}>Stage</td>
                      <td>Study area only; open houses underway</td>
                      <td>Route announced; SCC review</td>
                      <td>SCC review</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Alert icon="ℹ">
                <p>
                  <strong>MARL and Gore-Doubs-Goose Creek are best understood as one line in two halves.</strong>{' '}
                  It runs from the 502 Junction in Pennsylvania to the Goose Creek substation in Loudoun County.
                  NextEra owns the northern half (MARL) and FirstEnergy owns the southern half (Gore-Doubs-Goose Creek).
                  The two halves meet at the Gore substation in Frederick County.
                </p>
              </Alert>
            </Accordion>

            {/* 02 */}
            <Accordion num="02" title="Project 1: Valley North (765 kV)" subtitle="Owner: Valley Link Transmission Co. LLC · Study area stage, no SCC case filed yet">
              <p>
                <strong>Owner:</strong> Valley Link Transmission Company LLC, a consortium of Dominion Energy,
                FirstEnergy Transmission, and Transource Energy (an American Electric Power entity).
                Company president: Isaac Rhoades. <Cite id="src-vlt-home" /> <Cite id="src-transource" />
              </p>
              <h3>What it is</h3>
              <p>
                A new 765-kilovolt transmission line about 260 miles long. It is the highest-voltage AC
                line used in the United States and can carry roughly three times the power of a standard
                500 kV line. It is proposed to run from the existing Amos substation in Putnam County,
                West Virginia, east through Frederick and Clarke counties in Virginia, and end at the
                proposed Rocky Point substation in Frederick County, Maryland. About 31 of those miles
                fall in Virginia. <Cite id="src-wvleg" /> <Cite id="src-transource" />
              </p>
              <h3>Where it stands</h3>
              <p>
                Early. As of mid-2026, Valley Link has released only a study area (a band within which
                the line could go) rather than a chosen route. Both Frederick and Clarke counties sit
                inside that study area. The route will be selected after rounds of community "open houses"
                and then submitted to the Virginia State Corporation Commission (SCC) for approval. No
                SCC case has been filed yet. <Cite id="src-nvd-vn" /> <Cite id="src-cardinal" />
              </p>
              <h3>Open houses</h3>
              <ul className={styles.checkList}>
                <li><strong>Frederick County:</strong> June 29, James Wood High School, 4:00–7:30 p.m.</li>
                <li><strong>Clarke County:</strong> July 7, Clarke County Fairgrounds Ruritan Building (Berryville), 4:00–7:30 p.m.</li>
                <li>A second round will follow later in 2026 to refine the route.</li>
              </ul>
              <h3>What it requires</h3>
              <p>
                A new 200-foot-wide cleared easement along its full length. Trees and any structures
                inside that corridor are removed for the towers and conductors. <Cite id="src-cville" />
                <Cite id="src-vamercury1" />
              </p>
              <Callout label="Historical context">
                <p>
                  The proposal closely resembles the PATH (Potomac-Appalachian Transmission Highline)
                  project, a similar 765 kV line proposed for this region and abandoned in 2012 after
                  sustained public opposition.
                </p>
              </Callout>
            </Accordion>

            {/* 03 */}
            <Accordion num="03" title="Project 2: MARL / Mid-Atlantic Resiliency Link (500 kV)" subtitle="Owner: NextEra Energy Transmission LLC · SCC Case PUR-2026-00018">
              <p>
                <strong>Owner:</strong> NextEra Energy Transmission LLC. <Cite id="src-marl-home" />
              </p>
              <h3>What it is</h3>
              <p>
                A new 500-kilovolt line about 107.5 miles long, running from a substation in Dunkard
                Township, Pennsylvania (just over the West Virginia border near Morgantown), south through
                West Virginia and Maryland, and ending at the Gore substation in Frederick County,
                Virginia. NextEra describes it as bi-directional. <Cite id="src-marl-detail" />
              </p>
              <h3>The Woodside substation</h3>
              <p>
                MARL is paired with a new 500/138 kV Woodside substation to be built in Clear Brook,
                in northeastern Frederick County. The site is roughly 72 acres, about a half-mile west
                of the existing Stonewall substation. Frederick County officials approved the Woodside
                substation in fall 2025. NextEra included Woodside in its SCC application "for context,"
                but says the SCC is not the body that approves the substation; that approval is a local
                government decision. <Cite id="src-marl-faq" /> <Cite id="src-nvd-marl" />
              </p>
              <Alert>
                <p>
                  <strong>A contested approval:</strong> The Frederick County community of Ridgeway Estates
                  filed for an injunction to block the Woodside substation, arguing their subdivision's
                  HOA covenants prohibit that level of development and were improperly waived to enable
                  NextEra's land purchase. The case is active. <Cite id="src-stopmarlhome" />
                </p>
              </Alert>
              <h3>Where it stands</h3>
              <p>
                NextEra announced its proposed route in September 2025. The path is not entirely along
                existing transmission lines; portions run north of them, which requires buying new
                easements from landowners. NextEra filed its application for a Certificate of Public
                Convenience and Necessity with the Virginia SCC in March 2026. <Cite id="src-ws-marl" />
                <Cite id="src-nvd-marl" />
              </p>
              <div className={styles.statRow}>
                <div className={styles.statBlock}>
                  <div className={styles.statNum}><span className={styles.sccTag} style={{fontSize: 14, fontFamily: 'monospace'}}>PUR-2026-00018</span></div>
                  <div className={styles.statDesc} style={{marginTop: 6}}>Active VA SCC case number for MARL. File comments or intervene at scc.virginia.gov.</div>
                </div>
                <div className={styles.statBlock}>
                  <div className={styles.statNum}>72<span> ac</span></div>
                  <div className={styles.statDesc}>Woodside substation site size in Clear Brook, Frederick County</div>
                </div>
                <div className={styles.statBlock}>
                  <div className={styles.statNum}>107.5<span>mi</span></div>
                  <div className={styles.statDesc}>Total length of MARL line from Pennsylvania to Gore substation</div>
                </div>
              </div>
            </Accordion>

            {/* 04 */}
            <Accordion num="04" title="Project 3: Gore-Doubs-Goose Creek (500 kV)" subtitle="Owner: FirstEnergy / Potomac Edison · SCC application filed">
              <p>
                <strong>Owner:</strong> FirstEnergy, through its Potomac Edison subsidiary.
              </p>
              <h3>What it is</h3>
              <p>
                The southern continuation of the line MARL begins. It picks up where MARL ends at the
                Gore substation, runs through the new Woodside substation, crosses Frederick County into
                Clarke County, and then runs through northwestern Loudoun County to the Potomac. It
                delivers power to the Goose Creek substation in Loudoun's Data Center Alley.
                <Cite id="src-stopmarlva" />
              </p>
              <h3>What it requires</h3>
              <p>
                This segment largely rebuilds an existing 138 kV corridor rather than cutting an all-new
                route. It replaces existing structures with taller poles (around 185 feet) that carry
                a new 500 kV line, with the existing 138 kV line "underbuilt" beneath it. In places it
                also requires expanding the existing easement and taking new 200-foot easements to route
                around obstacles. <Cite id="src-stopmarlhome" />
              </p>
              <h3>Where it stands</h3>
              <p>
                FirstEnergy held an open house in August 2025 and has filed its application with the
                Virginia SCC. Because it depends on the Woodside substation and on MARL delivering
                power to Gore, it is tied to the other two projects.
              </p>
              <Callout label="How the two halves connect">
                <p>
                  MARL (NextEra) and Gore-Doubs-Goose Creek (FirstEnergy) are two separately-owned
                  segments of the same physical route. Power flows from Pennsylvania through MARL to
                  the Gore substation in Frederick County, then continues south and east through the
                  Gore-Doubs-Goose Creek segment to Loudoun's Data Center Alley. The Woodside
                  substation in Clear Brook sits in the middle of this corridor.
                </p>
              </Callout>
            </Accordion>

            {/* 05 */}
            <Accordion num="05" title="The Cumulative Picture" subtitle="Three projects reviewed separately, stacked into the same corridor on the ground">
              <p>
                Each project is reviewed separately by the SCC, but on the ground they stack into
                the same corridor. Through the Gore, Clear Brook, and Clarke County area, an existing
                500 kV line and an existing 138 kV line would be joined by two new 500 kV lines
                (MARL and Gore-Doubs-Goose Creek) and one new 765 kV line (Valley North).
                <Cite id="src-stopmarlva" /> <Cite id="src-pec" />
              </p>
              <div className={styles.statRow}>
                <div className={styles.statBlock}>
                  <div className={styles.statNum}>550–650<span>ft</span></div>
                  <div className={styles.statDesc}>Estimated corridor width in places, per opposition groups, if all three projects are built</div>
                </div>
                <div className={styles.statBlock}>
                  <div className={styles.statNum}>5</div>
                  <div className={styles.statDesc}>Transmission lines in the same corridor (2 existing + 3 new) if all projects proceed</div>
                </div>
                <div className={styles.statBlock}>
                  <div className={styles.statNum}>3</div>
                  <div className={styles.statDesc}>New substations added: Woodside, Welton Springs, and Rocky Point</div>
                </div>
              </div>
              <Alert>
                <p>
                  <strong>A transmission corridor does not stop at the wires.</strong> A NextEra
                  representative compared the substations along these lines to interchanges along a
                  highway. Interchanges attract development. A high-voltage corridor with substations
                  tends to draw new development pressure onto nearby land, including more substations
                  and the data centers these lines are built to serve.
                </p>
              </Alert>
            </Accordion>

            {/* 06 */}
            <Accordion num="06" title="The Developers' Case and the Community Response" subtitle="What the companies claim, and what those claims leave out">
              <h3>The developers' claims</h3>
              <div className={styles.claimsGrid}>
                <div className={styles.claimCard}>
                  <div className={styles.claimLabel}>Claim</div>
                  <h3>Grid reliability</h3>
                  <p>
                    PJM, the regional grid operator for 13 states, selected all three projects to meet
                    rising electricity demand and prevent future reliability problems. Virginia's
                    projected annual electricity demand growth rose from about 1.4% in 2020 to roughly
                    6.5% in 2025. <Cite id="src-pec" />
                  </p>
                  <div className={styles.rebuttalLabel}>The fuller picture</div>
                  <p>
                    The demand driving that growth is data-center demand, concentrated in Loudoun.
                    Data centers already consume more than a quarter of Virginia's electricity load.
                    These lines are sized for and routed toward Loudoun's Data Center Alley. "Grid
                    reliability" means reliability for data centers, paid for by all ratepayers.
                    <Cite id="src-pec" />
                  </p>
                </div>
                <div className={styles.claimCard}>
                  <div className={styles.claimLabel}>Claim</div>
                  <h3>Regional and local benefit</h3>
                  <p>
                    NextEra has argued the added capacity could give Frederick County access to
                    lower-cost electricity and help attract industrial and advanced-manufacturing
                    investment. <Cite id="src-marl-faq" />
                  </p>
                  <div className={styles.rebuttalLabel}>The fuller picture</div>
                  <p>
                    The promised economic benefit is uncertain. A wider grid corridor in Frederick
                    could attract the same data-center development the county is fighting elsewhere.
                    The farmland clearing and the loss of rural views are certain, and would happen
                    regardless of whether the promised investment ever arrives.
                  </p>
                </div>
              </div>
              <h3 style={{ marginTop: 20 }}>What these projects actually cost</h3>
              <ul className={styles.missingList}>
                <li>
                  PJM's regional transmission plan grew from roughly $920 million in 2021 to nearly
                  $12 billion in 2025, with billions of that tied to these projects. Those costs are
                  spread across ratepayers, including Frederick households, to serve private
                  data-center load. <Cite id="src-pec" />
                </li>
                <li>
                  All projects rely on easements. Where landowners will not sell voluntarily, utilities
                  can pursue eminent domain. Across the broader Valley Link portfolio alone, opposition
                  groups estimate thousands of acres of private property would be encumbered.
                  <Cite id="src-cardinal" /> <Cite id="src-cville" />
                </li>
                <li>
                  Frederick County absorbs the cleared land and lost views for power that passes through
                  to another county's tax base. <Cite id="src-loudoun" />
                </li>
              </ul>
            </Accordion>

            {/* 07 */}
            <Accordion num="07" title="How These Decisions Get Made, and Where Residents Have Leverage" subtitle="SCC, local government, and the Board of Supervisors">
              <h3>Who decides the lines</h3>
              <p>
                The Virginia State Corporation Commission (SCC) decides whether each transmission line
                is built and what route it takes. The Frederick County Board of Supervisors does not
                have that authority. The SCC process includes formal public comment and a public hearing.
                Individuals can intervene pro se (representing themselves, with no lawyer required) by
                creating an e-Filing account with the SCC and filing in the relevant docket.
                <Cite id="src-scc" /> <Cite id="src-stopmarlhome" />
              </p>
              <h3>Who decides the substations</h3>
              <p>
                Local government. Substations like Woodside require local land-use approval; this is
                where county officials have the most direct say. The Woodside approval is already being
                challenged in court by Ridgeway Estates. <Cite id="src-stopmarlhome" />
              </p>
              <h3>What the Board of Supervisors can still do</h3>
              <p>Even though it cannot veto a line, a Board can:</p>
              <ul className={styles.checkList}>
                <li>
                  Pass a resolution of opposition. Several affected counties elsewhere have already
                  done this for the southern Valley Link line. <Cite id="src-goochland" />
                </li>
                <li>
                  Coordinate with neighboring counties, including Clarke and others along the routes,
                  to carry more weight before the SCC and FERC. <Cite id="src-cardinal" />
                </li>
                <li>
                  Review and contest substation and interconnection approvals that do require local sign-off.
                </li>
                <li>
                  Engage the FERC docket governing PJM's planning. Other affected counties have filed
                  joint motions to intervene. <Cite id="src-goochland" />
                </li>
              </ul>
            </Accordion>

            {/* 08 */}
            <Accordion num="08" title="What You Can Do" subtitle="Open houses, SCC comments, deed review, and your supervisors">
              <div className={styles.actionGrid}>
                <div className={`${styles.actionCard} ${styles.actionCardPrimary}`}>
                  <div className={styles.actionStep}>Upcoming: June 29</div>
                  <div className={styles.actionTitle}>Attend the Frederick County Open House</div>
                  <div className={styles.actionDesc}>
                    James Wood High School, 4:00–7:30 p.m. These are where the companies gather the
                    input that shapes the Valley North route. Your presence and questions are on the
                    record.
                  </div>
                </div>
                <div className={`${styles.actionCard} ${styles.actionCardPrimary}`}>
                  <div className={styles.actionStep}>Upcoming: July 7</div>
                  <div className={styles.actionTitle}>Attend the Clarke County Open House</div>
                  <div className={styles.actionDesc}>
                    Clarke County Fairgrounds Ruritan Building (Berryville), 4:00–7:30 p.m. If Valley
                    North affects Clarke, it affects everything that connects to Frederick.
                  </div>
                </div>
                <div className={styles.actionCard}>
                  <div className={styles.actionStep}>Active now</div>
                  <div className={styles.actionTitle}>File Public Comment with the SCC</div>
                  <div className={styles.actionDesc}>
                    File on the active cases, most directly MARL (PUR-2026-00018) and Gore-Doubs-Goose
                    Creek. Create an SCC e-Filing account early; the account-setup email expires quickly.
                  </div>
                  <a className={styles.actionLink} href="https://www.scc.virginia.gov/" target="_blank" rel="noopener noreferrer">VA SCC docket search ↗</a>
                </div>
                <div className={styles.actionCard}>
                  <div className={styles.actionStep}>Anytime</div>
                  <div className={styles.actionTitle}>Check Your Deed</div>
                  <div className={styles.actionDesc}>
                    If you have an existing utility easement, read the terms. Utilities do not always
                    have unrestricted rights to add new lines. Consider consulting an attorney.
                  </div>
                </div>
                <div className={styles.actionCard}>
                  <div className={styles.actionStep}>Active: in court</div>
                  <div className={styles.actionTitle}>Follow the Woodside Substation Case</div>
                  <div className={styles.actionDesc}>
                    It is the most direct local decision point and is currently contested by Ridgeway
                    Estates. The outcome affects both MARL and Gore-Doubs-Goose Creek.
                  </div>
                  <a className={styles.actionLink} href="https://stopmarlvirginia.com/" target="_blank" rel="noopener noreferrer">Stop MARL Virginia ↗</a>
                </div>
                <div className={styles.actionCard}>
                  <div className={styles.actionStep}>Anytime</div>
                  <div className={styles.actionTitle}>Tell Your Supervisors</div>
                  <div className={styles.actionDesc}>
                    Ask for a resolution of opposition and inter-county coordination with Clarke and
                    other affected counties. Even without veto power over lines, the Board can make
                    the county's position part of the SCC and FERC record.
                  </div>
                  <a className={styles.actionLink} href="https://www.fcva.us/services/contact-my-board-representative" target="_blank" rel="noopener noreferrer">Find your supervisor ↗</a>
                </div>
              </div>
            </Accordion>

            {/* 09 */}
            <Accordion num="09" title="Status and How to Verify" subtitle="Routes, filings, and meeting dates change; always verify before acting">
              <p>
                Routes, filings, and meeting dates all change. Before relying on any specific fact here,
                verify against the primary sources below.
              </p>
              <ul className={styles.checkList}>
                <li>
                  <strong>VA SCC case lookup:</strong>{' '}
                  <a href="https://www.scc.virginia.gov/" target="_blank" rel="noopener noreferrer">scc.virginia.gov</a>{' '}
                  → case information / docket search. Look up PUR-2026-00018 for MARL.
                </li>
                <li>
                  <strong>Valley North:</strong>{' '}
                  <a href="https://vltransmission.com/valley-north" target="_blank" rel="noopener noreferrer">vltransmission.com/valley-north</a>
                </li>
                <li>
                  <strong>MARL:</strong>{' '}
                  <a href="https://www.nexteraenergytransmission.com/midatlantic-resiliency-link" target="_blank" rel="noopener noreferrer">nexteraenergytransmission.com/midatlantic-resiliency-link</a>
                </li>
                <li>
                  <strong>Gore-Doubs-Goose Creek:</strong> FirstEnergy / Potomac Edison project page (search FirstEnergy Gore-Doubs)
                </li>
                <li>
                  <strong>Woodside substation &amp; Ridgeway Estates case:</strong>{' '}
                  <a href="https://stopmarlvirginia.com/" target="_blank" rel="noopener noreferrer">stopmarlvirginia.com</a>
                </li>
                <li>
                  <strong>Frederick County BOS and meeting portal:</strong>{' '}
                  <a href="https://www.fcva.us/government/meeting-portal" target="_blank" rel="noopener noreferrer">fcva.us/government/meeting-portal</a>
                </li>
              </ul>
              <Alert icon="📋">
                <p>
                  <strong>Last verified: June 26, 2026.</strong> This page summarizes the situation as of
                  that date. SCC proceedings move on their own schedule. Check the docket directly before
                  taking any action based on case status or deadlines.
                </p>
              </Alert>

              {/* Citations */}
              <div className={styles.bibliography}>
                <div className={styles.bibliographyTitle}>Sources</div>
                <ol className={styles.bibList}>
                  {[
                    { id: 'src-vlt-jfy',     text: <>Valley Link Transmission, Joshua Falls to Yeat project page. <a href="https://vltransmission.com/joshua-falls-to-yeat/" target="_blank" rel="noopener noreferrer">↗ vltransmission.com</a></> },
                    { id: 'src-vlt-home',    text: <>Valley Link Transmission, homepage and project overview. <a href="https://vltransmission.com/" target="_blank" rel="noopener noreferrer">↗ vltransmission.com</a></> },
                    { id: 'src-transource',  text: <>Transource Energy, Valley Link portfolio. <a href="https://www.transourceenergy.com/projects/ValleyLink/" target="_blank" rel="noopener noreferrer">↗ transourceenergy.com</a></> },
                    { id: 'src-marl-home',   text: <>NextEra Energy Transmission, Mid-Atlantic Resiliency Link overview. <a href="https://www.nexteraenergytransmission.com/midatlantic-resiliency-link.html" target="_blank" rel="noopener noreferrer">↗ nexteraenergytransmission.com</a></> },
                    { id: 'src-marl-faq',    text: <>NextEra Energy Transmission, MARL FAQ. <a href="https://www.nexteraenergytransmission.com/midatlantic-resiliency-link/faq.html" target="_blank" rel="noopener noreferrer">↗ nexteraenergytransmission.com</a></> },
                    { id: 'src-marl-detail', text: <>NextEra Energy Transmission, MARL project details. <a href="https://www.nexteraenergytransmission.com/midatlantic-resiliency-link/project-details.html" target="_blank" rel="noopener noreferrer">↗ nexteraenergytransmission.com</a></> },
                    { id: 'src-scc',         text: <>Virginia State Corporation Commission, docket search. MARL: Case PUR-2026-00018. <a href="https://www.scc.virginia.gov/" target="_blank" rel="noopener noreferrer">↗ scc.virginia.gov</a></> },
                    { id: 'src-loudoun',     text: <>Loudoun County, VA, Transmission Lines in Loudoun County. <a href="https://www.loudoun.gov/transmissionlines" target="_blank" rel="noopener noreferrer">↗ loudoun.gov</a></> },
                    { id: 'src-goochland',   text: <>Goochland County, VA, Valley Link Transmission Project. <a href="https://www.goochlandva.us/1454/Valley-Link-Transmission-Project" target="_blank" rel="noopener noreferrer">↗ goochlandva.us</a></> },
                    { id: 'src-lovettsville',text: <>Town of Lovettsville, VA, Valley North Electrical Transmission Line Project. <a href="https://www.lovettsvilleva.gov/capital-infrastructure/page/valley-north-electrical-transmission-line-project" target="_blank" rel="noopener noreferrer">↗ lovettsvilleva.gov</a></> },
                    { id: 'src-wvleg',       text: <>West Virginia Legislature, Joint Committee on Energy and Public Works interim report, Jan. 13, 2026. <a href="https://blog.wvlegislature.gov/interim-report-2/2026/01/13/interim-report-joint-committee-on-energy-and-public-works/" target="_blank" rel="noopener noreferrer">↗ wvlegislature.gov</a></> },
                    { id: 'src-ws-marl',     text: <><em>Winchester Star</em>, "Proposed route announced for transmission line running through Frederick County," Sept. 2025. <a href="https://www.winchesterstar.com/winchester_star/proposed-route-announced-for-transmission-line-running-through-frederick-county/article_d8bd76b1-3292-5acc-a96b-6eed87acc60a.html" target="_blank" rel="noopener noreferrer">↗ winchesterstar.com</a></> },
                    { id: 'src-ws-vn',       text: <><em>Winchester Star</em>, "Proposed transmission line would run through Frederick, Clarke," 2026. <a href="https://www.winchesterstar.com/winchester_star/proposed-transmission-line-would-run-through-frederick-clarke/article_f0001234-42a9-5e61-9d34-52f2ca8fe38b.html" target="_blank" rel="noopener noreferrer">↗ winchesterstar.com</a></> },
                    { id: 'src-nvd-marl',    text: <><em>Northern Virginia Daily</em>, "Application filed in Virginia for MARL transmission line," March 2026. <a href="https://www.nvdaily.com/nvdaily/application-filed-in-virginia-for-marl-transmission-line/article_d800080a-73e7-5aa9-8bff-47b00c63246c.html" target="_blank" rel="noopener noreferrer">↗ nvdaily.com</a></> },
                    { id: 'src-nvd-vn',      text: <><em>Northern Virginia Daily</em>, "Proposed transmission line would run through Frederick, Clarke." <a href="https://www.nvdaily.com/nvdaily/proposed-transmission-line-would-run-through-frederick-clarke/article_c4084941-8a82-581b-9da2-8d8b66001967.html" target="_blank" rel="noopener noreferrer">↗ nvdaily.com</a></> },
                    { id: 'src-cardinal',    text: <><em>Cardinal News</em>, "Valley Link power transmission proposal meets a growing, organized resistance," March 2026. <a href="https://cardinalnews.org/2026/03/26/valley-link-power-transmission-proposal-meets-a-growing-organized-resistance/" target="_blank" rel="noopener noreferrer">↗ cardinalnews.org</a></> },
                    { id: 'src-vamercury1',  text: <><em>Virginia Mercury</em>, "Valley Link unveils reworked routes for high-voltage transmission line," May 2026. <a href="https://virginiamercury.com/briefs/valley-link-unveils-reworked-routes-for-high-voltage-transmission-line/" target="_blank" rel="noopener noreferrer">↗ virginiamercury.com</a></> },
                    { id: 'src-vamercury2',  text: <><em>Virginia Mercury</em>, "Residents wrangle over transmission line proposal for rural Virginia," May 2026. <a href="https://virginiamercury.com/2026/05/27/residents-wrangle-over-transmission-line-proposal-for-rural-virginia/" target="_blank" rel="noopener noreferrer">↗ virginiamercury.com</a></> },
                    { id: 'src-cville',      text: <>Charlottesville Tomorrow, "Valley Link seeks community input on proposed transmission line route through central Virginia," March 2026. <a href="https://www.cvilletomorrow.org/valley-link-seeks-community-input-on-proposed-transmission-line-route-through-central-virginia/" target="_blank" rel="noopener noreferrer">↗ cvilletomorrow.org</a></> },
                    { id: 'src-pec',         text: <>Piedmont Environmental Council, "An Electric Super-Highway Through the Piedmont." <a href="https://www.pecva.org/work/energy-work/transmission/an-electric-super-highway-through-the-piedmont/" target="_blank" rel="noopener noreferrer">↗ pecva.org</a></> },
                    { id: 'src-stopmarlva',  text: <>Stop MARL Virginia, FAQs. <a href="https://stopmarlvirginia.com/faqs" target="_blank" rel="noopener noreferrer">↗ stopmarlvirginia.com</a></> },
                    { id: 'src-stopmarlhome',text: <>Stop MARL Virginia, home and Maryland pages. <a href="https://stopmarlvirginia.com/" target="_blank" rel="noopener noreferrer">↗ stopmarlvirginia.com</a></> },
                  ].map(({ id, text }, i) => (
                    <li key={id} className={styles.bibItem}>
                      <span className={styles.bibNum}>[{i + 1}]</span>
                      <span className={styles.bibText}>{text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Accordion>

          </div>{/* end accordionGroup */}
        </div>{/* end content */}
      </main>
    </CiteCtx.Provider>
  )
}
