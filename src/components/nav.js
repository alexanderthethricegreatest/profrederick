'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Nav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: '/',              label: 'Home' },
    { href: '/faq',          label: 'FAQ' },
    { href: '/documents',    label: 'Resources' },
    { href: '/forums',       label: "Who's Behind the Forums?" },
    { href: '/news',      label: 'News' },
    { href: '/endorsements', label: 'Endorsements' },
  ]

  return (
    <>
      <nav>
        <div className="nav-left">
          <div className="nav-title">Frederick County, Virginia</div>
          <div className="nav-sub">Community Forum · February 2026</div>
        </div>

        <div className="nav-links">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link${pathname === href ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <Link href="/petition" className="nav-cta">
            Sign the Petition →
          </Link>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={pathname === href ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        <Link
          href="/petition"
          className="mobile-petition"
          onClick={() => setMenuOpen(false)}
        >
          Sign the Petition →
        </Link>
      </div>
    </>
  )
}