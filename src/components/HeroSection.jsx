import { useState, useEffect } from 'react'

const SLIDES = [
  {
    url:     'https://res.cloudinary.com/dzr0crkvr/image/upload/v1776062518/IMG_20260328_195806.jpg_exlqfb.jpg',
    caption: 'Comfortable & Spacious Rooms',
  },
  {
    url:     'https://res.cloudinary.com/dzr0crkvr/image/upload/v1776062505/WhatsApp_Image_2026-03-27_at_8.37.11_PM_qvrvk4.jpg',
    caption: 'Modern Facilities',
  },
  {
    url:     'https://res.cloudinary.com/dzr0crkvr/image/upload/v1776062505/WhatsApp_Image_2026-03-27_at_8.37.11_PM_qvrvk4.jpg',
    caption: 'Safe & Secure Environment',
  },
  {
    url:     'https://res.cloudinary.com/dzr0crkvr/image/upload/v1776062505/IMG_20260413_102220113.jpg_bzsaya.jpg',
    caption: 'Budget-Friendly Options',
  },
  {
    url:     'https://res.cloudinary.com/dzr0crkvr/image/upload/v1776062499/IMG_20260413_102118487.jpg_cqtzls.jpg',
    caption: 'Premium Accommodation',
  },
]

const FALLBACKS = [
  'linear-gradient(135deg,#1e1b4b,#312e81)',
  'linear-gradient(135deg,#0f172a,#1e293b)',
  'linear-gradient(135deg,#0c0a09,#1c1917)',
  'linear-gradient(135deg,#0f172a,#0e7490)',
  'linear-gradient(135deg,#1a0533,#3b0764)',
]

// Facilities shown as pills on the hero image
const HERO_PILLS = [
  { icon: '📶', label: 'High-Speed WiFi' },
  { icon: '📍', label: 'Prime Location' },
  { icon: '📹', label: '24/7 CCTV' },
  { icon: '🏍️', label: 'Parking' },
  { icon: '💧', label: 'RO Water' },
   { icon: '🚿', label: 'Hot Water' },

]

// Full facilities list shown below the slider
const ALL_FACILITIES = [
  { icon: '🛏️', label: '1, 2, 3 & 4 Sharing Rooms' },
  { icon: '📶', label: 'High-Speed WiFi' },
  { icon: '💧', label: 'RO Purified Drinking Water' },
  { icon: '🚿', label: 'Hot Water (Geyser)' },
  { icon: '🧹', label: 'Daily Housekeeping' },
  { icon: '👕', label: 'Washing Machine' },
  { icon: '📍', label: 'Near Akurdi Railway Station' },
  { icon: '🏍️', label: 'Two-Wheeler Parking' },
  { icon: '🚌', label: 'Easy Connectivity Across Pune' },
]

export default function HeroSection({ onBook }) {
  const [current, setCurrent] = useState(0)
  const [errors, setErrors]   = useState({})

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 3500)
    return () => clearInterval(t)
  }, [])

  const prev = () => setCurrent(c => (c === 0 ? SLIDES.length - 1 : c - 1))
  const next = () => setCurrent(c => (c + 1) % SLIDES.length)

  return (
    <div>
      {/* ── Slider ─────────────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ height: '90vh', minHeight: '560px' }}>

        {/* Image track */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {SLIDES.map((slide, i) => (
            <div key={i} className="min-w-full h-full flex-shrink-0">
              {errors[i] ? (
                <div className="w-full h-full flex items-center justify-center"
                  style={{ background: FALLBACKS[i % FALLBACKS.length] }}>
                  <div className="text-center text-white px-6">
                    <p className="text-7xl mb-4">🏠</p>
                    <p className="font-extrabold text-3xl">HK PG Boys Accommodation</p>
                    <p className="text-base opacity-80 mt-2">Near Gurudwara, Akurdi, Pune</p>
                  </div>
                </div>
              ) : (
                <img
                  src={slide.url}
                  alt={slide.caption}
                  className="w-full h-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  onError={() => setErrors(e => ({ ...e, [i]: true }))}
                />
              )}
            </div>
          ))}
        </div>

        {/* Overlay — heavy at bottom, light at top */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.50) 40%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.05) 100%)'
          }} />

        {/* ── Hero content — bottom aligned ── */}
        <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-10 lg:px-16 pb-14 sm:pb-16">

          {/* Live badge */}
          <div className="mb-3">
            <span className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md text-white text-xs font-bold px-4 py-1.5 rounded-full border border-white/20 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              Premium Boys PG · Akurdi, Pune
            </span>
          </div>

          {/* ── Main title — FIXED: no gradient clip, solid white + pink ── */}
          <div className="mb-3">
            <h1 className="font-extrabold leading-none text-white drop-shadow-2xl"
              style={{ fontSize: 'clamp(2.6rem, 7.5vw, 5.5rem)', textShadow: '0 3px 24px rgba(0,0,0,0.7)' }}>
              HK PG Boys
            </h1>
            {/* "Accommodation" — solid pink, no webkit clip (fixes the block issue) */}
            <h1 className="font-extrabold leading-none drop-shadow-2xl"
              style={{
                fontSize: 'clamp(2.6rem, 7.5vw, 5.5rem)',
                color: '#f472b6',          /* solid pink — works on ALL browsers */
                textShadow: '0 3px 24px rgba(0,0,0,0.6)',
              }}>
              Accommodation
            </h1>
          </div>

          {/* Location */}
          <p className="text-white font-semibold mb-5 drop-shadow-lg"
            style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.25rem)', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            📍 Near Gurudwara, Akurdi Railway Station,Pune.
          </p>

          {/* Facility pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {HERO_PILLS.map(f => (
              <span key={f.label}
                className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/25">
                {f.icon} {f.label}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <button onClick={onBook}
              className="px-7 py-3.5 rounded-xl font-extrabold text-white text-sm shadow-2xl hover:opacity-90 active:scale-95 transition"
              style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)' }}>
              🏠 Explore Rooms →
            </button>
            <a href="tel:9579828996"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white text-sm bg-black/30 backdrop-blur-sm border border-white/30 hover:bg-black/50 transition">
              📞 Call Now
            </a>
            <a href="https://wa.me/919579828996" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white text-sm bg-green-600/80 backdrop-blur-sm border border-green-400/40 hover:bg-green-600 transition">
              💬 WhatsApp
            </a>
          </div>
        </div>

        {/* Prev / Next */}
        <button onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-lg transition z-10 border border-white/20">
          ‹
        </button>
        <button onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-lg transition z-10 border border-white/20">
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-7 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40'
              }`} />
          ))}
        </div>

        {/* Counter */}
        <span className="absolute top-4 right-4 bg-black/40 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-sm z-10 border border-white/10">
          {current + 1} / {SLIDES.length}
        </span>
      </div>

      {/* ── Below slider ─────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg,#fff0f6 0%,#fdf3e7 60%,#fff8f0 100%)' }}>
        <div className="max-w-5xl mx-auto px-5 py-10 space-y-10">

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: '29+',  label: 'Total Beds',    icon: '🛏️' },
              { value: '9',    label: 'Rooms',         icon: '🏠' },
              { value: '4',    label: 'Room Types',    icon: '🔑' },
              { value: '24/7', label: 'Security',      icon: '🔒' },
            ].map(s => (
              <div key={s.label}
                className="bg-white rounded-2xl p-4 text-center shadow-sm border border-pink-100 hover:shadow-md transition">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="text-2xl font-extrabold" style={{ color: '#c026d3' }}>{s.value}</p>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Description + facilities */}
          <div className="bg-white rounded-3xl shadow-sm border border-pink-100 p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-gray-800 mb-2">
              🏡 Welcome to HK PG Boys Accommodation
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6">
              We offer clean, comfortable, and budget-friendly stay options for students and working professionals.
              Located near Akurdi Railway Station with easy connectivity across Pune.
            </p>

            {/* Facilities grid */}
            <h3 className="text-sm font-extrabold text-gray-700 uppercase tracking-wide mb-3">
              ✅ Our Facilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-6">
              {ALL_FACILITIES.map(f => (
                <div key={f.label}
                  className="flex items-center gap-2.5 bg-pink-50 rounded-xl px-3 py-2.5">
                  <span className="text-lg flex-shrink-0">{f.icon}</span>
                  <span className="text-sm font-semibold text-gray-700">{f.label}</span>
                </div>
              ))}
            </div>

            {/* Best suited for */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 border border-pink-100">
              <p className="text-sm font-extrabold text-gray-700 mb-1">🎓 Best Suited For</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Students of <strong>DY Patil, PCCOE, PCET</strong> & working professionals in pune,Hinjewadi IT park,talwade IT park looking for
                affordable, comfortable accommodation near Akurdi.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <button onClick={onBook}
              className="px-12 py-4 rounded-2xl font-extrabold text-white text-base shadow-xl hover:opacity-90 active:scale-95 transition"
              style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)' }}>
              View All Room Options →
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
