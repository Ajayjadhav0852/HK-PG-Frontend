import { useState, useEffect } from 'react'

const slides = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80',
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=80',
]

export default function HeroSection({ onBook }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 3500)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}>

      {/* ── Full width sliding images ── */}
      <div className="relative w-full overflow-hidden" style={{ height: '85vh' }}>

        {/* Slides */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Room ${i + 1}`}
              className="min-w-full h-full object-cover flex-shrink-0"
            />
          ))}
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* ── PG Name centered on image ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase border border-white/30 mb-4">
            🏡 Premium PG Accommodation · Pune
          </span>
          <h1 className="text-white font-extrabold leading-tight drop-shadow-2xl"
            style={{ fontSize: 'clamp(2.2rem, 7vw, 5rem)', textShadow: '0 4px 30px rgba(0,0,0,0.7)' }}>
            HK PG Boys
          </h1>
          <h1 className="font-extrabold leading-tight drop-shadow-2xl mb-4"
            style={{
              fontSize: 'clamp(2.2rem, 7vw, 5rem)',
              textShadow: '0 4px 30px rgba(0,0,0,0.7)',
              background: 'linear-gradient(135deg, #f9a8d4, #e879f9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            Accommodation
          </h1>
          <p className="text-white/80 text-sm md:text-lg drop-shadow-lg max-w-md">
            Comfortable Living · Near Gurudwara, Akurdi Railway Station, Pune
          </p>
        </div>

        {/* Prev / Next */}
        <button
          onClick={() => setCurrent(c => (c === 0 ? slides.length - 1 : c - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-md transition z-10"
        >‹</button>
        <button
          onClick={() => setCurrent(c => (c + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-md transition z-10"
        >›</button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-7 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50'}`}
            />
          ))}
        </div>

        {/* Counter */}
        <span className="absolute top-4 right-4 bg-black/40 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-sm z-10">
          {current + 1} / {slides.length}
        </span>
      </div>

      {/* ── Bottom: description + pills + button ── */}
      <div className="flex flex-col items-center text-center px-6 py-10 gap-5">
        <p className="text-gray-500 text-base md:text-lg max-w-2xl leading-relaxed">
          A safe, comfortable, and community-driven home for students and young professionals.
          Premium facilities, flexible room options — near Gurudwara, Akurdi Railway Station, Pune.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {['📶 High-Speed WiFi', '🔋 Power Backup', '📹 24/7 CCTV', '🏍️ Parking', '💧 RO Water'].map(f => (
            <span key={f} className="bg-pink-50 text-pink-700 px-3 py-1.5 rounded-full text-sm font-semibold">{f}</span>
          ))}
        </div>

        <button
          onClick={onBook}
          className="px-12 py-4 rounded-2xl font-extrabold text-white text-base shadow-xl hover:opacity-90 active:scale-95 transition"
          style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
        >
          Explore Rooms →
        </button>
      </div>

    </div>
  )
}
