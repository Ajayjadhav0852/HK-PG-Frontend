import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { galleryApi } from '../services/api'
import FooterSection from '../components/FooterSection'

// ── Section config ────────────────────────────────────────────────────────────
const SECTIONS = [
  { key: 'all',        label: 'All',             emoji: '🏠' },
  { key: '1-sharing',  label: '1 Sharing Room',  emoji: '🛏️' },
  { key: '2-sharing',  label: '2 Sharing Room',  emoji: '🛏️' },
  { key: '3-sharing',  label: '3 Sharing Room',  emoji: '🛏️' },
  { key: '4-sharing',  label: '4 Sharing Room',  emoji: '🛏️' },
  { key: 'balcony',    label: 'Balcony',          emoji: '🌅' },
  { key: 'outdoor',    label: 'Outdoor',          emoji: '🌿' },
  { key: 'indoor',     label: 'Indoor',           emoji: '🛋️' },
  { key: 'common',     label: 'Common Areas',     emoji: '🤝' },
  { key: 'parking',    label: 'Parking',          emoji: '🏍️' },
  { key: 'terrace',    label: 'Terrace',          emoji: '🌇' },
  { key: 'bathrooms',  label: 'Bathrooms',        emoji: '🚿' },
  { key: 'rooms',      label: 'Rooms (General)',  emoji: '🚪' },
]

const SECTION_KEYS = SECTIONS.filter(s => s.key !== 'all').map(s => s.key)

// ── Cloudinary CDN optimizer ──────────────────────────────────────────────────
function cdnOpt(url, width = 600) {
  if (!url || !url.includes('res.cloudinary.com')) return url
  return url.replace(/\/upload\/([^/]*\/)?/, `/upload/w_${width},q_auto,f_auto,dpr_auto/`)
}

// ── Direct Cloudinary upload ──────────────────────────────────────────────────
const CLOUDINARY_CLOUD  = 'dzr0crkvr'
const CLOUDINARY_PRESET = 'hkpg_gallery'

async function uploadToCloudinary(file, section) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', CLOUDINARY_PRESET)
  fd.append('folder', `hkpg/gallery/${section}`)
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
    { method: 'POST', body: fd }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Cloudinary upload failed (${res.status})`)
  }
  const data = await res.json()
  return data.secure_url
}

// ── Upload Card (admin only) ──────────────────────────────────────────────────
function UploadCard({ onUploaded }) {
  const [file, setFile]       = useState(null)
  const [preview, setPreview] = useState(null)
  const [section, setSection] = useState('outdoor')
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const inputRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    setFile(f); setError('')
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { setError('Please select an image'); return }
    setLoading(true); setError(''); setSuccess('')
    try {
      const url = await uploadToCloudinary(file, section)
      await galleryApi.saveUrl(url, section, caption)
      setSuccess('✅ Image uploaded successfully!')
      setFile(null); setPreview(null); setCaption('')
      onUploaded()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      const msg = err.message || 'Upload failed'
      if (msg.toLowerCase().includes('preset')) {
        setError('⚙️ Cloudinary preset "hkpg_gallery" not found. Go to cloudinary.com → Settings → Upload → Add upload preset → name "hkpg_gallery" → Signing mode: Unsigned → Save.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 mb-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg"
          style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)' }}>📷</div>
        <div>
          <h3 className="font-extrabold text-gray-800 text-base">Upload New Image</h3>
          <p className="text-xs text-gray-400">Admin only · Uploads to Cloudinary CDN</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drop zone */}
        <div
          onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all"
          style={{ borderColor: preview ? '#c026d3' : '#e5e7eb', background: preview ? 'rgba(192,38,211,0.03)' : '#fafafa' }}
        >
          {preview ? (
            <div className="relative inline-block">
              <img src={preview} alt="preview" className="max-h-48 rounded-xl mx-auto object-cover" />
              <button type="button" onClick={e => { e.stopPropagation(); setFile(null); setPreview(null) }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center text-sm hover:bg-black/80">✕</button>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-gray-500 text-sm font-medium">Drag & drop or click to select</p>
              <p className="text-gray-400 text-xs mt-1">JPG, PNG, WebP · Max 5MB</p>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Section</label>
            <select value={section} onChange={e => setSection(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-400 bg-white">
              {SECTION_KEYS.map(k => (
                <option key={k} value={k}>{SECTIONS.find(s => s.key === k)?.emoji} {SECTIONS.find(s => s.key === k)?.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Caption (optional)</label>
            <input type="text" value={caption} onChange={e => setCaption(e.target.value)}
              placeholder="e.g. Spacious 2-sharing room"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-400" />
          </div>
        </div>

        {error   && <p className="text-red-600 text-xs bg-red-50 rounded-xl px-4 py-3">{error}</p>}
        {success && <p className="text-green-600 text-xs bg-green-50 rounded-xl px-4 py-3">{success}</p>}

        <button type="submit" disabled={loading || !file}
          className="w-full py-3 rounded-xl font-bold text-sm text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)' }}>
          {loading ? '⏳ Uploading to Cloudinary...' : '📤 Upload Image'}
        </button>
      </form>
    </div>
  )
}

// ── Premium 3D Fan Carousel ───────────────────────────────────────────────────
function FanCarousel({ images, onImageClick, isAdmin, onDelete }) {
  const [center, setCenter] = useState(0)
  const [hover, setHover]   = useState(false)
  const [glow, setGlow]     = useState({ x: 50, y: 50 })
  const autoRef = useRef(null)
  const touchStart = useRef(null)

  const total = images.length

  const go = useCallback((dir) => {
    setCenter(c => (c + (dir === 'right' ? 1 : -1) + total) % total)
  }, [total])

  const resetAuto = (dir) => {
    clearInterval(autoRef.current)
    go(dir)
    autoRef.current = setInterval(() => go('right'), 4500)
  }

  useEffect(() => {
    if (total < 2) return
    autoRef.current = setInterval(() => go('right'), 4500)
    return () => clearInterval(autoRef.current)
  }, [total, go])

  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX }
  const handleTouchEnd   = (e) => {
    if (touchStart.current === null) return
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) resetAuto(diff > 0 ? 'right' : 'left')
    touchStart.current = null
  }

  if (total === 0) return (
    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="56" height="56" className="mb-4 opacity-40">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
      </svg>
      <p className="text-base font-medium">No photos yet in this section</p>
      <p className="text-sm mt-1 opacity-60">Photos will appear here once uploaded</p>
    </div>
  )

  const getIdx = (offset) => (center + offset + total) % total

  const slots = [
    { offset: -2, scale: 0.52, x: '-80%', z: 1, rotate: -20, opacity: 0.28, blur: 3 },
    { offset: -1, scale: 0.72, x: '-50%', z: 2, rotate: -11, opacity: 0.60, blur: 1 },
    { offset:  0, scale: 1.00, x:   '0%', z: 5, rotate:   0, opacity: 1.00, blur: 0 },
    { offset:  1, scale: 0.72, x:  '50%', z: 2, rotate:  11, opacity: 0.60, blur: 1 },
    { offset:  2, scale: 0.52, x:  '80%', z: 1, rotate:  20, opacity: 0.28, blur: 3 },
  ]

  const centerImg = images[center]
  const sectionLabel = SECTIONS.find(s => s.key === centerImg?.section)?.label || centerImg?.section

  return (
    <div className="w-full select-none" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

      {/* ── Dark cinematic stage ─────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(180deg,#0f0c1a 0%,#1a0533 60%,#0f0c1a 100%)',
        borderRadius: 32,
        padding: '48px 0 40px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
      }}>

        {/* Ambient glow blobs */}
        <div style={{
          position: 'absolute', top: '20%', left: '15%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(214,51,132,0.18),transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '20%', right: '15%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(192,38,211,0.18),transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        {/* Carousel stage */}
        <div className="relative flex items-center justify-center"
          style={{ height: 'clamp(240px, 44vw, 460px)', perspective: '1400px' }}>
          {slots.map(({ offset, scale, x, z, rotate, opacity, blur }) => {
            const idx = getIdx(offset)
            if (total < 5 && Math.abs(offset) > Math.floor(total / 2)) return null
            const img = images[idx]
            const isCenter = offset === 0
            return (
              <div
                key={`${offset}-${idx}`}
                onClick={() => isCenter ? onImageClick(idx) : resetAuto(offset > 0 ? 'right' : 'left')}
                onMouseEnter={() => isCenter && setHover(true)}
                onMouseLeave={() => { setHover(false); setGlow({ x: 50, y: 50 }) }}
                onMouseMove={(e) => {
                  if (!isCenter) return
                  const rect = e.currentTarget.getBoundingClientRect()
                  setGlow({
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top)  / rect.height) * 100,
                  })
                }}
                style={{
                  position: 'absolute',
                  width: isCenter ? 'clamp(260px, 50vw, 540px)' : 'clamp(120px, 20vw, 240px)',
                  aspectRatio: '4/3',
                  transform: `translateX(${x}) scale(${hover && isCenter ? 1.06 : scale}) rotateY(${rotate}deg)`,
                  zIndex: z,
                  opacity,
                  filter: blur > 0 ? `blur(${blur}px)` : 'none',
                  transition: 'all 0.65s cubic-bezier(0.22,1,0.36,1)',
                  cursor: isCenter ? 'zoom-in' : 'pointer',
                  borderRadius: 22,
                  overflow: 'hidden',
                  // Glassmorphism border
                  border: isCenter
                    ? '1.5px solid rgba(255,255,255,0.22)'
                    : '1px solid rgba(255,255,255,0.10)',
                  boxShadow: isCenter
                    ? hover
                      ? '0 48px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.15)'
                      : '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.10)'
                    : '0 8px 28px rgba(0,0,0,0.35)',
                }}
              >
                {/* Image with cinematic zoom */}
                <img
                  src={cdnOpt(img.imageUrl, isCenter ? 900 : 400)}
                  alt={img.caption || img.section}
                  loading="lazy"
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    transform: hover && isCenter ? 'scale(1.08)' : 'scale(1.04)',
                    transition: 'transform 0.6s ease',
                    animation: isCenter ? 'cinematicZoom 14s ease-in-out infinite alternate' : 'none',
                  }}
                />

                {/* Mouse-tracking glow overlay */}
                {isCenter && (
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.18), transparent 45%)`,
                    transition: 'background 0.1s ease',
                  }} />
                )}

                {/* Subtle vignette */}
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: 'linear-gradient(180deg,rgba(255,255,255,0.06) 0%,transparent 35%,rgba(0,0,0,0.25) 100%)',
                }} />

                {/* Admin delete */}
                {isAdmin && isCenter && (
                  <button
                    onClick={async (e) => { e.stopPropagation(); if (window.confirm('Delete this image?')) await onDelete(img.id) }}
                    style={{
                      position: 'absolute', top: 12, right: 12,
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'rgba(220,38,38,0.85)', color: 'white',
                      border: 'none', cursor: 'pointer', fontSize: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backdropFilter: 'blur(8px)',
                    }}
                  >✕</button>
                )}
              </div>
            )
          })}
        </div>

        {/* Caption + counter */}
        <div className="text-center mt-6 px-4" style={{ minHeight: 52 }}>
          {centerImg?.caption && (
            <p style={{ color: 'rgba(255,255,255,0.92)', fontWeight: 700, fontSize: 16, margin: '0 0 4px' }}>
              {centerImg.caption}
            </p>
          )}
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>
            {sectionLabel} · {center + 1} / {total}
          </p>
        </div>

        {/* Prev / Next + dots */}
        <div className="flex items-center justify-center gap-4 mt-5 px-4">
          <button onClick={() => resetAuto('left')} style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: 'white', fontSize: 22, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            transition: 'background 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
          >‹</button>

          {/* Dot indicators */}
          <div className="flex gap-1.5 flex-wrap justify-center" style={{ maxWidth: 200 }}>
            {images.map((_, i) => (
              <button key={i}
                onClick={() => { clearInterval(autoRef.current); setCenter(i) }}
                style={{
                  borderRadius: 4, border: 'none', cursor: 'pointer',
                  width: i === center ? 22 : 6, height: 6,
                  background: i === center
                    ? 'linear-gradient(90deg,#f472b6,#c026d3)'
                    : 'rgba(255,255,255,0.25)',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>

          <button onClick={() => resetAuto('right')} style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: 'white', fontSize: 22, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            transition: 'background 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
          >›</button>
        </div>
      </div>

      <style>{`
        @keyframes cinematicZoom {
          0%   { transform: scale(1.04); }
          100% { transform: scale(1.12); }
        }
      `}</style>
    </div>
  )
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose }) {
  const [current, setCurrent] = useState(index)

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setCurrent(c => Math.min(c + 1, images.length - 1))
      if (e.key === 'ArrowLeft')  setCurrent(c => Math.max(c - 1, 0))
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [images.length, onClose])

  const img = images[current]
  if (!img) return null

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: 900, width: '100%' }}>
        <img src={cdnOpt(img.imageUrl, 1200)} alt={img.caption || img.section}
          style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 16 }} />
        {img.caption && (
          <p style={{ color: 'white', textAlign: 'center', marginTop: 12, fontSize: 14, opacity: 0.85 }}>{img.caption}</p>
        )}
        <button onClick={onClose} style={{
          position: 'absolute', top: -16, right: -16,
          background: 'rgba(255,255,255,0.15)', color: 'white',
          border: 'none', borderRadius: '50%', width: 40, height: 40,
          cursor: 'pointer', fontSize: 18, backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>
        {current > 0 && (
          <button onClick={() => setCurrent(c => c - 1)} style={{
            position: 'absolute', left: -56, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none',
            borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', fontSize: 20,
            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>‹</button>
        )}
        {current < images.length - 1 && (
          <button onClick={() => setCurrent(c => c + 1)} style={{
            position: 'absolute', right: -56, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none',
            borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', fontSize: 20,
            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>›</button>
        )}
        <div style={{ position: 'absolute', bottom: -36, left: '50%', transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
          {current + 1} / {images.length}
        </div>
      </div>
    </div>
  )
}

// ── Main Gallery Page ─────────────────────────────────────────────────────────
export default function GalleryPage() {
  const { user } = useAuth()
  const isAdmin  = user?.role === 'admin'

  const [images,        setImages]        = useState([])
  const [loading,       setLoading]       = useState(true)
  const [activeSection, setActiveSection] = useState('all')
  const [lightbox,      setLightbox]      = useState(null)
  const [error,         setError]         = useState('')

  // Section order: 4-sharing first, then 3, 2, 1, then rest
  const SECTION_ORDER = ['4-sharing','3-sharing','2-sharing','1-sharing','balcony','outdoor','indoor','common','parking','terrace','bathrooms','rooms']
  const sortImages = (imgs) => [...imgs].sort((a, b) => {
    const ai = SECTION_ORDER.indexOf(a.section)
    const bi = SECTION_ORDER.indexOf(b.section)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })

  const fetchImages = useCallback(async () => {
    try {
      const res = await galleryApi.getAll()
      setImages(sortImages(res.data || []))
    } catch {
      setError('Could not load gallery. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchImages() }, [fetchImages])

  const handleDelete = async (id) => {
    await galleryApi.delete(id)
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const filtered = activeSection === 'all'
    ? images
    : images.filter(img => img.section === activeSection)

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(135deg,#fff0f6 0%,#fdf3e7 60%,#fff8f0 100%)' }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="w-full px-4 pt-12 pb-8 text-center">
        <span className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3"
          style={{ background: 'rgba(192,38,211,0.1)', color: '#c026d3' }}>
          GALLERY
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
          Life at <span style={{ background: 'linear-gradient(90deg,#d63384,#c026d3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HK PG</span>
        </h1>
        <p className="text-gray-500 text-base max-w-md mx-auto">
          A glimpse into your future home — clean spaces, great vibes, and a community that feels like family.
        </p>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 pb-16 flex-1">

        {/* ── Admin Upload ──────────────────────────────────────────────── */}
        {isAdmin && <UploadCard onUploaded={fetchImages} />}

        {/* ── Section Filter Tabs ───────────────────────────────────────── */}
        <div className="overflow-x-auto pb-2 mb-10">
          <div className="flex gap-2 min-w-max mx-auto justify-center flex-wrap">
            {SECTIONS.map(sec => {
              const count = sec.key === 'all' ? images.length : images.filter(i => i.section === sec.key).length
              const active = activeSection === sec.key
              return (
                <button key={sec.key} onClick={() => setActiveSection(sec.key)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all border"
                  style={{
                    background: active ? 'linear-gradient(135deg,#d63384,#c026d3)' : 'white',
                    color: active ? 'white' : '#374151',
                    borderColor: active ? 'transparent' : '#e5e7eb',
                    boxShadow: active ? '0 4px 14px rgba(208,35,132,0.3)' : '0 1px 3px rgba(0,0,0,0.06)',
                  }}>
                  <span>{sec.emoji}</span>
                  <span>{sec.label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{ background: active ? 'rgba(255,255,255,0.25)' : '#f3f4f6', color: active ? 'white' : '#6b7280' }}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Loading ───────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex flex-col items-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Loading gallery...</p>
          </div>
        )}

        {/* ── Error ─────────────────────────────────────────────────────── */}
        {error && !loading && (
          <p className="text-center text-red-500 py-10">{error}</p>
        )}

        {/* ── Fan Carousel ──────────────────────────────────────────────── */}
        {!loading && !error && (
          <FanCarousel
            images={filtered}
            isAdmin={isAdmin}
            onDelete={handleDelete}
            onImageClick={(idx) => setLightbox({ images: filtered, index: idx })}
          />
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox images={lightbox.images} index={lightbox.index} onClose={() => setLightbox(null)} />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
