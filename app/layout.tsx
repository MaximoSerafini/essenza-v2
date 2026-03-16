import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Essenza Perfumes | Perfumería de Lujo en Corrientes',
  description: 'Descubrí perfumes selectos en Corrientes. Fragancias exclusivas, Lattafa, Maison Alhambra y más. Atención personalizada y envíos coordinados por WhatsApp.',
  keywords: 'perfumes corrientes, perfumería corrientes, esencias corrientes, perfumes importados corrientes, lattafa corrientes, maison alhambra corrientes',
  generator: 'Essenza',
  openGraph: {
    title: 'Essenza Perfumes | Perfumería de Lujo en Corrientes',
    description: 'Descubrí fragancias exclusivas que definen tu historia. Atención personalizada en Corrientes, Argentina.',
    url: 'https://essenza-corrientes.com.ar', // Cambiar por el dominio real si existe
    siteName: 'Essenza Perfumes',
    images: [
      {
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura_de_pantalla_2025-06-10_210739-removebg-preview-u5U4MnjC9NBIef2Jym8Y8xXxKFGuoa.png',
        width: 1200,
        height: 630,
        alt: 'Essenza Perfumes Logo',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Essenza Perfumes | Perfumería de Lujo en Corrientes',
    description: 'Fragancias exclusivas en Corrientes, Argentina.',
    images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura_de_pantalla_2025-06-10_210739-removebg-preview-u5U4MnjC9NBIef2Jym8Y8xXxKFGuoa.png'],
  },
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
