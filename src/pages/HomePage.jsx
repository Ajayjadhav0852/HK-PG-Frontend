import HeroSection from '../components/HeroSection'
import FooterSection from '../components/FooterSection'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero */}
      <HeroSection onBook={() => navigate('/accommodation')} />

      {/* ✅ FIXED CENTER SECTION (MATCHES SITE THEME) */}
      <div
        id="home"
        className="px-6 py-14 text-center"
        style={{
          background:
            'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto">

          <h2
            className="font-extrabold mb-4"
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              color: '#c026d3',
            }}
          >
                   Comfortable Living for Students & Professionals
          </h2>

          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            HK PG offers clean, secure, and affordable accommodation in Akurdi, Pune.
            With modern amenities, prime location, and a friendly environment,
            we ensure a hassle-free living experience for students and working professionals.
          </p>

          <p className="text-gray-500 mt-3 text-sm md:text-base leading-relaxed">
            Choose from multiple room types based on your budget and lifestyle —
            all designed for comfort, convenience, and safety.
          </p>

        </div>
      </div>

      {/* Footer push */}
      <div className="flex-1" />

      {/* Footer */}
      <FooterSection />
    </div>
  )
}