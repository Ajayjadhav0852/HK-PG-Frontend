import { useParams } from 'react-router-dom'
import { computeStats } from '../App'

const amenities = ['📶 WiFi', '❄️ AC', '🚿 Attached Bath', '🪑 Study Desk', '🗄️ Wardrobe', '🔋 Power Backup']

export default function RoomDetailPage({ rooms, onBook, onBack }) {
  const { typeKey } = useParams()
  const typeData = rooms[typeKey]
  const stats = computeStats(typeData)

  return (
    <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}>

      <div className="max-w-3xl mx-auto px-4 pt-5">
        <button onClick={onBack} className="flex items-center gap-2 text-pink-600 font-semibold text-sm hover:text-pink-800">
          ← Back
        </button>
      </div>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-4 mt-4">
        <div className="relative rounded-3xl overflow-hidden h-56 md:h-72 shadow-lg">
          <img src={typeData.image} alt={typeData.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-5">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${typeData.tagColor}`}>{typeData.tag}</span>
            <h1 className="text-white text-2xl font-extrabold mt-1">{typeData.title}</h1>
            <p className="text-white/80 text-sm">{typeData.desc}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Pricing + Book */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Monthly Rent</p>
            <p className="text-3xl font-extrabold" style={{ color: '#c026d3' }}>{typeData.price}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Security Deposit</p>
            <p className="text-xl font-bold text-gray-700">{typeData.deposit}</p>
          </div>
          <button
            onClick={() => onBook(typeData)}
            disabled={stats.vacantBeds === 0}
            className="px-8 py-3 rounded-xl font-extrabold text-white text-sm shadow-md hover:opacity-90 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
          >
            Book Now
          </button>
        </div>

        {/* Vacancy Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-extrabold text-gray-800 text-base mb-4">🏠 Vacancy Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Total Rooms" value={stats.totalRooms} color="text-gray-800" />
            <StatCard label="Vacant Rooms" value={stats.vacantRooms}
              color={stats.vacantRooms > 0 ? 'text-green-600' : 'text-red-500'} />
            <StatCard label="Total Beds" value={stats.totalBeds} color="text-gray-800" />
            <StatCard label="Vacant Beds" value={stats.vacantBeds}
              color={stats.vacantBeds > 0 ? 'text-green-600' : 'text-red-500'} />
          </div>
        </div>

        {/* Per-room bed grid */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-extrabold text-gray-800 text-base mb-4">🛏️ Room-wise Bed Status</h2>
          <div className="space-y-3">
            {typeData.rooms.map((r) => {
              const vacant = typeData.bedsPerRoom - r.occupiedBeds
              const isFull = vacant === 0
              return (
                <div key={r.id} className={`rounded-xl border px-4 py-3 transition-colors duration-500 ${isFull ? 'border-red-100 bg-red-50' : 'border-green-100 bg-green-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-gray-800 text-sm">Room {r.id}</span>
                      <span className="ml-2 text-xs text-gray-400">{r.floor}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full transition-colors duration-500 ${isFull ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                      {isFull ? '❌ Full' : `✅ ${vacant} bed${vacant > 1 ? 's' : ''} free`}
                    </span>
                  </div>
                  {/* Bed icons */}
                  <div className="flex gap-2">
                    {Array.from({ length: typeData.bedsPerRoom }).map((_, i) => (
                      <div key={i}
                        className={`flex-1 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors duration-500
                          ${i < r.occupiedBeds ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'}`}>
                        {i < r.occupiedBeds ? '🔴' : '🟢'}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-1.5 text-xs text-gray-500">
                    <span>🔴 Occupied: {r.occupiedBeds}</span>
                    <span>🟢 Vacant: {vacant}</span>
                  </div>
                </div>
              )
            })}
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
        {stats.vacantBeds > 0 ? (
          <button
            onClick={() => onBook(typeData)}
            className="w-full py-4 rounded-2xl font-extrabold text-white text-base shadow-lg hover:opacity-90 active:scale-95 transition"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
          >
            📋 Apply Now — {stats.vacantBeds} Bed{stats.vacantBeds > 1 ? 's' : ''} Available
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
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}
