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

  useEffect(() => {
    if (!target) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setCount(target)
      return
    }

    const el = ref.current
    if (!el) return

    function runAnimation() {
      if (hasAnimated.current) return
      hasAnimated.current = true

      const startTime = performance.now()
      const step = (now) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.round(eased * target))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation()
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return [count, ref]
}
