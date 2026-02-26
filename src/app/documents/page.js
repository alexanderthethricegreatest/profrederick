'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from '@/styles/resources.module.css'

const videos = [
  {
    href: 'https://www.youtube.com/watch?v=YN6BEUA4jNU',
    ytId: 'YN6BEUA4jNU',
    alt: 'We Found the Hidden Cost of Data Centers',
    source: 'More Perfect Union · August 2025',
    sourceLink: 'https://www.youtube.com/watch?v=YN6BEUA4jNU',
    title: 'We Found the Hidden Cost of Data Centers. It\'s in Your Electric Bill.',
    note: <>An Emmy-winning nonprofit newsroom goes inside the deal-making between Big Tech and utilities. <b>The key finding: tech companies like Meta negotiate to pay for only half the infrastructure they require, leaving everyone else to cover the rest.</b> Harvard Law School's energy expert and Public Citizen's energy director both appear on camera. Required viewing before the forums.</>
  },
  {
    href: 'https://www.youtube.com/watch?v=DGjj7wDYaiI',
    ytId: 'DGjj7wDYaiI',
    alt: 'The True Cost of the AI Revolution',
    source: 'More Perfect Union · March 2025',
    sourceLink: 'https://www.youtube.com/watch?v=DGjj7wDYaiI',
    title: 'The True Cost of the AI Revolution: Living Next to Meta\'s Data Center',
    note: <>A rural Georgia family bought their land for peace. A Meta data center went up 400 yards away. <b>Nearly 2 million views.</b> The construction contaminated their well water. Meta didn't show up until the video went viral.</>
  },
  {
    href: 'https://www.youtube.com/watch?v=t-8TDOFqkQA',
    ytId: 't-8TDOFqkQA',
    alt: 'Exposing The Dark Side of America\'s AI Data Center Explosion',
    source: 'Business Insider · View From Above',
    sourceLink: 'https://www.youtube.com/watch?v=t-8TDOFqkQA',
    title: 'Exposing The Dark Side of America\'s AI Data Center Explosion',
    note: <>Business Insider reporters mapped every data center in the US for the first time and traveled to Virginia to meet residents living next to them. <b>One-third of the world's internet traffic flows through data centers in a single state: Virginia.</b> This is what Loudoun County looks like after 30 years of "yes."</>
  },
]

const virginiaArticles = [
  { href: 'https://cardinalnews.org/2025/03/12/data-centers-are-changing-the-landscape-heres-how-they-may-affect-rural-virginia/', meta: 'Cardinal News · March 2025', title: 'Data Centers Are Changing the Landscape. Here\'s How They May Affect Rural Virginia.', note: <>The most thorough overview of what data centers actually look and sound like in rural Virginia. Includes eyewitness accounts of noise, light pollution, and the quote from a 31-year resident: <b>"It's a sort of cross between a plane and a train."</b> Start here if you're preparing to speak at a forum.</> },
  { href: 'https://insideclimatenews.org/news/26102025/virginia-data-center-capital-ai-boom/', meta: 'Inside Climate News · October 2025', title: 'How Did This State Become the Data Center Capital of the World?', note: <>The definitive long read on how Virginia became "Data Center Alley." <b>Essential context for understanding why Frederick County's Board vote in June 2025 mattered.</b></> },
  { href: 'https://insideclimatenews.org/news/10022023/virginia-data-centers-amazon-prince-william-county/', meta: 'Inside Climate News · 2023', title: 'In Northern Virginia, a Coming Data Center Boom Sounds a Community Alarm', note: <>The Prince William County Digital Gateway fight: $24.7 billion, 2,500 acres. Residents packed meetings and helped flip the county board. <b>This is the community organizing playbook in real time.</b></> },
  { href: 'https://vadogwood.com/2025/09/19/new-data-center-virginia-fear-bills/', meta: 'VA Dogwood · September 2025', title: 'New Google Data Center Near Richmond Sparks Fears Over Higher Bills and Climate', note: <>Covers Google's $9 billion Virginia expansion and what families near existing facilities experience: cracked drywall, sleepless nights. <b>Also covers Governor Youngkin's veto of HB 1601.</b></> },
  { href: 'https://www.wsls.com/news/local/2025/12/02/botetourt-county-residents-voice-concerns-over-googles-data-center-environmental-impact-and-county-transparency/', meta: 'WSLS / NBC · December 2025', title: 'Botetourt County Residents Voice Concerns Over Google\'s Data Center', note: <>A rural Virginia county given no information about noise, water use, or building count. A court had to order their release. <b>Sound familiar?</b></> },
  { href: 'https://thehill.com/policy/technology/5660972-virginia-data-centers-impact-costs/', meta: 'The Hill · January 2026', title: 'Virginia Data Center Boom Offers Glimpse Into U.S. AI Future', note: <>Documents that Virginia's electric bills rose 13% last year, nearly double the national average. <b>Clean Virginia's executive director: "We have an energy crisis on the horizon."</b></> },
]

const nationalArticles = [
  { href: 'https://prospect.org/2025/12/22/demands-for-data-center-moratoriums-surge/', meta: 'The American Prospect · December 2025', title: 'Demands for Data Center Moratoriums Surge', note: <>Documents the nationwide bipartisan backlash. <b>In Q2 2025 alone, opponents blocked or delayed projects totaling $100 billion.</b></> },
  { href: 'https://dailyyonder.com/the-data-center-rush-in-appalachia/2026/01/07/', meta: 'The Daily Yonder · January 2026', title: 'The Data Center Rush in Appalachia', note: <>As Northern Virginia saturates, developers push into rural Appalachia. <b>West Virginia passed a law stripping counties of zoning authority over data centers entirely.</b> Also documents the jobs myth: 1,500 construction workers, then 50 permanent employees.</> },
  { href: 'https://www.wri.org/insights/us-data-center-growth-impacts', meta: 'World Resources Institute · 2025', title: 'From Energy Use to Air Quality: The Many Ways Data Centers Affect US Communities', note: <><b>80% of Virginia municipalities with data centers signed NDAs with developers</b>, blocking residents from accessing basic information about what was being built near their homes.</> },
  { href: 'https://www.datacenterwatch.org/report', meta: 'Data Center Watch · March 2025', title: '$64 Billion in Data Center Projects Blocked or Delayed by Local Opposition', note: <>A running tracker of every community that has successfully pushed back. <b>Includes multiple Virginia cases: Richmond ($500M withdrawn), Manassas (Amazon withdrew after 6-1 vote), and Culpeper (426-acre proposal deferred).</b></> },
]

const reports = [
  { href: 'https://jlarc.virginia.gov/landing-2024-data-centers-in-virginia.asp', label: 'JLARC · Dec 2024', title: 'Data Centers in Virginia, Joint Legislative Audit and Review Commission', note: 'Virginia\'s official nonpartisan legislative research body. Finds that data center demand could add $14–$37/month to average residential bills by 2040, that energy demand would require building new infrastructure "at twice the annual rate" of 2024 solar additions, and that noise ordinance enforcement carries a maximum $500 fine, less than a parking ticket.' },
  { href: 'https://consumerfed.org/in-the-shadow-of-big-tech-part-3-the-real-harms-felt-by-communities-on-the-frontlines/', label: 'Consumer Fed · Oct 2025', title: 'In the Shadow of Big Tech: The Real Harms Felt by Communities on the Frontlines', note: 'Three-part investigative series documenting noise impacts (diesel generators reaching 100 dB), electricity bill increases, and water pressure losses. Includes specific dollar amounts for rate increases by region and utility. Part 3 covers noise and health in the most detail.' },
  { href: 'https://www.frontiersin.org/journals/climate/articles/10.3389/fclim.2026.1648912/full', label: 'Frontiers · Feb 2026', title: 'Health Implications of the Rapid Rise of Data Centers in Virginia, Peer-Reviewed Study', note: 'The first peer-reviewed study specifically examining health impacts in Virginia. Covers air quality, noise, water depletion, economic burden on low-income households, and land use. Academically rigorous — cite this one.' },
  { href: 'https://jlarc.virginia.gov/pdfs/reports/Rpt598.pdf', label: 'JLARC · Full PDF', title: 'JLARC Report 598: Data Centers in Virginia (Full Report)', note: 'The complete 200+ page PDF underlying the JLARC landing page above. Contains the full methodology, all source data, and the energy grid modeling commissioned specifically for this report.' },
]

const orgs = [
  { href: 'https://www.pecva.org', type: 'Virginia · Land & Environment', name: 'Piedmont Environmental Council', note: 'The oldest and most established conservation organization in our region. Has tracked every data center proposal in Virginia and helped communities organize opposition from Fauquier to Pittsylvania. Their data on water, farmland, and grid impact is cited in JLARC\'s own report.' },
  { href: 'https://cleanvirginia.org', type: 'Virginia · Energy & Utilities', name: 'Clean Virginia', note: 'Focuses on the relationship between utility companies, state politicians, and ratepayers. Has documented that residential customers are largely paying for the data center buildout through grid upgrade costs. Strong credibility with moderate and fiscally conservative audiences.' },
  { href: 'https://mountainpatriots.org', type: 'Frederick County · Local', name: 'Mountain Patriots', note: 'The local conservative group that released a 21-page data center report in December 2025 and has been actively engaged with the Frederick County process. They\'ve already done legal and policy research specifically on this county.' },
  { href: 'https://www.datacenterwatch.org', type: 'National · Tracking & Research', name: 'Data Center Watch', note: 'Tracks every blocked, delayed, and approved data center project in the country in real time. Also publishes analysis on legal strategies, zoning approaches, and what arguments have actually worked in Board hearings versus what hasn\'t.' },
  { href: 'https://perfectunion.us', type: 'National · Journalism & Advocacy', name: 'More Perfect Union', note: 'The Emmy-winning nonprofit newsroom behind the videos above. Over 2 million YouTube subscribers. They respond to community tips and have covered local fights from Indiana to Georgia to Virginia.' },
  { href: 'https://www.sierraclub.org/virginia', type: 'Virginia · Environment & Health', name: 'Sierra Club Virginia', note: 'Has published a Virginia-specific data center impact report covering water consumption, carbon emissions, and energy demand. Their karst and groundwater research is the most thorough available.' },
]

const sourceSections = [
  {
    label: 'REC & Frederick County Power',
    links: [
      { href: 'https://www.latitudemedia.com/news/to-meet-massive-data-center-load-one-virginia-electric-co-op-is-proposing-an-entirely-new-business-model/', text: 'REC projects 17 GW of data center demand by 2040', date: 'Latitude Media, March 2025' },
      { href: 'https://virginiamercury.com/2025/04/25/will-special-rate-classes-protect-va-residents-from-the-costs-of-serving-data-centers/', text: 'Will special rate classes protect VA residents from data center costs?', date: 'Virginia Mercury, April 2025' },
      { href: 'https://dailyprogress.com/news/state-regional/business/article_32da447d-6958-57c7-9821-2bd208b3ec25.html', text: 'Virginia co-op proposes path to keep data centers from boosting electric bills', date: 'Daily Progress, April 2025' },
      { href: 'https://www.americanactionforum.org/insight/virginias-new-data-center-electricity-rate-class/', text: "Virginia's New Data Center Electricity Rate Class — 833% capacity price spike", date: 'American Action Forum, January 2026' },
    ]
  },
  {
    label: 'Official Virginia Reports',
    links: [
      { href: 'https://jlarc.virginia.gov/landing-2024-data-centers-in-virginia.asp', text: 'JLARC: Data Centers in Virginia (full study)', date: 'Virginia General Assembly, December 2024' },
      { href: 'https://jlarc.virginia.gov/pdfs/reports/Rpt598.pdf', text: 'JLARC Report 598 — $444/yr projected residential cost increase by 2040', date: 'JLARC, December 2024' },
      { href: 'https://www.scc.virginia.gov/about-the-scc/newsreleases/release/scc-issues-order-on-dev-biennial-review-2025/scc-rules-in-dev-biennial-review-case.html', text: 'Virginia SCC Order: Dominion rate increase & new GS-5 data center rate class', date: 'Virginia SCC, November 2025' },
    ]
  },
  {
    label: 'Water & Environmental Impact',
    links: [
      { href: 'https://grist.org/technology/surging-demand-data-guzzling-water-ai/', text: "The surging demand for data is guzzling Virginia's water", date: "Grist / Loudoun Water FOIA, June 2024" },
      { href: 'https://vcnva.org/agenda-item/responsible-data-center-development/', text: 'Responsible Data Center Development — 250% water use increase', date: 'Piedmont Environmental Council, 2024' },
      { href: 'https://www.eesi.org/articles/view/data-centers-and-water-consumption', text: 'Data Centers and Water Consumption', date: 'Environmental and Energy Study Institute, 2024' },
      { href: 'https://vcnva.org/agenda-item/addressing-data-center-energy-demand/', text: 'Addressing Data Center Energy Demand in Virginia', date: 'Virginia Conservation Network, 2025' },
    ]
  },
  {
    label: 'HB 1601 & Virginia Law',
    links: [
      { href: 'https://www.datacenterdynamics.com/en/news/virginia-governor-vetoes-bipartisan-data-center-oversight-bill/', text: 'Youngkin vetoes bipartisan data center oversight bill (HB 1601)', date: 'Data Center Dynamics, May 2025' },
      { href: 'https://cardinalnews.org/2025/05/06/youngkin-vetoes-bill-that-would-have-required-site-assessments-for-data-centers/', text: 'Youngkin vetoes bill requiring site assessments for data centers', date: 'Cardinal News, May 2025' },
      { href: 'https://virginiamercury.com/2025/06/20/virginia-doesnt-have-statewide-data-center-regulations-localities-are-making-their-own-rules-instead/', text: "Virginia doesn't have statewide data center regulations. Localities are making their own rules.", date: 'Virginia Mercury, June 2025' },
    ]
  },
  {
    label: 'Noise Pollution',
    labelColor: '#8b4513',
    links: [
      { href: 'https://www.npr.org/2025/07/17/nx-s1-5469933/virginia-data-centers-residents-saying-no', text: "Why more residents are saying 'No' to AI data centers in their backyard", date: 'NPR, July 2025' },
      { href: 'https://blog.castac.org/2024/08/the-cloud-is-too-loud-spotlighting-the-voices-of-community-activists-from-the-data-center-capital-of-the-world/', text: 'The Cloud is Too Loud: Community activists from the data center capital of the world', date: 'CASTAC / Platypus, August 2024' },
      { href: 'https://consumerfed.org/in-the-shadow-of-big-tech-part-3-the-real-harms-felt-by-communities-on-the-frontlines/', text: 'In the Shadow of Big Tech: Real harms felt by frontline communities', date: 'Consumer Federation of America, October 2025' },
      { href: 'https://gerrymcgovern.com/data-centers-are-noisy-as-hell/', text: 'Data centers are noisy as hell — noise levels, rural impact, health effects', date: 'Gerry McGovern / Data Center Knowledge' },
    ]
  },
  {
    label: 'Karst Geology & Groundwater',
    links: [
      { href: 'https://www.science.gov/topicpages/f/frederick+county+virginia', text: 'USGS Geologic Mapping of Frederick County, VA — karst, sinkholes, groundwater', date: 'U.S. Geological Survey / Science.gov' },
      { href: 'https://energy.virginia.gov/geology/Sinkholes.shtml', text: 'Sinkholes and Karst in Virginia — geology, contamination history, I-81 corridor risk', date: 'Virginia Energy / Division of Geology and Mineral Resources' },
      { href: 'https://www.dcr.virginia.gov/natural-heritage/vcbsinkholes', text: "A Resident's Guide to Sinkholes — aquifer vulnerability, contamination pathways", date: 'Virginia Department of Conservation and Recreation' },
      { href: 'https://caveconservancyofvirginia.org/karst/', text: 'Living on Karst — groundwater travels miles in a day, no natural filtration', date: 'Cave Conservancy of Virginia' },
    ]
  },
  {
    label: 'Community Precedents & Property',
    links: [
      { href: 'https://www.nvdaily.com/nvdaily/warren-county-supervisors-close-door-on-data-centers/article_32fd2fab-3c8a-55f7-a6fc-01067c12cc4e.html', text: 'Warren County supervisors close door on data centers — 5–0 vote', date: 'Northern Virginia Daily, January 2023' },
      { href: 'https://www.loudounnow.com/opinion/columnists/said-no-one-has-ever-asked-me-to-find-them-a-home-near-a-data-center/article_3bb86461-84ec-41b4-a28f-da7ee9d8f485.html', text: '"No one has ever asked me to find them a home near a data center" — Loudoun realtor', date: 'Loudoun Now, February 2025' },
      { href: 'https://www.fxbgadvance.com/p/digital-insights-home-values-and', text: 'Home values and proximity to data centers — what the research actually says', date: 'FXBG Advance / GMU Schar School, September 2025' },
      { href: 'https://www.selc.org/news/a-rural-virginia-county-is-a-case-study-in-community/', text: 'Pittsylvania County defeats 84-data-center MegaCampus proposal — 6–1 vote', date: 'Southern Environmental Law Center, 2025' },
    ]
  },
]

export default function Resources() {
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
        <div className={styles.pageHeaderVol}>Recommended Reading & Viewing · Curated by Protect Frederick</div>
        <h1>Know What You're<br /><em>Up Against</em></h1>
        <p className={styles.pageHeaderDeck}>These are the sources we trust most. A guide to the reporting, research, and organizing tools that will help you understand what's happening and what you can do about it.</p>
      </div>

      {/* ── Videos ── */}
      <hr className={styles.sectionDivider} />
      <section className={styles.resourcesSection}>
        <div className="section-inner">
          <div className={styles.catHeader}>
            <span className={`${styles.catFlag} ${styles.video}`}>Watch First</span>
            <div className={styles.catTitle}>Videos Worth Your <em>Time</em></div>
          </div>
          <p className={styles.catDesc}>If you only have 30 minutes, watch the More Perfect Union electricity video first. It's the clearest explanation of how your electric bill is being handed to Big Tech, and it covers the same PJM grid that REC and SVEC operate on.</p>
          <div className={styles.videoGrid}>
            {videos.map((v, i) => (
              <div key={i} className={`${styles.videoCard} fade-up`} ref={fadeRef}>
                <a href={v.href} target="_blank" rel="noopener" style={{display:'block',textDecoration:'none'}}>
                  <div className={styles.videoEmbed}>
                    <img src={`https://img.youtube.com/vi/${v.ytId}/maxresdefault.jpg`} alt={v.alt} />
                    <div className={styles.videoPlay}>
                      <div className={styles.videoPlayBtn}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="8,5 19,12 8,19"/></svg>
                      </div>
                    </div>
                  </div>
                </a>
                <div className={styles.videoInfo}>
                  <div className={styles.videoSource}>{v.source} · <a href={v.sourceLink} target="_blank" rel="noopener">Watch on YouTube ↗</a></div>
                  <div className={styles.videoTitle}>{v.title}</div>
                  <p className={styles.videoNote}>{v.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Virginia Coverage ── */}
      <hr className={styles.sectionDivider} />
      <section className={styles.resourcesSection}>
        <div className="section-inner">
          <div className={styles.catHeader}>
            <span className={`${styles.catFlag} ${styles.virginia}`}>In Our Backyard</span>
            <div className={styles.catTitle}>Virginia <em>Coverage</em></div>
          </div>
          <p className={styles.catDesc}>These are the reporters and outlets covering what's actually happening in Virginia, not industry press releases. Cardinal News and Inside Climate News have done the best sustained reporting on rural Virginia communities specifically.</p>
          <div className={styles.articleGrid}>
            {virginiaArticles.map((a, i) => (
              <a key={i} className={`${styles.articleCard} fade-up`} href={a.href} target="_blank" rel="noopener" ref={fadeRef}>
                <div className={styles.articleMeta}>{a.meta}</div>
                <div className={styles.articleTitle}>{a.title}</div>
                <p className={styles.articleNote}>{a.note}</p>
                <span className={styles.articleArrow}>Read →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── National Coverage ── */}
      <hr className={styles.sectionDivider} />
      <section className={styles.resourcesSection}>
        <div className="section-inner">
          <div className={styles.catHeader}>
            <span className={`${styles.catFlag} ${styles.national}`}>Bigger Picture</span>
            <div className={styles.catTitle}>National <em>Coverage</em></div>
          </div>
          <p className={styles.catDesc}>The Frederick County fight is happening in hundreds of communities simultaneously. These pieces show the national pattern, and they're useful at forums because they demonstrate this isn't a local fringe position.</p>
          <div className={styles.articleGrid}>
            {nationalArticles.map((a, i) => (
              <a key={i} className={`${styles.articleCard} fade-up`} href={a.href} target="_blank" rel="noopener" ref={fadeRef}>
                <div className={styles.articleMeta}>{a.meta}</div>
                <div className={styles.articleTitle}>{a.title}</div>
                <p className={styles.articleNote}>{a.note}</p>
                <span className={styles.articleArrow}>Read →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Official Reports ── */}
      <hr className={styles.sectionDivider} />
      <section className={styles.resourcesSection}>
        <div className="section-inner">
          <div className={styles.catHeader}>
            <span className={`${styles.catFlag} ${styles.reports}`}>Primary Sources</span>
            <div className={styles.catTitle}>Official Reports & <em>Research</em></div>
          </div>
          <p className={styles.catDesc}>These are the documents to cite when someone says "that's just your opinion." JLARC is Virginia's own nonpartisan legislative research body. Its findings can't be dismissed as outside advocacy.</p>
          <div className={styles.reportList}>
            {reports.map((r, i) => (
              <a key={i} className={`${styles.reportCard} fade-up`} href={r.href} target="_blank" rel="noopener" ref={fadeRef}>
                <div className={styles.reportLabel}>{r.label}</div>
                <div>
                  <div className={styles.reportTitle}>{r.title}</div>
                  <p className={styles.reportNote}>{r.note}</p>
                </div>
                <div className={styles.reportArrow}>→</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Organizations ── */}
      <hr className={styles.sectionDivider} />
      <section className={styles.resourcesSection}>
        <div className="section-inner">
          <div className={styles.catHeader}>
            <span className={`${styles.catFlag} ${styles.organize}`}>Take Action</span>
            <div className={styles.catTitle}>Organizations Worth <em>Knowing</em></div>
          </div>
          <p className={styles.catDesc}>You don't have to build this from scratch. These organizations have been fighting this fight longer than most people knew it was a fight.</p>
          <div className={styles.organizeGrid}>
            {orgs.map((o, i) => (
              <a key={i} className={`${styles.orgCard} fade-up`} href={o.href} target="_blank" rel="noopener" ref={fadeRef}>
                <div className={styles.orgType}>{o.type}</div>
                <div className={styles.orgName}>{o.name}</div>
                <p className={styles.orgNote}>{o.note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sources ── */}
      <section className={styles.sourcesSection}>
        <div className="section-inner">
          <div className="broadsheet-header" style={{marginBottom:'36px'}}>
            <div className="bh-vol">Sources & Further Reading</div>
            <h2 style={{fontSize:'clamp(26px,3.5vw,42px)'}}>Read the Evidence<br /><em>Yourself</em></h2>
            <p className="bh-deck">Every claim on this site is sourced. These are the primary documents, investigative reports, and official filings behind the numbers.</p>
          </div>
          <div className={styles.sourcesGrid}>
            {sourceSections.map((section, i) => (
              <div key={i} className={styles.sourceCard}>
                <div className={styles.sourceCardLabel} style={section.labelColor ? {color: section.labelColor} : {}}>
                  {section.label}
                </div>
                <ul className={styles.sourceList}>
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a href={link.href} target="_blank" rel="noopener">{link.text}</a>
                      <div className={styles.sourceDate}>{link.date}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}