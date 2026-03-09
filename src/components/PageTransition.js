'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * Wraps page content in a fade-in transition on every route change.
 * New page snaps to opacity 0, then fades to 1 over 300ms.
 * The instant disappearance of the old page + fade-in of the new one
 * creates the perception of a fade-out / fade-in transition.
 * No-ops under prefers-reduced-motion.
 */
export default function PageTransition({ children }) {
  const pathname = usePathname()
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // Snap to invisible, then animate to visible
    el.style.transition = 'none'
    el.style.opacity = '0'

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 300ms ease'
        el.style.opacity = '1'
      })
    })

    return () => cancelAnimationFrame(raf)
  }, [pathname])

  return (
    <div ref={containerRef} style={{ opacity: 1 }}>
      {children}
    </div>
  )
}
