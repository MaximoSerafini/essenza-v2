"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Videos de perfumes de @agustinaa_nieto - expandido
const TIKTOK_VIDEOS = [
  { id: "7510350884681862406", title: "Bad Femme: El Perfume de Poder" },
  { id: "7497360247678340407", title: "Guía de Perfumes para Mujeres" },
  { id: "7501353444523953413", title: "Comparativa de Fragancias" },
  { id: "7500290364826324279", title: "Describiendo perfumes con emojis" },
  { id: "7510350884681862406", title: "Top perfumes para citas" },
  { id: "7497360247678340407", title: "Fragancias que enamoran" },
  { id: "7501353444523953413", title: "Perfumes para el verano" },
  { id: "7500290364826324279", title: "Dupes que valen la pena" },
]

export function TikTokSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // Cargar script de TikTok
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://www.tiktok.com/embed.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]')
      if (existingScript) existingScript.remove()
    }
  }, [])

  // Auto-scroll
  useEffect(() => {
    if (isHovered) return

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        const maxScroll = scrollWidth - clientWidth

        if (scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' })
        }
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [isHovered])

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm overflow-hidden">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#5D2A71] to-pink-600 bg-clip-text text-transparent">
              Reseñas en TikTok
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-2">
            Mira las reseñas y comparativas de nuestros perfumes favoritos
          </p>
          <a
            href="https://www.tiktok.com/@agustinaa_nieto"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#5D2A71] hover:text-pink-600 transition-colors duration-300 text-sm font-medium"
          >
            @agustinaa_nieto
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Arrow */}
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-6 w-6 text-[#5D2A71]" />
          </Button>

          {/* Videos Container */}
          <div
            ref={scrollRef}
            onScroll={updateScrollButtons}
            className="flex gap-6 overflow-x-auto scroll-smooth px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TIKTOK_VIDEOS.map((video, idx) => (
              <div key={`${video.id}-${idx}`} className="flex-shrink-0 w-[300px]">
                <blockquote
                  className="tiktok-embed"
                  cite={`https://www.tiktok.com/@agustinaa_nieto/video/${video.id}`}
                  data-video-id={video.id}
                  style={{ maxWidth: '300px', minWidth: '280px' }}
                >
                  <section>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://www.tiktok.com/@agustinaa_nieto/video/${video.id}`}
                      className="text-[#5D2A71] hover:text-pink-600"
                    >
                      Ver en TikTok
                    </a>
                  </section>
                </blockquote>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <Button
            variant="outline"
            size="icon"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-6 w-6 text-[#5D2A71]" />
          </Button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="w-2 h-2 rounded-full bg-[#5D2A71]/30 transition-all duration-300"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TikTokSection
