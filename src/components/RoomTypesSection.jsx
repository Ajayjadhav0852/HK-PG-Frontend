import { useState, memo } from 'react'
import { useAuth } from '../context/AuthContext'
import { adminApi } from '../services/api'

const TAG_COLORS = {
  '1-sharing': 'bg-purple-100 text-purple-700',
  '2-sharing': 'bg-pink-100 text-pink-700',
  '3-sharing': 'bg-orange-100 text-orange-700',
  '4-sharing': 'bg-green-100 text-green-700',
}

const FALLBACK_IMAGES = {
  '1-sharing': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80',
  '2-sharing': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80',
  '3-sharing': 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80',
  '4-sharing': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80',
}

const SLUGS = ['1-sharing', '2-sharing', '3-sharing', '4-sharing']

const RoomCard = memo(function RoomCard({ slug, rt, onBook, onRoomUpdated, isAdmin }) {
  const [loading, setLoading] = useState(false)

  const fallback = FALLBACK_IMAGES[slug]
  const tagColor = TAG_COLORS[slug]
  const vacantBeds = rt?.vacantBeds ?? 0

  const handleBooking = async () => {
    if (loading) return
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
      await adminApi.updateRoom(slug, {
        monthlyPrice: Number(newPrice),
        imageUrl: newImage,
      })
      if (onRoomUpdated) await onRoomUpdated()
    } catch (e) {
      console.error(e)
      alert('Update failed')
    }
  }

  if (!rt) return null

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col relative">

      {/* Admin edit icon */}
      {isAdmin && (
        <button
          onClick={handleEdit}
          className="absolute top-2 right-2 z-20 bg-white/90 p-2 rounded-full shadow hover:scale-110"
        >
          ✏️
        </button>
      )}

      {/* Image */}
      <div className="relative h-44">
        <img src={rt.imageUrl || fallback} className="w-full h-full object-cover" />
        <span className={`absolute top-2 left-2 text-xs px-2 py-1 rounded ${tagColor}`}>
          {rt.tag}
        </span>
        <span className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded ${
          vacantBeds > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
        }`}>
          {vacantBeds > 0 ? `🟢 ${vacantBeds}` : 'Full'}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-bold">{rt.title}</h3>
        <p className="text-sm text-gray-500">{rt.description}</p>
        <p className="font-bold text-pink-600">
          ₹{Number(rt.monthlyPrice).toLocaleString('en-IN')}/mo
        </p>

        {/* Book Now — triggers form → API → saves to DB */}
        <button
          onClick={handleBooking}
          disabled={vacantBeds === 0 || loading}
          className="mt-2 py-2 rounded-xl text-white font-bold disabled:opacity-50 transition-opacity"
          style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)' }}
        >
          {loading ? 'Processing...' : (vacantBeds > 0 ? 'Book Now' : 'Full')}
        </button>
      </div>
    </div>
  )
})

export default function RoomTypesSection({ onBook, roomsState, onRoomUpdated }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <div className="w-full px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-6 text-pink-600">
          Choose Your Room
        </h2>
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
      </div>
    </div>
  )
}
