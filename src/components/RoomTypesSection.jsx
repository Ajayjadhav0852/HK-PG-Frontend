import { useState, memo, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { adminApi } from '../services/api'

// ── Cloudinary CDN optimizer ──────────────────────────────────────────────────
// Injects w_, q_auto, f_auto, fl_progressive so the browser gets
// the smallest possible WebP/AVIF from Cloudinary's edge CDN.
function cdnUrl(url, width = 600) {
  if (!url || !url.includes('res.cloudinary.com')) return url
  return url.replace(
    /\/upload\/([^/]*\/)?/,
    `/upload/w_${width},q_auto,f_auto,fl_progressive,dpr_auto/`
  )
}

// Full class strings must be written out completely so Tailwind's
// static scanner includes them in the production CSS bundle.
const TAG_COLORS = {
  '1-sharing': 'bg-purple-100 text-purple-700',
  '2-sharing': 'bg-pink-100 text-pink-700',
  '3-sharing': 'bg-orange-100 text-orange-700',
  '4-sharing': 'bg-green-100 text-green-700',
}

const FALLBACK_IMAGES = {
  '1-sharing': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  '2-sharing': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80',
  '3-sharing': 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
  '4-sharing': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80',
}

// Amenities shown on each room card
const AMENITY_ICONS = ['📶', '🚿', '🗄️', '📹', '👕']

const SLUGS = ['1-sharing', '2-sharing', '3-sharing', '4-sharing']

// Skeleton card shown while data loads
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
        <div className="flex gap-1 mt-1">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-6 w-6 bg-gray-200 rounded-full" />)}
        </div>
        <div className="h-10 bg-gray-200 rounded-xl mt-1" />
      </div>
    </div>
  )
}

const RoomCard = memo(function RoomCard({ slug, rt, onBook, onRoomUpdated, isAdmin }) {
  const [loading, setLoading] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const fallback  = FALLBACK_IMAGES[slug]
  const tagColor  = TAG_COLORS[slug]
  const vacantBeds = rt?.vacantBeds ?? 0
  const isFull    = vacantBeds === 0

  const handleBooking = async () => {
    if (loading || isFull) return
    setLoading(true)
    await onBook(slug)
    if (onRoomUpdated) await onRoomUpdated()
    setLoading(false)
  }

  const handleEdit = async () => {
    const newPrice = prompt('Enter new price:', rt.monthlyPrice)
    const newImage = prompt('Enter new image URL:', rt.imageUrl)
    if (!newPrice || !newImage) return
    try {
      await adminApi.updateRoomType(slug, {
        monthlyPrice: Number(newPrice),
        imageUrl: newImage,
      })
      if (onRoomUpdated) await onRoomUpdated()
    } catch (e) {
      console.error(e)
      alert('Update failed')
    }
  }

  if (!rt) return <SkeletonCard />

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative">

      {/* Admin edit */}
      {isAdmin && (
        <button
          onClick={handleEdit}
          aria-label="Edit room"
          className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:scale-110 transition-transform"
        >
          ✏️
        </button>
      )}

      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100 flex-shrink-0">
        {/* Skeleton shimmer until image loads */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        )}
        <img
          src={cdnUrl(rt.imageUrl) || fallback}
          alt={rt.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={(e) => { e.target.src = fallback; setImgLoaded(true) }}
        />

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Tag badge */}
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${tagColor}`}>
          {rt.tag}
        </span>

        {/* Vacancy badge */}
        <span className={`absolute bottom-3 right-3 text-xs font-bold px-3 py-1 rounded-full shadow ${
          isFull ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {isFull ? '🔴 Full' : `🟢 ${vacantBeds} Left`}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">

        {/* Title + price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-extrabold text-gray-800 text-base leading-tight">{rt.title}</h3>
          <p className="font-extrabold text-pink-600 text-base whitespace-nowrap">
            ₹{Number(rt.monthlyPrice).toLocaleString('en-IN')}
            <span className="text-xs font-semibold text-gray-400">/mo</span>
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{rt.description}</p>

        {/* Amenity icons */}
        <div className="flex gap-1.5 flex-wrap mt-1">
          {AMENITY_ICONS.map((icon, i) => (
            <span key={i} className="w-7 h-7 bg-pink-50 rounded-full flex items-center justify-center text-sm" title="">
              {icon}
            </span>
          ))}
        </div>

        {/* Occupancy bar */}
        <div className="mt-1">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{rt.occupiedBeds} occupied</span>
            <span>{rt.totalBeds} total beds</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: rt.totalBeds > 0 ? `${(rt.occupiedBeds / rt.totalBeds) * 100}%` : '0%',
                background: 'linear-gradient(90deg, #d63384, #c026d3)',
              }}
            />
          </div>
        </div>

        {/* Book button */}
        <button
          onClick={handleBooking}
          disabled={isFull || loading}
          aria-label={isFull ? 'Room fully booked' : `Book ${rt.title}`}
          title={isFull ? 'This room type is fully booked. Check back later.' : ''}
          className="mt-2 py-2.5 rounded-xl text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-90 active:scale-95"
          style={{
            background: isFull ? '#9ca3af' : 'linear-gradient(135deg,#d63384,#c026d3)',
            animation: !isFull && !loading ? 'bookBlink 1.8s ease-in-out infinite' : 'none',
          }}
        >
          {loading ? '⏳ Processing...' : isFull ? 'Fully Booked' : 'Book Now →'}
        </button>
      </div>
    </div>
  )
})

export default function RoomTypesSection({ onBook, roomsState, onRoomUpdated }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  // Show "loading" hint after 5 seconds if cards still loading
  const [showWakeHint, setShowWakeHint] = useState(false)
  const [wakeSeconds, setWakeSeconds] = useState(0)
  const isLoading = !roomsState || Object.keys(roomsState).length === 0

  useEffect(() => {
    if (!isLoading) { setShowWakeHint(false); setWakeSeconds(0); return }
    const t = setTimeout(() => setShowWakeHint(true), 5000)
    return () => clearTimeout(t)
  }, [isLoading])

  // Count seconds while wake hint is showing
  useEffect(() => {
    if (!showWakeHint || !isLoading) return
    const t = setInterval(() => setWakeSeconds(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [showWakeHint, isLoading])

  return (
    <div className="w-full px-4 sm:px-6 pt-10 pb-14">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="mb-8">
          <span className="inline-block bg-pink-100 text-pink-600 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
            Accommodation
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Choose Your <span style={{ color: '#c026d3' }}>Room</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            All rooms include WiFi, CCTV, and daily housekeeping. No hidden charges.
          </p>
        </div>

        {/* Loading hint — shows if rooms take >5s (server cold start) */}
        {showWakeHint && isLoading && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl animate-spin">⏳</span>
              <div>
                <p className="text-sm font-bold text-amber-800">Server is waking up... ({wakeSeconds}s)</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Our free server sleeps when idle. It takes ~30–60 seconds to wake up. Please wait.
                </p>
              </div>
            </div>
            <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((wakeSeconds / 60) * 100, 95)}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SLUGS.map(slug => (
            <RoomCard
              key={slug}
              slug={slug}
              rt={roomsState[slug]}
              onBook={onBook}
              onRoomUpdated={onRoomUpdated}
              isAdmin={isAdmin}
            />
          ))}
        </div>

        {/* Special Offers Button */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                🎯 Special Offers & Packages
              </h3>
              <p className="text-gray-600 mb-6">
                Discover exclusive offers for CDAC students, degree students, and flexible stay options. 
                Save money with our special packages designed for your needs.
              </p>
              <button
                onClick={() => window.location.href = '/offers'}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
              >
                🎁 Explore Special Offers →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
