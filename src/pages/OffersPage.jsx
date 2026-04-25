import { useNavigate } from 'react-router-dom'
import FooterSection from '../components/FooterSection'

// ── Inline SVG icons (Heroicons MIT) ─────────────────────────────────────────
const RocketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" style={{display:'inline',verticalAlign:'middle',marginRight:6}}>
    <path d="M4.5 16.5c-1.5 1-1.5 2.5 0 3.5 1.5 1 3.5.5 4.5-1l6-10.5c1-1.5.5-3.5-1-4.5s-3.5-.5-4.5 1z"/><path d="M12 2l2 2-2 2-2-2z"/>
  </svg>
)
const PhoneCallIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" style={{display:'inline',verticalAlign:'middle',marginRight:6}}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)
const WAIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{display:'inline',verticalAlign:'middle',marginRight:6}}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.198-1.448A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.214-3.68.859.875-3.593-.234-.369A9.818 9.818 0 1 1 12 21.818z"/>
  </svg>
)
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{display:'inline',verticalAlign:'middle',marginRight:6,flexShrink:0}}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" style={{display:'inline',verticalAlign:'middle',marginRight:6}}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

const PHONE = '9579828996'
const WA_LINK = `https://wa.me/91${PHONE}?text=${encodeURIComponent('Hi! I am interested in booking a room at HK PG Akurdi.')}`

function useBookNow() {
  const navigate = useNavigate()
  return () => { navigate('/accommodation'); window.scrollTo({ top: 0, behavior: 'instant' }) }
}

export default function OffersPage() {
  const bookNow = useBookNow()

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO — Sharp, urgent, CDAC-first
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="relative w-full bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              CDAC STUDENT SPECIAL
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Built by a{' '}
            <span className="text-yellow-300">CDAC student</span>,<br />
            for{' '}
            <span className="text-pink-400">CDAC students</span>
          </h1>

          {/* Value props */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              'Save 2–3 hours daily travel',
              'Focus only on study & placement',
              'Quiet + study-friendly environment',
            ].map((v, i) => (
              <span key={i} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-semibold px-4 py-2 rounded-full">
                <CheckIcon />{v}
              </span>
            ))}
          </div>

          {/* Urgency */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 bg-red-500/80 text-white text-sm font-bold px-5 py-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Limited beds available — Book fast!
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={bookNow}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold rounded-2xl hover:opacity-90 transition-all transform hover:scale-105 shadow-2xl text-base inline-flex items-center justify-center">
             🚀Book Your Seat Now
            </button>
            <a href={`tel:${PHONE}`}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 transition-all text-base text-center inline-flex items-center justify-center">
              <PhoneCallIcon />Call Now
            </a>
          </div>
        </div>
      </div>
      {/* ══════════════════════════════════════════════════════════════════════
          MARQUEE BAR — faster on mobile, responsive
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="w-full overflow-hidden bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 py-2.5">
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee 8s linear infinite' }}>
          {[...Array(4)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-4 text-white font-bold text-xs sm:text-sm px-6">
              <span>⭐ Built by a CDAC student, for CDAC students</span>
              <span className="opacity-50">•</span>
              <span>🚀 Your 6 months matter – we support your placement journey</span>
              <span className="opacity-50">•</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Near IACSD CDAC Center · KnowIT Deccan · IET Center</span>
              <span className="opacity-50">•</span>
              <span>🏠 Newly Opened PG · Prime Location · Akurdi, Pune</span>
              <span className="opacity-50">•</span>
              <span>👥 Group Stay Available · 3-4 Friends Together</span>
              <span className="opacity-50">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3. CDAC MAIN OFFER — Level 1 Big Card (full-width hero card)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
              🥇 FEATURED OFFER
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
              CDAC <span className="text-blue-600">Success Package</span>
            </h2>
          </div>

          {/* BIG HERO CARD */}
          <div className="relative bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 rounded-3xl p-8 sm:p-10 text-white shadow-2xl overflow-hidden group hover:shadow-[0_0_60px_rgba(139,92,246,0.4)] transition-all duration-500 border-2 border-purple-400/30">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4" />
            </div>

            <div className="relative z-10">
              {/* Badge + title */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-extrabold px-3 py-1 rounded-full">CDAC SPECIAL</span>
                <span className="bg-red-500/80 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">Limited Beds</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold mb-2">🎯 CDAC Success Package</h3>
              <p className="text-white/80 text-base mb-6">Designed for success — everything a CDAC student needs</p>

              {/* Features grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {[
                  '✅ 6-month flexible stay plan',
                  '✅ Pre-CAT & PGDAC placement material support',
                  '✅ Quiet, distraction-free,well ventilated rooms',
                  '✅ Near IACSD CDAC Center ',
                  '✅ Easy travel to KnowIT Deccan & IET Center',
                  '✅ Railway at doorstep,Bus stand 50m away',
                  '✅ Group stay option (3-4 friends together)',
                  '✅ No long lock-in period',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 text-sm font-medium">
                    {f}
                  </div>
                ))}
              </div>

              {/* Highlight + CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <div>
                  <p className="font-extrabold text-lg">👉 Designed for Placement Success</p>
                  <p className="text-white/70 text-sm">"Your 6 months matter – we support your placement journey"</p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
              <button onClick={bookNow}
                className="px-6 py-3 bg-white text-purple-700 font-extrabold rounded-xl hover:bg-yellow-300 hover:text-purple-900 transition-all transform hover:scale-105 shadow-lg text-sm inline-flex items-center">
               🚀Book Now
              </button>
              <a href={WA_LINK} target="_blank" rel="noreferrer"
                className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-all text-sm inline-flex items-center">
                <WAIcon />WhatsApp
              </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          4. CDAC OTHER OFFERS — Level 2 Medium Cards
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="py-10 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
              🥈 CDAC OFFERS
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">More CDAC Benefits</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Group Offer */}
            <div className="relative bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-1 transition-all duration-300 border border-green-400/30 overflow-hidden group">
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
              <span className="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-3">GROUP SPECIAL</span>
              <h3 className="text-xl font-extrabold mb-2">👥 CDAC Group Offer</h3>
              <p className="text-white/80 text-sm mb-4">Come with 3-4 friends — stay together, study together</p>
              <div className="space-y-2 mb-5">
                {['Stay together guarantee', 'Group discount available', 'Same room allocation'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm"><span className="text-green-300">✓</span>{f}</div>
                ))}
              </div>
              <button onClick={bookNow}
                className="w-full py-2.5 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-all text-sm">
                🚀 Book Now
              </button>
            </div>

            {/* Placement Material */}
            <div className="relative bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:-translate-y-1 transition-all duration-300 border border-indigo-400/30 overflow-hidden group">
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
              <span className="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-3">STUDY SUPPORT</span>
              <h3 className="text-xl font-extrabold mb-2">📚 Placement Material Support</h3>
              <p className="text-white/80 text-sm mb-4">Get the edge you need for CDAC placement</p>
              <div className="space-y-2 mb-5">
                {['Pre-CAT material support', 'PGDAC placement resources', 'Silent study environment', 'Placement-focused atmosphere'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm"><span className="text-blue-300">✓</span>{f}</div>
                ))}
              </div>
              <button onClick={bookNow}
                className="w-full py-2.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all text-sm">
                🚀 Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          5. STUDENT OFFERS — Level 2 Medium Cards
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="py-10 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block bg-pink-100 text-pink-600 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
              🥈 STUDENT OFFERS
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
              For <span className="text-pink-600">Degree Students</span>
            </h2>
            <p className="text-gray-500 text-sm mt-2">DY Patil · PCCOE · PCET · and all colleges</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Annual Saver */}
            <div className="relative bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:-translate-y-1 transition-all duration-300 border border-pink-400/30 overflow-hidden flex flex-col">
              <span className="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-3 w-fit">BEST VALUE</span>
              <h3 className="text-lg font-extrabold mb-1">🎉 Annual Saver Plan</h3>
              <p className="text-white/80 text-xs mb-3">Stay 12 months, pay ONLY for 11</p>
              <div className="space-y-1.5 mb-4 flex-1">
                {['Save 1 month rent annually', 'Fixed rent for full year', 'Long-term stability'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs"><span className="text-pink-300">✓</span>{f}</div>
                ))}
              </div>
              <button onClick={bookNow}
                className="w-full py-2 bg-white text-pink-700 font-bold rounded-xl hover:bg-pink-50 transition-all text-xs mt-auto">
                🚀 Book Now
              </button>
            </div>

            {/* College Special */}
            <div className="relative bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:-translate-y-1 transition-all duration-300 border border-violet-400/30 overflow-hidden flex flex-col">
              <span className="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-3 w-fit">COLLEGE SPECIAL</span>
              <h3 className="text-lg font-extrabold mb-1">🏫 College Student Special</h3>
              <p className="text-white/80 text-xs mb-3">DY Patil · PCCOE · PCET students</p>
              <div className="space-y-1.5 mb-4 flex-1">
                {['Safe & comfortable living', 'Long-term stay (1-4 years)', 'Study-focused atmosphere'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs"><span className="text-violet-300">✓</span>{f}</div>
                ))}
              </div>
              <button onClick={bookNow}
                className="w-full py-2 bg-white text-violet-700 font-bold rounded-xl hover:bg-violet-50 transition-all text-xs mt-auto">
                🚀 Book Now
              </button>
            </div>

            {/* Refer & Earn */}
            <div className="relative bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:-translate-y-1 transition-all duration-300 border border-orange-400/30 overflow-hidden flex flex-col">
              <span className="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-3 w-fit">EARN MONEY</span>
              <h3 className="text-lg font-extrabold mb-1">👥 Refer & Earn ₹500</h3>
              <p className="text-white/80 text-xs mb-3">After 2 months of stay</p>
              <div className="space-y-1.5 mb-4 flex-1">
                {['Refer friends to HK PG', '₹500 per successful referral', 'No limit on referrals'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs"><span className="text-orange-300">✓</span>{f}</div>
                ))}
              </div>
              <button onClick={bookNow}
                className="w-full py-2 bg-white text-orange-700 font-bold rounded-xl hover:bg-orange-50 transition-all text-xs mt-auto">
                🚀 Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          5.5 WORKING PROFESSIONALS — IT / Employees across Pune & PCMC
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="py-12 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block bg-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4">
              💼 WORKING PROFESSIONALS
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
              Perfect for <span className="text-blue-600">IT Employees</span> &{' '}
              <span className="text-cyan-600">Professionals</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              Serving professionals across Pune &amp; PCMC — Hinjewadi · Wakad · Pimpri · Chinchwad · Nigdi · Kothrud · Baner · Balewadi IT Park
            </p>
          </div>

          {/* Main pro card */}
          <div className="relative bg-gradient-to-br from-blue-700 via-cyan-700 to-teal-700 rounded-3xl p-7 sm:p-9 shadow-2xl overflow-hidden border border-blue-400/30 hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] transition-all duration-500">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-extrabold px-3 py-1 rounded-full">💼 PRO PACKAGE</span>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">Pune &amp; PCMC</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">🏢 Working Professional Package</h3>
              <p className="text-white/80 text-sm mb-6">Comfortable, affordable living for IT employees &amp; professionals across Pune PCMC</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                {[
                  '✅ Near Akurdi Railway Station — easy commute',
                  '✅ Bus stand 50m — Hinjewadi, Wakad, Pimpri routes',
                  '✅ High-speed WiFi for remote work',
                  '✅ 24/7 CCTV security & safe environment',
                  '✅ Washing machine, RO water',
                  '✅ Flexible stay — monthly, 3-month, 6-month plans',
                  '✅ No brokerage — direct owner contact',
                  '✅ Fixed rent — no surprise charges',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 text-sm font-medium text-white">
                    {f}
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <div>
                  <p className="font-extrabold text-lg text-white">👉 Comfortable stay for your professional life</p>
                  <p className="text-white/70 text-sm">Affordable · Secure · Well-connected to all IT hubs</p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button onClick={bookNow}
                    className="px-6 py-3 bg-white text-blue-700 font-extrabold rounded-xl hover:bg-yellow-300 hover:text-blue-900 transition-all transform hover:scale-105 shadow-lg text-sm">
                    🚀 Book Now
                  </button>
                  <a href={WA_LINK} target="_blank" rel="noreferrer"
                    className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-all text-sm inline-flex items-center gap-2">
                    <WAIcon />WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div> 

      {/* ══════════════════════════════════════════════════════════════════════
          7. FINAL CTA — Strong close
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="py-14 px-4 sm:px-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
            🚀 Book Your Room Now
          </h2>
          <p className="text-white/70 text-base mb-6">
            Limited beds available · Fast booking · No brokerage · Direct owner contact
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['✔ Limited beds', '✔ Fast booking', '✔ No brokerage', '✔ Direct owner'].map((v, i) => (
              <span key={i} className="bg-white/10 border border-white/20 text-white/90 text-sm font-semibold px-4 py-1.5 rounded-full">
                {v}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={bookNow}
              className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold rounded-2xl hover:opacity-90 transition-all transform hover:scale-105 shadow-2xl text-base"
            >
              View Available Rooms
            </button>
            <a href={`tel:${PHONE}`}
              className="px-10 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 transition-all text-base text-center inline-flex items-center justify-center gap-2">
              <PhoneCallIcon />Call Now
            </a>
            <a href={WA_LINK} target="_blank" rel="noreferrer"
              className="px-10 py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-400 transition-all text-base text-center inline-flex items-center justify-center gap-2">
              <WAIcon />WhatsApp
            </a>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  )
}

