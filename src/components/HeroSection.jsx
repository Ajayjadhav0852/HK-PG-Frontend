import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

function cdnUrl(url, width = 800) {
  if (!url || !url.includes('res.cloudinary.com')) return url
  return url.replace(/\/upload\/([^/]*\/)?/, `/upload/w_${width},q_auto,f_auto,fl_progressive,dpr_auto/`)
}

const SLIDES = [
  { url: 'https://res.cloudinary.com/dzr0crkvr/image/upload/v1776062518/IMG_20260328_195806.jpg_exlqfb.jpg', caption: 'Comfortable & Spacious Rooms' },
  { url: 'https://res.cloudinary.com/dzr0crkvr/image/upload/v1776062505/WhatsApp_Image_2026-03-27_at_8.37.11_PM_qvrvk4.jpg', caption: 'Modern Facilities' },
  { url: 'https://res.cloudinary.com/dzr0crkvr/image/upload/v1776062505/IMG_20260413_102220113.jpg_bzsaya.jpg', caption: 'Safe & Secure Environment' },
  { url: 'https://res.cloudinary.com/dzr0crkvr/image/upload/v1776062499/IMG_20260413_102118487.jpg_cqtzls.jpg', caption: 'Budget-Friendly Options' },
]

const VISITOR_TYPES = [
  { key: 'student',  label: 'Student' },
  { key: 'working',  label: 'Working Professional' },
  { key: 'cdac',     label: 'CDAC Student' },
  { key: 'other',    label: 'Other' },
]

// ── Book Visit Modal — rendered via portal directly on body ──────────────────
function BookVisitModal({ onClose }) {
  const [form, setForm]       = useState({ name: '', mobile: '', type: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState('')

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Close on Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim())                 { setError('Please enter your name.'); return }
    if (!/^[0-9]{10}$/.test(form.mobile)) { setError('Enter a valid 10-digit mobile number.'); return }
    if (!form.type)                        { setError('Please select your category.'); return }
    setError('')
    setLoading(true)
    const msg = encodeURIComponent(
      `🏠 *New Visit Request — HK PG Akurdi*\n\n` +
      `👤 *Name:* ${form.name}\n` +
      `📞 *Mobile:* ${form.mobile}\n` +
      `🎓 *Category:* ${VISITOR_TYPES.find(t => t.key === form.type)?.label}\n\n` +
      `Please call/WhatsApp to schedule their visit. Thank you!`
    )
    window.open(`https://wa.me/919579828996?text=${msg}`, '_blank')
    await new Promise(r => setTimeout(r, 600))
    setLoading(false)
    setDone(true)
  }

  const modal = (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div style={{
        background: 'white', borderRadius: 24, width: '100%', maxWidth: 400,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        animation: 'modalIn 0.28s cubic-bezier(0.22,1,0.36,1)',
      }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)', padding: '20px 20px 18px', position: 'relative', borderRadius: '24px 24px 0 0' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: 17, margin: 0 }}>Book a Visit</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: 0 }}>We'll call you to schedule</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>
          {done ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="52" height="52" style={{ margin: '0 auto 12px', display: 'block' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <h3 style={{ fontWeight: 800, color: '#111827', fontSize: 17, margin: '0 0 8px' }}>Request Sent!</h3>
              <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 18px', lineHeight: 1.6 }}>The owner has been notified via WhatsApp. You'll receive a call shortly to schedule your visit.</p>
              <button onClick={onClose} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#d63384,#c026d3)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Done</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Full Name *</label>
                <input type="text" placeholder="e.g. Rahul Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={{ width: '100%', padding: '10px 13px', borderRadius: 11, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#c026d3'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mobile Number *</label>
                <input type="tel" placeholder="10-digit number" maxLength={10} value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value.replace(/\D/g, '') }))}
                  style={{ width: '100%', padding: '10px 13px', borderRadius: 11, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#c026d3'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>I am a *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {VISITOR_TYPES.map(t => (
                    <button key={t.key} type="button" onClick={() => setForm(f => ({ ...f, type: t.key }))}
                      style={{ padding: '7px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: form.type === t.key ? 'linear-gradient(135deg,#d63384,#c026d3)' : 'white', color: form.type === t.key ? 'white' : '#374151', border: form.type === t.key ? 'none' : '1.5px solid #e5e7eb', boxShadow: form.type === t.key ? '0 4px 12px rgba(208,35,132,0.3)' : 'none' }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              {error && <p style={{ color: '#dc2626', fontSize: 12, background: '#fef2f2', padding: '9px 12px', borderRadius: 9, margin: 0 }}>{error}</p>}
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#e5e7eb' : 'linear-gradient(135deg,#d63384,#c026d3)', color: loading ? '#9ca3af' : 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Sending...' : 'Request a Visit'}
              </button>
              <p style={{ color: '#9ca3af', fontSize: 11, textAlign: 'center', margin: 0 }}>Owner will contact you within a few hours to confirm your visit.</p>
            </form>
          )}
        </div>
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.93) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
    </div>
  )

  // Portal renders directly on document.body — always centered on viewport regardless of scroll
  return createPortal(modal, document.body)
}

export default function HeroSection({ onBook }) {
  const [current, setCurrent]               = useState(0)
  const [showVisitModal, setShowVisitModal] = useState(false)
  const intervalRef = useRef(null)

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

  const nextSlide = useCallback(() => setCurrent(c => (c + 1) % SLIDES.length), [])
  const prevSlide = useCallback(() => setCurrent(c => (c === 0 ? SLIDES.length - 1 : c - 1)), [])

  useEffect(() => {
    const start = () => { if (!intervalRef.current) intervalRef.current = setInterval(nextSlide, 3500) }
    const stop  = () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null } }
    const onVis = () => { if (document.hidden) stop(); else start() }
    start()
    document.addEventListener('visibilitychange', onVis)
    return () => { stop(); document.removeEventListener('visibilitychange', onVis) }
  }, [nextSlide])

  const amenities = [
    { label: 'Prime Location', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg> },
    // Proper motorbike/scooter icon
    { label: 'Parking',        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/><path d="M15 6h2l2 5H8l1-3h4"/><path d="M8 17.5H5.5M18.5 17.5H15l-2-5"/><path d="M10 6V4"/></svg> },
    // Water drop for RO Water
    { label: 'RO Water',       icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M12 2C6 9 4 13 4 16a8 8 0 0 0 16 0c0-3-2-7-8-14z"/><path d="M8 17a4 4 0 0 0 8 0"/></svg> },
    { label: 'High-Speed WiFi',icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg> },
    { label: '24x7 Security',  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  ]

  return (
    <>
      {showVisitModal && <BookVisitModal onClose={() => setShowVisitModal(false)} />}

      <div className="relative w-full overflow-hidden" style={{ height: '90vh', minHeight: '560px' }}>
        {/* Slider */}
        <div className="flex h-full transition-transform duration-700 ease-in-out will-change-transform" style={{ transform: `translateX(-${current * 100}%)` }}>
          {SLIDES.map((slide, i) => (
            <div key={i} className="min-w-full h-full flex-shrink-0">
              <img src={cdnUrl(slide.url, 1400)} alt={slide.caption} className="w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'low'} decoding={i === 0 ? 'sync' : 'async'} />
            </div>
          ))}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.50) 40%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.05) 100%)' }} />

        {/* Content */}
        <div className="absolute top-1/3 left-0 right-0 px-6 sm:px-12 lg:px-20">

          {/* Headline — Playfair Display for premium boutique feel */}
          <h1 className="font-extrabold text-white leading-tight" style={{ fontSize: 'clamp(2.8rem, 7.5vw, 5.5rem)', fontFamily: "'Playfair Display', Georgia, serif" }}>
            HK PG Boys
          </h1>
          <h1 className="font-extrabold leading-tight" style={{ fontSize: 'clamp(2.8rem, 7.5vw, 5.5rem)', color: '#f472b6', fontFamily: "'Playfair Display', Georgia, serif" }}>
            Accommodation
          </h1>

          <p className="text-white mt-3 text-base sm:text-lg flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Near Gurudwara, Akurdi Railway Station, Pune
          </p>

          {/* Buttons */}
          <div className="mt-6 flex gap-3 flex-wrap">
            <button onClick={onBook}
              className="px-6 py-3 rounded-xl text-white font-bold hover:opacity-90 transition"
              style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)', fontFamily: "'Poppins', sans-serif" }}>
              Explore Rooms →
            </button>
            {/* Glassmorphism Book a Visit button */}
            <button onClick={() => setShowVisitModal(true)}
              className="px-6 py-3 rounded-xl font-bold transition"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: 'white',
                border: '1.5px solid rgba(255,255,255,0.35)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                fontFamily: "'Poppins', sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            >
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Book a Visit
              </span>
            </button>
          </div>

          {/* Amenity capsules — glassmorphism */}
          <div className="mt-5 flex flex-wrap gap-2">
            {amenities.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full text-white"
                style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.22)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', fontFamily: "'Poppins', sans-serif" }}>
                {item.icon}{item.label}
              </span>
            ))}
          </div>
        </div>

        {/* Controls */}
        <button onClick={prevSlide} aria-label="Previous slide" className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full hover:bg-black/60 transition text-xl font-bold">‹</button>
        <button onClick={nextSlide} aria-label="Next slide"     className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full hover:bg-black/60 transition text-xl font-bold">›</button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`} />
          ))}
        </div>
      </div>

      {/* Load Playfair Display + Poppins from Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Poppins:wght@400;500;600;700&display=swap');
      `}</style>
    </>
  )
}
