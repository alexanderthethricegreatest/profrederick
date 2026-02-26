'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

// Only this email can request a magic link
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0f; }
  .gate {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #0a0a0f; font-family: 'Inter', sans-serif;
  }
  .card {
    width: 100%; max-width: 380px;
    border: 1px solid #1e2030; background: #0f0f1a; padding: 48px 40px;
  }
  .dot-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 600; letter-spacing: .14em;
    color: #4ade80; margin-bottom: 24px;
    display: flex; align-items: center; gap: 8px;
  }
  .dot-label::before {
    content: ''; display: block; width: 6px; height: 6px;
    background: #4ade80; border-radius: 50%; animation: pulse 2s infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 22px; font-weight: 700; color: #f1f5f9; margin-bottom: 8px;
  }
  .sub { font-size: 13px; color: #475569; margin-bottom: 32px; line-height: 1.6; }
  .input {
    width: 100%; background: #0a0a0f; border: 1px solid #1e2030; color: #e2e8f0;
    font-family: 'JetBrains Mono', monospace; font-size: 14px;
    padding: 12px 16px; outline: none; transition: border-color .2s; margin-bottom: 12px;
  }
  .input:focus { border-color: #4ade80; }
  .error { font-size: 12px; color: #f87171; margin-bottom: 12px; font-family: 'JetBrains Mono', monospace; }
  .btn {
    width: 100%; background: #4ade80; color: #0a0a0f; border: none;
    font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;
    letter-spacing: .1em; padding: 13px; cursor: pointer; transition: background .2s;
  }
  .btn:hover { background: #86efac; }
  .btn:disabled { opacity: .4; cursor: not-allowed; }
  .sent-icon { font-size: 36px; margin-bottom: 16px; display: block; }
  .sent-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 18px; font-weight: 700; color: #4ade80; margin-bottom: 10px;
  }
  .sent-body { font-size: 13px; color: #475569; line-height: 1.7; }
  .sent-body strong { color: #94a3b8; }
`

export default function AdminLogin() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )

  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSend() {
    setError('')

    if (email.trim().toLowerCase() !== ADMIN_EMAIL?.toLowerCase()) {
      setError('That email is not authorized.')
      return
    }

    setSending(true)

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/admin/verify`,
        shouldCreateUser: false,
      },
    })

    if (authError) {
      // User may not exist yet — create via service role then retry
      const res = await fetch('/api/admin/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      if (!res.ok) {
        setError('Failed to send link. Check your email address.')
        setSending(false)
        return
      }

      // Retry OTP after user creation
      const { error: retryError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo: `${window.location.origin}/admin/verify` },
      })
      if (retryError) {
        setError('Failed to send link. Try again.')
        setSending(false)
        return
      }
    }

    setSent(true)
    setSending(false)
  }

  return (
    <>
      <style>{css}</style>
      <div className="gate">
        <div className="card">
          <div className="dot-label">protect-frederick / admin</div>
          {sent ? (
            <>
              <span className="sent-icon">📬</span>
              <div className="sent-title">Check your email</div>
              <p className="sent-body">
                A magic link was sent to <strong>{email}</strong>.<br /><br />
                Click it to access the dashboard. The link expires in 1 hour and can only be used once.
              </p>
            </>
          ) : (
            <>
              <div className="title">Admin Access</div>
              <div className="sub">
                Enter your admin email. You'll receive a one-time login link — no password needed.
              </div>
              <input
                className="input" type="email" placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              {error && <div className="error">⚠ {error}</div>}
              <button
                className="btn"
                onClick={handleSend}
                disabled={sending || !email.includes('@')}
              >
                {sending ? 'Sending...' : 'Send Magic Link →'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}