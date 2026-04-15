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

// ✅ image optimization
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

  // ✅ ONLY ONE API CALL
  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    setLoading(true)
    fetchRoom()
  }, [fetchRoom])

  const handleBookClick = useCallback((roomData) => {
    if (!user) {
      showToast.warning('Login Required', 'Please login to book a room.')
      navigate('/login')
      return
    }
    onBook(roomData)
  }, [user, navigate, onBook])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
    </div>
  )

  if (!typeData) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Room not found.</p>
    </div>
  )

  const tagColor = TAG_COLORS[typeKey] || 'bg-gray-100 text-gray-600'
  const occupancyPct = typeData.totalBeds > 0
    ? Math.round((typeData.occupiedBeds / typeData.totalBeds) * 100)
    : 0

  return (
    <div className="min-h-screen">

      <div className="max-w-3xl mx-auto px-4 pt-5">
        <button onClick={onBack} className="text-pink-600 text-sm font-semibold">
          ← Back
        </button>
      </div>

      {/* HERO */}
      <div className="max-w-3xl mx-auto px-4 mt-4">
        <div className="relative rounded-3xl overflow-hidden h-56 md:h-72 bg-gray-100">

          <img
            src={optimizeImage(typeData.imageUrl)}
            alt={typeData.title}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80' }}
          />

        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* PRICE */}
        <div className="bg-white p-5 rounded-2xl flex justify-between">
          <p className="text-2xl font-bold text-pink-600">
            ₹{Number(typeData.monthlyPrice).toLocaleString('en-IN')}
          </p>

          <button
            onClick={() => handleBookClick(typeData)}
            className="px-6 py-2 rounded-xl text-white"
            style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)' }}
          >
            Book
          </button>
        </div>

        {/* STATS */}
        <div className="bg-white p-5 rounded-2xl">
          <p>Vacant Beds: {typeData.vacantBeds}</p>
          <p>Total Beds: {typeData.totalBeds}</p>

          <div className="h-3 bg-gray-200 rounded mt-2">
            <div
              className="h-full bg-green-500"
              style={{ width: `${occupancyPct}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}