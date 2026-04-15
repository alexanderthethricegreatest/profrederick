import { useState, useEffect, useRef } from 'react'

/**
 * Counts from 0 to `target` with an ease-out animation when the ref
 * element enters the viewport. Respects prefers-reduced-motion.
 *
 * @param {number} target  - The final number to count to
 * @param {object} options
 * @param {number} options.duration - Animation duration in ms (default 1500)
 * @returns {[number, React.Ref]} [displayCount, ref]
 */
export default function useCountUp(target, { duration = 1500 } = {}) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!target) return

    // If already animated once, just snap to the new target (e.g. after a new submission)
    if (hasAnimated.current) {
      setCount(target)
      return
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setCount(target)
      hasAnimated.current = true
      return
    }

    const el = ref.current
    if (!el) return

    function startAnimation() {
      if (hasAnimated.current) return
      hasAnimated.current = true

      // Cancel any previously scheduled frame before starting
      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      const startTime = performance.now()
      const step = (now) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.round(eased * target))
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step)
        } else {
          rafRef.current = null
        }
      }
      rafRef.current = requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation()
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      // Cancel any in-flight animation frame so stale loops don't interfere
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
        // Allow re-animation if the effect is torn down before it completed
        // (e.g. React Strict Mode double-invoke in development)
        hasAnimated.current = false
      }
    }
  }, [target, duration])

  return [count, ref]
}
