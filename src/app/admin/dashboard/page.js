'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

const DISTRICTS = ['Back Creek', 'Gainesboro', 'Opequon', 'Red Bud', 'Shawnee', 'Stonewall']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
  .adm * { box-sizing: border-box; margin: 0; padding: 0; }
  .adm { min-height: 100vh; display: flex; font-family: 'Inter', sans-serif; }
  nav { all: unset; }

  /* Sidebar */
  .sidebar {
    position: fixed; top: 0; left: 0; bottom: 0; width: 240px;
    background: #0f1117; border-right: 1px solid #1e2030;
    display: flex; flex-direction: column; z-index: 10;
  }
  .sidebar-logo { padding: 28px 24px 24px; border-bottom: 1px solid #1e2030; }
  .sidebar-logo-eyebrow {
    font-family: 'JetBrains Mono', monospace; font-size: 8px; font-weight: 700;
    letter-spacing: .2em; color: #4ade80; text-transform: uppercase; margin-bottom: 6px;
  }
  .sidebar-logo-title { font-size: 15px; font-weight: 700; color: #f8fafc; }
  .sidebar-logo-sub { font-size: 11px; color: #475569; margin-top: 2px; }
  .sidebar-section-label {
    font-family: 'JetBrains Mono', monospace; font-size: 8px; font-weight: 700;
    letter-spacing: .18em; text-transform: uppercase; color: #334155; padding: 20px 24px 8px;
  }
  .sidebar-nav { flex: 1; padding: 8px 12px; overflow-y: auto; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px; cursor: pointer;
    font-size: 13px; font-weight: 500; color: #64748b; border: 1px solid transparent;
    transition: all .15s; border-radius: 6px; background: none; width: 100%;
    text-align: left; margin-bottom: 2px;
  }
  .nav-item:hover { color: #e2e8f0; background: rgba(255,255,255,0.05); }
  .nav-item.active { color: #f8fafc; background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.08); }
  .nav-item-icon { font-size: 14px; width: 20px; text-align: center; flex-shrink: 0; }
  .nav-badge {
    margin-left: auto; background: #ef4444; color: white; font-size: 10px; font-weight: 700;
    padding: 1px 6px; border-radius: 10px; font-family: 'JetBrains Mono', monospace; flex-shrink: 0;
  }
  .sidebar-footer { padding: 16px; border-top: 1px solid #1e2030; }
  .sidebar-stats {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: #334155; margin-bottom: 10px; line-height: 1.8;
  }
  .signout-btn {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600;
    letter-spacing: .08em; text-transform: uppercase; background: none;
    border: 1px solid #1e2030; color: #475569; padding: 8px 12px;
    cursor: pointer; transition: all .15s; width: 100%; text-align: left; border-radius: 4px;
  }
  .signout-btn:hover { border-color: #ef4444; color: #ef4444; }

  /* Content */
  .content { margin-left: 240px; flex: 1; background: #f8fafc; min-height: 100vh; }
  .content-inner { padding: 36px 40px; max-width: 1200px; }
  .page-hd { margin-bottom: 28px; }
  .page-title { font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -.02em; }
  .page-sub { font-size: 13px; color: #64748b; margin-top: 3px; }

  /* KPI cards */
  .kpi-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 24px; }
  .kpi-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px 22px; }
  .kpi-label { font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: #94a3b8; margin-bottom: 10px; }
  .kpi-val { font-size: 32px; font-weight: 700; color: #0f172a; line-height: 1; letter-spacing: -.02em; }
  .kpi-val.green { color: #16a34a; }
  .kpi-val.amber { color: #d97706; }
  .kpi-val.blue  { color: #2563eb; }
  .kpi-sub { font-size: 11px; color: #94a3b8; margin-top: 6px; }
  .kpi-trend-up { color: #16a34a; font-weight: 600; }

  /* Cards */
  .card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px; overflow: hidden; }
  .card-head { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
  .card-title { font-size: 14px; font-weight: 600; color: #0f172a; }
  .card-meta  { font-size: 12px; color: #94a3b8; }
  .card-body  { padding: 20px; }

  /* Tables */
  .tbl { width: 100%; border-collapse: collapse; }
  .tbl th {
    font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
    color: #94a3b8; text-align: left; padding: 10px 16px;
    border-bottom: 1px solid #f1f5f9; white-space: nowrap; background: #fafafa;
  }
  .tbl td { font-size: 13px; color: #475569; padding: 11px 16px; border-bottom: 1px solid #f8fafc; vertical-align: top; }
  .tbl tr:last-child td { border-bottom: none; }
  .tbl tr:hover td { background: #fafafa; }
  .t-name { font-weight: 600; color: #0f172a; }
  .t-dist {
    display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: .06em;
    text-transform: uppercase; background: #f0fdf4; color: #16a34a;
    border: 1px solid #bbf7d0; padding: 2px 8px; border-radius: 4px;
  }
  .t-date { font-size: 12px; color: #94a3b8; white-space: nowrap; }
  .t-sm   { font-size: 12px; }
  .t-note { font-size: 12px; color: #64748b; line-height: 1.55; max-width: 320px; }

  /* Badges */
  .badge { display: inline-block; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
  .badge-pending  { background: #fef9c3; color: #854d0e; border: 1px solid #fde68a; }
  .badge-approved { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }

  /* Buttons */
  .btn { font-size: 11px; font-weight: 600; letter-spacing: .04em; border: none; cursor: pointer; padding: 6px 12px; transition: all .15s; border-radius: 4px; }
  .btn-approve { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
  .btn-approve:hover { background: #dcfce7; }
  .btn-danger  { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .btn-danger:hover  { background: #fee2e2; }
  .btn-primary { background: #0f172a; color: white; padding: 10px 24px; font-size: 13px; font-weight: 600; border-radius: 6px; border: none; cursor: pointer; }
  .btn-primary:hover { background: #1e293b; }
  .btn-primary:disabled { opacity: .4; cursor: not-allowed; }

  /* Forms */
  .fg { margin-bottom: 16px; }
  .fl { display: block; font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #64748b; margin-bottom: 6px; }
  .fi, .fta { width: 100%; background: white; border: 1px solid #e2e8f0; color: #0f172a; font-family: 'Inter', sans-serif; font-size: 14px; padding: 9px 12px; outline: none; transition: border-color .2s; border-radius: 6px; }
  .fi:focus, .fta:focus { border-color: #0f172a; box-shadow: 0 0 0 3px rgba(15,23,42,.06); }
  .fta { resize: vertical; min-height: 130px; line-height: 1.6; }
  .f-err { font-size: 12px; color: #dc2626; margin-top: 8px; }
  .f-ok  { font-size: 12px; color: #16a34a; margin-top: 8px; font-weight: 600; }

  /* District bars */
  .d-row { display: flex; align-items: center; gap: 14px; padding: 9px 0; }
  .d-name { font-size: 12px; font-weight: 600; color: #475569; width: 110px; flex-shrink: 0; }
  .d-track { flex: 1; background: #f1f5f9; height: 8px; border-radius: 4px; overflow: hidden; }
  .d-fill  { height: 100%; background: #0f172a; border-radius: 4px; transition: width .6s ease; }
  .d-count { font-size: 13px; font-weight: 700; color: #0f172a; width: 36px; text-align: right; }

  /* Sparkline chart */
  .chart-wrap { display: flex; align-items: flex-end; gap: 4px; height: 80px; }
  .chart-col { display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; justify-content: flex-end; }
  .chart-bar { width: 100%; background: #0f172a; border-radius: 2px 2px 0 0; min-height: 2px; }
  .chart-bar:hover { background: #475569; }
  .chart-lbl { font-size: 8px; color: #94a3b8; margin-top: 5px; white-space: nowrap; }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .empty   { font-size: 13px; color: #94a3b8; padding: 28px 20px; }
  .loading { font-size: 13px; color: #94a3b8; padding: 28px 20px; }

  @media (max-width: 960px) {
    .sidebar { position: static; width: 100%; border-right: none; border-bottom: 1px solid #1e2030; }
    .content { margin-left: 0; }
    .kpi-grid { grid-template-columns: 1fr 1fr; }
    .two-col  { grid-template-columns: 1fr; }
    .sidebar-nav { flex-direction: row; flex-wrap: wrap; padding: 8px; }
  }
`

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function fmtDateLocal(d) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── Overview Tab ──────────────────────────────────────────────────────────────

function OverviewTab({ signatures, endorsements, communityEvents }) {
  const total      = signatures?.length ?? 0
  const pendingEnd = endorsements?.filter(e => !e.approved).length ?? 0
  const pendingEvt = communityEvents?.filter(e => !e.approved).length ?? 0

  const sevenAgo = new Date(); sevenAgo.setDate(sevenAgo.getDate() - 7)
  const recent7  = signatures?.filter(s => new Date(s.created_at) > sevenAgo).length ?? 0

  const counts = {}
  DISTRICTS.forEach(d => counts[d] = 0)
  signatures?.forEach(s => { if (counts[s.district] !== undefined) counts[s.district]++ })
  const maxCount = Math.max(...Object.values(counts), 1)

  // Weekly buckets for sparkline
  const weekBuckets = {}
  signatures?.forEach(s => {
    const d = new Date(s.created_at)
    const monday = new Date(d); monday.setDate(d.getDate() - ((d.getDay() + 6) % 7))
    const key = monday.toISOString().split('T')[0]
    weekBuckets[key] = (weekBuckets[key] || 0) + 1
  })
  const weeks = Object.entries(weekBuckets).sort((a,b) => a[0].localeCompare(b[0])).slice(-10)
  const maxWk = Math.max(...weeks.map(w => w[1]), 1)

  const recentSigners = signatures?.slice(0, 8) ?? []
  const leadDistrict  = Object.entries(counts).sort((a,b) => b[1] - a[1])[0]

  return (
    <div className="content-inner">
      <div className="page-hd">
        <div className="page-title">Campaign Overview</div>
        <div className="page-sub">Live data · protectfrederick.org</div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Signatures</div>
          <div className="kpi-val green">{total.toLocaleString()}</div>
          <div className="kpi-sub"><span className="kpi-trend-up">+{recent7}</span> last 7 days</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Endorsements</div>
          <div className="kpi-val blue">{endorsements?.filter(e => e.approved).length ?? '—'}</div>
          <div className="kpi-sub">{pendingEnd > 0 ? <span className="kpi-trend-up">{pendingEnd} pending</span> : 'None pending'}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Pending Approvals</div>
          <div className={`kpi-val ${(pendingEnd + pendingEvt) > 0 ? 'amber' : ''}`}>{pendingEnd + pendingEvt}</div>
          <div className="kpi-sub">{pendingEnd} endorsements · {pendingEvt} events</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Leading District</div>
          <div className="kpi-val" style={{fontSize:20, paddingTop:6}}>{leadDistrict?.[0] ?? '—'}</div>
          <div className="kpi-sub">{leadDistrict?.[1] ?? 0} signatures</div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-head">
            <div className="card-title">Signatures Over Time</div>
            <div className="card-meta">by week</div>
          </div>
          <div className="card-body">
            {weeks.length === 0 && <div className="empty" style={{padding:'8px 0'}}>No data yet.</div>}
            {weeks.length > 0 && (
              <div className="chart-wrap">
                {weeks.map(([key, count]) => {
                  const d = new Date(key)
                  return (
                    <div key={key} className="chart-col" title={`${MONTHS[d.getMonth()]} ${d.getDate()}: ${count}`}>
                      <div className="chart-bar" style={{height:`${Math.round((count/maxWk)*100)}%`}} />
                      <div className="chart-lbl">{MONTHS[d.getMonth()]} {d.getDate()}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">District Breakdown</div>
            <div className="card-meta">{total} total</div>
          </div>
          <div className="card-body">
            {DISTRICTS.map(d => (
              <div key={d} className="d-row">
                <div className="d-name">{d}</div>
                <div className="d-track"><div className="d-fill" style={{width:`${Math.round((counts[d]/maxCount)*100)}%`}} /></div>
                <div className="d-count">{counts[d]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">Recent Signatures</div>
          <div className="card-meta">latest 8</div>
        </div>
        {recentSigners.length === 0 && <div className="empty">No signatures yet.</div>}
        {recentSigners.length > 0 && (
          <table className="tbl">
            <thead><tr><th>Name</th><th>District</th><th>Date</th></tr></thead>
            <tbody>
              {recentSigners.map((s, i) => (
                <tr key={i}>
                  <td className="t-name">{s.name}</td>
                  <td><span className="t-dist">{s.district}</span></td>
                  <td className="t-date">{fmtDate(s.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ── Signatures Tab ────────────────────────────────────────────────────────────

function SignaturesTab({ signatures }) {
  const counts = {}
  DISTRICTS.forEach(d => counts[d] = 0)
  signatures?.forEach(s => { if (counts[s.district] !== undefined) counts[s.district]++ })
  const max = Math.max(...Object.values(counts), 1)

  return (
    <div className="content-inner">
      <div className="page-hd">
        <div className="page-title">Petition Signatures</div>
        <div className="page-sub">All signed petition entries</div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total</div>
          <div className="kpi-val green">{signatures?.length ?? '—'}</div>
        </div>
        {DISTRICTS.slice(0,3).map(d => (
          <div key={d} className="kpi-card">
            <div className="kpi-label">{d}</div>
            <div className="kpi-val">{counts[d]}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{marginBottom:16}}>
        <div className="card-head"><div className="card-title">District Breakdown</div></div>
        <div className="card-body">
          {DISTRICTS.map(d => (
            <div key={d} className="d-row">
              <div className="d-name">{d}</div>
              <div className="d-track"><div className="d-fill" style={{width:`${Math.round((counts[d]/max)*100)}%`}} /></div>
              <div className="d-count">{counts[d]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">All Signers</div>
          <div className="card-meta">{signatures?.length ?? 0} total</div>
        </div>
        <div style={{overflowX:'auto'}}>
          {!signatures && <div className="loading">Loading...</div>}
          {signatures?.length === 0 && <div className="empty">No signatures yet.</div>}
          {signatures?.length > 0 && (
            <table className="tbl">
              <thead><tr><th>Name</th><th>District</th><th>Date</th></tr></thead>
              <tbody>
                {signatures.map((s, i) => (
                  <tr key={i}>
                    <td className="t-name">{s.name}</td>
                    <td><span className="t-dist">{s.district}</span></td>
                    <td className="t-date">{fmtDate(s.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Endorsements Tab ──────────────────────────────────────────────────────────

function EndorsementsTab({ endorsements, onApprove, onDelete }) {
  const pending  = endorsements?.filter(e => !e.approved) ?? []
  const approved = endorsements?.filter(e =>  e.approved) ?? []

  return (
    <div className="content-inner">
      <div className="page-hd">
        <div className="page-title">Endorsements</div>
        <div className="page-sub">Review and approve organizational endorsements</div>
      </div>

      <div className="kpi-grid" style={{gridTemplateColumns:'repeat(2,1fr)'}}>
        <div className="kpi-card">
          <div className="kpi-label">Pending Review</div>
          <div className={`kpi-val ${pending.length > 0 ? 'amber' : ''}`}>{pending.length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Approved & Live</div>
          <div className="kpi-val green">{approved.length}</div>
        </div>
      </div>

      {!endorsements && <div className="loading">Loading...</div>}

      {pending.length > 0 && (
        <div className="card" style={{marginBottom:16}}>
          <div className="card-head">
            <div className="card-title">Pending Approval</div>
            <span className="badge badge-pending">{pending.length} waiting</span>
          </div>
          <div style={{overflowX:'auto'}}>
            <table className="tbl">
              <thead><tr><th>Organization</th><th>Type</th><th>Contact</th><th>Statement</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {pending.map(e => (
                  <tr key={e.id}>
                    <td className="t-name">{e.org_name}</td>
                    <td className="t-sm">{e.org_type}</td>
                    <td className="t-sm">{e.person_name}{e.person_title ? `, ${e.person_title}` : ''}</td>
                    <td><div className="t-note">{e.comment}</div></td>
                    <td className="t-date">{fmtDate(e.created_at)}</td>
                    <td>
                      <div style={{display:'flex', gap:'6px'}}>
                        <button className="btn btn-approve" onClick={() => onApprove(e.id)}>Approve</button>
                        <button className="btn btn-danger"  onClick={() => onDelete(e.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-head">
          <div className="card-title">Approved</div>
          <div className="card-meta">{approved.length} public</div>
        </div>
        <div style={{overflowX:'auto'}}>
          {approved.length === 0 && <div className="empty">No approved endorsements yet.</div>}
          {approved.length > 0 && (
            <table className="tbl">
              <thead><tr><th>Organization</th><th>Type</th><th>Statement</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {approved.map(e => (
                  <tr key={e.id}>
                    <td className="t-name">{e.org_name}</td>
                    <td className="t-sm">{e.org_type}</td>
                    <td><div className="t-note">{e.comment}</div></td>
                    <td className="t-date">{fmtDate(e.created_at)}</td>
                    <td><button className="btn btn-danger" onClick={() => onDelete(e.id)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Community Events Tab ──────────────────────────────────────────────────────

function CommunityEventsTab({ events, onApprove, onDelete }) {
  const pending  = events?.filter(e => !e.approved) ?? []
  const approved = events?.filter(e =>  e.approved) ?? []

  return (
    <div className="content-inner">
      <div className="page-hd">
        <div className="page-title">Community Events</div>
        <div className="page-sub">Review and approve community-submitted events</div>
      </div>

      {!events && <div className="loading">Loading...</div>}

      <div className="card" style={{marginBottom:16}}>
        <div className="card-head">
          <div className="card-title">Pending Review</div>
          {pending.length > 0 && <span className="badge badge-pending">{pending.length} waiting</span>}
        </div>
        {pending.length === 0 && <div className="empty">No pending events.</div>}
        {pending.length > 0 && (
          <div style={{overflowX:'auto'}}>
            <table className="tbl">
              <thead><tr><th>Event</th><th>Date</th><th>Location</th><th>Organizer</th><th>Submitted</th><th>Actions</th></tr></thead>
              <tbody>
                {pending.map(e => (
                  <tr key={e.id}>
                    <td>
                      <div className="t-name">{e.title}</div>
                      <div className="t-note" style={{marginTop:3}}>{e.description}</div>
                      {e.external_link && <a href={e.external_link} target="_blank" rel="noopener" style={{fontSize:11,color:'#2563eb'}}>Link →</a>}
                    </td>
                    <td className="t-date">{fmtDateLocal(e.date)}{e.time ? ` · ${e.time}` : ''}</td>
                    <td className="t-sm">{e.location}</td>
                    <td>
                      <div className="t-sm">{e.organizer_name}</div>
                      <div style={{fontSize:11,color:'#94a3b8'}}>{e.organizer_email}</div>
                    </td>
                    <td className="t-date">{fmtDate(e.created_at)}</td>
                    <td>
                      <div style={{display:'flex', gap:'6px'}}>
                        <button className="btn btn-approve" onClick={() => onApprove(e.id)}>Approve</button>
                        <button className="btn btn-danger"  onClick={() => onDelete(e.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">Approved</div>
          <div className="card-meta">{approved.length} live</div>
        </div>
        {approved.length === 0 && <div className="empty">No approved events yet.</div>}
        {approved.length > 0 && (
          <div style={{overflowX:'auto'}}>
            <table className="tbl">
              <thead><tr><th>Event</th><th>Date</th><th>Location</th><th>Organizer</th><th></th></tr></thead>
              <tbody>
                {approved.map(e => (
                  <tr key={e.id}>
                    <td className="t-name">{e.title}</td>
                    <td className="t-date">{fmtDateLocal(e.date)}{e.time ? ` · ${e.time}` : ''}</td>
                    <td className="t-sm">{e.location}</td>
                    <td className="t-sm">{e.organizer_name}</td>
                    <td><button className="btn btn-danger" onClick={() => onDelete(e.id)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── News Tab ──────────────────────────────────────────────────────────────────

function NewsTab({ supabase }) {
  const [title, setTitle]           = useState('')
  const [body, setBody]             = useState('')
  const [date, setDate]             = useState(new Date().toISOString().split('T')[0])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState(false)

  async function handleSubmit() {
    setError('')
    if (!title.trim()) { setError('Title is required.'); return }
    if (!body.trim())  { setError('Body is required.');  return }
    setSubmitting(true)
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/admin/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      body: JSON.stringify({ title, body, date }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Failed to post.'); setSubmitting(false); return }
    setSuccess(true); setTitle(''); setBody(''); setDate(new Date().toISOString().split('T')[0])
    setSubmitting(false)
    setTimeout(() => setSuccess(false), 4000)
  }

  return (
    <div className="content-inner">
      <div className="page-hd">
        <div className="page-title">Post Update</div>
        <div className="page-sub">New entries appear on /news immediately</div>
      </div>
      <div className="card" style={{maxWidth:640}}>
        <div className="card-head"><div className="card-title">New Update</div></div>
        <div className="card-body">
          <div className="fg">
            <label className="fl">Title</label>
            <input className="fi" type="text" placeholder="Update headline..." value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Date</label>
            <input className="fi" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Body</label>
            <textarea className="fta" placeholder="Update body text..." value={body} onChange={e => setBody(e.target.value)} />
          </div>
          {error   && <div className="f-err">⚠ {error}</div>}
          {success && <div className="f-ok">✓ Posted successfully.</div>}
          <button className="btn btn-primary" style={{marginTop:16}} onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Posting...' : 'Publish Update →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )
  const router = useRouter()

  const [tab, setTab]                        = useState('overview')
  const [sessionReady, setSessionReady]      = useState(false)
  const [signatures, setSignatures]          = useState(null)
  const [endorsements, setEndorsements]      = useState(null)
  const [communityEvents, setCommunityEvents] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace('/admin') }
      else { setSessionReady(true); loadData() }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.replace('/admin')
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadData() {
    const { data: { session } } = await supabase.auth.getSession()

    const [sigsRes, endRes, evtRes] = await Promise.all([
      supabase.from('signatures').select('name, district, created_at').order('created_at', { ascending: false }),
      supabase.from('endorsements').select('*').order('created_at', { ascending: false }),
      fetch(`/api/admin/action?table=community_events&token=${session.access_token}`),
  ])

    if (!sigsRes.error) setSignatures(sigsRes.data)
    if (!endRes.error)  setEndorsements(endRes.data)

    if (evtRes.ok) {
      const evtData = await evtRes.json()
      setCommunityEvents(evtData.data)
    }
}

  async function adminAction(action, table, id) {
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/admin/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, table, id, token: session.access_token }),
    })
    return res.ok
  }

  async function handleApprove(id) {
    const ok = await adminAction('approve', 'endorsements', id)
    if (ok) setEndorsements(prev => prev.map(e => e.id === id ? { ...e, approved: true } : e))
  }
  async function handleDelete(id) {
    if (!confirm('Delete this endorsement?')) return
    const ok = await adminAction('delete', 'endorsements', id)
    if (ok) setEndorsements(prev => prev.filter(e => e.id !== id))
  }
  async function handleEventApprove(id) {
    const ok = await adminAction('approve', 'community_events', id)
    if (ok) setCommunityEvents(prev => prev.map(e => e.id === id ? { ...e, approved: true } : e))
  }
  async function handleEventDelete(id) {
    if (!confirm('Delete this event?')) return
    const ok = await adminAction('delete', 'community_events', id)
    if (ok) setCommunityEvents(prev => prev.filter(e => e.id !== id))
  }
  async function handleSignOut() {
    await supabase.auth.signOut()
    router.replace('/admin')
  }

  const pendingCount     = endorsements?.filter(e => !e.approved).length ?? 0
  const pendingEvtsCount = communityEvents?.filter(e => !e.approved).length ?? 0
  const totalPending     = pendingCount + pendingEvtsCount

  const TABS = [
    { key: 'overview',         label: 'Overview',        icon: '◈' },
    { key: 'signatures',       label: 'Signatures',       icon: '✍' },
    { key: 'endorsements',     label: 'Endorsements',     icon: '🏛', badge: pendingCount || null },
    { key: 'community-events', label: 'Community Events', icon: '📅', badge: pendingEvtsCount || null },
    { key: 'news',             label: 'Post Update',      icon: '📡' },
  ]

  if (!sessionReady) return (
    <>
      <style>{css}</style>
      <div style={{minHeight:'100vh', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{fontFamily:"'Inter',sans-serif", fontSize:'13px', color:'#94a3b8'}}>Loading...</div>
      </div>
    </>
  )

  return (
    <>
      <style>{css}</style>
      <div className="adm">

        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-eyebrow">Admin</div>
            <div className="sidebar-logo-title">Protect Frederick</div>
            <div className="sidebar-logo-sub">Campaign Dashboard</div>
          </div>
          <nav className="sidebar-nav">
            <div className="sidebar-section-label">Navigation</div>
            {TABS.map(t => (
              <button key={t.key} className={`nav-item ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
                <span className="nav-item-icon">{t.icon}</span>
                {t.label}
                {t.badge ? <span className="nav-badge">{t.badge}</span> : null}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-stats">
              {signatures?.length ?? '—'} signatures{'\n'}
              {endorsements?.filter(e => e.approved).length ?? '—'} endorsements{'\n'}
              {totalPending > 0 ? `${totalPending} pending review` : 'Nothing pending'}
            </div>
            <button className="signout-btn" onClick={handleSignOut}>Sign Out →</button>
          </div>
        </div>

        <div className="content">
          {tab === 'overview'         && <OverviewTab signatures={signatures} endorsements={endorsements} communityEvents={communityEvents} />}
          {tab === 'signatures'       && <SignaturesTab signatures={signatures} />}
          {tab === 'endorsements'     && <EndorsementsTab endorsements={endorsements} onApprove={handleApprove} onDelete={handleDelete} />}
          {tab === 'community-events' && <CommunityEventsTab events={communityEvents} onApprove={handleEventApprove} onDelete={handleEventDelete} />}
          {tab === 'news'             && <NewsTab supabase={supabase} />}
        </div>

      </div>
    </>
  )
}