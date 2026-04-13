import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { roomApi } from '../services/api'
import { showToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'

const amenities = ['📶 WiFi', '❄️ AC', '🚿 Attached Bath', '🪑 Study Desk', '🗄️ Wardrobe', '🔋 Power Backup']

const TAG_COLORS = {
  '1-sharing': 'bg-purple-100 text-purple-700',
  '2-sharing': 'bg-pink-100 text-pink-700',
  '3-sharing': 'bg-orange-100 text-orange-700',
  '4-sharing': 'bg-green-100 text-green-700',
}

export default function RoomDetailPage({ onBook, onBack }) {
  const { typeKey } = useParams()
  const navigate    = useNavigate()
  const { user }    = useAuth()
  const [typeData, setTypeData] = useState(null)
  const [loading, setLoading]   = useState(true)
  const pollRef = useRef(null)

  // Guard: if not logged in, redirect to login with a clear message
  const handleBookClick = (roomData) => {
    if (!user) {
      showToast.warning(
        'Login Required',
        'Please login or create an account to book a room.'
      )
      navigate('/login')
      return
    }
    onBook(roomData)
  }

  const fetchRoom = useCallback(async (silent = false) => {
    try {
      const res = await roomApi.getBySlug(typeKey)
      setTypeData(res.data)
    } catch (e) {
      if (!silent) showToast.error('Failed to Load Room', e.message || 'Could not fetch room details.')
    } finally {
      setLoading(false)
    }
  }, [typeKey])

  useEffect(() => {
    setLoading(true)
    fetchRoom()
    // Poll every 10s for live bed status updates
    pollRef.current = setInterval(() => fetchRoom(true), 10000)
    return () => clearInterval(pollRef.current)
  }, [fetchRoom])

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3"
      style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}>
      <div className="w-10 h-10 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">Loading room details...</p>
    </div>
  )

  if (!typeData) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}>
      <div className="text-center">
        <p className="text-4xl mb-3">🏠</p>
        <p className="text-gray-500 font-semibold">Room not found.</p>
        <button onClick={onBack} className="mt-4 text-pink-600 text-sm font-semibold hover:underline">
          ← Back to Accommodation
        </button>
      </div>
    </div>
  )

  const tagColor = TAG_COLORS[typeKey] || 'bg-gray-100 text-gray-600'
  const occupancyPct = typeData.totalBeds > 0
    ? Math.round((typeData.occupiedBeds / typeData.totalBeds) * 100)
    : 0

  return (
    <div className="min-h-screen font-sans"
      style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}>

      <div className="max-w-3xl mx-auto px-4 pt-5">
        <button onClick={onBack}
          className="flex items-center gap-2 text-pink-600 font-semibold text-sm hover:text-pink-800 transition">
          ← Back to Accommodation
        </button>
      </div>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-4 mt-4">
        <div className="relative rounded-3xl overflow-hidden h-56 md:h-72 shadow-lg bg-gray-100">
          <img
            src={typeData.imageUrl}
            alt={typeData.title}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-5">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${tagColor}`}>{typeData.tag}</span>
            <h1 className="text-white text-2xl font-extrabold mt-1">{typeData.title}</h1>
            <p className="text-white/80 text-sm">{typeData.description}</p>
          </div>
          {/* Live indicator */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-700">Live</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Pricing + Book */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Monthly Rent</p>
            <p className="text-3xl font-extrabold" style={{ color: '#c026d3' }}>
              ₹{Number(typeData.monthlyPrice).toLocaleString('en-IN')}/mo
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Security Deposit</p>
            <p className="text-xl font-bold text-gray-700">
              ₹{Number(typeData.securityDeposit).toLocaleString('en-IN')}
            </p>
          </div>
          <button
            onClick={() => handleBookClick(typeData)}
            disabled={typeData.vacantBeds === 0}
            className="px-8 py-3 rounded-xl font-extrabold text-white text-sm shadow-md hover:opacity-90 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
          >
            {typeData.vacantBeds === 0 ? '❌ Fully Booked' : '📋 Book Now'}
          </button>
        </div>

        {/* Live Vacancy Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-gray-800 text-base">🏠 Live Vacancy</h2>
            <span className="text-xs text-gray-400">Updates every 10s</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <StatCard label="Total Rooms"  value={typeData.totalRooms}  color="text-gray-800" />
            <StatCard label="Vacant Rooms" value={typeData.vacantRooms}
              color={typeData.vacantRooms > 0 ? 'text-green-600' : 'text-red-500'} />
            <StatCard label="Total Beds"   value={typeData.totalBeds}   color="text-gray-800" />
            <StatCard label="Vacant Beds"  value={typeData.vacantBeds}
              color={typeData.vacantBeds > 0 ? 'text-green-600' : 'text-red-500'} />
          </div>

          {/* Occupancy progress bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{typeData.occupiedBeds} beds occupied</span>
              <span>{occupancyPct}% full</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  occupancyPct >= 90 ? 'bg-red-500' :
                  occupancyPct >= 60 ? 'bg-orange-400' : 'bg-green-500'
                }`}
                style={{ width: `${occupancyPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Per-room bed grid */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-extrabold text-gray-800 text-base mb-4">🛏️ Room-wise Bed Status</h2>
          <div className="space-y-3">
            {(typeData.rooms || []).map(r => (
              <div key={r.id}
                className={`rounded-xl border px-4 py-3 transition-all duration-500 ${
                  r.full ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold text-gray-800 text-sm">Room {r.roomNumber}</span>
                    <span className="ml-2 text-xs text-gray-400">{r.floor}</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full transition-all duration-500 ${
                    r.full ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                  }`}>
                    {r.full ? '❌ Full' : `✅ ${r.vacantBeds} bed${r.vacantBeds > 1 ? 's' : ''} free`}
                  </span>
                </div>

                {/* Bed icons — animate on change */}
                <div className="flex gap-2">
                  {Array.from({ length: r.bedsPerRoom }).map((_, i) => (
                    <div key={i}
                      className={`flex-1 h-9 rounded-lg flex items-center justify-center text-base font-bold transition-all duration-500 ${
                        i < r.occupiedBeds
                          ? 'bg-red-200 text-red-700 scale-95'
                          : 'bg-green-200 text-green-700'
                      }`}>
                      {i < r.occupiedBeds ? '🔴' : '🟢'}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>🔴 Occupied: <strong>{r.occupiedBeds}</strong></span>
                  <span>🟢 Vacant: <strong>{r.vacantBeds}</strong></span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">🟢 Green = Available &nbsp;|&nbsp; 🔴 Red = Occupied</p>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-extrabold text-gray-800 text-base mb-3">✨ Room Amenities</h2>
          <div className="grid grid-cols-3 gap-2">
            {amenities.map(a => (
              <span key={a} className="bg-pink-50 text-pink-700 text-xs font-semibold px-3 py-2 rounded-xl text-center">{a}</span>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        {typeData.vacantBeds > 0 ? (
          <button
            onClick={() => handleBookClick(typeData)}
            className="w-full py-4 rounded-2xl font-extrabold text-white text-base shadow-lg hover:opacity-90 active:scale-95 transition"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
          >
            {user
              ? `📋 Apply Now — ${typeData.vacantBeds} Bed${typeData.vacantBeds > 1 ? 's' : ''} Available`
              : '🔐 Login to Book Now'
            }
          </button>
        ) : (
          <div className="w-full py-4 rounded-2xl font-extrabold text-center text-red-500 bg-red-50 border border-red-200 text-base">
            ❌ All beds are currently occupied. Please check back later.
          </div>
        )}

      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
      <p className={`text-3xl font-extrabold transition-all duration-500 ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
    </div>
  )
}
