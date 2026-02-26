'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0f; }
  .wrap {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #0a0a0f; font-family: 'JetBrains Mono', monospace;
  }
  .inner { text-align: center; max-width: 320px; }
  .spinner {
    width: 32px; height: 32px; border: 2px solid #1e2030;
    border-top-color: #4ade80; border-radius: 50%;
    animation: spin .8s linear infinite; margin: 0 auto 24px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .msg { font-size: 14px; font-weight: 700; color: #f1f5f9; margin-bottom: 8px; }
  .sub { font-size: 11px; color: #475569; }
  .err { font-size: 13px; color: #f87171; line-height: 1.6; }
  .err a { color: #4ade80; text-decoration: underline; }
`

export default function AdminVerify() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    // Supabase reads the token from the URL hash automatically.
    // We just listen for the SIGNED_IN event and redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.replace('/admin/dashboard')
      }
    })

    // Handle case where session is already established
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/admin/dashboard')
    })

    // If no session after 8 seconds, the link was bad or expired
    const timeout = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) setError('Link expired or already used.')
      })
    }, 8000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  return (
    <>
      <style>{css}</style>
      <div className="wrap">
        <div className="inner">
          {error ? (
            <div className="err">
              ⚠ {error}<br /><br />
              <a href="/admin">← Request a new link</a>
            </div>
          ) : (
            <>
              <div className="spinner" />
              <div className="msg">Verifying...</div>
              <div className="sub">Establishing your session</div>
            </>
          )}
        </div>
      </div>
    </>
  )
}