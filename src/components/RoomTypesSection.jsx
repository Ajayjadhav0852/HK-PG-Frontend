import { computeStats } from '../App'

const ROOM_CARDS = [
  {
    key: '1-sharing',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80',
    title: '1 Sharing — Private',
    desc: 'Your own private space with attached bathroom, study desk, and wardrobe. Maximum privacy and comfort.',
    price: '₹8,500/mo',
    tag: 'Most Private',
    tagColor: 'bg-purple-100 text-purple-600',
  },
  {
    key: '2-sharing',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80',
    title: '2 Sharing — Popular',
    desc: 'Share with one roommate. Spacious room with individual storage, AC, and great natural light.',
    price: '₹6,000/mo',
    tag: 'Most Popular',
    tagColor: 'bg-pink-100 text-pink-600',
  },
  {
    key: '3-sharing',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80',
    title: '3 Sharing',
    desc: 'Affordable triple-sharing with personal lockers, ceiling fans, and a friendly community vibe.',
    price: '₹5,000/mo',
    tag: 'Affordable',
    tagColor: 'bg-orange-100 text-orange-600',
  },
  {
    key: '4-sharing',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80',
    title: '4 Sharing — Budget',
    desc: 'Most economical option. Great for students who want to save while enjoying all HKPG amenities.',
    price: '₹4,000/mo',
    tag: 'Best Value',
    tagColor: 'bg-green-100 text-green-600',
  },
]

export default function RoomTypesSection({ onBook, roomsState }) {
  return (
    <div
      className="w-full px-6 py-12"
      style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}
    >
      <div className="max-w-5xl mx-auto">

        <span className="inline-block bg-pink-100 text-pink-600 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
          Accommodation
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: '#c026d3' }}>
          Choose Your Room Type
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          From private single rooms to budget-friendly quad sharing — HKPG has a space for every lifestyle and budget.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ROOM_CARDS.map((room) => {
            const stats = computeStats(roomsState[room.key])
            return (
              <div
                key={room.key}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer group"
                onClick={() => onBook(room.key)}
              >
                <div className="relative overflow-hidden h-44">
                  <img
                    src={room.image}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full ${room.tagColor}`}>
                    {room.tag}
                  </span>
                  <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full ${stats.vacantBeds > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {stats.vacantBeds > 0 ? `🟢 ${stats.vacantBeds} free` : '🔴 Full'}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-1 gap-2">
                  <h3 className="font-bold text-gray-800 text-base">{room.title}</h3>
                  <p className="text-gray-500 text-sm flex-1">{room.desc}</p>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>🏠 {stats.vacantRooms}/{stats.totalRooms} rooms</span>
                    <span>🛏️ {stats.vacantBeds}/{stats.totalBeds} beds</span>
                  </div>
                  <p className="text-lg font-extrabold" style={{ color: '#c026d3' }}>{room.price}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); onBook(room.key) }}
                    className="mt-1 w-full py-2.5 rounded-xl font-bold text-sm text-white transition hover:opacity-90 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
