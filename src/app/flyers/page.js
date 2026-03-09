'use client'

import styles from '@/styles/flyers.module.css'

const FLYERS = [
  {
    id: 1,
    title: 'What Are Data Centers?',
    description: 'A plain-language explainer on what data centers are, what they require, and why their placement in Frederick County matters.',
    category: 'Explainer',
    pages: '1 page',
    file: '/flyers/what-are-data-centers.pdf', // replace with '/flyers/what-are-data-centers.pdf'
    preview: null,
  },
  {
    id: 2,
    title: 'Water & the Karst Problem',
    description: "Frederick County sits on karst limestone. This flyer explains why that makes data center wastewater a unique threat to our drinking water.",
    category: 'Issue Brief',
    pages: '1 page',
    file: null,
    preview: null,
  },
  {
    id: 3,
    title: 'Who Votes on This?',
    description: 'A quick reference guide to the Board of Supervisors: who they are, which district they represent, and when they vote.',
    category: 'Civic Guide',
    pages: '1 page',
    file: null,
    preview: null,
  },
  {
    id: 4,
    title: 'How to Speak at a Public Hearing',
    description: 'Step-by-step instructions for signing up for public comment, what to say, and how to make your 3 minutes count.',
    category: 'Action Guide',
    pages: '2 pages',
    file: null,
    preview: null,
  },
  {
    id: 5,
    title: 'Power Grid Strain: The Hidden Cost',
    description: 'Data centers draw enormous amounts of electricity. This flyer breaks down what that means for REC ratepayers in our region.',
    category: 'Issue Brief',
    pages: '1 page',
    file: null,
    preview: null,
  },
  {
    id: 6,
    title: 'Door Hanger: Sign the Petition',
    description: 'Print-ready door hanger for canvassing. Directs neighbors to protectfrederick.org to sign the petition.',
    category: 'Canvassing',
    pages: '1 page',
    file: null,
    preview: null,
  },
]

const CATEGORY_COLORS = {
  'Explainer':    { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  'Issue Brief':  { bg: '#fef9c3', color: '#854d0e', border: '#fde68a' },
  'Civic Guide':  { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
  'Action Guide': { bg: '#fdf4ff', color: '#6b21a8', border: '#e9d5ff' },
  'Canvassing':   { bg: '#fff7ed', color: '#9a3412', border: '#fed7aa' },
}

export default function FlyersPage() {
  return (
    <main className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLabel}>Free to Download & Share</div>
          <h1 className={styles.heroTitle}>Flyers & <em>Print Materials</em></h1>
          <p className={styles.heroDeck}>
            Download, print, and share. Use these at doors, community meetings,
            coffee shops, and anywhere Frederick County residents gather.
            All materials are free to reproduce. There is no permission needed.
          </p>
          <div className={styles.heroNote}>
            <span className={styles.heroNoteDot} />
            Have a flyer idea? Email <a href="mailto:info@protectfrederick.org">info@protectfrederick.org</a>
          </div>
        </div>
      </section>

      {/* Instructions */}
      <div className={styles.instructions}>
        <div className={styles.instructionsInner}>
          {[
            { step: '1. Download', desc: 'Click any flyer to download the PDF.' },
            { step: '2. Print',    desc: 'Standard letter size (8.5×11). Black & white works fine.' },
            { step: '3. Share',    desc: 'Post it, hand it out, or send the PDF link directly.' },
          ].map(({ icon, step, desc }) => (
            <div key={step} className={styles.instructionStep}>
              <div className={styles.instructionIcon}>{icon}</div>
              <div className={styles.instructionStep_label}>{step}</div>
              <div className={styles.instructionDesc}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Flyer grid */}
      <section className={styles.grid}>
        <div className={styles.gridInner}>
          {FLYERS.map((flyer, i) => {
            const catStyle = CATEGORY_COLORS[flyer.category] ?? CATEGORY_COLORS['Explainer']
            const delay = i < 4 ? `delay-${i + 1}` : ''
            return (
              <div key={flyer.id} className={`${styles.flyerCard} fade-up ${delay}`}>

                {/* Preview area */}
                <div className={styles.flyerPreview}>
                  {flyer.preview
                    ? <img src={flyer.preview} alt={flyer.title} className={styles.previewImg} />
                    : (
                      <div className={styles.previewPlaceholder}>
                        <div className={styles.placeholderLines}>
                          <div className={styles.placeholderTitle} />
                          <div className={styles.placeholderLine} />
                          <div className={styles.placeholderLine} style={{width:'80%'}} />
                          <div className={styles.placeholderLine} style={{width:'90%'}} />
                          <div className={styles.placeholderLine} style={{width:'70%'}} />
                          <div className={styles.placeholderLine} style={{width:'85%'}} />
                        </div>
                        <div className={styles.placeholderBadge}>PDF</div>
                      </div>
                    )
                  }
                </div>

                {/* Info */}
                <div className={styles.flyerInfo}>
                  <div className={styles.flyerMeta}>
                    <span className={styles.flyerCategory} style={{
                      background: catStyle.bg, color: catStyle.color,
                      border: `1px solid ${catStyle.border}`
                    }}>
                      {flyer.category}
                    </span>
                    <span className={styles.flyerPages}>{flyer.pages}</span>
                  </div>
                  <div className={styles.flyerTitle}>{flyer.title}</div>
                  <p className={styles.flyerDesc}>{flyer.description}</p>

                  {flyer.file
                    ? (
                      <a href={flyer.file} download className={styles.downloadBtn}>
                        Download PDF
                      </a>
                    ) : (
                      <div className={styles.comingSoon}>Coming soon</div>
                    )
                  }
                </div>

              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2>Ready to take it to the doors?</h2>
          <p>Our volunteer canvassers are the most effective tool we have. Print a flyer and join a canvassing session near you.</p>
          <div className={styles.ctaButtons}>
            <a href="/volunteer" className="btn-primary">Sign Up to Volunteer</a>
            <a href="/events" className="btn-outline">See Upcoming Events</a>
          </div>
        </div>
      </section>

    </main>
  )
}