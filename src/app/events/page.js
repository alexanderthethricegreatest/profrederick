'use client'

import { useState, useEffect } from 'react'
import styles from '@/styles/events.module.css'

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function getCategoryColor(title) {
  const lower = title.toLowerCase()
  if (lower.includes('board of supervisors') || lower.includes('work session') || lower.includes('joint')) return 'supervisors'
  if (lower.includes('planning commission') || lower.includes('comprehensive plans') || lower.includes('development review') || lower.includes('zoning')) return 'planning'
  if (lower.includes('eda') || lower.includes('economic development')) return 'eda'
  if (lower.includes('data center') || lower.includes('public information') || lower.includes('public hearing')) return 'datacenter'
  if (lower.includes('finance') || lower.includes('transportation')) return 'committee'
  return 'other'
}

function getCategoryLabel(title) {
  const labels = {
    supervisors: 'Board of Supervisors',
    planning: 'Planning',
    eda: 'EDA',
    datacenter: '⚠ Data Center',
    committee: 'Committee',
    other: 'Meeting',
  }
  return labels[getCategoryColor(title)]
}

function isCancelled(title) {
  return title.toLowerCase().includes('cancel') || title.toLowerCase().includes('postponed')
}

const EMPTY_FORM = {
  title: '', description: '', date: '', time: '',
  location: '', organizer_name: '', organizer_email: '', external_link: ''
}

export default function EventsPage() {
  const [fcvaEvents, setFcvaEvents] = useState([])
  const [communityEvents, setCommunityEvents] = useState([])
  const [fcvaLoading, setFcvaLoading] = useState(true)
  const [fcvaError, setFcvaError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    async function fetchFcva() {
      try {
        const res = await fetch('/api/events')
        const data = await res.json()
        setFcvaEvents(data.events || [])
        setLastUpdated(new Date())
      } catch {
        setFcvaError('Could not load events. Check fcva.us directly.')
      } finally {
        setFcvaLoading(false)
      }
    }
    async function fetchCommunity() {
      try {
        const res = await fetch('/api/community-events')
        const data = await res.json()
        setCommunityEvents(data.events || [])
      } catch { /* silently fail */ }
    }
    fetchFcva()
    fetchCommunity()
  }, [])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit() {
    setFormError(null)
    setFormSubmitting(true)
    try {
      const res = await fetch('/api/community-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || 'Something went wrong.')
      } else {
        setFormSuccess(true)
        setForm(EMPTY_FORM)
        setShowForm(false)
      }
    } catch {
      setFormError('Something went wrong. Please try again.')
    } finally {
      setFormSubmitting(false)
    }
  }

  const grouped = fcvaEvents.reduce((acc, event) => {
    const key = `${event.year}-${event.month}`
    if (!acc[key]) acc[key] = { year: event.year, month: event.month, events: [] }
    acc[key].events.push(event)
    return acc
  }, {})

  return (
    <main className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLabel}>Frederick County Government</div>
          <h1 className={styles.heroTitle}>Upcoming <em>Meetings</em><br />& Events</h1>
          <p className={styles.heroDeck}>
            These are the rooms where decisions get made. Board of Supervisors meetings,
            Planning Commission hearings, EDA sessions pulled directly from{' '}
            <a href="https://www.fcva.us/services/calendar" target="_blank" rel="noopener">fcva.us</a>{' '}
            and filtered to what matters for the data center fight.
          </p>
          <div className={styles.heroMeta}>
            <span className={styles.heroMetaDot} />
            {fcvaLoading ? 'Loading events…' : lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : 'Source: fcva.us'}
          </div>
        </div>
      </section>

      {/* ── Legend ── */}
      <div className={styles.legend}>
        <div className={styles.legendInner}>
          {[['supervisors','Board of Supervisors'],['planning','Planning'],['eda','EDA'],['datacenter','Data Center'],['committee','Committee']].map(([key, label]) => (
            <span key={key} className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles[`cat${key.charAt(0).toUpperCase()+key.slice(1)}`]}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── FCVA Events ── */}
      <section className={styles.eventsSection}>
        <div className={styles.eventsInner}>
          {fcvaLoading && (
            <div className={styles.loadingState}>
              <div className={styles.loadingDots}><span /><span /><span /></div>
              <p>Pulling from fcva.us…</p>
            </div>
          )}
          {fcvaError && (
            <div className={styles.errorState}>
              <p>{fcvaError}</p>
              <a href="https://www.fcva.us/services/calendar" target="_blank" rel="noopener">View calendar on fcva.us →</a>
            </div>
          )}
          {!fcvaLoading && !fcvaError && fcvaEvents.length === 0 && (
            <div className={styles.emptyState}>
              <p>No upcoming relevant meetings found.</p>
              <a href="https://www.fcva.us/services/calendar" target="_blank" rel="noopener">Check fcva.us directly →</a>
            </div>
          )}
          {!fcvaLoading && Object.values(grouped).map(({ year, month, events }) => (
            <div key={`${year}-${month}`} className={styles.monthGroup}>
              <div className={styles.monthHeader}>
                <span className={styles.monthName}>{MONTH_NAMES[month - 1]}</span>
                <span className={styles.monthYear}>{year}</span>
                <div className={styles.monthRule} />
              </div>
              <div className={styles.eventsList}>
                {events.map((event, i) => {
                  const cat = getCategoryColor(event.title)
                  const cancelled = isCancelled(event.title)
                  const date = new Date(event.year, event.month - 1, event.day)
                  return (
                    <a key={i} href={event.url} target="_blank" rel="noopener"
                      className={`${styles.eventCard} ${styles[`cat-${cat}`]} ${cancelled ? styles.cancelled : ''}`}>
                      <div className={styles.eventDate}>
                        <span className={styles.eventDay}>{event.day}</span>
                        <span className={styles.eventDayName}>{DAY_NAMES[date.getDay()]}</span>
                      </div>
                      <div className={styles.eventBody}>
                        <div className={styles.eventCategory}>
                          <span className={`${styles.catDot} ${styles[`catDot-${cat}`]}`} />
                          {getCategoryLabel(event.title)}
                          {cancelled && <span className={styles.cancelledBadge}>Cancelled</span>}
                        </div>
                        <div className={styles.eventTitle}>{event.title}</div>
                        {event.time && <div className={styles.eventTime}>{event.time}</div>}
                      </div>
                      <div className={styles.eventArrow}>→</div>
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Community Events ── */}
      <section className={styles.communitySection}>
        <div className={styles.communityInner}>
          <div className={styles.communitySectionHeader}>
            <div>
              <div className={styles.communityLabel}>Community Organized</div>
              <h2 className={styles.communityTitle}>Community Events</h2>
              <p className={styles.communityDeck}>
                Canvassing sessions, organizing meetings, letter-writing nights
                events organized by Frederick County residents.
              </p>
            </div>
            <button
              className={styles.submitToggle}
              onClick={() => { setShowForm(f => !f); setFormSuccess(false) }}
            >
              {showForm ? 'Cancel' : '+ Submit an Event'}
            </button>
          </div>

          {showForm && (
            <div className={styles.formCard}>
              <div className={styles.formTitle}>Submit a Community Event</div>
              <p className={styles.formNote}>Events are reviewed before going live. Your email won't be displayed publicly.</p>
              {formError && <div className={styles.formError}>{formError}</div>}
              <div className={styles.formGrid}>
                <div className={styles.formField} style={{gridColumn:'1/-1'}}>
                  <label>Event Name *</label>
                  <input name="title" value={form.title} onChange={handleChange}
                    placeholder="e.g. Door-to-door canvassing in Red Bud District" />
                </div>
                <div className={styles.formField} style={{gridColumn:'1/-1'}}>
                  <label>Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange}
                    rows={3} placeholder="What is this event? What should people bring or know?" />
                </div>
                <div className={styles.formField}>
                  <label>Date *</label>
                  <input name="date" type="date" value={form.date} onChange={handleChange} />
                </div>
                <div className={styles.formField}>
                  <label>Time</label>
                  <input name="time" value={form.time} onChange={handleChange} placeholder="e.g. 6:00 PM" />
                </div>
                <div className={styles.formField} style={{gridColumn:'1/-1'}}>
                  <label>Location *</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="Address or venue name" />
                </div>
                <div className={styles.formField}>
                  <label>Your Name *</label>
                  <input name="organizer_name" value={form.organizer_name} onChange={handleChange} placeholder="Organizer name" />
                </div>
                <div className={styles.formField}>
                  <label>Your Email *</label>
                  <input name="organizer_email" type="email" value={form.organizer_email} onChange={handleChange}
                    placeholder="Not displayed publicly" />
                </div>
                <div className={styles.formField} style={{gridColumn:'1/-1'}}>
                  <label>External Link</label>
                  <input name="external_link" value={form.external_link} onChange={handleChange}
                    placeholder="Facebook event, Eventbrite, etc. (optional)" />
                </div>
              </div>
              <button className={styles.formSubmit} onClick={handleSubmit} disabled={formSubmitting}>
                {formSubmitting ? 'Submitting…' : 'Submit Event for Review'}
              </button>
            </div>
          )}

          {formSuccess && (
            <div className={styles.formSuccess}>
              ✓ Event submitted! We'll review it and get it posted shortly.
            </div>
          )}

          {communityEvents.length === 0 ? (
            <div className={styles.communityEmpty}>
              <p>No community events yet. Be the first to organize one.</p>
            </div>
          ) : (
            <div className={styles.communityList}>
              {communityEvents.map(event => {
                const date = new Date(event.date + 'T00:00:00')
                return (
                  <div key={event.id} className={styles.communityCard}>
                    <div className={styles.communityDateBadge}>
                      <span className={styles.communityDay}>{date.getDate()}</span>
                      <span className={styles.communityMonth}>{MONTH_NAMES[date.getMonth()].slice(0,3).toUpperCase()}</span>
                    </div>
                    <div className={styles.communityBody}>
                      <div className={styles.communityCardTitle}>{event.title}</div>
                      <div className={styles.communityMeta}>
                        <span>📍 {event.location}</span>
                        {event.time && <span>🕐 {event.time}</span>}
                        <span>👤 {event.organizer_name}</span>
                      </div>
                      <p className={styles.communityDesc}>{event.description}</p>
                      {event.external_link && (
                        <a href={event.external_link} target="_blank" rel="noopener" className={styles.communityLink}>
                          More info →
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2>Show up. Make your voice heard.</h2>
          <p>Public comment periods at Board of Supervisors and Planning Commission meetings are your legal right. Every resident who speaks on the record matters.</p>
          <div className={styles.ctaButtons}>
            <a href="/petition" className="btn-primary">Sign the Petition</a>
            <a href="https://www.fcva.us/services/calendar" target="_blank" rel="noopener" className="btn-outline">Full FCVA Calendar</a>
          </div>
        </div>
      </section>
    </main>
  )
}