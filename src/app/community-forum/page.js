'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from '@/styles/community-forum.module.css'

const panelists = [
  {
    credential: 'Industrial Hygienist',
    name: 'Tammy Clark',
    title: 'Industrial Hygienist & Occupational Environmental Health & Safety Professional',
    bio: [
      'With over 20 years of experience managing health, safety, and compliance programs across multiple industries, Tammy Clark brings expertise from both regulatory and litigation settings. Her work has informed employers, manufacturers, healthcare systems, and government agencies on occupational safety, regulatory compliance, and risk analysis.',
      'Her background spans a breadth of industrial contexts, giving her a grounded, evidence-based perspective on how large-scale industrial development affects surrounding communities, workers, and the environment.',
    ],
  },
  {
    credential: 'Senior Industrial Hygienist & Environmental Specialist',
    name: ' Kristen Meghan Kelly, MS-OSH',
    title: 'Senior Industrial Hygienist, Environmental Specialist & Nationally Recognized Expert',
    bio: [
      'Kristen Meghan Kelly holds a Master of Science in Occupational Safety and Health and brings 20+ years of experience as a senior industrial hygienist and environmental specialist. She is a consultant and nationally recognized expert, featured in media and documentary work for her advocacy and professional insight.',
      'Her expertise spans the human health and environmental impacts of industrial operations, an essential lens for evaluating what large-scale data center infrastructure means for Frederick County residents, water, and land.',
    ],
  },
  {
    credential: 'Geologist · Karst & Subsurface Systems',
    name: 'Martha Saddlick',
    title: 'Geologist (JMU) · Oil & Gas Geophysicist · Generational Farmer, Shenandoah Valley',
    bio: [
      'Martha Saddlick holds a geology degree from James Madison University and brings 45+ years of experience as an oil and gas geophysicist. Her deep expertise in subsurface analysis, including karst geology, aquifer systems, and land use, is directly relevant to the infrastructure and water risks posed by large-scale industrial development in the Valley.',
      'As a generational farmer in the Shenandoah Valley, Saddlick also brings the perspective of someone with roots in the land, someone who understands what is at stake beyond the spreadsheets and economic projections.',
    ],
    note: 'Much of Frederick County sits atop karst terrain, a landscape formed from soluble bedrock like limestone, characterized by caves, sinkholes, and underground aquifers that are particularly vulnerable to contamination from heavy industrial activity.',
  },
  {
    credential: 'Land Use & Smart Growth Advocate',
    name: 'Elena Schlossberg-Kunkel',
    title: 'Founder, Coalition to Protect Prince William County · Land Use Policy Advocate',
    bio: [
      'Elena Schlossberg-Kunkel holds a BA in Psychology and an MA in School Counseling from Marymount University. After moving to the Rural Crescent in Prince William County in 2002, she witnessed firsthand how land use decisions can shape and permanently alter the quality of life for entire communities.',
      'She established The Coalition to Protect Prince William County and has since become a leading voice on smart growth policy and conservation. Her work offers Frederick County residents a direct window into how similar fights have unfolded in neighboring jurisdictions—and what strategies have been most effective.',
    ],
  
  },
]

function PanelistCard({ panelist }) {
  const [open, setOpen] = useState(false)
  const bodyRef = useRef(null)

  return (
    <div className={`${styles.card} ${open ? styles.cardOpen : ''}`}>
      <button className={styles.cardTrigger} onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <div className={styles.cardTop}>
          <span className={styles.cardCredential}>{panelist.credential}</span>
          <span className={`${styles.cardChevron} ${open ? styles.cardChevronOpen : ''}`}>▾</span>
        </div>
        <div className={styles.cardName}>{panelist.name}</div>
        <div className={styles.cardTitle}>{panelist.title}</div>
        <div className={styles.cardHint}>{open ? 'Close' : 'Read bio'}</div>
      </button>

      <div
        ref={bodyRef}
        className={styles.cardBody}
        style={{ maxHeight: open ? bodyRef.current?.scrollHeight + 'px' : '0px' }}
      >
        <div className={styles.cardBodyInner}>
          {panelist.bio.map((p, i) => <p key={i}>{p}</p>)}
          {panelist.note && (
            <div className={styles.cardNote}>
              <strong>Why karst geology matters: </strong>{panelist.note}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CommunityForum() {
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
        <div className={styles.pageHeaderVol}>Community Forum · April 15, 2026</div>
        <h1>Fact vs. Fiction:<br /><em>A Community Forum</em></h1>
        <p className={styles.pageHeaderDeck}>
          What's being proposed for Frederick County? What's fact versus fiction, and what does it actually mean for our community?
        </p>
        <div className={styles.eventMeta}>
          <div className={styles.eventMetaItem}>
            <span className={styles.eventMetaLabel}>Date</span>
            <span className={styles.eventMetaValue}>Wednesday, April 15, 2026</span>
          </div>
          <div className={styles.eventMetaDivider} />
          <div className={styles.eventMetaItem}>
            <span className={styles.eventMetaLabel}>Time</span>
            <span className={styles.eventMetaValue}>6:30 PM – 9:00 PM</span>
          </div>
          <div className={styles.eventMetaDivider} />
          <div className={styles.eventMetaItem}>
            <span className={styles.eventMetaLabel}>Location</span>
            <span className={styles.eventMetaValue}>Trumpet Vine Farm</span>
          </div>
        </div>
      </div>

      <main className={styles.pageMain}>

        {/* ── Intro ── */}
        <div className={`${styles.sectionIntro} fade-up`} ref={fadeRef}>
          Join us for an in-depth community discussion featuring a panel of experienced professionals who will provide insight into the key issues facing Frederick County. A moderated Q&amp;A session will follow, offering attendees, including community members and local officials, the opportunity to ask questions and engage directly with the panel. All community members are encouraged to attend.
        </div>

        {/* ── Panelists ── */}
        <div className="fade-up" ref={fadeRef}>
          <span className={styles.sectionLabel}>Featured Panelists</span>
          <h2 className={styles.sectionTitle}>Experienced Professionals.<br />Independent Voices.</h2>
          <div className={styles.cardGrid}>
            {panelists.map(p => <PanelistCard key={p.name} panelist={p} />)}
          </div>
        </div>

        <hr className={styles.sectionDivider} />

        {/* ── Format ── */}
        <div className="fade-up" ref={fadeRef}>
          <span className={styles.sectionLabel}>Event Format</span>
          <h2 className={styles.sectionTitle}>An Evening of Informed Discussion</h2>
          <div className={styles.formatGrid}>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>6:30 PM</div>
              <div className={styles.formatLabel}>Doors Open</div>
              <div className={styles.formatDesc}>Arrive, find a seat, meet neighbors.</div>
            </div>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>6:45 PM</div>
              <div className={styles.formatLabel}>Panel Presentations</div>
              <div className={styles.formatDesc}>Each panelist presents their area of expertise: industrial hygiene, environmental health, geology and aquifer systems, and regional land use lessons.</div>
            </div>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>~7:45 PM</div>
              <div className={styles.formatLabel}>Moderated Q&amp;A</div>
              <div className={styles.formatDesc}>Community members and local officials are invited to ask questions directly. This is an open forum. Bring your questions.</div>
            </div>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>9:00 PM</div>
              <div className={styles.formatLabel}>Close</div>
              <div className={styles.formatDesc}>Informal conversation continues.</div>
            </div>
          </div>
        </div>

        <hr className={styles.sectionDivider} />

        {/* ── Why this forum matters ── */}
        <div className="fade-up" ref={fadeRef}>
          <span className={styles.sectionLabel}>Why This Matters</span>
          <h2 className={styles.sectionTitle}>Get the Full Picture</h2>
          <p className={styles.sectionIntroText}>The county's own forums have featured presentations by organizations with a direct financial stake in data center expansion. This event is different: the panelists have no financial interest in the outcome. Their job is to give you the information you need to evaluate what is actually being proposed and what it would actually mean for the county's air, water, land, and future.</p>
          <div className={styles.topicGrid}>
            <div className={styles.topicItem}>
              <div className={styles.topicLabel}>Water & Aquifers</div>
              <div className={styles.topicDesc}>How does large-scale industrial development interact with karst geology and the underground water systems Frederick County depends on?</div>
            </div>
            <div className={styles.topicItem}>
              <div className={styles.topicLabel}>Air Quality & Health</div>
              <div className={styles.topicDesc}>What are the occupational and community health implications of diesel backup generators, cooling systems, and industrial emissions at scale?</div>
            </div>
            <div className={styles.topicItem}>
              <div className={styles.topicLabel}>Agricultural Land</div>
              <div className={styles.topicDesc}>What does losing prime farmland mean for the long-term sustainability and identity of the region and is it reversible?</div>
            </div>
            <div className={styles.topicItem}>
              <div className={styles.topicLabel}>Regulatory Reality</div>
              <div className={styles.topicDesc}>What protections actually exist? What has worked and failed in other communities that have faced similar proposals?</div>
            </div>
          </div>
        </div>

        {/* ── Location notice ── */}
        <div className={`${styles.locationNotice} fade-up`} ref={fadeRef}>
          <div className={styles.locationNoticeInner}>
            <div className={styles.locationNoticeLabel}>Location</div>
            <div className={styles.locationNoticeText}>Trumpet Vine Farm</div>
            <div className={styles.locationNoticeSub}> This event is free and open to all Frederick County community members. Address is 266 Vaucluse Rd, Stephens City, VA 22655 </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className={`${styles.pageCta} fade-up`} ref={fadeRef}>
          <div className={styles.pageCtaText}><strong>Make your voice heard.</strong> Attend the forum, ask your questions, and sign the petition before the next Board of Supervisors vote.</div>
          <Link href="/petition" className={styles.pageCtaBtn}>Sign the Petition →</Link>
        </div>

      </main>
    </>
  )
}
