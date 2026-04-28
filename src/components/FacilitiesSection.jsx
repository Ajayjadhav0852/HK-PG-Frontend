// Premium Lucide-style stroke icons — consistent 1.5px stroke, gold accent
const GOLD = '#D4AF37'
const ICON_BG = 'rgba(212,175,55,0.10)'
const ICON_BORDER = 'rgba(212,175,55,0.22)'

const facilities = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <rect x="4" y="3" width="16" height="16" rx="2"/>
        <path d="M4 11h16M12 3v8M8 19l-2 2M16 19l2 2M8 15h.01M16 15h.01"/>
      </svg>
    ),
    title: 'Railway Station at Doorstep',
    desc: 'Akurdi Railway Station is a 2-minute walk — easy daily commute.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: '1, 2, 3 & 4 Sharing Rooms',
    desc: 'Well-maintained rooms for every budget — single to quad sharing.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
      </svg>
    ),
    title: 'High-Speed WiFi',
    desc: 'Dedicated broadband for seamless studying and streaming.',
  },
  {
    // RO Water — water drop with filter lines
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M12 2C6 9 4 13 4 16a8 8 0 0 0 16 0c0-3-2-7-8-14z"/>
        <path d="M8 17a4 4 0 0 0 8 0"/>
      </svg>
    ),
    title: 'Filtered RO Water',
    desc: 'Clean, purified drinking water available 24/7 for all residents.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
    title: 'Separate Wardrobe with Locker',
    desc: 'Personal storage with lock for each resident — keep valuables safe.',
  },
  {
    // Washing machine — front-loader circle
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <rect x="2" y="2" width="20" height="20" rx="2"/>
        <circle cx="12" cy="13" r="5"/>
        <circle cx="12" cy="13" r="2"/>
        <line x1="6" y1="6" x2="6.01" y2="6"/>
        <line x1="9" y1="6" x2="9.01" y2="6"/>
      </svg>
    ),
    title: 'Washing Machine',
    desc: 'On-site laundry facility — save time and effort every week.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: '24/7 CCTV Security',
    desc: 'Round-the-clock surveillance ensuring your safety at all times.',
  },
  {
    // Hot water — geyser/flame
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M12 2c0 0-4 4-4 8a4 4 0 0 0 8 0c0-4-4-8-4-8z"/>
        <path d="M12 14v4M9 20h6"/>
      </svg>
    ),
    title: 'Hot Water',
    desc: 'Geyser available — hot water for bathing whenever you need it.',
  },
  {
    // Ventilated rooms — wind/air
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
      </svg>
    ),
    title: 'Fully Ventilated Rooms',
    desc: 'Well-designed rooms with proper airflow for a comfortable stay.',
  },
  {
    // Housekeeping — broom/clean
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M3 21l9-9M12.5 5.5l6 6-9 9H3v-6.5l9.5-8.5z"/>
        <path d="M15 7l3-3 2 2-3 3"/>
      </svg>
    ),
    title: 'Daily Housekeeping',
    desc: 'Professional cleaning staff maintaining spotless common areas daily.',
  },
  {
    // Two-wheeler parking — motorbike/scooter
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <circle cx="5.5" cy="17.5" r="2.5"/>
        <circle cx="18.5" cy="17.5" r="2.5"/>
        <path d="M15 6h2l2 5H8l1-3h4"/>
        <path d="M8 17.5H5.5M18.5 17.5H15l-2-5"/>
        <path d="M10 6V4"/>
      </svg>
    ),
    title: 'Two Wheeler Parking',
    desc: 'Secure on-site parking available for residents with vehicles.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: 'No Brokerage',
    desc: 'Contact the owner directly — zero middlemen, zero extra charges.',
  },
]

export default function FacilitiesSection() {
  return (
    <div
      className="w-full px-6 py-16"
      style={{ background: 'linear-gradient(135deg,#0f0c1a 0%,#1a0533 50%,#0f0c1a 100%)' }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <span className="inline-block text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-4"
            style={{ background: 'rgba(212,175,55,0.12)', color: GOLD, border: '1px solid rgba(212,175,55,0.25)' }}>
            Facilities
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: 'white' }}>
            Everything You Need,{' '}
            <span style={{ color: GOLD }}>Under One Roof</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, maxWidth: 480 }}>
            HK PG is designed for modern student life — study hard, rest well, and stay connected.
          </p>
        </div>

        {/* Premium glassmorphism grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {facilities.map((f) => (
            <div
              key={f.title}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18,
                padding: '22px 20px',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(212,175,55,0.12)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Icon */}
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: ICON_BG,
                border: `1px solid ${ICON_BORDER}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
              }}>
                {f.icon}
              </div>
              <h3 style={{ color: 'rgba(255,255,255,0.92)', fontWeight: 700, fontSize: 15, margin: '0 0 6px' }}>
                {f.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                {f.desc}
              </p>
              {/* Gold accent line */}
              <div style={{
                marginTop: 14, height: 2, borderRadius: 2,
                background: `linear-gradient(90deg,${GOLD},transparent)`,
                width: '35%', opacity: 0.6,
              }} />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
