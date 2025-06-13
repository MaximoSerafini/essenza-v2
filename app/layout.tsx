import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Essenza',
  description: 'Essenza',
  generator: 'Essenza',
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
