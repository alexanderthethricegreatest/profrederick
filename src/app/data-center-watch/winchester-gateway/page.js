'use client'

import { useState } from 'react'
import styles from '@/styles/data-center-watch.module.css'

// ── Sub-components ────────────────────────────────────────────────────────────
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
export default function WinchesterGatewayPage() {
  return (
    <main className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>Protect Frederick &nbsp;·&nbsp; Public Analysis</div>
          <h1 className={styles.heroTitle}>
            Winchester Gateway LLC:<br />
            What Frederick County Residents Need to Know
          </h1>
          <p className={styles.heroSub}>
            A 160 MW data center campus proposed for 71.85 acres near the Second Battle of
            Kernstown battlefield. The Historic Resources Advisory Board voted 7 to 1 to recommend
            denial. The Board of Supervisors makes the final call.
          </p>
          <div className={styles.heroMeta}>
            <div className={styles.metaItem}><strong>Applicant</strong>Winchester Gateway LLC (Darius Saeidi)</div>
            <div className={styles.metaItem}><strong>Engineer</strong>Greenway Engineering (Christopher Mohn)</div>
            <div className={styles.metaItem}><strong>Location</strong>SW intersection of Apple Valley Rd and Middle Rd, east of Rt. 37, Kernstown (Back Creek District)</div>
            <div className={styles.metaItem}><strong>Parcel</strong>63-A-801</div>
            <div className={styles.metaItem}><strong>Current Zoning</strong>M1 (Light Industrial, rezoned 2023)</div>
            <div className={styles.metaItem}><strong>Request</strong>Conditional Use Permit (CUP) for data center campus</div>
            <div className={styles.metaItem}><strong>HRAB Vote</strong>7-1 recommendation for denial (April 17, 2026)</div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className={styles.content}>

        {/* Lede */}
        <div className={styles.lede}>
          <p>
            Unlike the Virginia Technology Park application, this is not a rezoning. The parcel
            was already rezoned to M1 Light Industrial in 2023. Winchester Gateway LLC is asking
            for a Conditional Use Permit to build a data center campus on that land. The CUP
            process gives the county more targeted review authority, but the Board of Supervisors
            still makes the final binding decision.
          </p>
          <p>
            Frederick County's Historic Resources Advisory Board voted 7 to 1 to recommend denial
            on April 17, 2026, citing unresolved battlefield visibility, unanswered water disposal
            questions, and incomplete archaeological work. That recommendation now moves to the
            Planning Commission and then to the Board of Supervisors.
          </p>
        </div>

        {/* Key facts */}
        <div className={styles.keyFacts}>
          <div className={styles.factItem}>
            <div className={styles.factNumber}>71.85</div>
            <div className={styles.factLabel}>Acres</div>
          </div>
          <div className={styles.factItem}>
            <div className={styles.factNumber}>160<span>MW</span></div>
            <div className={styles.factLabel}>Max Electrical Draw</div>
          </div>
          <div className={styles.factItem}>
            <div className={styles.factNumber}>3</div>
            <div className={styles.factLabel}>Data Center Buildings (60 ft)</div>
          </div>
          <div className={styles.factItem}>
            <div className={styles.factNumber}>7-1</div>
            <div className={styles.factLabel}>HRAB Denial Recommendation</div>
          </div>
          <div className={styles.factItem}>
            <div className={styles.factNumber}>0</div>
            <div className={styles.factLabel}>Phase II Archaeology Completed</div>
          </div>
          <div className={styles.factItem}>
            <div className={styles.factNumber}>0</div>
            <div className={styles.factLabel}>Independent Economic Reviews</div>
          </div>
        </div>

        {/* ── Accordion sections ── */}
        <div className={styles.accordionGroup}>

          {/* 01 */}
          <Accordion num="01" title="What They Want to Build" subtitle="Phase 1: three buildings, one substation, 805,000 sq ft campus">
            <p>
              The application proposes three data center buildings, each capped at{' '}
              <strong>60 feet tall</strong>, not including mechanical equipment on the roof.
              A fourth structure, an electrical substation estimated at{' '}
              <strong>45 feet tall</strong>, would be built adjacent to Route 37.
            </p>
            <div className={styles.statRow}>
              <div className={styles.statBlock}>
                <div className={styles.statNum}>805<span>K sq ft</span></div>
                <div className={styles.statDesc}>Total campus footprint</div>
              </div>
              <div className={styles.statBlock}>
                <div className={styles.statNum}>60<span> ft</span></div>
                <div className={styles.statDesc}>Maximum building height (not including rooftop mechanical)</div>
              </div>
              <div className={styles.statBlock}>
                <div className={styles.statNum}>10<span> ft</span></div>
                <div className={styles.statDesc}>Security fencing around the entire perimeter</div>
              </div>
            </div>
            <p style={{ marginTop: 16 }}>
              The site plan includes a stormwater management pond on the eastern edge of the
              parcel. Multiple delineated wetlands are present on the property (labeled BC, DE,
              FG, and HI in the site plans), with proposed buildings placed in close proximity
              to several of them.
            </p>
            <Callout label="Why M1 Zoning Does Not End the Discussion">
              <p>
                The parcel is zoned M1 Light Industrial following the 2023 rezoning. The applicant
                uses this as an argument that industrial development is already approved in
                principle. However, a Conditional Use Permit is a separate approval that allows
                the county to evaluate the specific proposed use on its own merits. The CUP can
                be denied even on M1-zoned land, and the Board of Supervisors has previously
                done exactly that for data center proposals in this corridor.
              </p>
            </Callout>
          </Accordion>

          {/* 02 */}
          <Accordion num="02" title="Power" subtitle="160 MW connecting to existing 138kV lines, new substation at applicant cost">
            <p>
              The proposed maximum electrical draw is <strong>160 MW</strong>. The site connects
              to existing 138kV power lines that already cross the property. The applicant states
              it is working with local cooperatives and First Energy to confirm available supply
              from those lines.
            </p>
            <p>
              A new on-site substation will be built entirely at Winchester Gateway's cost,
              adjacent to Route 37, at an estimated height of 45 feet.
            </p>
            <Alert>
              <p>
                <strong>No grid impact analysis has been submitted with this application.</strong>{' '}
                The application states the applicant is still working to confirm power supply
                availability. The county is being asked to approve a 160 MW facility before
                the basic question of whether the grid can reliably serve it has been answered.
              </p>
            </Alert>
          </Accordion>

          {/* 03 */}
          <Accordion num="03" title="Water" subtitle="35,000 GPD claimed average, disposal method unresolved, shared source with Winchester">
            <p>
              The applicant claims the campus will use a closed-loop or air-cooled system and
              estimates water use at a maximum of{' '}
              <strong>35,000 gallons per day</strong>. The application itself acknowledges this
              figure "will fluctuate" seasonally and can be exceeded. The 35,000 GPD number is
              an annual average, not a hard cap.
            </p>
            <p>
              Contaminated cooling water would need to be removed from the site by a third-party
              contractor. At the HRAB hearing, the applicant's engineer acknowledged he was not
              sure how that disposal would actually be handled. This is an unresolved operational
              question that was submitted as a resolved one.
            </p>
            <p>
              Frederick County and the City of Winchester share the same water source: the{' '}
              <strong>North Fork of the Shenandoah River</strong>, processed through the Percy
              D. Miller Water Treatment Plant near Middletown. Winchester's Public Services
              Director Perry Eisenach said the city "would need to know those details" before
              assessing impact, meaning the applicant has not provided enough information for
              even basic water impact review.
            </p>
            <Alert>
              <p>
                <strong>The water disposal method for contaminated cooling water remains
                unresolved.</strong> This is not a minor detail. Cooling water from data centers
                can carry biocides, scale inhibitors, and corrosion control chemicals. A third-party
                removal plan that hasn't been specified is not a plan.
              </p>
            </Alert>
          </Accordion>

          {/* 04 */}
          <Accordion num="04" title="Noise and Traffic" subtitle="Modeled at 55-56 dB(A) on Apple Valley Road; traffic compared to hypothetical">
            <h3>Noise</h3>
            <p>
              The applicant's own noise model (Salas O'Brien, November 2025) projects{' '}
              <strong>55 to 56 dB(A)</strong> along Apple Valley Road during normal operations
              and generator testing. Frederick County's noise ordinance limits are 65 dB(A)
              daytime and 60 dB(A) nighttime at the property line.
            </p>
            <p>
              Generator testing is restricted to weekdays between 8 a.m. and 5 p.m. A certified
              noise study is required 12 months after the first certificate of occupancy is issued,
              and then every five years.
            </p>
            <Callout label="Note on the Noise Model">
              <p>
                The noise projections are based on the applicant's own consultant modeling, not
                an independent third-party study. The post-occupancy noise study requirement
                means the first enforceable measurement comes after the campus is already built
                and operational.
              </p>
            </Callout>
            <h3>Traffic</h3>
            <p>
              The applicant claims the data center would generate 1,925 fewer daily vehicle
              trips than the by-right industrial use allowed under M1 zoning, including 172
              fewer AM peak-hour trips (a claimed 63% reduction) and 240 fewer PM peak-hour
              trips (a claimed 87% reduction).
            </p>
            <p>
              These comparisons are made against the hypothetical maximum-buildout industrial
              use of the parcel, not against current reality. The parcel is undeveloped.
              Comparing a data center to a maximum-capacity industrial park is a framing
              choice, not a neutral measurement.
            </p>
            <p>
              Apple Valley Road widening was already a proffered commitment from the 2023
              rezoning. The applicant is taking credit for a road improvement that was a
              condition of a prior approval, not a new concession offered with this CUP.
            </p>
          </Accordion>

          {/* 05 */}
          <Accordion num="05" title="Applicant's Economic Claims" subtitle="MuniCap analysis paid for by the applicant, no independent review conducted">
            <Alert icon="⚠">
              <p>
                <strong>All figures below come from an economic analysis commissioned and paid
                for by the applicant (MuniCap, Inc.).</strong> No independent review has been
                conducted. These figures have not been verified by the county or any neutral
                third party.
              </p>
            </Alert>
            <div className={styles.statRow} style={{ marginTop: 20 }}>
              <div className={styles.statBlock}>
                <div className={styles.statNum}>$19<span>M/yr</span></div>
                <div className={styles.statDesc}>Projected gross tax revenue at full buildout (applicant's figure)</div>
              </div>
              <div className={styles.statBlock}>
                <div className={styles.statNum}>$635<span>M</span></div>
                <div className={styles.statDesc}>30-year cumulative revenue projection (applicant's figure)</div>
              </div>
              <div className={styles.statBlock}>
                <div className={styles.statNum}>155</div>
                <div className={styles.statDesc}>Claimed permanent jobs at avg. $86,000/year</div>
              </div>
            </div>
            <p style={{ marginTop: 16 }}>
              The revenue breakdown per the MuniCap report is $16.48 million per year in
              Business Personal Property Tax (BPP) plus $2.35 million in Real Property Tax.
              BPP is assessed on equipment including servers and cooling systems. As that
              equipment depreciates, so does the BPP revenue. The 30-year $635 million figure
              assumes sustained equipment value that may not materialize.
            </p>
            <p>
              The applicant also claims 4,678 construction-phase FTE jobs generating $441
              million in labor income. Construction-phase employment is temporary by definition.
            </p>
            <Callout label="Context">
              <p>
                Frederick County's FY2027 structural budget shortfall is $41.3 million.
                Even if the applicant's best-case revenue figures are accurate, this single
                project does not close the county's fiscal gap. The 155 permanent jobs across
                an 805,000 sq ft, 160 MW campus is a thin return relative to the infrastructure
                demands and environmental commitments the project would place on the county.
              </p>
            </Callout>
          </Accordion>

          {/* 06 */}
          <Accordion num="06" title="Historic and Archaeological Concerns" subtitle="Kernstown Battlefield, visible from Pritchard's Hill, incomplete Phase II archaeology">
            <h3>The Battlefield</h3>
            <p>
              The site falls within the{' '}
              <strong>National Register-eligible Kernstown Battlefield (034-0007)</strong>, whose
              boundary was expanded to include this parcel in 2011. The Second Battle of
              Kernstown in 1864 was fought on and around this land.
            </p>
            <p>
              The Kernstown Battlefield Association (KBA) preserves Sandy Ridge and
              Pritchard's Hill, both immediately to the east at higher elevation. County
              Planning Director Wyatt Pearson confirmed at the HRAB hearing:{' '}
              <em>"A person standing on Pritchard's Hill may still be able to see over the
              top of the trees to see the top of the building."</em>
            </p>
            <p>
              HRAB specifically requested a viewshed analysis from Sandy Ridge. The applicant
              did not provide it. If the screening actually worked, the analysis would support
              the project. The refusal to provide it is telling.
            </p>
            <Alert>
              <p>
                A 200-foot landscape buffer does not screen a 60-foot building from elevated
                vantage points to the east. The applicant's claim that the buffer minimizes
                visual impact has not been supported by the analysis HRAB asked for.
              </p>
            </Alert>
            <h3>Archaeological Record</h3>
            <p>
              A Phase I Archaeological Survey (The Ottery Group, August 2023) excavated 1,580
              shovel test pits across the property and identified five archaeological sites
              (44FK1076 through 44FK1080). Phase II investigation was recommended for two of them:
            </p>
            <ul className={styles.missingList} style={{ listStyleType: 'none' }}>
              <li style={{ paddingLeft: 16 }}>
                <strong>44FK1076</strong>: Possible David Glass Sr. homestead, dating to 1749
              </li>
              <li style={{ paddingLeft: 16 }}>
                <strong>44FK1077</strong>: Native American lithic site plus possible 18th-century springhouse
              </li>
            </ul>
            <p style={{ marginTop: 12 }}>
              No Phase II investigation has been completed as of the CUP application. The county
              is being asked to approve ground-disturbing construction on a site where the
              recommended archaeological follow-up work has not been done.
            </p>
            <Callout label="HRAB Conditions (If Approved)">
              <p>
                HRAB's recommendation noted that if the CUP were approved over its objection,
                conditions should include: building heights reduced to 45 feet; Phase II
                archaeological survey completed before construction; and colors and materials
                in accordance with National Park Service standards.
              </p>
            </Callout>
          </Accordion>

          {/* 07 */}
          <Accordion num="07" title="Regulatory History" subtitle="2023 rezoning through 2026 HRAB denial recommendation">
            <div className={styles.timeline}>
              {[
                { v: 'completed', tag: '2023', date: '2023',
                  title: 'Site Rezoned from RA to M1 (REZ #06-23)',
                  body: 'The parcel at 63-A-801 is rezoned from Rural Areas to M1 Light Industrial, with proffers including a commitment to widen Apple Valley Road. This rezoning is the basis for the current CUP application.' },
                { v: 'completed', tag: '2023', date: 'August 2023',
                  title: 'Phase I Archaeological Survey Completed',
                  body: 'The Ottery Group completes a Phase I survey, excavating 1,580 shovel test pits and identifying five archaeological sites. Phase II investigation is recommended for 44FK1076 and 44FK1077. No Phase II work is initiated.' },
                { v: 'completed', tag: '2024', date: 'June 2024',
                  title: 'BOS Rejects Winchester Gateway 2 (105-Acre Proposal)',
                  body: 'The Board of Supervisors rejects a separate 105-acre data center proposal on a parcel across Route 37 from the current site. This is the second time the BOS has acted on a data center proposal in this corridor.' },
                { v: 'completed', tag: 'Feb 2026', date: 'February 20, 2026',
                  title: 'HRAB Tables Recommendation',
                  body: 'HRAB tables its recommendation on the Winchester Gateway CUP and requests two specific items from the applicant: a viewshed analysis from Sandy Ridge and a copy of the Phase I archaeological report.' },
                { v: 'completed', tag: 'Apr 2026', date: 'April 17, 2026',
                  title: 'HRAB Votes 7-1 to Recommend Denial',
                  body: 'HRAB votes 7 to 1 to recommend denial of the CUP. The applicant did not provide the requested viewshed analysis. Lone dissent: Dana Newcomb. HRAB members cited battlefield visibility, unresolved water disposal, and the incomplete archaeological record.' },
                { v: 'pending', tag: 'TBD', date: 'Date not yet set',
                  title: 'Planning Commission Review',
                  body: 'The application moves to the Planning Commission for review. A public hearing date has not been scheduled. The PC\'s recommendation is advisory.' },
                { v: 'decision', tag: 'TBD', date: 'Date not yet set',
                  title: 'Board of Supervisors Public Hearing and Vote',
                  body: 'The Board of Supervisors holds its own public hearing and casts the binding vote. The BOS previously rejected the Winchester Gateway 2 proposal on the adjacent parcel, demonstrating it is not obligated to approve data center development in this corridor.' },
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
                No Planning Commission hearing date has been set. Sign up for e-notifications
                at <a href="https://www.fcva.us/services/sign-up-for-e-notifications">fcva.us</a>{' '}
                to be alerted when it is posted. Written comments submitted via the county's
                e-Comment system become part of the official public record.
              </p>
            </Alert>
          </Accordion>

          {/* 08 */}
          <Accordion num="08" title="Key Voices" subtitle="What was said at the HRAB hearing and by whom">
            <p>
              The following statements are from the April 17, 2026 HRAB hearing and related
              county proceedings.
            </p>

            <p style={{ marginTop: 16, marginBottom: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--barn)' }}>
              In Opposition
            </p>
            <div className={`${styles.quoteCard} ${styles.quoteOpposition}`}>
              <div className={styles.quoteText}>
                "If you allow a data center to be built in an area like this you're opening a whole can of worms."
              </div>
              <div className={styles.quoteAttrib}>Delane Karalow, HRAB Member</div>
            </div>
            <div className={`${styles.quoteCard} ${styles.quoteOpposition}`}>
              <div className={styles.quoteText}>
                "What happens to their property values... with the ambient noise levels and height?"
              </div>
              <div className={styles.quoteAttrib}>Gary Crawford, HRAB Member</div>
            </div>
            <div className={`${styles.quoteCard} ${styles.quoteOpposition}`} style={{ marginBottom: 16 }}>
              <div className={styles.quoteText}>
                "A person standing on Pritchard's Hill may still be able to see over the top of the trees to see the top of the building."
              </div>
              <div className={styles.quoteAttrib}>Wyatt Pearson, Frederick County Planning Director</div>
            </div>

            <p style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              Hedging
            </p>
            <div className={`${styles.quoteCard} ${styles.quoteHedge}`} style={{ marginBottom: 16 }}>
              <div className={styles.quoteText}>
                "There's a lot of things to weigh here. It's not black and white. It's very, very complex."
              </div>
              <div className={styles.quoteAttrib}>Jack Owens, HRAB Member (Shenandoah Valley Battlefields Foundation)</div>
            </div>

            <p style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
              Notable Absences from the Record
            </p>
            <ul className={styles.missingList}>
              <li>The applicant did not provide the viewshed analysis from Sandy Ridge that HRAB specifically requested</li>
              <li>The applicant's engineer could not say at the hearing how contaminated cooling water would be disposed of</li>
              <li>Winchester's Public Services Director said the city "would need to know those details" before assessing water impact</li>
              <li>No Phase II archaeological work has been completed despite a Phase I recommendation to do so in 2023</li>
            </ul>
          </Accordion>

          {/* 09 */}
          <Accordion num="09" title="Applicant's Claims vs. the Record" subtitle="Six claims made in the application and what the record actually shows">
            <div className={styles.claimsGrid}>

              <div className={styles.claimCard}>
                <div className={styles.claimLabel}>Claim</div>
                <h3>"~$19M/year in tax revenue" and "$635M over 30 years"</h3>
                <div className={styles.rebuttalLabel}>The Record</div>
                <p>
                  These figures come from MuniCap, Inc., a firm hired and paid by the applicant.
                  This is not an independent analysis and has not been verified by the county.
                </p>
                <p>
                  The $19M projection is heavily weighted toward Business Personal Property Tax
                  ($16.48M of the $19M). BPP is assessed on equipment including servers and
                  cooling systems. As that equipment depreciates, so does the BPP revenue.
                  The 30-year $635M figure assumes sustained equipment value that may not
                  materialize.
                </p>
                <p>
                  Frederick County's FY2027 structural budget shortfall is $41.3 million.
                  Even if the applicant's best-case figures are accurate, this project does
                  not close the county's fiscal gap.
                </p>
              </div>

              <div className={styles.claimCard}>
                <div className={styles.claimLabel}>Claim</div>
                <h3>"155 permanent jobs at $86K average"</h3>
                <div className={styles.rebuttalLabel}>The Record</div>
                <p>
                  Data centers are notoriously low-employment relative to their footprint and
                  infrastructure demands. 155 jobs across an 805,000 sq ft, 160 MW campus is
                  a thin return.
                </p>
                <p>
                  These are direct jobs only. The MuniCap methodology typically inflates totals
                  with indirect and induced employment multipliers that do not reflect local
                  hiring reality.
                </p>
              </div>

              <div className={styles.claimCard}>
                <div className={styles.claimLabel}>Claim</div>
                <h3>"Closed-loop system limits water use to 35,000 gallons/day"</h3>
                <div className={styles.rebuttalLabel}>The Record</div>
                <p>
                  The application itself admits the figure "will fluctuate" and can be exceeded.
                  35,000 GPD is an annual average, not a hard cap.
                </p>
                <p>
                  The engineer could not say at the HRAB hearing how contaminated cooling water
                  would actually be disposed of. Winchester's Public Services Director said the
                  city would need more detail before assessing impact. Frederick County and
                  Winchester share the same water source: the North Fork of the Shenandoah River
                  via the Percy D. Miller Water Treatment Plant.
                </p>
              </div>

              <div className={styles.claimCard}>
                <div className={styles.claimLabel}>Claim</div>
                <h3>"Data center generates less traffic than by-right industrial use"</h3>
                <div className={styles.rebuttalLabel}>The Record</div>
                <p>
                  This is a comparison to a hypothetical, not to current reality. The parcel is
                  currently undeveloped. Comparing a data center to a maximum-buildout industrial
                  park is a framing choice, not a neutral measurement.
                </p>
                <p>
                  The Apple Valley Road widening was already proffered as part of the 2023
                  rezoning. The applicant is taking credit for a road improvement that was a
                  condition of a prior approval.
                </p>
              </div>

              <div className={styles.claimCard}>
                <div className={styles.claimLabel}>Claim</div>
                <h3>"200-foot buffer and Category C screening minimizes visual impact"</h3>
                <div className={styles.rebuttalLabel}>The Record</div>
                <p>
                  Planning Director Wyatt Pearson confirmed buildings will be visible from
                  Pritchard's Hill even with the buffer in place.
                </p>
                <p>
                  The applicant refused to provide the viewshed analysis from Sandy Ridge
                  that HRAB specifically requested. If the screening actually worked, the
                  analysis would support the project. The refusal to provide it is notable.
                </p>
                <p>
                  A 200-foot landscape buffer does not screen a 60-foot building from elevated
                  vantage points to the east.
                </p>
              </div>

              <div className={styles.claimCard}>
                <div className={styles.claimLabel}>Claim</div>
                <h3>"The site is zoned M1, so something like a warehouse could be built anyway"</h3>
                <div className={styles.rebuttalLabel}>The Record</div>
                <p>
                  This is a false dilemma. The choice is not between a data center and a
                  warehouse. The CUP can be denied, and the rezoning itself could be revisited
                  through future Comprehensive Plan updates.
                </p>
                <p>
                  The Board of Supervisors already rejected the Winchester Gateway 2 proposal
                  on the adjacent parcel across Route 37. The county is not obligated to approve
                  data center development in this corridor, and has demonstrated that by
                  doing so.
                </p>
              </div>

            </div>
          </Accordion>

          {/* 10 */}
          <Accordion num="10" title="What You Can Do" subtitle="How to get on the record before the Board of Supervisors votes">
            <p>
              The CUP application is now before the Planning Commission. A public hearing date
              has not been set. The Back Creek District supervisor is Albert Orndorff, but all
              seven supervisors vote on CUP applications.
            </p>
            <div className={styles.actionGrid}>
              <div className={`${styles.actionCard} ${styles.actionCardPrimary}`}>
                <div className={styles.actionStep}>Do This Now</div>
                <div className={styles.actionTitle}>Submit a Written Comment</div>
                <div className={styles.actionDesc}>Written comments submitted via the county's e-Comment system become part of the official public record before the hearing is held. You do not need to attend in person.</div>
                <a className={styles.actionLink} href="https://www.fcva.us/government/meeting-portal" target="_blank" rel="noopener noreferrer">Submit via fcva.us Meeting Portal ↗</a>
              </div>
              <div className={`${styles.actionCard} ${styles.actionCardPrimary}`}>
                <div className={styles.actionStep}>Do This Now</div>
                <div className={styles.actionTitle}>Sign Up for Hearing Notifications</div>
                <div className={styles.actionDesc}>No Planning Commission or BOS hearing dates have been set. Sign up for e-notifications from Frederick County so you know the moment they are posted.</div>
                <a className={styles.actionLink} href="https://www.fcva.us/services/sign-up-for-e-notifications" target="_blank" rel="noopener noreferrer">Sign up at fcva.us ↗</a>
              </div>
              <div className={styles.actionCard}>
                <div className={styles.actionStep}>Planning Commission Hearing: Date TBD</div>
                <div className={styles.actionTitle}>Speak at the Planning Commission</div>
                <div className={styles.actionDesc}>Individuals are allotted 3 minutes; state your name and address. The PC's recommendation is advisory. Hearings are held at 107 N. Kent Street, Winchester, VA.</div>
                <a className={styles.actionLink} href="https://www.fcva.us/departments/planning-development/boards-committees/planning-commission" target="_blank" rel="noopener noreferrer">Planning Commission info ↗</a>
              </div>
              <div className={styles.actionCard}>
                <div className={styles.actionStep}>BOS Hearing: Date TBD</div>
                <div className={styles.actionTitle}>Speak at the Board of Supervisors</div>
                <div className={styles.actionDesc}>This is the binding vote. The BOS meets the 2nd and 4th Wednesdays at 7 p.m. at 107 N. Kent Street. The BOS previously rejected the adjacent Winchester Gateway 2 proposal.</div>
                <a className={styles.actionLink} href="https://www.fcva.us/departments/board-of-supervisors" target="_blank" rel="noopener noreferrer">Board of Supervisors info ↗</a>
              </div>
              <div className={styles.actionCard}>
                <div className={styles.actionStep}>Anytime</div>
                <div className={styles.actionTitle}>Contact Your Supervisor</div>
                <div className={styles.actionDesc}>The project parcel is in the <strong>Back Creek District</strong> (Albert Orndorff), but all seven supervisors vote. Phone calls and emails carry weight.</div>
                <a className={styles.actionLink} href="https://www.fcva.us/services/contact-my-board-representative" target="_blank" rel="noopener noreferrer">Find your supervisor ↗</a>
              </div>
              <div className={styles.actionCard}>
                <div className={styles.actionStep}>Anytime</div>
                <div className={styles.actionTitle}>Share This Page</div>
                <div className={styles.actionDesc}>Neighbors near Apple Valley Road, Kernstown, and the Back Creek corridor may not know this application is in process. The hearing can arrive quickly.</div>
                <a className={styles.actionLink} href="/petition">Sign the petition while you're here ↗</a>
              </div>
            </div>

            <h3 style={{ marginTop: 24 }}>Your Board of Supervisors</h3>
            <p>All seven supervisors vote on this CUP. The project is in the <strong>Back Creek District</strong>, represented by Albert Orndorff.</p>
            <div className={styles.supervisorGrid}>
              {[
                { name: 'John Jewell',     district: 'Chairman At-Large',  highlight: false },
                { name: 'Gary Oates',      district: 'Stonewall District', highlight: false },
                { name: 'Jason Aikens',    district: 'Gainesboro District', highlight: false },
                { name: 'Mike Guevremont', district: 'Red Bud District',   highlight: false },
                { name: 'Albert Orndorff', district: 'Back Creek District ★', highlight: true },
                { name: 'Robert Wells',    district: 'Opequon District',   highlight: false },
                { name: 'Robert Liero',    district: 'Shawnee District',   highlight: false },
              ].map(({ name, district, highlight }) => (
                <div key={name} className={styles.supervisorCard}>
                  <div className={styles.supName}>{name}</div>
                  <div className={`${styles.supDistrict}${highlight ? ` ${styles.supStonewall}` : ''}`}>{district}</div>
                </div>
              ))}
            </div>
          </Accordion>

        </div>{/* end accordionGroup */}
      </div>{/* end content */}
    </main>
  )
}
