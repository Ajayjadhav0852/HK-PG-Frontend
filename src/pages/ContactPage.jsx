import LocationInfo from '../components/LocationInfo'
import RulesPolicies from '../components/RulesPolicies'
import FooterSection from '../components/FooterSection'

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}>
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-10 space-y-8">
        <div className="text-center mb-4">
          <span className="inline-block bg-pink-100 text-pink-600 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
            Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: '#c026d3' }}>
            Get In Touch
          </h2>
          <p className="text-gray-500 text-sm mt-2">We're here to help — reach out anytime.</p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <a href="tel:9579828996"
            className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
              📞
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Owner Direct</p>
              <p className="font-extrabold text-gray-800 text-lg group-hover:text-pink-600 transition">9579828996</p>
            </div>
          </a>

          <a href="tel:9096398032"
            className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
              📞
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Warden Direct</p>
              <p className="font-extrabold text-gray-800 text-lg group-hover:text-pink-600 transition">9096398032</p>
            </div>
          </a>

          <a href="https://wa.me/919579828996" target="_blank" rel="noreferrer"
            className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition group sm:col-span-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-green-500">
              💬
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-medium">WhatsApp</p>
              <p className="font-extrabold text-gray-800 text-base group-hover:text-green-600 transition">Chat with us on WhatsApp</p>
            </div>
            <span className="text-green-500 font-bold text-sm">→</span>
          </a>
        </div>

        <LocationInfo />
        <RulesPolicies />
      </div>
      <FooterSection />
    </div>
  )
}
