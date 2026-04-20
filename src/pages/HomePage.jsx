import HeroSection from '../components/HeroSection'
import FooterSection from '../components/FooterSection'
import { useNavigate } from 'react-router-dom'

// ── Why Choose Us data ────────────────────────────────────────────────────────
const WHY_ITEMS = [
  {
    title: 'Railway at Your Doorstep',
    line: 'Akurdi station is a 2-minute walk away.',
    color: '#7c3aed',
    bg: '#f5f3ff',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <rect x="4" y="3" width="16" height="16" rx="2"/>
        <path d="M4 11h16M12 3v8M8 19l-2 2M16 19l2 2M8 15h.01M16 15h.01"/>
      </svg>
    ),
  },
  {
    title: 'Near CDAC & Tech Hubs',
    line: 'Walk to CDAC, Persistent, and Pimpri IT corridor.',
    color: '#2563eb',
    bg: '#eff6ff',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    title: 'Quiet Study Environment',
    line: 'Dedicated study hours. Zero noise policy after 10 PM.',
    color: '#0891b2',
    bg: '#ecfeff',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    title: 'Safe & Secure 24/7',
    line: 'CCTV, secure entry, and trusted management on-site.',
    color: '#16a34a',
    bg: '#f0fdf4',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    title: 'Flexible Group Stays',
    line: 'Single, double, and triple sharing — pick what fits.',
    color: '#d97706',
    bg: '#fffbeb',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    title: 'Zero Brokerage',
    line: 'Direct owner contact. No middlemen, no hidden fees.',
    color: '#be185d',
    bg: '#fdf2f8',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero */}
      <HeroSection onBook={() => navigate('/accommodation')} />

      {/* ── Why Choose Us ─────────────────────────────────────────────────── */}
      <section
        id="home"
        style={{ background: 'linear-gradient(180deg, #fdf4ff 0%, #fff8f0 100%)', padding: '64px 24px' }}
      >
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(192,38,211,0.08)', borderRadius: 100,
              padding: '6px 16px', marginBottom: 16,
              border: '1px solid rgba(192,38,211,0.15)',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#c026d3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
                <path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75z"/>
                <path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75z"/>
              </svg>
              <span style={{ color: '#c026d3', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em' }}>WHY CHOOSE US</span>
            </div>

            <h2 style={{
              fontWeight: 900, color: '#111827', margin: '0 0 12px',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', lineHeight: 1.2,
            }}>
              Your Home Away From Home,{' '}
              <span style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Done Right
              </span>
            </h2>
            <p style={{ color: '#6b7280', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
              Everything a student or professional needs — location, safety, comfort, and community.
            </p>
          </div>

          {/* Cards grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {WHY_ITEMS.map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'white',
                  borderRadius: 20,
                  padding: '24px 22px',
                  border: `1px solid ${item.color}22`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = `0 12px 32px ${item.color}22`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: item.bg,
                  color: item.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  {item.icon}
                </div>

                {/* Title */}
                <h3 style={{ fontWeight: 800, color: '#111827', fontSize: 16, margin: '0 0 6px' }}>
                  {item.title}
                </h3>

                {/* Impact line */}
                <p style={{ color: '#6b7280', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                  {item.line}
                </p>

                {/* Bottom accent */}
                <div style={{
                  marginTop: 16, height: 3, borderRadius: 3,
                  background: `linear-gradient(90deg, ${item.color}, ${item.color}44)`,
                  width: '40%',
                }} />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <button
              onClick={() => navigate('/accommodation')}
              style={{
                padding: '14px 36px',
                background: 'linear-gradient(135deg,#d63384,#c026d3)',
                color: 'white', border: 'none', borderRadius: 14,
                fontWeight: 800, fontSize: 15, cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(208,35,132,0.35)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(208,35,132,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(208,35,132,0.35)' }}
            >
              View Available Rooms →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </div>
  )
}
