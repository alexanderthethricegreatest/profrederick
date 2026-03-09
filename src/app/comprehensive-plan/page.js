'use client'

import { useState } from 'react'
import styles from '@/styles/comprehensive-plan.module.css'

const PHASES = [
  {
    number: 'I',
    label: 'Stakeholder Interviews',
    duration: '5–6 months',
    status: 'complete',
    period: 'Summer–Fall 2025',
    description: 'County interviewed Board of Supervisors members, Planning Commissioners, utility providers, schools, EDA, and other stakeholders. This is where the initial "framing" of the plan was established, including the "business friendly" and "aggressive economic development" language that now appears in the official stakeholder summary.',
    warning: null,
  },
  {
    number: 'II',
    label: 'Topic-Based Community Events',
    duration: '6 months',
    status: 'active',
    period: 'Late 2025–Mid 2026',
    description: 'Community meetings organized around five topic areas: Transportation, Housing & Community Facilities, Water & Natural Resources, Industry & Commerce, and Rural Areas & Agribusiness. Each topic area generates public input that shapes the draft plan.',
    warning: 'This is the critical window. The "Industry & Commerce" sessions are where data center interests will attempt to embed favorable language into the community vision. Your voice here shapes what gets written into the draft plan.',
  },
  {
    number: 'III',
    label: 'Plan Formulation',
    duration: '3–5 months',
    status: 'upcoming',
    period: 'Mid–Late 2026',
    description: 'County staff drafts the new plan based on Phase I and II input. The Comprehensive Plans and Programs Committee (CPPC) reviews the initial draft. This is where community input becomes policy language.',
    warning: 'Once the draft is written, changes become much harder. Language that was not raised in Phase II community meetings will be difficult to add or remove at this stage.',
  },
  {
    number: 'IV',
    label: 'Community Review',
    duration: '4 months',
    status: 'upcoming',
    period: 'Late 2026–Early 2027',
    description: 'Large and small format community meetings present the draft plan across all six magisterial districts. Community surveys collect final feedback. Additional concerns can trigger plan revisions.',
    warning: null,
  },
  {
    number: 'V',
    label: 'Adoption',
    duration: '3–6 months',
    status: 'upcoming',
    period: 'Mid-2027',
    description: 'Public hearings before the Planning Commission and Board of Supervisors. VDOT Chapter 529 review (approximately 90 days). Final vote on the 2050 Comprehensive Plan.',
    warning: 'At this stage, the plan is essentially locked. Public comment is still possible but changes are rare. Everything that happens before this point matters more.',
  },
]

const LANGUAGE_ITEMS = [
  {
    id: 'business-friendly',
    label: '"Business Friendly" Development',
    source: 'BOS/PC/Stakeholder Summary, Nov 2025',
    quote: '"Business friendly" approach towards development has been missing in recent years. County needs to be "aggressive" in luring desired types of development.',
    concern: 'This framing, sourced directly from elected officials and stakeholders, sets up the 2050 plan to prioritize attracting large-scale industrial development. Data centers are categorized under "Industry & Commerce." If the plan adopts "aggressive" economic development language without carve-outs for water, power, and land impacts, it becomes a green light for the data center industry.',
  },
  {
    id: 'targeted-industries',
    label: 'Targeted Industries & Where They Go',
    source: 'BOS/PC/Stakeholder Summary, Nov 2025',
    quote: 'Economic development and developing desired industries can increase tax revenue. Need to review targeted industries identified in the Plan and speak to where in the County they should develop.',
    concern: 'The phrase "where in the County they should develop" is the key. If data centers are listed as a targeted industry and assigned to specific zones (particularly TM (Technology-Manufacturing) districts near the I-81 corridor), the comp plan effectively pre-approves their expansion. Every future rezoning application can then point to the plan as justification.',
  },
  {
    id: 'water-infrastructure',
    label: 'Water & Infrastructure Requirements',
    source: 'BOS/PC/Stakeholder Summary, Nov 2025',
    quote: 'Water and sewer infrastructure, utilities/power and broadband need to be clearly addressed.',
    concern: 'Frederick County sits on karst limestone terrain, a geology that makes groundwater contamination risk significantly higher than average. Data centers consume millions of gallons of water for cooling and generate substantial wastewater. The comp plan must include binding infrastructure impact language, not just aspirational notes. Without it, individual applications can proceed without comprehensive water assessments.',
  },
  {
    id: 'rural-preservation',
    label: 'Undefined Rural Preservation',
    source: 'BOS/PC/Stakeholder Summary, Nov 2025',
    quote: 'Better define what rural preservation means to the county in 2025. Is it agriculture? Open space? Rural residences and rural subdivisions? Something else?',
    concern: 'The plan has not yet defined what rural preservation means, and that ambiguity is a strategic opening. Without a clear definition that explicitly includes protections against industrial-scale development on agricultural land, data center developers can argue that a TM-zoned parcel adjacent to farmland is consistent with the plan\'s rural policies.',
  },
  {
    id: 'high-growth',
    label: 'The "High Growth Reality" Frame',
    source: 'BOS/PC/Stakeholder Summary, Nov 2025',
    quote: '"Small community mentality" versus "high growth reality."',
    concern: 'Frederick County is the 6th fastest-growing jurisdiction in Virginia, with an 8.3% growth rate driven primarily by migration from Northern Virginia and Winchester. That growth is real. But framing rural preservation values as a "small community mentality" to be overcome is a rhetorical move that dismisses legitimate community concerns as nostalgia. The 2050 plan should be able to manage growth without treating preservation as an obstacle.',
  },
]

const FAQS = [
  {
    q: 'What is a Comprehensive Plan?',
    a: 'A Comprehensive Plan is the legal document that guides all land use decisions in Frederick County for the next 25 years. It sets the vision, goals, and policies that the Board of Supervisors, Planning Commission, and staff must follow when evaluating rezonings, permits, and development applications. It is not a zoning ordinance. It doesn\'t directly regulate individual parcels. But every rezoning decision must be "substantially consistent" with the plan. That makes the plan\'s language enormously powerful.',
  },
  {
    q: 'Why does it matter for data centers specifically?',
    a: 'Right now, data center applications are evaluated case-by-case. If the 2050 Comprehensive Plan explicitly includes data centers as a "targeted industry" or expands TM zoning guidance to accommodate them, future applications can point to the plan as justification for approval. It shifts the burden of proof: instead of developers having to demonstrate why a data center is consistent with county policy, opponents would have to show why it isn\'t fighting uphill against the county\'s own adopted plan.',
  },
  {
    q: 'How fast is Frederick County actually growing?',
    a: 'Frederick County currently has an 8.3% growth rate, ranking it as the 6th fastest-growing jurisdiction in Virginia. Growth is driven primarily by net migration from high-cost centers in Northern Virginia and the City of Winchester. The county\'s median age is 41.8 (above Virginia\'s 39.3 average) and average family size is 3.18, both indicators of sustained demand for schools, parks, and public services.',
  },
  {
    q: 'When was the last Comprehensive Plan adopted?',
    a: 'Frederick County\'s current plan was last updated in 2021. The 2050 update process began in 2025 and is expected to take approximately two years, with final adoption targeted for mid-2027.',
  },
  {
    q: 'Can residents actually influence what goes into the plan?',
    a: 'Yes. Phase II is the most important window. The topic-based community meetings in Phase II are specifically designed to gather community input that shapes the draft plan. Staff and the CPPC are required to reflect that input in the document. Showing up in large numbers, submitting written comments, and speaking at public hearings all create a documented public record that officials must address.',
  },
  {
    q: 'What is the TM (Technology-Manufacturing) zoning district?',
    a: 'TM is a zoning designation in Frederick County that permits technology parks, light manufacturing, and related uses. It is the most likely zoning category under which data centers would be sited. The Comprehensive Plan update could expand the areas designated for TM development, loosen the standards for what qualifies, or create new categories that accommodate data center uses, all without any individual parcel-level vote.',
  },
  {
    q: 'What is the CPPC?',
    a: 'The Comprehensive Plans and Programs Committee (CPPC) is a joint committee of Planning Commissioners and Board of Supervisors members that reviews the draft plan before it goes to public hearings. They are a key checkpoint. If the draft plan contains problematic language, the CPPC review is one of the last opportunities to flag it before formal adoption proceedings begin.',
  },
]

const INFRASTRUCTURE_GAPS = [
  {
    gap: 'School Overcrowding',
    context: 'Average family size (3.18) exceeds the state average (3.07), driving sustained demand for school capacity. Infrastructure has not kept pace.',
    risk: 'If data centers are approved as low-impact industrial uses, they generate tax revenue but create minimal school demand, which sounds appealing to fiscal conservatives but obscures the cumulative infrastructure burden.',
  },
  {
    gap: 'Traffic & I-81 Congestion',
    context: 'The I-81 corridor is the primary artery for industrial expansion. Data centers require significant heavy truck traffic during construction and ongoing deliveries.',
    risk: 'The Eastern Road Plan needs to be constrained per official stakeholder input. Large industrial uses along the I-81 corridor add to this strain.',
  },
  {
    gap: 'Power Grid Capacity',
    context: 'Utilities/power needs are explicitly flagged in the stakeholder summary as requiring "clear address" in the 2050 plan.',
    risk: 'A single large data center can draw 50–100+ megawatts of power. REC ratepayers across the region absorb grid upgrades. The comp plan must require power impact assessments.',
  },
  {
    gap: 'Water & Karst Geology',
    context: 'Frederick County sits on karst limestone terrain. The county\'s water infrastructure is directly connected to groundwater systems that are uniquely vulnerable to contamination.',
    risk: 'Data centers require millions of gallons of water for cooling. Wastewater discharge into karst terrain carries contamination risk that standard industrial impact assessments may not fully capture.',
  },
]

export default function ComprehensivePlanPage() {
  const [activePhase, setActivePhase] = useState(1)
  const [openLanguage, setOpenLanguage] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)
  const [openGap, setOpenGap] = useState(null)

  return (
    <main className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>
            <span className={styles.heroEyebrowDot} />
            Frederick County 2050 Comprehensive Plan Update
          </div>
          <h1 className={styles.heroTitle}>
            The Plan That Will Shape<br />
            <em>Frederick County for a Generation</em>
          </h1>
          <p className={styles.heroDeck}>
            Right now, Frederick County is rewriting the legal document that governs
            all land use decisions through 2050. Every rezoning, every data center
            application, every farm preserved or paved: all of it will flow from
            this plan. The window to shape it is open now. It won't be open forever.
          </p>
          <div className={styles.heroAlert}>
            <div className={styles.heroAlertIcon}>⚠</div>
            <div>
              <strong>Phase II community meetings are the critical intervention point.</strong>{' '}
              The "Industry & Commerce" topic sessions are where data center-friendly
              language will be pushed into the plan's framework. Show up.
            </div>
          </div>
        </div>
      </section>

      {/* ── What is the Comp Plan ── */}
      <section className={styles.explainer}>
        <div className={`${styles.explainerInner} fade-up`}>
          <div className={styles.explainerText}>
            <div className={styles.sectionLabel}>What Is It</div>
            <h2 className={styles.sectionTitle}>The Comprehensive Plan is the rulebook for Frederick County's future</h2>
            <p>Virginia law (§ 15.2-2223) requires every locality to adopt a comprehensive plan to guide land use decisions. It is not a zoning map. It doesn't directly rezone parcels. But every rezoning decision must be <strong>"substantially consistent"</strong> with the plan.</p>
            <p>That means if the 2050 plan includes language welcoming data centers as a "targeted industry," every future data center application gets a built-in legal argument for approval. Conversely, if the plan includes strong protections for agricultural land, water resources, and rural character, those same protections become the standard every developer must meet.</p>
            <p>Frederick County's current plan was last updated in 2021. The 2050 update will govern land use decisions for the next <strong>25 years</strong>. Frederick County is currently the <strong>6th fastest-growing jurisdiction in Virginia</strong> which means the decisions made in this plan will have real, immediate consequences.</p>
          </div>
          <div className={styles.explainerStats}>
            <div className={styles.statCard}>
              <div className={styles.statNum}>25</div>
              <div className={styles.statLabel}>years this plan will govern all land use decisions</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNum}>8.3%</div>
              <div className={styles.statLabel}>current growth rate, 6th fastest in Virginia</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNum}>2027</div>
              <div className={styles.statLabel}>target adoption date, final vote by BOS</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNum} style={{color:'var(--forest)'}}>Now</div>
              <div className={styles.statLabel}>Phase II is active, the most important window for input</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className={styles.timeline}>
        <div className={styles.timelineInner}>
          <div className={styles.sectionLabel}>The Process</div>
          <h2 className={styles.sectionTitle}>Five phases. One chance to get it right.</h2>
          <p className={styles.sectionDeck}>The plan is developed in five phases over roughly two years. Phase II, currently underway, is the most important window for community input. Here's where things stand.</p>

          <div className={styles.timelineLayout}>
            <div className={styles.timelineNav}>
              {PHASES.map((phase, i) => (
                <button
                  key={phase.number}
                  className={`${styles.phaseBtn} ${activePhase === i ? styles.phaseBtnActive : ''}`}
                  onClick={() => setActivePhase(i)}
                >
                  <div className={styles.phaseBtnNum}>Phase {phase.number}</div>
                  <div className={styles.phaseBtnLabel}>{phase.label}</div>
                  <div className={styles.phaseBtnPeriod}>{phase.period}</div>
                  {phase.status === 'active'   && <span className={styles.activeTag}>NOW</span>}
                  {phase.status === 'complete' && <span className={styles.completeTag}>Done</span>}
                </button>
              ))}
            </div>

            <div className={styles.timelineDetail}>
              {(() => {
                const phase = PHASES[activePhase]
                return (
                  <>
                    <div className={styles.detailHeader}>
                      <div className={styles.detailPhaseNum}>Phase {phase.number}</div>
                      <div className={styles.detailTitle}>{phase.label}</div>
                      <div className={styles.detailMeta}>{phase.period} · {phase.duration}</div>
                    </div>
                    <p className={styles.detailDesc}>{phase.description}</p>
                    {phase.warning && (
                      <div className={styles.detailWarning}>
                        <div className={styles.detailWarningIcon}>⚠</div>
                        <div>{phase.warning}</div>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* ── Infrastructure Gaps ── */}
      <section className={styles.infrastructure}>
        <div className={styles.infrastructureInner}>
          <div className={styles.sectionLabel}>The Real Costs</div>
          <h2 className={styles.sectionTitle}>Infrastructure gaps the plan must address</h2>
          <p className={styles.sectionDeck}>
            The county's own stakeholder summary flags infrastructure as a critical concern: schools,
            traffic, power, and water have not kept pace with growth. Here's what that means in the
            context of data center development.
          </p>

          <div className={styles.gapGrid}>
            {INFRASTRUCTURE_GAPS.map((item, i) => (
              <div
                key={i}
                className={`${styles.gapCard} ${openGap === i ? styles.gapCardOpen : ''} fade-up delay-${Math.min(i + 1, 4)}`}
                onClick={() => setOpenGap(openGap === i ? null : i)}
              >
                <div className={styles.gapHeader}>
                  <div className={styles.gapTitle}>{item.gap}</div>
                  <span className={styles.gapChevron}>{openGap === i ? '−' : '+'}</span>
                </div>
                <p className={styles.gapContext}>{item.context}</p>
                {openGap === i && (
                  <div className={styles.gapRisk}>
                    <div className={styles.gapRiskLabel}>Data center risk</div>
                    <p>{item.risk}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Language to Watch ── */}
      <section className={styles.language}>
        <div className={styles.languageInner}>
          <div className={styles.sectionLabel} style={{color:'var(--gold)'}}>The Stakes</div>
          <h2 className={styles.sectionTitle} style={{color:'var(--gold-lt)'}}>The language already in play</h2>
          <p className={styles.sectionDeck} style={{color:' #FDFAF5'}}>
            In November 2025, county staff compiled a summary of input from Board of Supervisors members,
            Planning Commissioners, and key stakeholders. This is the framing that will shape the draft plan.
            Here's what to watch and why each phrase matters.
          </p>

          <div className={styles.languageList}>
            {LANGUAGE_ITEMS.map(item => (
              <div key={item.id} className={`${styles.languageItem} ${openLanguage === item.id ? styles.languageItemOpen : ''}`}>
                <button
                  className={styles.languageTrigger}
                  onClick={() => setOpenLanguage(openLanguage === item.id ? null : item.id)}
                >
                  <div className={styles.languageTriggerLeft}>
                    <div className={styles.languageWarningDot} />
                    <span>{item.label}</span>
                  </div>
                  <span className={styles.languageChevron}>{openLanguage === item.id ? '−' : '+'}</span>
                </button>
                {openLanguage === item.id && (
                  <div className={styles.languageBody}>
                    <div className={styles.languageSource}>Source: {item.source}</div>
                    <blockquote className={styles.languageQuote}>"{item.quote}"</blockquote>
                    <div className={styles.languageConcern}>
                      <div className={styles.languageConcernLabel}>Why this matters</div>
                      <p>{item.concern}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What You Can Do ── */}
      <section className={styles.action}>
        <div className={styles.actionInner}>
          <div className={styles.sectionLabel}>Take Action</div>
          <h2 className={styles.sectionTitle}>Phase II is your window. Use it.</h2>
          <p className={styles.sectionDeck}>
            The topic-based community meetings in Phase II are where public input is collected and
            documented. That record informs the draft plan. Here's how to make your voice count.
          </p>

          <div className={styles.actionGrid}>
            <div className={`${styles.actionCard} fade-up delay-1`}>
              <div className={styles.actionNum}>01</div>
              <h3 className={styles.actionTitle}>Attend the Industry & Commerce session</h3>
              <p className={styles.actionDesc}>
                This is the topic area where data center language will be debated. Show up, bring neighbors,
                and speak on the record. County staff is required to document all public input.
              </p>
              <a href="/events" className={styles.actionLink}>See upcoming meetings →</a>
            </div>
            <div className={`${styles.actionCard} fade-up delay-2`}>
              <div className={styles.actionNum}>02</div>
              <h3 className={styles.actionTitle}>Submit written comments</h3>
              <p className={styles.actionDesc}>
                Can't attend in person? Written comments submitted to the Planning Department carry the
                same weight. Email <a href="mailto:planning@fcva.us">planning@fcva.us</a> with
                "2050 Comprehensive Plan" in the subject line.
              </p>
            </div>
            <div className={`${styles.actionCard} fade-up delay-3`}>
              <div className={styles.actionNum}>03</div>
              <h3 className={styles.actionTitle}>Ask specific questions on the record</h3>
              <p className={styles.actionDesc}>
                At public meetings, ask directly: Will data centers be listed as a targeted industry?
                What water impact assessments will be required? How will TM zoning be defined
                in the new plan? Force these questions into the public record now.
              </p>
            </div>
            <div className={`${styles.actionCard} fade-up delay-4`}>
              <div className={styles.actionNum}>04</div>
              <h3 className={styles.actionTitle}>Sign the petition</h3>
              <p className={styles.actionDesc}>
                Over 440 signatures from residents across all six districts. The petition demonstrates
                the scale of community concern to every official involved in the planning process.
              </p>
              <a href="/petition" className={styles.actionLink}>Sign the petition →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.faq}>
        <div className={styles.faqInner}>
          <div className={styles.sectionLabel}>Background</div>
          <h2 className={styles.sectionTitle}>Frequently asked questions</h2>

          <div className={styles.faqList}>
            {FAQS.map((item, i) => (
              <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqItemOpen : ''}`}>
                <button className={styles.faqTrigger} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{item.q}</span>
                  <span className={styles.faqChevron}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className={styles.faqBody}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2>The plan is being written right now.</h2>
          <p>Every resident who shows up, speaks, and submits a comment makes it harder to bury data center protections in fine print. The 2050 plan will outlast every official currently in office. Make it reflect what Frederick County actually wants.</p>
          <div className={styles.ctaButtons}>
            <a href="/petition" className="btn-primary">Sign the Petition</a>
            <a href="/events" className="btn-outline">See Upcoming Meetings</a>
          </div>
        </div>
      </section>

    </main>
  )
}