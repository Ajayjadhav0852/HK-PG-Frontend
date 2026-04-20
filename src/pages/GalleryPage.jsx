import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { galleryApi } from '../services/api'
import FooterSection from '../components/FooterSection'

// ── Section config ────────────────────────────────────────────────────────────
const SECTIONS = [
  { key: 'all',       label: 'All Photos',   emoji: '🏠', color: '#c026d3' },
  { key: 'outdoor',   label: 'Outdoor',      emoji: '🌿', color: '#16a34a' },
  { key: 'indoor',    label: 'Indoor',       emoji: '🛋️', color: '#2563eb' },
  { key: 'rooms',     label: 'Rooms',        emoji: '🛏️', color: '#d97706' },
  { key: 'balcony',   label: 'Balcony',      emoji: '🌅', color: '#0891b2' },
  { key: 'terrace',   label: 'Terrace',      emoji: '🌇', color: '#7c3aed' },
  { key: 'bathrooms', label: 'Bathrooms',    emoji: '🚿', color: '#0f766e' },
  { key: 'common',    label: 'Common Areas', emoji: '🤝', color: '#be185d' },
]

const SECTION_KEYS = SECTIONS.filter(s => s.key !== 'all').map(s => s.key)

// ── Upload Card (admin only) ──────────────────────────────────────────────────
function UploadCard({ onUploaded }) {
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState(null)
  const [section, setSection]   = useState('outdoor')
  const [caption, setCaption]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const inputRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    setError('')
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { setError('Please select an image'); return }
    setLoading(true); setError(''); setSuccess('')
    try {
      await galleryApi.upload(file, section, caption)
      setSuccess('Image uploaded successfully!')
      setFile(null); setPreview(null); setCaption('')
      onUploaded()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '28px',
      boxShadow: '0 4px 24px rgba(192,38,211,0.10)',
      border: '1px solid rgba(192,38,211,0.12)',
      marginBottom: '40px',
    }}>
      <div className="flex items-center gap-3 mb-6">
        <div style={{
          width: 44, height: 44, borderRadius: '12px',
          background: 'linear-gradient(135deg,#d63384,#c026d3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <div>
          <h3 className="font-extrabold text-gray-800 text-lg">Upload New Image</h3>
          <p className="text-xs text-gray-400">Admin only · Uploads to Cloudinary CDN</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${preview ? '#c026d3' : '#e5e7eb'}`,
            borderRadius: '16px',
            padding: '32px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: preview ? 'rgba(192,38,211,0.03)' : '#fafafa',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {preview ? (
            <div className="relative">
              <img src={preview} alt="preview" style={{ maxHeight: 200, borderRadius: 12, margin: '0 auto', display: 'block', objectFit: 'cover' }} />
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setFile(null); setPreview(null) }}
                style={{
                  position: 'absolute', top: 8, right: 8,
                  background: 'rgba(0,0,0,0.6)', color: 'white',
                  border: 'none', borderRadius: '50%', width: 28, height: 28,
                  cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
            </div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#c026d3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="40" height="40" style={{ margin: '0 auto 12px' }}>
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p className="text-gray-500 text-sm font-medium">Drag & drop or click to select</p>
              <p className="text-gray-400 text-xs mt-1">JPG, PNG, WebP · Max 5MB</p>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Section */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Section</label>
            <select
              value={section}
              onChange={e => setSection(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '12px',
                border: '1.5px solid #e5e7eb', fontSize: 14, background: 'white',
                outline: 'none', cursor: 'pointer',
              }}
            >
              {SECTION_KEYS.map(k => (
                <option key={k} value={k}>{SECTIONS.find(s => s.key === k)?.label || k}</option>
              ))}
            </select>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Caption (optional)</label>
            <input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="e.g. Spacious 2-sharing room"
              maxLength={100}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '12px',
                border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none',
              }}
            />
          </div>
        </div>

        {error   && <p style={{ color: '#dc2626', fontSize: 13, background: '#fef2f2', padding: '10px 14px', borderRadius: 10 }}>{error}</p>}
        {success && <p style={{ color: '#16a34a', fontSize: 13, background: '#f0fdf4', padding: '10px 14px', borderRadius: 10 }}>{success}</p>}

        <button
          type="submit"
          disabled={loading || !file}
          style={{
            width: '100%', padding: '12px',
            background: loading || !file ? '#e5e7eb' : 'linear-gradient(135deg,#d63384,#c026d3)',
            color: loading || !file ? '#9ca3af' : 'white',
            border: 'none', borderRadius: '14px', fontWeight: 700, fontSize: 15,
            cursor: loading || !file ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? 'Uploading to Cloudinary...' : 'Upload Image'}
        </button>
      </form>
    </div>
  )
}

// ── Image Card ────────────────────────────────────────────────────────────────
function ImageCard({ img, isAdmin, onDelete, onClick }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this image?')) return
    setDeleting(true)
    try { await onDelete(img.id) } finally { setDeleting(false) }
  }

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative', borderRadius: '16px', overflow: 'hidden',
        cursor: 'pointer', aspectRatio: '4/3',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)' }}
    >
      <img
        src={img.imageUrl}
        alt={img.caption || img.section}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)',
        opacity: 0, transition: 'opacity 0.2s ease',
      }}
        className="img-overlay"
      />
      {img.caption && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '8px 12px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
        }}>
          <p style={{ color: 'white', fontSize: 12, fontWeight: 600, margin: 0 }}>{img.caption}</p>
        </div>
      )}
      {isAdmin && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            position: 'absolute', top: 8, right: 8,
            background: deleting ? 'rgba(0,0,0,0.4)' : 'rgba(220,38,38,0.85)',
            color: 'white', border: 'none', borderRadius: '8px',
            width: 30, height: 30, cursor: 'pointer', fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
        >
          {deleting ? '…' : '✕'}
        </button>
      )}
    </div>
  )
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose }) {
  const [current, setCurrent] = useState(index)

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setCurrent(c => Math.min(c + 1, images.length - 1))
      if (e.key === 'ArrowLeft')  setCurrent(c => Math.max(c - 1, 0))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [images.length, onClose])

  const img = images[current]
  if (!img) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: 900, width: '100%' }}>
        <img
          src={img.imageUrl}
          alt={img.caption || img.section}
          style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 16 }}
        />
        {img.caption && (
          <p style={{ color: 'white', textAlign: 'center', marginTop: 12, fontSize: 14, opacity: 0.85 }}>{img.caption}</p>
        )}
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: -16, right: -16,
          background: 'rgba(255,255,255,0.15)', color: 'white',
          border: 'none', borderRadius: '50%', width: 40, height: 40,
          cursor: 'pointer', fontSize: 18, backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>
        {/* Prev */}
        {current > 0 && (
          <button onClick={() => setCurrent(c => c - 1)} style={{
            position: 'absolute', left: -56, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)', color: 'white',
            border: 'none', borderRadius: '50%', width: 44, height: 44,
            cursor: 'pointer', fontSize: 20, backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>‹</button>
        )}
        {/* Next */}
        {current < images.length - 1 && (
          <button onClick={() => setCurrent(c => c + 1)} style={{
            position: 'absolute', right: -56, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)', color: 'white',
            border: 'none', borderRadius: '50%', width: 44, height: 44,
            cursor: 'pointer', fontSize: 20, backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>›</button>
        )}
        {/* Counter */}
        <div style={{
          position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.6)', fontSize: 13,
        }}>{current + 1} / {images.length}</div>
      </div>
    </div>
  )
}

// ── Main Gallery Page ─────────────────────────────────────────────────────────
export default function GalleryPage() {
  const { user } = useAuth()
  const isAdmin  = user?.role === 'admin'

  const [images,       setImages]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [activeSection, setActiveSection] = useState('all')
  const [lightbox,     setLightbox]     = useState(null) // { images, index }
  const [error,        setError]        = useState('')

  const fetchImages = useCallback(async () => {
    try {
      const res = await galleryApi.getAll()
      setImages(res.data || [])
    } catch (err) {
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

  // Group by section for "all" view
  const grouped = SECTION_KEYS.reduce((acc, key) => {
    const sectionImages = images.filter(img => img.section === key)
    if (sectionImages.length > 0) acc[key] = sectionImages
    return acc
  }, {})

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg,#fff0f6 0%,#fdf3e7 60%,#fff8f0 100%)' }}>

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0533 0%, #2d0a5e 40%, #1a0533 100%)',
        padding: '60px 24px 48px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative dots */}
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }} />
        ))}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(192,38,211,0.2)', borderRadius: 100,
            padding: '6px 16px', marginBottom: 16,
            border: '1px solid rgba(192,38,211,0.3)',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span style={{ color: '#e879f9', fontSize: 13, fontWeight: 600 }}>Photo Gallery</span>
          </div>
          <h1 style={{
            color: 'white', fontWeight: 900, margin: '0 0 12px',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          }}>
            Life at <span style={{ background: 'linear-gradient(90deg,#f472b6,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HK PG</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
            A glimpse into your future home — clean spaces, great vibes, and a community that feels like family.
          </p>
          <div style={{ marginTop: 20, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
            {images.length} photos across {Object.keys(grouped).length} sections
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 py-10 flex-1">

        {/* ── Admin Upload Card ──────────────────────────────────────────── */}
        {isAdmin && <UploadCard onUploaded={fetchImages} />}

        {/* ── Section Filter Tabs ────────────────────────────────────────── */}
        <div style={{ overflowX: 'auto', paddingBottom: 8, marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 10, minWidth: 'max-content' }}>
            {SECTIONS.map(sec => {
              const count = sec.key === 'all' ? images.length : images.filter(i => i.section === sec.key).length
              const active = activeSection === sec.key
              return (
                <button
                  key={sec.key}
                  onClick={() => setActiveSection(sec.key)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '100px',
                    border: active ? 'none' : '1.5px solid #e5e7eb',
                    background: active ? `linear-gradient(135deg,${sec.color},${sec.color}cc)` : 'white',
                    color: active ? 'white' : '#374151',
                    fontWeight: 700, fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: active ? `0 4px 16px ${sec.color}40` : '0 1px 4px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>{sec.emoji}</span>
                  <span>{sec.label}</span>
                  <span style={{
                    background: active ? 'rgba(255,255,255,0.25)' : '#f3f4f6',
                    color: active ? 'white' : '#6b7280',
                    borderRadius: '100px', padding: '1px 7px', fontSize: 11, fontWeight: 700,
                  }}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Loading ────────────────────────────────────────────────────── */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: 44, height: 44, border: '4px solid #f3e8ff',
              borderTopColor: '#c026d3', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
            }} />
            <p style={{ color: '#9ca3af', fontSize: 14 }}>Loading gallery...</p>
          </div>
        )}

        {/* ── Error ─────────────────────────────────────────────────────── */}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#dc2626' }}>{error}</div>
        )}

        {/* ── Empty state ────────────────────────────────────────────────── */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📷</div>
            <p style={{ color: '#9ca3af', fontSize: 15 }}>
              {isAdmin ? 'No images yet. Upload the first one above!' : 'Photos coming soon. Check back later!'}
            </p>
          </div>
        )}

        {/* ── All sections view ──────────────────────────────────────────── */}
        {!loading && !error && activeSection === 'all' && Object.keys(grouped).length > 0 && (
          <div className="space-y-12">
            {SECTION_KEYS.filter(k => grouped[k]).map(key => {
              const sec = SECTIONS.find(s => s.key === key)
              const sectionImages = grouped[key]
              return (
                <div key={key}>
                  {/* Section header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '12px',
                      background: `linear-gradient(135deg,${sec.color}22,${sec.color}44)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22,
                    }}>{sec.emoji}</div>
                    <div>
                      <h2 style={{ fontWeight: 800, color: '#1f2937', fontSize: 20, margin: 0 }}>{sec.label}</h2>
                      <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>{sectionImages.length} photo{sectionImages.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,#e5e7eb,transparent)', marginLeft: 8 }} />
                    <button
                      onClick={() => setActiveSection(key)}
                      style={{
                        padding: '6px 14px', borderRadius: '100px',
                        border: `1.5px solid ${sec.color}`,
                        background: 'transparent', color: sec.color,
                        fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      }}
                    >View all</button>
                  </div>
                  {/* Grid — show max 6 in overview */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                    {sectionImages.slice(0, 6).map((img, idx) => (
                      <ImageCard
                        key={img.id}
                        img={img}
                        isAdmin={isAdmin}
                        onDelete={handleDelete}
                        onClick={() => setLightbox({ images: sectionImages, index: idx })}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Single section view ────────────────────────────────────────── */}
        {!loading && !error && activeSection !== 'all' && filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {filtered.map((img, idx) => (
              <ImageCard
                key={img.id}
                img={img}
                isAdmin={isAdmin}
                onDelete={handleDelete}
                onClick={() => setLightbox({ images: filtered, index: idx })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <FooterSection />
    </div>
  )
}
