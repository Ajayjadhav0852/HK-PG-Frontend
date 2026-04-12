const nearby = [
  { icon: '🏢', label: 'Wipro Campus', dist: '0.5 km' },
  { icon: '🎓', label: 'Christ University', dist: '1.2 km' },
  { icon: '🏥', label: 'Apollo Hospital', dist: '2 km' },
  { icon: '🛒', label: 'Forum Mall', dist: '1.8 km' },
]

export default function LocationInfo() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-bold text-gray-800 mb-3">📍 Location</h2>
      <p className="text-gray-600 text-sm mb-4">
        #42, 5th Cross, Koramangala 4th Block, Bangalore – 560034
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {nearby.map((n) => (
          <div key={n.label} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
            <span className="text-xl">{n.icon}</span>
            <div>
              <p className="text-xs font-semibold text-gray-700">{n.label}</p>
              <p className="text-xs text-gray-400">{n.dist}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Google Map Embed */}
      <div className="rounded-xl overflow-hidden border border-gray-200">
        <iframe
          title="PG Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5965!2d77.6245!3d12.9352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU2JzA2LjciTiA3N8KwMzcnMjguMiJF!5e0!3m2!1sen!2sin!4v1234567890"
          width="100%"
          height="180"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        />
      </div>
    </div>
  )
}
