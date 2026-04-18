const reviews = [
  {
    name: 'Rahul S.',
    rating: 5,
    text: 'Great place! Clean rooms, excellent facilities, and very cooperative staff. Highly recommend.',
    date: 'March 2026',
  },
  {
    name: 'Arjun M.',
    rating: 4,
    text: 'Good location, near IT park. WiFi is fast. Zero maintenance charges. Value for money.',
    date: 'Feb 2026',
  },
  {
    name: 'Kiran P.',
    rating: 5,
    text: 'Been staying for 8 months. No hidden charges, very transparent management.',
    date: 'Jan 2026',
  },
]

export default function Reviews() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-bold text-gray-800">⭐ Reviews</h2>
        <span className="bg-yellow-100 text-yellow-700 text-sm font-bold px-3 py-1 rounded-full">
          4.5 / 5
        </span>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.name} className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-800 text-sm">{r.name}</span>
              <span className="text-xs text-gray-400">{r.date}</span>
            </div>
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < r.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
              ))}
            </div>
            <p className="text-sm text-gray-600">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
