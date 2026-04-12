const facilities = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'High-Speed WiFi',
    desc: 'Dedicated broadband for seamless studying and streaming.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="11" r="2"/>
      </svg>
    ),
    title: '24/7 CCTV Security',
    desc: 'Round-the-clock surveillance ensuring your safety.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <circle cx="12" cy="12" r="4"/>
        <path d="M2 9h4M18 9h4M2 15h4M18 15h4" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Washing Machine',
    desc: 'Save more time for you.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 2C6 2 2 6 2 12s4 10 10 10 10-4 10-10S18 2 12 2z" strokeLinecap="round"/>
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 16s1-2 4-2 4 2 4 2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'RO Water Purifier',
    desc: 'Clean, filtered drinking water available 24/7.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <rect x="2" y="14" width="20" height="4" rx="1"/>
        <path d="M4 14V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5" strokeLinecap="round"/>
        <path d="M6 18v2M18 18v2" strokeLinecap="round"/>
        <circle cx="9" cy="11" r="1" fill="currentColor"/>
        <circle cx="15" cy="11" r="1" fill="currentColor"/>
      </svg>
    ),
    title: 'Two Wheeler Parking',
    desc: 'Secure on-site parking for residents with vehicles.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M3 6l3 13h12l3-13" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" strokeLinecap="round"/>
        <path d="M9 11l1.5 4M15 11l-1.5 4M12 11v4" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Daily Housekeeping',
    desc: 'Professional cleaning staff maintaining spotless common areas.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'No Brokerage',
    desc: 'Contact the owner directly — zero middlemen, zero extra charges.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 7h.01M12 7h.01M16 7h.01" strokeLinecap="round"/>
      </svg>
    ),
    title: '1, 2, 3 & 4 Sharing Rooms',
    desc: 'Well-maintained rooms for every budget — single to quad sharing available.',
  },
]

export default function FacilitiesSection() {
  return (
    <div
      className="w-full px-6 py-12"
      style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <span className="inline-block bg-pink-100 text-pink-600 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
          Facilities
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: '#c026d3' }}>
          Everything You Need, Under One Roof
        </h2>
        <p className="text-gray-500 text-sm mb-10">
          HKPG is designed for modern student life — study hard, rest well, and stay connected.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
          {facilities.map((f) => (
            <div key={f.title} className="flex flex-col gap-1">
              <div className="text-purple-500 mb-1">{f.icon}</div>
              <h3 className="font-bold text-gray-800 text-base">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
