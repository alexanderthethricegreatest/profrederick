import './globals.css'
import SiteChrome from '@/components/SiteChrome'
import PageTransition from '@/components/PageTransition'
import ScrollReveal from '@/components/ScrollReveal'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Lora:ital,wght@0,400;0,600;1,400&family=Source+Sans+3:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteChrome>
          <ScrollReveal />
          <PageTransition>
            <main id="main-content">{children}</main>
          </PageTransition>
        </SiteChrome>
      </body>
    </html>
  )
}