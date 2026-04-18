const reviews = [
  {
    name: 'Aniket Patil',
    role: 'CDAC Student, IACSD',
    rating: 5,
    date: 'December 2025',
    text: '"Just moved in 3 months ago when HK PG opened. Perfect location near CDAC center - saves me 30 minutes daily commute. Owner is very supportive and understands student needs."',
  },
  {
    name: 'Rohit Deshmukh',
    role: 'DY Patil Engineering Student',
    rating: 5,
    date: 'January 2026',
    text: '"Best decision to choose HK PG! Being newly opened, everything is fresh and clean. The 2-sharing room is spacious and the study environment is excellent for engineering students."',
  },
  {
    name: 'Prashant Jadhav',
    role: 'Working Professional, Hinjewadi',
    rating: 4,
    date: 'November 2025',
    text: '"Great value for money in Akurdi area. Railway station is just walking distance which makes my office commute to Hinjewadi very convenient. Housekeeping is regular and rooms are well-maintained."',
  },
  {
    name: 'Saurabh Kulkarni',
    role: 'PCCOE Student',
    rating: 5,
    date: 'February 2026',
    text: '"HK PG is perfect for college students. The owner understands our schedule and allows flexible in-out timings. WiFi speed is excellent for online classes and the security is top-notch."',
  },
]

export default function TestimonialsSection() {
  return (
    <div
      className="w-full px-6 py-12"
      style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <span className="inline-block bg-pink-100 text-pink-600 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
          Testimonials
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: '#c026d3' }}>
          What Residents Say
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Don't just take our word for it — hear from the students and professionals who call HKPG home.
        </p>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col gap-3 relative"
            >
              {/* Opening quote */}
              <span className="absolute -top-3 left-4 text-5xl font-serif leading-none"
                style={{ color: '#c026d3', opacity: 0.25 }}>
                "
              </span>

              {/* Stars + name */}
              <div className="flex items-start gap-3 pt-2">
                {/* Avatar circle */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < r.rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                    ))}
                  </div>
                  <p className="font-extrabold text-gray-800 text-sm leading-tight">{r.name}</p>
                  <p className="text-xs text-gray-400">— {r.role}</p>
                  <p className="text-xs text-pink-600 font-semibold">{r.date}</p>
                </div>
              </div>

              {/* Review text */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1">{r.text}</p>

              {/* Closing quote */}
              <span className="self-end text-5xl font-serif leading-none -mb-3"
                style={{ color: '#c026d3', opacity: 0.25 }}>
                "
              </span>
            </div>
          ))}
        </div>

        {/* Overall rating bar */}
        <div className="mt-8 bg-white rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-5xl font-extrabold" style={{ color: '#c026d3' }}>4.8</span>
            <div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Based on recent reviews from residents</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            {['Cleanliness', 'Location', 'Value', 'Security'].map(label => (
              <span key={label} className="bg-pink-50 text-pink-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                ✅ {label}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
