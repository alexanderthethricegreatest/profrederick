'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from '@/styles/community-forum.module.css'

const videos = [
  { id: 'jlRhRjAGMMA', title: 'The Real Cost of Data Centers — Part 1' },
  { id: 'bF3nsJWFk9A', title: 'The Real Cost of Data Centers — Part 2' },
  { id: 'vGJfJ4PWmYo', title: 'The Real Cost of Data Centers — Part 3' },
  { id: 'Dv3okxBFg3g', title: 'Martha Sadlick — Karst Geology & Aquifer Vulnerability' },
  { id: 'edU_RtIE1jo', title: 'Community Q&A — Session 1' },
  { id: 'KWi-mcqST4E', title: 'Community Q&A — Session 2' },
]

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
      'Martha Saddlick holds a geology degree from James Madison University and brings 45+ years of experience as a senior geophysicist/geologist, including work with Shell, Total, and Conoco.',
      'Her career has focused on geologic and geophysical analysis for exploration and development projects across the North Sea, Philippines, Côte d’Ivoire, Gulf of America, and Pennsylvania.',
      'Raised on a family farm near Strasburg, VA, she brings deep knowledge of Shenandoah Valley geology and a strong understanding of subsurface systems, fluid flow, and environmental considerations.',
      'She brings with her the perspective of someone with roots in the land, who understands what is at stake beyond the spreadsheets and economic projections.', 
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
  { credential: 'Economist and Professor',
    name: 'Nathan Russell, MA',
    title: 'Assistant Professor of Economics at Patrick Henry College ',
    bio: [
      'His work focuses on public choice, public finance, and the practical application of economic ideas, particularly as they relate to policy and real-world decision-making.', 
      'Prior to his academic career, he worked with organizations including the Charles G. Koch Foundation, the Regulatory Economics Group, and the Mackinac Center for Public Policy, where his work included economic education methodology, corporate cost and profitability analysis, and assessment of state economic and educational policy.',
      ]
  },
  { credential: 'Moderator · Technology & Cybersecurity Expert',
    name: 'Tony Cole',
    title: 'Technology Leadership, Cybersecurity, and Global Risk Expert · Frederick County Resident',
    bio: [
      'With nearly 40 years of experience at the highest levels of cybersecurity, global risk, and technology leadership, Mr. Cole brings a depth of insight that few can match, from helping stand up the Pentagon’s cyber response team to advising international organizations and major corporations on digital risk.',
      'Mr. Cole’s understanding of the long-term implications of data centers and his status as a Frederick County resident enable him to help us navigate this citical discussion with our panel of experts ranging in industrial hygiene, water/noise/sound/air quality, electric grid management, our region’s karst geology, and small business and economic impacts.  '
      ]
  }
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
          On April 15, 2026, community members gathered at Trumpet Vine Farm for an in-depth forum featuring a panel of experienced professionals. Topics included the health and environmental impacts of large-scale data center development, Frederick County's karst geology and aquifer vulnerability, what neighboring communities have experienced, and the economic reality behind the promises. The full recordings are available below.
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
          <h2 className={styles.sectionTitle}>How the Evening Unfolded</h2>
          <div className={styles.formatGrid}>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>6:00 PM</div>
              <div className={styles.formatLabel}>Doors Opened</div>
              <div className={styles.formatDesc}>Guests arrived, signed in, and found seating. Display materials, handouts, and a resource table were available.</div>
            </div>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>6:30 PM</div>
              <div className={styles.formatLabel}>Welcome &amp; Opening Remarks</div>
              <div className={styles.formatDesc}>The evening opened with an introduction of its purpose and a brief overview: an informed, civil, community-first conversation, open to all including Board of Supervisors members.</div>
            </div>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>6:35 PM</div>
              <div className={styles.formatLabel}>Introduction of Panel</div>
              <div className={styles.formatDesc}>The moderator introduced each panelist by name, title, and credential summary.</div>
            </div>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>6:40 PM</div>
              <div className={styles.formatLabel}>Block 1: Health &amp; Environmental Impact</div>
              <div className={styles.formatDesc}>What large-scale data center development actually means for the air, water, and people of Frederick County.
                <ul className={styles.formatSpeakerList}>
                  <li><strong>Tammy Clark</strong> — Occupational health, air quality, regulatory compliance and what it means for surrounding residents (15 min)</li>
                  <li><strong>Kristen Meghan Kelly</strong> — Environmental health impacts, what industrial hygiene data from similar developments shows (15 min)</li>
                  <li><strong>Martha Saddlick</strong> — Frederick County's karst geology and aquifer vulnerability, what subsurface development risk looks like here specifically (15 min)</li>
                </ul>
              </div>
            </div>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>7:25 PM</div>
              <div className={styles.formatLabel}>Block 2: What Are Communities Actually Being Promised?</div>
              <div className={styles.formatDesc}>A broader look at data center development across Virginia and the country: what the economic promises typically look like versus reality, what the fight looks like in other communities, and what winning actually means.
                <ul className={styles.formatSpeakerList}>
                  <li><strong>Elena Schlossberg-Kunkel</strong> — The Prince William County coalition model, how they organized, what worked, and what Frederick County can learn from it</li>
                  <li><strong>Nathan Russell</strong> — Economic analysis, what counties are actually promised versus what they receive, and the public finance reality behind the data centers or higher taxes argument</li>
                </ul>
              </div>
            </div>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>7:45 PM</div>
              <div className={styles.formatLabel}>Moderated Q&amp;A — Community Open Mic</div>
              <div className={styles.formatDesc}>Frederick County residents asked questions, about 1 minute each. Moderated to ensure all voices were heard. Open mic ran through 9:00 PM.</div>
            </div>
            <div className={styles.formatItem}>
              <div className={styles.formatTime}>9:00 PM</div>
              <div className={styles.formatLabel}>Adjourn</div>
              <div className={styles.formatDesc}>The panel remained available for informal conversation. The resource table stayed open and media availability followed.</div>
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

        <hr className={styles.sectionDivider} />

        {/* ── Recordings ── */}
        <div className="fade-up" ref={fadeRef}>
          <span className={styles.sectionLabel}>Watch the Recording</span>
          <h2 className={styles.sectionTitle}>Full Event Coverage</h2>
          <p className={styles.sectionIntroText}>The forum was recorded and posted in full. Watch the panel presentations and community Q&A sessions below.</p>
          <div className={styles.videoGrid}>
            {videos.map(v => (
              <div key={v.id} className={styles.videoItem}>
                <div className={styles.videoEmbed}>
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className={styles.videoTitle}>{v.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className={`${styles.pageCta} fade-up`} ref={fadeRef}>
          <div className={styles.pageCtaText}><strong>Make your voice heard.</strong> Share this recording with neighbors, and sign the petition before the next Board of Supervisors vote.</div>
          <Link href="/petition" className={styles.pageCtaBtn}>Sign the Petition →</Link>
        </div>

      </main>
    </>
  )
}
