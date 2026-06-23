import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LayoutShell } from '@/components/layout-shell'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Camping El Higuerón | Escalada y Camping en la Montaña',
  description: 'Vive la experiencia de Bendito Sea en Camping El Higuerón. Escalada deportiva, boulder y camping en el corazón del bosque alto andino colombiano.',
  keywords: ['camping', 'escalada', 'boulder', 'colombia', 'montaña', 'naturaleza', 'bendito sea', 'el higuerón'],
  authors: [{ name: 'Camping El Higuerón' }],
  openGraph: {
    title: 'Camping El Higuerón | Escalada y Camping en la Montaña',
    description: 'Vive la experiencia de Bendito Sea en Camping El Higuerón. Escalada deportiva, boulder y camping en el corazón del bosque alto andino.',
    type: 'website',
    locale: 'es_CO',
  },
}

export const viewport: Viewport = {
  themeColor: '#2d5a3d',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <LayoutShell>{children}</LayoutShell>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
