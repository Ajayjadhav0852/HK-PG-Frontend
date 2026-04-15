import { useState, useEffect, useRef, useCallback } from 'react'
import { roomApi } from '../services/api'

const SLIDES = [
  {
    url: 'https://res.cloudinary.com/dzr0crkvr/image/upload/w_1200,q_auto,f_auto/v1776062518/IMG_20260328_195806.jpg_exlqfb.jpg',
    caption: 'Comfortable & Spacious Rooms',
  },
  {
    url: 'https://res.cloudinary.com/dzr0crkvr/image/upload/w_1200,q_auto,f_auto/v1776062505/WhatsApp_Image_2026-03-27_at_8.37.11_PM_qvrvk4.jpg',
    caption: 'Modern Facilities',
  },
  {
    url: 'https://res.cloudinary.com/dzr0crkvr/image/upload/w_1200,q_auto,f_auto/v1776062505/IMG_20260413_102220113.jpg_bzsaya.jpg',
    caption: 'Safe & Secure Environment',
  },
  {
    url: 'https://res.cloudinary.com/dzr0crkvr/image/upload/w_1200,q_auto,f_auto/v1776062499/IMG_20260413_102118487.jpg_cqtzls.jpg',
    caption: 'Budget-Friendly Options',
  },
]

export default function HeroSection({ onBook }) {
  const [current, setCurrent] = useState(0)
  const [totalVacantBeds, setTotalVacantBeds] = useState(0)
  const intervalRef = useRef(null)

  const nextSlide = useCallback(() => {
    setCurrent(c => (c + 1) % SLIDES.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrent(c => (c === 0 ? SLIDES.length - 1 : c - 1))
  }, [])

  // Fetch total vacant beds count
  useEffect(() => {
    const fetchVacantBeds = async () => {
      try {
        const res = await roomApi.getAll()
        const total = (res.data || []).reduce((sum, room) => sum + (room.vacantBeds || 0), 0)
        setTotalVacantBeds(total)
      } catch {}
    }
    fetchVacantBeds()
    // Refresh every 30 seconds for live updates
    const interval = setInterval(fetchVacantBeds, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const start = () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(nextSlide, 3500)
      }
    }

    const stop = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    const handleVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    start()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [nextSlide])

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '90vh', minHeight: '560px' }}>

      {/* Slider */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out will-change-transform"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide, i) => (
          <div key={i} className="min-w-full h-full flex-shrink-0">
            <img
              src={slide.url}
              alt={slide.caption}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'low'}
              decoding="async"
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.50) 40%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.05) 100%)',
        }}
      />

      {/* Content — moved higher and more to the left */}
      <div className="absolute top-1/3 left-0 right-0 px-6 sm:px-12 lg:px-20">

        <h1 className="font-extrabold text-white leading-tight" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
          HK PG Boys
        </h1>

        <h1
          className="font-extrabold leading-tight"
          style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            color: '#f472b6',
          }}
        >
          Accommodation
        </h1>

        <p className="text-white mt-3 text-base sm:text-lg">
          📍 Near Gurudwara, Akurdi Railway Station, Pune
        </p>

        {/* Green capsule with vacant bed count — only show if beds > 0 */}
        {totalVacantBeds > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/90 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-white font-bold text-sm">
              {totalVacantBeds} Beds Available
            </span>
          </div>
        )}

        {/* Button */}
        <div className="mt-6 flex gap-3 flex-wrap">
          <button
            onClick={onBook}
            className="px-6 py-3 rounded-xl text-white font-bold hover:opacity-90 transition"
            style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)' }}
          >
            Explore Rooms →
          </button>
        </div>

        {/* Amenities */}
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            '📍 Prime Location',
            '🚗 Parking Available',
            '💧 RO Water',
            '📶 High-Speed WiFi',
            '🔒 24x7 Security',
          ].map((item, i) => (
            <span
              key={i}
              className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20"
            >
              {item}
            </span>
          ))}
        </div>

      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full hover:bg-black/60 transition text-xl font-bold"
      >
        ‹
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full hover:bg-black/60 transition text-xl font-bold"
      >
        ›
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

    </div>
  )
}
