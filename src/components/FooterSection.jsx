import { useNavigate } from 'react-router-dom'

const quickLinks = [
  { label: 'Home',            path: '/' },
  { label: 'Room Types',      path: '/accommodation' },
  { label: 'Facilities',      path: '/facilities' },
  { label: 'Testimonials',    path: '/testimonials' },
  { label: 'Rules & Policies',path: '/contact' },
  { label: 'Contact Us',      path: '/contact' },
]

const facilities = [
  '📶 High-Speed WiFi',
  '📹 24/7 CCTV Security',
  '👕 Washing Machine',
  '💧 RO Water Purifier',
  '🏍️ Two Wheeler Parking',
  '🧹 Daily Housekeeping',
  '🏠 1–4 Sharing Rooms',
]

const socialLinks = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/919579828996',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.198-1.448A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.214-3.68.859.875-3.593-.234-.369A9.818 9.818 0 1 1 12 21.818z"/>
      </svg>
    ),
    bg: 'bg-green-500 hover:bg-green-600',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/hkpg.akurdi?igsh=MTBseTFmMDU2NHpidg==',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
    bg: 'bg-gradient-to-br from-pink-500 to-purple-600 hover:opacity-90',
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
    bg: 'bg-blue-600 hover:bg-blue-700',
  },
]

export default function FooterSection() {
  const navigate = useNavigate()
  return (
    <footer style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800">HK PG</h2>
            <p className="text-xs font-bold tracking-widest uppercase mt-0.5" style={{ color: '#c026d3' }}>
              Boys Accommodation
            </p>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            A safe, comfortable, and community-driven home for students and young professionals near Akurdi Railway Station, Pune.
          </p>
          <div className="flex gap-2 pt-1">
            {socialLinks.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-white transition ${s.bg}`}
                title={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest mb-4" style={{ color: '#c026d3' }}>
            Quick Links
          </h3>
          <ul className="space-y-2">
            {quickLinks.map(l => (
              <li key={l.label}>
                <button onClick={() => { navigate(l.path); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  className="text-gray-500 hover:text-gray-800 text-sm transition flex items-center gap-2">
                  <span style={{ color: '#c026d3' }}>›</span> {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Facilities */}
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest mb-4" style={{ color: '#c026d3' }}>
            Facilities
          </h3>
          <ul className="space-y-2">
            {facilities.map(f => (
              <li key={f} className="text-gray-600 text-sm">{f}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest mb-4" style={{ color: '#c026d3' }}>
            Contact Us
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>📍 Near Gurudwara, Akurdi Rly St., Pune – 411035</li>
            <li>
              <a href="tel:9579828996" className="hover:text-pink-600 transition">
                📞 9579828996 — Owner(PG Management)
              </a>
            </li>
             <li>
              <a href="tel:9022481019" className="hover:text-pink-600 transition">
                📞 9022481019 — Team (PG management)
              </a>
            </li>
            <li>
              <a href="tel:9096398032" className="hover:text-pink-600 transition">
                📞 9096398032 — Owner
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-pink-100 px-6 py-4">
        <p className="text-center text-xs text-gray-400">
          © 2026 HK PG Boys Accommodation · Akurdi, Pune · All rights reserved · No Brokerage · Contact Owner Directly
        </p>
      </div>

    </footer>
  )
}
