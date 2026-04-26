'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from '@/styles/home.module.css'

const supervisors = [
  { district: "At-Large (Chairman)", keywords: ["at-large", "chairman", "at large"], name: "John Jewell", email: "john.jewell@fcva.us", phone: "540-669-8784" },
  { district: "Back Creek", keywords: ["back creek", "yellow spring", "great cacapon", "siler", "largent"], name: "Al Orndorff", email: "al.orndorff@fcva.us", phone: "540-336-9410" },
  { district: "Gainesboro", keywords: ["gainesboro", "gore", "capon", "star tannery", "cross junction", "hayfield"], name: "Jason C. Aikens", email: "jason.aikens@fcva.us", phone: "540-336-6234" },
  { district: "Opequon", keywords: ["opequon", "stephens city", "clearbrook", "white hall", "brucetown"], name: "Robert W. Wells", email: "rwells@fcva.us", phone: "540-669-8782" },
  { district: "Red Bud", keywords: ["red bud", "kernstown", "gore rd", "winchester"], name: "Mike Guevremont", email: "mike.guevremont@fcva.us", phone: "540-336-8100" },
  { district: "Shawnee", keywords: ["shawnee", "middletown", "reliance", "cedar creek"], name: "Robert Liero", email: "robert.liero@fcva.us", phone: "540-669-8783" },
  { district: "Stonewall", keywords: ["stonewall", "clear brook", "clearbrook", "bunker hill", "martinsburg pk"], name: "Gary Oates", email: "gary.oates@fcva.us", phone: null },
]

// ── Data ─────────────────────────────────────────────────────────────────────

const statGroups = [
  {
    key: 'power',
    label: 'Power',
    summary: 'Your electric bills, your co-op, and the grid',
    stats: [
      { tagLabel: 'Power · Your Co-op', num: '17 GW', numClass: 'forest', label: <>Data center demand REC projects by 2040, <b>up from near zero in 2023.</b> That's 18× REC's current peak load. REC is a member-owned co-op and serves Frederick County directly.</>, sources: [{ href: 'https://www.latitudemedia.com/news/to-meet-massive-data-center-load-one-virginia-electric-co-op-is-proposing-an-entirely-new-business-model/', label: 'Latitude Media, March 2025' }, { href: 'https://virginiamercury.com/2025/04/25/will-special-rate-classes-protect-va-residents-from-the-costs-of-serving-data-centers/', label: 'Virginia Mercury, April 2025' }] },
      { tagLabel: 'Power · REC Capacity', num: '948 MW', numClass: 'forest', label: <>REC's <b>entire current peak load</b> from all existing customers. Proposed data centers in its territory would require more power than this. REC is legally obligated to serve them.</>, sources: [{ href: 'https://dailyprogress.com/news/state-regional/business/article_32da447d-6958-57c7-9821-2bd208b3ec25.html', label: 'Daily Progress / REC SCC Filing, April 2025' }] },
      { tagLabel: 'Power · Market Prices', num: '833%', numClass: 'barn', label: <>Spike in PJM regional electricity capacity auction prices for 2025–26, driven by Virginia data center demand. <b>These costs flow to every REC member's bill,</b> including Frederick County.</>, sources: [{ href: 'https://www.americanactionforum.org/insight/virginias-new-data-center-electricity-rate-class/', label: 'American Action Forum, January 2026' }] },
    ]
  },
  {
    key: 'water',
    label: 'Water',
    summary: 'Your wells, your farms, and drought risk',
    stats: [
      { tagLabel: 'Water · Loudoun County', num: '+250%', numClass: 'barn', label: <>Increase in drinking water use by Loudoun County data centers between 2019–2023, <b>revealed only through a FOIA request,</b> not voluntary disclosure. Peaked every summer, during drought season.</>, sources: [{ href: 'https://grist.org/technology/surging-demand-data-guzzling-water-ai/', label: 'Grist / Loudoun Water FOIA, June 2024' }, { href: 'https://vcnva.org/agenda-item/responsible-data-center-development/', label: 'Piedmont Environmental Council, 2024' }] },
      { tagLabel: 'Water · Virginia Law', num: 'Vetoed', numClass: 'barn', label: <>Gov. Youngkin vetoed <b>HB 1601</b> in May 2025, a bipartisan bill requiring water, farmland, and noise impact assessments before data center approval. He called it "unnecessary red tape."</>, sources: [{ href: 'https://www.datacenterdynamics.com/en/news/virginia-governor-vetoes-bipartisan-data-center-oversight-bill/', label: 'Data Center Dynamics, May 2025' }, { href: 'https://cardinalnews.org/2025/05/06/youngkin-vetoes-bill-that-would-have-required-site-assessments-for-data-centers/', label: 'Cardinal News, May 2025' }] },
      { tagLabel: 'Water · Frederick County', num: '5M gal/day', numClass: 'barn', label: <>Water a single large data center can consume daily, enough for a city of 50,000 people. <b>Frederick Water issued a Drought Watch in summer 2024.</b> The Shenandoah Valley is drought-prone by nature.</>, sources: [{ href: 'https://www.eesi.org/articles/view/data-centers-and-water-consumption', label: 'EESI, 2024' }] },
    ]
  },
  {
    key: 'resist',
    label: 'Community & Cost',
    summary: 'What it costs you and how communities are fighting back',
    stats: [
      { tagLabel: 'Demand · Virginia by 2040', num: '+183%', numClass: 'gold', label: <>Projected increase in Virginia's total energy demand by 2040 from data centers, vs. just <b>15% growth without them.</b> JLARC says meeting even half that demand will be "very difficult to achieve."</>, sources: [{ href: 'https://jlarc.virginia.gov/landing-2024-data-centers-in-virginia.asp', label: 'JLARC Data Centers in Virginia, December 2024' }] },
      { tagLabel: 'Cost · Your Future Bill', num: '$444/yr', numClass: 'gold', label: <>How much JLARC projects data centers could add to the average Virginia residential electric bill <b>by 2040.</b> REC members are not exempt from these regional grid cost pressures.</>, sources: [{ href: 'https://jlarc.virginia.gov/pdfs/reports/Rpt598.pdf', label: 'JLARC Report 598, December 2024' }, { href: 'https://vcnva.org/agenda-item/addressing-data-center-energy-demand/', label: 'Virginia Conservation Network, 2025' }] },
      { tagLabel: 'Community Response', num: '42', numClass: 'gold', label: <>Activist groups fighting data center expansion across Virginia, with <b>12,000+ petition signatures.</b> Community resistance has blocked or delayed $64 billion in projects nationwide as of early 2025.</>, sources: [{ href: 'https://www.americanactionforum.org/insight/virginias-new-data-center-electricity-rate-class/', label: 'American Action Forum / Data Center Watch, March 2025' }] },
    ]
  },
]

const issues = [
  {
    cardClass: styles => `${styles.issueCard} ${styles.waterCard}`,
    flagClass: 'water', flag: 'Problem 1 · Water',
    title: <>Our Valley's Water<br />Is at <em>Risk</em></>,
    body: <>Frederick County sits in the Shenandoah Valley, a region already prone to drought. A single large data center can consume more water than the entire county uses in a day, <b>with no legal guarantee our farms and wells come first.</b></>,
    facts: [
      <>In 2025, Gov. Youngkin <b>vetoed HB 1601</b>, a bill requiring water impact assessments before data center approval. One of four protective bills killed that session.</>,
      <>Virginia is under active drought monitoring. The VA DEQ Drought Task Force met <b>February 3, 2026.</b> Frederick Water issued a Drought Watch in summer 2024.</>,
      <>Loudoun County data centers increased drinking water use by <b>250% in four years.</b> This was revealed only through a public FOIA request, not any voluntary disclosure.</>,
      <>Fewer than <b>1 in 3</b> data center operators nationally track their own water use (DOE survey). There is no Virginia law requiring them to.</>,
      <>If your well or your farm's irrigation is impacted, there is <b>no guaranteed legal recourse</b> under current Virginia law.</>,
    ]
  },
  {
    cardClass: styles => styles.issueCard,
    flagClass: 'power', flag: 'Problem 2 · Power',
    title: <>You'll Pay for<br />Their <em>Power</em></>,
    body: <>Frederick County is served by REC, a member-owned co-op you're part owner of. Data centers force massive grid upgrades that hit every member's bill. REC's own filings warn that proposed data centers would demand <b>more power than its entire existing customer base combined.</b></>,
    facts: [
      <>REC projects <b>17 gigawatts of data center demand by 2040,</b> 18× its current peak load of ~948 MW. (<a href="https://www.latitudemedia.com/news/to-meet-massive-data-center-load-one-virginia-electric-co-op-is-proposing-an-entirely-new-business-model/" target="_blank" rel="noopener">Latitude Media, March 2025</a>)</>,
      <>PJM regional electricity capacity auction prices spiked <b>833%</b> for 2025–26 driven by Virginia data center demand. (<a href="https://www.americanactionforum.org/insight/virginias-new-data-center-electricity-rate-class/" target="_blank" rel="noopener">AAF, Jan 2026</a>)</>,
      <>JLARC projects data centers could add <b>$444/year</b> to the average Virginia residential electric bill by 2040. (<a href="https://jlarc.virginia.gov/pdfs/reports/Rpt598.pdf" target="_blank" rel="noopener">JLARC Report 598, Dec 2024</a>)</>,
      <>REC is legally obligated to serve any data center in its territory, meaning <b>your co-op cannot say no</b> without state-level authority behind it. (<a href="https://virginiamercury.com/2025/04/25/will-special-rate-classes-protect-va-residents-from-the-costs-of-serving-data-centers/" target="_blank" rel="noopener">Virginia Mercury, April 2025</a>)</>,
      <>If the AI investment bubble bursts, REC members could be left with <b>billions in stranded grid infrastructure debt</b> built for demand that never materialized.</>,
    ]
  },
  {
    cardClass: styles => styles.issueCard,
    flagClass: 'noise', flag: 'Problem 3 · Noise',
    title: <>24 Hours a Day,<br />7 Days a Week. <em>Forever.</em></>,
    body: <>Data centers never sleep. Cooling systems the size of houses run continuously on rooftops four stories above your fields. When it's hot, which is when you're trying to sleep with your windows open, they run loudest. There is no off switch.</>,
    facts: [
      <>HVAC cooling towers produce <b>55–85 dB continuously,</b> comparable to heavy traffic or background music, every hour of every day. (<a href="https://gerrymcgovern.com/data-centers-are-noisy-as-hell/" target="_blank" rel="noopener">Gerry McGovern / Data Center Knowledge</a>)</>,
      <>Diesel backup generators reach <b>100 dB during testing and outages,</b> enough to cause hearing damage with prolonged exposure. (<a href="https://consumerfed.org/in-the-shadow-of-big-tech-part-3-the-real-harms-felt-by-communities-on-the-frontlines/" target="_blank" rel="noopener">Consumer Federation of America, Oct 2025</a>)</>,
      <>In rural areas, the noise is <b>dramatically more intrusive.</b> Northern Virginia neighbors compare it to living next to a perpetually idling airplane. (<a href="https://blog.castac.org/2024/08/the-cloud-is-too-loud-spotlighting-the-voices-of-community-activists-from-the-data-center-capital-of-the-world/" target="_blank" rel="noopener">CASTAC / Platypus, Aug 2024</a>)</>,
      <>Data centers <b>regularly exceed residential noise limits</b> on hot days. Frederick County has no modern noise ordinance to protect residents after construction.</>,
      <>Residents in Granbury, TX near a data center reported <b>migraines, hearing loss, nausea, and panic attacks.</b> Several were hospitalized. (<a href="https://www.npr.org/2025/07/17/nx-s1-5469933/virginia-data-centers-residents-saying-no" target="_blank" rel="noopener">NPR, July 2025</a>)</>,
    ]
  },
  {
    cardClass: styles => styles.issueCard,
    flagClass: 'karst', flag: 'Problem 4 · Geology',
    title: <>Frederick County Sits on<br /><em>Hollow Ground</em></>,
    body: <>Most of Frederick County is underlain by karst, a landscape of dissolved limestone riddled with caves, sinkholes, and underground rivers. It's what makes the Shenandoah Valley beautiful. It's also what makes industrial-scale groundwater consumption here uniquely catastrophic.</>,
    facts: [
      <>USGS geologists have specifically mapped <b>Frederick County's karst terrain.</b> Sinkholes occur in all carbonate rock units across the county, especially near faults. (<a href="https://www.science.gov/topicpages/f/frederick+county+virginia" target="_blank" rel="noopener">USGS / Science.gov</a>)</>,
      <>Karst aquifers cannot filter contaminants. Polluted water travels <b>miles through underground conduits, sometimes in a single day,</b> directly to wells and springs. (<a href="https://caveconservancyofvirginia.org/karst/" target="_blank" rel="noopener">Cave Conservancy of Virginia</a>)</>,
      <>A data center using <b>5 million gallons of water per day</b> discharges industrial-grade wastewater directly above the same aquifer supplying private wells and Shenandoah River tributaries.</>,
      <>Heavy construction and high-volume groundwater pumping are <b>known triggers for new sinkhole formation.</b> FEMA documents show human-induced sinkholes have doubled since 1930. (<a href="https://www.dcr.virginia.gov/natural-heritage/vcbsinkholes" target="_blank" rel="noopener">Virginia DCR</a>)</>,
      <>HB 1601, the bill Gov. Youngkin vetoed, would have required <b>geological impact assessments before data center approval.</b> Without it, there is no legal requirement to study karst risk.</>,
    ]
  },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function StatGroup({ group, fadeRef }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={styles.statGroup}>
      <button
        className={`${styles.statGroupHeader} fade-up`}
        ref={fadeRef}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className={styles.statGroupLeft}>
          <span className={`${styles.statGroupTag} ${styles[group.key]}`}>{group.label}</span>
          <span className={styles.statGroupSummary}>{group.summary}</span>
        </div>
        <span className={styles.statGroupChevron} aria-hidden="true">{open ? '↑' : '↓'}</span>
      </button>
      {open && (
        <div className={styles.statGroupCards}>
          {group.stats.map((stat, i) => (
            <div key={i} className={styles.statCard}>
              <div className={`${styles.statTag} ${styles[group.key]}`}>{stat.tagLabel}</div>
              <div className={`${styles.statNum} ${styles[stat.numClass]}`}>{stat.num}</div>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statSource}>
                {stat.sources.map((s, j) => (
                  <span key={j}>{j > 0 && ' · '}<a href={s.href} target="_blank" rel="noopener">{s.label}</a></span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function IssueCard({ issue, fadeRef }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`${issue.cardClass(styles)} fade-up`} ref={fadeRef}>
      <span className={`${styles.issueFlag} ${styles[issue.flagClass]}`}>{issue.flag}</span>
      <h3 className={styles.issueTitle}>{issue.title}</h3>
      <p className={styles.issueBody}>{issue.body}</p>
      <button
        className={styles.issueToggle}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {open ? 'Hide details ↑' : 'Show details ↓'}
      </button>
      {open && (
        <ul className={styles.issueFacts}>
          {issue.facts.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [petitionCount, setPetitionCount] = useState('—')
  const [addressInput, setAddressInput] = useState('')
  const [toolResult, setToolResult] = useState(null)
  const [copyLabel, setCopyLabel] = useState(null)
  const fadeRefs = useRef([])

  useEffect(() => {
    async function fetchCount() {
  try {
    const { createClient } = await import('@/lib/client')
    const supabase = createClient()
    const { count, error } = await supabase
      .from('signatures')
      .select('*', { count: 'exact', head: true })
    setPetitionCount(count?.toLocaleString() ?? '0')
  } catch (e) {
    console.error('fetchCount error:', e)
    setPetitionCount('0')
  }
}
    fetchCount()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 70)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' })
    fadeRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const fadeRef = (el) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el) }

  function findSupervisor() {
    const val = addressInput.toLowerCase().trim()
    if (!val) { setToolResult({ error: true }); return }
    const m = supervisors.find(s => s.keywords.some(k => val.includes(k)) || val.includes(s.district.toLowerCase()))
    setToolResult(m ? { match: m } : { notFound: true })
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyLabel('copied')
      setTimeout(() => setCopyLabel(null), 2200)
    })
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroDateline}>Frederick County, Virginia · April 2026</div>
          <h1 className={styles.heroHeadline}>
            Know the Facts<br />
            on <em>Data</em>
            <span className={styles.barnWord}>Centers.</span>
          </h1>
          <p className={styles.heroDeck}>
            Our valley's farmland, water, and electric bills are on the line.
            Large data centers promise economic benefits.{' '}
            <b>But every Virginia county that said yes is now living with consequences nobody warned them about.</b>
          </p>
          <div className={styles.heroActions}>
            <Link href="/petition" className="btn-primary">Sign the Petition</Link>
            <a href="#forums" className="btn-outline">See Forum Update</a>
            <a href="#facts" className="btn-outline">Read the Facts</a>
          </div>
        </div>

        <div className={styles.heroRight} id="forums">
          <svg className={styles.heroLandscape} viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,200 L0,135 L70,95 L130,125 L195,55 L270,105 L335,38 L410,88 L470,48 L550,98 L610,65 L690,108 L750,75 L800,98 L800,200 Z" fill="#2D4A2D"/>
            <path d="M0,200 L0,162 L90,153 L180,148 L230,158 L300,143 L380,154 L460,145 L540,157 L625,147 L720,155 L800,150 L800,200 Z" fill="#2A2118"/>
            <rect x="345" y="124" width="28" height="22" fill="#8B2E1A" opacity="0.55"/>
            <polygon points="330,124 378,124 354,105" fill="#5C1E0F" opacity="0.55"/>
            <rect x="348" y="130" width="6" height="16" fill="#2A2118" opacity="0.6"/>
          </svg>
          <div className={styles.forumLabel}>Forum Update · April 26, 2026</div>
          <div className={styles.forumCard}>
            <span className={styles.forumDate}>Feb. 24 · Sherando High School</span>
            <div className={styles.forumLoc}>~250–300 residents attended. Vocal, unified opposition.</div>
            <span className={styles.forumTime}>Completed</span>
          </div>
          <div className={styles.forumCard}>
            <span className={styles.forumDate}>May 7th · James Wood High School</span>
            <div className={styles.forumLoc}>Originally postponed after resident backlash on forum format. Set for 6:30 PM.</div>
            <span className={styles.forumTime}>Rescheduled: May 7th</span>
          </div>
          <div className={styles.heroFcva}>Hosted by Frederick County Government · fcva.us</div>
        </div>
      </section>

      {/* ── Community Forum Banner ── */}
      <section className={styles.communityForumSection}>
        <div className={styles.communityForumInner}>
          <div className={styles.communityForumLeft}>
            <div className={styles.communityForumEyebrow}>Community Event · April 15, 2026 · Completed</div>
            <h2 className={styles.communityForumTitle}>Fact vs. Fiction:<br /><em>An Independent Forum</em></h2>
            <p className={styles.communityForumDeck}>
              The forum was held on April 15 at Trumpet Vine Farm. A panel of industrial hygienists, a geologist, and a land use advocate, all with decades of independent experience and no financial stake in the outcome, addressed the community. The full recording is now available.
            </p>
            <div className={styles.communityForumPanelists}>
              <span>Tammy Clark</span>
              <span>Kristen Meghan Kelly, MS-OSH</span>
              <span>Martha Saddlick</span>
              <span>Elena Schlossberg-Kunkel</span>
              <span>Nathan Russell, MA</span>
              <span>Tony Cole (Moderator)</span>
            </div>
            <Link href="/community-forum" className={styles.communityForumBtn}>Watch the Recording →</Link>
          </div>
          <div className={styles.communityForumRight}>
            <div className={styles.communityForumMetaLabel}>Recording Available</div>
            <div className={styles.communityForumMetaItem}>
              <span className={styles.communityForumMetaKey}>Held</span>
              <span className={styles.communityForumMetaVal}>Wednesday, April 15, 2026</span>
            </div>
            <div className={styles.communityForumMetaItem}>
              <span className={styles.communityForumMetaKey}>Venue</span>
              <span className={styles.communityForumMetaVal}>Trumpet Vine Farm</span>
            </div>
            <div className={styles.communityForumMetaItem}>
              <span className={styles.communityForumMetaKey}>Coverage</span>
              <span className={styles.communityForumMetaVal}>6 recordings of Panel &amp; Q&amp;A</span>
            </div>
            <div className={styles.communityForumMetaItem}>
              <span className={styles.communityForumMetaKey}>Access</span>
              <span className={styles.communityForumMetaVal}>Free · Available Now</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={styles.statsSection} id="facts">
        <div className="section-inner">
          <div className="broadsheet-header">
            <div className="bh-vol">The Numbers · Sourced from Virginia Regulators & Public Records, 2025–2026</div>
            <h2>The Facts Every<br /><em>Resident Deserves to Know</em></h2>
            <p className="bh-deck">These are not projections or scare tactics. They are documented numbers from Virginia regulators, federal labs, and public records filed in 2025 and early 2026.</p>
          </div>
          <div className={styles.statGroups}>
            {statGroups.map(group => (
              <StatGroup key={group.key} group={group} fadeRef={fadeRef} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Issues ── */}
      <section className={styles.issuesSection}>
        <div className="section-inner">
          <div className="broadsheet-header">
            <div className="bh-vol">Two Problems · Water &amp; Power</div>
            <h2>What This Means<br /><em>For Frederick County</em></h2>
            <p className="bh-deck">These aren't abstract statewide concerns. They are documented impacts that will reach your well, your electric bill, and your land if we don't speak up now.</p>
          </div>
          <div className={styles.issuesGrid}>
            {issues.map((issue, i) => (
              <IssueCard key={i} issue={issue} fadeRef={fadeRef} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Neighbors ── */}
      <section className={styles.neighborsSection}>
        <div className="section-inner">
          <div className="broadsheet-header bh-dark">
            <div className="bh-vol">Case Studies · Virginia Counties</div>
            <h2>What Our <em>Neighbors</em><br />Are Living With</h2>
            <p className="bh-deck">Virginia communities that said yes to data centers are now sounding the alarm. Their experience is our warning.</p>
          </div>
          <div className={styles.neighborsGrid}>
            {[
              { name: 'Loudoun County', tag: "Virginia · World's Largest Data Center Market", body: <><b>200+ data centers. 43 million square feet.</b> Drinking water use jumped 250% in four years. High-voltage transmission lines are being carved through farmland and wetlands. Supervisors now deny applications, but for most neighborhoods, it is already too late.</> },
              { name: 'Prince William County', tag: 'Virginia · Active Community Resistance', body: <>Data centers built adjacent to the Great Oaks subdivision generated <b>years of noise complaints and national news coverage.</b> A Loudoun realtor noted in February 2025: <em>"No one has ever asked me to find them a home near a data center."</em> <b>We'd be the experiment.</b></> },
              { name: 'Warren County', tag: 'Virginia · Voted No · January 2023', body: <>The Board of Supervisors voted <b>5–0</b> against a zoning change that would have opened the door to data centers, calling the facilities <em>"monstrosities."</em> Residents cited threats to the local water supply and community character. <b>Frederick County has that same choice right now.</b></> },
            ].map((n, i) => (
              <div key={i} className={`${styles.neighborCard} fade-up`} ref={fadeRef}>
                <div className={styles.neighborName}>{n.name}</div>
                <span className={styles.neighborTag}>{n.tag}</span>
                <p className={styles.neighborBody}>{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Action ── */}
      <section className={styles.actionSection} id="action">
        <div className="section-inner">
          <div className="broadsheet-header">
            <div className="bh-vol">Take Action · What Happens Next</div>
            <h2>Show Up.<br /><em>Be Counted.</em></h2>
            <p className="bh-deck">The Feb. 24 forum drew 250–300 residents and forced the county to postpone Feb. 26 to "improve the format". The pressure is working. Keep it up.</p>
          </div>
          <div className={styles.actionGrid}>
            <div className={`${styles.stepsCol} fade-up`} ref={fadeRef}>
              {[
                { num: '1', title: 'Attend the rescheduled forum.', desc: <>The James Wood High School forum was postponed after resident pushback on the format. Rescheduled for May 7th. <a href="https://www.fcva.us/departments/public-information/dc-faq" target="_blank" rel="noopener">Visit https://www.fcva.us/departments/public-information/dc-faq</a> for the announcement. Show up.</> },
                { num: '2', title: 'Submit written comment to the Board.', desc: <>Written correspondence to your supervisor becomes part of the official public record. Use the tool below to find your rep and contact them now.</> },
                { num: '3', title: 'Contact your supervisor directly.', desc: <>Use the tool to find your Board representative. The postponement shows officials are listening. Keep the pressure on.</> },
                { num: '4', title: 'Bring a neighbor.', desc: <>Invite someone from your road, your church, your feed store. Most residents still don't know what's happening. Higher turnout at the rescheduled forum sends an unmistakable signal.</> },
              ].map((step, i) => (
                <div key={i} className={styles.actionStep}>
                  <div className={styles.stepNum}>{step.num}</div>
                  <div className={styles.stepBody}>
                    <div className={styles.stepTitle}>{step.title}</div>
                    <div className={styles.stepDesc}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className={`${styles.toolCol} fade-up`} ref={fadeRef}>
              <div className={styles.toolInner}>
                <div className={styles.toolEyebrow}>Find Your Representative</div>
                <div className={styles.toolTitle}>Contact Your Board Supervisor</div>
                <div className={styles.toolSub}>Enter your address, town, or district name to find your Frederick County Board of Supervisors rep and contact them before the forum.</div>
                <label htmlFor="supervisor-search" style={{position:'absolute',width:'1px',height:'1px',overflow:'hidden',clip:'rect(0 0 0 0)',whiteSpace:'nowrap'}}>Enter your address or district</label>
                <input
                  id="supervisor-search"
                  type="text"
                  className={styles.toolInput}
                  placeholder="e.g. Stephens City, Gainesboro, Back Creek…"
                  value={addressInput}
                  onChange={e => setAddressInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && findSupervisor()}
                />
                <button className={styles.toolBtn} onClick={findSupervisor}>Find My Representative →</button>
                {toolResult && (
                  <div className={`${styles.toolResult} ${styles.show}`}>
                    {toolResult.error && 'Please enter your address or nearest town.'}
                    {toolResult.notFound && <>Couldn't auto-match your address. Try your district name (Gainesboro, Back Creek, Opequon, Red Bud, Shawnee, or Stonewall), or call the county at <strong style={{color:'var(--gold-lt)'}}>540-665-6382</strong>.</>}
                    {toolResult.match && (
                      <>
                        <strong>{toolResult.match.district} — {toolResult.match.name}</strong>
                        <a href={`mailto:${toolResult.match.email}`}>{toolResult.match.email}</a>
                        {toolResult.match.phone && <><br /><span style={{color:'rgba(235,242,235,0.55)'}}>{toolResult.match.phone}</span></>}
                      </>
                    )}
                  </div>
                )}
                <div className={styles.toolNote}>
                  <strong>Can't attend in person?</strong> Submit written comments at <a href="https://www.fcva.us" target="_blank" rel="noopener">fcva.us</a> or email your supervisor directly. Written input is part of the official public record.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Petition CTA ── */}
      <section className={styles.petitionSection} id="petition">
        <div className="section-inner">
          <div className="broadsheet-header">
            <div className="bh-vol">Community Petition · Make Your Voice Official</div>
            <h2>Sign the Petition.<br /><em>Go on Record.</em></h2>
            <p className="bh-deck">Showing up at the forum is powerful. Adding your name to the official petition makes your opposition part of the permanent public record.</p>
          </div>
          <div className={styles.petitionCtaGrid}>
            <div className={`${styles.petitionCtaCard} ${styles.highlight} fade-up`} ref={fadeRef}>
              <div className={styles.petitionCountLabel}>Community Petition</div>
              <span className={styles.petitionCountNum}>{petitionCount}</span>
              <p className={styles.petitionCountSub}>Frederick County residents have signed.<br /><b>Every signature is presented to the Board.</b></p>
              <Link href="/petition" className={styles.btnPetition}>Add Your Name →</Link>
            </div>
            <div className={`${styles.petitionCtaCard} fade-up`} ref={fadeRef}>
              <div className={styles.petitionWhyTitle}>Why signing matters</div>
              <ul className={styles.petitionWhyList}>
                <li>Your name and district become part of the <b>official public record.</b> The Board cannot ignore it.</li>
                <li>A petition with hundreds of signatures from across all six districts <b>demonstrates countywide opposition</b>, not just one neighborhood.</li>
                <li>If the Board delays a decision, the petition keeps pressure on between meetings.</li>
                <li>Signatures can be <b>printed and delivered</b> directly to the Board at public meetings.</li>
                <li>Takes less than <b>60 seconds</b> to sign.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      
      {/* ── Media ── */}
      <section id="media" style={{background:'var(--cream-2)',borderTop:'3px double var(--rule-dark)',paddingBottom:'72px'}}>
        <div className="section-inner">
          <div className="broadsheet-header">
            <div className="bh-vol">Press & Media · For Journalists</div>
            <h2>Media <em>Resources</em></h2>
            <p className="bh-deck">Covering data centers in Frederick County? Everything on this site is sourced and available for reference. Contact us for comment, data, or interviews with local residents.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'3px'}}>
            <div style={{background:'var(--white)',border:'1px solid var(--rule)',padding:'32px 34px'}}>
              <div style={{fontSize:'9px',fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--forest)',marginBottom:'16px'}}>Key Facts for Coverage</div>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'12px'}}>
                {[
                  'Two data center proposals were rejected by the Board 5-1 in June 2025: a 644-acre campus south of Stephens City (Tract Capital) and a 105-acre site south of Winchester.',
                  'Frederick County sits almost entirely on karst terrain, a geological formation that makes groundwater uniquely vulnerable to contamination from industrial activity.',
                  'The county is served by two member-owned electric cooperatives: REC and SVEC. REC projects 17 GW of data center demand by 2040, 18× its current peak load.',
                  'The Feb. 24 forum at Sherando High School drew 250–300 residents. The Feb. 26 forum at James Wood High School was postponed after backlash on the format. It has been rescheduled for May 7, 2026 at James Wood High School at 6:30 PM.',
                  'All statistics on this site are sourced to primary documents: JLARC, Virginia Energy, USGS, Consumer Federation of America, NPR, and local Virginia press.',
                ].map((fact, i) => (
                  <li key={i} style={{fontSize:'13px',lineHeight:'1.65',color:'var(--ink-2)',paddingLeft:'18px',position:'relative'}}>
                    <span style={{position:'absolute',left:0,color:'var(--barn)',fontSize:'9px',top:'4px'}}>◆</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{background:'var(--white)',border:'1px solid var(--rule)',padding:'32px 34px'}}>
              <div style={{fontSize:'9px',fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--forest)',marginBottom:'16px'}}>Contact</div>
              <p style={{fontSize:'14px',lineHeight:'1.8',color:'var(--ink-2)',marginBottom:'20px'}}>For press inquiries, interview requests, or comment, reach out directly. We can also connect journalists with local residents, farmers, and community members willing to speak on the record.</p>
              <a href="mailto:info@protectfrederick.org" style={{display:'inline-block',background:'var(--barn)',color:'var(--cream)',fontSize:'12px',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',padding:'12px 24px',textDecoration:'none'}}>info@protectfrederick.org</a>
              <p style={{fontSize:'11px',color:'var(--ink-3)',marginTop:'16px'}}>This site is an independent community effort by Frederick County residents. It is not affiliated with any political party or outside organization.</p>
            </div>
          </div>
        </div>
      </section>


      {/* ── Share ── */}
      <section className={styles.shareSection}>
        <div className="section-inner">
          <h2 className={styles.shareTitle}>Spread the Word<br /><em>Across the Valley</em></h2>
          <p className={styles.shareSub}>The April 15 community forum recording is now available. The county forum at James Wood High School is rescheduled for May 7. Share this page so neighbors are informed before that meeting.</p>
          <div className={styles.shareButtons}>
            <a className={`${styles.shareBtn} ${styles.shareFacebook}`} href="https://www.facebook.com/sharer/sharer.php?u=https://protectfrederick.org" target="_blank" rel="noopener">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Share on Facebook
            </a>
            <a className={`${styles.shareBtn} ${styles.shareTwitter}`} href="https://twitter.com/intent/tweet?text=Frederick+County+residents%3A+Public+forums+on+data+centers+Feb+24+%26+26.+Know+the+facts.&url=https://protectfrederick.org" target="_blank" rel="noopener">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Share on X
            </a>
            <button className={`${styles.shareBtn} ${styles.shareCopy} ${copyLabel === 'copied' ? styles.copied : ''}`} onClick={copyLink}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              {copyLabel === 'copied' ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}