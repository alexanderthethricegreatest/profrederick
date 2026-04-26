'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import styles from '@/styles/news.module.css'

// ── Hardcoded seed updates ────────────────────────────────────────────────────
const SEEDED_UPDATES = [
  {
    id: 'seed-6',
    title: 'County Schedules May 7 Community Information Exchange on Data Centers',
    body: 'Frederick County is hosting a Community Information Exchange on Data Centers on Thursday, May 7 at 6:30 p.m. at James Wood High School. The event will feature a question-and-answer format with brief introductions from panelists including experts in acoustics, land use, water management, and county planning.\n\nResidents are invited to attend and ask general questions about data centers. The county has noted the session is not intended to address specific projects. Additional FAQs, papers, and reports are available online at fcva.us.\n\nThis forum was originally scheduled for February 26 but was postponed after resident backlash over the format. The rescheduled session comes as two new data center applications — Virginia Technology Park in Clear Brook and a proposed campus near the Kernstown battlefield — are working their way through the county\'s review process.',
    created_at: '2026-04-23T00:00:00Z',
    seeded: true,
  },
  {
    id: 'seed-4',
    title: 'Historic Resources Board Recommends Denial of Kernstown Data Center',
    body: 'Frederick County\'s Historic Resources Advisory Board (HRAB) voted 7–1 last week to recommend denial of a conditional-use permit (CUP) for a proposed 72-acre data center campus near the Second Battle of Kernstown battlefield in the Back Creek District.\n\nThe applicant, Winchester Gateway LLC, is seeking to build three data center buildings up to 60 feet tall, plus a 45-foot electrical substation, on land at the intersection of Apple Valley and Middle Roads, bounded by Route 37. The site sits within core battlefield area from the 1864 Civil War engagement.\n\nHRAB members cited concerns well beyond historic preservation alone. Board member Gary Crawford raised the impact on neighboring homeowners along Apple Valley Road: "What happens to their property values with the ambient noise levels and height?" Member Delane Karalow warned of precedent-setting consequences: "If you allow a data center to be built in an area like this, you\'re opening a whole can of worms."\n\nThe nonprofit Kernstown Battlefield Association, which preserves the adjacent Sandy Ridge and Pritchard\'s Hill, had requested a viewshed analysis showing what visitors would see from the battlefield. The applicant did not provide it. County Planning Director Wyatt Pearson confirmed that a person standing on Pritchard\'s Hill would likely be able to see the tops of the data center buildings over the treeline.\n\nWater use was also flagged as a concern. The applicant\'s CUP application estimates up to 35,000 gallons per day, with the cooling wastewater requiring removal by a third-party contractor rather than discharge into the public system.\n\nThe CUP now moves to the Planning Commission, where a hearing date has not yet been set. The Board of Supervisors will have final say. This is the second time a data center has been proposed near this site — the Board rejected a 105-acre proposal across Route 37 just last June.',
    created_at: '2026-04-21T00:00:00Z',
    seeded: true,
  },
  {
    id: 'seed-5',
    title: 'Applicant Claims Virginia Technology Park Would Generate $237M for Frederick County',
    body: 'Pennsylvania-based Equus Capital Partners has filed a rezoning application with Frederick County for Virginia Technology Park, a proposed 220-acre data center campus in Clear Brook. The April 10 filing seeks to rezone three parcels from Rural Areas to Technology Manufacturing in the Stonewall District, south of Rest Church Road off I-81.\n\nThe project would include 10 data center buildings and three substation pads, situated next to the planned Woodside electrical substation being built by NextEra Energy. A financial impact report prepared by McGuireWoods Consulting and included in the application projects $237 million in tax revenue to the county over 20 years.\n\nEquus Senior Vice President Daniel DiLella said the company has tried to get ahead of common concerns about data centers. On noise, the application proffers low-emission fans and an acoustic perimeter. On water, the company estimates 200,000 to 300,000 gallons per day for the full complex using air-cooled and closed-loop systems, and has proffered not to draw from groundwater. Diesel generators would be restricted to emergencies and testing cycles.\n\nSome of the buildings in the generalized development plan border homes in the adjacent Ridgeway Estates subdivision, whose residents previously opposed the nearby Woodside substation over health and property value concerns. Equus has proffered an eight-foot berm along residential property lines and a 65-dBA sound limit on those borders.\n\nThis is the third attempt to rezone these parcels. A 2023 mixed-use proposal was withdrawn before reaching the Board of Supervisors, and a revised version was rejected by supervisors on a 4-3 vote in September 2024. DiLella said the project is at least two to three years from development, pending county approval.',
    created_at: '2026-04-16T00:00:00Z',
    seeded: true,
  },
  {
    id: 'seed-3',
    title: 'Petition launches with 80+ signatures in first day',
    body: 'The protectfrederick.org petition went live on February 22. Within hours, residents from across all six districts had signed. The petition has been presented at public forums and will continue to be delivered to the Board of Supervisors.',
    created_at: '2026-02-22T09:00:00Z',
    seeded: true,
  },
  {
    id: 'seed-2',
    title: 'County fact sheet presented to Planning Commission',
    body: 'The Frederick County data center fact sheet, compiled by county planning staff, was presented to the Planning Commission in January 2026. The county agreed no new proposals would come before the Board until after community information meetings, including the forums this week.',
    created_at: '2026-01-07T00:00:00Z',
    seeded: true,
  },
  {
    id: 'seed-1',
    title: 'Board of Supervisors rejects both data center proposals 5–1',
    body: 'At a joint work session with the Planning Commission on June 18, 2025, the Board voted to reject further study of two Comprehensive Plan amendment applications: Meadow Brook Technology Park (644 acres south of Stephens City) and Winchester Gateway 2 (105 acres south of Winchester). Supervisor Blaine Dunn (Red Bud) cast the only vote in favor.',
    created_at: '2025-06-18T00:00:00Z',
    seeded: true,
  },
]

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

const CARD_EXCERPT_LEN = 160
const FEATURED_EXCERPT_LEN = 420

// ── Grid article card ─────────────────────────────────────────────────────────
function ArticleCard({ article, expanded, onToggle }) {
  const isLong = article.body.length > CARD_EXCERPT_LEN
  const bodyText = expanded || !isLong
    ? article.body
    : article.body.slice(0, CARD_EXCERPT_LEN).trimEnd() + '…'

  return (
    <article className={styles.card}>
      <span className={styles.cardDate}>{formatDate(article.created_at)}</span>
      <h3 className={styles.cardTitle}>{article.title}</h3>
      <div className={styles.cardAuthor}>By Campaign Staff</div>
      <div className={styles.cardBody}>
        {bodyText.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
      </div>
      {isLong && (
        <button className={styles.expandBtn} onClick={onToggle} aria-expanded={expanded}>
          {expanded ? 'Read less ▲' : 'Read more ▼'}
        </button>
      )}
    </article>
  )
}

// ── Featured article ──────────────────────────────────────────────────────────
function FeaturedArticle({ article, expanded, onToggle }) {
  const isLong = article.body.length > FEATURED_EXCERPT_LEN
  const bodyText = expanded || !isLong
    ? article.body
    : article.body.slice(0, FEATURED_EXCERPT_LEN).trimEnd() + '…'

  return (
    <article className={styles.featured}>
      <span className={styles.featuredDate}>{formatDate(article.created_at)}</span>
      <h2 className={styles.featuredTitle}>{article.title}</h2>
      <div className={styles.featuredAuthor}>By Campaign Staff</div>
      <div className={styles.featuredBody}>
        {bodyText.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
      </div>
      {isLong && (
        <button className={styles.featuredExpandBtn} onClick={onToggle} aria-expanded={expanded}>
          {expanded ? 'Read less ▲' : 'Read more ▼'}
        </button>
      )}
    </article>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function NewsPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )

  const [dbUpdates, setDbUpdates] = useState(null) // null = loading
  const [expandedIds, setExpandedIds] = useState(new Set())

  useEffect(() => {
    async function fetchUpdates() {
      const { data, error } = await supabase
        .from('news')
        .select('id, title, body, created_at')
        .order('created_at', { ascending: false })
      setDbUpdates(error ? [] : data)
    }
    fetchUpdates()
  }, [])

  const allUpdates = dbUpdates === null
    ? null
    : [...dbUpdates.map(u => ({ ...u, seeded: false })), ...SEEDED_UPDATES]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const featured = allUpdates?.[0] ?? null
  const gridArticles = allUpdates?.slice(1) ?? []

  function toggleExpanded(id) {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderVol}>Campaign Updates · Protect Frederick</div>
        <h1>Latest <em>News</em></h1>
        <p className={styles.pageHeaderDeck}>
          Updates from the Board of Supervisors, public forums, and the broader campaign to protect Frederick County.
        </p>
      </div>

      <main className={styles.pageMain}>
        {allUpdates === null && (
          <div className={styles.loadingState}>Loading updates…</div>
        )}

        {allUpdates !== null && allUpdates.length === 0 && (
          <div className={styles.emptyState}>
            <p>No updates yet. Check back soon.</p>
          </div>
        )}

        {allUpdates !== null && allUpdates.length > 0 && (
          <>
            {featured && (
              <FeaturedArticle
                article={featured}
                expanded={expandedIds.has(featured.id)}
                onToggle={() => toggleExpanded(featured.id)}
              />
            )}

            {gridArticles.length > 0 && (
              <div className={styles.grid}>
                {gridArticles.map(article => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    expanded={expandedIds.has(article.id)}
                    onToggle={() => toggleExpanded(article.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  )
}
