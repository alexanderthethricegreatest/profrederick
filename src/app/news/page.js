'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import styles from '@/styles/news.module.css'

// ── Hardcoded seed updates ────────────────────────────────────────────────────
// Add new ones here, or post them via /admin/news for convenience.
// These always show up regardless of the database.
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
    month: 'long', day: 'numeric', year: 'numeric'
  })
}

export default function NewsPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )

  const [dbUpdates, setDbUpdates] = useState(null) // null = loading

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

  // Merge db updates with seeded ones, sort newest first
  const allUpdates = dbUpdates === null
    ? null
    : [...(dbUpdates.map(u => ({ ...u, seeded: false }))), ...SEEDED_UPDATES]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

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
          <div className={styles.loadingState}>Loading updates...</div>
        )}
        {allUpdates !== null && allUpdates.length === 0 && (
          <div className={styles.emptyState}>
            <p>No updates yet. Check back after the February forums.</p>
          </div>
        )}
        {allUpdates !== null && allUpdates.length > 0 && (
          <div className={styles.updatesList}>
            {allUpdates.map(update => (
              <div
                key={update.id}
                className={`${styles.updateItem} ${update.seeded ? styles.seeded : ''}`}
              >
                <span className={styles.updateDate}>{formatDate(update.created_at)}</span>
                <div className={styles.updateTitle}>{update.title}</div>
                <div className={styles.updateBody}>{update.body}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}