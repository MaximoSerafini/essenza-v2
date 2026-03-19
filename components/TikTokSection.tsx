"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Play, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const TIKTOK_VIDEOS = [
  {
    id: "7613003295333846292",
    shortUrl: "https://vt.tiktok.com/ZSuqQf4Nv/",
    title: "Review de fragancia",
    description: "Descubrí la nueva reseña de nuestra fragancia estrella",
    gradient: "from-pink-500 via-purple-600 to-indigo-700",
  },
  {
    id: "7608962580731776277",
    shortUrl: "https://vt.tiktok.com/ZSuqQSCDJ/",
    title: "Recomendación de perfume",
    description: "Las mejores recomendaciones para cada ocasión",
    gradient: "from-rose-500 via-fuchsia-600 to-purple-700",
  },
  {
    id: "7569257598357130517",
    shortUrl: "https://vt.tiktok.com/ZSuqQjbSv/",
    title: "Perfume destacado",
    description: "El perfume más vendido del mes",
    gradient: "from-violet-500 via-purple-600 to-fuchsia-700",
  },
  {
    id: "7573029659730791701",
    shortUrl: "https://vt.tiktok.com/ZSuqQrHQJ/",
    title: "Top de aromas",
    description: "Ranking de las fragancias más elegidas",
    gradient: "from-purple-500 via-pink-600 to-rose-700",
  },
  {
    id: "7560793355458792716",
    shortUrl: "https://vt.tiktok.com/ZSuqQKdFb/",
    title: "Favorito del momento",
    description: "La fragancia que todos están pidiendo",
    gradient: "from-fuchsia-500 via-purple-600 to-violet-700",
  },
]

function TikTokCard({ video, index }: { video: typeof TIKTOK_VIDEOS[0]; index: number }) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <a
      href={video.shortUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-[280px] group cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={`relative h-[420px] rounded-2xl overflow-hidden bg-gradient-to-br ${video.gradient} shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/25 group-hover:scale-[1.02]`}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-6 right-6 w-24 h-24 rounded-full bg-white/20 blur-xl" />
          <div className="absolute bottom-20 left-4 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white/5 blur-3xl" />
        </div>

        {/* TikTok logo watermark */}
        <div className="absolute top-5 right-5 opacity-30 group-hover:opacity-50 transition-opacity">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        </div>

        {/* Number badge */}
        <div className="absolute top-5 left-5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <span className="text-white font-bold text-sm">#{index + 1}</span>
          </div>
        </div>

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/40 transition-all duration-500 ${isHovering ? "scale-110 bg-white/30" : "scale-100"
              }`}
          >
            <Play
              className={`w-9 h-9 text-white ml-1 transition-transform duration-500 ${isHovering ? "scale-110" : ""
                }`}
              fill="white"
            />
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
          <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg">
            {video.title}
          </h3>
          <p className="text-white/80 text-sm leading-snug mb-3 drop-shadow">
            {video.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#25F4EE] via-[#FE2C55] to-[#FE2C55] p-[2px]">
                <div className="w-full h-full rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                  <span className="text-[9px] text-white font-bold">AG</span>
                </div>
              </div>
              <span className="text-white/90 text-xs font-medium">@agustinaa_nieto</span>
            </div>
            <div
              className={`flex items-center gap-1 text-white/80 text-xs transition-all duration-300 ${isHovering ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                }`}
            >
              <span>Ver</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Shimmer effect on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-opacity duration-700 ${isHovering ? "opacity-100 animate-shimmer" : "opacity-0"
            }`}
          style={{
            backgroundSize: "200% 100%",
            animation: isHovering ? "shimmer 1.5s ease-in-out infinite" : "none",
          }}
        />
      </div>
    </a>
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
          scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
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
      const cardWidth = 300
      setActiveIndex(Math.round(scrollLeft / cardWidth))
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm overflow-hidden">
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

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
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg transition-opacity duration-300 ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
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
              <TikTokCard key={video.id} video={video} index={idx} />
            ))}
          </div>

          {/* Right Arrow */}
          <Button
            variant="outline"
            size="icon"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg transition-opacity duration-300 ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6 text-[#5D2A71]" />
          </Button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {TIKTOK_VIDEOS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                scrollRef.current?.scrollTo({ left: idx * 300, behavior: "smooth" })
              }}
              className={`rounded-full transition-all duration-300 ${idx === activeIndex
                  ? "w-6 h-2.5 bg-[#5D2A71]"
                  : "w-2.5 h-2.5 bg-[#5D2A71]/25 hover:bg-[#5D2A71]/40"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TikTokSection
