import type { Metadata, Viewport } from 'next'
import { Providers } from './providers'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1a1a2e',
}

export const metadata: Metadata = {
  title: 'Pixel Quest - Idle RPG',
  description: 'A Telegram Mini App with TON wallet integration',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
