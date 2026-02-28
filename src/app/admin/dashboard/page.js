'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

const DISTRICTS = ['Back Creek', 'Gainesboro', 'Opequon', 'Red Bud', 'Shawnee', 'Stonewall']

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
  .adm * { box-sizing: border-box; margin: 0; padding: 0; }
  .adm { min-height: 100vh; background: #0a0a0f; color: #e2e8f0; font-family: 'Inter', sans-serif; display: flex; }

  /* Sidebar */
  .sidebar {
    position: fixed; top: 0; left: 0; bottom: 0; width: 220px;
    background: #0f0f1a; border-right: 1px solid #1e2030;
    display: flex; flex-direction: column; z-index: 10;
  }
  .sidebar-logo { padding: 24px 20px 20px; border-bottom: 1px solid #1e2030; }
  .sidebar-logo-label {
    font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 600;
    letter-spacing: .18em; color: #4ade80; text-transform: uppercase; margin-bottom: 4px;
  }
  .sidebar-logo-title { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: #f1f5f9; }
  .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px; cursor: pointer;
    font-size: 13px; font-weight: 500; color: #64748b; border: 1px solid transparent;
    transition: all .15s; border-radius: 2px; background: none; width: 100%; text-align: left;
  }
  .nav-item:hover { color: #e2e8f0; background: #1e2030; }
  .nav-item.active { color: #4ade80; background: rgba(74,222,128,0.08); border-color: rgba(74,222,128,0.15); }
  .nav-badge {
    margin-left: auto; background: #f87171; color: white; font-size: 10px; font-weight: 700;
    padding: 1px 6px; border-radius: 10px; font-family: 'JetBrains Mono', monospace;
  }
  .sidebar-footer { padding: 16px 20px; border-top: 1px solid #1e2030; display: flex; flex-direction: column; gap: 8px; }
  .sidebar-stats { font-size: 11px; color: #334155; font-family: 'JetBrains Mono', monospace; }
  .signout-btn {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600;
    letter-spacing: .1em; text-transform: uppercase; background: none;
    border: 1px solid #1e2030; color: #475569; padding: 7px 12px;
    cursor: pointer; transition: all .15s; text-align: left; width: 100%;
  }
  .signout-btn:hover { border-color: #f87171; color: #f87171; }

  /* Content */
  .content { margin-left: 220px; padding: 32px 40px; flex: 1; }
  .page-title { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 700; color: #f1f5f9; margin-bottom: 4px; }
  .page-sub { font-size: 13px; color: #475569; margin-bottom: 32px; }

  /* Stat boxes */
  .stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 32px; }
  .stat-box { background: #0f0f1a; border: 1px solid #1e2030; padding: 20px 24px; }
  .stat-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #475569; margin-bottom: 8px; }
  .stat-num { font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: 700; color: #f1f5f9; line-height: 1; }
  .stat-num.green { color: #4ade80; }
  .stat-num.yellow { color: #fbbf24; }

  /* Cards */
  .card { background: #0f0f1a; border: 1px solid #1e2030; margin-bottom: 12px; }
  .card-head {
    padding: 16px 20px; border-bottom: 1px solid #1e2030;
    display: flex; align-items: center; justify-content: space-between;
  }
  .card-title { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: #f1f5f9; }
  .card-meta { font-size: 11px; color: #475569; }
  .card-body { padding: 20px; }

  /* Table */
  .tbl { width: 100%; border-collapse: collapse; }
  .tbl th {
    font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 600;
    letter-spacing: .14em; text-transform: uppercase; color: #475569;
    text-align: left; padding: 10px 16px; border-bottom: 1px solid #1e2030; white-space: nowrap;
  }
  .tbl td { font-size: 13px; color: #94a3b8; padding: 12px 16px; border-bottom: 1px solid #0f1020; vertical-align: top; }
  .tbl tr:last-child td { border-bottom: none; }
  .tbl tr:hover td { background: rgba(255,255,255,0.02); }
  .t-name { font-weight: 500; color: #e2e8f0; }
  .t-dist { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; color: #4ade80; }
  .t-date { font-family: 'JetBrains Mono', monospace; font-size: 11px; }
  .t-sm { font-size: 11px; }
  .t-note { font-size: 12px; color: #64748b; font-style: italic; margin-top: 4px; line-height: 1.5; }

  /* Badge */
  .badge { display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 3px 8px; border-radius: 2px; font-family: 'JetBrains Mono', monospace; }
  .badge-pending { background: rgba(251,191,36,0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
  .badge-approved { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }

  /* Buttons */
  .btn { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; border: none; cursor: pointer; padding: 7px 14px; transition: all .15s; }
  .btn-approve { background: rgba(74,222,128,0.15); color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
  .btn-approve:hover { background: rgba(74,222,128,0.25); }
  .btn-danger { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2); }
  .btn-danger:hover { background: rgba(248,113,113,0.2); }
  .btn-primary { background: #4ade80; color: #0a0a0f; padding: 11px 24px; font-size: 12px; }
  .btn-primary:hover { background: #86efac; }
  .btn-primary:disabled { opacity: .4; cursor: not-allowed; }

  /* Form */
  .fg { margin-bottom: 16px; }
  .fl { display: block; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: #475569; margin-bottom: 7px; }
  .fi, .fta { width: 100%; background: #0a0a0f; border: 1px solid #1e2030; color: #e2e8f0; font-family: 'Inter', sans-serif; font-size: 14px; padding: 10px 14px; outline: none; transition: border-color .2s; }
  .fi:focus, .fta:focus { border-color: #4ade80; }
  .fta { resize: vertical; min-height: 130px; line-height: 1.6; }
  .f-err { font-size: 12px; color: #f87171; margin-top: 8px; font-family: 'JetBrains Mono', monospace; }
  .f-ok  { font-size: 12px; color: #4ade80;  margin-top: 8px; font-family: 'JetBrains Mono', monospace; }

  /* District bars */
  .d-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #1e2030; }
  .d-row:last-child { border-bottom: none; }
  .d-name { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #94a3b8; width: 110px; flex-shrink: 0; }
  .d-track { flex: 1; background: #1e2030; height: 6px; border-radius: 1px; overflow: hidden; }
  .d-fill { height: 100%; background: #4ade80; transition: width .6s ease; }
  .d-count { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: #e2e8f0; width: 32px; text-align: right; }

  .empty { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #334155; padding: 28px; }
  .loading { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #475569; padding: 28px; }

  @media (max-width: 900px) {
    .adm { flex-direction: column; }
    .sidebar { position: static; width: 100%; border-right: none; border-bottom: 1px solid #1e2030; }
    .content { margin-left: 0; padding: 24px 20px; }
    .stats-row { grid-template-columns: 1fr 1fr; }
    .sidebar-nav { flex-direction: row; flex-wrap: wrap; }
  }
`

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── Signatures Tab ────────────────────────────────────────────────────────────

function SignaturesTab({ signatures }) {
  const counts = {}
  DISTRICTS.forEach(d => counts[d] = 0)
  signatures?.forEach(s => { if (counts[s.district] !== undefined) counts[s.district]++ })
  const max = Math.max(...Object.values(counts), 1)

  return (
    <div>
      <div className="page-title">Petition Signatures</div>
      <div className="page-sub">All signed petition entries</div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-label">Total</div>
          <div className="stat-num green">{signatures?.length ?? '—'}</div>
        </div>
        {DISTRICTS.slice(0, 3).map(d => (
          <div key={d} className="stat-box">
            <div className="stat-label">{d}</div>
            <div className="stat-num">{counts[d]}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{marginBottom:24}}>
        <div className="card-head"><div className="card-title">District Breakdown</div></div>
        <div className="card-body">
          {DISTRICTS.map(d => (
            <div key={d} className="d-row">
              <div className="d-name">{d}</div>
              <div className="d-track">
                <div className="d-fill" style={{width:`${Math.round((counts[d]/max)*100)}%`}} />
              </div>
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
                    <td className="t-dist">{s.district}</td>
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
    <div>
      <div className="page-title">Endorsements</div>
      <div className="page-sub">Review and approve organizational endorsements</div>

      <div className="stats-row" style={{gridTemplateColumns:'repeat(2,1fr)'}}>
        <div className="stat-box">
          <div className="stat-label">Pending Review</div>
          <div className="stat-num yellow">{pending.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Approved</div>
          <div className="stat-num green">{approved.length}</div>
        </div>
      </div>

      {!endorsements && <div className="loading">Loading...</div>}

      {pending.length > 0 && (
        <div className="card" style={{marginBottom:24}}>
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
                      <div style={{display:'flex',gap:'6px'}}>
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
// ── Community Events Tab ───────────────────────────────────────────────────────

function CommunityEventsTab({ events, onApprove, onDelete }) {
  const pending  = events?.filter(e => !e.approved) ?? []
  const approved = events?.filter(e =>  e.approved) ?? []

  function formatDate(dateStr) {
    if (!dateStr) return '—'
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div>
      <div className="page-title">Community Events</div>
      <div className="page-sub">Review and approve community-submitted events</div>

      {!events && <div className="loading">Loading...</div>}

      {/* Pending */}
      <div className="card" style={{marginBottom:24}}>
        <div className="card-title">Pending Review <span className="nav-badge" style={{marginLeft:8}}>{pending.length}</span></div>
        {pending.length === 0 && <div className="empty">No pending events.</div>}
        {pending.length > 0 && (
          <table className="tbl">
            <thead><tr>
              <th>Event</th><th>Date</th><th>Location</th><th>Organizer</th><th>Submitted</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {pending.map(e => (
                <tr key={e.id}>
                  <td>
                    <strong>{e.title}</strong>
                    <div style={{fontSize:11,color:'#64748b',marginTop:2,maxWidth:280}}>{e.description}</div>
                    {e.external_link && <a href={e.external_link} target="_blank" rel="noopener" style={{fontSize:11,color:'#3b82f6'}}>Link →</a>}
                  </td>
                  <td>{formatDate(e.date)}{e.time ? ` · ${e.time}` : ''}</td>
                  <td style={{fontSize:12}}>{e.location}</td>
                  <td style={{fontSize:12}}>
                    {e.organizer_name}<br />
                    <span style={{color:'#64748b'}}>{e.organizer_email}</span>
                  </td>
                  <td style={{fontSize:11,color:'#64748b'}}>{new Date(e.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="approve-btn" onClick={() => onApprove(e.id)}>Approve</button>
                    <button className="delete-btn" onClick={() => onDelete(e.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Approved */}
      <div className="card">
        <div className="card-title">Approved <span style={{color:'#64748b',fontWeight:400}}>({approved.length})</span></div>
        {approved.length === 0 && <div className="empty">No approved events yet.</div>}
        {approved.length > 0 && (
          <table className="tbl">
            <thead><tr>
              <th>Event</th><th>Date</th><th>Location</th><th>Organizer</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {approved.map(e => (
                <tr key={e.id}>
                  <td><strong>{e.title}</strong></td>
                  <td>{formatDate(e.date)}{e.time ? ` · ${e.time}` : ''}</td>
                  <td style={{fontSize:12}}>{e.location}</td>
                  <td style={{fontSize:12}}>{e.organizer_name}</td>
                  <td>
                    <button className="delete-btn" onClick={() => onDelete(e.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ── News Tab ──────────────────────────────────────────────────────────────────

function NewsTab({ supabase }) {
  const [title, setTitle]       = useState('')
  const [body, setBody]         = useState('')
  const [date, setDate]         = useState(new Date().toISOString().split('T')[0])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  async function handleSubmit() {
    setError('')
    if (!title.trim()) { setError('Title is required.'); return }
    if (!body.trim())  { setError('Body is required.');  return }

    setSubmitting(true)

    // Pass session token — API route verifies it server-side
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/admin/news', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ title, body, date }),
    })

    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Failed to post.'); setSubmitting(false); return }

    setSuccess(true)
    setTitle(''); setBody('')
    setDate(new Date().toISOString().split('T')[0])
    setSubmitting(false)
    setTimeout(() => setSuccess(false), 4000)
  }

  return (
    <div>
      <div className="page-title">Post Update</div>
      <div className="page-sub">New entries appear on /news immediately</div>
      <div className="card" style={{maxWidth:640}}>
        <div className="card-head"><div className="card-title">New Update</div></div>
        <div className="card-body">
          <div className="fg">
            <label className="fl">Title</label>
            <input className="fi" type="text" placeholder="Update headline..."
              value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Date</label>
            <input className="fi" type="date" style={{colorScheme:'dark'}}
              value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Body</label>
            <textarea className="fta" placeholder="Update body text..."
              value={body} onChange={e => setBody(e.target.value)} />
          </div>
          {error   && <div className="f-err">⚠ {error}</div>}
          {success && <div className="f-ok">✓ Update posted successfully.</div>}
          <button className="btn btn-primary" style={{marginTop:16}}
            onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Update →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )
  const router = useRouter()

  const [tab, setTab]               = useState('signatures')
  const [sessionReady, setSessionReady] = useState(false)
  const [signatures, setSignatures]   = useState(null)
  const [endorsements, setEndorsements] = useState(null)
  const [communityEvents, setCommunityEvents] = useState(null)

  useEffect(() => {
    // Redirect to login if no valid session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/admin')
      } else {
        setSessionReady(true)
        loadData()
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.replace('/admin')
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadData() {
    const [sigsRes, endRes, evtRes] = await Promise.all([
      supabase.from('signatures').select('name, district, created_at').order('created_at', { ascending: false }),
      supabase.from('endorsements').select('*').order('created_at', { ascending: false }),
      supabase.from('community_events').select('*').order('created_at', { ascending: false }),
    ])
    if (!sigsRes.error) setSignatures(sigsRes.data)
    if (!endRes.error)  setEndorsements(endRes.data)
    if (!evtRes.error)  setCommunityEvents(evtRes.data)
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

  const pendingCount = endorsements?.filter(e => !e.approved).length ?? 0
  const pendingEventsCount = communityEvents?.filter(e => !e.approved).length ?? 0

  const TABS = [
    { key: 'signatures',   label: 'Signatures',   icon: '✍' },
    { key: 'endorsements', label: 'Endorsements',  icon: '🏛', badge: pendingCount || null },
    { key: 'community-events', label: 'Community Events',   icon: '📅', badge: pendingEventsCount || null },
    { key: 'news',         label: 'Post Update',   icon: '📡' },
  ]

  if (!sessionReady) return (
    <>
      <style>{css}</style>
      <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'12px',color:'#475569'}}>Checking session...</div>
      </div>
    </>
  )

  return (
    <>
      <style>{css}</style>
      <div className="adm">
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-label">Admin</div>
            <div className="sidebar-logo-title">Protect Frederick</div>
          </div>
          <nav className="sidebar-nav">
            {TABS.map(t => (
              <button key={t.key} className={`nav-item ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
                <span style={{fontSize:15}}>{t.icon}</span>
                {t.label}
                {t.badge ? <span className="nav-badge">{t.badge}</span> : null}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-stats">
              {signatures?.length ?? '—'} sigs · {endorsements?.filter(e=>e.approved).length ?? '—'} endorsed
            </div>
            <button className="signout-btn" onClick={handleSignOut}>Sign Out →</button>
          </div>
        </div>

        <div className="content">
          {tab === 'signatures'   && <SignaturesTab signatures={signatures} />} 
          {tab === 'community-events' && <CommunityEventsTab events={communityEvents} onApprove={handleEventApprove} onDelete={handleEventDelete} />}
          {tab === 'endorsements' && <EndorsementsTab endorsements={endorsements} onApprove={handleApprove} onDelete={handleDelete} />}
          {tab === 'news'         && <NewsTab supabase={supabase} />}
        </div>
      </div>
    </>
  )
}