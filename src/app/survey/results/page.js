'use client'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import styles from '@/styles/results.module.css'

// Per-bar colours for the stance chart (support → oppose)
const STANCE_COLORS = {
  'Strongly Support':    '#2D4A2D',
  'Somewhat Support':    '#3D6B3D',
  'Neutral / Undecided': '#8B6914',
  'Somewhat Oppose':     '#6B2210',
  'Strongly Oppose':     '#8B2E1A',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--ink)', color: 'var(--cream)',
      padding: '8px 14px', fontSize: '13px', lineHeight: 1.5,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
      <div style={{ color: 'var(--gold-lt)' }}>{payload[0].value} response{payload[0].value !== 1 ? 's' : ''}</div>
    </div>
  )
}

function HBar({ data, colorKey, yWidth = 180, color = 'var(--barn)' }) {
  if (!data?.length) return <p className={styles.emptyChart}>No responses yet.</p>
  const height = Math.max(120, data.length * 48)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart layout="vertical" data={data} margin={{ top: 0, right: 32, bottom: 0, left: 0 }}>
        <XAxis
          type="number" allowDecimals={false}
          tick={{ fill: '#5C4D3C', fontSize: 11 }}
          tickLine={false} axisLine={false}
        />
        <YAxis
          type="category" dataKey="label" width={yWidth}
          tick={{ fill: '#2A2118', fontSize: 12 }}
          tickLine={false} axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,46,26,0.06)' }} />
        <Bar dataKey="count" radius={[0, 3, 3, 0]}>
          {data.map(entry => (
            <Cell
              key={entry.label}
              fill={colorKey ? (colorKey[entry.label] || color) : color}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

export default function ResultsPage() {
  const [data, setData]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [mounted, setMounted]     = useState(false)

  async function fetchData(isRefresh = false) {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setFetchError(null)
    try {
      const res  = await fetch('/api/survey/results')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load data.')
      setData(json)
    } catch (err) {
      setFetchError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [])

  return (
    <main className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>Live Results</div>
          <h1 className={styles.heroTitle}>
            What Frederick County<br />
            <em>residents are saying</em>
          </h1>
          {data && (
            <div className={styles.totalBlock}>
              <span className={styles.totalNum}>{data.totalResponses}</span>
              <span className={styles.totalLabel}>
                {data.totalResponses === 1 ? 'resident has responded' : 'residents have responded'}
              </span>
            </div>
          )}
          {loading && !data && (
            <div className={styles.totalBlock}>
              <span className={styles.totalNum}>—</span>
            </div>
          )}
        </div>
      </section>

      {/* ── Charts ── */}
      <section className={styles.chartsSection}>
        <div className={styles.chartsInner}>

          {/* Meta bar */}
          <div className={styles.metaBar}>
            <span className={styles.metaTimestamp}>
              {data ? `Last updated: ${formatDate(data.fetchedAt)}` : loading ? 'Loading…' : ''}
            </span>
            <button
              className={styles.refreshBtn}
              onClick={() => fetchData(true)}
              disabled={loading || refreshing}
            >
              {refreshing ? 'Refreshing…' : 'Refresh ↺'}
            </button>
          </div>

          {/* Loading state */}
          {loading && !data && (
            <div className={styles.stateBlock}>
              <div className={styles.spinner}>⟳</div>
              <p className={styles.stateDesc}>Loading survey data…</p>
            </div>
          )}

          {/* Error state */}
          {fetchError && (
            <div className={styles.stateBlock}>
              <p className={styles.stateTitle}>Could not load results</p>
              <p className={styles.stateDesc}>{fetchError}</p>
            </div>
          )}

          {/* Empty state */}
          {data && data.totalResponses === 0 && (
            <div className={styles.stateBlock}>
              <p className={styles.stateTitle}>No responses yet</p>
              <p className={styles.stateDesc}>Be the first to share your perspective.</p>
            </div>
          )}

          {/* ── Charts — only render after mount (Recharts needs DOM) ── */}
          {mounted && data && data.totalResponses > 0 && (
            <>
              {/* Stance */}
              <div className={styles.chartBlock}>
                <h2 className={styles.blockHeadline}>Overall Stance</h2>
                <p className={styles.blockDesc}>
                  How residents describe their position on new data center development in Frederick County.
                </p>
                <HBar
                  data={data.stanceDistribution}
                  colorKey={STANCE_COLORS}
                  yWidth={160}
                />
              </div>

              {/* Concerns */}
              <div className={styles.chartBlock}>
                <h2 className={styles.blockHeadline}>Top Concerns</h2>
                <p className={styles.blockDesc}>
                  Primary concerns selected by residents (up to 3 each), ranked by total mentions.
                </p>
                <HBar
                  data={data.concernsDistribution}
                  color="var(--barn)"
                  yWidth={210}
                />
              </div>

              {/* Benefits */}
              <div className={styles.chartBlock}>
                <h2 className={styles.blockHeadline}>Perceived Benefits</h2>
                <p className={styles.blockDesc}>
                  Benefits residents believe data centers might bring to the county, ranked by total mentions.
                </p>
                <HBar
                  data={data.benefitsDistribution}
                  color="var(--forest)"
                  yWidth={180}
                />
              </div>

              {/* Zoning */}
              <div className={styles.chartBlock}>
                <h2 className={styles.blockHeadline}>Zoning Preference</h2>
                <p className={styles.blockDesc}>
                  Where residents believe data centers should be permitted, if at all.
                </p>
                <HBar
                  data={data.zoningDistribution}
                  color="var(--gold)"
                  yWidth={220}
                />
              </div>

              {/* Ag priority */}
              <div className={styles.chartBlock}>
                <h2 className={styles.blockHeadline}>Agricultural Preservation Priority</h2>
                <p className={styles.blockDesc}>
                  How important residents feel it is to prioritize agricultural preservation and agri-tourism over industrial tech development (1 = not important, 10 = extremely important).
                </p>
                {data.agDistribution.average !== null && (
                  <div className={styles.avgDisplay}>
                    <span className={styles.avgNum}>{data.agDistribution.average}</span>
                    <span className={styles.avgLabel}>average out of 10</span>
                  </div>
                )}
                <HBar
                  data={data.agDistribution.distribution.map(d => ({ label: String(d.value), count: d.count }))}
                  color="var(--barn)"
                  yWidth={40}
                />
              </div>

              {/* Tax increase */}
              <div className={styles.chartBlock}>
                <h2 className={styles.blockHeadline}>Tax Increase as an Alternative</h2>
                <p className={styles.blockDesc}>
                  Whether residents would favor a modest tax increase to fund county services rather than relying on data center tax revenue.
                </p>
                <HBar
                  data={data.taxDistribution}
                  colorKey={{
                    'Yes — support a tax increase':  '#2D4A2D',
                    'Unsure — need more info':        '#8B6914',
                    'No — oppose a tax increase':     '#8B2E1A',
                  }}
                  yWidth={200}
                />
              </div>

              {/* District */}
              <div className={styles.chartBlock}>
                <h2 className={styles.blockHeadline}>Responses by District</h2>
                <p className={styles.blockDesc}>
                  Number of survey responses received from each Frederick County magisterial district.
                </p>
                <HBar
                  data={data.districtDistribution}
                  color="var(--ink-2)"
                  yWidth={200}
                />
              </div>
            </>
          )}

        </div>
      </section>

    </main>
  )
}
