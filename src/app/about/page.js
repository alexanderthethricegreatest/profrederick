'use client'

import styles from '@/styles/about.module.css'

export default function AboutPage() {
  return (
    <main className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>About Protect Frederick</div>
          <h1 className={styles.heroTitle}>
            This valley has<br />
            <em>always been worth defending.</em>
          </h1>
        </div>
      </section>

      {/* ── Opening ── */}
      <section className={styles.opening}>
        <div className={styles.openingInner}>
          <p className={styles.openingLead}>
            Frederick County, Virginia sits in the northern Shenandoah Valley with
            farmland, forest, and water stretching across karst terrain that has
            shaped how people here live for generations. That terrain isn't just
            scenic; it's fragile. Groundwater moves through it in ways that make
            industrial contamination uniquely dangerous and uniquely difficult to undo.
          </p>
          <p>
            In 2025, two data center proposals landed in Frederick County:
            a 644-acre campus south of Stephens City and a 105-acre site south
            of Winchester. They arrived quietly, the way these proposals usually do:
            through planning documents, rezoning applications, and meetings most
            residents never hear about until it's too late to matter.
          </p>
          <p>
            Protect Frederick exists because residents found out and decided to act.
          </p>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className={styles.divider}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerMark}>✦</span>
        <div className={styles.dividerLine} />
      </div>

      {/* ── What's at stake ── */}
      <section className={styles.stakes}>
        <div className={styles.stakesInner}>
          <div className={styles.stakesLabel}>What's at stake</div>
          <h2 className={styles.stakesTitle}>The land. The water. The character of a place.</h2>

          <div className={styles.stakesGrid}>
            <div className={styles.stakeCard}>
              <h3>Water</h3>
              <p>
                Frederick County sits almost entirely on karst terrain which islimestone
                geology riddled with sinkholes, caves, and underground streams.
                Contamination doesn't stay where it lands. It moves, invisibly,
                through the aquifer that supplies wells across the county.
              </p>
            </div>
            <div className={styles.stakeCard}>
              <h3>Power</h3>
              <p>
                REC projects 17 gigawatts of data center demand by 2040 which is 18 times more than
                its current peak load. That demand doesn't come free. It gets spread
                across every member of the co-op. Frederick County residents would
                subsidize industrial power consumption they never voted for.
              </p>
            </div>
            <div className={styles.stakeCard}>
              <h3>Land</h3>
              <p>
                The proposals would convert hundreds of acres of agricultural land
                to industrial use. That conversion is permanent. There is no future Board
                of Supervisors that can undo it. The farmland that defines this valley
                does not come back.
              </p>
            </div>
            <div className={styles.stakeCard}>
              <h3>Accountability</h3>
              <p>
                The decision rests with seven supervisors, some of whom have ties
                to the economic interests pushing this forward. A decision of this
                magnitude would be irreversible and as such, we deserve a process that
                is fully transparent and fully accountable to the people who live here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className={styles.divider}>
        <div className={styles.dividerLine} />
        <div className={styles.dividerLine} />
      </div>

      {/* ── How it works ── */}
      <section className={styles.how}>
        <div className={styles.howInner}>
          <div className={styles.howLabel}>How we organize</div>
          <h2 className={styles.howTitle}>Pressure. Presence. Record.</h2>
          <p className={styles.howDeck}>
            The playbook isn't complicated. It's the same one that stopped data centers
            in Warren County, slowed them in Pittsylvania, and is forcing reconsideration
            across rural Virginia. Organized community pressure works, but only when it's sustained,
            visible, and on the record.
          </p>

          <div className={styles.howSteps}>
            {[
              { num: '01', title: 'Build the record', body: 'Every petition signature, every public comment, and every speaker at a Board meeting becomes part of the official record. That record follows this issue through every legal and political challenge.' },
              { num: '02', title: 'Fill the rooms', body: 'An empty chamber signals no opposition. A room full of residents with a sign-in sheet signals a political cost. Supervisors face re-election. Visibility matters. We need to show up.' },
              { num: '03', title: 'Hold officials accountable', body: 'Conflicts of interest, voting records, public statements. We need all of it documented and made available to voters. November 2026 is a referendum on this Board.' },
              { num: '04', title: 'Connect the dots', body: 'Frederick County is not alone. Data center campaigns are playing out across the region. What we learn here (what works, what doesn\'t) is useful to every community facing the same fight.' },
            ].map(s => (
              <div key={s.num} className={styles.howStep}>
                <div className={styles.howStepNum}>{s.num}</div>
                <div className={styles.howStepContent}>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className={styles.vision}>
        <div className={styles.visionInner}>
          <div className={styles.visionLabel}>Where this goes</div>
          <h2 className={styles.visionTitle}>
            A resource for every community<br />
            <em>facing this fight.</em>
          </h2>
          <p>
            The data center industry has a playbook. It moves into rural counties
            with limited planning capacity, builds relationships with economic
            development officials before the public knows anything is happening,
            and presents the decision as already made by the time residents find out.
          </p>
          <p>
            Communities fighting back need their own playbook. Protect Frederick
            is building toward becoming that resource. For Frederick County first,
            and for the broader region as this fight spreads.
          </p>
          <p>
            That means documenting what works: connecting organizers, sharing
            research on conflicts of interest, zoning law, and the real economic
            math of data center development. We are building the institutional knowledge
            that individual campaigns burn through and lose.
          </p>
          <p className={styles.visionClose}>
            The valley is worth defending. It is the right of every rural community
            to decide its own future.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2>Ready to help?</h2>
          <p>Sign the petition, volunteer, or just share this site with a neighbor who doesn't know what's at stake yet.</p>
          <div className={styles.ctaButtons}>
            <a href="/petition" className="btn-primary">Sign the Petition</a>
            <a href="/volunteer" className="btn-outline">Volunteer</a>
            <a href="/events" className="btn-outline">See Upcoming Events</a>
          </div>
        </div>
      </section>

    </main>
  )
}