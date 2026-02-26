'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from '@/styles/forums.module.css'

const references = [
  { id: 'ref-1', label: '[1] VEDP Mandate & Data Center Market Share', text: 'Virginia Economic Development Partnership. "Data Centers." vedp.org/industry/data-centers' },
  { id: 'ref-2', label: '[2] VEDP Marketing & Branding', text: '"Virginia: The Center of Your Digital World." centerofyourdigitalworld.org/virginia' },
  { id: 'ref-3', label: '[3] VEDP Industry Incentives & JLARC', text: 'Joint Legislative Audit and Review Commission. "Data Centers in Virginia." JLARC Report 598, December 2024. jlarc.virginia.gov/landing-2024-data-centers-in-virginia.asp' },
  { id: 'ref-4', label: '[4] Valley Innovation Park Grant', text: '"21 Va. industrial sites awarded $90M for development." Virginia Business, 2024. virginiabusiness.com' },
  { id: 'ref-5', label: '[5] Vince Barnett Profile', text: 'Virginia Economic Development Partnership. "Vince Barnett." vedp.org/profile/vince-barnett' },
  { id: 'ref-6', label: '[6] EDA Board Composition & Patrick Barker', text: 'Frederick County EDA. yesfrederickva.com/contact. "Data centers stir debate in Frederick." Virginia Business. virginiabusiness.com/frederick-county-data-centers-fact-sheet/' },
  { id: 'ref-7', label: '[7] Jason Aikens / Aikens Group Conflicts', text: 'Frederick County Board of Supervisors. fcva.us/departments/board-of-supervisors. PC 11-06-24 Meeting Agenda, Frederick County Community Development records.' },
  { id: 'ref-8', label: '[8] Frederick County Tax Rate History & Budget', text: 'Frederick County. "Real Estate Taxes and Rates." fcva.us. FY 2026 Proposed Budget. OpenGov.' },
  { id: 'ref-9', label: '[9] FirstEnergy CEO Investor Statements & Load Growth', text: '"FirstEnergy expects peak load to grow 45% by 2035 on data centers." Utility Dive, 2025. utilitydive.com/news/firstenergy-data-centers-earnings/803612/' },
  { id: 'ref-10', label: '[10] FirstEnergy Ohio Bribery Scandal', text: '"After Ohio\'s landmark decisions on HB 6 utility scandal, what\'s next?" Canary Media. canarymedia.com. "Ohio PUC orders FirstEnergy utilities to pay $250.7M." Utility Dive.' },
  { id: 'ref-11', label: '[11] Potomac Edison / Maryland Customer Exposure', text: 'Maryland Office of People\'s Counsel. "Decision Closing Investigation Exposes Potomac Edison Customers to Untold Costs and Risks." GovDelivery, 2024.' },
  { id: 'ref-12', label: '[12] REC Hyperscale Risk & HES Subsidiary', text: '"Balancing Growth and Affordability: REC Announces Hyperscale Energy Services." myrec.coop. "Co-Op Risks." The New Energy Crisis. thenewenergycrisis.com/series/part-4' },
  { id: 'ref-13', label: '[13] SVEC Grid Alert & Service Territory', text: 'Shenandoah Valley Electric Cooperative. "Potential Need to Reduce Electric Load." svec.coop/alerts/. JLARC Report 598, December 2024.' },
  { id: 'ref-14', label: '[14] Forum Structure & IAP2 Engagement Standards', text: 'Frederick County. "Public Information and Engagement Forums." fcva.us. IAP2 Spectrum of Public Participation. iap2.org' },
  { id: 'ref-15', label: '[15] Planning Staff Fact Sheet', text: 'Frederick County Planning Commission, January 7, 2026. "Frederick County hears sustained public opposition as planning staff outlines data center report." Citizen Portal. citizenportal.ai' },
]

function Cite({ r }) {
  return <a href={`#${r}`} className={styles.cite}>[{r.replace('ref-', '')}]</a>
}

export default function Forums() {
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
        <div className={styles.pageHeaderVol}>Know Who's in the Room · February 2026</div>
        <h1>Who's Behind<br /><em>the Forums</em></h1>
        <p className={styles.pageHeaderDeck}>
          The February 24 forum featured presentations from organizations with a direct financial stake in data center expansion. Residents called it out and the February 26 forum was postponed. This is who they are, what they stand to gain, and what they won't tell you.
        </p>
      </div>

      <main className={styles.pageMain}>

        {/* ── Intro ── */}
        <div className={`${styles.sectionIntro} fade-up`} ref={fadeRef}>
          These forums are billed as "Public Information and Engagement." But the presenting organizations the Virginia Economic Development Partnership, the Frederick County EDA, FirstEnergy/Potomac Edison, REC, and SVEC are not neutral parties. Each has a financial or institutional interest in seeing data center development proceed. Understanding those interests is not cynicism. It is the minimum standard for informed participation.
        </div>

        {/* ── VEDP ── */}
        <div className={`${styles.profileBlock} fade-up`} ref={fadeRef}>
          <div className={styles.profileHeader}>
            <span className={styles.profileOrg}>Virginia Economic Development Partnership</span>
            <div className={styles.profileName}>Vince Barnett</div>
            <div className={styles.profileTitle}>Industry Leader, Data Centers, Strategic Projects and Lead Generation</div>
          </div>
          <span className={styles.conflictTag}>Conflict of Interest: Institutional</span>
          <div className={styles.profileBody}>
            <p>The VEDP's statutory mandate is the "recruitment of industry" to Virginia.<Cite r="ref-1" /> By its own admission, Virginia hosts the largest data center market in the world: over 35% of all known hyperscale data centers globally.<Cite r="ref-1" /> That did not happen by accident. It is the result of a deliberate, multi-decade strategy of aggressive marketing, tax incentive coordination, and taxpayer-funded site preparation.</p>
            <p>Vince Barnett's professional role is to "identify and convert high-potential leads and prospects into project opportunities."<Cite r="ref-5" /> His prior title was Vice President of Communications and Promotions. <b>He is, by his own job description, a salesperson.</b> There is no public record of Barnett presenting at a community meeting to advocate against a project or validate concerns about rural preservation.</p>
            <div className={styles.pullQuote}>
              <p>"Virginia: The Center of Your Digital World."</p>
              <cite>VEDP marketing tagline, centerofyourdigitalworld.org <Cite r="ref-2" /></cite>
            </div>
            <p>The VEDP cannot simultaneously market Virginia as the world's data center capital and provide an objective assessment of the costs to Frederick County residents. That is not a personal critique of Barnett. It is a structural impossibility built into the agency's mission.</p>
          </div>
          <div className={styles.dataBox}>
            <div className={styles.dataBoxLabel}>VEDP by the Numbers</div>
            <div className={styles.dataRow}><span className={styles.dataKey}>Virginia's global hyperscale market share</span><span className={styles.dataVal}>~35% of world total <Cite r="ref-1" /></span></div>
            <div className={styles.dataRow}><span className={styles.dataKey}>Industry tax exemptions facilitated (FY23)</span><span className={styles.dataVal}>$928.6 million <Cite r="ref-3" /></span></div>
            <div className={styles.dataRow}><span className={styles.dataKey}>Share of VEDP-tracked capital investment from data centers (FY22–24)</span><span className={styles.dataVal}>84% <Cite r="ref-3" /></span></div>
            <div className={styles.dataRow}><span className={styles.dataKey}>VBRSP grant awarded for Frederick County's Valley Innovation Park</span><span className={styles.dataVal}>$7.225 million <Cite r="ref-4" /></span></div>
          </div>
        </div>

        {/* ── EDA ── */}
        <div className={`${styles.profileBlock} fade-up`} ref={fadeRef}>
          <div className={styles.profileHeader}>
            <span className={styles.profileOrg}>Frederick County Economic Development Authority</span>
            <div className={styles.profileName}>Patrick Barker, CEcD</div>
            <div className={styles.profileTitle}>Executive Director, Frederick County EDA</div>
          </div>
          <span className={styles.conflictTag}>Conflict of Interest: Board Composition</span>
          <div className={styles.profileBody}>
            <p>The EDA is a quasi-governmental body funded by local taxpayers, but its mandate is the "recruitment of target businesses." Barker has publicly described data centers as one of the "most physically productive uses of land" and has framed community opposition as "passion" rooted in "conflicting information."<Cite r="ref-6" /> His definition of an "informed" discussion focuses exclusively on fiscal benefits like debt service coverage for school construction.</p>
            <p><b>The EDA Board of Directors is the deeper problem.</b> Six of the seven board members represent real estate development, industrial manufacturing, and large-scale finance. Jason Aikens, simultaneously a county Supervisor for Gainesboro District, is Vice President of the Aikens Group, a major regional real estate firm with active applications for data center-ready properties in Frederick County.<Cite r="ref-7" /> When Aikens presents a "Development Overview" at a public forum, he is doing so as a representative of the same development class that benefits from industrial expansion.</p>
            <div className={styles.warningBox}>
              <p><b>The budget shortfall being used to justify data centers is not a crisis. It is a policy choice.</b> Frederick County cut its real estate tax rate from $0.61 per $100 assessed value in 2021 to $0.48 by 2025, a 21% reduction.<Cite r="ref-8" /> At the 2021 rate, the county would collect an additional $15.7 million per year. That is almost exactly the $15 million annual shortfall officials cite when arguing data centers are necessary.<Cite r="ref-8" /> The county did not fall into a fiscal hole. It cut taxes and then pointed to the hole.</p>
            </div>
          </div>
        </div>

        <hr className={styles.sectionDivider} />

        {/* ── Utilities header ── */}
        <span className={styles.sectionLabel}>The Utilities</span>
        <h2 className={styles.sectionTitle}>Your Power Bills Are Their Growth Engine</h2>
        <p className={styles.sectionIntro}>The three utilities presenting at the forums (FirstEnergy/Potomac Edison, REC, and SVEC) are not disinterested infrastructure providers. Each has a direct financial relationship with the data center industry. Their presentations will focus on "reliability" and "capacity." Here is what that language actually means for you.</p>

        {/* ── FirstEnergy ── */}
        <div className={`${styles.profileBlock} fade-up`} ref={fadeRef}>
          <div className={styles.profileHeader}>
            <span className={styles.profileOrg}>FirstEnergy / Potomac Edison</span>
            <div className={styles.profileName}>Linda Moss</div>
            <div className={styles.profileTitle}>President, Maryland Operations, Potomac Edison</div>
          </div>
          <span className={styles.conflictTag}>Conflict of Interest: Shareholder Profit + Federal Bribery Record</span>
          <div className={styles.profileBody}>
            <p>FirstEnergy is an investor-owned utility. For investor-owned utilities, "load growth" is the engine of profit. Data centers are uniquely valuable because they require expensive high-voltage transmission lines and substations. Under current regulatory frameworks, FirstEnergy receives a guaranteed return on equity for every dollar of infrastructure it builds, which is then recovered from all ratepayers.</p>
            <div className={styles.pullQuote}>
              <p>"Our company-wide transmission assets are a terrific growth engine."</p>
              <cite>Brian Tierney, FirstEnergy CEO, to investors <Cite r="ref-9" /></cite>
            </div>
            <p>FirstEnergy projects its transmission rate base will grow up to 18% annually through 2030, driven almost entirely by data center demand.<Cite r="ref-9" /> The company has committed to a $28 billion capital expenditure plan, with $14 billion for transmission.<Cite r="ref-9" /> <b>The more expensive infrastructure they build in Frederick County, the more profit they make for shareholders, regardless of whether it is good for residents.</b></p>
            <p>Linda Moss has publicly described the Quantum Frederick data center campus in Maryland as "transformational." Her presentations focus on "system enhancements" and "reliable power." They rarely mention that residential utility bills in FirstEnergy's territories increased by an average of 11% last year.<Cite r="ref-9" /></p>
            <div className={styles.warningBox}>
              <p><b>FirstEnergy agreed to pay $230 million in 2021</b> as part of a deferred prosecution agreement for a $60 million bribery scheme in Ohio: payments to public officials to pass legislation bailing out unprofitable plants.<Cite r="ref-10" /> In November 2025, Ohio regulators ordered an additional $250.7 million in refunds and civil forfeitures for related violations.<Cite r="ref-10" /> Consumer advocates in Maryland have warned that Potomac Edison customers may have been "exposed to untold costs and risks" and that customer dollars were "channeled to organizations that funded bribes."<Cite r="ref-11" /> This is the company presenting itself as a trusted partner in Frederick County's future.</p>
            </div>
            <div className={styles.dataBox}>
              <div className={styles.dataBoxLabel}>FirstEnergy Financial Snapshot</div>
              <div className={styles.dataRow}><span className={styles.dataKey}>Total capital expenditure plan (2025–2029)</span><span className={styles.dataVal}>$28 billion <Cite r="ref-9" /></span></div>
              <div className={styles.dataRow}><span className={styles.dataKey}>Transmission investment</span><span className={styles.dataVal}>$14 billion <Cite r="ref-9" /></span></div>
              <div className={styles.dataRow}><span className={styles.dataKey}>Projected peak load growth by 2035</span><span className={styles.dataVal}>+45% (15 GW) <Cite r="ref-9" /></span></div>
              <div className={styles.dataRow}><span className={styles.dataKey}>Projected transmission rate base growth</span><span className={styles.dataVal}>Up to 18% per year through 2030 <Cite r="ref-9" /></span></div>
              <div className={styles.dataRow}><span className={styles.dataKey}>Ohio bribery penalty (total)</span><span className={styles.dataVal}>~$640 million <Cite r="ref-10" /></span></div>
              <div className={styles.dataRow}><span className={styles.dataKey}>Average residential bill increase (2024–25)</span><span className={styles.dataVal}>11% <Cite r="ref-9" /></span></div>
            </div>
          </div>
        </div>

        {/* ── REC ── */}
        <div className={`${styles.profileBlock} fade-up`} ref={fadeRef}>
          <div className={styles.profileHeader}>
            <span className={styles.profileOrg}>Rappahannock Electric Cooperative</span>
            <div className={styles.profileName}>John Hewa</div>
            <div className={styles.profileTitle}>CEO, Rappahannock Electric Cooperative</div>
          </div>
          <span className={styles.conflictTag}>Conflict of Interest: Co-op Bankruptcy Risk to Members</span>
          <div className={styles.profileBody}>
            <p>REC is member-owned, which sets it apart from FirstEnergy. But the scale of data center demand has created a risk that Hewa himself has described in stark terms: a single hyperscale data center could have a weekly electricity bill of $50 million. REC's total weekly power purchase cost is $6.5 million.<Cite r="ref-12" /> <b>If a data center were even late on a payment, it could take down the co-op.</b> Those are Hewa's own words, not an opponent's characterization.</p>
            <p>To address this, REC created Hyperscale Energy Services (HES), a subsidiary designed to "financially insulate" residential members by walling off data center accounts. Hewa lobbied the Virginia legislature to loosen cooperative business constraints to allow this structure. But Hewa has also admitted he "can't promise that co-op members are fully protected" even with HES in place.<Cite r="ref-12" /></p>
            <p>At the forum, REC will likely present HES as a solution. It is worth remembering that HES exists precisely because the risk to members is so catastrophic that a subsidiary was required. The question is not whether the safeguard exists. The question is why the risk is being accepted at all.</p>
          </div>
        </div>

        {/* ── SVEC ── */}
        <div className={`${styles.profileBlock} fade-up`} ref={fadeRef}>
          <div className={styles.profileHeader}>
            <span className={styles.profileOrg}>Shenandoah Valley Electric Cooperative</span>
            <div className={styles.profileName}>SVEC Representative</div>
            <div className={styles.profileTitle}>Shenandoah Valley Electric Cooperative</div>
          </div>
          <span className={styles.conflictTag}>Conflict of Interest: Member Exposure Without REC's Protections</span>
          <div className={styles.profileBody}>
            <p>SVEC serves the Winchester and Stephens City areas, directly in the path of proposed data center corridors. Unlike REC, SVEC has not created an HES-style subsidiary to protect members from industrial default. The 2024 JLARC study warns that co-op members are at risk of "substantial financial liabilities" if a large industrial customer fails to pay.<Cite r="ref-3" /> SVEC members may currently be more exposed than REC members.</p>
            <p>In January 2026, SVEC issued alerts regarding a "potential need to reduce electric load" at the direction of the regional grid operator, PJM.<Cite r="ref-13" /> The JLARC report also warns of "stranded assets": infrastructure overbuilt for data center demand that becomes a liability for all ratepayers if that demand fluctuates or if data centers choose to buy power elsewhere.</p>
            <div className={styles.pullQuote}>
              <p>A question worth asking at the forum: Does SVEC have the same financial protections as REC, or are Frederick County members currently 100% liable for a data center default?</p>
            </div>
          </div>
        </div>

        <hr className={styles.sectionDivider} />

        {/* ── Forum Design ── */}
        <div className="fade-up" ref={fadeRef}>
          <span className={styles.sectionLabel}>Forum Design</span>
          <h2 className={styles.sectionTitle}>This Is Not a Consultation</h2>
          <div className={styles.sectionIntro}>
            The International Association for Public Participation defines five levels of community engagement.<Cite r="ref-14" /> Frederick County's forums meet the lowest: "Inform." A one-way flow of information. No alternatives to industrialization are presented. No mechanism exists for resident input to stop a project.
          </div>
          <div className={styles.profileBody}>
            <p>The 120-minute format allocates roughly 60 minutes to presentations by the industry's partners and roughly 60 minutes to "Community Questions," with a 2-to-3-minute limit per speaker. That means 20 to 30 residents will have the opportunity to speak. Questions submitted in advance allow presenters to consolidate concerns into vague reassurances about "grid reliability" and "tax benefits."</p>
            <p>The county's own planning staff acknowledged in January 2026 that the fact sheet they presented was a "tip-of-the-iceberg" review.<Cite r="ref-15" /> Site-specific data is withheld under nondisclosure agreements negotiated between the EDA and developers before the public is ever informed. By the time a project reaches a public hearing, most of the terms are already set.</p>
            <div className={styles.warningBox}>
              <p><b>Attend. Speak. Make your 2 minutes count.</b> But understand that the forum is not designed to stop anything. The petition, the supervisors' contact tool, and the November 2026 elections are where decisions actually get made. Use tonight as a place to ask the questions that do not have comfortable answers. The questions in our <Link href="/documents" style={{color:'var(--barn)',fontWeight:700}}>Resources section</Link> were written exactly for that purpose.</p>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className={`${styles.pageCta} fade-up`} ref={fadeRef}>
          <div className={styles.pageCtaText}><strong>Your name matters.</strong> Over 100 Frederick County residents have already signed. Add yours before tonight's forum.</div>
          <Link href="/petition" className={styles.pageCtaBtn}>Sign the Petition →</Link>
        </div>

      </main>

      {/* ── References ── */}
      <section className={styles.refsSection}>
        <div className={styles.refsInner}>
          <div className={styles.refsLabel}>Sources & References</div>
          <div className={styles.refsList}>
            {references.map(ref => (
              <div key={ref.id} id={ref.id} className={styles.refItem}>
                <span className={styles.refNum}>{ref.label.match(/\[\d+\]/)[0]}</span>
                {ref.label.replace(/\[\d+\]\s*/, '')} — {ref.text}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}