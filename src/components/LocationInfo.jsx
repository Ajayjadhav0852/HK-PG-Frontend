// Official SVG icons
const TrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="4" y="3" width="16" height="16" rx="2"/>
    <path d="M4 11h16M12 3v8M8 19l-2 2M16 19l2 2M8 15h.01M16 15h.01"/>
  </svg>
)

const CollegeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
)

const HospitalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
)

const TempleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

const nearby = [
  { icon: <TrainIcon />, label: 'Akurdi Railway Station', dist: '50 m (doorstep)', color: 'text-blue-600' },
  { icon: <CollegeIcon />, label: 'IACSD CDAC', dist: '500 m', color: 'text-purple-600' },
  { icon: <CollegeIcon />, label: 'DY Patil College', dist: '500 m', color: 'text-green-600' },
  { icon: <CollegeIcon />, label: 'PCCOE College', dist: '500 m', color: 'text-green-600' },
  { icon: <CollegeIcon />, label: 'PCET College', dist: '600 m', color: 'text-green-600' },
  { icon: <HospitalIcon />, label: 'Aditya Birla Hospital', dist: '3 km', color: 'text-red-600' },
  { icon: <TempleIcon />, label: 'ISKCON Govinddham', dist: '0.6 km', color: 'text-orange-600' },
]

export default function LocationInfo() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">

      {/* Title */}
      <div className="flex items-center gap-2 mb-3">
        <MapPinIcon />
        <h2 className="text-lg font-bold text-gray-800">Location</h2>
      </div>

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
            <span className={n.color}>{n.icon}</span>
            <div>
              <p className="text-xs font-semibold text-gray-700">{n.label}</p>
              <p className="text-xs text-gray-400">{n.dist}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Google Map */}
      <div className="rounded-xl overflow-hidden border border-gray-200">
        <iframe
          title="HK PG Location — Akurdi"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15121.420715184955!2d73.75955285!3d18.6480511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9a15aeef455%3A0x628744913d7ac898!2sHK%20PG%20AKURDI%20-%20Boys%20Accommodation!5e0!3m2!1sen!2sin!4v1776771490124!5m2!1sen!2sin"
          width="100%"
          height="200"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
        </svg>
        Open in Google Maps
      </a>

    </div>
  )
}
