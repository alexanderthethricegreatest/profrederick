const store = new Map()

// Prune entries older than the window to prevent unbounded memory growth
function prune(windowMs) {
  const cutoff = Date.now() - windowMs
  for (const [key, timestamps] of store.entries()) {
    const fresh = timestamps.filter(t => t > cutoff)
    if (fresh.length === 0) store.delete(key)
    else store.set(key, fresh)
  }
}

/**
 * In-memory sliding-window rate limiter keyed by IP + route.
 * Suitable for single-process deployments. For multi-instance or
 * serverless (Vercel), swap the store for Upstash Redis.
 *
 * @param {Request} req
 * @param {{ limit?: number, windowMs?: number }} opts
 * @returns {{ ok: boolean }}
 */
export function rateLimit(req, { limit = 5, windowMs = 60_000 } = {}) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  // Combine route path + IP so limits are per-endpoint, not global
  const route = new URL(req.url).pathname
  const key = `${route}:${ip}`
  const now = Date.now()
  const cutoff = now - windowMs

  const timestamps = (store.get(key) || []).filter(t => t > cutoff)
  timestamps.push(now)
  store.set(key, timestamps)

  // Prune ~1% of calls to keep memory bounded without dedicated cleanup
  if (Math.random() < 0.01) prune(windowMs)

  return { ok: timestamps.length <= limit }
}
