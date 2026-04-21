import { useState, useEffect, useRef, useCallback } from 'react'

// ── Cloudinary CDN optimizer ─────────────────────────────────────────────────
// Injects optimal transforms: auto format (WebP/AVIF), auto quality,
// progressive rendering, and correct width for the viewport.
function cdnUrl(url, width = 800) {
  if (!url || !url.includes('res.cloudinary.com')) return url
  // Already has transforms — replace them with our optimised set
  return url.replace(
    /\/upload\/([^/]*\/)?/,
    `/upload/w_${width},q_auto,f_auto,fl_progressive,dpr_auto/`
  )
}

const SLIDES = [
  {
    url: 'https://res.cloudinary.com/dzr0crkvr/image/upload/v1776062518/IMG_20260328_195806.jpg_exlqfb.jpg',
    caption: 'Comfortable & Spacious Rooms',
  },
  {
    url: 'https://res.cloudinary.com/dzr0crkvr/image/upload/v1776062505/WhatsApp_Image_2026-03-27_at_8.37.11_PM_qvrvk4.jpg',
    caption: 'Modern Facilities',
  },
  {
    url: 'https://res.cloudinary.com/dzr0crkvr/image/upload/v1776062505/IMG_20260413_102220113.jpg_bzsaya.jpg',
    caption: 'Safe & Secure Environment',
  },
  {
    url: 'https://res.cloudinary.com/dzr0crkvr/image/upload/v1776062499/IMG_20260413_102118487.jpg_cqtzls.jpg',
    caption: 'Budget-Friendly Options',
  },
]

export default function HeroSection({ onBook }) {
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef(null)
  const touchStartX = useRef(0)

  // Preload all hero images immediately via link tags injected into <head>
  useEffect(() => {
    SLIDES.forEach((slide, i) => {
      const link = document.createElement('link')
      link.rel = i === 0 ? 'preload' : 'prefetch'
      link.as = 'image'
      link.href = cdnUrl(slide.url, 1400)
      link.fetchPriority = i === 0 ? 'high' : 'low'
      document.head.appendChild(link)
    })
  }, [])

  const nextSlide = useCallback(() => {
    setCurrent(c => (c + 1) % SLIDES.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrent(c => (c === 0 ? SLIDES.length - 1 : c - 1))
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
              src={cdnUrl(slide.url, 1400)}
              alt={slide.caption}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'low'}
              decoding={i === 0 ? 'sync' : 'async'}
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

        <p className="text-white mt-3 text-base sm:text-lg flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          Near Gurudwara, Akurdi Railway Station, Pune
        </p>

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
            { icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: 'Prime Location' },
            { icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 9.33-2.5"/></svg>, label: 'Parking Available' },
            { icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, label: 'RO Water' },
            { icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>, label: 'High-Speed WiFi' },
            { icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: '24x7 Security' },
          ].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20"
            >
              {item.icon}
              {item.label}
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
