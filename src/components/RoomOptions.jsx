const rooms = [
  {
    type: 'Single Occupancy',
    price: 8500,
    available: 3,
    bathroom: true,
    furnishing: ['Bed', 'Cupboard', 'Table', 'Chair'],
    tag: 'Most Popular',
    tagColor: 'bg-orange-100 text-orange-600',
  },
  {
    type: 'Double Sharing',
    price: 5500,
    available: 2,
    bathroom: true,
    furnishing: ['Bed', 'Cupboard', 'Table'],
    tag: 'Best Value',
    tagColor: 'bg-green-100 text-green-600',
  },
  {
    type: 'Triple Sharing',
    price: 4000,
    available: 0,
    bathroom: false,
    furnishing: ['Bed', 'Cupboard'],
    tag: 'Budget',
    tagColor: 'bg-blue-100 text-blue-600',
  },
]

export default function RoomOptions({ onBook }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-bold text-gray-800 mb-4">🛏️ Room Options</h2>
      <div className="space-y-4">
        {rooms.map((room) => (
          <div
            key={room.type}
            className={`border rounded-2xl p-4 ${room.available === 0 ? 'opacity-60 border-gray-200' : 'border-blue-100'}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${room.tagColor}`}>
                  {room.tag}
                </span>
                <h3 className="font-bold text-gray-800 mt-1">{room.type}</h3>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">₹{room.price.toLocaleString()}</p>
                <p className="text-xs text-gray-400">per bed/month</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
              <span className={`px-2 py-1 rounded-lg ${room.available > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {room.available > 0 ? `✅ ${room.available} beds left` : '❌ Full'}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded-lg">
                🚿 {room.bathroom ? 'Attached Bath' : 'Common Bath'}
              </span>
              {room.furnishing.map((f) => (
                <span key={f} className="bg-gray-100 px-2 py-1 rounded-lg">{f}</span>
              ))}
            </div>

            <button
              onClick={() => room.available > 0 && onBook()}
              disabled={room.available === 0}
              className={`w-full py-2.5 rounded-xl font-semibold text-sm transition ${
                room.available > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {room.available > 0 ? 'Book Now' : 'Not Available'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
