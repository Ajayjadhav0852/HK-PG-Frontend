const nearby = [
  { icon: '🚉', label: 'Akurdi Railway Station', dist: '0.3 km' },
  { icon: '🎓', label: 'PCET College',            dist: '0.8 km' },
  { icon: '🏥', label: 'Aditya Birla Hospital',   dist: '2.5 km' },
  { icon: '🛒', label: 'D-Mart Akurdi',           dist: '1.2 km' },
  { icon: '🏢', label: 'Pimpri-Chinchwad MIDC',   dist: '3 km'   },
  { icon: '🚌', label: 'Akurdi Bus Stand',         dist: '0.4 km' },
]

export default function LocationInfo() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-bold text-gray-800 mb-1">📍 Location</h2>
      <p className="text-gray-600 text-sm mb-1 font-semibold">HK PG Boys Accommodation</p>
      <p className="text-gray-500 text-xs mb-4">
        Near Gurudwara, Akurdi Railway Station, Akurdi, Pune – 411035, Maharashtra
      </p>

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

      {/* Google Maps — Akurdi, Pune */}
      <div className="rounded-xl overflow-hidden border border-gray-200">
        <iframe
          title="HK PG Location — Akurdi, Pune"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.0!2d73.7600!3d18.6480!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9e760000001%3A0x1!2sAkurdi%2C+Pune%2C+Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000"
          width="100%"
          height="200"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <a
        href="https://maps.google.com/?q=Akurdi+Railway+Station+Pune"
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
