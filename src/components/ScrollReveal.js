'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Attaches an IntersectionObserver to all `.fade-up` elements on the page.
 * When an element enters the viewport, adds `.visible` to trigger the CSS
 * transition defined in globals.css. Re-runs on each route change to pick up
 * new page content. Renders nothing — purely behavioral.
 */
export default function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    // Brief delay lets the new page's DOM fully render before we observe
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.fade-up:not(.visible)')
      if (!els.length) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      )

      els.forEach((el) => observer.observe(el))
      return () => observer.disconnect()
    }, 50)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
