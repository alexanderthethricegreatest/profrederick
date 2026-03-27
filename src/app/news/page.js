'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import styles from '@/styles/news.module.css'

// ── Hardcoded seed updates ────────────────────────────────────────────────────
const SEEDED_UPDATES = [
  {
    id: 'seed-3',
    title: 'Petition launches with 80+ signatures in first day',
    body: 'The protectfrederick.org petition went live on February 22. Within hours, residents from across all six districts had signed. The petition will be presented at the upcoming public forums on February 24 and 26.',
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
      <p className={styles.cardBody}>{bodyText}</p>
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
      <p className={styles.featuredBody}>{bodyText}</p>
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
            <p>No updates yet. Check back after the February forums.</p>
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
