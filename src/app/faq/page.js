'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from '@/styles/faq.module.css'

const faqs = [
  {
    q: "Won't data centers bring tax revenue to the county?",
    a: <>
      <p>Yes, and that's exactly what makes this conversation difficult. The county has used $15 million from its capital fund to balance the budget over the last three years, and the Economic Development Authority has targeted data centers specifically because of the revenue they can generate. We understand the appeal.</p>
      <p>But the math is more complicated than it looks. JLARC, Virginia's own legislative research body, projects that data centers could add $444 per year to the average residential electric bill by 2040. Infrastructure costs for roads, water, sewer, and grid upgrades fall on the county and its ratepayers, not the developer. Frederick County's wastewater system is already under DEQ warnings for noncompliance. And if the AI investment bubble bursts, the county could be left with billions in stranded infrastructure debt built for demand that never materialized. Warren County looked at the same tradeoff and voted 5-0 against. So did Pittsylvania County, 6-1. <b>Revenue is real. So are the costs.</b></p>
    </>
  },
  {
    q: "Won't they create jobs?",
    a: <>
      <p>Very few, relative to their footprint. Data centers are among the most automated industrial facilities built today. <b>A hyperscale campus covering hundreds of acres typically employs between 30 and 50 full-time workers once operational,</b> mostly security, facilities, and remote IT staff. For comparison, a single mid-sized manufacturer or agricultural operation creates more local employment per acre.</p>
      <p>The construction phase creates temporary jobs, but those workers don't stay. Frederick County deserves economic development that actually employs its residents long-term.</p>
    </>
  },
  {
    q: "Can't we just regulate them properly?",
    a: <>
      <p>That's what HB 1601 was supposed to do. The bipartisan bill would have required water, farmland, noise, and geological impact assessments before any data center could be approved in Virginia. <b>Governor Youngkin vetoed it in May 2025,</b> calling it "unnecessary red tape." Virginia currently has no statewide data center regulations. Frederick County has no modern noise ordinance that covers rooftop cooling systems.</p>
      <p>And as one Virginia community activist put it after watching facilities go up next to her neighborhood: "Once they're built, there's nothing you can do. If they violate the decibels, what are you going to do? Fine them $1,000? That'd be like asking you for a penny." Regulation only works if the laws exist and are enforced. Right now, neither is true.</p>
    </>
  },
  {
    q: "Isn't this inevitable anyway?",
    a: <>
      <p>No. Communities across Virginia have proven that. Warren County voted 5-0 to block data centers in January 2023. Pittsylvania County defeated an 84-data-center MegaCampus proposal 6-1. Between March and June 2025 alone, local opposition blocked or delayed 20 data center projects nationally valued at an estimated $98 billion.</p>
      <p><b>Frederick County's own Board of Supervisors rejected two proposals 5-1 in June 2025</b> after residents packed the meeting room. Nothing about this is inevitable. The question is whether enough people show up and make their voices heard before a decision gets made for them.</p>
    </>
  },
  {
    q: "What's wrong with the one we already have near Middletown?",
    a: <>
      <p>Nothing, particularly. It's a single older facility that's been there for years without significant community impact. That's not what's being proposed.</p>
      <p>The two applications rejected in June were for a <b>644-acre campus south of Stephens City</b> and a <b>105-acre site south of Winchester,</b> fundamentally different in scale, water consumption, noise footprint, and grid demand. One data center is a facility. A campus is the beginning of Loudoun County. That's not a hypothetical. It's exactly how Northern Virginia's "Data Center Alley" started.</p>
    </>
  },
  {
    q: "Who was behind the two proposals the Board rejected in June?",
    a: <>
      <p>Meadow Brook Technology Park, the 644-acre campus proposed south of Stephens City, was brought by <b>Tract Capital, a Denver-based development firm.</b> Winchester Gateway 2, the 105-acre site at Va. 37 and Middle Road south of Winchester, was proposed by Winchester Gateway 2 LLC. Neither company is local. The land targeted was zoned Rural Areas.</p>
      <p>Tract Capital held an open house at Laurel Ridge Community College before the vote but was unable to provide basic information about projected water and electricity usage when asked directly by Planning Commissioners. That contributed to the Board's decision to reject both applications.</p>
    </>
  },
  {
    q: "Which electric cooperative serves my home, REC or SVEC?",
    a: <>
      <p>Frederick County is served by two member-owned electric cooperatives: <b>Rappahannock Electric Cooperative (REC)</b> and <b>Shenandoah Valley Electric Cooperative (SVEC),</b> Virginia's first chartered electric cooperative, founded in 1936. Which one serves your home depends on where you live in the county. Check your electric bill or contact your co-op directly.</p>
      <p>Either way the stakes are the same. Both are member-owned, meaning you are a part owner and any infrastructure costs from data center expansion hit your bill directly. REC alone projects 17 gigawatts of data center demand by 2040, 18 times its current peak load.</p>
    </>
  },
  {
    q: "What can I actually do to make a difference?",
    a: <>
      <p>More than you might think. <b>Attend the public forums</b> on February 24 at Sherando High School or February 26 at James Wood High School, both 7-9 PM. Your presence is recorded in the official public record. Sign this petition so the Board sees organized, countywide opposition with your name and district attached.</p>
      <p>Contact your Board of Supervisor directly. A personal email or phone call from a constituent carries more weight than most people realize. And share this site with your neighbors. Most people in Frederick County haven't heard about these forums yet. That's what we're trying to change.</p>
    </>
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const fadeRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          observer.unobserve(e.target)
        }
      })
    }, { threshold: 0.08 })
    fadeRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const fadeRef = (el) => {
    if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el)
  }

  function toggle(i) {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderVol}>Common Questions · Straight Answers</div>
        <h1>Frequently Asked<br /><em>Questions</em></h1>
        <p className={styles.pageHeaderDeck}>
          These are the questions we hear most often. If you have one we haven't answered, reach out through the contact page.
        </p>
      </div>

      <main className={styles.faqMain}>
        <div className={styles.faqList}>
          {faqs.map((faq, i) => (
            <div key={i} className={`${styles.faqItem} fade-up`} ref={fadeRef}>
              <button
                className={`${styles.faqQ} ${openIndex === i ? styles.faqQOpen : ''}`}
                onClick={() => toggle(i)}
              >
                {faq.q}
                <span className={styles.faqIcon}>+</span>
              </button>
              <div className={`${styles.faqA} ${openIndex === i ? styles.faqAOpen : ''}`}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>

        <div className={`${styles.faqCta} fade-up`} ref={fadeRef}>
          <div className={styles.faqCtaText}>
            <strong>Ready to take action?</strong> Sign the petition and make your voice part of the official record. The February 24 forum is done and now we wait for the rescheduled James Wood session. Every signature counts going into that room
          </div>
          <Link href="/petition" className={styles.faqCtaBtn}>Sign the Petition →</Link>
        </div>
      </main>
    </>
  )
}