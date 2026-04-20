import LocationInfo from '../components/LocationInfo'
import RulesPolicies from '../components/RulesPolicies'
import FooterSection from '../components/FooterSection'
import { PhoneIcon, BuildingIcon, WhatsAppIcon, MapIcon, TrainIcon, MapPinIcon, ArrowRightIcon } from '../components/Icons'

export default function ContactPage() {
  return (
    <div
      id="contact"
      className="min-h-screen flex flex-col"
      style={{
        background:
          'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)',
      }}
    >
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 pt-20 pb-10 space-y-8">

        <div className="text-center mb-4">
          <span className="inline-block bg-pink-100 text-pink-600 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
            Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: '#c026d3' }}>
            Get In Touch
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            We're here to help — reach out anytime.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Owner 1 */}
          <a href="tel:9579828996"
            className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
              <PhoneIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Owner</p>
              <p className="font-extrabold text-gray-800 text-lg group-hover:text-pink-600 transition">
                9579828996
              </p>
            </div>
          </a>

          {/* Owner 2 */}
          <a href="tel:9096398032"
            className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
              <PhoneIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Owner</p>
              <p className="font-extrabold text-gray-800 text-lg group-hover:text-pink-600 transition">
                9096398032
              </p>
            </div>
          </a>

          {/* PG Management */}
          <a href="tel:9022481019"
            className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition group sm:col-span-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
              <BuildingIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">PG Management</p>
              <p className="font-extrabold text-gray-800 text-lg group-hover:text-pink-600 transition">
                9022481019
              </p>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919579828996?text=Hi%20I%20want%20to%20book%20a%20room%20in%20HK%20PG"
            target="_blank"
            rel="noreferrer"
            className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition group sm:col-span-2"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white bg-green-500">
              <WhatsAppIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-medium">WhatsApp</p>
              <p className="font-extrabold text-gray-800 text-base group-hover:text-green-600 transition">
                Chat with us on WhatsApp
              </p>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-green-500" />
          </a>

        </div>

        <LocationInfo />

        {/* IT Hubs & Connectivity */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <MapIcon className="w-5 h-5 text-purple-600" />
            <h3 className="font-extrabold text-gray-800 text-base">Well Connected to IT Hubs &amp; Offices</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Hinjewadi IT Park', type: 'office' },
              { label: 'Wakad', type: 'office' },
              { label: 'Pimpri-Chinchwad', type: 'office' },
              { label: 'Akurdi', type: 'office' },
              { label: 'Nigdi', type: 'office' },
              { label: 'Kothrud', type: 'office' },
              { label: 'Baner', type: 'office' },
              { label: 'Aundh', type: 'office' },
              { label: 'Balewadi', type: 'office' },
              { label: 'Pune Railway Station', type: 'train' },
              { label: 'Pimpri Station', type: 'train' },
              { label: 'Akurdi Station', type: 'train' },
            ].map((hub, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-purple-100 transition-all cursor-default">
                {hub.type === 'train'
                  ? <TrainIcon className="w-3.5 h-3.5" />
                  : <BuildingIcon className="w-3.5 h-3.5" />
                }
                {hub.label}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <MapPinIcon className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs text-gray-400">Near Akurdi Railway Station — easy commute to all major IT hubs across Pune &amp; PCMC</p>
          </div>
        </div>

        <RulesPolicies />
      </div>

      <FooterSection />
    </div>
  )
}