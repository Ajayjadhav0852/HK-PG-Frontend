import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { roomApi } from '../services/api'
import { showToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'

const AMENITIES = [
  { icon: '📶', label: 'High-Speed WiFi' },
  { icon: '❄️', label: 'AC Room' },
  { icon: '🚿', label: 'Attached Bath' },
  { icon: '🪑', label: 'Study Desk' },
  { icon: '🗄️', label: 'Wardrobe' },
  { icon: '🔋', label: 'Power Backup' },
  { icon: '🍽️', label: 'Food Included' },
  { icon: '📹', label: '24/7 CCTV' },
  { icon: '👕', label: 'Washing Machine' },
  { icon: '🧹', label: 'Housekeeping' },
]

const TAG_COLORS = {
  '1-sharing': 'bg-purple-100 text-purple-700',
  '2-sharing': 'bg-pink-100 text-pink-700',
  '3-sharing': 'bg-orange-100 text-orange-700',
  '4-sharing': 'bg-green-100 text-green-700',
}

const FALLBACK_IMAGES = {
  '1-sharing': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  '2-sharing': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
  '3-sharing': 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
  '4-sharing': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
}

function optimizeImage(url) {
  if (!url || !url.includes('res.cloudinary.com')) return url
  return url.replace('/upload/', '/upload/w_1000,q_auto,f_auto/')
}

export default function RoomDetailPage({ onBook, onBack }) {
  const { typeKey } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [typeData, setTypeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const fetchedRef = useRef(false)

  const fetchRoom = useCallback(async () => {
    try {
      const res = await roomApi.getBySlug(typeKey)
      setTypeData(res.data)
    } catch (e) {
      showToast.error('Failed to Load Room', e.message || 'Could not fetch room details.')
    } finally {
      setLoading(false)
    }
  }, [typeKey])

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    setLoading(true)
    fetchRoom()
  }, [fetchRoom])

  const handleBookClick = useCallback(() => {
    if (!user) {
      showToast.warning('Login Required', 'Please login to book a room.')
      navigate('/login')
      return
    }
    onBook(typeData)
  }, [user, navigate, onBook, typeData])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg,#fff0f6 0%,#fdf3e7 60%,#fff8f0 100%)' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
        <p className="text-xs text-gray-400">Loading room details...</p>
      </div>
    </div>
  )

  if (!typeData) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg,#fff0f6 0%,#fdf3e7 60%,#fff8f0 100%)' }}>
      <div className="text-center">
        <p className="text-5xl mb-3">🏠</p>
        <p className="text-gray-500 font-semibold">Room not found.</p>
        <button onClick={onBack} className="mt-4 text-pink-600 font-bold text-sm hover:underline">
          ← Back to Rooms
        </button>
      </div>
    </div>
  )

  const tagColor = TAG_COLORS[typeKey] || 'bg-gray-100 text-gray-600'
  const fallback = FALLBACK_IMAGES[typeKey] || FALLBACK_IMAGES['3-sharing']
  const occupancyPct = typeData.totalBeds > 0
    ? Math.round((typeData.occupiedBeds / typeData.totalBeds) * 100)
    : 0
  const isFull = typeData.vacantBeds === 0

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#fff0f6 0%,#fdf3e7 60%,#fff8f0 100%)' }}>

      {/* Back button */}
      <div className="max-w-3xl mx-auto px-4 pt-5">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-pink-600 text-sm font-semibold hover:text-pink-800 transition">
          ← Back to Rooms
        </button>
      </div>

      {/* Hero image */}
      <div className="max-w-3xl mx-auto px-4 mt-4">
        <div className="relative rounded-3xl overflow-hidden h-60 md:h-80 bg-gray-100 shadow-md">
          <img
            src={optimizeImage(typeData.imageUrl) || fallback}
            alt={typeData.title}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
            onError={e => { e.target.src = fallback }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Tag */}
          <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full ${tagColor}`}>
            {typeData.tag}
          </span>

          {/* Vacancy */}
          <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full shadow ${
            isFull ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}>
            {isFull ? '🔴 Fully Booked' : `🟢 ${typeData.vacantBeds} Beds Available`}
          </span>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl font-extrabold text-white">{typeData.title}</h1>
            <p className="text-white/80 text-sm mt-0.5">HK PG Boys Accommodation · Akurdi, Pune</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        {/* Price + Book */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 font-medium">Monthly Rent</p>
            <p className="text-3xl font-extrabold" style={{ color: '#c026d3' }}>
              ₹{Number(typeData.monthlyPrice).toLocaleString('en-IN')}
              <span className="text-sm font-semibold text-gray-400">/mo</span>
            </p>
            {typeData.securityDeposit > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">
                + ₹{Number(typeData.securityDeposit).toLocaleString('en-IN')} refundable deposit
              </p>
            )}
          </div>
          <button
            onClick={handleBookClick}
            disabled={isFull}
            aria-label={isFull ? 'Room fully booked' : 'Book this room'}
            className="px-7 py-3 rounded-xl text-white font-extrabold text-sm transition hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            style={{ background: isFull ? '#9ca3af' : 'linear-gradient(135deg,#d63384,#c026d3)' }}
          >
            {isFull ? 'Fully Booked' : 'Book Now →'}
          </button>
        </div>

        {/* Description */}
        {typeData.description && (
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-extrabold text-gray-800 text-base mb-2">About this room</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{typeData.description}</p>
          </div>
        )}

        {/* Occupancy stats */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-extrabold text-gray-800 text-base mb-3">Availability</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Total Beds',    value: typeData.totalBeds,    color: 'text-gray-800' },
              { label: 'Occupied',      value: typeData.occupiedBeds, color: 'text-red-500' },
              { label: 'Available',     value: typeData.vacantBeds,   color: 'text-green-600' },
            ].map(s => (
              <div key={s.label} className="text-center bg-gray-50 rounded-xl py-3">
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${occupancyPct}%`,
                background: occupancyPct >= 90
                  ? '#ef4444'
                  : 'linear-gradient(90deg, #d63384, #c026d3)',
              }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-right">{occupancyPct}% occupied</p>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-extrabold text-gray-800 text-base mb-4">What's included</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {AMENITIES.map(a => (
              <div key={a.label}
                className="flex flex-col items-center gap-1.5 bg-pink-50 rounded-xl py-3 px-2 text-center">
                <span className="text-2xl">{a.icon}</span>
                <span className="text-xs text-gray-600 font-semibold">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing breakdown */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-extrabold text-gray-800 text-base mb-3">Pricing Breakdown</h2>
          <div className="space-y-2">
            {[
              { label: 'Monthly Rent',      value: `₹${Number(typeData.monthlyPrice).toLocaleString('en-IN')}` },
              { label: 'Security Deposit',  value: typeData.securityDeposit > 0 ? `₹${Number(typeData.securityDeposit).toLocaleString('en-IN')} (refundable)` : 'N/A' },
              { label: 'Food',              value: 'Included ✅' },
              { label: 'Electricity',       value: 'Included (fair use) ✅' },
              { label: 'WiFi',              value: 'Included ✅' },
              { label: 'Hidden Charges',    value: 'None 🎉', highlight: true },
            ].map(p => (
              <div key={p.label}
                className={`flex justify-between items-center px-4 py-2.5 rounded-xl text-sm ${
                  p.highlight ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}>
                <span className="text-gray-600">{p.label}</span>
                <span className={`font-semibold ${p.highlight ? 'text-green-600' : 'text-gray-800'}`}>
                  {p.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-extrabold text-gray-800 text-base mb-3">House Rules</h2>
          <div className="space-y-2">
            {[
              { icon: '🕙', text: 'Entry timing: 6 AM – 10:30 PM' },
              { icon: '👥', text: 'Visitors in common area only (till 9 PM)' },
              { icon: '🚭', text: 'No smoking or drinking on premises' },
              { icon: '📅', text: '30-day notice period before vacating' },
              { icon: '🔇', text: 'No loud music after 10 PM' },
              { icon: '🧹', text: 'Keep your room clean' },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
                <span className="text-lg">{r.icon}</span>
                <span className="text-sm text-gray-700">{r.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-extrabold text-gray-800 text-base mb-3">Contact Owner</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href="tel:9579828996"
              className="flex items-center gap-3 bg-pink-50 rounded-xl px-4 py-3 hover:bg-pink-100 transition">
              <span className="text-xl">📞</span>
              <div>
                <p className="text-xs text-gray-400">Owner Direct</p>
                <p className="font-bold text-gray-800 text-sm">9579828996</p>
              </div>
            </a>
            <a href="https://wa.me/919579828996" target="_blank" rel="noreferrer"
              className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-3 hover:bg-green-100 transition">
              <span className="text-xl">💬</span>
              <div>
                <p className="text-xs text-gray-400">WhatsApp</p>
                <p className="font-bold text-gray-800 text-sm">Chat with Owner</p>
              </div>
            </a>
          </div>
        </div>

        {/* Sticky bottom CTA on mobile */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-2xl z-40">
          <button
            onClick={handleBookClick}
            disabled={isFull}
            className="w-full py-3.5 rounded-xl text-white font-extrabold text-sm transition hover:opacity-90 active:scale-95 disabled:opacity-50 shadow-md"
            style={{ background: isFull ? '#9ca3af' : 'linear-gradient(135deg,#d63384,#c026d3)' }}
          >
            {isFull ? 'Fully Booked' : `Book Now · ₹${Number(typeData.monthlyPrice).toLocaleString('en-IN')}/mo →`}
          </button>
        </div>
        {/* Spacer for sticky CTA on mobile */}
        <div className="sm:hidden h-20" />

      </div>
    </div>
  )
}
