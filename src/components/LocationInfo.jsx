const nearby = [
  { icon: '🚉', label: 'Akurdi Railway Station', dist: '50 m (doorstep)' },
  { icon: '🎓', label: 'DY Patil College', dist: ' 500 m' },
  { icon: '🎓', label: 'PCCOE College', dist: '500m' },
  { icon: '🎓', label: 'PCET College', dist: '600 m' },
  { icon: '🏥', label: 'Aditya Birla Hospital', dist: ' 3 km' },
  { icon: '🛕', label: 'ISKCON Govinddham', dist: '0.6 km' },
]

export default function LocationInfo() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">

      {/* Title */}
      <h2 className="text-lg font-bold text-gray-800 mb-1">📍 Location</h2>

      {/* Address */}
      <p className="text-gray-600 text-sm mb-1 font-semibold">
        HK PG Boys Accommodation
      </p>

      <p className="text-gray-500 text-xs mb-4">
        Gurudwara, Near Akurdi Railway Station, Akurdi, Pimpri-Chinchwad – 411033, Maharashtra
      </p>

      {/* Nearby */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {nearby.map(n => (
          <div key={n.label} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
            <span className="text-xl">{n.icon}</span>
            <div>
              <p className="text-xs font-semibold text-gray-700">{n.label}</p>
              <p className="text-xs text-gray-400">{n.dist}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Google Map (Embed updated cleaner version) */}
      <div className="rounded-xl overflow-hidden border border-gray-200">
        <iframe
          title="HK PG Location — Akurdi"
          src="https://www.google.com/maps?q=Akurdi%20Railway%20Station%20Pune&output=embed"
          width="100%"
          height="200"
          style={{ border: 0 }}
          loading="lazy"
        />
      </div>

      {/* Open Maps Button */}
      <a
        href="https://maps.app.goo.gl/sYfK8BevYhZETWFi8"
        target="_blank"
        rel="noreferrer"
        className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
      >
        🗺️ Open in Google Maps
      </a>

    </div>
  )
}