import HeroSection from '../components/HeroSection'
import FooterSection from '../components/FooterSection'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero */}
      <HeroSection onBook={() => navigate('/accommodation')} />

      {/* Why Choose Us — compact, below hero */}
      <div
        id="home"
        className="px-6 py-10"
        style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="font-extrabold text-gray-800 mb-2" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            Comfortable Living Near Akurdi Station for{' '}
            <span style={{ color: '#c026d3' }}>Students &amp; Professionals</span>
          </h2>
          <p className="text-gray-500 text-sm">
            Clean, secure, and budget-friendly PG near Akurdi — designed for comfort, study, and convenience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: '📍', title: 'Near CDAC Centers' },
            { icon: '📚', title: 'Study Environment' },
            { icon: '👥', title: 'Group Stay Options' },
            { icon: '🎯', title: 'Placement Focused' },
            { icon: '🚂', title: 'Railway Doorstep' },
            { icon: '🚌', title: 'Bus Stand 50m' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-3 text-center shadow-sm border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all group">
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="font-semibold text-gray-700 text-xs group-hover:text-purple-600 transition-colors leading-tight">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer push */}
      <div className="flex-1" />

      {/* Footer */}
      <FooterSection />
    </div>
  )
}