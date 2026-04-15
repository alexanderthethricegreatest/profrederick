import { NextResponse } from 'next/server'

// Keywords that match relevant government events
const RELEVANT_KEYWORDS = [
  'board of supervisors',
  'planning commission',
  'eda board',
  'economic development authority',
  'development review',
  'comprehensive plans',
  'board of zoning',
  'data center',
  'public information',
  'public hearing',
  'finance committee',
  'transportation committee',
  'work session',
  'joint meeting',
  'joint work session',
]

function isRelevant(title) {
  const lower = title.toLowerCase()
  return RELEVANT_KEYWORDS.some(kw => lower.includes(kw))
}

async function scrapeMonth(year, month) {
  const target = encodeURIComponent(`https://www.fcva.us/services/calendar/-curm-${month}/-cury-${year}`)
  const url = `https://api.scraperapi.com?api_key=${process.env.SCRAPER_API_KEY}&url=${target}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`ScraperAPI failed: ${res.status}`)
  const html = await res.text()

  const events = []

  // Parse table cells: each <td> starts with a day number followed by events
  const tdRegex = /<td[^>]*>\s*(\d{1,2})\s*([\s\S]*?)<\/td>/g
  let tdMatch
  while ((tdMatch = tdRegex.exec(html)) !== null) {
    const day = parseInt(tdMatch[1])
    const cell = tdMatch[2]

    if (day < 1 || day > 31) continue

    // Match: <span class="calendar_eventtime">TIME</span><a class="calendar_eventlink" href="PATH" title="TITLE">
    const eventRegex = /<span class="calendar_eventtime">([^<]+)<\/span><a class="calendar_eventlink" href="(\/Home\/Components\/Calendar\/Event\/[^"]+)" title="([^"]+)"/g
    let eMatch
    while ((eMatch = eventRegex.exec(cell)) !== null) {
      const time  = eMatch[1].trim()
      const path  = eMatch[2]
      const title = eMatch[3].trim()

      if (!isRelevant(title)) continue

      events.push({
        title,
        day,
        month,
        year,
        time,
        url: `https://www.fcva.us${path}`,
        date: new Date(year, month - 1, day).toISOString(),
      })
    }
  }

  return events
}

export async function GET() {
  try {
    const now = new Date()
    const thisYear = now.getFullYear()
    const thisMonth = now.getMonth() + 1
    const nextMonth = thisMonth === 12 ? 1 : thisMonth + 1
    const nextYear = thisMonth === 12 ? thisYear + 1 : thisYear

    const [thisMonthEvents, nextMonthEvents] = await Promise.all([
      scrapeMonth(thisYear, thisMonth),
      scrapeMonth(nextYear, nextMonth),
    ])

    const allEvents = [...thisMonthEvents, ...nextMonthEvents]
      .filter(e => {
        // Only show upcoming events
        const eventDate = new Date(e.year, e.month - 1, e.day)
        return eventDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate())
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    return NextResponse.json({ events: allEvents })
  } catch (err) {
    console.error('FCVA scrape error:', err)
    return NextResponse.json({ events: [] }, { status: 500 })
  }
}