import { usePathname } from 'next/navigation'

export default function Footer() {
   const pathname = usePathname()
     if (pathname?.startsWith('/admin')) return null
  return ( 
    <footer>
      <div>
        <div className="footer-name">Protect Frederick</div>
        <div className="footer-tag">Know the Facts · March 2026</div>
      </div>
      <div className="footer-sources">
        <strong>Sources:</strong> Virginia SCC Order (Nov. 2025) · Dominion Energy 2024–2025
        Integrated Resource Plan · JLARC Data Centers in Virginia (2025) · American Action
        Forum (Jan. 2026) · Virginia Mercury (Feb. 2026) · Inside Climate News (Jan. 2026) ·
        Piedmont Environmental Council · Clean Virginia · Grist / Loudoun Water FOIA (2024) ·
        Broadband Breakfast (Sept. 2025) · EESI · Frederick Water · Virginia DEQ Drought Task
        Force (Feb. 3, 2026) · Data Center Watch (March 2025) · Frederick County Board of
        Supervisors records
      </div>
    </footer>
  )
}