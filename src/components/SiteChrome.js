'use client'

import { usePathname } from 'next/navigation'
import Nav from '@/components/nav'
import Footer from '@/components/footer'

export default function SiteChrome({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin') ?? false

  return (
    <>
      {!isAdmin && <Nav />}
      {children}
      {!isAdmin && <Footer />}
    </>
  )
}