import { useState, memo } from 'react'
import { useAuth } from '../context/AuthContext'
import { showToast } from './Toast'
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

// ✅ Memoized card (VERY IMPORTANT - prevents re-render)
const RoomCard = memo(function RoomCard({ slug, rt, isAdmin, onBook, setEditing }) {
  const fallback = FALLBACK_IMAGES[slug]
  const tagColor = TAG_COLORS[slug]

  const vacantBeds = rt?.vacantBeds ?? 0
  const totalBeds = rt?.totalBeds ?? 0
  const vacantRooms = rt?.vacantRooms ?? 0
  const totalRooms = rt?.totalRooms ?? 0

  if (!rt) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
        <div className="h-44 bg-gray-200" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col group">

      {/* Image */}
      <div className="relative h-44 bg-gray-100">
        <img
          src={rt.imageUrl || fallback}
          alt={rt.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={e => (e.target.src = fallback)}
        />

        <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full ${tagColor}`}>
          {rt.tag}
        </span>

        <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full ${
          vacantBeds > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
        }`}>
          {vacantBeds > 0 ? `🟢 ${vacantBeds}` : 'Full'}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-bold text-gray-800">{rt.title}</h3>

        <p className="text-gray-500 text-sm line-clamp-2">
          {rt.description}
        </p>

        <div className="flex justify-between text-xs text-gray-400">
          <span>{vacantRooms}/{totalRooms} rooms</span>
          <span>{vacantBeds}/{totalBeds} beds</span>
        </div>

        <p className="text-lg font-extrabold text-pink-600">
          ₹{Number(rt.monthlyPrice).toLocaleString('en-IN')}/mo
        </p>

        <button
          onClick={() => onBook(slug)}
          className="mt-1 w-full py-2 rounded-xl text-white font-bold"
          style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)' }}
        >
          {vacantBeds > 0 ? 'Book Now' : 'View'}
        </button>
      </div>
    </div>
  )
})

export default function RoomTypesSection({ onBook, roomsState, onRoomUpdated }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [editing, setEditing] = useState(null)

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
              isAdmin={isAdmin}
              onBook={onBook}
              setEditing={setEditing}
            />
          ))}

        </div>
      </div>
    </div>
  )
}