import { useNavigate } from 'react-router-dom'

const quickLinks = [
  { label: 'Home',                path: '/' },
  { label: 'Room Types',          path: '/accommodation' },
  { label: 'Facilities',          path: '/facilities' },
  { label: 'Gallery',             path: '/gallery' },
  { label: 'Special Offers',      path: '/offers' },
  { label: 'Rules & Regulations', path: '/rules-and-regulations' },
  { label: 'Testimonials',        path: '/testimonials' },
  { label: 'Contact Us',          path: '/contact' },
]

// Official brand SVGs
const socialLinks = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/919579828996',
    bg: '#25d366',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.198-1.448A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.214-3.68.859.875-3.593-.234-.369A9.818 9.818 0 1 1 12 21.818z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/hkpg.akurdi?igsh=MTBseTFmMDU2NHpidg==',
    bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    bg: '#1877f2',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
]

export default function FooterSection() {
  const navigate = useNavigate()

  return (
    <footer>
      {/* ── Top wave divider ─────────────────────────────────────────────── */}
      <div style={{ lineHeight: 0, background: 'linear-gradient(135deg,#fff0f6 0%,#fdf3e7 60%,#fff8f0 100%)' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 60 }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="#1a0533" />
        </svg>
      </div>

      {/* ── Main footer body ─────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg,#1a0533 0%,#2d0a5e 50%,#1a0533 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1 space-y-5">
            <div>
              <h2 style={{ color: 'white', fontWeight: 900, fontSize: 24, margin: 0 }}>HK PG</h2>
              <p style={{ color: '#c084fc', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>
                Boys Accommodation
              </p>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.7 }}>
              A safe, comfortable, and community-driven home for students and young professionals near Akurdi Railway Station, Pune.
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              {socialLinks.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  title={s.label}
                  style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: s.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.2s ease, opacity 0.2s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.opacity = '0.9' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.opacity = '1' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
            {/* No brokerage badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(192,38,211,0.15)',
              border: '1px solid rgba(192,38,211,0.3)',
              borderRadius: 100, padding: '5px 12px',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span style={{ color: '#c084fc', fontSize: 11, fontWeight: 700 }}>Zero Brokerage</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ color: '#f472b6', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {quickLinks.map(l => (
                <li key={l.label}>
                  <button
                    onClick={() => { navigate(l.path); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'rgba(255,255,255,0.55)', fontSize: 13,
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: 0, transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f472b6'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                  >
                    <span style={{ color: '#c026d3', fontSize: 16, lineHeight: 1 }}>›</span>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h3 style={{ color: '#f472b6', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>
              Contact Us
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Address */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  background: 'rgba(192,38,211,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                  Near Gurudwara, Akurdi Railway Station,<br />Pune – 411035, Maharashtra
                </p>
              </div>

              {/* Phones */}
              {[
                { num: '9579828996', label: 'Owner (PG Management)' },
                { num: '9022481019', label: 'Team (PG Management)' },
                { num: '9096398032', label: 'Owner' },
              ].map(({ num, label }) => (
                <div key={num} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    background: 'rgba(192,38,211,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div>
                    <a href={`tel:${num}`} style={{ color: 'white', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#f472b6'}
                      onMouseLeave={e => e.currentTarget.style.color = 'white'}
                    >{num}</a>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────────── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px' }}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0, textAlign: 'center' }}>
              © 2026 HK PG Boys Accommodation · Akurdi, Pune · All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
