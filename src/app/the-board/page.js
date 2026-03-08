'use client'

import { useState } from 'react'
import styles from '@/styles/the-board.module.css'

const AIKENS_STOCKS = [
  { ticker: 'AMZN',  name: 'Amazon (AWS)',                     range: '$50,001–$250,000', relevance: 'Largest cloud and data center platform on the planet' },
  { ticker: 'MSFT',  name: 'Microsoft',                        range: '$50,001–$250,000', relevance: 'One of the largest data center operators in the world' },
  { ticker: 'GOOGL', name: 'Alphabet (Google)',                range: '$50,001–$250,000', relevance: 'Massive global data center operator' },
  { ticker: 'NVDA',  name: 'Nvidia',                           range: '$50,001–$250,000', relevance: 'The chips that power every major AI data center' },
  { ticker: 'AMT',   name: 'American Tower Corp',              range: '$5,001–$50,000',   relevance: 'Data center and telecom infrastructure REIT' },
  { ticker: 'BX',    name: 'Blackstone Group',                 range: '$5,001–$50,000',   relevance: "World's largest alternative asset manager and data center investor" },
  { ticker: 'CSCO',  name: 'Cisco Systems',                    range: '$5,001–$50,000',   relevance: 'Networking infrastructure that data centers run on' },
  { ticker: 'DELL',  name: 'Dell Technologies',                range: '$5,001–$50,000',   relevance: 'Enterprise hardware that fills data centers' },
  { ticker: 'CRWD',  name: 'CrowdStrike',                      range: '$5,001–$50,000',   relevance: 'Cloud-native cybersecurity, data center dependent' },
  { ticker: 'PLTR',  name: 'Palantir Technologies',            range: '$5,001–$50,000',   relevance: 'Government data infrastructure' },
  { ticker: 'CIBR',  name: 'First Trust NASDAQ Cybersecurity', range: '$5,001–$50,000',   relevance: 'ETF tracking the entire cybersecurity and cloud sector' },
  { ticker: 'CRM',   name: 'Salesforce',                       range: '$5,001–$50,000',   relevance: 'Cloud computing infrastructure' },
  { ticker: 'INTU',  name: 'Intuit',                           range: '$5,001–$50,000',   relevance: 'Cloud services' },
  { ticker: 'TT',    name: 'Trane Technologies',               range: '$5,001–$50,000',   relevance: 'HVAC systems that keep data centers cool' },
]

export default function TheBoardPage() {
  const [stocksExpanded, setStocksExpanded] = useState(false)

  return (
    <main className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.inner}>
          <div className={styles.eyebrow}>Public Records Investigation</div>
          <h1 className={styles.heroTitle}>
            Who Sits on the Frederick County Board of Supervisors,
            and Who Do They Really Represent?
          </h1>
          <div className={styles.heroBody}>
            <p>Every year, Virginia law requires elected officials to file a Statement of Economic Interests, a public document that discloses their employers, business holdings, investments, and financial relationships. The purpose is simple: the public has a right to know whether the people making decisions on their behalf have a personal financial stake in the outcome of those decisions.</p>
            <p>We obtained these filings for the Frederick County Board of Supervisors and read them carefully. What we found raises serious questions.</p>
            <p>Three supervisors who have supported or failed to oppose industrial data center development in Frederick County have significant financial ties to the data center industry, either through their employers, their investment portfolios, or both.</p>
          </div>
          <div className={styles.disclaimer}>
            <strong>We are not alleging corruption. We are not claiming anyone broke the law.</strong> We are doing what citizens in a democracy are supposed to do: reading the public record, asking hard questions, and demanding that our elected officials answer them. The filings are public. The conflicts are real. The questions are simple. Read the profiles below and decide for yourself.
          </div>
          <div className={styles.sourceNote}>
            <strong>A note on sources:</strong> All information on this page comes directly from Statements of Economic Interests filed with the Frederick County Administrator's Office, which serves as clerk to the Board of Supervisors. These are public records available to any citizen upon request. We encourage you to request and read them yourself.
          </div>
        </div>
      </section>

      {/* JUMP NAV */}
      <nav className={styles.jumpNav}>
        <div className={styles.inner}>
          <span className={styles.jumpLabel}>Jump to</span>
          <a href="#jewell" className={styles.jumpLink}>John Jewell</a>
          <a href="#aikens" className={styles.jumpLink}>Jason Aikens</a>
          <a href="#guevremont" className={styles.jumpLink}>Mike Guevremont</a>
          <a href="#action" className={styles.jumpLink}>What You Can Do</a>
        </div>
      </nav>

      {/* JEWELL */}
      <section id="jewell" className={styles.profile}>
        <div className={styles.inner}>
          <div className={styles.profileMeta}>
            <span className={styles.profileNum}>01</span>
            <span className={styles.profileTag}>Chairman at Large</span>
          </div>
          <h2 className={styles.profileName}>John Jewell</h2>

          <h3 className={styles.profileQ}>What does he do?</h3>
          <p className={styles.body}>John Jewell works in sales for FCN Inc., a federal IT infrastructure company based in Rockville, Maryland. FCN specializes in networking, storage solutions, cloud computing, and cybersecurity, the exact technology stack that data centers are built on. FCN holds active contracts with the Department of Defense, DHS, NASA, and other federal agencies.</p>
          <p className={styles.body}>Jewell also operates JSEB Consulting LLC, a private consulting company registered to his home address in Frederick County with no public web presence. The company's clients and contracts are not publicly known.</p>

          <h3 className={styles.profileQ}>Why does it matter?</h3>
          <p className={styles.body}>John Jewell earns his living selling the technology that data centers run on. Every new data center built anywhere expands demand for exactly the products and services FCN sells. His personal income is structurally tied to the growth of the data center industry.</p>
          <p className={styles.body}>He sits on the board that decides whether that industry comes to Frederick County.</p>

          <div className={styles.disclosureBox}>
            <div className={styles.disclosureLabel}>⚠ Disclosure Issue</div>
            <p>Additionally, questions 1 and 2 on Schedule H of his financial disclosure, which ask whether he or his associates have represented businesses before state governmental agencies, were left completely blank. Not checked yes. Not checked no. Just blank. Virginia law requires a response either way.</p>
          </div>

          <div className={styles.questionBox}>
            <div className={styles.questionLabel}>The community deserves to know</div>
            <p>What does JSEB Consulting do, and who are its clients?</p>
          </div>
        </div>
      </section>

      {/* AIKENS */}
      <section id="aikens" className={`${styles.profile} ${styles.profileAlt}`}>
        <div className={styles.inner}>
          <div className={styles.profileMeta}>
            <span className={styles.profileNum}>02</span>
            <span className={styles.profileTag}>Gainesboro District Supervisor</span>
          </div>
          <h2 className={styles.profileName}>Jason Aikens</h2>

          <h3 className={styles.profileQ}>What does he own?</h3>
          <p className={styles.body}>Jason Aikens is one of the largest private landlords in the Winchester-Frederick County region. His financial disclosure reveals over 20 LLCs and limited partnerships generating more than $250,000 each in gross annual income, dozens of commercial and residential rental properties across Frederick County, and an active construction company, H&W Construction.</p>
          <p className={styles.body}>His stock portfolio includes:</p>

          <div className={styles.stockStats}>
            <div className={styles.stockStat}>
              <div className={styles.stockStatNum}>$250,000+</div>
              <div className={styles.stockStatLabel}>Conservative estimate of data center-linked holdings</div>
            </div>
            <div className={styles.stockStat}>
              <div className={styles.stockStatNum}>$1,500,000+</div>
              <div className={styles.stockStatLabel}>High-end estimate of data center-linked holdings</div>
            </div>
            <div className={styles.stockStat}>
              <div className={styles.stockStatNum}>14</div>
              <div className={styles.stockStatLabel}>Individual holdings tied to the data center industry</div>
            </div>
          </div>

          <div className={styles.stockTable}>
            <div className={styles.stockHead}>
              <span>Company</span>
              <span>Disclosed Range</span>
              <span>Why It Matters</span>
            </div>
            {(stocksExpanded ? AIKENS_STOCKS : AIKENS_STOCKS.slice(0, 6)).map((s, i) => (
              <div key={i} className={styles.stockRow}>
                <span className={styles.stockName}>
                  <em className={styles.stockTicker}>{s.ticker}</em>
                  {s.name}
                </span>
                <span className={styles.stockRange}>{s.range}</span>
                <span className={styles.stockRelevance}>{s.relevance}</span>
              </div>
            ))}
          </div>
          {!stocksExpanded && (
            <button className={styles.expandBtn} onClick={() => setStocksExpanded(true)}>
              Show all {AIKENS_STOCKS.length} holdings ↓
            </button>
          )}

          <h3 className={styles.profileQ}>Why does it matter?</h3>
          <p className={styles.body}>When data centers come to Frederick County, Jason Aikens profits from multiple directions at once. His construction company stands to benefit from new development contracts. His commercial properties increase in value as infrastructure expands. His stock portfolio grows as the companies that build, power, and fill data centers see increased demand.</p>
          <p className={styles.body}>Even if he recused himself from every single vote, the deeper issue is structural.</p>

          <blockquote className={styles.pullQuote}>
            A man with a construction company, dozens of commercial properties, and a quarter million dollars in the exact companies that profit from data center expansion should not be sitting on a land use governing body at all.
          </blockquote>

          <p className={styles.body}>The conflict isn't a one-time vote. It's baked into every decision he makes, every conversation he has, and every relationship he cultivates in that role.</p>
          <p className={styles.body}>It goes further than that. Think about what data centers do to the local economy:</p>

          <ul className={styles.impactList}>
            <li><strong>They drive up land values</strong> — Aikens owns massive amounts of local real estate</li>
            <li><strong>They bring construction contracts</strong> — Aikens owns a construction company</li>
            <li><strong>They expand the tech infrastructure footprint</strong> — Aikens holds American Tower and Nvidia</li>
            <li><strong>They attract ancillary commercial development</strong> — Aikens owns commercial rental properties</li>
          </ul>

          <p className={styles.body}>Every single piece of his financial life gets better when data centers come to Frederick County.</p>

          <div className={styles.questionBox}>
            <div className={styles.questionLabel}>The question</div>
            <p>This is not a question of whether he followed the rules. It is a question of whether the rules are enough. A man whose personal wealth is structurally aligned with data center expansion sits on the body that decides whether data centers get built here. The community was never asked if that was okay. We are asking now.</p>
          </div>
        </div>
      </section>

      {/* GUEVREMONT */}
      <section id="guevremont" className={styles.profile}>
        <div className={styles.inner}>
          <div className={styles.profileMeta}>
            <span className={styles.profileNum}>03</span>
            <span className={styles.profileTag}>Red Bud District Supervisor</span>
          </div>
          <h2 className={styles.profileName}>Mike Guevremont</h2>

          <h3 className={styles.profileQ}>What does he do?</h3>
          <p className={styles.body}>Mike Guevremont works as a consultant for Flatter Inc., a federal government contractor based in Fredericksburg, Virginia. Flatter provides program management, IT support, cybersecurity, and enterprise architecture services to federal agencies including DHS, ICE, TSA, CBP, FEMA, the US Army, US Air Force, and US Marine Corps.</p>

          <h3 className={styles.profileQ}>Why does it matter?</h3>
          <p className={styles.body}>Like Supervisor Jewell, Guevremont earns his living inside the federal defense and IT contractor ecosystem, the same ecosystem that drives demand for data center infrastructure. Both men sit on a board making land use decisions that directly affect an industry their employers serve.</p>
          <p className={styles.body}>Frederick County residents are largely working families, farmers, and small business owners. They did not elect federal defense contractors to represent them. They elected neighbors.</p>

          <div className={styles.questionBox}>
            <div className={styles.questionLabel}>The question is simple</div>
            <p>When Supervisor Guevremont votes on data center development, whose interests is he serving — Frederick County's or his employer's?</p>
          </div>
        </div>
      </section>

      {/* WHAT YOU CAN DO */}
      <section id="action" className={styles.actionSection}>
        <div className={styles.inner}>
          <div className={styles.eyebrow} style={{color:'var(--gold)'}}>What You Can Do</div>
          <h2 className={styles.actionTitle}>This is your county. These are your elected officials. This is your fight.</h2>
          <p className={styles.actionIntro}>The data center industry has spent millions lobbying Virginia legislators and cultivating relationships with local officials across the state. They have lawyers, lobbyists, and consultants. What they do not have is the community. That is where you come in.</p>

          <div className={styles.actionGrid}>
            <div className={styles.actionCard}>
              <div className={styles.actionNum}>01</div>
              <h3>Sign the petition</h3>
              <p>Over 440 Frederick County residents have already signed our petition demanding a moratorium on industrial data center development. Add your name and share it with your neighbors.</p>
              <a href="/petition" className={styles.actionLink}>Sign the petition →</a>
            </div>
            <div className={styles.actionCard}>
              <div className={styles.actionNum}>02</div>
              <h3>Show up</h3>
              <p>The Board of Supervisors meets the second and fourth Wednesday of every month at 107 North Kent Street, Winchester. Your presence matters. Your voice matters. They need to see that this community is watching.</p>
              <a href="/events" className={styles.actionLink}>See meeting schedule →</a>
            </div>
            <div className={styles.actionCard}>
              <div className={styles.actionNum}>03</div>
              <h3>Spread the word</h3>
              <p>Share this page with everyone you know in Frederick County. Post it on Facebook. Print it out and leave it at your local diner, barbershop, or church. The more people who see it, the harder it becomes to ignore.</p>
            </div>
            <div className={styles.actionCard}>
              <div className={styles.actionNum}>04</div>
              <h3>Contact your supervisor directly</h3>
              <p>Call or email your district supervisor and ask them directly: do you have a conflict of interest on data center votes? Their contact information is public.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className={styles.closing}>
        <div className={styles.inner}>
          <p>Frederick County's rural character, clean water, open land, and quality of life are worth fighting for. We did not choose this fight, but we will not walk away from it.</p>
          <div className={styles.closingSig}>— Protect Frederick</div>
          <div className={styles.closingButtons}>
            <a href="/petition" className="btn-primary">Sign the Petition</a>
            <a href="/events" className="btn-outline">See Upcoming Meetings</a>
          </div>
        </div>
      </section>

    </main>
  )
}