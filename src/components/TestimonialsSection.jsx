const reviews = [
  {
    name: 'Arjun M.',
    role: 'Engineering Student',
    rating: 5,
    text: '"HKPG has been a game-changer for my college life. The WiFi is fast, and I\'ve made lifelong friends here. Highly recommend the 2-sharing room!"',
  },
  {
    name: 'Rohan K.',
    role: 'MBA Intern',
    rating: 5,
    text: '"Clean, safe, and well-managed. The location is perfect — close to my office and the metro. The staff is responsive and the community is genuinely welcoming."',
  },
  {
    name: 'Vikram S.',
    role: 'Final Year Student',
    rating: 5,
    text: '"Best PG I\'ve stayed at in the city. The security, and the study environment are all top-notch. Worth every rupee."',
  },
  {
    name: 'Sahil P.',
    role: 'IT Professional',
    rating: 4,
    text: '"Great value for money. The rooms are spacious, housekeeping is regular, and the owner is very cooperative. Highly recommended!"',
  },
  {
    name: 'Nikhil R.',
    role: 'B.Com Student',
    rating: 5,
    text: '"Peaceful environment, no disturbances. Power backup is a lifesaver during exams. Feels like home away from home."',
  },
  {
    name: 'Karan T.',
    role: 'Working Professional',
    rating: 5,
    text: '"No brokerage, direct owner contact — that alone saved me a lot. Transparent pricing, zero hidden charges. 10/10 would recommend."',
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
              <p className="text-xs text-gray-400 mt-0.5">Based on 128 reviews</p>
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
