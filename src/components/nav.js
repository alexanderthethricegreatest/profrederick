'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

function Dropdown({ label, items, pathname }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const isActive = items.some(i => pathname === i.href)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="nav-dropdown" ref={ref}>
      <button
        className={`nav-link nav-dropdown-trigger${isActive ? ' active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {label}
        <span className={`nav-chevron${open ? ' open' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="nav-dropdown-menu">
          {items.map(({ href, label: itemLabel }) => (
            <Link
              key={href}
              href={href}
              className={`nav-dropdown-item${pathname === href ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {itemLabel}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Nav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  if (pathname?.startsWith('/admin')) return null

  const learnItems = [
    { href: '/faq',       label: 'FAQ' },
    { href: '/forums',    label: "Who's Behind the Forums?" },
    { href: '/documents', label: 'Learning Resources & Media' },
    { href: '/comprehensive-plan', label: 'The 2050 Plan' },
    { href: '/the-board',          label: 'The Board'}, 
  ]

  const resourcesItems = [
    { href: '/flyers', label: 'Flyers' },
  ]

  const communityItems = [
    { href: '/endorsements', label: 'Endorsements' },
    { href: '/volunteer',    label: 'Volunteer' },
  ]

  const allLinks = [
    { href: '/',                   label: 'Home' },
    { href: '/about',              label: 'About' },
    ...learnItems,
    ...resourcesItems,
    { href: '/news',               label: 'News' },
    { href: '/events',             label: 'Events' },
    { href: '/sign-order',         label: 'Request A Sign' },
    ...communityItems,
  ]

  return (
    <>
      <nav>
        <div className="nav-left">
          <div className="nav-title">Protect Frederick County</div>
          <div className="nav-sub">Community Forum · March 2026</div>
        </div>

        <div className="nav-links">
          <Link href="/"      className={`nav-link${pathname === '/'      ? ' active' : ''}`}>Home</Link>
          <Link href="/about" className={`nav-link${pathname === '/about' ? ' active' : ''}`}>About</Link>
          <Dropdown label="Learn"     items={learnItems}     pathname={pathname} />
          <Dropdown label="Resources" items={resourcesItems} pathname={pathname} />
          <Link href="/news"   className={`nav-link${pathname === '/news'   ? ' active' : ''}`}>News</Link>
          <Link href="/events" className={`nav-link${pathname === '/events' ? ' active' : ''}`}>Events</Link>
          <Link href="/sign-order" className={`nav-link${pathname === '/sign-order' ? ' active' : ''}`}>Request A Sign</Link>
          <Dropdown label="Community" items={communityItems} pathname={pathname} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span></span><span></span><span></span>
          </button>
          <Link href="/petition" className="nav-cta">Sign the Petition →</Link>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <Link href="/" className={pathname === '/' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Home</Link>
        <Link href="/about" className={pathname === '/about' ? 'active' : ''} onClick={() => setMenuOpen(false)}>About</Link>

        <div className="mobile-group-label">Learn</div>
        {learnItems.map(({ href, label }) => (
          <Link key={href} href={href} className={`mobile-group-item${pathname === href ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>{label}</Link>
        ))}

        <div className="mobile-group-label">Resources</div>
        {resourcesItems.map(({ href, label }) => (
          <Link key={href} href={href} className={`mobile-group-item${pathname === href ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>{label}</Link>
        ))}

        <Link href="/news" className={pathname === '/news' ? 'active' : ''} onClick={() => setMenuOpen(false)}>News</Link>
        <Link href="/events" className={pathname === '/events' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Events</Link>
        <Link href="/sign-order" className={pathname === '/sign-order' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Request A Sign</Link>

        <div className="mobile-group-label">Community</div>
        {communityItems.map(({ href, label }) => (
          <Link key={href} href={href} className={`mobile-group-item${pathname === href ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>{label}</Link>
        ))}

        <Link href="/petition" className="mobile-petition" onClick={() => setMenuOpen(false)}>
          Sign the Petition →
        </Link>
      </div>

      <style>{`
        .nav-dropdown { position: relative; }
        .nav-dropdown-trigger {
          display: flex; align-items: center; gap: 4px;
          background: none; border: none; cursor: pointer;
          font-family: inherit;
        }
        .nav-chevron { font-size: 10px; transition: transform .2s; display: inline-block; }
        .nav-chevron.open { transform: rotate(180deg); }
        .nav-dropdown-menu {
          position: absolute; top: calc(100% + 12px); left: 50%;
          transform: translateX(-50%);
          background: var(--ink); border: 1px solid rgba(255,255,255,0.08);
          min-width: 210px; z-index: 100;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .nav-dropdown-item {
          display: block; padding: 11px 18px;
          font-size: 13px; color: rgba(196,184,154,0.7); text-decoration: none;
          transition: all .15s; border-bottom: 1px solid rgba(255,255,255,0.05);
          white-space: nowrap;
        }
        .nav-dropdown-item:last-child { border-bottom: none; }
        .nav-dropdown-item:hover { color: var(--cream); background: rgba(255,255,255,0.05); }
        .nav-dropdown-item.active { color: var(--gold); }
        .mobile-group-label {
          padding: 8px 24px 4px;
          font-size: 8px; font-weight: 700; letter-spacing: .2em;
          text-transform: uppercase; color: var(--gold);
          border-top: 1px solid rgba(196,184,154,0.1);
        }
        .mobile-group-item {
          padding: 13px 24px 13px 36px !important;
          border-left: 2px solid rgba(139,41,26,0.4);
          margin-left: 24px;
          padding-left: 12px !important;
        }
      `}</style>
    </>
  )
}