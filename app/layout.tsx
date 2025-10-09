import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Essenza',
  description: 'Essenza',
  generator: 'Essenza',
  // Meta tags para controlar caché en desarrollo
  other: {
    'Cache-Control': process.env.NODE_ENV === 'development' 
      ? 'no-cache, no-store, must-revalidate' 
      : 'public, max-age=31536000',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
