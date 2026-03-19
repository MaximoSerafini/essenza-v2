"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Videos de @agustinaa_nieto
const TIKTOK_VIDEOS = [
  { id: "7613003295333846292", title: "Review de fragancia" },
  { id: "7608962580731776277", title: "Recomendacion de perfume" },
  { id: "7569257598357130517", title: "Perfume destacado" },
  { id: "7573029659730791701", title: "Top de aromas" },
  { id: "7560793355458792716", title: "Favorito del momento" },
]

function TikTokCard({ video }: { video: { id: string; title: string } }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="flex-shrink-0 w-[325px] rounded-2xl overflow-hidden shadow-lg bg-black border border-white/10">
      {!loaded && (
        <div className="flex items-center justify-center w-full h-[575px] bg-gradient-to-b from-[#1a0a2e] to-[#2d0a3e]">
          <div className="flex flex-col items-center gap-3 text-white/60">
            <svg viewBox="0 0 24 24" className="w-12 h-12 animate-pulse" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
            <span className="text-sm">Cargando video...</span>
          </div>
        </div>
      )}
      <iframe
        src={`https://www.tiktok.com/embed/v2/${video.id}?lang=es`}
        className="w-full"
        style={{
          height: "575px",
          border: "none",
          display: loaded ? "block" : "none",
        }}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture;"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        title={video.title}
      />
    </div>
  )
}

export function TikTokSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // Auto-scroll
  useEffect(() => {
    if (isHovered) return

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        const maxScroll = scrollWidth - clientWidth

        if (scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" })
        } else {
          scrollRef.current.scrollBy({ left: 345, behavior: "smooth" })
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isHovered])

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
      const cardWidth = 345
      setActiveIndex(Math.round(scrollLeft / cardWidth))
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -345 : 345
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm overflow-hidden">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-2 bg-white/50 rounded-full border border-purple-100 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#5D2A71]" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
            <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-900 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
              TikTok Reviews
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-4 font-light text-lg">
            Descubrí reseñas exclusivas y comparativas de nuestras{" "}
            <span className="font-bold text-purple-900">mejores fragancias</span>
          </p>
          <a
            href="https://www.tiktok.com/@agustinaa_nieto"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-900/60 hover:text-purple-600 transition-all duration-300 text-sm font-semibold tracking-widest uppercase bg-white/40 px-4 py-2 rounded-xl border border-transparent hover:border-purple-200"
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
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg transition-opacity duration-300 ${
              canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6 text-[#5D2A71]" />
          </Button>

          {/* Videos Container */}
          <div
            ref={scrollRef}
            onScroll={updateScrollButtons}
            className="flex gap-5 overflow-x-auto scroll-smooth px-12"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {TIKTOK_VIDEOS.map((video, idx) => (
              <TikTokCard key={`${video.id}-${idx}`} video={video} />
            ))}
          </div>

          {/* Right Arrow */}
          <Button
            variant="outline"
            size="icon"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg transition-opacity duration-300 ${
              canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6 text-[#5D2A71]" />
          </Button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {TIKTOK_VIDEOS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                scrollRef.current?.scrollTo({ left: idx * 345, behavior: "smooth" })
              }}
              className={`rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "w-6 h-2 bg-[#5D2A71]"
                  : "w-2 h-2 bg-[#5D2A71]/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TikTokSection
